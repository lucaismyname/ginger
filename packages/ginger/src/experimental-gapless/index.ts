import { useMemo } from "react";
import { useGingerPlayback } from "../context/GingerSplitContexts";
import { type GaplessCapabilityResult, probeGaplessCapability } from "./probeGaplessCapability";

export type { GaplessCapabilityResult, GaplessHints } from "./probeGaplessCapability";
export { probeGaplessCapability } from "./probeGaplessCapability";

export type ExperimentalGaplessState = GaplessCapabilityResult & {
  /**
   * Ginger does not yet implement gapless scheduling; playback always uses
   * the usual `Ginger.Player` + `<audio>` pipeline.
   */
  gingerGaplessPlayback: false;
  /** Track identifiers for prefetch / experimentation (id, else file URL). */
  preloadedTrackIds: string[];
};

/**
 * Reports **environment** capability for a future gapless decode path plus queue ids.
 * Does not change Ginger playback behavior.
 */
export function useExperimentalGapless(): ExperimentalGaplessState {
  const { tracks } = useGingerPlayback();
  return useMemo(() => {
    const probe = probeGaplessCapability();
    return {
      ...probe,
      gingerGaplessPlayback: false as const,
      preloadedTrackIds: tracks.map((track) => track.id ?? track.fileUrl),
    };
  }, [tracks]);
}
