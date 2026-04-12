/**
 * One MediaElementAudioSourceNode per HTMLAudioElement; multiple AnalyserNodes may tap the source.
 * An optional processing chain (e.g. EQ filters) can be inserted between the source and the
 * analysers via `setProcessingChain`.
 */

export type LiveAnalyserOptions = {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
};

type Consumer = {
  analyser: AnalyserNode;
};

type ElementEntry = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  consumers: Map<number, Consumer>;
  nextId: number;
  /** Ordered processing nodes (e.g. BiquadFilterNode[]) inserted between source and analysers. */
  processingChain: AudioNode[];
  /** True while a processing chain is installed; prevents context teardown when no consumers exist. */
  processingActive: boolean;
};

const entries = new WeakMap<HTMLAudioElement, ElementEntry>();

function clampFftSize(n: number): number {
  const p = 2 ** Math.round(Math.log2(n));
  return Math.min(32768, Math.max(32, p));
}

function getChainTail(entry: ElementEntry): AudioNode {
  const { processingChain } = entry;
  return processingChain.length > 0 ? processingChain[processingChain.length - 1]! : entry.source;
}

/**
 * Rebuild all graph connections from scratch.
 * Call after any structural change (add/remove consumer, change processing chain).
 */
function rebuildGraph(entry: ElementEntry): void {
  const { source, processingChain, consumers, context } = entry;

  // Disconnect source outputs
  try {
    source.disconnect();
  } catch {
    // ignore
  }

  // Disconnect processing chain node outputs
  for (const node of processingChain) {
    try {
      node.disconnect();
    } catch {
      // ignore
    }
  }

  // Disconnect all analysers from destination (we will reconnect selectively below)
  for (const { analyser } of consumers.values()) {
    try {
      analyser.disconnect(context.destination);
    } catch {
      // ignore
    }
  }

  // Build processing chain: source → node[0] → ... → node[N]
  if (processingChain.length > 0) {
    source.connect(processingChain[0]!);
    for (let i = 0; i < processingChain.length - 1; i++) {
      processingChain[i]!.connect(processingChain[i + 1]!);
    }
  }

  const tail = getChainTail(entry);

  if (consumers.size === 0) {
    // No analyser consumers: route tail directly to destination so audio is audible
    tail.connect(context.destination);
  } else {
    // Connect tail to all analysers; first one routes to destination (playback sink)
    let isFirst = true;
    for (const { analyser } of consumers.values()) {
      tail.connect(analyser);
      if (isFirst) {
        analyser.connect(context.destination);
        isFirst = false;
      }
    }
  }
}

function getOrCreateEntry(element: HTMLAudioElement): ElementEntry {
  let entry = entries.get(element);
  if (!entry) {
    const Context =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) {
      throw new Error("Web Audio API is not available");
    }
    const context = new Context();
    const source = context.createMediaElementSource(element);
    entry = {
      context,
      source,
      consumers: new Map(),
      nextId: 0,
      processingChain: [],
      processingActive: false,
    };
    entries.set(element, entry);
  }
  return entry;
}

function maybeCloseEntry(element: HTMLAudioElement, entry: ElementEntry): void {
  if (entry.consumers.size === 0 && !entry.processingActive) {
    try {
      entry.source.disconnect();
    } catch {
      // ignore
    }
    void entry.context.close();
    entries.delete(element);
  }
}

export function attachLiveAnalyser(
  element: HTMLAudioElement,
  options: LiveAnalyserOptions,
): { id: number; context: AudioContext; analyser: AnalyserNode } {
  const entry = getOrCreateEntry(element);
  const { context } = entry;

  const analyser = context.createAnalyser();
  analyser.fftSize = clampFftSize(options.fftSize);
  analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  analyser.minDecibels = options.minDecibels;
  analyser.maxDecibels = options.maxDecibels;

  const id = entry.nextId;
  entry.nextId += 1;
  entry.consumers.set(id, { analyser });

  rebuildGraph(entry);

  return { id, context, analyser };
}

export function detachLiveAnalyser(element: HTMLAudioElement, id: number): void {
  const entry = entries.get(element);
  if (!entry) return;

  const consumer = entry.consumers.get(id);
  if (!consumer) return;

  try {
    consumer.analyser.disconnect();
  } catch {
    // ignore
  }
  entry.consumers.delete(id);

  if (entry.consumers.size === 0 && !entry.processingActive) {
    maybeCloseEntry(element, entry);
    return;
  }

  rebuildGraph(entry);
}

/**
 * Insert an ordered processing chain (e.g. BiquadFilterNode[]) between the audio source and the
 * analyser consumers. Pass an empty array to clear the chain.
 *
 * Safe to call while analyser consumers are active; the graph is rebuilt immediately.
 * Note: because `createMediaElementSource` can only be called once per element, the EQ and live
 * analyser share the same AudioContext. Calling both for the same element is supported.
 */
export function setProcessingChain(element: HTMLAudioElement, nodes: AudioNode[]): void {
  if (typeof window === "undefined") return;

  if (nodes.length === 0) {
    const entry = entries.get(element);
    if (!entry) return;
    entry.processingChain = [];
    entry.processingActive = false;
    if (entry.consumers.size === 0) {
      maybeCloseEntry(element, entry);
    } else {
      rebuildGraph(entry);
    }
    return;
  }

  const entry = getOrCreateEntry(element);
  entry.processingChain = nodes;
  entry.processingActive = true;
  rebuildGraph(entry);
}
