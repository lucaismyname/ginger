import type { CSSProperties, ReactNode } from "react";

export type RepeatMode = "off" | "all" | "one";
export type PlaybackMode = "playlist" | "single";

/** Default control strings; override via `Ginger.Provider` `locale` prop. */
export type GingerLocaleMessages = {
  seek: string;
  volume: string;
  playbackSpeed: string;
  /** Accessible name for the chapter list (`Ginger.Current.Chapters`). */
  chaptersList: string;
  /** Accessible name for the synced lyrics list (`Ginger.Current.LyricsSynced`). */
  syncedLyricsList: string;
  nextTrack: string;
  previousTrack: string;
  shuffle: string;
  mute: string;
  unmute: string;
  play: string;
  pause: string;
  repeat: Record<RepeatMode, string>;
  playbackRateNormal: string;
  playbackRateTimes: (rate: number) => string;
};

export type Track = {
  /** Optional stable identity for duplicate URLs / queue mutations */
  id?: string;
  title: string;
  fileUrl: string;
  artist?: string;
  copyright?: string;
  description?: string;
  album?: string;
  artworkUrl?: string;
  genre?: string;
  year?: number;
  label?: string;
  isrc?: string;
  trackNumber?: number;
  lyrics?: string;
  lyricsTimed?: Array<{ time: number; text: string }>;
  chapters?: Array<{ title: string; startSeconds: number }>;
  /** Hint before metadata loads; never overrides finite media duration */
  durationSeconds?: number;
  /** App-specific data for custom UI; not read by Ginger core */
  metadata?: Record<string, unknown>;
};

export type PlaylistMeta = {
  id?: string;
  title?: string;
  subtitle?: string;
  artworkUrl?: string;
  copyright?: string;
  description?: string;
  /** App-specific data for custom UI; not read by Ginger core */
  metadata?: Record<string, unknown>;
};

export type PlaybackUiState = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

export type GingerMediaSlice = {
  currentTime: number;
  duration: number;
  bufferedFraction: number;
  isBuffering: boolean;
  errorMessage: string | null;
  /** 0…1, mirrored on HTMLMediaElement.volume */
  volume: number;
  /** Mirrored on HTMLMediaElement.muted */
  muted: boolean;
  /** Mirrored on HTMLMediaElement.playbackRate (typically 0.25–4) */
  playbackRate: number;
};

export type GingerPlaybackSlice = {
  tracks: Track[];
  currentIndex: number;
  playbackMode: PlaybackMode;
  isPaused: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  /** Canonical order before shuffle was enabled; null when shuffle is off */
  originalTracks: Track[] | null;
  playlistMeta: PlaylistMeta | null;
};

export type GingerState = GingerPlaybackSlice & GingerMediaSlice;

export type GingerAction =
  | {
      type: "INIT";
      payload: {
        tracks: Track[];
        currentIndex?: number;
        playlistMeta?: PlaylistMeta | null;
        isPaused?: boolean;
        isShuffled?: boolean;
        repeatMode?: RepeatMode;
        playbackMode?: PlaybackMode;
        volume?: number;
        muted?: boolean;
        playbackRate?: number;
      };
    }
  | { type: "SET_QUEUE"; payload: { tracks: Track[]; currentIndex?: number } }
  | { type: "INSERT_TRACK"; payload: { track: Track; index?: number; autoPlay?: boolean } }
  | { type: "REMOVE_TRACK"; payload: { index: number } }
  | { type: "MOVE_TRACK"; payload: { fromIndex: number; toIndex: number } }
  | { type: "ADD_NEXT"; payload: { track: Track } }
  | { type: "SET_INDEX"; payload: { index: number; autoPlay?: boolean } }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "SET_REPEAT"; payload: RepeatMode }
  | { type: "CYCLE_REPEAT" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | {
      type: "MEDIA_TIME_UPDATE";
      payload: { currentTime: number; duration: number; bufferedFraction: number };
    }
  | { type: "MEDIA_LOADED_METADATA"; payload: { duration: number; bufferedFraction: number } }
  | { type: "SET_PLAYLIST_META"; payload: PlaylistMeta | null }
  | { type: "SET_PLAYBACK_MODE"; payload: PlaybackMode }
  | { type: "MEDIA_SOURCE_CLEARED" }
  | { type: "MEDIA_ERROR"; payload: { message: string } }
  | { type: "MEDIA_WAITING" }
  | { type: "MEDIA_CANPLAY" }
  | { type: "MEDIA_PLAY" }
  | { type: "MEDIA_PAUSE" }
  | { type: "RESET_MEDIA_TIMES" }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_MUTED"; payload: boolean }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_PLAYBACK_RATE"; payload: number }
  | { type: "MEDIA_VOLUME_SYNC"; payload: { volume: number; muted: boolean } };

/** Payload for `INIT` / `init()`; replaces queue and media timing like a fresh mount. */
export type GingerInitPayload = Extract<GingerAction, { type: "INIT" }>["payload"];

export type GingerProviderProps = {
  children: ReactNode;
  initialTracks?: Track[];
  initialIndex?: number;
  initialPlaylistMeta?: PlaylistMeta | null;
  /** When true, shuffle starts enabled (still applies shuffle transform on mount if tracks.length > 1) */
  initialShuffle?: boolean;
  initialRepeatMode?: RepeatMode;
  initialPlaybackMode?: PlaybackMode;
  initialPaused?: boolean;
  /** 0…1, default 1 */
  initialVolume?: number;
  initialMuted?: boolean;
  /** Default 1; clamped ~0.25–4 on set */
  initialPlaybackRate?: number;
  /**
   * When set, changing this value dispatches `INIT` with the **current** `initialTracks`, `initialIndex`,
   * and other `initial*` props (same as calling `init()`). First paint still uses the reducer initializer only.
   */
  initialStateKey?: string | number;
  /** Override default English strings on built-in controls */
  locale?: Partial<GingerLocaleMessages>;
  mediaSession?: boolean;
  beforePlay?: () => boolean | Promise<boolean>;
  onPlayBlocked?: () => void;
  persistence?: GingerPersistenceAdapter;
  hydrateOnMount?: boolean;
  resumeOnTrackChange?: boolean;
  /** Disable default CSS variable/theme styles on provider root. */
  unstyled?: boolean;
  /**
   * Merge provider props (`className`, `style`, `data-ginger-playback`, `dir`) onto the single child
   * element instead of wrapping in an extra `div`. Use for layout systems that forbid wrapper nodes.
   */
  asChild?: boolean;
  className?: string;
  style?: CSSProperties;
  onTrackChange?: (track: Track | null, index: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onQueueEnd?: () => void;
  onError?: (message: string) => void;
};

export type GingerPersistenceAdapter = {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
};

export type DisplayBaseProps = {
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
  empty?: ReactNode;
};
