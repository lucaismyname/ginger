import type { Track } from "../types";
import type { CastLoadRequestLike, ChromeCastNamespace } from "./castTypes";

const EXT_TO_MIME: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".aac": "audio/aac",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".opus": "audio/opus",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".webm": "audio/webm",
};

/**
 * Guess a MIME type from a file URL path. Falls back to `audio/mpeg`.
 */
export function guessContentTypeFromUrl(fileUrl: string): string {
  try {
    const path = new URL(fileUrl, "https://example.com").pathname.toLowerCase();
    const dot = path.lastIndexOf(".");
    if (dot === -1) return "audio/mpeg";
    const ext = path.slice(dot);
    return EXT_TO_MIME[ext] ?? "audio/mpeg";
  } catch {
    return "audio/mpeg";
  }
}

/**
 * Builds a Cast `LoadRequest` for the given track using the runtime `chrome.cast.media` constructors.
 * Call only after `loadCastFramework()` and when `chrome.cast` is defined.
 */
export function createCastLoadRequestFromTrack(
  chromeCast: ChromeCastNamespace,
  track: Track,
  options?: {
    contentTypeResolver?: (t: Track) => string;
  },
): CastLoadRequestLike {
  const contentType =
    options?.contentTypeResolver?.(track) ?? guessContentTypeFromUrl(track.fileUrl);

  const media = new chromeCast.media.MediaInfo(track.fileUrl, contentType);
  media.streamType = chromeCast.media.StreamType.BUFFERED;

  const meta = new chromeCast.media.MusicTrackMediaMetadata();
  meta.metadataType = chromeCast.media.MetadataType.MUSIC_TRACK;
  meta.title = track.title;
  if (track.artist) {
    meta.artist = track.artist;
  }
  if (track.album) {
    meta.albumName = track.album;
  }
  if (track.artworkUrl) {
    meta.images = [{ url: track.artworkUrl }];
  }

  media.metadata = meta;

  return new chromeCast.media.LoadRequest(media);
}
