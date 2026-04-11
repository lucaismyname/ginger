import { describe, expect, it } from "vitest";
import { findIndexByTrackIdentity, trackIdentity } from "./queue";
import { createInitialState, gingerReducer } from "./playbackReducer";
import type { Track } from "../types";

const tracks: Track[] = [
  { id: "one", title: "One", fileUrl: "/one.mp3" },
  { id: "two", title: "Two", fileUrl: "/two.mp3" },
  { id: "three", title: "Three", fileUrl: "/three.mp3" },
];

describe("gingerReducer queue behavior", () => {
  it("resets shuffle metadata when replacing the queue", () => {
    const initial = createInitialState({
      tracks,
      currentIndex: 1,
      isShuffled: true,
    });

    const nextQueue: Track[] = [{ id: "fresh", title: "Fresh", fileUrl: "/fresh.mp3" }];
    const next = gingerReducer(initial, {
      type: "SET_QUEUE",
      payload: { tracks: nextQueue },
    });

    expect(next.tracks).toEqual(nextQueue);
    expect(next.isShuffled).toBe(false);
    expect(next.originalTracks).toBeNull();
  });

  it("restores the active track by stable id when disabling shuffle", () => {
    const duplicateUrls: Track[] = [
      { id: "intro", title: "Intro", fileUrl: "/same.mp3" },
      { id: "feature", title: "Feature", fileUrl: "/same.mp3" },
      { id: "outro", title: "Outro", fileUrl: "/other.mp3" },
    ];

    const shuffledState = {
      ...createInitialState({ tracks: duplicateUrls }),
      tracks: [duplicateUrls[1]!, duplicateUrls[2]!, duplicateUrls[0]!],
      currentIndex: 0,
      isShuffled: true,
      originalTracks: duplicateUrls,
    };

    const next = gingerReducer(shuffledState, { type: "TOGGLE_SHUFFLE" });

    expect(next.isShuffled).toBe(false);
    expect(next.currentIndex).toBe(1);
    expect(next.tracks[next.currentIndex]?.id).toBe("feature");
  });
});

describe("NEXT and PREV at boundaries", () => {
  it("NEXT at last track with repeat off keeps index and timing when same", () => {
    const state = createInitialState({
      tracks,
      currentIndex: 2,
      repeatMode: "off",
      isPaused: false,
    });
    const next = gingerReducer(state, { type: "NEXT" });
    expect(next.currentIndex).toBe(2);
    expect(next.isPaused).toBe(false);
  });

  it("NEXT at last track with repeat all wraps to 0", () => {
    const state = createInitialState({
      tracks,
      currentIndex: 2,
      repeatMode: "all",
    });
    const next = gingerReducer(state, { type: "NEXT" });
    expect(next.currentIndex).toBe(0);
    expect(next.isPaused).toBe(false);
  });

  it("PREV at first track with repeat off stays at 0", () => {
    const state = createInitialState({ tracks, currentIndex: 0, repeatMode: "off" });
    const next = gingerReducer(state, { type: "PREV" });
    expect(next.currentIndex).toBe(0);
  });

  it("PREV at first track with repeat all jumps to last", () => {
    const state = createInitialState({ tracks, currentIndex: 0, repeatMode: "all" });
    const next = gingerReducer(state, { type: "PREV" });
    expect(next.currentIndex).toBe(2);
  });
});

describe("INIT", () => {
  it("replaces state like createInitialState", () => {
    const s0 = createInitialState({ tracks, currentIndex: 1 });
    const s1 = gingerReducer(s0, {
      type: "INIT",
      payload: {
        tracks: [{ id: "x", title: "X", fileUrl: "/x.mp3" }],
        currentIndex: 0,
        isPaused: true,
      },
    });
    expect(s1.tracks).toEqual([{ id: "x", title: "X", fileUrl: "/x.mp3" }]);
    expect(s1.currentIndex).toBe(0);
    expect(s1.isShuffled).toBe(false);
  });
});

describe("track identity helpers", () => {
  it("prefers explicit ids over file URLs", () => {
    expect(trackIdentity({ id: "abc", title: "Track", fileUrl: "/same.mp3" })).toBe("id:abc");
  });

  it("falls back to fileUrl when no id is available", () => {
    const duplicateUrls: Track[] = [
      { title: "First", fileUrl: "/same.mp3" },
      { title: "Second", fileUrl: "/same.mp3" },
    ];

    expect(trackIdentity(duplicateUrls[0])).toBe("file:/same.mp3");
    expect(findIndexByTrackIdentity(duplicateUrls, duplicateUrls[1])).toBe(0);
  });
});
