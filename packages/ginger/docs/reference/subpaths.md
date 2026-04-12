# Subpath exports

Optional entrypoints keep the default bundle focused while advanced features opt in via dedicated imports.

## `@lucaismyname/ginger/client`

Client-compatible entrypoint with `"use client"` for SSR frameworks (for example Next.js App Router).

## `@lucaismyname/ginger/testing`

Testing utilities for rendering providers, querying media elements, simulating audio events, and asserting queue state.

See [`guides/testing.md`](../guides/testing.md).

## `@lucaismyname/ginger/waveform`

Waveform and analysis utilities for visualizations and offline audio analysis:

- `useAudioFileAnalysis`, `analyzeAudioFile`, `analyzeAudioBuffer`
- `useAudioPeaks` for a lightweight single row of peaks

## `@lucaismyname/ginger/equalizer`

Parametric EQ via `useGingerEqualizer`: inserts `BiquadFilterNode`s into the Web Audio graph for the active `Ginger` media element. Shares the same `AudioContext` as `useGingerLiveAnalyzer` and `useGingerSpatialAudio`.

## `@lucaismyname/ginger/spatial`

3D / HRTF spatial audio via `useGingerSpatialAudio`:

- Inserts a `PannerNode` between the media element source and the output (same graph as EQ and live analyser).
- Options include `panningModel` (default `"HRTF"`), `distanceModel`, `refDistance`, `position`, and `listenerPosition`.
- Imperative updates: `setSourcePosition`, `setListenerPosition`, `setPanningModel`.

Useful for games, immersive players, or any UI that needs directional audio without leaving the native `<audio>` pipeline.

## `@lucaismyname/ginger/transcript`

Podcast- and caption-oriented timed text:

| Export | Purpose |
|--------|---------|
| `parseSrt` | Parse SubRip (`.srt`) strings into `TranscriptCue[]` |
| `parseVtt` | Parse WebVTT (`.vtt`) strings into `TranscriptCue[]` |
| `parseTranscriptAuto` | Detect VTT (`WEBVTT` header) vs SRT |
| `parseTimestampToSeconds` | Low-level timestamp helper |
| `useGingerTranscriptSync` | React hook: `activeCue`, `activeCues` (overlaps), `activeIndex`, synced to `currentTime` |

Cue text has HTML tags stripped (typical WebVTT markup). For in-track **LRC** lyrics on `Track`, the main package still provides `useGingerLyricsSync` and `parseLrc()`.

## `@lucaismyname/ginger/remote`

Multi-tab coordination with `BroadcastChannel` and `useGingerRemote`:

- **Leader election** — PING / PONG, `LEADER_ANNOUNCE` with deterministic tie-break (lexicographic `tabId`).
- **State sync** — Leader broadcasts `STATE_SNAPSHOT` payloads applied on followers with `init()` (same shape as `INIT`).
- **Single audio element** — Mount `Ginger.Player` only when `isLeader` is true so one tab owns playback.

Options: `channelName` (default `"ginger-remote"`), `heartbeatMs`, `electionTimeoutMs`. Snapshots use `isShuffled: false` with the leader’s current `tracks` array so follower queue order matches without re-shuffling.

Requires `BroadcastChannel` (not available in some SSR environments); the hook sets `error` when unsupported.

## `@lucaismyname/ginger/experimental-gapless`

Experimental capability placeholder.

- Not production-ready.
- Does not patch or replace playback internals.
- Intended for early contract discussion and metadata experimentation.

## Generated API

The TypeDoc build currently targets the main [`src/index.ts`](../../src/index.ts) entry. Subpath modules are documented in this file and in the package [`README.md`](../../README.md); import paths match `package.json` `exports`.
