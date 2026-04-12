import { useEffect } from "react";
import { useGingerMedia, useGingerPlayback } from "../context/GingerSplitContexts";

export type GingerKeyboardShortcutBindings = {
  playPause?: string;
  next?: string;
  previous?: string;
  mute?: string;
  /** Key to seek forward by `seekSeconds`. Default: undefined (disabled). */
  seekForward?: string;
  /** Key to seek backward by `seekSeconds`. Default: undefined (disabled). */
  seekBackward?: string;
  /** Seconds to seek per `seekForward` / `seekBackward` keypress. Default: 5. */
  seekSeconds?: number;
};

export function useGingerKeyboardShortcuts(
  enabled = true,
  bindings: GingerKeyboardShortcutBindings = {},
): void {
  const { togglePlayPause, next, prev } = useGingerPlayback();
  const { toggleMute, seek, currentTime, duration } = useGingerMedia();

  const {
    mute: muteBinding,
    seekForward: seekForwardBinding,
    seekBackward: seekBackwardBinding,
  } = bindings;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const playPause = (bindings.playPause ?? " ").toLowerCase();
    const nextKey = (bindings.next ?? "ArrowRight").toLowerCase();
    const prevKey = (bindings.previous ?? "ArrowLeft").toLowerCase();
    const muteKey = muteBinding?.toLowerCase();
    const seekFwdKey = seekForwardBinding?.toLowerCase();
    const seekBwdKey = seekBackwardBinding?.toLowerCase();
    const seekSecs = bindings.seekSeconds ?? 5;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)
      )
        return;
      const key = event.key.toLowerCase();
      if (key === playPause) {
        event.preventDefault();
        togglePlayPause();
      } else if (key === nextKey) {
        event.preventDefault();
        next();
      } else if (key === prevKey) {
        event.preventDefault();
        prev();
      } else if (muteKey && key === muteKey) {
        event.preventDefault();
        toggleMute();
      } else if (seekFwdKey && key === seekFwdKey) {
        event.preventDefault();
        const dur = duration > 0 ? duration : Number.POSITIVE_INFINITY;
        seek(Math.min(dur, currentTime + seekSecs));
      } else if (seekBwdKey && key === seekBwdKey) {
        event.preventDefault();
        seek(Math.max(0, currentTime - seekSecs));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    bindings.next,
    bindings.playPause,
    bindings.previous,
    bindings.seekSeconds,
    currentTime,
    duration,
    enabled,
    muteBinding,
    next,
    prev,
    seek,
    seekBackwardBinding,
    seekForwardBinding,
    toggleMute,
    togglePlayPause,
  ]);
}
