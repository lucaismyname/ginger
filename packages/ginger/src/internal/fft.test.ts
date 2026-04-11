import { describe, expect, it } from "vitest";
import { fftInPlace, hanningWindow, realFftMagnitudes } from "./fft";

describe("fftInPlace", () => {
  it("recovers a single-bin sinusoid energy at k=1 for n=8", () => {
    const n = 8;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
      re[i] = Math.cos((2 * Math.PI * i) / n);
    }
    fftInPlace(re, im);
    let maxK = 0;
    let maxE = 0;
    for (let k = 0; k < n; k += 1) {
      const e = re[k]! * re[k]! + im[k]! * im[k]!;
      if (e > maxE) {
        maxE = e;
        maxK = k;
      }
    }
    expect(maxK).toBe(1);
  });

  it("DC-only signal concentrates in bin 0", () => {
    const n = 16;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    re.fill(1);
    fftInPlace(re, im);
    let maxK = 0;
    let maxMag = 0;
    for (let k = 0; k < n; k += 1) {
      const m = Math.hypot(re[k]!, im[k]!);
      if (m > maxMag) {
        maxMag = m;
        maxK = k;
      }
    }
    expect(maxK).toBe(0);
  });
});

describe("realFftMagnitudes", () => {
  it("returns n/2 magnitudes", () => {
    const n = 32;
    const s = new Float64Array(n);
    s[0] = 1;
    const m = realFftMagnitudes(s);
    expect(m.length).toBe(n >> 1);
  });
});

describe("hanningWindow", () => {
  it("is 0 at edges and 1 in the middle for odd conceptual symmetry", () => {
    const w = hanningWindow(5);
    expect(w[0]).toBeCloseTo(0, 5);
    expect(w[4]).toBeCloseTo(0, 5);
    expect(w[2]).toBeGreaterThan(0.9);
  });
});
