import { describe, expect, it } from "vitest";
import type { Track } from "../types";
import type {
  CastLoadRequestLike,
  CastMediaInfoLike,
  CastMusicTrackMetadata,
  ChromeCastNamespace,
} from "./castTypes";
import { guessContentTypeFromUrl, trackToMediaInfo } from "./trackToMediaInfo";

function makeMockChromeCast(): ChromeCastNamespace {
  class MusicTrackMediaMetadata implements CastMusicTrackMetadata {
    metadataType = 0;
    title?: string;
    artist?: string;
    albumName?: string;
    images?: { url: string }[];
  }
  class MediaInfo implements CastMediaInfoLike {
    contentId: string;
    contentType: string;
    streamType?: string;
    metadata?: CastMusicTrackMetadata;
    constructor(contentId: string, contentType: string) {
      this.contentId = contentId;
      this.contentType = contentType;
    }
  }
  class LoadRequest implements CastLoadRequestLike {
    media: CastMediaInfoLike;
    autoplay?: boolean;
    currentTime?: number;
    constructor(mediaInfo: CastMediaInfoLike) {
      this.media = mediaInfo;
    }
  }
  return {
    isAvailable: true,
    AutoJoinPolicy: {
      ORIGIN_SCOPED: 1,
      TAB_AND_ORIGIN_SCOPED: 2,
    },
    media: {
      DEFAULT_MEDIA_RECEIVER_APP_ID: "CC1AD845",
      MediaInfo,
      MusicTrackMediaMetadata,
      LoadRequest,
      MetadataType: { MUSIC_TRACK: 3 },
      StreamType: { BUFFERED: "BUFFERED" },
    },
  };
}

describe("guessContentTypeFromUrl", () => {
  it("maps common extensions", () => {
    expect(guessContentTypeFromUrl("https://cdn.example/a.mp3")).toBe("audio/mpeg");
    expect(guessContentTypeFromUrl("/path/track.m4a")).toBe("audio/mp4");
    expect(guessContentTypeFromUrl("https://x.dev/x.flac")).toBe("audio/flac");
  });

  it("falls back for unknown extension", () => {
    expect(guessContentTypeFromUrl("https://x.dev/unknown.xyz")).toBe("audio/mpeg");
  });
});

describe("trackToMediaInfo", () => {
  it("builds a LoadRequest with stream, metadata, and artwork", () => {
    const chromeCast = makeMockChromeCast();
    const track: Track = {
      title: "Song",
      fileUrl: "https://media.example/song.mp3",
      artist: "Artist",
      album: "Album",
      artworkUrl: "https://media.example/cover.jpg",
    };
    const req = trackToMediaInfo(chromeCast, track);
    expect(req.media.contentId).toBe(track.fileUrl);
    expect(req.media.contentType).toBe("audio/mpeg");
    expect(req.media.streamType).toBe("BUFFERED");
    expect(req.media.metadata?.title).toBe("Song");
    expect(req.media.metadata?.artist).toBe("Artist");
    expect(req.media.metadata?.albumName).toBe("Album");
    expect(req.media.metadata?.images?.[0]?.url).toBe("https://media.example/cover.jpg");
  });

  it("respects contentTypeResolver", () => {
    const chromeCast = makeMockChromeCast();
    const track: Track = { title: "A", fileUrl: "https://x.dev/a.mp3" };
    const req = trackToMediaInfo(chromeCast, track, {
      contentTypeResolver: () => "application/octet-stream",
    });
    expect(req.media.contentType).toBe("application/octet-stream");
  });
});
