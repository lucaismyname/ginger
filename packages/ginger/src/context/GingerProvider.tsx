import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type CSSProperties,
} from "react";
import { computeEndedTransition } from "../core/transitions";
import { clampPlaybackRate, clampVolume, gingerReducer, createInitialState } from "../core/playbackReducer";
import type { GingerProviderProps, PlaylistMeta, RepeatMode, Track } from "../types";
import { GingerContext, type GingerContextValue } from "./GingerContext";

const defaultProviderStyle: CSSProperties = {
  ["--ginger-primary-color" as string]: "#111827",
  ["--ginger-muted-color" as string]: "#6b7280",
  ["--ginger-font-size" as string]: "14px",
  ["--ginger-font-family" as string]: "system-ui, sans-serif",
  ["--ginger-playlist-row-padding" as string]: "6px 8px",
  ["--ginger-artwork-radius" as string]: "6px",
  ["--ginger-artwork-bg" as string]: "#f3f4f6",
};

export function GingerProvider({
  children,
  initialTracks = [],
  initialIndex = 0,
  initialPlaylistMeta = null,
  initialShuffle = false,
  initialRepeatMode = "off",
  initialPaused = true,
  initialVolume = 1,
  initialMuted = false,
  initialPlaybackRate = 1,
  className,
  style,
  onTrackChange,
  onPlay,
  onPause,
  onQueueEnd,
  onError,
}: GingerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, dispatch] = useReducer(
    gingerReducer,
    undefined,
    () =>
      createInitialState({
        tracks: initialTracks,
        currentIndex: initialIndex,
        playlistMeta: initialPlaylistMeta,
        isPaused: initialPaused,
        isShuffled: initialShuffle,
        repeatMode: initialRepeatMode,
        volume: initialVolume,
        muted: initialMuted,
        playbackRate: initialPlaybackRate,
      }),
  );
  const stateRef = useRef(state);

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

  const playTrackAt = useCallback((index: number) => {
    dispatch({ type: "SET_INDEX", payload: { index, autoPlay: true } });
  }, []);

  const selectTrackAt = useCallback((index: number) => {
    dispatch({ type: "SET_INDEX", payload: { index, autoPlay: false } });
  }, []);

  const setPlaylistMeta = useCallback((meta: PlaylistMeta | null) => {
    dispatch({ type: "SET_PLAYLIST_META", payload: meta });
  }, []);

  const currentUrl = state.tracks[state.currentIndex]?.fileUrl;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (state.isPaused) el.pause();
    else
      void el.play().catch((e: unknown) => {
        dispatch({ type: "PAUSE" });
        const msg = e instanceof Error ? e.message : "Playback failed";
        onError?.(msg);
      });
  }, [state.isPaused, currentUrl, onError]);

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

  const value = useMemo<GingerContextValue>(
    () => ({
      state,
      dispatch,
      audioRef,
      notifyEnded,
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
      playTrackAt,
      selectTrackAt,
      setPlaylistMeta,
    }),
    [
      cycleRepeat,
      dispatch,
      next,
      notifyEnded,
      pause,
      play,
      playTrackAt,
      selectTrackAt,
      prev,
      seek,
      setMuted,
      setPlaybackRate,
      setQueue,
      setRepeatMode,
      setPlaylistMeta,
      setVolume,
      state,
      toggleMute,
      togglePlayPause,
      toggleShuffle,
    ],
  );

  const mergedStyle = useMemo(() => ({ ...defaultProviderStyle, ...style }), [style]);

  return (
    <GingerContext.Provider value={value}>
      <div className={className} style={mergedStyle}>
        {children}
      </div>
    </GingerContext.Provider>
  );
}
