# Testing guide

Helpers live in **`@lucaismyname/ginger/testing`**. They wrap **@testing-library/react** with a Ginger provider so you can exercise real controls and reducer updates without a browser.

For API surface (every export), see the generated TypeDoc module **`testing`** in [`../api/modules/testing.html`](../api/modules/testing.html) after `npm run docs:api`.

---

## Render a provider quickly

```tsx
import { renderGinger } from "@lucaismyname/ginger/testing";

const view = renderGinger(<MyControls />, {
  tracks: [{ id: "a", title: "A", fileUrl: "/a.mp3" }],
});
```

**`RenderGingerOptions`** extends provider props with **`tracks`**, and **`withPlayer`** (default **`true`**). Set **`withPlayer: false`** only when you test pure state/actions without an `<audio>` node.

---

## User events

Use **`setupUser()`** for a preconfigured **`@testing-library/user-event`** instance (keyboard-safe defaults).

```tsx
const user = setupUser();
await user.click(screen.getByRole("button", { name: "Play" }));
```

---

## Media Session mock

When code paths touch **`navigator.mediaSession`**, install the test double:

```tsx
const { getHandler, getLastPositionState, restore } = installNavigatorMediaSession();
// Assert handlers: getHandler("play"), …
// Position state: getLastPositionState()
restore();
```

Always call **`restore()`** in **`afterEach`** so other tests see a clean global.

---

## Fake audio events

Deterministic DOM → reducer paths without real decode:

| Helper | Use |
|--------|-----|
| **`emitLoadedMetadata(audio, duration)`** | Sets duration / metadata path. |
| **`emitTimeUpdate(audio, currentTime, duration?)`** | Advances virtual time. |
| **`emitEnded(audio)`** | End-of-track / queue transitions (`next`, `stop`, etc.). |

Import **`queryAudio`** (or similar) from the same module to grab the `<audio>` node when needed.

---

## Queue assertions

**`expectQueueState`** (and related helpers) compare **`useGinger()`**-visible fields: current index, paused flag, track list length, etc. Use after a sequence of clicks or emitted events to assert reducer + UI state stayed aligned.

---

## Tips

- Prefer **`getByRole`** with accessible names — Ginger controls set **`aria-label`** from locale/bindings by default.
- For async **`play()`** resolution, combine user events with **`waitFor`** from Testing Library.
- If tests run in **jsdom**, remember there is no real audio decoder; fake events drive state.
