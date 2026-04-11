import type { CSSProperties, ReactNode } from "react";

export type RepeatMode = "off" | "all" | "one";

export type Track = {
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
  /** Hint before metadata loads; never overrides finite media duration */
  durationSeconds?: number;
};

export type PlaylistMeta = {
  id?: string;
  title?: string;
  subtitle?: string;
  artworkUrl?: string;
  copyright?: string;
  description?: string;
};

export type PlaybackUiState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "error";

export type GingerMediaSlice = {
  currentTime: number;
  duration: number;
  bufferedFraction: number;
  isBuffering: boolean;
  errorMessage: string | null;
};

export type GingerPlaybackSlice = {
  tracks: Track[];
  currentIndex: number;
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
      };
    }
  | { type: "SET_QUEUE"; payload: { tracks: Track[]; currentIndex?: number } }
  | { type: "SET_INDEX"; payload: { index: number; autoPlay?: boolean } }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "SET_REPEAT"; payload: RepeatMode }
  | { type: "CYCLE_REPEAT" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "MEDIA_TIME_UPDATE"; payload: { currentTime: number; duration: number; bufferedFraction: number } }
  | { type: "MEDIA_LOADED_METADATA"; payload: { duration: number; bufferedFraction: number } }
  | { type: "SET_PLAYLIST_META"; payload: PlaylistMeta | null }
  | { type: "MEDIA_ERROR"; payload: { message: string } }
  | { type: "MEDIA_WAITING" }
  | { type: "MEDIA_CANPLAY" }
  | { type: "MEDIA_PLAY" }
  | { type: "MEDIA_PAUSE" }
  | { type: "RESET_MEDIA_TIMES" };

export type GingerProviderProps = {
  children: ReactNode;
  initialTracks?: Track[];
  initialIndex?: number;
  initialPlaylistMeta?: PlaylistMeta | null;
  /** When true, shuffle starts enabled (still applies shuffle transform on mount if tracks.length > 1) */
  initialShuffle?: boolean;
  initialRepeatMode?: RepeatMode;
  initialPaused?: boolean;
  className?: string;
  style?: CSSProperties;
  onTrackChange?: (track: Track | null, index: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onQueueEnd?: () => void;
  onError?: (message: string) => void;
};

export type DisplayBaseProps = {
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
  empty?: ReactNode;
};
