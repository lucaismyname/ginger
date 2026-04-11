import { createContext, useContext, type Dispatch, type MutableRefObject } from "react";
import type { GingerAction, GingerInitPayload, GingerState, PlaylistMeta, RepeatMode, Track } from "../types";

export type GingerContextValue = {
  state: GingerState;
  dispatch: Dispatch<GingerAction>;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  notifyEnded: () => void;
  /** Full reset to match `createInitialState` / provider `initial*` props. */
  init: (payload: GingerInitPayload) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (timeSeconds: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  next: () => void;
  prev: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  setQueue: (tracks: Track[], currentIndex?: number) => void;
  playTrackAt: (index: number) => void;
  selectTrackAt: (index: number) => void;
  setPlaylistMeta: (meta: PlaylistMeta | null) => void;
};

const GingerContext = createContext<GingerContextValue | null>(null);

export function useGingerContext(): GingerContextValue {
  const ctx = useContext(GingerContext);
  if (!ctx) throw new Error("Ginger components must be used within <Ginger.Provider>");
  return ctx;
}

export { GingerContext };
