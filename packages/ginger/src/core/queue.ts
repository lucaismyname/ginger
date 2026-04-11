import type { Track } from "../types";

export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(length - 1, index));
}

export function shuffleWithAnchor(tracks: Track[], anchorIndex: number): Track[] {
  if (tracks.length <= 1) return [...tracks];
  const anchor = tracks[anchorIndex];
  if (!anchor) return [...tracks];
  const rest = tracks.filter((_, i) => i !== anchorIndex);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }
  return [anchor, ...rest];
}

export function trackIdentity(track: Track | null | undefined): string {
  if (!track) return "";
  return track.id != null && track.id !== "" ? `id:${track.id}` : `file:${track.fileUrl}`;
}

export function findIndexByTrackIdentity(tracks: Track[], target: Track | null | undefined): number {
  const identity = trackIdentity(target);
  if (!identity) return 0;
  const i = tracks.findIndex((track) => trackIdentity(track) === identity);
  return i === -1 ? 0 : i;
}
