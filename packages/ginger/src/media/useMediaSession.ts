import { useEffect, useRef } from "react";
import { resolveArtworkUrl } from "../core/transitions";
import type { GingerMediaSessionOptions, GingerState } from "../types";

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
  options: GingerMediaSessionOptions = {},
): void {
  const stateRef = useRef(state);
  stateRef.current = state;

  const track = state.tracks[state.currentIndex];
  const title = track?.title;
  const artist = track?.artist;
  const album = track?.album;
  const artworkUrl = resolveArtworkUrl(track, state.playlistMeta?.artworkUrl);

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

  const seekForwardSeconds = options.seekForwardSeconds;
  const seekBackwardSeconds = options.seekBackwardSeconds;

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

      if (typeof seekForwardSeconds === "number" && seekForwardSeconds > 0) {
        ms.setActionHandler("seekforward", () => {
          const s = stateRef.current;
          const next = s.currentTime + seekForwardSeconds;
          const d = s.duration;
          const cap = Number.isFinite(d) && d > 0 ? d : next;
          actions.seek(Math.min(next, cap));
        });
      } else {
        ms.setActionHandler("seekforward", null);
      }

      if (typeof seekBackwardSeconds === "number" && seekBackwardSeconds > 0) {
        ms.setActionHandler("seekbackward", () => {
          const s = stateRef.current;
          actions.seek(Math.max(0, s.currentTime - seekBackwardSeconds));
        });
      } else {
        ms.setActionHandler("seekbackward", null);
      }
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
        ms.setActionHandler("seekforward", null);
        ms.setActionHandler("seekbackward", null);
      } catch {
        // Ignore platforms that do not support clearing handlers.
      }
    };
  }, [enabled, actions, seekForwardSeconds, seekBackwardSeconds]);

  useEffect(() => {
    const ms = getMediaSession();
    if (!enabled || !ms || !options.positionState) return;
    const duration = state.duration;
    const position = state.currentTime;
    const rate = state.playbackRate;
    try {
      if (!Number.isFinite(duration) || duration <= 0) {
        ms.setPositionState?.();
        return;
      }
      ms.setPositionState?.({
        duration,
        playbackRate: Number.isFinite(rate) && rate > 0 ? rate : 1,
        position: Math.min(Math.max(0, position), duration),
      });
    } catch {
      // setPositionState is optional / flaky across browsers.
    }
    return () => {
      try {
        ms.setPositionState?.();
      } catch {
        // ignore
      }
    };
  }, [enabled, options.positionState, state.currentTime, state.duration, state.playbackRate]);
}
