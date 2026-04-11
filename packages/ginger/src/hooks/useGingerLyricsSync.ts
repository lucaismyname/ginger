import { useMemo } from "react";
import { useGingerMedia, useGingerPlayback } from "../context/GingerSplitContexts";
import { type TimedLyricLine, parseLrc } from "../internal/lyrics";

export type GingerLyricsSyncState = {
  lines: TimedLyricLine[];
  activeIndex: number;
  activeLine: TimedLyricLine | null;
};

export function useGingerLyricsSync(): GingerLyricsSyncState {
  const { tracks, currentIndex } = useGingerPlayback();
  const { currentTime } = useGingerMedia();
  const currentTrack = tracks[currentIndex];

  const lines = useMemo(() => {
    if (!currentTrack) return [];
    if (Array.isArray(currentTrack.lyricsTimed) && currentTrack.lyricsTimed.length > 0) {
      return [...currentTrack.lyricsTimed]
        .filter((line) => Number.isFinite(line.time) && line.time >= 0)
        .sort((a, b) => a.time - b.time);
    }
    if (typeof currentTrack.lyrics === "string") {
      return parseLrc(currentTrack.lyrics);
    }
    return [];
  }, [currentTrack]);

  const activeIndex = useMemo(() => {
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      if (currentTime >= lines[i]!.time) return i;
    }
    return -1;
  }, [currentTime, lines]);

  return {
    lines,
    activeIndex,
    activeLine: activeIndex >= 0 ? (lines[activeIndex] ?? null) : null,
  };
}
