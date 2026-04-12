# @lucaismyname/ginger

**Batteries-included** React audio primitives for music and podcast UIs on the native **`<audio>`** element: a reducer-backed provider, composable **`Ginger.*`** components, and **`useGinger()`** for full control. Many pieces ship sensible defaults (CSS variables, layout helpers); use **`unstyled`** (and related flags below) when you want **behavior and data only**, with your own styling.

**Peer dependencies:** **`react` ≥ 18** (required). **`react-dom` ≥ 18** is listed as a peer for typical DOM apps; it is **optional** in `peerDependenciesMeta`, so setups that do not use `react-dom` can omit it when appropriate.

## Install

```bash
npm install @lucaismyname/ginger
```

## Quick Start

```tsx
import { Ginger } from "@lucaismyname/ginger";

const tracks = [
  {
    id: "one",
    title: "One",
    artist: "Demo Artist",
    fileUrl: "https://example.com/audio/one.mp3",
    artworkUrl: "https://example.com/art/one.jpg",
  },
  {
    id: "two",
    title: "Two",
    artist: "Demo Artist",
    fileUrl: "https://example.com/audio/two.mp3",
  },
];

export function App() {
  return (
    <Ginger.Provider initialTracks={tracks} initialPlaylistMeta={{ title: "My Playlist" }}>
      <Ginger.Player />
      <Ginger.Current.Title />
      <Ginger.Current.Artist />
      <Ginger.Control.PlayPause />
      <Ginger.Control.Next />
      <Ginger.Playlist />
    </Ginger.Provider>
  );
}
```

Mount **`<Ginger.Player />`** once inside the same provider tree so the hidden audio element exists. Everything else is optional and can be replaced with your own UI (including hooks only).

## Documentation

- Getting started: [`docs/getting-started.md`](./docs/getting-started.md)
- Testing guide: [`docs/guides/testing.md`](./docs/guides/testing.md)
- Recipes: [`docs/guides/recipes.md`](./docs/guides/recipes.md)
- Accessibility checklist: [`docs/guides/accessibility.md`](./docs/guides/accessibility.md)
- Streaming adapters: [`docs/guides/streaming-adapters.md`](./docs/guides/streaming-adapters.md)
- Components reference: [`docs/reference/components.md`](./docs/reference/components.md)
- Hooks reference: [`docs/reference/hooks.md`](./docs/reference/hooks.md)
- Subpath exports: [`docs/reference/subpaths.md`](./docs/reference/subpaths.md)
- Generated API docs: [`docs/api/index.html`](./docs/api/index.html)

## Subpath Exports

- `@lucaismyname/ginger/client`
- `@lucaismyname/ginger/testing`
- `@lucaismyname/ginger/waveform`
- `@lucaismyname/ginger/experimental-gapless`

### Experimental Notice

`@lucaismyname/ginger/experimental-gapless` is intentionally non-production.
It currently provides capability metadata only and does not alter playback behavior.

## Release Process

- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)
- Release note template: [`../../.github/release-template.md`](../../.github/release-template.md)

Before publishing:

```bash
npm run build
npm run test
npm run typecheck
npm run lint
npm run docs:api
```

## Copy/Paste Examples

### Small Audio Player With Tailwind

```tsx
import { Ginger } from "@lucaismyname/ginger";

const tracks = [
  {
    id: "midnight",
    title: "Midnight Walk",
    artist: "Luca",
    album: "Night Notes",
    fileUrl: "https://example.com/audio/midnight-walk.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    durationSeconds: 192,
  },
];

export function TailwindMiniPlayer() {
  return (
    <Ginger.Provider
      initialTracks={tracks}
      initialVolume={0.8}
      className="mx-auto max-w-md"
    >
      <Ginger.Player />

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Ginger.Current.Artwork
            className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-100"
            imgStyle={{ width: "100%", height: "100%" }}
          />

          <div className="min-w-0 flex-1">
            <Ginger.Current.Title className="block truncate text-sm font-semibold text-zinc-900" />
            <Ginger.Current.Artist className="block truncate text-sm text-zinc-500" />
            <div className="mt-2">
              <Ginger.Control.SeekBar className="w-full accent-emerald-600" />
            </div>
            <div className="mt-1 flex justify-between text-xs text-zinc-500">
              <Ginger.Current.Elapsed />
              <Ginger.Current.Duration />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Ginger.Control.Previous className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50" />
          <Ginger.Control.PlayPause className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" />
          <Ginger.Control.Next className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50" />
          <Ginger.Control.Mute className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-zinc-500">Volume</span>
          <Ginger.Control.Volume className="flex-1 accent-emerald-600" />
          <Ginger.Control.PlaybackRate className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-700" />
        </div>
      </div>
    </Ginger.Provider>
  );
}
```

