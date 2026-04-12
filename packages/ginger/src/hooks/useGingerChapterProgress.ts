import { useMemo } from "react";
import { useGingerMedia, useGingerPlayback } from "../context/GingerSplitContexts";

export type GingerChapterProgress = {
  /** Fraction (0–1) of the way through the active chapter. 0 when no chapter is active. */
  progress: number;
  /** Seconds elapsed since the start of the active chapter. */
  elapsed: number;
  /** Seconds remaining until the end of the active chapter (or until end of track if last chapter). */
  remaining: number;
};

/**
 * Returns detailed progress information for the currently active chapter.
 * Complements `useGingerChapters` with per-chapter playback fractions.
 */
export function useGingerChapterProgress(): GingerChapterProgress {
  const { tracks, currentIndex } = useGingerPlayback();
  const { currentTime, duration } = useGingerMedia();

  const chapters = useMemo(() => {
    const raw = tracks[currentIndex]?.chapters ?? [];
    return [...raw]
      .filter((c) => c && Number.isFinite(c.startSeconds) && c.startSeconds >= 0)
      .sort((a, b) => a.startSeconds - b.startSeconds);
  }, [tracks, currentIndex]);

  return useMemo<GingerChapterProgress>(() => {
    if (chapters.length === 0) return { progress: 0, elapsed: 0, remaining: 0 };

    // Find active chapter (last one whose start is <= currentTime)
    let activeIdx = -1;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i]!.startSeconds) {
        activeIdx = i;
        break;
      }
    }

    if (activeIdx === -1) return { progress: 0, elapsed: 0, remaining: 0 };

    const chapter = chapters[activeIdx]!;
    const nextChapter = chapters[activeIdx + 1];
    const chapterEnd = nextChapter?.startSeconds ?? (duration > 0 ? duration : currentTime);
    const chapterDuration = Math.max(0, chapterEnd - chapter.startSeconds);
    const elapsed = Math.max(0, currentTime - chapter.startSeconds);
    const remaining = Math.max(0, chapterEnd - currentTime);
    const progress = chapterDuration > 0 ? Math.min(1, elapsed / chapterDuration) : 0;

    return { progress, elapsed, remaining };
  }, [chapters, currentTime, duration]);
}
