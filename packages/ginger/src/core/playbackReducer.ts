import type { GingerAction, GingerState, RepeatMode, Track } from "../types";
import {
  addNextTrack,
  clampIndex,
  findIndexByTrackIdentity,
  insertTrackAt,
  moveTrack,
  removeTrackAt,
  shuffleWithAnchor,
} from "./queue";
import { computeNextIndex, computePrevIndex, cycleRepeatMode } from "./transitions";

export function clampVolume(v: number): number {
  if (!Number.isFinite(v)) return 1;
  return Math.min(1, Math.max(0, v));
}

export function clampPlaybackRate(r: number): number {
  if (!Number.isFinite(r)) return 1;
  return Math.min(4, Math.max(0.25, r));
}

/** Reset when the active track / position changes; keeps volume / mute / speed */
const resetTimingOnly = {
  currentTime: 0,
  duration: 0,
  bufferedFraction: 0,
  isBuffering: false,
  errorMessage: null as string | null,
};

const defaultMedia = {
  ...resetTimingOnly,
  volume: 1,
  muted: false,
  playbackRate: 1,
};

export function createInitialState(params: {
  tracks: Track[];
  currentIndex?: number;
  playlistMeta?: GingerState["playlistMeta"];
  isPaused?: boolean;
  isShuffled?: boolean;
  repeatMode?: RepeatMode;
  playbackMode?: GingerState["playbackMode"];
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
}): GingerState {
  const tracks = [...params.tracks];
  let currentIndex = clampIndex(params.currentIndex ?? 0, tracks.length);
  let originalTracks: Track[] | null = null;
  let ordered = tracks;

  if (params.isShuffled && tracks.length > 1) {
    originalTracks = [...tracks];
    ordered = shuffleWithAnchor(tracks, currentIndex);
    currentIndex = 0;
  }

  return {
    tracks: ordered,
    currentIndex,
    playbackMode: params.playbackMode ?? "playlist",
    isPaused: params.isPaused ?? true,
    isShuffled: Boolean(params.isShuffled && ordered.length > 1),
    repeatMode: params.repeatMode ?? "off",
    originalTracks,
    playlistMeta: params.playlistMeta ?? null,
    ...defaultMedia,
    volume: clampVolume(params.volume ?? 1),
    muted: params.muted ?? false,
    playbackRate: clampPlaybackRate(params.playbackRate ?? 1),
  };
}

