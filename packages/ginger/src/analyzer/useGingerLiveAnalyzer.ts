import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGinger } from "../hooks/useGinger";
import { type LiveAnalyserOptions, attachLiveAnalyser, detachLiveAnalyser } from "./liveAudioGraph";

export type UseGingerLiveAnalyzerOptions = {
  /** When false, the analyser is detached and no frames are read. Default true. */
  enabled?: boolean;
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
};

export type UseGingerLiveAnalyzerResult = {
  /** Byte frequency data (0–255); length equals `frequencyBinCount`. Updated each animation frame while enabled. */
  frequencyData: Uint8Array;
  /** Byte time-domain data (0–255); length equals `fftSize`. */
  timeDomainData: Uint8Array;
  frequencyBinCount: number;
  sampleRate: number;
  isSuspended: boolean;
  error: string | null;
  resume: () => Promise<void>;
};

const emptyFreq = new Uint8Array(0);
const emptyTime = new Uint8Array(0);

export function useGingerLiveAnalyzer(
  options: UseGingerLiveAnalyzerOptions = {},
): UseGingerLiveAnalyzerResult {
  const {
    enabled = true,
    fftSize = 2048,
    smoothingTimeConstant = 0.8,
    minDecibels = -100,
    maxDecibels = -30,
  } = options;

  const { audioRef, state } = useGinger();
  const opts = useMemo<LiveAnalyserOptions>(
    () => ({
      fftSize,
      smoothingTimeConstant,
      minDecibels,
      maxDecibels,
    }),
    [fftSize, smoothingTimeConstant, minDecibels, maxDecibels],
  );

  const [frame, setFrame] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [meta, setMeta] = useState({ frequencyBinCount: 0, sampleRate: 0 });

  const freqRef = useRef<Uint8Array>(emptyFreq);
  const timeRef = useRef<Uint8Array>(emptyTime);

  const resume = useCallback(async () => {
    const ctx = contextHolderRef.current;
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
  }, []);

  const contextHolderRef = useRef<AudioContext | null>(null);
  const analyserHolderRef = useRef<AnalyserNode | null>(null);

  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    let consumerId: number | null = null;
    let element: HTMLAudioElement | null = null;
    let rafId = 0;

    const onStateChange = () => {
      const ctx = contextHolderRef.current;
      if (ctx) setIsSuspended(ctx.state === "suspended");
    };

    const runLoop = () => {
      if (cancelled) return;
      const a = analyserHolderRef.current;
      const fq = freqRef.current;
      const td = timeRef.current;
      if (a && fq.length > 0 && td.length > 0) {
        a.getByteFrequencyData(fq as Uint8Array<ArrayBuffer>);
        a.getByteTimeDomainData(td as Uint8Array<ArrayBuffer>);
        setFrame((n) => n + 1);
      }
      rafId = requestAnimationFrame(runLoop);
    };

    type AttachOutcome = "ok" | "no-element" | "error";

    const attach = (): AttachOutcome => {
      const el = audioRef.current;
      if (!el || cancelled) return "no-element";
      try {
        const { id, context, analyser } = attachLiveAnalyser(el, opts);
        consumerId = id;
        element = el;
        contextHolderRef.current = context;
        analyserHolderRef.current = analyser;
        setIsSuspended(context.state === "suspended");
        setError(null);

        context.addEventListener("statechange", onStateChange);

        const n = analyser.frequencyBinCount;
        const fft = analyser.fftSize;
        freqRef.current = new Uint8Array(n);
        timeRef.current = new Uint8Array(fft);
        setMeta({ frequencyBinCount: n, sampleRate: context.sampleRate });

        rafId = requestAnimationFrame(runLoop);
        return "ok";
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to attach live analyser";
        setError(msg);
        contextHolderRef.current = null;
        analyserHolderRef.current = null;
        freqRef.current = emptyFreq;
        timeRef.current = emptyTime;
        setMeta({ frequencyBinCount: 0, sampleRate: 0 });
        return "error";
      }
    };

    const first = attach();
    if (first !== "ok") {
      let retryRaf = 0;
      const maxAttempts = 120;
      let attempts = 0;

      const retryLoop = () => {
        if (cancelled) return;
        const out = attach();
        if (out === "ok" || out === "error") return;
        attempts += 1;
        if (attempts >= maxAttempts) return;
        retryRaf = requestAnimationFrame(retryLoop);
      };

      if (first === "no-element") {
        retryRaf = requestAnimationFrame(retryLoop);
      }

      return () => {
        cancelled = true;
        cancelAnimationFrame(retryRaf);
        cancelAnimationFrame(rafId);
        if (consumerId != null && element) {
          detachLiveAnalyser(element, consumerId);
        }
        contextHolderRef.current?.removeEventListener("statechange", onStateChange);
        contextHolderRef.current = null;
        analyserHolderRef.current = null;
        freqRef.current = emptyFreq;
        timeRef.current = emptyTime;
      };
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (consumerId != null && element) {
        detachLiveAnalyser(element, consumerId);
      }
      contextHolderRef.current?.removeEventListener("statechange", onStateChange);
      contextHolderRef.current = null;
      analyserHolderRef.current = null;
      freqRef.current = emptyFreq;
      timeRef.current = emptyTime;
      setMeta({ frequencyBinCount: 0, sampleRate: 0 });
    };
  }, [enabled, audioRef, opts, state.currentIndex]);

  void frame;

  return {
    frequencyData: freqRef.current,
    timeDomainData: timeRef.current,
    frequencyBinCount: meta.frequencyBinCount,
    sampleRate: meta.sampleRate,
    isSuspended,
    error,
    resume,
  };
}
