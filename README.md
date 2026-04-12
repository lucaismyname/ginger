# `ginger` monorepo

## Links

- `packages/ginger`: [README.md](./packages/ginger/README.md)
- Changelog: [CHANGELOG.md](./packages/ginger/CHANGELOG.md)

## Common Commands

- Verify everything locally (same order as CI): `npm run verify`
- Demo app: `npm run dev`
- Landing app: `npm run dev:landing`
- E2E tests (demo): `npm run e2e -w ginger-demo`

## Apps

- `apps/ginger-landing`: Landing page with a live Ginger player, bundled audio samples, and install/links sections. Components are split into `components/` and data into `data/`.
- `apps/demo`: Demo players showcasing all Ginger features (including stable queue-end playback behavior in playlist demos). Includes Playwright E2E tests under `e2e/`.

## Quality

- **Linting & formatting**: [Biome](https://biomejs.dev) (consistent config for both library and apps)
- **Pre-commit hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) run Biome on staged files
- **Unit tests**: Vitest (library)
- **E2E tests**: Playwright (demo app)
- **CI**: GitHub Actions on PRs and pushes to main (Node 20 + 22)
