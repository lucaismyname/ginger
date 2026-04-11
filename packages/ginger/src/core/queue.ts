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

export function findIndexByFileUrl(tracks: Track[], fileUrl: string): number {
  const i = tracks.findIndex((t) => t.fileUrl === fileUrl);
  return i === -1 ? 0 : i;
}
