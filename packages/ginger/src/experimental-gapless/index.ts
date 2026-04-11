import { useMemo } from "react";
import { useGingerPlayback } from "../context/GingerSplitContexts";

export type ExperimentalGaplessState = {
  supported: false;
  reason: string;
  preloadedTrackIds: string[];
};

/**
 * Experimental-only helper surface.
 *
 * @deprecated This export is intentionally non-production and currently reports capabilities only.
 * It does not alter Ginger playback behavior.
 */
export function useExperimentalGapless(): ExperimentalGaplessState {
  const { tracks } = useGingerPlayback();
  return useMemo(
    () => ({
      supported: false as const,
      reason: "Gapless playback requires dedicated Web Audio graph orchestration.",
      preloadedTrackIds: tracks.map((track) => track.id ?? track.fileUrl),
    }),
    [tracks],
  );
}
