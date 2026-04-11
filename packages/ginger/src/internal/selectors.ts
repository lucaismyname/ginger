import type { GingerState, PlaybackUiState, Track } from "../types";
import { resolveAlbumLine, resolveArtworkUrl } from "../core/transitions";

export function getCurrentTrack(state: GingerState): Track | null {
  const t = state.tracks[state.currentIndex];
  return t ?? null;
}

export function derivePlaybackUiState(state: GingerState): PlaybackUiState {
  if (state.errorMessage) return "error";
  if (state.tracks.length === 0) return "idle";
  if (state.isBuffering) return "loading";
  if (!state.isPaused) return "playing";
  if (
    Number.isFinite(state.duration) &&
    state.duration > 0 &&
    state.currentTime >= state.duration - 0.05
  ) {
    return "ended";
  }
  return "paused";
}

export function effectiveDuration(state: GingerState): number {
  const d = state.duration;
  if (Number.isFinite(d) && d > 0) return d;
  const hint = state.tracks[state.currentIndex]?.durationSeconds;
  if (typeof hint === "number" && Number.isFinite(hint) && hint > 0) return hint;
  return 0;
}

export function effectiveRemaining(state: GingerState): number {
  const dur = effectiveDuration(state);
  const rem = dur - state.currentTime;
  return Number.isFinite(rem) ? Math.max(0, rem) : 0;
}

export function progressFraction(state: GingerState): number {
  const dur = effectiveDuration(state);
  if (!(dur > 0)) return 0;
  return Math.min(1, Math.max(0, state.currentTime / dur));
}

export function resolvedArtwork(state: GingerState): string | undefined {
  const track = getCurrentTrack(state);
  return resolveArtworkUrl(track, state.playlistMeta?.artworkUrl);
}

export function resolvedAlbumLine(state: GingerState): string | undefined {
  const track = getCurrentTrack(state);
  return resolveAlbumLine(track, state.playlistMeta?.subtitle);
}
