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
- `useAudioPeaks` for a lightweight single row of peaks (supports `maxBuckets` and `maxSamplesPerBucket` guardrails for large files)

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

The subpath also exports **`DEFAULT_REMOTE_CHANNEL_NAME`** and the **`RemoteMessage`** type for apps that want to share channel constants or type custom protocol helpers.

## `@lucaismyname/ginger/crossfade`

Web Audio–based **overlap** between outgoing and incoming media (distinct from the long-term **gapless** roadmap in [`GAPLESS_ROADMAP.md`](../GAPLESS_ROADMAP.md), which targets seamless *adjacent* track transitions on a single element).

| Export | Purpose |
|--------|---------|
| **`useGingerCrossfade`** | React hook: schedule fades against the active Ginger `<audio>` element and optional graph state. |
| **`attachCrossfadeGraph`**, **`scheduleCrossfade`**, **`teardownCrossfadeGraph`** | Imperative helpers for wiring / tearing down nodes (`CrossfadeGraph`, `CrossfadeCurve` types). |

Shares the same design constraint as EQ/spatial: processing attaches to the **current** media element graph; call **`teardownCrossfadeGraph`** when unmounting or switching strategies to avoid leaking `AudioContext` nodes.

## `@lucaismyname/ginger/devtools`

Development-only debugging overlay: import **`GingerDevtools`** from **`@lucaismyname/ginger/devtools`** and render it once anywhere in the app (even outside **`Ginger.Provider`**). It discovers every active provider via a small global registry, supports multiple players (tabs / **`debugLabel`** on **`Ginger.Provider`**), and can drive playback actions (play/pause, seek, volume, queue) in addition to showing state. Styling uses Tailwind via CDN injected on mount. See the root [`README.md`](../../README.md) for usage.

## `@lucaismyname/ginger/experimental-gapless`

Gapless **environment** probe (Milestone 1); Ginger playback is still a single `<audio>` via `Ginger.Player`.

- `probeGaplessCapability()` — pure function, safe on SSR (returns unsupported when `window` is missing).
- `useExperimentalGapless()` — React hook combining the probe with `preloadedTrackIds` from the current queue.

## Generated API

The TypeDoc build includes the main [`src/index.ts`](../../src/index.ts) entry **and** subpath entry files (see [`typedoc.json`](../../typedoc.json)), including **`crossfade`**. The docs landing page is [`api-overview.md`](../api-overview.md). This file is the canonical hand-written reference for subpaths; import paths match [`package.json` `exports`](../../package.json).

---

## Docs layout

For a map of everything under `docs/` (Markdown vs generated HTML), see [`README.md`](../README.md).
