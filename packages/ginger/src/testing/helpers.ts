import userEvent from "@testing-library/user-event";
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
  const handlers: Partial<
    Record<MediaSessionAction, MediaSessionActionHandler | null>
  > = {};
  const mock = {
    metadata: null as MediaMetadata | null,
    playbackState: "none" as MediaSessionPlaybackState,
    setActionHandler(
      action: MediaSessionAction,
      handler: MediaSessionActionHandler | null,
    ) {
      handlers[action] = handler ?? null;
    },
  } as MediaSession;

  const prev =
    typeof navigator !== "undefined" ? navigator.mediaSession : undefined;
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

/** Create a preconfigured user-event instance for interaction tests. */
export function setupUser() {
  return userEvent.setup();
}

/** Dispatch `loadedmetadata` with a deterministic duration value. */
export function emitLoadedMetadata(audio: HTMLAudioElement, duration: number) {
  Object.defineProperty(audio, "duration", {
    configurable: true,
    value: duration,
  });
  audio.dispatchEvent(new Event("loadedmetadata"));
}

/** Dispatch `timeupdate` and optionally update duration before emitting. */
export function emitTimeUpdate(
  audio: HTMLAudioElement,
  currentTime: number,
  duration?: number,
) {
  Object.defineProperty(audio, "currentTime", {
    configurable: true,
    value: currentTime,
    writable: true,
  });
  if (duration !== undefined) {
    Object.defineProperty(audio, "duration", {
      configurable: true,
      value: duration,
    });
  }
  audio.dispatchEvent(new Event("timeupdate"));
}

/** Dispatch an `ended` event from an audio element. */
export function emitEnded(audio: HTMLAudioElement) {
  audio.dispatchEvent(new Event("ended"));
}

export type QueueSnapshot = {
  currentIndex: number;
  tracks: Array<{ id?: string; fileUrl: string }>;
  currentTrack?: { id?: string; fileUrl: string } | null;
};

export type ExpectedQueueState = {
  currentIndex?: number;
  length?: number;
  currentId?: string;
};

/**
 * Lightweight queue assertion helper for test runners.
 * Throws a readable error when expected queue state does not match.
 */
export function expectQueueState(
  snapshot: QueueSnapshot,
  expected: ExpectedQueueState,
) {
  if (
    expected.currentIndex !== undefined &&
    snapshot.currentIndex !== expected.currentIndex
  ) {
    throw new Error(
      `Expected currentIndex ${expected.currentIndex}, received ${snapshot.currentIndex}.`,
    );
  }
  if (
    expected.length !== undefined &&
    snapshot.tracks.length !== expected.length
  ) {
    throw new Error(
      `Expected queue length ${expected.length}, received ${snapshot.tracks.length}.`,
    );
  }
  if (expected.currentId !== undefined) {
    const actual = snapshot.currentTrack?.id;
    if (actual !== expected.currentId) {
      throw new Error(
        `Expected currentId ${expected.currentId}, received ${actual ?? "undefined"}.`,
      );
    }
  }
}
