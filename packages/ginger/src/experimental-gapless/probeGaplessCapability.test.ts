import { afterEach, describe, expect, it, vi } from "vitest";
import { probeGaplessCapability } from "./probeGaplessCapability";

describe("probeGaplessCapability", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns unsupported when window is undefined (SSR-style)", () => {
    vi.stubGlobal("window", undefined);
    const r = probeGaplessCapability();
    expect(r.supported).toBe(false);
    expect(r.reason).toMatch(/SSR|browser/i);
  });

  it("returns unsupported when AudioContext is missing", () => {
    vi.stubGlobal("AudioContext", undefined);
    const r = probeGaplessCapability();
    expect(r.supported).toBe(false);
    expect(r.reason).toMatch(/Web Audio|decodeAudioData/i);
  });

  it("returns unsupported when decodeAudioData is missing on prototype", () => {
    class BadAudioContext {
      close() {}
    }
    vi.stubGlobal("AudioContext", BadAudioContext);
    const r = probeGaplessCapability();
    expect(r.supported).toBe(false);
  });

  it("returns supported when AudioContext has decodeAudioData and context is secure", () => {
    class GoodAudioContext {
      decodeAudioData(_buf: ArrayBuffer) {
        return Promise.resolve({} as AudioBuffer);
      }
      close() {}
    }
    vi.stubGlobal("AudioContext", GoodAudioContext);
    vi.stubGlobal("isSecureContext", true);
    const r = probeGaplessCapability();
    expect(r.supported).toBe(true);
    expect(r.hints.crossOrigin).toBe("anonymous");
    expect(r.reason).toMatch(/Ginger does not yet schedule/i);
  });
});
