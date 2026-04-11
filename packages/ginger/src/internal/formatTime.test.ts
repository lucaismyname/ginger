import { describe, expect, it } from "vitest";
import { formatMmSs } from "./formatTime";

describe("formatMmSs", () => {
  it("formats zero", () => {
    expect(formatMmSs(0)).toBe("0:00");
  });

  it("formats seconds with zero-padding", () => {
    expect(formatMmSs(5)).toBe("0:05");
  });

  it("formats minutes and seconds", () => {
    expect(formatMmSs(125)).toBe("2:05");
  });

  it("handles large values (hours expressed as minutes)", () => {
    expect(formatMmSs(3661)).toBe("61:01");
  });

  it("returns 0:00 for NaN", () => {
    expect(formatMmSs(Number.NaN)).toBe("0:00");
  });

  it("returns 0:00 for Infinity", () => {
    expect(formatMmSs(Number.POSITIVE_INFINITY)).toBe("0:00");
  });

  it("returns 0:00 for negative values", () => {
    expect(formatMmSs(-10)).toBe("0:00");
  });
});
