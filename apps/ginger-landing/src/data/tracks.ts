import type { Track } from "@lucaismyname/ginger";

/**
 * Bundled same-origin MP3s under `public/samples/` so the landing page
 * works without depending on external CDNs (SoundHelix, etc.).
 *
 * Sources (Internet Archive / netlabels — Creative Commons):
 * - Piano: AnthonyB — coffee and piano (skd-1206)
 * - Electric guitar: Tigerberry — Cold Wave (SCL160)
 * - Acoustic guitar: Zak Whitefield — Dorm Room EP (Hfr022)
 */
export const LANDING_TRACKS: Track[] = [
  {
    title: "Sole",
    artist: "AnthonyB",
    fileUrl: "/samples/piano-sole.mp3",
    album: "coffee and piano",
    artworkUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=320&h=320&q=80",
    chapters: [
      { title: "Intro", startSeconds: 0 },
      { title: "Main theme", startSeconds: 60 },
      { title: "Variation", startSeconds: 180 },
    ],
  },
  {
    title: "Get Out",
    artist: "Tigerberry",
    fileUrl: "/samples/electric-guitar-get-out.mp3",
    album: "Cold Wave",
    artworkUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=320&h=320&q=80",
    chapters: [
      { title: "Intro groove", startSeconds: 0 },
      { title: "Lift", startSeconds: 70 },
      { title: "Drop", startSeconds: 165 },
    ],
  },
  {
    title: "County",
    artist: "Zak Whitefield",
    fileUrl: "/samples/acoustic-guitar-county.mp3",
    album: "Dorm Room EP",
    artworkUrl:
      "https://images.unsplash.com/photo-1461784180009-21121b2f204c?auto=format&fit=crop&w=320&h=320&q=80",
    chapters: [
      { title: "Ambient start", startSeconds: 0 },
      { title: "Main section", startSeconds: 85 },
      { title: "Bridge", startSeconds: 210 },
    ],
  },
];
