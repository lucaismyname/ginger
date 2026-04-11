import { describe, expect, it } from "vitest";
import { analyzeAudioBuffer } from "./analyzeAudioFile";

describe("analyzeAudioBuffer", () => {
  it("returns amplitudeGrid with requested dimensions and optional spectrogram", () => {
    const Ctx =
      typeof globalThis.AudioContext !== "undefined"
        ? globalThis.AudioContext
        : (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      return;
    }
    const ctx = new Ctx();
    const buffer = ctx.createBuffer(1, 8_192, 44_100);
    const ch = buffer.getChannelData(0);
    for (let i = 0; i < ch.length; i += 1) {
      ch[i] = Math.sin((i / 100) * Math.PI * 2) * 0.8;
    }

    const out = analyzeAudioBuffer(buffer, {
      timeSlices: 8,
      samplesPerSlice: 4,
      spectrogram: true,
      fftSize: 256,
      frequencyBins: 32,
    });

    expect(out.duration).toBeGreaterThan(0);
    expect(out.sampleRate).toBe(44_100);
    expect(out.amplitudeGrid.length).toBe(8);
    expect(out.amplitudeGrid[0]!.length).toBe(4);
    expect(out.spectrogram?.length).toBe(8);
    expect(out.spectrogram?.[0]?.length).toBe(32);

    void ctx.close();
  });
});
