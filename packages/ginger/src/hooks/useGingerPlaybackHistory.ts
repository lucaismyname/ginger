import { useCallback, useEffect, useRef, useState } from "react";
import { useGingerPlayback } from "../context/GingerSplitContexts";
import type { Track } from "../types";

export type GingerPlaybackHistoryEntry = {
  track: Track;
  /** The track's index in the queue at the time it was played. */
  index: number;
  /** Unix timestamp (ms) when the track started playing. */
  playedAt: number;
};

export type UseGingerPlaybackHistoryOptions = {
  /** Maximum number of entries to keep. Oldest entries are dropped first. Default: 50. */
  maxLength?: number;
};

export type UseGingerPlaybackHistoryResult = {
  /** Chronological list of played tracks; most recent entry is last. */
  history: GingerPlaybackHistoryEntry[];
  clearHistory: () => void;
};

/**
 * Records a history of played tracks in chronological order.
 * Useful for "what was playing before" in shuffle mode or for analytics.
 *
 * The history is stored in component state and does not survive remounts.
 * In shuffle mode, `index` reflects the position in the current shuffled queue.
 */
export function useGingerPlaybackHistory(
  options: UseGingerPlaybackHistoryOptions = {},
): UseGingerPlaybackHistoryResult {
  const { maxLength = 50 } = options;
  const { tracks, currentIndex } = useGingerPlayback();

  const [history, setHistory] = useState<GingerPlaybackHistoryEntry[]>([]);
  const prevIndexRef = useRef<number | null>(null);
  const prevTracksRef = useRef(tracks);
  prevTracksRef.current = tracks;

  useEffect(() => {
    const track = tracks[currentIndex];
    if (!track) return;

    if (prevIndexRef.current === currentIndex) return;
    prevIndexRef.current = currentIndex;

    const entry: GingerPlaybackHistoryEntry = {
      track,
      index: currentIndex,
      playedAt: Date.now(),
    };

    setHistory((prev) => {
      const next = [...prev, entry];
      return next.length > maxLength ? next.slice(next.length - maxLength) : next;
    });
  }, [currentIndex, tracks, maxLength]);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, clearHistory };
}
