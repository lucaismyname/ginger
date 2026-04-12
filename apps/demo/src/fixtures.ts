import type { PlaylistMeta, Track } from "@lucaismyname/ginger";

/**
 * Same-origin sample (`public/samples/demo.mp3`) so Web Audio (EQ, spatial, decode peaks) and
 * `fetch` + `decodeAudioData` work — cross-origin URLs without CORS (e.g. SoundHelix) break those APIs.
 */
export const demoAudioUrl = "/samples/demo.mp3";

export const demoTracks: Track[] = [
  {
    title: "Demo sample (MDN CC0)",
    artist: "Ginger demo",
    fileUrl: demoAudioUrl,
    album: "Local / public/samples",
    artworkUrl: "https://www.soundhelix.com/img/soundhelix.gif",
    description: "Short clip for Web Audio–safe playback in the playground.",
    copyright: "CC0 (via MDN interactive-examples)",
    genre: "Demo",
    year: 2026,
    durationSeconds: 4,
  },
  {
    title: "Same file (queue B)",
    artist: "Ginger demo",
    fileUrl: demoAudioUrl,
    album: "Local / public/samples",
    genre: "Demo",
    year: 2026,
  },
  {
    title: "Same file (queue C)",
    artist: "Ginger demo",
    fileUrl: demoAudioUrl,
    album: "Local / public/samples",
    genre: "Demo",
    year: 2026,
  },
];

/** SRT cues aligned to the short bundled MP3 (~few seconds) so lines advance during playback. */
export const demoTranscriptSrt = `
1
00:00:00,000 --> 00:00:00,900
Opening — demo transcript line one.

2
00:00:00,900 --> 00:00:01,800
Middle: text follows Ginger playback time.

3
00:00:01,800 --> 00:00:02,700
Third cue — scrub the seek bar to jump.

4
00:00:02,700 --> 00:00:09,000
Closing cue (pad past track end for seeks).
`.trim();

export const demoPlaylistMeta: PlaylistMeta = {
  title: "Demo playlist",
  subtitle: "Example album subtitle",
  description: "Queue metadata for `Ginger.Queue.*` components.",
  artworkUrl: "https://www.soundhelix.com/img/soundhelix.gif",
};
