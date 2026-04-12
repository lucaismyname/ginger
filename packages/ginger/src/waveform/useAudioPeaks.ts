import { useEffect, useState } from "react";
import { getAudioContextConstructor } from "./getAudioContextConstructor";

export type UseAudioPeaksState = {
  peaks: number[];
  isLoading: boolean;
  error: string | null;
};

export type UseAudioPeaksOptions = {
  /**
   * Hard cap for computed buckets to avoid very expensive loops.
   * Default: 512.
   */
  maxBuckets?: number;
  /**
   * Maximum number of samples scanned per bucket.
   * Large files are sampled with a stride once this limit is exceeded.
   * Default: 20_000.
   */
  maxSamplesPerBucket?: number;
};

export function useAudioPeaks(
  fileUrl: string | null | undefined,
  buckets = 64,
  options: UseAudioPeaksOptions = {},
): UseAudioPeaksState {
  const { maxBuckets = 512, maxSamplesPerBucket = 20_000 } = options;
  const [state, setState] = useState<UseAudioPeaksState>({
    peaks: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!fileUrl) {
      setState({ peaks: [], isLoading: false, error: null });
      return;
    }
    if (typeof window === "undefined") {
      setState({ peaks: [], isLoading: false, error: null });
      return;
    }
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    void (async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok)
          throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        const Context = getAudioContextConstructor();
        if (!Context) {
          throw new Error("Web Audio API is not available");
        }
        const audioContext = new Context();
        try {
          const audioBuffer = await audioContext.decodeAudioData(buffer);
          const channel = audioBuffer.getChannelData(0);
          const safeBuckets = Math.min(Math.max(1, buckets), Math.max(1, maxBuckets));
          const step = Math.max(1, Math.floor(channel.length / safeBuckets));
          const peaks: number[] = [];
          for (let i = 0; i < safeBuckets; i += 1) {
            let max = 0;
            const start = i * step;
            const end = Math.min(channel.length, start + step);
            const sampleCount = end - start;
            const stride =
              sampleCount > maxSamplesPerBucket ? Math.ceil(sampleCount / maxSamplesPerBucket) : 1;
            for (let j = start; j < end; j += stride) {
              max = Math.max(max, Math.abs(channel[j] ?? 0));
            }
            peaks.push(max);
          }
          if (!cancelled) {
            setState({ peaks, isLoading: false, error: null });
          }
        } finally {
          await audioContext.close().catch(() => {});
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            peaks: [],
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to decode peaks",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [buckets, fileUrl, maxBuckets, maxSamplesPerBucket]);

  return state;
}
