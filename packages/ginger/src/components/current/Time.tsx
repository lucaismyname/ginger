import type { ReactElement, ReactNode } from "react";
import type { DisplayBaseProps, GingerState } from "../../types";
import { useGingerState } from "../../context/GingerSplitContexts";
import { effectiveDuration, effectiveRemaining, progressFraction } from "../../internal/selectors";
import { formatMmSs } from "../../internal/formatTime";

export type TimeTextProps = DisplayBaseProps & {
  format?: (seconds: number) => string;
  children?: (value: string, state: GingerState) => ReactNode;
};

function renderTime(
  valueSeconds: number,
  state: GingerState,
  props: TimeTextProps,
): ReactElement | null {
  const { className, style, fallback, empty, children, format = formatMmSs } = props;
  if (!(valueSeconds >= 0) || !Number.isFinite(valueSeconds)) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  const text = format(valueSeconds);
  if (children) return <span className={className} style={style}>{children(text, state)}</span>;
  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}

export function Elapsed(props: TimeTextProps) {
  const state = useGingerState();
  return renderTime(state.currentTime, state, props);
}

Elapsed.displayName = "Ginger.Current.Elapsed";

export function Duration(props: TimeTextProps) {
  const state = useGingerState();
  return renderTime(effectiveDuration(state), state, props);
}

Duration.displayName = "Ginger.Current.Duration";

export function Remaining(props: TimeTextProps) {
  const state = useGingerState();
  return renderTime(effectiveRemaining(state), state, props);
}

Remaining.displayName = "Ginger.Current.Remaining";

export type ProgressProps = DisplayBaseProps & {
  children?: (value: { fraction: number; currentTime: number; duration: number }, state: GingerState) => ReactNode;
};

export function Progress({ className, style, fallback, empty, children }: ProgressProps) {
  const state = useGingerState();
  const duration = effectiveDuration(state);
  const fraction = progressFraction(state);
  if (!(duration > 0)) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  if (children)
    return (
      <span className={className} style={style}>
        {children({ fraction, currentTime: state.currentTime, duration }, state)}
      </span>
    );
  return (
    <span className={className} style={style}>
      {`${Math.round(fraction * 100)}%`}
    </span>
  );
}

Progress.displayName = "Ginger.Current.Progress";

export type TimeRailProps = DisplayBaseProps & {
  /** 0-1 height in px for the rail */
  height?: number;
  /** When true, shows a buffered range behind the progress fill (uses `bufferedFraction`). */
  showBuffered?: boolean;
};

export function TimeRail({ className, style, height = 4, showBuffered = false }: TimeRailProps) {
  const state = useGingerState();
  const progressPct = `${Math.round(progressFraction(state) * 100)}%`;
  const bufPct = `${Math.round(Math.min(1, Math.max(0, state.bufferedFraction)) * 100)}%`;
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        background: "var(--ginger-muted-color, #e5e7eb)",
        borderRadius: 999,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
      aria-hidden
    >
      {showBuffered ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: bufPct,
            background: "var(--ginger-buffer-color, rgba(107, 114, 128, 0.35))",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          width: progressPct,
          height: "100%",
          background: "var(--ginger-primary-color, #111827)",
        }}
      />
    </div>
  );
}

TimeRail.displayName = "Ginger.Current.TimeRail";

export type BufferRailProps = DisplayBaseProps & {
  height?: number;
};

/** Buffered portion of the timeline (0…`bufferedFraction`); pair with `TimeRail` or use alone. */
export function BufferRail({ className, style, height = 4 }: BufferRailProps) {
  const state = useGingerState();
  const bufPct = `${Math.round(Math.min(1, Math.max(0, state.bufferedFraction)) * 100)}%`;
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        background: "var(--ginger-muted-color, #e5e7eb)",
        borderRadius: 999,
        overflow: "hidden",
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          width: bufPct,
          height: "100%",
          background: "var(--ginger-buffer-color, rgba(107, 114, 128, 0.35))",
        }}
      />
    </div>
  );
}

BufferRail.displayName = "Ginger.Current.BufferRail";
