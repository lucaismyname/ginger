import { createContext, useContext, useMemo, type Dispatch, type MutableRefObject } from "react";
import type {
  GingerAction,
  GingerInitPayload,
  GingerMediaSlice,
  GingerPlaybackSlice,
  GingerState,
  PlaybackMode,
  PlaylistMeta,
  RepeatMode,
  Track,
} from "../types";

export type GingerPlaybackActions = {
  init: (payload: GingerInitPayload) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  prev: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  setQueue: (tracks: Track[], currentIndex?: number) => void;
  insertTrackAt: (track: Track, index?: number, autoPlay?: boolean) => void;
  removeTrackAt: (index: number) => void;
  moveTrack: (fromIndex: number, toIndex: number) => void;
  enqueueNext: (track: Track) => void;
  playTrackAt: (index: number) => void;
  selectTrackAt: (index: number) => void;
  setPlaylistMeta: (meta: PlaylistMeta | null) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  dispatch: Dispatch<GingerAction>;
};

export type GingerPlaybackContextValue = GingerPlaybackSlice & GingerPlaybackActions;

export type GingerMediaActions = {
  seek: (timeSeconds: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  notifyEnded: () => void;
  dispatch: Dispatch<GingerAction>;
};

export type GingerMediaContextValue = GingerMediaSlice & GingerMediaActions;

const GingerPlaybackContext = createContext<GingerPlaybackContextValue | null>(null);
const GingerMediaContext = createContext<GingerMediaContextValue | null>(null);

export function useGingerPlayback(): GingerPlaybackContextValue {
  const ctx = useContext(GingerPlaybackContext);
  if (!ctx) throw new Error("Ginger hooks must be used within <Ginger.Provider>");
  return ctx;
}

export function useGingerMedia(): GingerMediaContextValue {
  const ctx = useContext(GingerMediaContext);
  if (!ctx) throw new Error("Ginger hooks must be used within <Ginger.Provider>");
  return ctx;
}

/** Full merged state; prefer over `useGingerContext().state` so updates follow playback vs media splits. */
export function useGingerState(): GingerState {
  const pb = useGingerPlayback();
  const md = useGingerMedia();
  return useMemo(() => gingerStateFromContextValues(pb, md), [pb, md]);
}

/** Merge playback + media slices (for selectors and `useGinger`). */
export function gingerStateFromContexts(
  playback: GingerPlaybackSlice,
  media: GingerMediaSlice,
): GingerState {
  return { ...playback, ...media };
}

/** Merge full context values into `GingerState` (strips action fields). */
export function gingerStateFromContextValues(
  pb: GingerPlaybackContextValue,
  md: GingerMediaContextValue,
): GingerState {
  const {
    init: _i,
    play: _p,
    pause: _pa,
    togglePlayPause: _t,
    next: _n,
    prev: _pr,
    setRepeatMode: _sr,
    cycleRepeat: _cr,
    toggleShuffle: _ts,
    setQueue: _sq,
    insertTrackAt: _ita,
    removeTrackAt: _rta,
    moveTrack: _mt,
    enqueueNext: _en,
    playTrackAt: _pta,
    selectTrackAt: _sta,
    setPlaylistMeta: _spm,
    setPlaybackMode: _spbm,
    dispatch: _d1,
    ...playbackRest
  } = pb;
  const {
    seek: _sk,
    setVolume: _sv,
    setMuted: _sm,
    toggleMute: _tm,
    setPlaybackRate: _spr,
    audioRef: _ar,
    notifyEnded: _ne,
    dispatch: _d2,
    ...mediaRest
  } = md;
  return { ...playbackRest, ...mediaRest };
}

export { GingerPlaybackContext, GingerMediaContext };
