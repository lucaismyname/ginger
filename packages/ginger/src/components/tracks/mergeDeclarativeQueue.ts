import type { Track } from "../../types";

export type GingerTracksMergeMode = "append" | "prepend" | "replace";

export function mergeDeclarativeQueue(
  merge: GingerTracksMergeMode,
  initialSnapshot: Track[],
  declarative: Track[],
): Track[] {
  switch (merge) {
    case "append":
      return [...initialSnapshot, ...declarative];
    case "prepend":
      return [...declarative, ...initialSnapshot];
    case "replace":
      return [...declarative];
    default:
      return [...initialSnapshot, ...declarative];
  }
}

/** Avoids redundant `SET_QUEUE` dispatches when merged queue is unchanged. */
export function tracksQueueShallowEqual(a: Track[], b: Track[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (x === y) continue;
    if (
      x.title !== y.title ||
      x.fileUrl !== y.fileUrl ||
      (x.id ?? "") !== (y.id ?? "") ||
      (x.artist ?? "") !== (y.artist ?? "")
    ) {
      return false;
    }
  }
  return true;
}
