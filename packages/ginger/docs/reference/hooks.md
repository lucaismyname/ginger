# Hooks Reference

## Core hooks

- `useGinger()`: combined playback/media state plus high-level actions.
- `useGingerState()`, `useGingerPlayback()`, `useGingerMedia()`: split context hooks.

## Control bindings

- `usePlayPauseBinding()`
- `useSeekBarBinding()`
- `useVolumeSlider()`

## Optional feature hooks

- `useGingerKeyboardShortcuts()`
- `useGingerChapters()`
- `useGingerLyricsSync()`
- `useGingerSleepTimer()`
- `useSeekDrag()`
- `useNextTrackPrefetch()`
- `useGingerDebugLog()`
- `useGingerLiveAnalyzer()`

## Subpath-only hooks

See [`subpaths.md`](./subpaths.md) for import paths and usage.

- `@lucaismyname/ginger/equalizer` — `useGingerEqualizer()`
- `@lucaismyname/ginger/spatial` — `useGingerSpatialAudio()`
- `@lucaismyname/ginger/transcript` — `useGingerTranscriptSync()` (plus `parseSrt` / `parseVtt` / `parseTranscriptAuto`)
- `@lucaismyname/ginger/remote` — `useGingerRemote()`

## Utilities exported from root

- `clampPlaybackRate()`
- `clampVolume()`
- `derivePlaybackUiState()`
- `parseLrc()`

For generated per-symbol API documentation, open [`../api/index.html`](../api/index.html).