### Small Audio Player With Vanilla CSS

```tsx
import { Ginger } from "@lucaismyname/ginger";
import "./mini-player.css";

const tracks = [
  {
    id: "shoreline",
    title: "Shoreline",
    artist: "Sea Echo",
    fileUrl: "https://example.com/audio/shoreline.mp3",
    artworkUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    durationSeconds: 214,
  },
];

export function VanillaMiniPlayer() {
  return (
    <Ginger.Provider initialTracks={tracks} className="ginger-mini-theme">
      <Ginger.Player />

      <div className="mini-player">
        <Ginger.Current.Artwork className="mini-player__artwork" />

        <div className="mini-player__body">
          <Ginger.Current.Title className="mini-player__title" />
          <Ginger.Current.Artist className="mini-player__artist" />

          <div className="mini-player__seek">
            <Ginger.Control.SeekBar />
          </div>

          <div className="mini-player__times">
            <Ginger.Current.Elapsed />
            <Ginger.Current.Duration />
          </div>

          <div className="mini-player__controls">
            <Ginger.Control.Previous className="mini-player__button mini-player__button--ghost" />
            <Ginger.Control.PlayPause className="mini-player__button mini-player__button--primary" />
            <Ginger.Control.Next className="mini-player__button mini-player__button--ghost" />
            <Ginger.Control.Mute className="mini-player__button mini-player__button--ghost" />
          </div>

          <div className="mini-player__footer">
            <label className="mini-player__volume">
              <span>Volume</span>
              <Ginger.Control.Volume />
            </label>

            <Ginger.Control.PlaybackRate className="mini-player__rate" />
          </div>
        </div>
      </div>
    </Ginger.Provider>
  );
}
```

```css
.ginger-mini-theme {
  --ginger-primary-color: #111827;
  --ginger-muted-color: #6b7280;
  --ginger-font-size: 14px;
  --ginger-font-family: Inter, system-ui, sans-serif;
  --ginger-artwork-radius: 14px;
  --ginger-artwork-bg: #f3f4f6;
}

.mini-player {
  display: flex;
  gap: 16px;
  max-width: 420px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.mini-player__artwork {
  width: 72px;
  height: 72px;
  flex: 0 0 72px;
}

.mini-player__body {
  flex: 1;
  min-width: 0;
}

.mini-player__title {
  display: block;
  font-weight: 600;
  color: #111827;
}

.mini-player__artist {
  display: block;
  margin-top: 4px;
  color: #6b7280;
}

.mini-player__seek {
  margin-top: 12px;
}

.mini-player__seek input {
  width: 100%;
}

.mini-player__times {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.mini-player__controls {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.mini-player__button {
  border-radius: 10px;
  padding: 8px 12px;
  font: inherit;
  cursor: pointer;
}

.mini-player__button--ghost {
  border: 1px solid #d1d5db;
  background: white;
  color: #111827;
}

.mini-player__button--primary {
  border: 1px solid #111827;
  background: #111827;
  color: white;
}

.mini-player__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.mini-player__volume {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  font-size: 12px;
  color: #6b7280;
}

.mini-player__volume input {
  flex: 1;
}

.mini-player__rate {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  padding: 6px 8px;
  color: #111827;
}
```

## Core Concepts

### `Ginger.Provider` owns playback state

The provider stores queue state, playback state, media state, and playlist metadata.

- Props prefixed with **`initial*`** are mount-only defaults.
- To replace the queue after mount, call **`useGinger().setQueue(...)`**.
- If you want provider state to fully reset from parent props, remount the provider with a new `key`.

### `Ginger.Player` creates and syncs the hidden audio element

The player renders the actual **`<audio>`** element and mirrors reducer state into the browser media API.

- You usually render it once near the root of the player subtree.
- It can stay visually hidden; it exists to drive playback.
- All transport and display components depend on it.

### Use components, the hook, or both

- Use **`Ginger.Control.*`**, **`Ginger.Current.*`**, **`Ginger.Queue.*`**, and **`Ginger.Playlist`** for fast composition.
- Use **`useGinger()`** when you want total control over layout and styling.
- Mix both approaches freely in the same provider tree.

## API Reference

### `Ginger.Provider`

Wrap all Ginger UI in a single provider.

