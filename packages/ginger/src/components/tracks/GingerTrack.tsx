import { useId } from "react";
import type { Track } from "../../types";
import { useGingerTracksRegistry } from "./GingerTracksRegistryContext";

/** Props for declarative queue entries; `title` and `fileUrl` or `src` are required. */
export type GingerTrackProps = Omit<Partial<Track>, "fileUrl" | "title"> & {
  title: string;
  fileUrl?: string;
  /** Alias for `fileUrl`. */
  src?: string;
};

function buildTrack(props: GingerTrackProps): Track {
  const fileUrl = props.fileUrl ?? props.src;
  if (!fileUrl || fileUrl === "") {
    throw new Error("Ginger.Track requires a non-empty fileUrl or src.");
  }
  const {
    src: _s,
    fileUrl: _f,
    title,
    id,
    artist,
    copyright,
    description,
    album,
    artworkUrl,
    genre,
    year,
    label,
    isrc,
    trackNumber,
    lyrics,
    lyricsTimed,
    chapters,
    durationSeconds,
    metadata,
  } = props;

  return {
    ...(id !== undefined ? { id } : {}),
    title,
    fileUrl,
    ...(artist !== undefined ? { artist } : {}),
    ...(copyright !== undefined ? { copyright } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(album !== undefined ? { album } : {}),
    ...(artworkUrl !== undefined ? { artworkUrl } : {}),
    ...(genre !== undefined ? { genre } : {}),
    ...(year !== undefined ? { year } : {}),
    ...(label !== undefined ? { label } : {}),
    ...(isrc !== undefined ? { isrc } : {}),
    ...(trackNumber !== undefined ? { trackNumber } : {}),
    ...(lyrics !== undefined ? { lyrics } : {}),
    ...(lyricsTimed !== undefined ? { lyricsTimed } : {}),
    ...(chapters !== undefined ? { chapters } : {}),
    ...(durationSeconds !== undefined ? { durationSeconds } : {}),
    ...(metadata !== undefined ? { metadata } : {}),
  };
}

/**
 * Declarative queue entry. Renders nothing; registers a {@link Track} with the nearest parent
 * {@link GingerTracks}. Must be a descendant of `<Ginger.Tracks>`.
 */
export function GingerTrack(props: GingerTrackProps) {
  const registry = useGingerTracksRegistry();
  const reactId = useId().replace(/:/g, "");
  const id = props.id ?? `ginger-decl:${reactId}`;
  const track = buildTrack({ ...props, id });

  registry.slots.set(id, track);
  registry.order.push(id);

  return null;
}

GingerTrack.displayName = "Ginger.Track";
