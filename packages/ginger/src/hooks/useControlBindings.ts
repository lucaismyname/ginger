import { useMemo } from "react";
import type { FormEvent } from "react";
import { useGingerLocale } from "../context/GingerLocaleContext";
import {
  gingerStateFromContextValues,
  useGingerMedia,
  useGingerPlayback,
} from "../context/GingerSplitContexts";
import { formatMmSs } from "../internal/formatTime";
import { effectiveDuration } from "../internal/selectors";
import type { GingerState } from "../types";

export type SeekBarBinding = {
  state: GingerState;
  value: number;
  min: number;
  max: number;
  step: "any";
  ariaValueText: string;
  ariaLabel: string;
  onSeekInput: (e: FormEvent<HTMLInputElement>) => void;
  onSeekChange: (e: FormEvent<HTMLInputElement>) => void;
};

/** Headless seek slider: bind return value to `<input type="range" />` or your own component. */
export function useSeekBarBinding(): SeekBarBinding {
  const pb = useGingerPlayback();
  const md = useGingerMedia();
  const locale = useGingerLocale();
  const state = useMemo(() => gingerStateFromContextValues(pb, md), [pb, md]);
  const duration = effectiveDuration(state);
  const value = duration > 0 ? state.currentTime : 0;
  const numericValue = Number.isFinite(value) ? value : 0;
  const ariaValueText =
    duration > 0
      ? `${formatMmSs(numericValue)} of ${formatMmSs(duration)}`
      : formatMmSs(numericValue);

  const onSeekInput = (e: FormEvent<HTMLInputElement>) => {
    md.seek(Number(e.currentTarget.value));
  };

  return {
    state,
    value: numericValue,
    min: 0,
    max: duration > 0 ? duration : 1,
    step: "any",
    ariaValueText,
    ariaLabel: locale.seek,
    onSeekInput,
    onSeekChange: onSeekInput,
  };
}

export type VolumeBinding = {
  state: GingerState;
  value: number;
  min: number;
  max: number;
  step: "any";
  ariaValueText: string;
  ariaLabel: string;
  onVolumeInput: (e: FormEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: FormEvent<HTMLInputElement>) => void;
};

/** Headless volume slider. */
export function useVolumeSlider(): VolumeBinding {
  const pb = useGingerPlayback();
  const md = useGingerMedia();
  const locale = useGingerLocale();
  const state = useMemo(() => gingerStateFromContextValues(pb, md), [pb, md]);

  const onVolumeInput = (e: FormEvent<HTMLInputElement>) => {
    md.setVolume(Number(e.currentTarget.value));
  };

  return {
    state,
    value: state.volume,
    min: 0,
    max: 1,
    step: "any",
    ariaValueText: `${Math.round(state.volume * 100)}%`,
    ariaLabel: locale.volume,
    onVolumeInput,
    onVolumeChange: onVolumeInput,
  };
}

export type PlayPauseBinding = {
  isPaused: boolean;
  toggle: () => void;
  /** Resolved aria label for the button’s *next* action (play vs pause). */
  ariaLabel: string;
};

/** Headless play/pause control; use with `playAriaLabel` / `pauseAriaLabel` from locale or custom strings. */
export function usePlayPauseBinding(options?: {
  playAriaLabel?: string;
  pauseAriaLabel?: string;
}): PlayPauseBinding {
  const pb = useGingerPlayback();
  const locale = useGingerLocale();
  const playL = options?.playAriaLabel ?? locale.play;
  const pauseL = options?.pauseAriaLabel ?? locale.pause;
  return {
    isPaused: pb.isPaused,
    toggle: pb.togglePlayPause,
    ariaLabel: pb.isPaused ? playL : pauseL,
  };
}
