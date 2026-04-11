# Streaming Adapters (HLS/DASH)

Ginger keeps core playback on native `<audio>` to stay lightweight. For HLS or
DASH, use an adapter layer that manages stream attachment while Ginger manages UI
state and controls.

## Adapter contract (docs-first)

```ts
export type GingerStreamingAdapter = {
  canHandle: (url: string) => boolean;
  attach: (audio: HTMLAudioElement, url: string) => Promise<void> | void;
  detach: (audio: HTMLAudioElement) => Promise<void> | void;
};
```

## Recommended flow

1. Track source is selected by your app.
2. Adapter decides whether URL requires HLS/DASH handling.
3. Adapter attaches stream engine to audio element.
4. Ginger controls continue to interact with the same audio element.

## Why docs-first

- Avoids hard dependency weight in core package.
- Supports app-specific transport requirements.
- Keeps SSR/client split and browser support decisions in the host app.

## Future package path

If demand is high, publish an optional adapter package
(`@lucaismyname/ginger-adapter-hls`) with peer dependencies and browser matrix.
