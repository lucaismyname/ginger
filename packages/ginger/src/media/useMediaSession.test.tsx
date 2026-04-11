import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { useMediaSessionBridge } from "./useMediaSession";
import { createInitialState } from "../core/playbackReducer";
import { installNavigatorMediaSession, type NavigatorMediaSessionInstall } from "../testing/helpers";
import type { MediaSessionBridgeActions } from "./useMediaSession";

afterEach(cleanup);

function Bridge({
  enabled,
  state,
  actions,
}: {
  enabled: boolean;
  state: ReturnType<typeof createInitialState>;
  actions: MediaSessionBridgeActions;
}) {
  useMediaSessionBridge(enabled, state, actions);
  return null;
}

describe("useMediaSessionBridge", () => {
  let restore: () => void;
  let getHandler: NavigatorMediaSessionInstall["getHandler"];

  beforeEach(() => {
    const inst = installNavigatorMediaSession();
    restore = inst.restore;
    getHandler = inst.getHandler;
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
});
