import type { PlaylistMeta, Track } from "@lucaismyname/ginger";

/** Remote samples for demo only (replace with your own files / `public/samples`). */
const u = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const demoTracks: Track[] = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    fileUrl: u(1),
    album: "Examples",
    artworkUrl: "https://www.soundhelix.com/img/soundhelix.gif",
    description: "Short streaming-friendly demo track.",
    copyright: "Demo / third-party",
    genre: "Electronic",
    year: 2009,
    durationSeconds: 60 * 7,
  },
  {
    title: "SoundHelix Song 2",
    artist: "SoundHelix",
    fileUrl: u(2),
    album: "Examples",
    genre: "Electronic",
    year: 2009,
  },
  {
    title: "SoundHelix Song 3",
    artist: "SoundHelix",
    fileUrl: u(3),
    album: "Examples",
    genre: "Electronic",
    year: 2009,
  },
];

export const demoPlaylistMeta: PlaylistMeta = {
  title: "Demo playlist",
  subtitle: "Example album subtitle",
  description: "Queue metadata for `Ginger.Queue.*` components.",
  artworkUrl: "https://www.soundhelix.com/img/soundhelix.gif",
};
