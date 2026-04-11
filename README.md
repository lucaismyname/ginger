# ginger

Monorepo for **`@lucaismyname/ginger`**, a headless React audio player: compound components, native `<audio>`, playlists, and **no non-React runtime dependencies** (React is a peer dependency only).

## Layout

| Path | Purpose |
|------|---------|
| [`packages/ginger`](packages/ginger) | Publishable library (`@lucaismyname/ginger`) |
| [`apps/demo`](apps/demo) | Tailwind Vite app showcasing examples |

## Development

```bash
npm install --include=dev
npm run build -w @lucaismyname/ginger
npm run dev -w ginger-demo
```

If your npm config sets `omit=dev`, devDependencies (Vite, TypeScript, etc.) will not install—use `--include=dev` once, or adjust your global npm config.

## Usage (minimal)

```tsx
import { Ginger } from "@lucaismyname/ginger";

const tracks = [
  { title: "One", fileUrl: "https://example.com/a.mp3" },
  { title: "Two", fileUrl: "https://example.com/b.mp3" },
];

export function Player() {
  return (
    <Ginger.Provider initialTracks={tracks} initialPlaylistMeta={{ title: "My queue" }}>
      <Ginger.Player />
      <Ginger.Current.Title />
      <Ginger.Control.PlayPause />
      <Ginger.Playlist />
    </Ginger.Provider>
  );
}
```

Mount **`<Ginger.Player />`** once inside the same provider tree so the hidden `<audio>` element exists. Style everything with your own CSS / Tailwind; the library uses **inline defaults** and **CSS custom properties** (see below).

### Headless hook

Anything rendered by `Ginger.Current.*` / `Ginger.Queue.*` can also be read from **`useGinger()`** for fully custom UIs.

## CSS variables (optional theming)

Applied on **`Ginger.Provider`** (overridable via `style` / `className`):

- `--ginger-primary-color`
- `--ginger-muted-color`
- `--ginger-font-size`, `--ginger-font-family`
- `--ginger-playlist-row-padding`
- `--ginger-artwork-radius`, `--ginger-artwork-bg`

## CORS and SSR

- **`fileUrl`** must be fetchable by the browser. Cross-origin URLs need proper CORS headers from the host.
- **SSR**: there is no `window` at import time; the `<audio>` element only runs on the client. Render `Ginger.Player` only in client components / after mount if your framework requires it.

## Architecture (for contributors)

Playback rules live in **`packages/ginger/src/core/`** (pure TypeScript). React **`GingerProvider`** adapts reducer state to the DOM via **`Ginger.Player`**. Compound UI lives under **`src/components/`**.

## Publish

From `packages/ginger` (with npm auth for the `@lucaismyname` scope):

```bash
npm publish --access public
```

`prepublishOnly` runs the library build automatically.
