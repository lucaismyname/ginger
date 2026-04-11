# Changelog

All notable changes to `@lucaismyname/ginger` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Pending release.

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
