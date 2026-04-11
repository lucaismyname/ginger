import { useEffect, useState } from "react";

export type UseAudioPeaksState = {
  peaks: number[];
  isLoading: boolean;
  error: string | null;
};

export function useAudioPeaks(
  fileUrl: string | null | undefined,
  buckets = 64,
): UseAudioPeaksState {
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
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    void (async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok)
          throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        try {
          const audioBuffer = await audioContext.decodeAudioData(buffer);
          const channel = audioBuffer.getChannelData(0);
          const step = Math.max(1, Math.floor(channel.length / buckets));
          const peaks: number[] = [];
          for (let i = 0; i < buckets; i += 1) {
            let max = 0;
            const start = i * step;
            const end = Math.min(channel.length, start + step);
            for (let j = start; j < end; j += 1) {
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
  }, [buckets, fileUrl]);

  return state;
}
