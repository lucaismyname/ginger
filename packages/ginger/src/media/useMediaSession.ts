import { useEffect } from "react";
import type { GingerState } from "../types";

export type MediaSessionBridgeActions = {
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (timeSeconds: number) => void;
};

function toMediaMetadata(state: GingerState): MediaMetadataInit {
  const track = state.tracks[state.currentIndex];
  if (!track) return { title: "Unknown track" };
  return {
    title: track.title,
    artist: track.artist,
    album: track.album,
    artwork: track.artworkUrl ? [{ src: track.artworkUrl }] : undefined,
  };
}

export function useMediaSessionBridge(
  enabled: boolean,
  state: GingerState,
  actions: MediaSessionBridgeActions,
): void {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const mediaSession = navigator.mediaSession;
    mediaSession.metadata = new MediaMetadata(toMediaMetadata(state));
    mediaSession.playbackState = state.isPaused ? "paused" : "playing";

    try {
      mediaSession.setActionHandler("play", actions.play);
      mediaSession.setActionHandler("pause", actions.pause);
      mediaSession.setActionHandler("nexttrack", actions.next);
      mediaSession.setActionHandler("previoustrack", actions.prev);
      mediaSession.setActionHandler("seekto", (details) => {
        if (typeof details.seekTime === "number" && Number.isFinite(details.seekTime)) {
          actions.seek(details.seekTime);
        }
      });
    } catch {
      // Best-effort API support differs across browsers.
    }

    return () => {
      try {
        mediaSession.setActionHandler("play", null);
        mediaSession.setActionHandler("pause", null);
        mediaSession.setActionHandler("nexttrack", null);
        mediaSession.setActionHandler("previoustrack", null);
        mediaSession.setActionHandler("seekto", null);
      } catch {
        // Ignore platforms that do not support clearing handlers.
      }
    };
  }, [enabled, state, actions]);
}
