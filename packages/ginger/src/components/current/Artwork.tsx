import type { CSSProperties, ImgHTMLAttributes } from "react";
import type { DisplayBaseProps } from "../../types";
import { useGingerContext } from "../../context/GingerContext";
import { getCurrentTrack, resolvedArtwork } from "../../internal/selectors";

export type ArtworkProps = DisplayBaseProps &
  Pick<ImgHTMLAttributes<HTMLImageElement>, "sizes" | "loading" | "onError" | "decoding"> & {
    imgStyle?: CSSProperties;
  };

export function Artwork({ className, style, fallback, empty, sizes, loading, onError, decoding, imgStyle }: ArtworkProps) {
  const { state } = useGingerContext();
  const track = getCurrentTrack(state);
  const src = resolvedArtwork(state);
  if (!src) {
    const node = empty ?? fallback ?? null;
    return node ? <span className={className} style={style}>{node}</span> : null;
  }
  const alt = [track?.title, track?.artist].filter(Boolean).join(" — ") || "Artwork";
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        background: "var(--ginger-artwork-bg, transparent)",
        borderRadius: "var(--ginger-artwork-radius, 0)",
        overflow: "hidden",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        onError={onError}
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

Artwork.displayName = "Ginger.Current.Artwork";
