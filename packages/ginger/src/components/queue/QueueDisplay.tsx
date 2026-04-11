import type { CSSProperties } from "react";
import type { DisplayBaseProps } from "../../types";
import { createTextDisplay } from "../current/createTextDisplay";
import { useGingerContext } from "../../context/GingerContext";

export const Title = createTextDisplay("Ginger.Queue.Title", (s) => s.playlistMeta?.title);
export const Subtitle = createTextDisplay("Ginger.Queue.Subtitle", (s) => s.playlistMeta?.subtitle);
export const Description = createTextDisplay("Ginger.Queue.Description", (s) => s.playlistMeta?.description);
export const Copyright = createTextDisplay("Ginger.Queue.Copyright", (s) => s.playlistMeta?.copyright);

export type QueueArtworkProps = DisplayBaseProps & {
  imgStyle?: CSSProperties;
};

export function Artwork({ className, style, fallback, empty, imgStyle }: QueueArtworkProps) {
  const { state } = useGingerContext();
  const src = state.playlistMeta?.artworkUrl;
  if (!src) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  const alt = state.playlistMeta?.title ?? "Playlist artwork";
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        background: "var(--ginger-artwork-bg, #f3f4f6)",
        borderRadius: "var(--ginger-artwork-radius, 6px)",
        overflow: "hidden",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...imgStyle,
        }}
      />
    </span>
  );
}

Artwork.displayName = "Ginger.Queue.Artwork";
