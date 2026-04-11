import { describe, expect, it } from "vitest";
import {
  derivePlaybackUiState,
  effectiveDuration,
  effectiveRemaining,
  progressFraction,
} from "./selectors";
import { createInitialState } from "../core/playbackReducer";
import type { Track } from "../types";

const tracks: Track[] = [
  { id: "a", title: "A", fileUrl: "/a.mp3", durationSeconds: 120 },
];

function makeState(overrides: Partial<ReturnType<typeof createInitialState>> = {}) {
  return { ...createInitialState({ tracks }), ...overrides };
}

describe("derivePlaybackUiState", () => {
  it("returns idle when no tracks", () => {
    expect(derivePlaybackUiState(createInitialState({ tracks: [] }))).toBe("idle");
  });

  it("returns error when errorMessage is set", () => {
    expect(derivePlaybackUiState(makeState({ errorMessage: "fail" }))).toBe("error");
  });

  it("returns loading when buffering", () => {
    expect(derivePlaybackUiState(makeState({ isBuffering: true }))).toBe("loading");
  });

  it("returns playing when not paused", () => {
    expect(derivePlaybackUiState(makeState({ isPaused: false }))).toBe("playing");
  });

  it("returns paused when paused midway", () => {
    expect(derivePlaybackUiState(makeState({ isPaused: true, currentTime: 10, duration: 120 }))).toBe("paused");
  });

  it("returns ended when paused at the end", () => {
    expect(derivePlaybackUiState(makeState({ isPaused: true, currentTime: 119.96, duration: 120 }))).toBe("ended");
  });
});

describe("effectiveDuration", () => {
  it("returns media duration when available", () => {
    expect(effectiveDuration(makeState({ duration: 200 }))).toBe(200);
  });

  it("falls back to durationSeconds hint", () => {
    expect(effectiveDuration(makeState({ duration: 0 }))).toBe(120);
  });

  it("returns 0 when neither is available", () => {
    const noHint: Track[] = [{ id: "a", title: "A", fileUrl: "/a.mp3" }];
    expect(effectiveDuration(createInitialState({ tracks: noHint }))).toBe(0);
  });
});

describe("effectiveRemaining", () => {
  it("returns remaining seconds", () => {
    expect(effectiveRemaining(makeState({ currentTime: 30, duration: 120 }))).toBe(90);
  });

  it("returns 0 when current time exceeds duration", () => {
    expect(effectiveRemaining(makeState({ currentTime: 130, duration: 120 }))).toBe(0);
  });
});

describe("progressFraction", () => {
  it("returns 0 when duration is 0", () => {
    expect(progressFraction(makeState({ duration: 0 }))).toBe(0);
  });

  it("returns fraction of progress", () => {
    expect(progressFraction(makeState({ currentTime: 60, duration: 120 }))).toBeCloseTo(0.5);
  });

  it("clamps to 1", () => {
    expect(progressFraction(makeState({ currentTime: 200, duration: 120 }))).toBe(1);
  });
});
