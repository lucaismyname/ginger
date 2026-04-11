import type { GingerState, RepeatMode, Track } from "../types";
import { clampIndex } from "./queue";

export type EndedTransition =
  | { kind: "replay_same" }
  | { kind: "advance"; nextIndex: number }
  | { kind: "wrap"; nextIndex: number }
  | { kind: "stop"; nextIndex: number };

export function computeEndedTransition(state: GingerState): EndedTransition {
  const { tracks, currentIndex, repeatMode, playbackMode } = state;
  const len = tracks.length;
  if (len === 0) return { kind: "stop", nextIndex: 0 };
  if (repeatMode === "one") return { kind: "replay_same" };
  if (playbackMode === "single") return { kind: "stop", nextIndex: clampIndex(currentIndex, len) };
  if (currentIndex < len - 1) return { kind: "advance", nextIndex: currentIndex + 1 };
  if (repeatMode === "all") return { kind: "wrap", nextIndex: 0 };
  return { kind: "stop", nextIndex: clampIndex(currentIndex, len) };
}

export function computeNextIndex(state: GingerState): number {
  const { tracks, currentIndex, repeatMode, playbackMode } = state;
  const len = tracks.length;
  if (len === 0) return 0;
  if (playbackMode === "single") return clampIndex(currentIndex, len);
  if (currentIndex < len - 1) return currentIndex + 1;
  if (repeatMode === "all") return 0;
  return clampIndex(currentIndex, len);
}

export function computePrevIndex(state: GingerState): number {
  const { tracks, currentIndex, repeatMode, playbackMode } = state;
  const len = tracks.length;
  if (len === 0) return 0;
  if (playbackMode === "single") return clampIndex(currentIndex, len);
  if (currentIndex > 0) return currentIndex - 1;
  if (repeatMode === "all") return len - 1;
  return 0;
}

export function cycleRepeatMode(mode: RepeatMode): RepeatMode {
  if (mode === "off") return "all";
  if (mode === "all") return "one";
  return "off";
}

export function resolveArtworkUrl(track: Track | null, playlistArtwork?: string | null): string | undefined {
  return track?.artworkUrl ?? playlistArtwork ?? undefined;
}

export function resolveAlbumLine(track: Track | null, playlistSubtitle?: string | null): string | undefined {
  return track?.album ?? playlistSubtitle ?? undefined;
}
