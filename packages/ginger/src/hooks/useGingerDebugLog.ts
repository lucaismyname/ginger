import { useEffect, useRef } from "react";
import { useGingerState } from "../context/GingerSplitContexts";

export function useGingerDebugLog(enabled = false): void {
  const state = useGingerState();
  const prevRef = useRef(state);

  useEffect(() => {
    if (!enabled || typeof console === "undefined") return;
    const prev = prevRef.current;
    if (prev !== state) {
      console.debug("[ginger]", {
        from: {
          currentIndex: prev.currentIndex,
          isPaused: prev.isPaused,
          currentTime: prev.currentTime,
          repeatMode: prev.repeatMode,
        },
        to: {
          currentIndex: state.currentIndex,
          isPaused: state.isPaused,
          currentTime: state.currentTime,
          repeatMode: state.repeatMode,
        },
      });
    }
    prevRef.current = state;
  }, [enabled, state]);
}
