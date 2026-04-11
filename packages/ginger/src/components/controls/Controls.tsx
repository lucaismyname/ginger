import { useMemo } from "react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { useGingerLocale } from "../../context/GingerLocaleContext";
import { useGingerMedia, useGingerPlayback } from "../../context/GingerSplitContexts";
import { usePlayPauseBinding, useSeekBarBinding, useVolumeSlider } from "../../hooks/useControlBindings";

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
  const locale = useGingerLocale();
  const defaultPlayAria = typeof playLabel === "string" ? playLabel : locale.play;
  const defaultPauseAria = typeof pauseLabel === "string" ? pauseLabel : locale.pause;
  const b = usePlayPauseBinding({
    playAriaLabel: playAriaLabel ?? defaultPlayAria,
    pauseAriaLabel: pauseAriaLabel ?? defaultPauseAria,
  });
  return (
    <button type={type} aria-label={b.ariaLabel} onClick={b.toggle} {...rest}>
      {b.isPaused ? playLabel : pauseLabel}
    </button>
  );
}

PlayPause.displayName = "Ginger.Control.PlayPause";

export type RepeatProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Repeat({ type = "button", ...rest }: RepeatProps) {
  const { repeatMode, cycleRepeat } = useGingerPlayback();
  const locale = useGingerLocale();
  const label = locale.repeat[repeatMode];
  return (
    <button type={type} aria-label={label} onClick={cycleRepeat} {...rest}>
      {label}
    </button>
  );
}

Repeat.displayName = "Ginger.Control.Repeat";

export type NextProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Next({ type = "button", children = "Next", ...rest }: NextProps) {
  const { next } = useGingerPlayback();
  const locale = useGingerLocale();
  return (
    <button type={type} aria-label={locale.nextTrack} onClick={next} {...rest}>
      {children}
    </button>
  );
}
Next.displayName = "Ginger.Control.Next";

export type PreviousProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Previous({ type = "button", children = "Previous", ...rest }: PreviousProps) {
  const { prev } = useGingerPlayback();
  const locale = useGingerLocale();
  return (
    <button type={type} aria-label={locale.previousTrack} onClick={prev} {...rest}>
      {children}
    </button>
  );
}
Previous.displayName = "Ginger.Control.Previous";

export type ShuffleProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Shuffle({ type = "button", children = "Shuffle", ...rest }: ShuffleProps) {
  const { isShuffled, toggleShuffle } = useGingerPlayback();
  const locale = useGingerLocale();
  return (
    <button
      type={type}
      aria-pressed={isShuffled}
      aria-label={locale.shuffle}
      onClick={toggleShuffle}
      {...rest}
    >
      {children}
    </button>
  );
}
Shuffle.displayName = "Ginger.Control.Shuffle";

export type SeekBarProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "onInput" | "min" | "max" | "step"
> & {
  /** Remove default width style for fully custom styling. */
  unstyled?: boolean;
  inputStyle?: CSSProperties;
};

export function SeekBar({ inputStyle, style, unstyled = false, ...rest }: SeekBarProps) {
  const b = useSeekBarBinding();
  const mergedStyle = unstyled ? { ...style, ...inputStyle } : { width: "100%", ...style, ...inputStyle };
  return (
    <input
      {...rest}
      type="range"
      min={b.min}
      max={b.max}
      step={b.step}
      value={b.value}
      aria-label={b.ariaLabel}
      aria-valuetext={b.ariaValueText}
      onInput={b.onSeekInput}
      onChange={b.onSeekChange}
      style={mergedStyle}
    />
  );
}

SeekBar.displayName = "Ginger.Control.SeekBar";

export type VolumeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "onInput" | "min" | "max" | "step"
> & {
  /** Remove default width style for fully custom styling. */
  unstyled?: boolean;
  inputStyle?: CSSProperties;
};

export function Volume({ inputStyle, style, unstyled = false, ...rest }: VolumeProps) {
  const b = useVolumeSlider();
  const mergedStyle = unstyled ? { ...style, ...inputStyle } : { width: "100%", ...style, ...inputStyle };
  return (
    <input
      {...rest}
      type="range"
      min={b.min}
      max={b.max}
      step={b.step}
      value={b.value}
      aria-label={b.ariaLabel}
      aria-valuetext={b.ariaValueText}
      onInput={b.onVolumeInput}
      onChange={b.onVolumeChange}
      style={mergedStyle}
    />
  );
}

Volume.displayName = "Ginger.Control.Volume";

export type MuteProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  muteLabel?: ReactNode;
  unmuteLabel?: ReactNode;
};

export function Mute({
  muteLabel,
  unmuteLabel,
  type = "button",
  ...rest
}: MuteProps) {
  const { muted, toggleMute } = useGingerMedia();
  const locale = useGingerLocale();
  const m = muteLabel ?? locale.mute;
  const u = unmuteLabel ?? locale.unmute;
  return (
    <button
      type={type}
      aria-pressed={muted}
      aria-label={muted ? locale.unmute : locale.mute}
      onClick={toggleMute}
      {...rest}
    >
      {muted ? u : m}
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
  const { playbackRate, setPlaybackRate } = useGingerMedia();
  const locale = useGingerLocale();
  const options = useMemo(
    () => Array.from(new Set([...rates, playbackRate])).sort((a, b) => a - b),
    [rates, playbackRate],
  );
  return (
    <select
      {...rest}
      aria-label={locale.playbackSpeed}
      value={String(playbackRate)}
      style={style}
      onChange={(e) => setPlaybackRate(Number(e.currentTarget.value))}
    >
      {options.map((r) => (
        <option key={r} value={String(r)}>
          {r === 1 ? locale.playbackRateNormal : locale.playbackRateTimes(r)}
        </option>
      ))}
    </select>
  );
}

PlaybackRate.displayName = "Ginger.Control.PlaybackRate";
