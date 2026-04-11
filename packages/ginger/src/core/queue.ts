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

export function findIndexByTrackIdentity(
  tracks: Track[],
  target: Track | null | undefined,
): number {
  if (!target) return 0;
  const byRef = tracks.findIndex((t) => t === target);
  if (byRef !== -1) return byRef;

  const identity = trackIdentity(target);
  if (!identity) return 0;

  const matches: number[] = [];
  for (let i = 0; i < tracks.length; i += 1) {
    if (trackIdentity(tracks[i]) === identity) matches.push(i);
  }
  if (matches.length === 0) return 0;
  if (matches.length === 1) return matches[0]!;

  const nodeEnv =
    typeof globalThis !== "undefined" && "process" in globalThis
      ? (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV
      : undefined;
  if (nodeEnv != null && nodeEnv !== "production") {
    console.warn(
      "[@lucaismyname/ginger] Ambiguous track identity: multiple queue rows share the same fileUrl without a unique `id`. Resolving to the first match.",
    );
  }
  return matches[0]!;
}

export function insertTrackAt(tracks: Track[], track: Track, index?: number): Track[] {
  const next = [...tracks];
  const at = Math.max(0, Math.min(next.length, index ?? next.length));
  next.splice(at, 0, track);
  return next;
}

export function removeTrackAt(tracks: Track[], index: number): Track[] {
  if (index < 0 || index >= tracks.length) return [...tracks];
  const next = [...tracks];
  next.splice(index, 1);
  return next;
}

export function moveTrack(tracks: Track[], fromIndex: number, toIndex: number): Track[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    fromIndex >= tracks.length ||
    toIndex < 0 ||
    toIndex >= tracks.length
  ) {
    return [...tracks];
  }
  const next = [...tracks];
  const [item] = next.splice(fromIndex, 1);
  if (!item) return [...tracks];
  next.splice(toIndex, 0, item);
  return next;
}

export function addNextTrack(tracks: Track[], currentIndex: number, track: Track): Track[] {
  return insertTrackAt(tracks, track, Math.max(0, Math.min(tracks.length, currentIndex + 1)));
}
