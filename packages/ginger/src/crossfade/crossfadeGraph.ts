/**
 * Web Audio graph management for crossfade transitions.
 *
 * Creates a shared `AudioContext` that routes both the outgoing and incoming
 * `HTMLAudioElement` through individual `GainNode`s into the same destination.
 * Scheduling the gain ramps on both nodes produces the crossfade effect.
 *
 * **Compatibility note:** because the browser only permits one
 * `MediaElementAudioSourceNode` per `HTMLAudioElement`, this module is
 * incompatible with `liveAudioGraph`-based features (`useGingerEqualizer`,
 * `useGingerLiveAnalyzer`) on the same element. Using both simultaneously will
 * throw a `DOMException` when the second source node is requested.
 */

export type CrossfadeCurve = "linear" | "equal-power";

export type CrossfadeGraph = {
  context: AudioContext;
  outGain: GainNode;
  inGain: GainNode;
  outSource: MediaElementAudioSourceNode;
  inSource: MediaElementAudioSourceNode;
};

const EQUAL_POWER_CURVE_LENGTH = 256;

function buildEqualPowerCurves(): { outCurve: Float32Array; inCurve: Float32Array } {
  const outCurve = new Float32Array(EQUAL_POWER_CURVE_LENGTH);
  const inCurve = new Float32Array(EQUAL_POWER_CURVE_LENGTH);
  for (let i = 0; i < EQUAL_POWER_CURVE_LENGTH; i++) {
    const t = i / (EQUAL_POWER_CURVE_LENGTH - 1);
    outCurve[i] = Math.cos(t * (Math.PI / 2));
    inCurve[i] = Math.sin(t * (Math.PI / 2));
  }
  return { outCurve, inCurve };
}

function getAudioContextCtor(): (new (options?: AudioContextOptions) => AudioContext) | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

/**
 * Creates a shared `AudioContext` and connects both the outgoing and incoming
 * audio elements to it via individual `GainNode`s.
 *
 * The outgoing gain starts at 1, the incoming gain starts at 0.
 * Call `scheduleCrossfade` immediately after to begin the ramps.
 *
 * @throws `DOMException` if either element already has a `MediaElementAudioSourceNode`
 *         in another context (e.g. created by `liveAudioGraph`).
 * @throws `Error` if the Web Audio API is unavailable in this environment.
 */
export function attachCrossfadeGraph(
  outgoing: HTMLAudioElement,
  incoming: HTMLAudioElement,
): CrossfadeGraph {
  const Ctor = getAudioContextCtor();
  if (!Ctor) {
    throw new Error(
      "[@lucaismyname/ginger/crossfade] Web Audio API is not available in this environment.",
    );
  }

  const context = new Ctor();

  const outSource = context.createMediaElementSource(outgoing);
  const inSource = context.createMediaElementSource(incoming);

  const outGain = context.createGain();
  const inGain = context.createGain();

  outGain.gain.value = 1;
  inGain.gain.value = 0;

  outSource.connect(outGain);
  outGain.connect(context.destination);

  inSource.connect(inGain);
  inGain.connect(context.destination);

  return { context, outGain, inGain, outSource, inSource };
}

/**
 * Schedules gain ramps on both gain nodes so that `outGain` fades from 1 → 0
 * and `inGain` fades from 0 → 1 over `durationSec` seconds starting immediately.
 *
 * For `"equal-power"`, a cosine/sine curve is applied via `setValueCurveAtTime`
 * to maintain consistent perceived loudness throughout the transition.
 */
export function scheduleCrossfade(
  graph: CrossfadeGraph,
  durationSec: number,
  curve: CrossfadeCurve,
): void {
  const { context, outGain, inGain } = graph;
  const startTime = context.currentTime;
  const endTime = startTime + durationSec;

  if (curve === "equal-power") {
    const { outCurve, inCurve } = buildEqualPowerCurves();
    outGain.gain.setValueCurveAtTime(outCurve, startTime, durationSec);
    inGain.gain.setValueCurveAtTime(inCurve, startTime, durationSec);
  } else {
    outGain.gain.setValueAtTime(1, startTime);
    outGain.gain.linearRampToValueAtTime(0, endTime);
    inGain.gain.setValueAtTime(0, startTime);
    inGain.gain.linearRampToValueAtTime(1, endTime);
  }
}

/**
 * Disconnects all nodes and closes the `AudioContext`.
 * Safe to call multiple times; errors during disconnect are silently ignored.
 */
export function teardownCrossfadeGraph(graph: CrossfadeGraph): void {
  const nodes: AudioNode[] = [graph.outSource, graph.inSource, graph.outGain, graph.inGain];
  for (const node of nodes) {
    try {
      node.disconnect();
    } catch {
      // ignore
    }
  }
  void graph.context.close();
}
