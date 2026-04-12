# Gapless playback roadmap (experimental)

**User docs:** [`reference/subpaths.md`](./reference/subpaths.md) (`@lucaismyname/ginger/experimental-gapless`) · **Docs index:** [`README.md`](./README.md)

Gapless transitions between adjacent tracks require coordinated buffering and scheduling beyond what a single `<audio>` element provides. The current `useExperimentalGapless` export only reports capability; playback remains unchanged.

## Milestone 1 — Capability and constraints

**Status (implemented):** browser limits are documented in [`probeGaplessCapability`](../src/experimental-gapless/probeGaplessCapability.ts) return values (`reason`, `hints.format`, `hints.crossOrigin`). Import `probeGaplessCapability` or `useExperimentalGapless` from `@lucaismyname/ginger/experimental-gapless`. The probe uses **feature detection only** (no `AudioContext` construction): it checks `AudioContext` / `decodeAudioData`, secure context, and optional `MediaSource`. When the environment is unsuitable or Ginger has not shipped scheduling yet, apps keep using [`Ginger.Player`](../src/audio/GingerPlayer.tsx) unchanged.

- Document browser limits (MSE vs full file decode, CORS, codecs).
- Expose a stable feature probe: `supported`, `reason`, and required hints (`crossOrigin`, format).
- Define failure modes when gapless is unavailable (fall back to existing `Ginger.Player`).

## Milestone 2 — Web Audio decoding path

- Introduce an optional `AudioContext` owned by the app or an internal singleton (user gesture / autoplay policies).
- Decode the **next** track’s media into `AudioBuffer` while the current track plays (worker or main thread with chunking for large files).
- Keep the existing HTML `<audio>` element as the primary UI and time source until the graph is proven stable.

## Milestone 3 — Scheduling and overlap

- At end-of-track minus lookahead (ms), schedule `AudioBufferSourceNode` for the next buffer; align sample rate and avoid clicks (short linear crossfade optional).
- Coordinate with `gingerReducer` / `NEXT` transitions so queue index and `currentTime` stay consistent with what users see.

## Milestone 4 — Integration API

- Opt-in flag or subpath export (e.g. `@lucaismyname/ginger/experimental-gapless`) with explicit breaking-change policy.
- Hooks: `useGaplessScheduler` (or similar) that receives `Ginger` state/refs and returns `supported`, `prepareNext(url)`, and `dispose`.

## Milestone 5 — QA and performance

- Tests with mocked Web Audio (decode + schedule), plus manual matrix on Safari / Chrome / Firefox.
- Memory and CPU budgets for parallel decode; cancel prefetch when skipping away from “next”.

This is intentionally multi-release work; ship Milestones 1–2 as research spikes before committing to a default user-facing API.
