import type { ReactNode } from "react";
import type { DisplayBaseProps, GingerState, PlaybackUiState } from "../../types";
import { useGingerState } from "../../context/GingerSplitContexts";
import { derivePlaybackUiState } from "../../internal/selectors";

export type PlaybackStateProps = DisplayBaseProps & {
  children?: (value: PlaybackUiState, state: GingerState) => ReactNode;
};

export function PlaybackState({ className, style, fallback, empty, children }: PlaybackStateProps) {
  const state = useGingerState();
  const value = derivePlaybackUiState(state);
  if (children) return <span className={className} style={style}>{children(value, state)}</span>;
  return (
    <span className={className} style={style}>
      {value}
    </span>
  );
}

PlaybackState.displayName = "Ginger.Current.PlaybackState";

export type ErrorMessageProps = DisplayBaseProps & {
  children?: (value: string, state: GingerState) => ReactNode;
};

export function ErrorMessage({ className, style, fallback, empty, children }: ErrorMessageProps) {
  const state = useGingerState();
  const value = state.errorMessage ?? "";
  if (!value) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  if (children) return <span className={className} style={style}>{children(value, state)}</span>;
  return (
    <span className={className} style={style}>
      {value}
    </span>
  );
}

ErrorMessage.displayName = "Ginger.Current.ErrorMessage";
