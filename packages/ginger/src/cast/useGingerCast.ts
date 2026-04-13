import { useCallback, useEffect, useRef, useState } from "react";
import { useGinger } from "../hooks/useGinger";
import { getCurrentTrack } from "../internal/selectors";
import type { Track } from "../types";
import type { CastErrorLike, WindowWithCast } from "./castTypes";
import { DEFAULT_MEDIA_RECEIVER_APP_ID } from "./castTypes";
import { loadCastFramework } from "./loadCastFramework";
import { trackToMediaInfo } from "./trackToMediaInfo";

const SEEK_JUMP_SECONDS = 2;

function getCastGlobals(win: WindowWithCast): {
  context: import("./castTypes").CastFrameworkContextLike;
  framework: import("./castTypes").CastFrameworkNamespace;
  chromeCast: import("./castTypes").ChromeCastNamespace;
} | null {
  const framework = win.cast?.framework;
  const chromeCast = win.chrome?.cast;
  if (!framework?.CastContext || !chromeCast?.media) return null;
  return {
    context: framework.CastContext.getInstance(),
    framework,
    chromeCast,
  };
}

export type UseGingerCastOptions = {
  /** When false, the hook does not touch Cast APIs. Default: true. */
  enabled?: boolean;
  /** Receiver app ID. Default: Default Media Receiver (`CC1AD845`). */
  receiverApplicationId?: string;
  /** Passed to `CastContext.setOptions`. Default: `chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED`. */
  autoJoinPolicy?: number;
  /** Passed to `CastContext.setOptions`. Default: true. */
  resumeSavedSession?: boolean;
  /**
   * When connected, silences the local `<audio>` (`muted` + `volume = 0`) so it does not compete
   * with the TV. Restored on disconnect. Does **not** change Ginger playback state.
   * Default: `"pause-mute"` (silence local element).
   */
  syncLocalAudio?: "pause-mute" | "none";
  /** When true, ends the Cast session when the hook unmounts. Default: false. */
  endSessionOnUnmount?: boolean;
  contentTypeResolver?: (track: Track) => string;
  onError?: (error: CastErrorLike | Error) => void;
};

export type UseGingerCastResult = {
  /** Cast APIs loaded and `chrome.cast` is present (may still be `false` on unsupported browsers). */
  isAvailable: boolean;
  /** Cast sender is connected to a receiver. */
  isConnected: boolean;
  /** Same as `isConnected`; use to gate `Ginger.Player` (`{!isCasting && <Ginger.Player />}`). */
  isCasting: boolean;
  /** Last `SESSION_STATE_CHANGED` value from CAF, if any. */
  sessionState: string | null;
  error: string | null;
  /** Starts a Cast session (shows the Cast device picker when needed). */
  requestSession: () => Promise<void>;
  /** Ends the current Cast session, if any. */
  endSession: () => void;
  /** Position reported by `RemotePlayer` on the sender (useful if local audio is unmounted). */
  receiverCurrentTime: number;
  /** Duration reported by `RemotePlayer`. */
  receiverDuration: number;
  /** Pause state reported by `RemotePlayer`. */
  receiverIsPaused: boolean;
};

function formatCastError(err: CastErrorLike | Error | unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "description" in err) {
    const d = (err as CastErrorLike).description;
    if (typeof d === "string" && d.length > 0) return d;
  }
  return "Unknown Cast error";
}

/**
 * Chromecast Web Sender (CAF) bridge: loads the current Ginger track on a Cast receiver and keeps
 * transport roughly in sync while Ginger remains the queue source of truth.
 *
 * Prefer **`{!isCasting && <Ginger.Player />}`** so local `<audio>` does not decode the same URLs
 * as the receiver. When you must keep `Ginger.Player` mounted, use `syncLocalAudio: "pause-mute"`
 * to mute the local element.
 *
 * ```ts
 * import { useGingerCast } from "@lucaismyname/ginger/cast";
 * ```
 */
