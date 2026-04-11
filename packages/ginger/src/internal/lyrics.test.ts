import { describe, expect, it } from "vitest";
import { parseLrc } from "./lyrics";

describe("parseLrc", () => {
  it("parses and sorts timed lyric lines", () => {
    const lines = parseLrc("[00:10.50]Line B\n[00:02.00]Line A");
    expect(lines).toEqual([
      { time: 2, text: "Line A" },
      { time: 10.5, text: "Line B" },
    ]);
  });
});
