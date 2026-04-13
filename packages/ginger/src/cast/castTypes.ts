/**
 * Minimal typings for the subset of the Google Cast Web Sender API used by Ginger.
 * Runtime objects come from the loaded Cast Framework script (`loadCastFramework`).
 */

/** Default Media Receiver application ID (audio/video). */
export const DEFAULT_MEDIA_RECEIVER_APP_ID = "CC1AD845";

export type CastImage = {
  url: string;
  width?: number;
  height?: number;
};

/** Instance shape from `new chrome.cast.media.MusicTrackMediaMetadata()`. */
export type CastMusicTrackMetadata = {
  metadataType: number;
  title?: string;
  artist?: string;
  albumName?: string;
  images?: CastImage[];
};

export type CastMediaInfoLike = {
  contentId: string;
  contentType: string;
  streamType?: string;
  metadata?: CastMusicTrackMetadata;
};

export type CastLoadRequestLike = {
  media: CastMediaInfoLike;
  autoplay?: boolean;
  currentTime?: number;
};

export type CastMediaInfoConstructor = new (
  contentId: string,
  contentType: string,
) => CastMediaInfoLike;
export type CastMusicTrackMetadataConstructor = new () => CastMusicTrackMetadata;
export type CastLoadRequestConstructor = new (mediaInfo: CastMediaInfoLike) => CastLoadRequestLike;

/** Subset of `chrome.cast.Session` methods we call (duck-typed). */
export type CastSessionLike = {
  loadMedia: (
    request: CastLoadRequestLike,
    successCallback: (media?: unknown) => void,
    errorCallback: (error: CastErrorLike) => void,
  ) => void;
  endSession: (successCallback: () => void, errorCallback: (error: CastErrorLike) => void) => void;
};

export type CastErrorLike = {
  code?: string;
  description?: string;
};

export type CastContextOptionsLike = {
  receiverApplicationId: string;
  autoJoinPolicy?: number;
  resumeSavedSession?: boolean;
};

/** `cast.framework.CastContext` duck type. */
export type CastFrameworkContextLike = {
  setOptions: (options: CastContextOptionsLike) => void;
  getCastState: () => number;
  getCurrentSession: () => CastSessionLike | null;
  addEventListener: (type: string, listener: (event: { sessionState?: string }) => void) => void;
  removeEventListener: (type: string, listener: (event: { sessionState?: string }) => void) => void;
  requestSession: () => Promise<void>;
};

export type CastFrameworkNamespace = {
  CastContext: {
    getInstance: () => CastFrameworkContextLike;
  };
  CastContextEventType: {
    CAST_STATE_CHANGED: string;
    SESSION_STATE_CHANGED: string;
  };
  CastState: {
    NO_DEVICES: number;
    NOT_CONNECTED: number;
    CONNECTING: number;
    CONNECTED: number;
  };
  SessionState: {
    SESSION_STARTED: string;
    SESSION_ENDED: string;
    SESSION_RESUMED: string;
  };
  RemotePlayer: new () => CastRemotePlayerLike;
  RemotePlayerController: new (player: CastRemotePlayerLike) => CastRemotePlayerControllerLike;
  RemotePlayerEventType: {
    IS_PAUSED_CHANGED: string;
    CURRENT_TIME_CHANGED: string;
    DURATION_CHANGED: string;
  };
};

export type CastRemotePlayerLike = {
  isPaused: boolean;
  currentTime: number;
  duration: number;
  controller?: CastRemotePlayerControllerLike;
  addEventListener: (type: string, handler: () => void) => void;
  removeEventListener: (type: string, handler: () => void) => void;
};

export type CastRemotePlayerControllerLike = {
  playOrPause: () => void;
  seek: (options: { value: number }) => void;
  stop: () => void;
};

export type ChromeCastNamespace = {
  media: {
    DEFAULT_MEDIA_RECEIVER_APP_ID: string;
    MediaInfo: CastMediaInfoConstructor;
    MusicTrackMediaMetadata: CastMusicTrackMetadataConstructor;
    LoadRequest: CastLoadRequestConstructor;
    MetadataType: {
      MUSIC_TRACK: number;
    };
    StreamType: {
      BUFFERED: string;
    };
  };
  isAvailable: boolean;
  AutoJoinPolicy: {
    ORIGIN_SCOPED: number;
    TAB_AND_ORIGIN_SCOPED: number;
  };
};

export type WindowWithCast = Window & {
  cast?: { framework?: CastFrameworkNamespace };
  chrome?: { cast?: ChromeCastNamespace };
};
