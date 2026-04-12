# Ginger documentation (`packages/ginger/docs`)

This folder holds **narrative docs** (Markdown) and a **generated API site** (HTML). Use this README as a map; everything below is written for humans, not for npm publish (the published tarball still includes only `dist`, `README.md`, etc.—see the package root [`README.md`](../README.md) for install and overview).

## What lives where

| Path | Purpose |
|------|---------|
| **[`getting-started.md`](./getting-started.md)** | Install, minimal `<Ginger.Provider>` example, core concepts, links onward |
| **[`api-overview.md`](./api-overview.md)** | Table of public import paths (`@lucaismyname/ginger`, subpaths), relation to TypeDoc |
| **[`reference/subpaths.md`](./reference/subpaths.md)** | Deep dive on optional `@lucaismyname/ginger/*` entrypoints (client, testing, waveform, EQ, …) |
| **[`reference/components.md`](./reference/components.md)** | Checklist-style list of `Ginger.*` compound components |
| **[`reference/hooks.md`](./reference/hooks.md)** | Checklist-style list of hooks; points to subpaths for advanced hooks |
| **[`guides/`](./guides/)** | How-to guides: recipes, testing, accessibility, streaming adapters |
| **[`GAPLESS_ROADMAP.md`](./GAPLESS_ROADMAP.md)** | Experimental gapless work (milestones; not a user tutorial) |
| **[`api/`](./api/)** | **Generated** TypeDoc output (`npm run docs:api` from `packages/ginger`). Open [`api/index.html`](./api/index.html) in a browser after building. |
| **[`api/media/subpaths.md`](./api/media/subpaths.md)** | Short link to the canonical [`reference/subpaths.md`](./reference/subpaths.md) (avoids duplicating subpath docs beside generated HTML). |

## Generated vs hand-written

- **Hand-written** Markdown is the source of truth for *how things fit together* (architecture, mental model, SSR, testing patterns).
- **Generated** HTML under `docs/api/` is produced by [TypeDoc](https://typedoc.org/) from `src/**/*.ts` entry points listed in [`typedoc.json`](../typedoc.json). It is ideal for **per-symbol** types, parameters, and return values.
- If something disagrees, **trust the TypeScript source and generated API** for exact signatures; use Markdown for explanation and examples.

## Regenerate the API site

From `packages/ginger`:

```bash
npm run docs:api
```

Requires a successful `npm run build` first if you want links to resolve against built `.d.ts` the same way CI does; TypeDoc uses `tsconfig.json` and entry files directly.

## Suggested reading order

1. Root [`README.md`](../README.md) (package pitch + quick example).
2. [`getting-started.md`](./getting-started.md).
3. [`reference/components.md`](./reference/components.md) + [`reference/hooks.md`](./reference/hooks.md) while coding.
4. [`guides/recipes.md`](./guides/recipes.md) for queue updates, autoplay, persistence.
5. [`reference/subpaths.md`](./reference/subpaths.md) when you need waveform, EQ, spatial, transcript, remote, crossfade, or gapless probe.
6. [`guides/testing.md`](./guides/testing.md) if you add automated tests around Ginger.
