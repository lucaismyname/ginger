/** One MediaElementAudioSourceNode per HTMLAudioElement; multiple AnalyserNodes may tap the source. */

export type LiveAnalyserOptions = {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
};

type Consumer = {
  analyser: AnalyserNode;
  /** This analyser is wired to `audioContext.destination` so the graph is audible. */
  isPlaybackSink: boolean;
};

type ElementEntry = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  consumers: Map<number, Consumer>;
  nextId: number;
};

const entries = new WeakMap<HTMLAudioElement, ElementEntry>();

function clampFftSize(n: number): number {
  const p = 2 ** Math.round(Math.log2(n));
  return Math.min(32768, Math.max(32, p));
}

export function attachLiveAnalyser(
  element: HTMLAudioElement,
  options: LiveAnalyserOptions,
): { id: number; context: AudioContext; analyser: AnalyserNode } {
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
    entry = { context, source, consumers: new Map(), nextId: 0 };
    entries.set(element, entry);
  }

  const { context, source } = entry;
  const analyser = context.createAnalyser();
  analyser.fftSize = clampFftSize(options.fftSize);
  analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  analyser.minDecibels = options.minDecibels;
  analyser.maxDecibels = options.maxDecibels;

  source.connect(analyser);

  const isFirst = entry.consumers.size === 0;
  if (isFirst) {
    analyser.connect(context.destination);
  }

  const id = entry.nextId;
  entry.nextId += 1;
  entry.consumers.set(id, { analyser, isPlaybackSink: isFirst });

  return { id, context, analyser };
}

export function detachLiveAnalyser(element: HTMLAudioElement, id: number): void {
  const entry = entries.get(element);
  if (!entry) return;

  const consumer = entry.consumers.get(id);
  if (!consumer) return;

  const { analyser, isPlaybackSink } = consumer;
  analyser.disconnect();
  entry.consumers.delete(id);

  if (entry.consumers.size === 0) {
    try {
      entry.source.disconnect();
    } catch {
      // ignore
    }
    void entry.context.close();
    entries.delete(element);
    return;
  }

  if (isPlaybackSink) {
    const first = entry.consumers.values().next().value as Consumer | undefined;
    if (first) {
      first.analyser.connect(entry.context.destination);
      first.isPlaybackSink = true;
    }
  }
}
