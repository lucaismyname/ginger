import type { CSSProperties, ReactNode } from "react";
import { useGingerState } from "../../context/GingerSplitContexts";
import { type GingerChapter, useGingerChapters } from "../../hooks/useGingerChapters";
import { formatMmSs } from "../../internal/formatTime";
import type { DisplayBaseProps, GingerState } from "../../types";

export type ChaptersProps = Omit<DisplayBaseProps, "children"> & {
  /** Remove default list/row styles for fully custom styling. */
  unstyled?: boolean;
  /** Prefix before each chapter title (default: `formatMmSs(startSeconds)`). */
  formatStart?: (startSeconds: number) => string;
  children?: (
    chapter: GingerChapter,
    index: number,
    active: boolean,
    state: GingerState,
  ) => ReactNode;
};

export function Chapters({
  className,
  style,
  fallback,
  empty,
  unstyled = false,
  formatStart = formatMmSs,
  children,
}: ChaptersProps) {
  const state = useGingerState();
  const { list, activeIndex, seekTo } = useGingerChapters();

  if (list.length === 0) {
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
    <ul className={className} style={{ ...listStyle, ...style }} aria-label="Chapters">
      {list.map((chapter, index) => {
        const active = index === activeIndex;
        return (
          <li key={`${chapter.startSeconds}-${chapter.title}`}>
            <button
              type="button"
              aria-current={active ? "true" : undefined}
              data-ginger-active={active || undefined}
              onClick={() => seekTo(index)}
              style={{
                width: unstyled ? undefined : "100%",
                textAlign: unstyled ? undefined : "left",
                border: unstyled ? undefined : "none",
                background: unstyled
                  ? undefined
                  : active
                    ? "var(--ginger-playlist-active-bg, rgba(17, 24, 39, 0.06))"
                    : "transparent",
                color: unstyled ? undefined : "inherit",
                font: unstyled ? undefined : "inherit",
                cursor: unstyled ? undefined : "pointer",
                padding: unstyled ? undefined : "var(--ginger-playlist-row-padding, 6px 8px)",
              }}
            >
              {children ? (
                children(chapter, index, active, state)
              ) : (
                <span>
                  <span style={{ opacity: 0.75, marginRight: "0.35em" }}>
                    {formatStart(chapter.startSeconds)}
                  </span>
                  {chapter.title}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

Chapters.displayName = "Ginger.Current.Chapters";
