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

## Utilities exported from root

- `clampPlaybackRate()`
- `clampVolume()`
- `derivePlaybackUiState()`
- `parseLrc()`

For generated per-symbol API documentation, open [`../api/index.html`](../api/index.html).
