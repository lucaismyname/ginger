# Changelog

All notable changes to `@lucaismyname/ginger` are documented here.

## 0.0.45

- Add crossfade module (`@lucaismyname/ginger/crossfade`)
- Adjust hook deps to follow active audio source
- Regenerate API docs with crossfade coverage

## 0.0.44

- Update docs and landing UI controls
- Prevent replay loop at queue end

## 0.0.41

- Polish landing UI
- Add verify script and Biome linting

## 0.0.39

- Exclude ginger from Vite `optimizeDeps` in apps
- Link local ginger package; add docs and experimental gapless probe

## 0.0.37

- Add audio demos and bundled demo MP3s
- Add Radix-based playback rate select
- Add app typechecks and chapter markers on seek bar
- Use ref for EQ bands to avoid effect deps
- Add docs for spatial, transcript, and remote modules

## 0.0.33

- Add remote-control module (`@lucaismyname/ginger/remote`)
- Add spatial audio module (`@lucaismyname/ginger/spatial`)
- Add transcript sync module (`@lucaismyname/ginger/transcript`)
- Add equalizer module (`@lucaismyname/ginger/equalizer`)
- Add `useGingerPlaybackHistory` and `useGingerVolumeFade` hooks

## 0.0.27

- Add `asChild` prop support on control components
- Add locale / i18n context (`useGingerLocale`)
- Add unstyled mode for zero-opinion styling
- Use inline Lucide icons for default controls
- Add live audio analyzer tests and `mockWebAudio` test helper

## 0.0.24

- Add `children` prop to control components
- Add `react-scan` dev tooling

## 0.0.22

- Add waveform player example and fix `playbackRate` bug

## 0.0.20

- Add landing player controls
- Use `@lucaismyname/ginger` in landing app

## 0.0.18

- Add CI workflow (GitHub Actions) and TypeDoc API docs
- Bump package version

## 0.0.17

- Add chapter markers with `TrackChapter` type
- Add synced lyrics (`LyricsSynced`)
- Add `useNextTrackPrefetch` hook

## 0.0.14

- Add test suite and `@lucaismyname/ginger/testing` subpath export
- Add `renderGinger` and `helpers` test utilities

## 0.0.12

- Expose `setPlaybackMode`; clear media source on track removal
- Add live audio analysis (`useGingerLiveAnalyzer`) and FFT utilities

## 0.0.10

- Add ginger-landing Vite app
- Add unstyled mode and playback options
- Add queue actions, playback modes, and persistence hooks
- Split contexts into playback vs media for performance

## 0.0.5

- Add `GingerProvider`, `GingerPlayer`, and core reducer
- Add locale and control binding hooks
- Add init API, a11y improvements, and initial docs

## 0.0.1

- Initialize monorepo with demo app
- Add volume, mute, and playback rate controls
- Add manual playlist mode
