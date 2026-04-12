import type { CSSProperties, ReactNode } from "react";
import { useGingerLocale } from "../../context/GingerLocaleContext";
import { useGingerState } from "../../context/GingerSplitContexts";
import { useGingerLyricsSync } from "../../hooks/useGingerLyricsSync";
import type { TimedLyricLine } from "../../internal/lyrics";
import type { DisplayBaseProps, GingerState } from "../../types";

export type LyricsSyncedProps = Omit<DisplayBaseProps, "children"> & {
  unstyled?: boolean;
  /** Class applied to the line that matches the current playback time. */
  activeClassName?: string;
  /** Class applied to every line. */
  lineClassName?: string;
  children?: (
    line: TimedLyricLine,
    index: number,
    active: boolean,
    state: GingerState,
  ) => ReactNode;
};

export function LyricsSynced({
  className,
  style,
  fallback,
  empty,
  unstyled = false,
  activeClassName,
  lineClassName,
  children,
}: LyricsSyncedProps) {
  const state = useGingerState();
  const locale = useGingerLocale();
  const { lines, activeIndex } = useGingerLyricsSync();

  if (lines.length === 0) {
    const node = empty ?? fallback ?? null;
    return node ? (
      <span className={className} style={style}>
        {node}
      </span>
    ) : null;
  }

  const listStyle: CSSProperties = unstyled
    ? {}
    : {
        listStyle: "none",
        margin: 0,
        padding: 0,
        fontFamily: "var(--ginger-font-family, system-ui, sans-serif)",
        fontSize: "var(--ginger-font-size, 14px)",
        color: "var(--ginger-primary-color, #111827)",
      };

  return (
    <ul
      className={className}
      style={{ ...listStyle, ...style }}
      aria-label={locale.syncedLyricsList}
    >
      {lines.map((line, index) => {
        const active = index === activeIndex;
        return (
          <li
            key={`${line.time}-${index}`}
            aria-current={active ? "true" : undefined}
            data-ginger-active={active || undefined}
            className={
              [lineClassName, active ? activeClassName : undefined].filter(Boolean).join(" ") ||
              undefined
            }
            style={
              unstyled
                ? undefined
                : {
                    padding: "var(--ginger-playlist-row-padding, 4px 8px)",
                    fontWeight: active ? 600 : 400,
                    opacity: active ? 1 : 0.75,
                  }
            }
          >
            {children ? children(line, index, active, state) : line.text}
          </li>
        );
      })}
    </ul>
  );
}

LyricsSynced.displayName = "Ginger.Current.LyricsSynced";
