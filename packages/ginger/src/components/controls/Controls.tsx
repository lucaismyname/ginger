import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import { useGingerContext } from "../../context/GingerContext";
import type { RepeatMode } from "../../types";

export type PlayPauseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Optional labels; still headless—defaults are text for a11y */
  playLabel?: ReactNode;
  pauseLabel?: ReactNode;
};

export function PlayPause({ playLabel = "Play", pauseLabel = "Pause", type = "button", ...rest }: PlayPauseProps) {
  const { state, togglePlayPause } = useGingerContext();
  return (
    <button type={type} aria-label={state.isPaused ? "Play" : "Pause"} onClick={togglePlayPause} {...rest}>
      {state.isPaused ? playLabel : pauseLabel}
    </button>
  );
}

PlayPause.displayName = "Ginger.Control.PlayPause";

const repeatLabels: Record<RepeatMode, string> = {
  off: "Repeat off",
  all: "Repeat all",
  one: "Repeat one",
};

export type RepeatProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Repeat({ type = "button", ...rest }: RepeatProps) {
  const { state, cycleRepeat } = useGingerContext();
  return (
    <button type={type} aria-label={repeatLabels[state.repeatMode]} onClick={cycleRepeat} {...rest}>
      {repeatLabels[state.repeatMode]}
    </button>
  );
}

Repeat.displayName = "Ginger.Control.Repeat";

export type NextProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Next({ type = "button", children = "Next", ...rest }: NextProps) {
  const { next } = useGingerContext();
  return (
    <button type={type} aria-label="Next track" onClick={next} {...rest}>
      {children}
    </button>
  );
}
Next.displayName = "Ginger.Control.Next";

export type PreviousProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Previous({ type = "button", children = "Previous", ...rest }: PreviousProps) {
  const { prev } = useGingerContext();
  return (
    <button type={type} aria-label="Previous track" onClick={prev} {...rest}>
      {children}
    </button>
  );
}
Previous.displayName = "Ginger.Control.Previous";

export type ShuffleProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Shuffle({ type = "button", children = "Shuffle", ...rest }: ShuffleProps) {
  const { state, toggleShuffle } = useGingerContext();
  return (
    <button type={type} aria-pressed={state.isShuffled} aria-label="Shuffle" onClick={toggleShuffle} {...rest}>
      {children}
    </button>
  );
}
Shuffle.displayName = "Ginger.Control.Shuffle";

export type SeekBarProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  inputStyle?: CSSProperties;
};

export function SeekBar({ inputStyle, style, ...rest }: SeekBarProps) {
  const { state, seek } = useGingerContext();
  const duration = Number.isFinite(state.duration) && state.duration > 0 ? state.duration : 0;
  const value = duration > 0 ? state.currentTime : 0;
  return (
    <input
      type="range"
      min={0}
      max={duration > 0 ? duration : 1}
      step="any"
      value={Number.isFinite(value) ? value : 0}
      aria-label="Seek"
      onChange={(e) => seek(Number(e.currentTarget.value))}
      style={{ width: "100%", ...style, ...inputStyle }}
      {...rest}
    />
  );
}

SeekBar.displayName = "Ginger.Control.SeekBar";