```tsx
<Ginger.Provider initialTracks={tracks}>
  <Ginger.Player />
  {/* your UI */}
</Ginger.Provider>
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Player UI inside the provider |
| `initialTracks` | `Track[]` | `[]` | Initial queue |
| `initialIndex` | `number` | `0` | Initial current track index |
| `initialPlaylistMeta` | `PlaylistMeta \| null` | `null` | Queue/playlist metadata |
| `initialShuffle` | `boolean` | `false` | Start shuffled |
| `initialRepeatMode` | `"off" \| "all" \| "one"` | `"off"` | Initial repeat mode |
| `initialPlaybackMode` | `"playlist" \| "single"` | `"playlist"` | Playlist wraps/advances vs single-track stop behavior (change after mount with `useGinger().setPlaybackMode`) |
| `initialPaused` | `boolean` | `true` | Start paused or playing |
| `initialVolume` | `number` | `1` | Initial volume, clamped `0..1` |
| `initialMuted` | `boolean` | `false` | Initial muted state |
| `initialPlaybackRate` | `number` | `1` | Initial playback rate, clamped `0.25..4` |
| `initialStateKey` | `string \| number` | `undefined` | Re-dispatches `INIT` when this key changes |
| `locale` | `Partial<GingerLocaleMessages>` | `undefined` | Override built-in strings (controls, chapter list, synced lyrics list, …) |
| `mediaSession` | `boolean` | `false` | Enables Media Session lock-screen/OS controls |
| `beforePlay` | `() => boolean \| Promise<boolean>` | `undefined` | Policy hook run before playback starts |
| `onPlayBlocked` | `() => void` | `undefined` | Called when `beforePlay` returns `false` |
| `persistence` | `{ get(key): unknown; set(key, value): void }` | `undefined` | Adapter for persisted playback settings and resume state |
| `hydrateOnMount` | `boolean` | `false` | Hydrate persisted values into initial provider state |
| `resumeOnTrackChange` | `boolean` | `false` | Restore/save per-track playback position |
| `unstyled` | `boolean` | `false` | Skip provider default CSS variable/theme styles |
| `asChild` | `boolean` | `false` | Merge shell props (`className`, `style`, `data-ginger-playback`, `dir`) onto the single child element instead of a wrapper `div` |
| `className` | `string` | `undefined` | Class for the provider wrapper (merged when `asChild`) |
| `style` | `CSSProperties` | `undefined` | Inline styles / CSS variables |
| `onTrackChange` | `(track, index) => void` | `undefined` | Fires when current track changes |
| `onPlay` | `() => void` | `undefined` | Fires when state changes to playing |
| `onPause` | `() => void` | `undefined` | Fires when state changes to paused |
| `onQueueEnd` | `() => void` | `undefined` | Fires when playback reaches the end with repeat off |
| `onError` | `(message) => void` | `undefined` | Fires on media/playback errors |

### `Ginger.Player`

Renders the backing audio element.

```tsx
<Ginger.Player preload="metadata" crossOrigin="anonymous" />
```

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Optional class on the `<audio>` element |
| `style` | `CSSProperties` | `undefined` | Optional inline styles |
| `preload` | `AudioHTMLAttributes["preload"]` | `"metadata"` | Native audio preload mode |
| `crossOrigin` | `AudioHTMLAttributes["crossOrigin"]` | `undefined` | Native cross-origin mode |
| `respectReducedMotion` | `boolean` | `false` | Uses lower time-update frequency when user prefers reduced motion |

### `useGinger()`

Low-level hook for building custom UIs.

```tsx
import { useGinger } from "@lucaismyname/ginger";

