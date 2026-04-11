# Components Reference

## Provider and player

- `Ginger.Provider`: owns queue + media state and lifecycle callbacks.
- `Ginger.Player`: renders/synchronizes the underlying `<audio>` element.

## Control components

- `Ginger.Control.PlayPause`
- `Ginger.Control.Repeat`
- `Ginger.Control.Next`
- `Ginger.Control.Previous`
- `Ginger.Control.Shuffle`
- `Ginger.Control.SeekBar`
- `Ginger.Control.Volume`
- `Ginger.Control.Mute`
- `Ginger.Control.PlaybackRate`

## Current track components

- Metadata labels (`Title`, `Artist`, `Album`, `Genre`, etc.)
- Time displays (`Elapsed`, `Duration`, `Remaining`, `TimeRail`, `BufferRail`)
- Rich content (`Artwork`, `Lyrics`, `LyricsSynced`, `Chapters`)
- Playback status (`PlaybackState`, `ErrorMessage`)

## Queue and playlist components

- `Ginger.Queue.*` for active queue metadata display.
- `Ginger.Playlist` and `Ginger.Playlist.Track` for queue rendering and interaction.

For hook-level APIs, see [`hooks.md`](./hooks.md).
