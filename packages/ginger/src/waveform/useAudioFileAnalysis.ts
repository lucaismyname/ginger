import { useEffect, useState } from "react";
import {
  type AnalyzeAudioFileOptions,
  type AudioFileAnalysis,
  analyzeAudioFile,
} from "./analyzeAudioFile";

export type UseAudioFileAnalysisState = {
  data: AudioFileAnalysis | null;
  isLoading: boolean;
  error: string | null;
};

/** When extending {@link AnalyzeAudioFileOptions}, thread new fields through the destructuring below and the effect dependency array. */
export function useAudioFileAnalysis(
  fileUrl: string | null | undefined,
  options: AnalyzeAudioFileOptions = {},
): UseAudioFileAnalysisState {
  const { timeSlices, samplesPerSlice, spectrogram, fftSize, frequencyBins, channel } = options;

  const [state, setState] = useState<UseAudioFileAnalysisState>({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!fileUrl) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }
    if (typeof window === "undefined") {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    void (async () => {
      try {
        const data = await analyzeAudioFile(fileUrl, {
          timeSlices,
          samplesPerSlice,
          spectrogram,
          fftSize,
          frequencyBins,
          channel,
        });
        if (!cancelled) {
          setState({ data, isLoading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to analyze audio file",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fileUrl, timeSlices, samplesPerSlice, spectrogram, fftSize, frequencyBins, channel]);

  return state;
}
