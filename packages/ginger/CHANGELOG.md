# Changelog

All notable changes to `@lucaismyname/ginger` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

### Changed

### Fixed

## [0.0.27] - 2026-04-12

### Added

- `Ginger.Provider` `asChild` merges shell props (`className`, `style`, `data-ginger-playback`, `dir`) onto a single child element instead of wrapping in an extra `div`.
- `GingerLocaleMessages.chaptersList` and `syncedLyricsList` for accessible names on `Ginger.Current.Chapters` and `Ginger.Current.LyricsSynced` lists (override via `locale` on the provider).
- `Ginger.Current.Lyrics` `unstyled` skips default `whiteSpace: pre-wrap` when `preserveWhitespace` is true so typography can be applied only via `className` / `style`.

### Changed

- README: single introduction (removed duplicate install/quick start), clearer **react** / **react-dom** peer story, and positioning for batteries-included defaults versus `unstyled` / headless usage.
- Package `description` aligned with batteries-included positioning.

### Fixed

- `Chapters` default row content respects `unstyled` (no nested timestamp `<span>` styling when unstyled).
- `Ginger.Control.PlaybackRate` no longer inserts a stray text node before `<option>` children in `<select>`.

## [0.0.22] - 2026-04-11

### Fixed

- Preserved `playbackRate` across track changes (`Next`/`Prev`) by re-applying speed after media source load.
- Added a regression test to ensure browsers resetting playback speed on `load()` does not affect Ginger state.

## [0.0.21] - 2026-04-11

### Changed

- Version bump release for demo/landing integration updates (no public API changes in `@lucaismyname/ginger`).

## [0.0.20] - 2026-04-11

### Added

- `Ginger.Control.PlayPause` now supports optional `children`, enabling custom icon/content rendering while keeping default label fallback behavior.

## [0.0.19] - 2026-04-11

### Added

- Exported subpaths for `client`, `testing`, `waveform`, and `experimental-gapless`.
- Expanded README examples and usage guides for headless composition patterns.

### Changed

- Improved testing harness and coverage configuration for internal package tests.
