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

These are exposed through dedicated hooks and component namespaces listed in
[`../reference/hooks.md`](../reference/hooks.md).
