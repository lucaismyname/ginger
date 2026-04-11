import { describe, expect, it } from "vitest";
import { createInitialState } from "./playbackReducer";
import { computeEndedTransition, computeNextIndex, computePrevIndex } from "./transitions";
import type { Track } from "../types";

const t = (id: string, url: string): Track => ({ id, title: id, fileUrl: url });

describe("computeEndedTransition", () => {
  it("stops on empty queue", () => {
    const state = createInitialState({ tracks: [] });
    expect(computeEndedTransition(state)).toEqual({ kind: "stop", nextIndex: 0 });
  });

  it("replays same track when repeat one", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      repeatMode: "one",
    });
    expect(computeEndedTransition(state)).toEqual({ kind: "replay_same" });
  });

  it("advances when not at end", () => {
    const state = createInitialState({ tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")] });
    expect(computeEndedTransition(state)).toEqual({ kind: "advance", nextIndex: 1 });
  });

  it("wraps to 0 when repeat all at last track", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 1,
      repeatMode: "all",
    });
    expect(computeEndedTransition(state)).toEqual({ kind: "wrap", nextIndex: 0 });
  });

  it("stops at last track when repeat off", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 1,
      repeatMode: "off",
    });
    expect(computeEndedTransition(state)).toEqual({ kind: "stop", nextIndex: 1 });
  });
});

describe("computeNextIndex", () => {
  it("returns 0 for empty queue", () => {
    const state = createInitialState({ tracks: [] });
    expect(computeNextIndex(state)).toBe(0);
  });

  it("increments until last", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 0,
    });
    expect(computeNextIndex(state)).toBe(1);
  });

  it("stays at last index when repeat off", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 1,
      repeatMode: "off",
    });
    expect(computeNextIndex(state)).toBe(1);
  });

  it("wraps to 0 when repeat all at end", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 1,
      repeatMode: "all",
    });
    expect(computeNextIndex(state)).toBe(0);
  });
});

describe("computePrevIndex", () => {
  it("returns 0 for empty queue", () => {
    const state = createInitialState({ tracks: [] });
    expect(computePrevIndex(state)).toBe(0);
  });

  it("decrements when not at start", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 1,
    });
    expect(computePrevIndex(state)).toBe(0);
  });

  it("stays at 0 when repeat off", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 0,
      repeatMode: "off",
    });
    expect(computePrevIndex(state)).toBe(0);
  });

  it("wraps to last when repeat all at start", () => {
    const state = createInitialState({
      tracks: [t("a", "/a.mp3"), t("b", "/b.mp3")],
      currentIndex: 0,
      repeatMode: "all",
    });
    expect(computePrevIndex(state)).toBe(1);
  });
});
