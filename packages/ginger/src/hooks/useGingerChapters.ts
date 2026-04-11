import { useMemo } from "react";
import { useGingerMedia, useGingerPlayback } from "../context/GingerSplitContexts";

export type GingerChapter = {
  title: string;
  startSeconds: number;
};

export type GingerChapterState = {
  list: GingerChapter[];
  activeIndex: number;
  active: GingerChapter | null;
  seekTo: (index: number) => void;
};

export function useGingerChapters(): GingerChapterState {
  const { tracks, currentIndex } = useGingerPlayback();
  const { currentTime, seek } = useGingerMedia();

  const list = useMemo(() => {
    const chapters = tracks[currentIndex]?.chapters ?? [];
    return [...chapters]
      .filter((item) => item && Number.isFinite(item.startSeconds) && item.startSeconds >= 0)
      .sort((a, b) => a.startSeconds - b.startSeconds);
  }, [currentIndex, tracks]);

  const activeIndex = useMemo(() => {
    if (list.length === 0) return -1;
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (currentTime >= list[i]!.startSeconds) return i;
    }
    return -1;
  }, [currentTime, list]);

  return {
    list,
    activeIndex,
    active: activeIndex >= 0 ? (list[activeIndex] ?? null) : null,
    seekTo: (index: number) => {
      const chapter = list[index];
      if (chapter) seek(chapter.startSeconds);
    },
  };
}
