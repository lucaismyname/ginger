import { useEffect } from "react";
import type { GingerState } from "../types";

export type MediaSessionBridgeActions = {
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (timeSeconds: number) => void;
};

function getMediaSession(): MediaSession | null {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return null;
  return navigator.mediaSession;
}

export function useMediaSessionBridge(
  enabled: boolean,
  state: GingerState,
  actions: MediaSessionBridgeActions,
): void {
  const track = state.tracks[state.currentIndex];
  const title = track?.title;
  const artist = track?.artist;
  const album = track?.album;
  const artworkUrl = track?.artworkUrl;

  useEffect(() => {
    const ms = getMediaSession();
    if (!enabled || !ms) return;
    ms.metadata = new MediaMetadata({
      title: title ?? "Unknown track",
      artist,
      album,
      artwork: artworkUrl ? [{ src: artworkUrl }] : undefined,
    });
  }, [enabled, title, artist, album, artworkUrl]);

  useEffect(() => {
    const ms = getMediaSession();
    if (!enabled || !ms) return;
    ms.playbackState = state.isPaused ? "paused" : "playing";
  }, [enabled, state.isPaused]);

  useEffect(() => {
    const ms = getMediaSession();
    if (!enabled || !ms) return;
    try {
      ms.setActionHandler("play", actions.play);
      ms.setActionHandler("pause", actions.pause);
      ms.setActionHandler("nexttrack", actions.next);
      ms.setActionHandler("previoustrack", actions.prev);
      ms.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number" && Number.isFinite(details.seekTime)) {
          actions.seek(details.seekTime);
        }
      });
    } catch {
      // Best-effort API support differs across browsers.
    }
    return () => {
      try {
        ms.setActionHandler("play", null);
        ms.setActionHandler("pause", null);
        ms.setActionHandler("nexttrack", null);
        ms.setActionHandler("previoustrack", null);
        ms.setActionHandler("seekto", null);
      } catch {
        // Ignore platforms that do not support clearing handlers.
      }
    };
  }, [enabled, actions]);
}
