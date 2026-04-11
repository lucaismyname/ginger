# Getting Started

## Install

```bash
npm install @lucaismyname/ginger
```

## Minimal setup

```tsx
import { Ginger } from "@lucaismyname/ginger";

const tracks = [
  { id: "one", title: "One", fileUrl: "/audio/one.mp3" },
  { id: "two", title: "Two", fileUrl: "/audio/two.mp3" },
];

export function BasicPlayer() {
  return (
    <Ginger.Provider initialTracks={tracks}>
      <Ginger.Player />
      <Ginger.Control.PlayPause />
      <Ginger.Control.SeekBar />
      <Ginger.Control.Volume />
      <Ginger.Current.Title fallback="No track selected" />
    </Ginger.Provider>
  );
}
```

## Core concepts

- `Ginger.Provider` owns playback and queue state.
- `Ginger.Player` mounts the hidden audio element and syncs media state.
- `Ginger.Control.*` and `Ginger.Current.*` are optional convenience components.
- `useGinger()` exposes state and actions for custom UI.

## Next steps

- Recipes: [`guides/recipes.md`](./guides/recipes.md)
- Testing: [`guides/testing.md`](./guides/testing.md)
- Accessibility: [`guides/accessibility.md`](./guides/accessibility.md)
- API Reference: [`reference/components.md`](./reference/components.md), [`reference/hooks.md`](./reference/hooks.md)