function CustomPlayer() {
  const {
    state,
    currentTrack,
    playbackUi,
    duration,
    remaining,
    progress,
    play,
    pause,
    togglePlayPause,
    seek,
    next,
    prev,
    setVolume,
  } = useGinger();

  return <div>{currentTrack?.title}</div>;
}
```

Returned values:

| Key | Description |
|-----|-------------|
| `state` | Full `GingerState` object |
| `currentTrack` | Current track or `null` |
| `playbackUi` | Derived UI state: `idle`, `loading`, `playing`, `paused`, `ended`, `error` |
| `duration` | Effective duration using media metadata or `durationSeconds` fallback |
| `remaining` | Remaining seconds |
| `progress` | Fraction from `0..1` |
| `artworkUrl` | Resolved artwork URL |
| `albumLine` | Resolved album/subtitle line |
| `play`, `pause`, `togglePlayPause` | Transport actions |
| `seek` | Seek to a time in seconds |
| `setVolume`, `setMuted`, `toggleMute` | Volume/mute actions |
| `setPlaybackRate` | Set playback speed |
| `next`, `prev` | Queue navigation |
| `setRepeatMode`, `cycleRepeat` | Repeat controls |
| `toggleShuffle` | Toggle shuffle |
| `setQueue` | Replace the queue after mount |
| `insertTrackAt`, `removeTrackAt`, `moveTrack`, `enqueueNext` | Queue mutation actions |
| `playTrackAt`, `selectTrackAt` | Pick a track by index |
| `setPlaylistMeta` | Replace playlist metadata |
| `setPlaybackMode` | `"playlist"` or `"single"` (next/prev/end behavior and repeat-one) |
| `audioRef` | Ref to the underlying `HTMLAudioElement` |
| `dispatch` | Raw reducer dispatch for advanced cases |

## React Components

### `Ginger.Control.*`

Transport and media controls.

| Component | Description | Important props |
|-----------|-------------|-----------------|
| `Ginger.Control.PlayPause` | Toggle play / pause | `playLabel`, `pauseLabel`, native button props |
| `Ginger.Control.Previous` | Go to previous track | native button props |
| `Ginger.Control.Next` | Go to next track | native button props |
| `Ginger.Control.Repeat` | Cycle repeat mode | native button props |
| `Ginger.Control.Shuffle` | Toggle shuffle on/off | native button props |
| `Ginger.Control.SeekBar` | Controlled range input for time | `unstyled`, `inputStyle`, native input props |
| `Ginger.Control.Volume` | Controlled range input for volume `0..1` | `unstyled`, `inputStyle`, native input props |
| `Ginger.Control.Mute` | Toggle mute on/off | `muteLabel`, `unmuteLabel`, native button props |
| `Ginger.Control.PlaybackRate` | Select input for playback speed | `rates`, native select props |

**Default visuals:** `PlayPause`, `Next`, `Previous`, `Shuffle`, `Repeat`, and `Mute` render minimal inline SVGs (path data from [Lucide](https://lucide.dev), no extra npm dependency) when **`children` is omitted**. Pass **`children`** to replace the icon. Screen readers still use **`aria-label`** from locale and bindings; for `PlayPause`, **`playLabel`** / **`pauseLabel`** / **`playAriaLabel`** / **`pauseAriaLabel`** tune accessible names when those labels are strings.

### `Ginger.Icon.*`

The same SVG building blocks exposed for custom layouts: **`Ginger.Icon.Play`**, **`Pause`**, **`SkipForward`**, **`SkipBack`**, **`Shuffle`** (Lucide shuffle glyph), **`Volume2`**, **`VolumeX`**, **`RepeatGlyph`** (pass **`mode`**: `"off"` \| `"all"` \| `"one"`), and **`Wrapper`**. You can also import them by name from the package root (e.g. `import { Play, SkipForward } from "@lucaismyname/ginger"`).

Example:

```tsx
<div className="flex items-center gap-2">
  <Ginger.Control.Previous />
  <Ginger.Control.PlayPause />
  <Ginger.Control.Next />
  <Ginger.Control.Mute />
  <Ginger.Control.Volume />
  <Ginger.Control.PlaybackRate />
</div>
```

### `Ginger.Current.*`

Displays metadata for the current track and current playback state.

Text displays:

- `Title`
- `Artist`
- `Album`
- `Description`
- `Copyright`
- `Genre`
- `Label`
- `Isrc`
- `TrackNumber`
- `Year`

Shared text-display behavior:

- Accept `className`, `style`, `fallback`, `empty`
- Accept render-prop `children?: (value, state) => ReactNode`
- Render `null` when no value exists unless `fallback` or `empty` is provided

Other current-track components:

| Component | Description | Important props |
|-----------|-------------|-----------------|
| `Ginger.Current.Artwork` | Current track artwork or playlist artwork fallback | `unstyled`, `imgStyle`, `sizes`, `loading`, `decoding`, `onError`, display-base props |
| `Ginger.Current.Lyrics` | Track lyrics | `preserveWhitespace`, `unstyled`, render-prop `children` |
| `Ginger.Current.LyricsSynced` | Timed / LRC lyrics with active line | `activeClassName`, `lineClassName`, `unstyled`, render-prop `children` |
| `Ginger.Current.Chapters` | Chapter list; click seeks to `startSeconds` | `formatStart`, `unstyled`, render-prop `children` |
| `Ginger.Current.FileUrl` | Track `fileUrl`, hidden unless explicitly enabled | `visible`, display-base props |
| `Ginger.Current.QueueIndex` | Current queue index | `base`, render-prop `children` |
| `Ginger.Current.QueueLength` | Queue length | render-prop `children` |
| `Ginger.Current.QueuePosition` | Combined index/length label | `base`, `separator`, render-prop `children` |
| `Ginger.Current.Elapsed` | Current time string | `format`, render-prop `children` |
| `Ginger.Current.Duration` | Duration string | `format`, render-prop `children` |
| `Ginger.Current.Remaining` | Remaining time string | `format`, render-prop `children` |
| `Ginger.Current.Progress` | Progress as text or render-prop object | render-prop `children` |
| `Ginger.Current.TimeRail` | Simple visual progress rail | `unstyled`, `height`, `showBuffered`, display-base props |
| `Ginger.Current.BufferRail` | Buffered-only rail | `unstyled`, `height`, display-base props |
| `Ginger.Current.PlaybackState` | Derived state label | render-prop `children` |
| `Ginger.Current.ErrorMessage` | Media error string | `live`, render-prop `children` |

Example:

```tsx
<div>
  <Ginger.Current.Title className="font-semibold" />
  <Ginger.Current.Artist className="text-sm text-zinc-500" />
  <Ginger.Current.Elapsed /> / <Ginger.Current.Duration />
  <Ginger.Current.TimeRail className="mt-2" />
