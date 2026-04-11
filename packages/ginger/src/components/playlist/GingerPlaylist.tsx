import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from "react";
import { useGingerContext } from "../../context/GingerContext";
import type { Track } from "../../types";

export type GingerPlaylistConfig = {
  playOnSelect: boolean;
};

const GingerPlaylistConfigContext = createContext<GingerPlaylistConfig | null>(null);

function usePlaylistConfig(): GingerPlaylistConfig {
  const ctx = useContext(GingerPlaylistConfigContext);
  if (!ctx) {
    throw new Error("Ginger.Playlist.Track must be used inside <Ginger.Playlist>");
  }
  return ctx;
}

export type GingerPlaylistProps = Omit<HTMLAttributes<HTMLUListElement>, "children"> & {
  children?: ReactNode;
  rowStyle?: CSSProperties;
  /**
   * Used only in **auto** mode (no custom `children`). Ignored when you pass custom `children`
   * (manual mode); use `Ginger.Playlist.Track` for each row instead.
   */
  renderTrack?: (track: Track, index: number, isActive: boolean) => ReactNode;
  /** When true (default), clicking a row selects that index and starts playback */
  playOnSelect?: boolean;
};

/**
 * - **Auto mode** (no `children`): maps `state.tracks` to rows (optional `renderTrack`).
 * - **Manual mode** (`children` defined): renders `<ul>{children}</ul>`; map `state.tracks` yourself
 *   with `Ginger.Playlist.Track` for each index.
 */
export function GingerPlaylist({
  children,
  rowStyle,
  renderTrack,
  playOnSelect = true,
  style,
  ...rest
}: GingerPlaylistProps) {
  const { state, playTrackAt, selectTrackAt } = useGingerContext();

  const listStyle: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    fontFamily: "var(--ginger-font-family, system-ui, sans-serif)",
    fontSize: "var(--ginger-font-size, 14px)",
    color: "var(--ginger-primary-color, #111827)",
    ...style,
  };

  const manual = children !== undefined;

  if (manual) {
    return (
      <GingerPlaylistConfigContext.Provider value={{ playOnSelect }}>
        <ul style={listStyle} {...rest}>
          {children}
        </ul>
      </GingerPlaylistConfigContext.Provider>
    );
  }

  return (
    <GingerPlaylistConfigContext.Provider value={{ playOnSelect }}>
      <ul style={listStyle} {...rest}>
        {state.tracks.map((track, index) => {
          const active = index === state.currentIndex;
          return (
            <li key={`${track.fileUrl}-${index}`}>
              <button
                type="button"
                onClick={() => {
                  if (playOnSelect) playTrackAt(index);
                  else selectTrackAt(index);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  background: active ? "rgba(17, 24, 39, 0.06)" : "transparent",
                  color: "inherit",
                  font: "inherit",
                  cursor: "pointer",
                  padding: "var(--ginger-playlist-row-padding, 6px 8px)",
                  ...rowStyle,
                }}
              >
                {renderTrack ? (
                  renderTrack(track, index, active)
                ) : (
                  <span>
                    {track.title}
                    {track.artist ? ` — ${track.artist}` : ""}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </GingerPlaylistConfigContext.Provider>
  );
}

GingerPlaylist.displayName = "Ginger.Playlist";

export type GingerPlaylistTrackProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  index: number;
  /** Optional wrapper for the row; defaults to a plain `<li>` */
  liProps?: LiHTMLAttributes<HTMLLIElement>;
};

export function GingerPlaylistTrack({
  index,
  className,
  style,
  children,
  liProps,
  onClick,
  ...buttonRest
}: GingerPlaylistTrackProps) {
  const { playOnSelect } = usePlaylistConfig();
  const { state, playTrackAt, selectTrackAt } = useGingerContext();
  const active = index === state.currentIndex;
  const track = state.tracks[index];
  const defaultLabel =
    track != null ? (
      <span>
        {track.title}
        {track.artist ? ` — ${track.artist}` : ""}
      </span>
    ) : null;

  return (
    <li {...liProps}>
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        data-ginger-active={active || undefined}
        className={className}
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          background: active ? "rgba(17, 24, 39, 0.06)" : "transparent",
          color: "inherit",
          font: "inherit",
          cursor: "pointer",
          padding: "var(--ginger-playlist-row-padding, 6px 8px)",
          ...style,
        }}
        {...buttonRest}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          if (playOnSelect) playTrackAt(index);
          else selectTrackAt(index);
        }}
      >
        {children ?? defaultLabel}
      </button>
    </li>
  );
}

GingerPlaylistTrack.displayName = "Ginger.Playlist.Track";

export const GingerPlaylistCompound = Object.assign(GingerPlaylist, {
  Track: GingerPlaylistTrack,
});
