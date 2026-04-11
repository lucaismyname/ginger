import type { GingerProviderProps } from "../types";

/** Find the `<audio>` element rendered by `Ginger.Player` within a RTL container. */
export function queryAudio(container: HTMLElement): HTMLAudioElement | null {
  return container.querySelector("audio");
}

export type NavigatorMediaSessionInstall = {
  /** Mock `navigator.mediaSession` with writable `metadata` and `playbackState`. */
  mock: MediaSession;
  /** Last handler registered for an action (for assertions). */
  getHandler: (action: MediaSessionAction) => MediaSessionActionHandler | null;
  /** Restore previous `navigator.mediaSession`. */
  restore: () => void;
};

/**
 * Installs a minimal `navigator.mediaSession` for tests. Does not depend on Vitest.
 * Call `restore()` in `afterEach`.
 */
export function installNavigatorMediaSession(): NavigatorMediaSessionInstall {
  const handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler | null>> = {};
  const mock = {
    metadata: null as MediaMetadata | null,
    playbackState: "none" as MediaSessionPlaybackState,
    setActionHandler(action: MediaSessionAction, handler: MediaSessionActionHandler | null) {
      handlers[action] = handler ?? null;
    },
  } as MediaSession;

  const prev = typeof navigator !== "undefined" ? navigator.mediaSession : undefined;
  Object.defineProperty(navigator, "mediaSession", {
    value: mock,
    configurable: true,
    writable: true,
  });

  return {
    mock,
    getHandler: (action: MediaSessionAction) => handlers[action] ?? null,
    restore: () => {
      if (prev !== undefined) {
        Object.defineProperty(navigator, "mediaSession", {
          value: prev,
          configurable: true,
          writable: true,
        });
      }
    },
  };
}

export type RenderGingerProviderOptions = Partial<
  Pick<
    GingerProviderProps,
    | "initialIndex"
    | "initialPaused"
    | "initialPlaybackMode"
    | "initialPlaylistMeta"
    | "mediaSession"
    | "onQueueEnd"
    | "onError"
    | "persistence"
  >
> & {
  /** When false, omit `Ginger.Player` (e.g. to assert missing-audio warnings). Default true. */
  withPlayer?: boolean;
};