</div>
```

### `Ginger.Queue.*`

Displays queue or playlist metadata from `playlistMeta`.

| Component | Description |
|-----------|-------------|
| `Ginger.Queue.Title` | Playlist title |
| `Ginger.Queue.Subtitle` | Playlist subtitle |
| `Ginger.Queue.Description` | Playlist description |
| `Ginger.Queue.Copyright` | Playlist copyright |
| `Ginger.Queue.Artwork` | Playlist artwork |

These components follow the same fallback/empty behavior as other display components. `Ginger.Queue.Artwork` accepts `unstyled` and `imgStyle`.

### `Ginger.Playlist`

Renders the current queue as a clickable list.

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `undefined` | Manual mode rows |
| `unstyled` | `boolean` | `false` | Remove default list/row styles for fully custom layout |
| `rowStyle` | `CSSProperties` | `undefined` | Auto-mode button style override |
| `renderTrack` | `(track, index, isActive) => ReactNode` | `undefined` | Auto-mode custom row content |
| `playOnSelect` | `boolean` | `true` | Click plays immediately if true |
| `...rest` | `HTMLAttributes<HTMLUListElement>` | - | Props passed to the root `<ul>` |

Modes:

- **Auto mode:** no `children`; Ginger maps `state.tracks` for you
- **Manual mode:** pass your own rows; usually map `useGinger().state.tracks`

Auto mode example:

```tsx
<Ginger.Playlist
  className="space-y-1"
  renderTrack={(track, index, active) => (
    <span style={{ fontWeight: active ? 600 : 400 }}>
      {index + 1}. {track.title}
    </span>
  )}
/>
```

### `Ginger.Playlist.Track`

Row helper for manual playlist rendering. Must be used inside `Ginger.Playlist`.

Props:

| Prop | Type | Description |
|------|------|-------------|
| `index` | `number` | Queue index for the row |
| `unstyled` | `boolean` | Remove default row button styles |
| `liProps` | `LiHTMLAttributes<HTMLLIElement>` | Props for the wrapper `<li>` |
| `children` | `ReactNode` | Optional custom content |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | Props for the row button |

Manual mode example:

```tsx
import { Ginger, useGinger } from "@lucaismyname/ginger";

function PlaylistManual() {
  const { state } = useGinger();

  return (
    <Ginger.Playlist playOnSelect={false}>
      {state.tracks.map((track, i) => (
        <Ginger.Playlist.Track
          key={track.id ?? `${track.fileUrl}-${i}`}
          index={i}
          className="w-full rounded-lg px-3 py-2 text-left"
        >
          {track.title}
        </Ginger.Playlist.Track>
      ))}
    </Ginger.Playlist>
  );
}
```

## Types

### `Track`

```ts
type Track = {
  id?: string;
  title: string;
  fileUrl: string;
  artist?: string;
  copyright?: string;
  description?: string;
  album?: string;
  artworkUrl?: string;
  genre?: string;
  year?: number;
  label?: string;
  isrc?: string;
  trackNumber?: number;
  lyrics?: string;
  lyricsTimed?: Array<{ time: number; text: string }>;
  chapters?: Array<{ title: string; startSeconds: number }>;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
};
```

Use `id` when possible for stable identity, especially if duplicate `fileUrl` values can appear in a queue.

### `PlaylistMeta`

```ts
type PlaylistMeta = {
  id?: string;
  title?: string;
  subtitle?: string;
  artworkUrl?: string;
  copyright?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};
```

## Styling

Ginger is designed to work with your own CSS. Most components accept `className` and `style`, and the provider wrapper exposes a few CSS variables.

CSS variables available on `Ginger.Provider`:

- `--ginger-primary-color`
- `--ginger-muted-color`
- `--ginger-font-size`
- `--ginger-font-family`
- `--ginger-playlist-row-padding`
- `--ginger-artwork-radius`
- `--ginger-artwork-bg`
- `--ginger-playlist-active-bg` (playlist current row)
- `--ginger-buffer-color` (buffered range in `TimeRail` / `BufferRail`)
- `--ginger-focus-ring` (documented for your own focus styles; native controls vary by browser)

The root element under `Ginger.Provider` sets **`data-ginger-playback`** to one of `idle` \| `loading` \| `playing` \| `paused` \| `ended` \| `error` so you can target themes in CSS (e.g. `[data-ginger-playback="error"]`).

Example:

```tsx
<Ginger.Provider
  initialTracks={tracks}
  style={{
    ["--ginger-primary-color" as string]: "#0f172a",
    ["--ginger-muted-color" as string]: "#64748b",
    ["--ginger-artwork-radius" as string]: "16px",
  }}
