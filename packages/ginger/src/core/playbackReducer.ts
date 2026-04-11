import type { GingerAction, GingerState, RepeatMode, Track } from "../types";
import { clampIndex, findIndexByFileUrl, shuffleWithAnchor } from "./queue";
import { computeNextIndex, computePrevIndex, cycleRepeatMode } from "./transitions";

const defaultMedia = {
  currentTime: 0,
  duration: 0,
  bufferedFraction: 0,
  isBuffering: false,
  errorMessage: null as string | null,
};

export function createInitialState(params: {
  tracks: Track[];
  currentIndex?: number;
  playlistMeta?: GingerState["playlistMeta"];
  isPaused?: boolean;
  isShuffled?: boolean;
  repeatMode?: RepeatMode;
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
    isPaused: params.isPaused ?? true,
    isShuffled: Boolean(params.isShuffled && ordered.length > 1),
    repeatMode: params.repeatMode ?? "off",
    originalTracks,
    playlistMeta: params.playlistMeta ?? null,
    ...defaultMedia,
  };
}

export function gingerReducer(state: GingerState, action: GingerAction): GingerState {
  switch (action.type) {
    case "INIT": {
      const { tracks, currentIndex, playlistMeta, isPaused, isShuffled, repeatMode } = action.payload;
      return createInitialState({
        tracks,
        currentIndex,
        playlistMeta: playlistMeta ?? null,
        isPaused: isPaused ?? true,
        isShuffled: isShuffled ?? false,
        repeatMode: repeatMode ?? "off",
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
        ...defaultMedia,
      };
    }
    case "SET_INDEX": {
      const idx = clampIndex(action.payload.index, state.tracks.length);
      const ap = action.payload.autoPlay;
      const isPaused =
        ap === true ? false : ap === false ? true : state.isPaused;
      return {
        ...state,
        currentIndex: idx,
        ...defaultMedia,
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
      const fileUrl = current?.fileUrl ?? "";
      const newIndex = findIndexByFileUrl(restored, fileUrl);
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
        ...(same ? {} : defaultMedia),
        isPaused: same ? state.isPaused : false,
      };
    }
    case "PREV": {
      const prevIndex = computePrevIndex(state);
      const same = prevIndex === state.currentIndex;
      return {
        ...state,
        currentIndex: prevIndex,
        ...(same ? {} : defaultMedia),
        isPaused: same ? state.isPaused : false,
      };
    }
    case "MEDIA_TIME_UPDATE":
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: Number.isFinite(action.payload.duration) ? action.payload.duration : state.duration,
        bufferedFraction: action.payload.bufferedFraction,
        isBuffering: false,
      };
    case "MEDIA_LOADED_METADATA":
      return {
        ...state,
        duration: Number.isFinite(action.payload.duration) ? action.payload.duration : state.duration,
        bufferedFraction: action.payload.bufferedFraction,
        errorMessage: null,
      };
    case "SET_PLAYLIST_META":
      return { ...state, playlistMeta: action.payload };
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
    default:
      return state;
  }
}
