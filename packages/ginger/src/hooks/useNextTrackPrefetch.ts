import { useEffect } from "react";
import { useGingerPlayback } from "../context/GingerSplitContexts";
import { computeNextIndex } from "../core/transitions";

export type UseNextTrackPrefetchOptions = {
  /** When false, no prefetch runs. Default true. */
  enabled?: boolean;
  /**
   * Match `crossOrigin` on `Ginger.Player` when `fileUrl` is cross-origin so the browser
   * can reuse cached media consistently.
   */
  crossOrigin?: "" | "anonymous" | "use-credentials" | undefined;
};

/**
 * Warms the browser cache for the **logical** next track (same rules as the Next control:
 * `computeNextIndex` from queue, repeat, and playback mode) using a detached `HTMLAudioElement`
 * with `preload="auto"`. Safe to call alongside `Ginger.Player`; it does not replace main playback.
 *
 * The effect depends on the `tracks` array reference from context. If the parent recreates `tracks`
 * every render, prefetch will restart repeatedly; keep a stable queue reference (e.g. memoize) when possible.
 */
export function useNextTrackPrefetch(options: UseNextTrackPrefetchOptions = {}): void {
  const { enabled = true, crossOrigin } = options;
  const { tracks, currentIndex, repeatMode, playbackMode } = useGingerPlayback();

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;
    const nextIndex = computeNextIndex({ tracks, currentIndex, repeatMode, playbackMode });
    if (nextIndex === currentIndex) return;
    const nextUrl = tracks[nextIndex]?.fileUrl ?? "";
    if (!nextUrl) return;

    const audio = document.createElement("audio");
    audio.preload = "auto";
    if (crossOrigin) audio.crossOrigin = crossOrigin;
    audio.src = nextUrl;
    audio.load();

    return () => {
      audio.removeAttribute("src");
      audio.load();
    };
  }, [enabled, crossOrigin, tracks, currentIndex, repeatMode, playbackMode]);
}
