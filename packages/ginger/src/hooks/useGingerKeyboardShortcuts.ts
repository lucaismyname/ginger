import { useEffect } from "react";
import { useGingerMedia, useGingerPlayback } from "../context/GingerSplitContexts";

export type GingerKeyboardShortcutBindings = {
  playPause?: string;
  next?: string;
  previous?: string;
  mute?: string;
};

export function useGingerKeyboardShortcuts(
  enabled = true,
  bindings: GingerKeyboardShortcutBindings = {},
): void {
  const { togglePlayPause, next, prev } = useGingerPlayback();
  const { toggleMute } = useGingerMedia();

  const muteBinding = bindings.mute;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const playPause = (bindings.playPause ?? " ").toLowerCase();
    const nextKey = (bindings.next ?? "ArrowRight").toLowerCase();
    const prevKey = (bindings.previous ?? "ArrowLeft").toLowerCase();
    const muteKey = (bindings.mute ?? "m").toLowerCase();

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
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
      } else if (key === muteKey && muteBinding !== undefined) {
        event.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [bindings.next, bindings.playPause, bindings.previous, enabled, muteBinding, next, prev, toggleMute, togglePlayPause]);
}