export function useGingerCast(options: UseGingerCastOptions = {}): UseGingerCastResult {
  const {
    enabled = true,
    receiverApplicationId = DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: autoJoinPolicyOpt,
    resumeSavedSession = true,
    syncLocalAudio = "pause-mute",
    endSessionOnUnmount = false,
    contentTypeResolver,
    onError,
  } = options;

  const { state, audioRef } = useGinger();
  const currentTrack = getCurrentTrack(state);

  const [frameworkReady, setFrameworkReady] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionState, setSessionState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receiverCurrentTime, setReceiverCurrentTime] = useState(0);
  const [receiverDuration, setReceiverDuration] = useState(0);
  const [receiverIsPaused, setReceiverIsPaused] = useState(true);

  const remotePlayerRef = useRef<import("./castTypes").CastRemotePlayerLike | null>(null);
  const remoteControllerRef = useRef<import("./castTypes").CastRemotePlayerControllerLike | null>(
    null,
  );
  const lastMediaKeyRef = useRef<string | null>(null);
  const prevSeekTimeRef = useRef(0);
  const prevSeekIndexRef = useRef<number>(-1);
  const localsRef = useRef<{ volume: number; muted: boolean } | null>(null);
  const skipPlayPauseUntilRef = useRef(0);
  const stateCurrentTimeRef = useRef(state.currentTime);
  stateCurrentTimeRef.current = state.currentTime;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const emitError = useCallback((err: CastErrorLike | Error | unknown) => {
    const msg = formatCastError(err);
    setError(msg);
    try {
      onErrorRef.current?.(err instanceof Error ? err : (err as CastErrorLike));
    } catch {
      /* ignore user handler errors */
    }
  }, []);

  // Load CAF once when enabled.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void loadCastFramework()
      .then(() => {
        if (cancelled) return;
        setFrameworkReady(true);
        const win = window as WindowWithCast;
        setIsAvailable(Boolean(win.chrome?.cast?.isAvailable));
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        emitError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, emitError]);

  // CastContext options + connection listeners.
  useEffect(() => {
    if (!enabled || !frameworkReady) return;
    const win = window as WindowWithCast;
    const globals = getCastGlobals(win);
    if (!globals) return;

    const { context, framework, chromeCast } = globals;
    const autoJoinPolicy = autoJoinPolicyOpt ?? chromeCast.AutoJoinPolicy?.ORIGIN_SCOPED ?? 1;

    context.setOptions({
      receiverApplicationId,
      autoJoinPolicy,
      resumeSavedSession,
    });

    const syncConnected = () => {
      const connected = context.getCastState() === framework.CastState.CONNECTED;
      setIsConnected(connected);
    };

    const onCastState = () => syncConnected();
    const onSessionState = (e: { sessionState?: string }) => {
      if (e.sessionState) setSessionState(e.sessionState);
      syncConnected();
    };

    context.addEventListener(framework.CastContextEventType.CAST_STATE_CHANGED, onCastState);
    context.addEventListener(framework.CastContextEventType.SESSION_STATE_CHANGED, onSessionState);
    syncConnected();

    return () => {
      context.removeEventListener(framework.CastContextEventType.CAST_STATE_CHANGED, onCastState);
      context.removeEventListener(
        framework.CastContextEventType.SESSION_STATE_CHANGED,
        onSessionState,
      );
    };
  }, [enabled, frameworkReady, receiverApplicationId, autoJoinPolicyOpt, resumeSavedSession]);

  // RemotePlayer (for seek / play/pause / progress mirrors).
  useEffect(() => {
    if (!enabled || !frameworkReady) return;
    const win = window as WindowWithCast;
    const globals = getCastGlobals(win);
    if (!globals) return;

    const { framework } = globals;
    const player = new framework.RemotePlayer();
    const controller = new framework.RemotePlayerController(player);
    remotePlayerRef.current = player;
    remoteControllerRef.current = controller;

    const bump = () => {
      setReceiverCurrentTime(player.currentTime);
      setReceiverDuration(player.duration);
      setReceiverIsPaused(player.isPaused);
    };

    const { RemotePlayerEventType } = framework;
    player.addEventListener(RemotePlayerEventType.IS_PAUSED_CHANGED, bump);
    player.addEventListener(RemotePlayerEventType.CURRENT_TIME_CHANGED, bump);
    player.addEventListener(RemotePlayerEventType.DURATION_CHANGED, bump);
    bump();

    return () => {
      player.removeEventListener(RemotePlayerEventType.IS_PAUSED_CHANGED, bump);
      player.removeEventListener(RemotePlayerEventType.CURRENT_TIME_CHANGED, bump);
      player.removeEventListener(RemotePlayerEventType.DURATION_CHANGED, bump);
      remotePlayerRef.current = null;
      remoteControllerRef.current = null;
    };
  }, [enabled, frameworkReady]);

  // Silence local <audio> while casting (optional).
  useEffect(() => {
    if (!enabled || syncLocalAudio === "none") return;
    const el = audioRef.current;
    if (!isConnected || !el) {
      if (localsRef.current && el) {
        el.muted = localsRef.current.muted;
        el.volume = localsRef.current.volume;
        localsRef.current = null;
      }
      return;
    }
    if (!localsRef.current) {
      localsRef.current = { volume: el.volume, muted: el.muted };
    }
    el.muted = true;
    el.volume = 0;
    return () => {
      if (localsRef.current && audioRef.current) {
        audioRef.current.muted = localsRef.current.muted;
        audioRef.current.volume = localsRef.current.volume;
        localsRef.current = null;
      }
    };
  }, [enabled, syncLocalAudio, isConnected, audioRef]);

  // Load media when the active track changes.
  useEffect(() => {
    if (!enabled || !frameworkReady || !isConnected) return;
    const win = window as WindowWithCast;
    const globals = getCastGlobals(win);
    if (!globals) return;
    const session = globals.context.getCurrentSession();
    if (!session || !currentTrack) return;

    const mediaKey = `${state.currentIndex}:${currentTrack.fileUrl}`;
    const chromeCast = globals.chromeCast;

    if (lastMediaKeyRef.current === mediaKey) return;

    lastMediaKeyRef.current = mediaKey;
    skipPlayPauseUntilRef.current = Date.now() + 500;
    const loadRequest = trackToMediaInfo(chromeCast, currentTrack, { contentTypeResolver });
    loadRequest.autoplay = !state.isPaused;
    loadRequest.currentTime = 0;

    session.loadMedia(
      loadRequest,
      () => {
        prevSeekIndexRef.current = state.currentIndex;
        prevSeekTimeRef.current = stateCurrentTimeRef.current;
      },
      (err) => emitError(err),
    );
  }, [
    enabled,
    frameworkReady,
    isConnected,
    state.currentIndex,
    state.isPaused,
    currentTrack,
    contentTypeResolver,
    emitError,
  ]);

  useEffect(() => {
    if (!isConnected) {
      lastMediaKeyRef.current = null;
    }
  }, [isConnected]);

  // Play/pause on the receiver when Ginger pause state changes (same track only).
  useEffect(() => {
    if (!enabled || !frameworkReady || !isConnected) return;
    if (!currentTrack) return;
    const mediaKey = `${state.currentIndex}:${currentTrack.fileUrl}`;
    if (lastMediaKeyRef.current !== mediaKey) return;
    if (Date.now() < skipPlayPauseUntilRef.current) return;

    const player = remotePlayerRef.current;
    const controller = remoteControllerRef.current;
    if (!player || !controller) return;
    if (player.isPaused !== state.isPaused) {
      controller.playOrPause();
    }
  }, [enabled, frameworkReady, isConnected, state.isPaused, state.currentIndex, currentTrack]);

  // Map large local time jumps to receiver seek (e.g. scrubbing).
  useEffect(() => {
    if (!enabled || !isConnected) return;
    if (prevSeekIndexRef.current !== state.currentIndex) {
      prevSeekIndexRef.current = state.currentIndex;
      prevSeekTimeRef.current = state.currentTime;
      return;
    }
    const jump = Math.abs(state.currentTime - prevSeekTimeRef.current);
    if (jump > SEEK_JUMP_SECONDS) {
      remoteControllerRef.current?.seek({ value: state.currentTime });
    }
    prevSeekTimeRef.current = state.currentTime;
  }, [enabled, isConnected, state.currentTime, state.currentIndex]);

  const requestSession = useCallback(async () => {
    if (!frameworkReady) {
      await loadCastFramework();
    }
    const win = window as WindowWithCast;
    const globals = getCastGlobals(win);
    if (!globals) {
      emitError(new Error("Cast framework is not available."));
      return;
    }
    try {
      await globals.context.requestSession();
      setError(null);
    } catch (e) {
      emitError(e);
    }
  }, [emitError, frameworkReady]);

  const endSession = useCallback(() => {
    const win = window as WindowWithCast;
    const globals = getCastGlobals(win);
    const session = globals?.context.getCurrentSession() as
      | import("./castTypes").CastSessionLike
      | null;
    if (!session) return;
    session.endSession(
      () => {
        lastMediaKeyRef.current = null;
        setError(null);
      },
      (err) => emitError(err),
    );
  }, [emitError]);

  useEffect(() => {
    if (!endSessionOnUnmount) return;
    return () => {
      endSession();
    };
  }, [endSessionOnUnmount, endSession]);

  return {
    isAvailable,
    isConnected,
    isCasting: isConnected,
    sessionState,
    error,
    requestSession,
    endSession,
    receiverCurrentTime,
    receiverDuration,
    receiverIsPaused,
  };
}