>
  <Ginger.Player />
  {/* ... */}
</Ginger.Provider>
```

## Building custom UI

- **`useGinger()`** — One object with merged `state`, derived fields (`duration`, `progress`, `playbackUi`, …), actions, `dispatch`, and `audioRef`. Best default when you want everything in one place.

- **`useGingerPlayback()`** / **`useGingerMedia()`** — Subscribe to queue/transport vs time/volume/buffering separately so dense UIs re-render less often.

- **`useGingerState()`** — Merged `GingerState` only (no actions); use inside custom display components together with hooks above for controls.

- **Headless control bindings** (bind to your own components): **`useSeekBarBinding()`**, **`useVolumeSlider()`**, **`usePlayPauseBinding({ playAriaLabel?, pauseAriaLabel? })`**. Each returns props such as `value`, `min`, `max`, handlers, and `ariaLabel` / `ariaValueText` where relevant.

- **Advanced hooks** — **`useGingerKeyboardShortcuts()`**, **`useGingerSleepTimer()`**, **`useSeekDrag()`**, **`useNextTrackPrefetch()`**, **`useGingerChapters()`**, **`useGingerLyricsSync()`**, and **`useGingerDebugLog()`** are available for custom UX and diagnostics.

- **Locale** — Pass **`locale={partialMessages}`** on `Ginger.Provider` (type **`GingerLocaleMessages`**) to translate built-in control strings, chapter list labels, and synced lyrics list names; **`useGingerLocale()`** reads the merged messages anywhere under the provider.

- **Track extras** — Optional **`metadata?: Record<string, unknown>`** on **`Track`** (and on **`PlaylistMeta`**) is ignored by core logic; use it for badges, flags, or UI-only fields.

- **Buffered UI** — **`Ginger.Current.BufferRail`** shows load progress; **`Ginger.Current.TimeRail`** supports **`showBuffered`** to stack a buffered layer behind the played segment.

- **Audio analyzers** — Live Web Audio data for real-time visuals (**`useGingerLiveAnalyzer`**, main package) and whole-file grids for waveforms or spectrograms (**`useAudioFileAnalysis`** / **`analyzeAudioFile`**, `@lucaismyname/ginger/waveform`). See [Audio analyzers (visualizations)](#audio-analyzers-visualizations).

Recipes below cover queue lifecycle and media edge cases.

## Audio analyzers (visualizations)

Ginger separates **live** analysis (while the native `<audio>` element plays) from **whole-file** analysis (decode once, build static or seek-independent grids).

### Live: `useGingerLiveAnalyzer`

Import from the main package:

```tsx
import { Ginger, useGingerLiveAnalyzer } from "@lucaismyname/ginger";

function Spectrum() {
  const { frequencyData, frequencyBinCount, error, resume, isSuspended } = useGingerLiveAnalyzer({
    fftSize: 2048,
  });

  if (error) return <p role="alert">{error}</p>;
  if (isSuspended) {
    return (
      <button type="button" onClick={() => void resume()}>
        Enable audio analysis
      </button>
    );
  }

  return (
    <div>
      {/* e.g. map frequencyData[0..frequencyBinCount) to bar heights */}
      <span>{frequencyBinCount} bins</span>
    </div>
  );
}

// Mount <Ginger.Player crossOrigin="anonymous" /> when fileUrl is cross-origin so Web Audio can use the element.
```

Important:

- **CORS** — For cross-origin `fileUrl` values, set **`crossOrigin`** on **`Ginger.Player`** (for example `"anonymous"`) so the media element is usable with **`AudioContext`**.
- **One `MediaElementAudioSourceNode` per `<audio>`** — The library reuses a single Web Audio graph per underlying element. Multiple instances of **`useGingerLiveAnalyzer`** attach extra **`AnalyserNode`**s as taps; only one tap carries audio to **`destination`** so volume stays correct.
- **Autoplay** — The **`AudioContext`** may start **`suspended`** until a user gesture; call **`resume()`** or start playback after interaction.
- **Reading buffers** — `frequencyData` and `timeDomainData` are updated each animation frame while enabled; read them during render after **`frequencyBinCount > 0`** (they are backed by mutable buffers that the hook fills in a `requestAnimationFrame` loop).

### Whole file: `@lucaismyname/ginger/waveform`

Use **`useAudioFileAnalysis`** (React hook) or **`analyzeAudioFile`** / **`analyzeAudioBuffer`** (imperative) for amplitude grids and optional spectrogram rows without playing the track.

```tsx
import { useAudioFileAnalysis } from "@lucaismyname/ginger/waveform";