export function gingerReducer(state: GingerState, action: GingerAction): GingerState {
  switch (action.type) {
    case "INIT": {
      const {
        tracks,
        currentIndex,
        playlistMeta,
        isPaused,
        isShuffled,
        repeatMode,
        playbackMode,
        volume,
        muted,
        playbackRate,
      } = action.payload;
      return createInitialState({
        tracks,
        currentIndex,
        playlistMeta: playlistMeta ?? null,
        isPaused: isPaused ?? true,
        isShuffled: isShuffled ?? false,
        repeatMode: repeatMode ?? "off",
        playbackMode: playbackMode ?? "playlist",
        volume,
        muted,
        playbackRate,
      });
    }
    case "SET_QUEUE": {
      const { tracks, currentIndex } = action.payload;
      const next = [...tracks];
      const idx = clampIndex(currentIndex ?? state.currentIndex, next.length);
      return {
        ...state,
        tracks: next,
        currentIndex: idx,
        isShuffled: false,
        originalTracks: null,
        ...resetTimingOnly,
      };
    }
    case "INSERT_TRACK": {
      const insertIndex = action.payload.index ?? state.tracks.length;
      const tracks = insertTrackAt(state.tracks, action.payload.track, insertIndex);
      if (action.payload.autoPlay) {
        const idx = clampIndex(insertIndex, tracks.length);
        return {
          ...state,
          tracks,
          currentIndex: idx,
          isShuffled: false,
          originalTracks: null,
          isPaused: false,
          ...resetTimingOnly,
        };
      }
      const currentIndex =
        insertIndex <= state.currentIndex ? state.currentIndex + 1 : state.currentIndex;
      return {
        ...state,
        tracks,
        isShuffled: false,
        originalTracks: null,
        currentIndex: clampIndex(currentIndex, tracks.length),
      };
    }
    case "REMOVE_TRACK": {
      const index = action.payload.index;
      const tracks = removeTrackAt(state.tracks, index);
      const currentIndex =
        index < state.currentIndex
          ? state.currentIndex - 1
          : index === state.currentIndex
            ? Math.min(state.currentIndex, Math.max(0, tracks.length - 1))
            : state.currentIndex;
      return {
        ...state,
        tracks,
        isShuffled: false,
        originalTracks: null,
        currentIndex: clampIndex(currentIndex, tracks.length),
        ...(index === state.currentIndex ? resetTimingOnly : {}),
      };
    }
    case "MOVE_TRACK": {
      const { fromIndex, toIndex } = action.payload;
      const tracks = moveTrack(state.tracks, fromIndex, toIndex);
      let currentIndex = state.currentIndex;
      if (state.currentIndex === fromIndex) currentIndex = toIndex;
      else if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) currentIndex -= 1;
      else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) currentIndex += 1;
      return {
        ...state,
        tracks,
        isShuffled: false,
        originalTracks: null,
        currentIndex: clampIndex(currentIndex, tracks.length),
      };
    }
    case "ADD_NEXT": {
      const tracks = addNextTrack(state.tracks, state.currentIndex, action.payload.track);
      return {
        ...state,
        tracks,
        isShuffled: false,
        originalTracks: null,
      };
    }
    case "SET_INDEX": {
      const idx = clampIndex(action.payload.index, state.tracks.length);
      const ap = action.payload.autoPlay;
      const isPaused = ap === true ? false : ap === false ? true : state.isPaused;
      return {
        ...state,
        currentIndex: idx,
        ...resetTimingOnly,
        isPaused,
      };
    }
    case "PLAY":
      return { ...state, isPaused: false };
    case "PAUSE":
      return { ...state, isPaused: true };
    case "TOGGLE_PAUSE":
      return { ...state, isPaused: !state.isPaused };
    case "SET_REPEAT":
      return { ...state, repeatMode: action.payload };
    case "CYCLE_REPEAT":
      return { ...state, repeatMode: cycleRepeatMode(state.repeatMode) };
    case "TOGGLE_SHUFFLE": {
      if (state.tracks.length <= 1) return { ...state, isShuffled: false, originalTracks: null };
      if (!state.isShuffled) {
        const snapshot = [...state.tracks];
        const shuffled = shuffleWithAnchor(snapshot, state.currentIndex);
        return {
          ...state,
          isShuffled: true,
          originalTracks: snapshot,
          tracks: shuffled,
          currentIndex: 0,
        };
      }
      const restored = state.originalTracks ? [...state.originalTracks] : [...state.tracks];
      const current = state.tracks[state.currentIndex];
      const newIndex = findIndexByTrackIdentity(restored, current);
      return {
        ...state,
        isShuffled: false,
        originalTracks: null,
        tracks: restored,
        currentIndex: clampIndex(newIndex, restored.length),
      };
    }
    case "NEXT": {
      const nextIndex = computeNextIndex(state);
      const same = nextIndex === state.currentIndex;
      return {
        ...state,
        currentIndex: nextIndex,
        ...(same ? {} : resetTimingOnly),
        isPaused: same ? state.isPaused : false,
      };
    }
    case "PREV": {
      const prevIndex = computePrevIndex(state);
      const same = prevIndex === state.currentIndex;
      return {
        ...state,
        currentIndex: prevIndex,
        ...(same ? {} : resetTimingOnly),
        isPaused: same ? state.isPaused : false,
      };
    }
    case "MEDIA_TIME_UPDATE":
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: Number.isFinite(action.payload.duration)
          ? action.payload.duration
          : state.duration,
        bufferedFraction: action.payload.bufferedFraction,
        isBuffering: false,
      };
    case "MEDIA_LOADED_METADATA":
      return {
        ...state,
        duration: Number.isFinite(action.payload.duration)
          ? action.payload.duration
          : state.duration,
        bufferedFraction: action.payload.bufferedFraction,
        errorMessage: null,
      };
    case "SET_PLAYLIST_META":
      return { ...state, playlistMeta: action.payload };
    case "SET_PLAYBACK_MODE":
      return { ...state, playbackMode: action.payload };
    case "MEDIA_ERROR":
      return {
        ...state,
        errorMessage: action.payload.message,
        isPaused: true,
        isBuffering: false,
      };
    case "MEDIA_WAITING":
      return { ...state, isBuffering: true };
    case "MEDIA_CANPLAY":
      return { ...state, isBuffering: false, errorMessage: null };
    case "MEDIA_PLAY":
      return { ...state, isPaused: false, isBuffering: false };
    case "MEDIA_PAUSE":
      return { ...state, isPaused: true };
    case "RESET_MEDIA_TIMES":
      return { ...state, currentTime: 0, duration: 0, bufferedFraction: 0 };
    case "MEDIA_SOURCE_CLEARED":
      return { ...state, ...resetTimingOnly };
    case "SET_VOLUME":
      return { ...state, volume: clampVolume(action.payload) };
    case "SET_MUTED":
      return { ...state, muted: action.payload };
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "SET_PLAYBACK_RATE":
      return { ...state, playbackRate: clampPlaybackRate(action.payload) };
    case "MEDIA_VOLUME_SYNC": {
      const { volume, muted } = action.payload;
      const v = clampVolume(volume);
      if (v === state.volume && muted === state.muted) return state;
      return { ...state, volume: v, muted };
    }
    default: {
      const _exhaustive: never = action;
      void _exhaustive;
      return state;
    }
  }
}
