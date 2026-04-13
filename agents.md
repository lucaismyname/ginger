# agents.md

> Project-wide conventions, tooling decisions, and best practices for AI agents and developers working in this repository.

---

## Table of Contents

1. [Package Manager](#package-manager)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [TypeScript](#typescript)
5. [React Patterns](#react-patterns)
6. [Styling & Visual Design](#styling--visual-design)
7. [Component Architecture](#component-architecture)
8. [State Management & Data Fetching](#state-management--data-fetching)
9. [Performance & Virtualization](#performance--virtualization)
10. [SEO](#seo)
11. [Package Development](#package-development)
12. [Dev Server](#dev-server)
13. [Code Quality](#code-quality)
14. [Documentation](#documentation)

---

## Package Manager

- **Always use `npm`** — never `yarn`, `pnpm`, or `bun` unless explicitly instructed.
- Use `npm install` for adding dependencies, `npm run` for scripts.

---

## Project Structure

```
/
├── apps/                  # Deployable React applications
│   └── my-app/
│       ├── components.json        # ShadCN config (always in app root)
│       ├── src/
│       │   ├── components/        # App-level components
│       │   ├── pages/             # Route-level page components
│       │   ├── lib/               # Utilities and helpers
│       │   ├── hooks/             # Custom React hooks
│       │   ├── routes/            # React Router route definitions
│       │   └── main.tsx           # Entry point
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── README.md
│
├── packages/              # Shared, tree-shakeable libraries via NPM/package.json
│   └── my-package/
│       ├── src/
│       ├── package.json
│       └── README.md
│
└── agents.md              # This file
```

---

## Tech Stack

When creating a new app under `apps/*`, always scaffold with the following unless explicitly told otherwise:

| Tool                            | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| **Vite**                        | Build tool, HMR, dev environment, bundler |
| **TypeScript** (strict)         | Type safety across all code               |
| **Tailwind CSS**                | Utility-first styling                     |
| **ShadCN + Base-UI**            | Component library and UI primitives       |
| **React Router** (library mode) | Client-side routing                       |

### Optional (install only when needed)

| Tool                   | When to add                                             |
| ---------------------- | ------------------------------------------------------- |
| **TanStack Query**     | Server state, async data fetching                       |
| **TanStack Virtual**   | Long lists or large datasets requiring virtualization   |
| **TanStack Table**     | Complex data tables with sorting, filtering, pagination |
| **React Helmet Async** | SEO, dynamic `<head>` management                        |

> Do not pre-install optional packages speculatively. Add them only when a concrete need arises.

---

## TypeScript

- **Strict mode is mandatory.** `tsconfig.json` must include `"strict": true`.
- Prefer `type` over `interface` for object shapes unless declaration merging is needed.
- Avoid `any`. Use `unknown` and narrow explicitly.
- Avoid non-null assertions (`!`) — handle nullability with proper guards or optional chaining.
- Export types alongside their related logic, not in a single dumped `types.ts` unless the file is truly cross-cutting.

```ts
// ✅ Good
const getValue = (input: string | null): string => {
  if (!input) return "";
  return input.trim();
};

// ❌ Avoid
const getValue = (input: any) => input.trim();
```

---

## React Patterns

### Functional components only

Use functional components with hooks. No class components.

### Effects — think before you reach for `useEffect`

Before writing a `useEffect`, consult [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

Common cases where `useEffect` is **not** the right tool:

- **Deriving state from props or other state** → compute inline or use `useMemo`
- **Handling user events** → handle in event handlers directly
- **Fetching data** → use TanStack Query
- **Syncing with an external store** → use `useSyncExternalStore`

Only use `useEffect` for true side effects: subscribing to external systems, timers, or DOM mutations that can't be handled elsewhere.

### Hooks

- Extract reusable logic into custom hooks in `src/hooks/`.
- Name hooks with the `use` prefix and give them a clear, specific name (`useUserProfile`, not `useData`).
- Keep hooks focused — one concern per hook.

### Component design

- Prefer small, focused components over large monoliths.
- Co-locate component-specific logic (hook, helper, styles) near the component file.
- Use composition over prop drilling beyond 2 levels — reach for context or state management.

---

## Styling & Visual Design

### Core rules

- **Primary color: `orange`** — use Tailwind's `orange-*` scale and CSS `--color-primary` mapped to orange.
- **Avoid as accent/primary colors**: `purple`, `blue`, `violet` — unless explicitly requested.
- **No gradients** on UI elements (buttons, links, cards, navbars) unless explicitly specified.
- **Minimal, consistent UI** — reuse existing components before creating new ones.
- **Mobile First** - always design for smartphones first, then for desktop-devices

### Tailwind usage

- Use Tailwind utility classes directly in JSX. Avoid inline `style={{}}` unless dynamic values require it.
- Use `cn()` (from `clsx`/`tailwind-merge`) to conditionally compose class names.

```tsx
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-4 py-2 rounded bg-orange-500 text-white",
    isDisabled && "opacity-50 cursor-not-allowed",
  )}
>
  Submit
</button>;
```

### ShadCN + Base-UI

- `components.json` lives in the **root of each app** (not the monorepo root).
- Use ShadCN components as the default for common UI patterns (dialogs, dropdowns, forms, etc.).
- Use Base-UI primitives for low-level, unstyled building blocks when ShadCN doesn't cover the use case.
- Do not reinvent components that ShadCN already provides.

---

## Component Architecture

### Folder conventions

```
src/components/
├── ui/             # Generic, reusable UI components (Button, Card, Badge...)
├── layout/         # Layout components (Sidebar, Header, PageWrapper...)
└── [feature]/      # Feature-specific components grouped by domain
```

### Naming

- Component files: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Hook files: `camelCase.ts` (e.g., `useUserProfile.ts`)
- Utility files: `camelCase.ts` (e.g., `formatDate.ts`)

### Re-use over re-invention

Before creating a new component:

1. Check if a ShadCN component covers the use case.
2. Check if an existing app component can be extended with a prop.
3. Only then create a new component.

---

## State Management & Data Fetching

### Local state

Use `useState` and `useReducer` for component-local state.

### Server state

Use **TanStack Query** when async/remote data is involved:

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});
```

- Always define `queryKey` as a descriptive array — never a plain string.
- Co-locate query definitions in `src/lib/queries/` or next to the feature that uses them.
- Use `useMutation` for write operations; invalidate queries on success.

### Global/shared client state

Prefer URL state (React Router) and server state (TanStack Query) before reaching for a global store.
If global client state is genuinely needed, use a lightweight solution like Zustand.

---

## Performance & Virtualization

Use **TanStack Virtual** when rendering lists with more than ~100 items or when DOM performance becomes a concern. Do not add it preemptively.

```ts
const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
});
```

### General performance practices

- Memoize expensive computations with `useMemo`.
- Memoize stable callbacks passed to children with `useCallback`.
- Avoid premature memoization — only add it when profiling shows a real cost.
- Lazy-load routes with `React.lazy` + `Suspense`.

---

## SEO

Use **React Helmet Async** for dynamic `<head>` management when SEO matters for the app:

```tsx
import { Helmet } from "react-helmet-async";

<Helmet>
  <title>Page Title | App Name</title>
  <meta name="description" content="..." />
</Helmet>;
```

Wrap the app in `<HelmetProvider>` at the root. Only install when the app has public-facing pages that require indexing.

---

## Package Development

Packages under `packages/*` are shared libraries. They must be authored with **tree-shakeability** in mind:

- Use **named exports only** — avoid default exports in package entry points.
- Never use side-effectful top-level code.
- Set `"sideEffects": false` in `package.json` unless genuinely needed.
- Use `"exports"` field in `package.json` to expose entry points explicitly.
- Do not bundle React — declare it as a `peerDependency`.
- Split unrelated utilities into separate entry points so consumers don't import unused code.

```json
{
  "exports": {
    "./utils": "./dist/utils.js",
    "./hooks": "./dist/hooks.js"
  },
  "sideEffects": false,
  "peerDependencies": {
    "react": ">=18"
  }
}
```

---

## Dev Server

- Assume the dev server is **already running** — do not start a new one on a different port.
- Do not add `npm run dev` instructions to task outputs unless explicitly asked.

---

## Code Quality

- Write clean, readable code over clever code.
- Functions and components should do one thing.
- Avoid deeply nested logic — extract into named functions or early returns.
- Delete unused code — do not comment it out.
- Keep files under ~300 lines. If a file grows beyond that, consider splitting by concern.

### Risk assessment for changes

When suggesting or making code changes, always evaluate:

- **Risk level** — could this break existing functionality? Note it explicitly.
- **Effort** — is this a small, contained change or does it require broader refactoring?
- Flag high-risk changes clearly before proceeding.

---

## Documentation

- **Update `README.md`** in the relevant app or package after every meaningful change.
- The README should reflect: what the app/package does, how to run it, and any notable decisions.
- Keep `agents.md` (this file) up to date when project-wide conventions change.
