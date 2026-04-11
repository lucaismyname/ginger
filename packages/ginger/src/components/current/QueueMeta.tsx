import type { ReactNode } from "react";
import { useGingerState } from "../../context/GingerSplitContexts";
import type { DisplayBaseProps, GingerState } from "../../types";

export type QueueIndexProps = DisplayBaseProps & {
  base?: 0 | 1;
  children?: (value: string, state: GingerState) => ReactNode;
};

export function QueueIndex({
  base = 0,
  className,
  style,
  fallback,
  empty,
  children,
}: QueueIndexProps) {
  const state = useGingerState();
  const len = state.tracks.length;
  if (len === 0) {
    const node = empty ?? fallback ?? null;
    return node ? (
      <span className={className} style={style}>
        {node}
      </span>
    ) : null;
  }
  const value = String(state.currentIndex + base);
  if (children)
    return (
      <span className={className} style={style}>
        {children(value, state)}
      </span>
    );
  return (
    <span className={className} style={style}>
      {value}
    </span>
  );
}

QueueIndex.displayName = "Ginger.Current.QueueIndex";

export type QueueLengthProps = DisplayBaseProps & {
  children?: (value: string, state: GingerState) => ReactNode;
};

export function QueueLength({ className, style, fallback, empty, children }: QueueLengthProps) {
  const state = useGingerState();
  const value = String(state.tracks.length);
  if (state.tracks.length === 0) {
    const node = empty ?? fallback ?? null;
    return node ? (
      <span className={className} style={style}>
        {node}
      </span>
    ) : null;
  }
  if (children)
    return (
      <span className={className} style={style}>
        {children(value, state)}
      </span>
    );
  return (
    <span className={className} style={style}>
      {value}
    </span>
  );
}

QueueLength.displayName = "Ginger.Current.QueueLength";

export type QueuePositionProps = DisplayBaseProps & {
  base?: 0 | 1;
  separator?: string;
  children?: (
    value: { index: string; length: string; label: string },
    state: GingerState,
  ) => ReactNode;
};

export function QueuePosition({
  base = 0,
  separator = " / ",
  className,
  style,
  fallback,
  empty,
  children,
}: QueuePositionProps) {
  const state = useGingerState();
  const len = state.tracks.length;
  if (len === 0) {
    const node = empty ?? fallback ?? null;
    return node ? (
      <span className={className} style={style}>
        {node}
      </span>
    ) : null;
  }
  const index = String(state.currentIndex + base);
  const length = String(len);
  const label = `${index}${separator}${length}`;
  if (children)
    return (
      <span className={className} style={style}>
        {children({ index, length, label }, state)}
      </span>
    );
  return (
    <span className={className} style={style}>
      {label}
    </span>
  );
}

QueuePosition.displayName = "Ginger.Current.QueuePosition";
