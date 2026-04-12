import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createInitialState } from "../core/playbackReducer";
import {
  type NavigatorMediaSessionInstall,
  installNavigatorMediaSession,
} from "../testing/helpers";
import type { GingerMediaSessionOptions } from "../types";
import { useMediaSessionBridge } from "./useMediaSession";
import type { MediaSessionBridgeActions } from "./useMediaSession";

afterEach(cleanup);

function Bridge({
  enabled,
  state,
  actions,
  options,
}: {
  enabled: boolean;
  state: ReturnType<typeof createInitialState>;
  actions: MediaSessionBridgeActions;
  options?: GingerMediaSessionOptions;
}) {
  useMediaSessionBridge(enabled, state, actions, options);
  return null;
}

describe("useMediaSessionBridge", () => {
  let restore: () => void;
  let getHandler: NavigatorMediaSessionInstall["getHandler"];
  let getLastPositionState: NavigatorMediaSessionInstall["getLastPositionState"];

  beforeEach(() => {
    const inst = installNavigatorMediaSession();
    restore = inst.restore;
    getHandler = inst.getHandler;
    getLastPositionState = inst.getLastPositionState;
  });

  afterEach(() => {
    restore();
  });

  it("writes metadata with playlist artwork fallback when the track has no artwork", async () => {
    const state = createInitialState({
      tracks: [{ id: "1", title: "Title", artist: "Artist", album: "Album", fileUrl: "/t.mp3" }],
      playlistMeta: { artworkUrl: "https://cdn.example/pl.jpg" },
    });
    const actions: MediaSessionBridgeActions = {
      play: vi.fn(),
      pause: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
      seek: vi.fn(),
    };

    await act(async () => {
      render(<Bridge enabled state={state} actions={actions} />);
    });

    const md = navigator.mediaSession.metadata as MediaMetadata | null;
    expect(md?.title).toBe("Title");
    expect(md?.artist).toBe("Artist");
    expect(md?.album).toBe("Album");
    expect(md?.artwork?.[0]?.src).toBe("https://cdn.example/pl.jpg");
  });

  it("mirrors paused state to playbackState", async () => {
    const playing = createInitialState({
      tracks: [{ id: "1", title: "T", fileUrl: "/t.mp3" }],
      isPaused: false,
    });
    const actions: MediaSessionBridgeActions = {
      play: vi.fn(),
      pause: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
      seek: vi.fn(),
    };

    const { rerender } = render(<Bridge enabled state={playing} actions={actions} />);
    await act(async () => {});
    expect(navigator.mediaSession.playbackState).toBe("playing");

    const paused = { ...playing, isPaused: true };
    await act(async () => {
      rerender(<Bridge enabled state={paused} actions={actions} />);
    });
    expect(navigator.mediaSession.playbackState).toBe("paused");
  });

  it("registers seekto to call seek with finite seekTime", async () => {
    const state = createInitialState({
      tracks: [{ id: "1", title: "T", fileUrl: "/t.mp3" }],
    });
    const seek = vi.fn();
    const actions: MediaSessionBridgeActions = {
      play: vi.fn(),
      pause: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
      seek,
    };

    await act(async () => {
      render(<Bridge enabled state={state} actions={actions} />);
    });

    const handler = getHandler("seekto");
    expect(handler).toBeTruthy();
    handler?.({ seekTime: 42 } as Parameters<NonNullable<typeof handler>>[0]);
    expect(seek).toHaveBeenCalledWith(42);
  });

  it("registers seekforward when seekForwardSeconds is set", async () => {
    const state = {
      ...createInitialState({
        tracks: [{ id: "1", title: "T", fileUrl: "/t.mp3" }],
      }),
      currentTime: 10,
      duration: 100,
    };
    const seek = vi.fn();
    const actions: MediaSessionBridgeActions = {
      play: vi.fn(),
      pause: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
      seek,
    };

    await act(async () => {
      render(
        <Bridge enabled state={state} actions={actions} options={{ seekForwardSeconds: 15 }} />,
      );
    });

    const handler = getHandler("seekforward");
    expect(handler).toBeTruthy();
    handler?.({} as MediaSessionActionDetails);
    expect(seek).toHaveBeenCalledWith(25);
  });

  it("updates setPositionState when positionState is enabled", async () => {
    const state = {
      ...createInitialState({
        tracks: [{ id: "1", title: "T", fileUrl: "/t.mp3" }],
        playbackRate: 1.5,
      }),
      currentTime: 30,
      duration: 120,
    };
    const actions: MediaSessionBridgeActions = {
      play: vi.fn(),
      pause: vi.fn(),
      next: vi.fn(),
      prev: vi.fn(),
      seek: vi.fn(),
    };

    await act(async () => {
      render(<Bridge enabled state={state} actions={actions} options={{ positionState: true }} />);
    });

    const pos = getLastPositionState();
    expect(pos).not.toBeNull();
    expect(pos?.duration).toBe(120);
    expect(pos?.position).toBe(30);
    expect(pos?.playbackRate).toBe(1.5);
  });
});
