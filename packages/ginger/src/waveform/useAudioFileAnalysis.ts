import { useEffect, useState } from "react";
import { analyzeAudioFile, type AnalyzeAudioFileOptions, type AudioFileAnalysis } from "./analyzeAudioFile";

export type UseAudioFileAnalysisState = {
  data: AudioFileAnalysis | null;
  isLoading: boolean;
  error: string | null;
};

export function useAudioFileAnalysis(
  fileUrl: string | null | undefined,
  options: AnalyzeAudioFileOptions = {},
): UseAudioFileAnalysisState {
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
        const data = await analyzeAudioFile(fileUrl, options);
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
  }, [
    fileUrl,
    options.timeSlices,
    options.samplesPerSlice,
    options.spectrogram,
    options.fftSize,
    options.frequencyBins,
    options.channel,
  ]);

  return state;
}
