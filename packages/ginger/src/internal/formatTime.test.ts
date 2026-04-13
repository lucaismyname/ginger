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

  it("formats values over one hour as h:mm:ss", () => {
    expect(formatMmSs(3661)).toBe("1:01:01");
  });

  it("formats exactly one hour", () => {
    expect(formatMmSs(3600)).toBe("1:00:00");
  });

  it("formats multi-hour values", () => {
    expect(formatMmSs(7384)).toBe("2:03:04");
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
