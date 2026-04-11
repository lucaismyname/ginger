import { type CSSProperties, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  clampPlaybackRate,
  clampVolume,
  createInitialState,
  gingerReducer,
} from "../core/playbackReducer";
import { trackIdentity } from "../core/queue";
import { computeEndedTransition } from "../core/transitions";
import { derivePlaybackUiState } from "../internal/selectors";
import { useMediaSessionBridge } from "../media/useMediaSession";
import type {
  GingerInitPayload,
  GingerProviderProps,
  PlaybackMode,
  PlaylistMeta,
  RepeatMode,
  Track,
} from "../types";
import { GingerContext, type GingerContextValue } from "./GingerContext";
import { GingerLocaleProvider } from "./GingerLocaleContext";
import {
  GingerMediaContext,
  type GingerMediaContextValue,
  GingerPlaybackContext,
  type GingerPlaybackContextValue,
} from "./GingerSplitContexts";

const defaultProviderStyle: CSSProperties = {
  ["--ginger-primary-color" as string]: "#111827",
  ["--ginger-muted-color" as string]: "#6b7280",
  ["--ginger-font-size" as string]: "14px",
  ["--ginger-font-family" as string]: "system-ui, sans-serif",
  ["--ginger-playlist-row-padding" as string]: "6px 8px",
  ["--ginger-artwork-radius" as string]: "6px",
  ["--ginger-artwork-bg" as string]: "#f3f4f6",
  ["--ginger-playlist-active-bg" as string]: "rgba(17, 24, 39, 0.06)",
  ["--ginger-buffer-color" as string]: "rgba(107, 114, 128, 0.35)",
  ["--ginger-focus-ring" as string]: "0 0 0 2px rgba(59, 130, 246, 0.45)",
};

