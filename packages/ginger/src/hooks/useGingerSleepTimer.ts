import { useEffect, useRef } from "react";
import { useGingerPlayback } from "../context/GingerSplitContexts";

export type GingerSleepTimerOptions = {
  durationMs?: number;
  stopAfterTracks?: number;
  respectPause?: boolean;
  enabled?: boolean;
  onFire?: () => void;
};

export function useGingerSleepTimer(options: GingerSleepTimerOptions): void {
  const { durationMs, stopAfterTracks, respectPause = true, enabled = true, onFire } = options;
  const { currentIndex, pause, isPaused } = useGingerPlayback();
  const remainingTracksRef = useRef(stopAfterTracks ?? 0);
  const prevIndexRef = useRef(currentIndex);

  useEffect(() => {
    remainingTracksRef.current = stopAfterTracks ?? 0;
  }, [stopAfterTracks]);

  useEffect(() => {
    if (!enabled || !durationMs || durationMs <= 0) return;
    if (respectPause && isPaused) return;
    const id = setTimeout(() => {
      pause();
      onFire?.();
    }, durationMs);
    return () => clearTimeout(id);
  }, [durationMs, enabled, isPaused, onFire, pause, respectPause]);

  useEffect(() => {
    if (!enabled || !stopAfterTracks || stopAfterTracks <= 0) return;
    const prev = prevIndexRef.current;
    prevIndexRef.current = currentIndex;
    if (currentIndex === prev) return;
    remainingTracksRef.current -= 1;
    if (remainingTracksRef.current <= 0) {
      pause();
      onFire?.();
    }
  }, [currentIndex, enabled, onFire, pause, stopAfterTracks]);
}
