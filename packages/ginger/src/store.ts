import {
  clampPlaybackRate,
  clampVolume,
  createInitialState,
  gingerReducer,
} from "./core/playbackReducer";
import type {
  GingerAction,
  GingerInitPayload,
  GingerState,
  PlaylistMeta,
  RepeatMode,
  Track,
} from "./types";

export type GingerStoreOptions = {
  tracks?: Track[];
  currentIndex?: number;
  playlistMeta?: PlaylistMeta | null;
  isPaused?: boolean;
  isShuffled?: boolean;
  repeatMode?: RepeatMode;
  playbackMode?: GingerState["playbackMode"];
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
};

export type GingerStore = {
  /** Returns the current state snapshot. */
  getState: () => GingerState;
  /** Dispatch an action to update state. Synchronously updates state and notifies listeners. */
  dispatch: (action: GingerAction) => void;
  /**
   * Subscribe to state changes. The listener is called after every `dispatch` that produces
   * a new state object. Returns an unsubscribe function.
   */
  subscribe: (listener: (state: GingerState) => void) => () => void;
  /** Convenience: re-initialise with a new set of init options (equivalent to `dispatch({ type: "INIT", ... })`). */
  init: (payload: GingerInitPayload) => void;
  /** Clamp helpers re-exported for convenience. */
  clampVolume: typeof clampVolume;
  clampPlaybackRate: typeof clampPlaybackRate;
};

/**
 * Framework-agnostic store wrapping `gingerReducer`.
 * Usable outside React — e.g. in Svelte, Vue, Node.js testing, or server-side rendering contexts.
 *
 * @example
 * ```ts
 * import { createGingerStore } from "@lucaismyname/ginger";
 *
 * const store = createGingerStore({ tracks: myTracks });
 * const unsub = store.subscribe((state) => console.log(state.currentIndex));
 * store.dispatch({ type: "NEXT" });
 * unsub();
 * ```
 */
export function createGingerStore(options: GingerStoreOptions = {}): GingerStore {
  let state = createInitialState({
    tracks: options.tracks ?? [],
    currentIndex: options.currentIndex,
    playlistMeta: options.playlistMeta,
    isPaused: options.isPaused,
    isShuffled: options.isShuffled,
    repeatMode: options.repeatMode,
    playbackMode: options.playbackMode,
    volume: options.volume,
    muted: options.muted,
    playbackRate: options.playbackRate,
  });

  const listeners = new Set<(state: GingerState) => void>();

  const dispatch = (action: GingerAction): void => {
    const next = gingerReducer(state, action);
    if (next !== state) {
      state = next;
      for (const listener of listeners) {
        listener(state);
      }
    }
  };

  const subscribe = (listener: (state: GingerState) => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const init = (payload: GingerInitPayload): void => {
    dispatch({ type: "INIT", payload });
  };

  return {
    getState: () => state,
    dispatch,
    subscribe,
    init,
    clampVolume,
    clampPlaybackRate,
  };
}