function FileViz({ url }: { url: string }) {
  const { data, isLoading, error } = useAudioFileAnalysis(url, {
    timeSlices: 128,
    samplesPerSlice: 8,
    spectrogram: true,
    fftSize: 1024,
    frequencyBins: 256,
  });

  if (isLoading) return <p>Loading analysis…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <p>Duration: {data.duration}s</p>
      {/* data.amplitudeGrid: number[][] */}
      {/* data.spectrogram?: number[][] normalized to [0, 1] */}
    </div>
  );
}
```

**`useAudioPeaks`** (same subpath) remains a lightweight helper: a single row of decoded amplitude peaks. Prefer **`useAudioFileAnalysis`** when you need a 2D amplitude grid or spectrogram.

## Recipes

### Updating the queue after mount

`initialTracks`, `initialIndex`, and other `initial*` props apply **only on the first mount** of `Ginger.Provider`. To replace the queue from app state, use `setQueue` / `playTrackAt` / `selectTrackAt` from `useGinger()`, or call `init({ tracks, ... })` for a full reset (same as `INIT`).

To re-run initialization when a parent identifier changes (for example switching albums), pass **`initialStateKey`** (e.g. `initialStateKey={albumId}`). When that key changes, Ginger dispatches `INIT` using the **current** `initialTracks`, `initialIndex`, and other `initial*` props.

### Duplicate URLs and stable `id`s

If two tracks share the same `fileUrl`, set a unique **`id`** on each `Track` so shuffle/unshuffle and queue identity resolve the correct row.

### CORS and `<Ginger.Player />`

Cross-origin audio must be served with compatible CORS headers. If you need the browser to treat the response as CORS-enabled (for example when reading certain metadata), pass **`crossOrigin`** on `Ginger.Player` (e.g. `"anonymous"`).

### Autoplay and `play()` failures

If the browser blocks playback (autoplay policy) or `HTMLMediaElement.play()` rejects for another reason, the player dispatches a media error with a short message. **`onError`** still runs (from `errorMessage` in state), and **`Ginger.Current.ErrorMessage`** shows the same string. Associate controls with a visible label using the `id` on `Ginger.Control.SeekBar` and a `<label htmlFor="…">` in your UI.

## New Optional Features

All additions below are opt-in and preserve existing behavior by default.

### Media Session integration

Enable lock-screen and OS media controls:

```tsx
<Ginger.Provider initialTracks={tracks} mediaSession>
  <Ginger.Player />
  {/* ... */}
</Ginger.Provider>
```

### Keyboard shortcuts

```tsx
import { useGingerKeyboardShortcuts } from "@lucaismyname/ginger";

function Hotkeys() {
  useGingerKeyboardShortcuts(true, {
    playPause: " ",
    next: "ArrowRight",
    previous: "ArrowLeft",
    mute: "m",
  });
  return null;
}
```

`mute` is optional; if omitted, no mute key binding is installed.

### Chapters and synced lyrics

```tsx
import { useGingerChapters, useGingerLyricsSync } from "@lucaismyname/ginger";

function ChapterAndLyrics() {
  const chapters = useGingerChapters();
  const lyrics = useGingerLyricsSync();
  return (
    <div>
      <button onClick={() => chapters.seekTo(0)}>Jump to first chapter</button>
      <p>Active lyric: {lyrics.activeLine?.text ?? "None"}</p>
    </div>
  );
}
```

`Track` now supports optional `chapters` and `lyricsTimed` fields. For LRC parsing, use `parseLrc()`.

For ready-made UI, use **`Ginger.Current.Chapters`** and **`Ginger.Current.LyricsSynced`** (same data as the hooks above).

### Next-track prefetch

```tsx
import { Ginger, useNextTrackPrefetch } from "@lucaismyname/ginger";

function PrefetchNext() {
  useNextTrackPrefetch({ crossOrigin: "anonymous" });
  return null;
}

export function App() {
  return (
    <Ginger.Provider initialTracks={tracks}>
      <Ginger.Player crossOrigin="anonymous" />
      <PrefetchNext />
      {/* ... */}
    </Ginger.Provider>
  );
}
```

The hook preloads the **logical** next track (same rules as the Next button) using a detached `HTMLAudioElement` with `preload="auto"`. Pass **`crossOrigin`** when it matches **`Ginger.Player`** for cross-origin URLs.

### Sleep timer and drag seek

```tsx
import { useGingerSleepTimer, useSeekDrag } from "@lucaismyname/ginger";

