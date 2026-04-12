import { describe, expect, it, vi } from "vitest";
import { createGingerStore } from "./store";
import type { Track } from "./types";

const tracks: Track[] = [
  { id: "one", title: "One", fileUrl: "/one.mp3" },
  { id: "two", title: "Two", fileUrl: "/two.mp3" },
];

describe("createGingerStore", () => {
  it("dispatches updates and notifies subscribers", () => {
    const store = createGingerStore({ tracks, currentIndex: 0, isPaused: true });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.dispatch({ type: "NEXT" });

    expect(store.getState().currentIndex).toBe(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenLastCalledWith(store.getState());

    unsubscribe();
    store.dispatch({ type: "PREV" });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("re-initializes through init payload", () => {
    const store = createGingerStore({ tracks, currentIndex: 1 });

    store.init({
      tracks: [{ id: "three", title: "Three", fileUrl: "/three.mp3" }],
      currentIndex: 0,
      isPaused: false,
      repeatMode: "all",
      playbackMode: "single",
      isShuffled: false,
      volume: 1,
      muted: false,
      playbackRate: 1,
    });

    const state = store.getState();
    expect(state.tracks).toHaveLength(1);
    expect(state.tracks[state.currentIndex]?.id).toBe("three");
    expect(state.repeatMode).toBe("all");
    expect(state.playbackMode).toBe("single");
  });

  it("exposes clamp helpers", () => {
    const store = createGingerStore();
    expect(store.clampVolume(2)).toBe(1);
    expect(store.clampVolume(-1)).toBe(0);
    expect(store.clampPlaybackRate(20)).toBe(4);
    expect(store.clampPlaybackRate(0.1)).toBe(0.25);
  });
});
