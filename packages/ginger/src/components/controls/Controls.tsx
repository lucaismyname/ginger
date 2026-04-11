import { useMemo } from "react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { useGingerContext } from "../../context/GingerContext";
import { effectiveDuration } from "../../internal/selectors";
import { formatMmSs } from "../../internal/formatTime";
import type { RepeatMode } from "../../types";

export type PlayPauseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Optional labels; still headless—defaults are text for a11y */
  playLabel?: ReactNode;
  pauseLabel?: ReactNode;
  /** Screen-reader label when paused (playing would start); defaults to match `playLabel` when it is a string */
  playAriaLabel?: string;
  /** Screen-reader label when playing (action would pause); defaults to match `pauseLabel` when it is a string */
  pauseAriaLabel?: string;
};

export function PlayPause({
  playLabel = "Play",
  pauseLabel = "Pause",
  playAriaLabel,
  pauseAriaLabel,
  type = "button",
  ...rest
}: PlayPauseProps) {
  const { state, togglePlayPause } = useGingerContext();
  const defaultPlayAria = typeof playLabel === "string" ? playLabel : "Play";
  const defaultPauseAria = typeof pauseLabel === "string" ? pauseLabel : "Pause";
  const ariaLabel = state.isPaused
    ? (playAriaLabel ?? defaultPlayAria)
    : (pauseAriaLabel ?? defaultPauseAria);
  return (
    <button type={type} aria-label={ariaLabel} onClick={togglePlayPause} {...rest}>
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

export type SeekBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "onInput" | "min" | "max" | "step"
> & {
  inputStyle?: CSSProperties;
};

export function SeekBar({ inputStyle, style, ...rest }: SeekBarProps) {
  const { state, seek } = useGingerContext();
  const duration = effectiveDuration(state);
  const value = duration > 0 ? state.currentTime : 0;
  const numericValue = Number.isFinite(value) ? value : 0;
  const ariaValueText =
    duration > 0
      ? `${formatMmSs(numericValue)} of ${formatMmSs(duration)}`
      : formatMmSs(numericValue);
  const applySeek = (e: FormEvent<HTMLInputElement>) => {
    seek(Number(e.currentTarget.value));
  };
  return (
    <input
      {...rest}
      type="range"
      min={0}
      max={duration > 0 ? duration : 1}
      step="any"
      value={numericValue}
      aria-label="Seek"
      aria-valuetext={ariaValueText}
      onInput={applySeek}
      onChange={applySeek}
      style={{ width: "100%", ...style, ...inputStyle }}
    />
  );
}

SeekBar.displayName = "Ginger.Control.SeekBar";

export type VolumeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "onInput" | "min" | "max" | "step"
> & {
  inputStyle?: CSSProperties;
};

export function Volume({ inputStyle, style, ...rest }: VolumeProps) {
  const { state, setVolume } = useGingerContext();
  const applyVolume = (e: FormEvent<HTMLInputElement>) => {
    setVolume(Number(e.currentTarget.value));
  };
  return (
    <input
      {...rest}
      type="range"
      min={0}
      max={1}
      step="any"
      value={state.volume}
      aria-label="Volume"
      aria-valuetext={`${Math.round(state.volume * 100)}%`}
      onInput={applyVolume}
      onChange={applyVolume}
      style={{ width: "100%", ...style, ...inputStyle }}
    />
  );
}

Volume.displayName = "Ginger.Control.Volume";

export type MuteProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  muteLabel?: ReactNode;
  unmuteLabel?: ReactNode;
};

export function Mute({
  muteLabel = "Mute",
  unmuteLabel = "Unmute",
  type = "button",
  ...rest
}: MuteProps) {
  const { state, toggleMute } = useGingerContext();
  return (
    <button
      type={type}
      aria-pressed={state.muted}
      aria-label={state.muted ? "Unmute" : "Mute"}
      onClick={toggleMute}
      {...rest}
    >
      {state.muted ? unmuteLabel : muteLabel}
    </button>
  );
}

Mute.displayName = "Ginger.Control.Mute";

const defaultRates = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export type PlaybackRateProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & {
  /** Playback speed options (default: 0.5 … 2) */
  rates?: readonly number[];
};

export function PlaybackRate({ rates = defaultRates, style, ...rest }: PlaybackRateProps) {
  const { state, setPlaybackRate } = useGingerContext();
  const options = useMemo(
    () => Array.from(new Set([...rates, state.playbackRate])).sort((a, b) => a - b),
    [rates, state.playbackRate],
  );
  return (
    <select
      aria-label="Playback speed"
      value={String(state.playbackRate)}
      style={style}
      onChange={(e) => setPlaybackRate(Number(e.currentTarget.value))}
      {...rest}
    >
      {options.map((r) => (
        <option key={r} value={String(r)}>
          {r === 1 ? "1× normal" : `${r}×`}
        </option>
      ))}
    </select>
  );
}

PlaybackRate.displayName = "Ginger.Control.PlaybackRate";
