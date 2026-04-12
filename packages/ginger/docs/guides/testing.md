# Testing Guide

Import testing helpers from `@lucaismyname/ginger/testing`.

## Render a provider quickly

```tsx
import { renderGinger } from "@lucaismyname/ginger/testing";

const view = renderGinger(<MyControls />, {
  tracks: [{ id: "a", title: "A", fileUrl: "/a.mp3" }],
});
```

## User event setup

Use `setupUser()` for preconfigured `@testing-library/user-event`.

```tsx
const user = setupUser();
await user.click(screen.getByRole("button", { name: "Play" }));
```

## Media session mock

```tsx
const { getHandler, getLastPositionState, restore } = installNavigatorMediaSession();
// ...assert handlers via getHandler("play"), etc.; positionState tests use getLastPositionState()...
restore();
```

## Fake audio events

Use helper emitters for deterministic media state tests:

- `emitLoadedMetadata(audio, duration)`
- `emitTimeUpdate(audio, currentTime, duration?)`
- `emitEnded(audio)`

## Queue assertions

Use `expectQueueState` to assert queue index and shape via `useGinger()` values.
