/**
 * Milestone 1 gapless probe: detects whether the **browser** exposes the minimum APIs
 * for a future Web Audio decode + schedule path. Ginger does not implement gapless
 * playback yet; this never touches the live `HTMLAudioElement` or playback.
 */

export type GaplessHints = {
  /**
   * Use on `HTMLMediaElement` (and matching `fetch`) when audio is cross-origin so
   * decoded samples can be routed without tainting (required for Web Audio).
   */
  crossOrigin: "anonymous" | "use-credentials" | null;
  /**
   * Short guidance on containers/codecs and fetch constraints for a decode path.
   */
  format: string;
};

export type GaplessCapabilityResult = {
  /**
   * True when `AudioContext` (or legacy equivalent) and `decodeAudioData` appear
   * available in a secure context — i.e. the environment could support a decode-based
   * gapless implementation. Does **not** mean Ginger ships gapless playback.
   */
  supported: boolean;
  /** Human-readable explanation, including caveats and fallback behavior. */
  reason: string;
  hints: GaplessHints;
};

const DEFAULT_HINTS: GaplessHints = {
  crossOrigin: "anonymous",
  format:
    "Full-file fetch + decode is the portable path; Media Source Extensions help only when you control containerized segments. Prefer HTTP(S) or blob: URLs; cross-origin media needs CORS and matching crossOrigin on <audio>. Codec support (MP3, AAC/MP4, Opus, …) is browser-specific.",
};

function hasDecodeAudioDataOnPrototype(ctor: typeof AudioContext | undefined): boolean {
  return Boolean(ctor && typeof ctor.prototype.decodeAudioData === "function");
}

/**
 * Inspect globals only (no `AudioContext` construction) so it is safe to call during SSR
 * or in tests without user gesture.
 */
export function probeGaplessCapability(): GaplessCapabilityResult {
  if (typeof globalThis === "undefined") {
    return {
      supported: false,
      reason: "No global object (probe unsupported in this runtime).",
      hints: DEFAULT_HINTS,
    };
  }

  const g = globalThis as unknown as {
    window?: Window;
    isSecureContext?: boolean;
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
    MediaSource?: typeof MediaSource;
  };

  if (typeof g.window === "undefined") {
    return {
      supported: false,
      reason:
        "No window (SSR or non-browser). Run the probe in the browser if you need live results.",
      hints: DEFAULT_HINTS,
    };
  }

  const secure =
    typeof g.isSecureContext === "boolean" ? g.isSecureContext : g.window.isSecureContext !== false;
  if (!secure) {
    return {
      supported: false,
      reason:
        "A secure context (HTTPS or localhost) is required for Web Audio in most browsers. Gapless decode path would not be available here.",
      hints: DEFAULT_HINTS,
    };
  }

  const Ctor = g.AudioContext ?? g.webkitAudioContext;
  if (!Ctor || !hasDecodeAudioDataOnPrototype(Ctor)) {
    return {
      supported: false,
      reason:
        "Web Audio API is unavailable or decodeAudioData is missing. A gapless decode path cannot run in this environment.",
      hints: DEFAULT_HINTS,
    };
  }

  const mse = typeof g.MediaSource !== "undefined";
  const mseNote = mse
    ? "MediaSource is available for segment-based strategies; Ginger still uses a single <audio> for playback today."
    : "MediaSource is not exposed; only full-buffer decode (or progressive chunking in user code) applies.";

  return {
    supported: true,
    reason: `Browser exposes Web Audio decode primitives (${mseNote}). Ginger does not yet schedule gapless transitions — keep using Ginger.Player and existing queue actions.`,
    hints: DEFAULT_HINTS,
  };
}