export function GingerProvider({
  children,
  initialTracks = [],
  initialIndex = 0,
  initialPlaylistMeta = null,
  initialShuffle = false,
  initialRepeatMode = "off",
  initialPlaybackMode = "playlist",
  initialPaused = true,
  initialVolume = 1,
  initialMuted = false,
  initialPlaybackRate = 1,
  initialStateKey,
  locale,
  mediaSession = false,
  beforePlay,
  onPlayBlocked,
  persistence,
  hydrateOnMount = false,
  resumeOnTrackChange = false,
  unstyled = false,
  className,
  style,
  onTrackChange,
  onPlay,
  onPause,
  onQueueEnd,
  onError,
}: GingerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, dispatch] = useReducer(gingerReducer, undefined, () =>
    createInitialState({
      tracks: initialTracks,
      currentIndex: initialIndex,
      playlistMeta: initialPlaylistMeta,
      isPaused: initialPaused,
      isShuffled: initialShuffle,
      repeatMode: initialRepeatMode,
      playbackMode: initialPlaybackMode,
      volume: initialVolume,
      muted: initialMuted,
      playbackRate: initialPlaybackRate,
    }),
  );
  const stateRef = useRef(state);

  const latestInitRef = useRef({
    tracks: initialTracks,
    currentIndex: initialIndex,
    playlistMeta: initialPlaylistMeta,
    isPaused: initialPaused,
    isShuffled: initialShuffle,
    repeatMode: initialRepeatMode,
    playbackMode: initialPlaybackMode,
    volume: initialVolume,
    muted: initialMuted,
    playbackRate: initialPlaybackRate,
  });
  latestInitRef.current = {
    tracks: initialTracks,
    currentIndex: initialIndex,
    playlistMeta: initialPlaylistMeta,
    isPaused: initialPaused,
    isShuffled: initialShuffle,
    repeatMode: initialRepeatMode,
    playbackMode: initialPlaybackMode,
    volume: initialVolume,
    muted: initialMuted,
    playbackRate: initialPlaybackRate,
  };

  const prevInitialStateKeyRef = useRef<typeof initialStateKey>(undefined);

  useEffect(() => {
    if (initialStateKey === undefined) {
      prevInitialStateKeyRef.current = undefined;
      return;
    }
    if (prevInitialStateKeyRef.current === undefined) {
      prevInitialStateKeyRef.current = initialStateKey;
      return;
    }
    if (prevInitialStateKeyRef.current === initialStateKey) return;
    prevInitialStateKeyRef.current = initialStateKey;
    const p = latestInitRef.current;
    dispatch({
      type: "INIT",
      payload: {
        tracks: p.tracks,
        currentIndex: p.currentIndex,
        playlistMeta: p.playlistMeta,
        isPaused: p.isPaused,
        isShuffled: p.isShuffled,
        repeatMode: p.repeatMode,
        playbackMode: p.playbackMode,
        volume: p.volume,
        muted: p.muted,
        playbackRate: p.playbackRate,
      },
    });
  }, [initialStateKey, dispatch]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const currentTrack = state.tracks[state.currentIndex] ?? null;

  useEffect(() => {
    onTrackChange?.(currentTrack, state.currentIndex);
  }, [currentTrack, state.currentIndex, onTrackChange]);

  useEffect(() => {
    if (state.errorMessage) onError?.(state.errorMessage);
  }, [state.errorMessage, onError]);

  const prevPausedRef = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (prevPausedRef.current === undefined) {
      prevPausedRef.current = state.isPaused;
      return;
    }
    if (prevPausedRef.current !== state.isPaused) {
      if (state.isPaused) onPause?.();
      else onPlay?.();
    }
    prevPausedRef.current = state.isPaused;
  }, [state.isPaused, onPause, onPlay]);

  const play = useCallback(() => {
    dispatch({ type: "PLAY" });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: "PAUSE" });
    audioRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPaused) play();
    else pause();
  }, [pause, play, state.isPaused]);

  const seek = useCallback((timeSeconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    if (!Number.isFinite(timeSeconds)) return;
    el.currentTime = Math.max(0, timeSeconds);
  }, []);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: "SET_VOLUME", payload: clampVolume(volume) });
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    dispatch({ type: "SET_MUTED", payload: muted });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: "TOGGLE_MUTE" });
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    dispatch({ type: "SET_PLAYBACK_RATE", payload: clampPlaybackRate(rate) });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, []);

  const prev = useCallback(() => {
    dispatch({ type: "PREV" });
  }, []);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    dispatch({ type: "SET_REPEAT", payload: mode });
  }, []);

  const cycleRepeat = useCallback(() => {
    dispatch({ type: "CYCLE_REPEAT" });
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
  }, []);

  const setQueue = useCallback((tracks: Track[], currentIndex?: number) => {
    dispatch({ type: "SET_QUEUE", payload: { tracks, currentIndex } });
  }, []);

  const insertTrackAt = useCallback((track: Track, index?: number, autoPlay?: boolean) => {
    dispatch({ type: "INSERT_TRACK", payload: { track, index, autoPlay } });
  }, []);

  const removeTrackAt = useCallback((index: number) => {
    dispatch({ type: "REMOVE_TRACK", payload: { index } });
  }, []);

  const moveTrack = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: "MOVE_TRACK", payload: { fromIndex, toIndex } });
  }, []);

  const enqueueNext = useCallback((track: Track) => {
    dispatch({ type: "ADD_NEXT", payload: { track } });
  }, []);

  const playTrackAt = useCallback((index: number) => {
    dispatch({ type: "SET_INDEX", payload: { index, autoPlay: true } });
  }, []);

  const selectTrackAt = useCallback((index: number) => {
    dispatch({ type: "SET_INDEX", payload: { index, autoPlay: false } });
  }, []);

  const setPlaylistMeta = useCallback((meta: PlaylistMeta | null) => {
    dispatch({ type: "SET_PLAYLIST_META", payload: meta });
  }, []);

  const setPlaybackMode = useCallback((mode: PlaybackMode) => {
    dispatch({ type: "SET_PLAYBACK_MODE", payload: mode });
  }, []);

  const init = useCallback((payload: GingerInitPayload) => {
    dispatch({ type: "INIT", payload });
  }, []);

  useEffect(() => {
    if (!persistence || !hydrateOnMount) return;
    const volume = persistence.get("ginger:volume");
    const muted = persistence.get("ginger:muted");
    const playbackRate = persistence.get("ginger:playbackRate");
    const repeatMode = persistence.get("ginger:repeatMode");
    const currentIndex = persistence.get("ginger:currentIndex");
    const p = latestInitRef.current;
    dispatch({
      type: "INIT",
      payload: {
        tracks: p.tracks,
        playlistMeta: p.playlistMeta,
        isPaused: p.isPaused,
        isShuffled: p.isShuffled,
        playbackMode: p.playbackMode,
        currentIndex: typeof currentIndex === "number" ? currentIndex : p.currentIndex,
        repeatMode:
          repeatMode === "off" || repeatMode === "all" || repeatMode === "one"
            ? repeatMode
            : p.repeatMode,
        volume: typeof volume === "number" ? volume : p.volume,
        muted: typeof muted === "boolean" ? muted : p.muted,
        playbackRate: typeof playbackRate === "number" ? playbackRate : p.playbackRate,
      },
    });
  }, [hydrateOnMount, persistence]);

  useEffect(() => {
    if (!persistence) return;
    persistence.set("ginger:volume", state.volume);
    persistence.set("ginger:muted", state.muted);
    persistence.set("ginger:playbackRate", state.playbackRate);
    persistence.set("ginger:repeatMode", state.repeatMode);
    persistence.set("ginger:currentIndex", state.currentIndex);
  }, [
    persistence,
    state.volume,
    state.muted,
    state.playbackRate,
    state.repeatMode,
    state.currentIndex,
  ]);

  useEffect(() => {
    if (!persistence || !resumeOnTrackChange) return;
    const track = state.tracks[state.currentIndex];
    if (!track) return;
    const key = `ginger:resume:${trackIdentity(track)}`;
    const saved = persistence.get(key);
    if (typeof saved === "number" && Number.isFinite(saved)) {
      seek(saved);
    }
  }, [persistence, resumeOnTrackChange, state.currentIndex, state.tracks, seek]);

  useEffect(() => {
    if (!persistence || !resumeOnTrackChange) return;
    const track = state.tracks[state.currentIndex];
    if (!track || !(state.currentTime >= 0)) return;
    const key = `ginger:resume:${trackIdentity(track)}`;
    const id = setTimeout(() => persistence.set(key, state.currentTime), 250);
    return () => clearTimeout(id);
  }, [persistence, resumeOnTrackChange, state.currentIndex, state.tracks, state.currentTime]);

  const currentUrl = state.tracks[state.currentIndex]?.fileUrl;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (state.isPaused) {
      el.pause();
      return;
    }
    let cancelled = false;
    void (async () => {
      if (beforePlay) {
        let allowed = false;
        try {
          allowed = await beforePlay();
        } catch (error) {
          const message = error instanceof Error ? error.message : "beforePlay rejected";
          dispatch({ type: "MEDIA_ERROR", payload: { message } });
          return;
        }
        if (!allowed) {
          if (!cancelled) {
            dispatch({ type: "PAUSE" });
            onPlayBlocked?.();
          }
          return;
        }
      }
      if (cancelled) return;
      void el.play().catch((e: unknown) => {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === "string"
              ? e
              : "Playback failed (e.g. autoplay blocked or unavailable source)";
        dispatch({ type: "MEDIA_ERROR", payload: { message: msg } });
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [beforePlay, currentUrl, onPlayBlocked, state.isPaused]);

  const notifyEnded = useCallback(() => {
    const transition = computeEndedTransition(stateRef.current);
    if (transition.kind === "replay_same") {
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
      }
      dispatch({ type: "PLAY" });
      return;
    }
    if (transition.kind === "stop") {
      dispatch({ type: "PAUSE" });
      onQueueEnd?.();
      return;
    }
    const nextIndex = transition.nextIndex;
    dispatch({ type: "SET_INDEX", payload: { index: nextIndex, autoPlay: true } });
  }, [onQueueEnd]);

  const mediaSessionActions = useMemo(
    () => ({ play, pause, next, prev, seek }),
    [play, pause, next, prev, seek],
  );
  useMediaSessionBridge(Boolean(mediaSession), state, mediaSessionActions);

  const providerDir = locale?.seek && /[\u0590-\u08FF]/.test(locale.seek) ? "rtl" : "ltr";

  const value = useMemo<GingerContextValue>(
    () => ({
      state,
      dispatch,
      audioRef,
      notifyEnded,
      init,
      play,
      pause,
      togglePlayPause,
      seek,
      setVolume,
      setMuted,
      toggleMute,
      setPlaybackRate,
      next,
      prev,
      setRepeatMode,
      cycleRepeat,
      toggleShuffle,
      setQueue,
      insertTrackAt,
      removeTrackAt,
      moveTrack,
      enqueueNext,
      playTrackAt,
      selectTrackAt,
      setPlaylistMeta,
      setPlaybackMode,
    }),
    [
      cycleRepeat,
      dispatch,
      init,
      next,
      notifyEnded,
      pause,
      play,
      playTrackAt,
      insertTrackAt,
      removeTrackAt,
      moveTrack,
      enqueueNext,
      selectTrackAt,
      prev,
      seek,
      setMuted,
      setPlaybackRate,
      setQueue,
      setRepeatMode,
      setPlaylistMeta,
      setPlaybackMode,
      setVolume,
      state,
      toggleMute,
      togglePlayPause,
      toggleShuffle,
    ],
  );

  const playbackValue = useMemo<GingerPlaybackContextValue>(
    () => ({
      tracks: state.tracks,
      currentIndex: state.currentIndex,
      isPaused: state.isPaused,
      isShuffled: state.isShuffled,
      repeatMode: state.repeatMode,
      originalTracks: state.originalTracks,
      playlistMeta: state.playlistMeta,
      init,
      play,
      pause,
      togglePlayPause,
      next,
      prev,
      setRepeatMode,
      cycleRepeat,
      toggleShuffle,
      playbackMode: state.playbackMode,
      setQueue,
      insertTrackAt,
      removeTrackAt,
      moveTrack,
      enqueueNext,
      playTrackAt,
      selectTrackAt,
      setPlaylistMeta,
      setPlaybackMode,
      dispatch,
    }),
    [
      state.tracks,
      state.currentIndex,
      state.isPaused,
      state.isShuffled,
      state.repeatMode,
      state.playbackMode,
      state.originalTracks,
      state.playlistMeta,
      init,
      play,
      pause,
      togglePlayPause,
      next,
      prev,
      setRepeatMode,
      cycleRepeat,
      toggleShuffle,
      setQueue,
      insertTrackAt,
      removeTrackAt,
      moveTrack,
      enqueueNext,
      playTrackAt,
      selectTrackAt,
      setPlaylistMeta,
      setPlaybackMode,
      dispatch,
    ],
  );

  const mediaValue = useMemo<GingerMediaContextValue>(
    () => ({
      currentTime: state.currentTime,
      duration: state.duration,
      bufferedFraction: state.bufferedFraction,
      isBuffering: state.isBuffering,
      errorMessage: state.errorMessage,
      volume: state.volume,
      muted: state.muted,
      playbackRate: state.playbackRate,
      seek,
      setVolume,
      setMuted,
      toggleMute,
      setPlaybackRate,
      audioRef,
      notifyEnded,
      dispatch,
    }),
    [
      state.currentTime,
      state.duration,
      state.bufferedFraction,
      state.isBuffering,
      state.errorMessage,
      state.volume,
      state.muted,
      state.playbackRate,
      seek,
      setVolume,
      setMuted,
      toggleMute,
      setPlaybackRate,
      audioRef,
      notifyEnded,
      dispatch,
    ],
  );

  const playbackUi = derivePlaybackUiState(state);

  const mergedStyle = useMemo(
    () => (unstyled ? style : { ...defaultProviderStyle, ...style }),
    [style, unstyled],
  );

  return (
    <GingerLocaleProvider locale={locale}>
      <GingerPlaybackContext.Provider value={playbackValue}>
        <GingerMediaContext.Provider value={mediaValue}>
          <GingerContext.Provider value={value}>
            <div
              className={className}
              style={mergedStyle}
              data-ginger-playback={playbackUi}
              dir={providerDir}
            >
              {children}
            </div>
          </GingerContext.Provider>
        </GingerMediaContext.Provider>
      </GingerPlaybackContext.Provider>
    </GingerLocaleProvider>
  );
}
