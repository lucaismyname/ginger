import type { CSSProperties, ReactNode } from "react";
import type { DisplayBaseProps, GingerState } from "../../types";
import { useGingerState } from "../../context/GingerSplitContexts";
import { getCurrentTrack } from "../../internal/selectors";

export type LyricsProps = DisplayBaseProps & {
  children?: (value: string, state: GingerState) => ReactNode;
  /** When true, preserves internal newlines; trims only leading/trailing whitespace */
  preserveWhitespace?: boolean;
};

export function Lyrics({ className, style, fallback, empty, children, preserveWhitespace = true }: LyricsProps) {
  const state = useGingerState();
  const raw = getCurrentTrack(state)?.lyrics ?? "";
  const value = preserveWhitespace ? raw.replace(/^\s+|\s+$/g, "") : raw.trim();
  if (!value) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  const whiteStyle: CSSProperties | undefined = preserveWhitespace ? { whiteSpace: "pre-wrap" } : undefined;
  if (children) return <span className={className} style={{ ...whiteStyle, ...style }}>{children(value, state)}</span>;
  return (
    <span className={className} style={{ ...whiteStyle, ...style }}>
      {value}
    </span>
  );
}

Lyrics.displayName = "Ginger.Current.Lyrics";
