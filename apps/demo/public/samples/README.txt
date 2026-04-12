Bundled demo audio
------------------
`demo.mp3` is a short CC0 clip from MDN interactive-examples (t-rex-roar), used so the playground
can use Web Audio (equalizer, spatial) and `fetch` + `decodeAudioData` (file waveform peaks) without
cross-origin CORS issues.

Remote URLs without `Access-Control-Allow-Origin` break those APIs when `crossOrigin` is set or when
fetching for decode.

Replace with your own files and point `Track.fileUrl` at `/samples/your-track.mp3`.
