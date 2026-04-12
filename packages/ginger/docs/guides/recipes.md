# Recipes

## Update queue after mount

Use `useGinger().setQueue()` to replace tracks and optionally reset index.

```tsx
const ginger = useGinger();
ginger.setQueue([{ id: "next", title: "Next", fileUrl: "/next.mp3" }], 0);
```

## Duplicate URLs safely

When multiple tracks share the same file URL, set stable `id` values.
Queue mutation and hydration helpers rely on stable identity.

## Handle blocked autoplay

Provide `beforePlay` or `onPlayBlocked` in `Ginger.Provider` to gate playback.

## Persist and hydrate playback state

Use the `persistence` adapter on `Ginger.Provider` with optional `hydrateOnMount`.

## Optional features

- Media Session integration
- Keyboard shortcuts
- Chapters and synced lyrics
- Next-track prefetch
- Sleep timer and drag seek
- Playback history and volume fade

These are exposed through dedicated hooks and component namespaces listed in
[`../reference/hooks.md`](../reference/hooks.md).

## Queue-end behavior and `onQueueEnd`

`onQueueEnd` runs whenever playback reaches an `ended` transition that resolves to **stop**.

- In `playbackMode="playlist"`, that is typically the last track when repeat is `off`.
- In `playbackMode="single"`, that is any track end unless `repeatMode` is `one`.
- In `repeatMode="one"`, playback replays the same track and `onQueueEnd` does not run.
