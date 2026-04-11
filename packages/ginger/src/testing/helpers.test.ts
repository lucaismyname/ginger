import { describe, expect, it } from "vitest";
import {
  emitEnded,
  emitLoadedMetadata,
  emitTimeUpdate,
  expectQueueState,
  setupUser,
} from "./helpers";

describe("testing helpers", () => {
  it("creates a user-event instance", () => {
    const user = setupUser();
    expect(user.click).toBeTypeOf("function");
  });

  it("emits deterministic media events", () => {
    const audio = document.createElement("audio");
    let loaded = false;
    let updated = false;
    let ended = false;
    audio.addEventListener("loadedmetadata", () => {
      loaded = true;
    });
    audio.addEventListener("timeupdate", () => {
      updated = true;
    });
    audio.addEventListener("ended", () => {
      ended = true;
    });

    emitLoadedMetadata(audio, 120);
    emitTimeUpdate(audio, 30);
    emitEnded(audio);

    expect(loaded).toBe(true);
    expect(updated).toBe(true);
    expect(ended).toBe(true);
    expect(audio.duration).toBe(120);
    expect(audio.currentTime).toBe(30);
  });

  it("throws readable errors when queue state does not match", () => {
    expect(() =>
      expectQueueState(
        {
          currentIndex: 0,
          tracks: [{ id: "a", fileUrl: "/a.mp3" }],
          currentTrack: { id: "a", fileUrl: "/a.mp3" },
        },
        { currentIndex: 1 },
      ),
    ).toThrow("Expected currentIndex 1");
  });
});