function Extras({ duration }: { duration: number }) {
  useGingerSleepTimer({ durationMs: 10 * 60 * 1000, enabled: true });
  const drag = useSeekDrag(duration);
  return <div onPointerDown={drag.onPointerDown}>Drag to seek</div>;
}
```

### Persistence + resume

`Ginger.Provider` accepts:

- `persistence?: { get(key): unknown; set(key, value): void }`
- `hydrateOnMount?: boolean`
- `resumeOnTrackChange?: boolean`

This allows persisted volume/rate/repeat/index and optional per-track resume positions.

### Queue mutation actions and single-track mode

`useGinger()` and split playback context now include:

- `insertTrackAt(track, index?, autoPlay?)`
- `removeTrackAt(index)`
- `moveTrack(fromIndex, toIndex)`
- `enqueueNext(track)`

Provider supports `initialPlaybackMode?: "playlist" | "single"` (`"playlist"` default). Use `setPlaybackMode("playlist" | "single")` from `useGinger()` or `useGingerPlayback()` to change mode without a full `init()`.

### Reduced motion and blocked-play policy

- `Ginger.Player` supports `respectReducedMotion` to reduce time sync update frequency.
- `Ginger.Provider` supports `beforePlay?: () => boolean | Promise<boolean>` and `onPlayBlocked`.
- If `beforePlay` throws/rejects, Ginger sets `errorMessage` and triggers `onError`.

### Debug logging

Use `useGingerDebugLog(true)` during development to log core state transitions in the console.

### Fully unstyled mode

- `Ginger.Provider unstyled` disables provider theme defaults (CSS variable injection).
- `Ginger.Provider asChild` merges the same shell props onto **one** child element (no extra wrapper `div`).
- `Ginger.Control.SeekBar` and `Ginger.Control.Volume` accept `unstyled`.
- `Ginger.Current.Artwork`, `Ginger.Queue.Artwork`, `Ginger.Current.TimeRail`, and `Ginger.Current.BufferRail` accept `unstyled`.
- `Ginger.Playlist` and `Ginger.Playlist.Track` accept `unstyled`.
- `Ginger.Current.Chapters` and `Ginger.Current.LyricsSynced` accept `unstyled`.
- `Ginger.Current.Lyrics` accepts `unstyled` to skip default `whiteSpace: pre-wrap` when using `preserveWhitespace` (apply typography via `className` / `style` instead).

With `Ginger.Current.TimeRail` / `showBuffered`, **`unstyled`** removes positioning and background layers; you still get percentage widths on inner segments—supply your own layout (e.g. `position: relative` on the rail, bar heights) so the headless variant lays out correctly.

This gives you a pure state+behavior layer while keeping convenience components available.

### Subpath exports

Additional entrypoints:

- `@lucaismyname/ginger/client`
- `@lucaismyname/ginger/testing`
- `@lucaismyname/ginger/waveform`
- `@lucaismyname/ginger/experimental-gapless`

`experimental-gapless` is explicitly non-production and does not alter core playback.

## Notes

### CORS

`fileUrl` must be fetchable by the browser. Cross-origin media must be served with compatible CORS headers.

### SSR

There is no `window` at import time, but playback only starts when the audio element mounts on the client. In frameworks with server rendering, render the player in a client component or mount it after hydration.

### Queue updates after mount

See [Recipes — Updating the queue after mount](#updating-the-queue-after-mount).

## Development priorities

These priorities guide new work in the library; they are not a guarantee of shipping order.

1. **Music libraries and continuous listening** — Features that make track-to-track playback feel better come first: **next-track prefetch** (`useNextTrackPrefetch`), future gapless or crossfade (see `@lucaismyname/ginger/experimental-gapless`), and first-class **chapter** / **synced lyrics** UI (`Ginger.Current.Chapters`, `Ginger.Current.LyricsSynced`).
2. **Podcasts and live-style streams** — **HLS / DASH** integration is emphasized when a concrete app needs it; the core package stays on native `<audio>` with optional adapters or documentation rather than hard dependencies.
3. **Embedded or internal players** — **Accessibility**, persistence, and **testing** helpers are favored over heavier ecosystem integrations (Cast, remote playback modules) unless there is a dedicated use case.

## Monorepo Development

| Path | Purpose |
|------|---------|
| [`packages/ginger`](packages/ginger) | Publishable library (`@lucaismyname/ginger`) |
| [`apps/demo`](apps/demo) | Demo app with working examples |

```bash
npm install --include=dev
npm run build -w @lucaismyname/ginger
npm run dev -w ginger-demo
```

If your npm config sets `omit=dev`, devDependencies may not install. Use `--include=dev` once or adjust your npm config.

## Publish

Do **not** run `npm publish` at the repo root. The root package is **`private: true`**.

Publish from the workspace:

```bash
npm run publish:lib
```

Or from `packages/ginger`:

```bash
npm publish --access public
```

`prepublishOnly` runs the library build automatically.
