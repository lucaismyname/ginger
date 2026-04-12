/**
 * Resolves the runtime `AudioContext` constructor, including legacy `webkitAudioContext` (Safari).
 * Returns `null` when `window` is unavailable or Web Audio is not implemented.
 */
export function getAudioContextConstructor():
  | (new (
      contextOptions?: AudioContextOptions,
    ) => AudioContext)
  | null {
  if (typeof window === "undefined") return null;
  const C =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return C ?? null;
}
