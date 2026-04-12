Bundled demo audio
------------------
Same-origin files in this folder keep Web Audio (equalizer, spatial) and `fetch` +
`decodeAudioData` (file waveform peaks) working — remote URLs without
`Access-Control-Allow-Origin` break those APIs when `crossOrigin` is set or when
decoding for visualization.

Included MP3s (downloaded from archive.org — netlabels / community audio; Creative Commons–licensed uploads):

1. piano-sole.mp3 — AnthonyB, “coffee and piano” (identifier `skd-1206` on archive.org). Piano-focused track.
2. electric-guitar-get-out.mp3 — Tigerberry, “Get Out” from “Cold Wave” (`SCL160`). Rock / electric guitar.
3. acoustic-guitar-county.mp3 — Zak Whitefield, “County” from “Dorm Room EP” (`Hfr022-zakWhitefield-DormRoomEp`). Acoustic guitar / singer-songwriter.

`demo.mp3` — short CC0 clip from MDN interactive-examples (legacy tiny sample); the main playground uses the three tracks above via `src/fixtures.ts`.

Attribution: respect each release’s license on its archive.org details page when redistributing or remixing.
