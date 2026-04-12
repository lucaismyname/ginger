# API documentation

The generated TypeDoc site includes the **main** package entry ([`src/index.ts`](../src/index.ts)) plus **subpath modules** so exports under `@lucaismyname/ginger/*` appear in the navigation.

| Import | Purpose |
|--------|---------|
| `@lucaismyname/ginger` | Provider, components, hooks, store |
| `@lucaismyname/ginger/client` | `"use client"` re-export for React Server Components |
| `@lucaismyname/ginger/testing` | Test helpers |
| `@lucaismyname/ginger/waveform` | Peaks / file analysis |
| `@lucaismyname/ginger/equalizer` | Parametric EQ |
| `@lucaismyname/ginger/spatial` | Spatial / HRTF panning |
| `@lucaismyname/ginger/transcript` | SRT/VTT + sync hook |
| `@lucaismyname/ginger/remote` | Multi-tab sync |
| `@lucaismyname/ginger/experimental-gapless` | Capability probe (playback unchanged) |

See also [subpaths reference](./reference/subpaths.md) in the repo.
