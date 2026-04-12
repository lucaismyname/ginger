import { describe, expect, it } from "vitest";
import { validateGingerInitPayloadDev } from "./validateGingerInitPayloadDev";

describe("validateGingerInitPayloadDev", () => {
  it("accepts a minimal valid payload", () => {
    expect(
      validateGingerInitPayloadDev({
        tracks: [{ title: "T", fileUrl: "/x.mp3" }],
      }),
    ).toBe(true);
  });

  it("rejects non-objects and missing track fields", () => {
    expect(validateGingerInitPayloadDev(null)).toBe(false);
    expect(validateGingerInitPayloadDev({ tracks: [{ title: 1, fileUrl: "/a" }] })).toBe(false);
    expect(validateGingerInitPayloadDev({ tracks: [{ title: "x", fileUrl: 1 }] })).toBe(false);
  });

  it("rejects bad enum-like fields", () => {
    expect(
      validateGingerInitPayloadDev({
        tracks: [{ title: "T", fileUrl: "/x.mp3" }],
        repeatMode: "nope",
      }),
    ).toBe(false);
    expect(
      validateGingerInitPayloadDev({
        tracks: [{ title: "T", fileUrl: "/x.mp3" }],
        playbackMode: "radio",
      }),
    ).toBe(false);
  });
});
