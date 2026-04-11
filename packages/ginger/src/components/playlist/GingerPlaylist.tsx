import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useGingerContext } from "../../context/GingerContext";
import type { Track } from "../../types";

export type GingerPlaylistProps = HTMLAttributes<HTMLUListElement> & {
  rowStyle?: CSSProperties;
  renderTrack?: (track: Track, index: number, isActive: boolean) => ReactNode;
  /** When true (default), clicking a row selects that index and starts playback */
  playOnSelect?: boolean;
};

export function GingerPlaylist({
  rowStyle,
  renderTrack,
  playOnSelect = true,
  style,
  ...rest
}: GingerPlaylistProps) {
  const { state, playTrackAt, selectTrackAt } = useGingerContext();
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        fontFamily: "var(--ginger-font-family, system-ui, sans-serif)",
        fontSize: "var(--ginger-font-size, 14px)",
        color: "var(--ginger-primary-color, #111827)",
        ...style,
      }}
      {...rest}
    >
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
  );
}

GingerPlaylist.displayName = "Ginger.Playlist";
