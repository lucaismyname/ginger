# agents.md

> Reusable project instructions for AI agents and developers in a **single-app repository**.
> Keep this file practical, clear, and language-agnostic.

---

## Purpose

Use this document to keep coding decisions consistent across sessions and contributors.

- Define how code should be structured and changed.
- Reduce back-and-forth by documenting defaults.
- Optimize for maintainability, readability, and safe iteration.

---

## Table of Contents

1. [Project Metadata](#project-metadata)
2. [Core Principles](#core-principles)
3. [Definition of Done](#definition-of-done)
4. [Single-App Folder Structure](#single-app-folder-structure)
5. [Project Context AI Should Know](#project-context-ai-should-know)
6. [Coding Standards (Language-Agnostic)](#coding-standards-language-agnostic)
7. [Architecture and Separation of Concerns](#architecture-and-separation-of-concerns)
8. [Dependencies and Tooling](#dependencies-and-tooling)
9. [Error Handling and Observability](#error-handling-and-observability)
10. [Security and Privacy Defaults](#security-and-privacy-defaults)
11. [Testing Strategy](#testing-strategy)
12. [Git and Change Management](#git-and-change-management)
13. [Documentation Requirements](#documentation-requirements)
14. [React App Scaffolding](#react-app-scaffolding)
15. [UI Design Principles](#ui-design-principles)

---

## Project Metadata

- App name: ---
- Primary runtime: ---
- Deployment target: ---
- Package manager: NPM
- Main data sources: ---

### Critical Flows

- User signup/login: ---
- Payment/billing: ---
- Core CRUD flow: ---

### Non-Negotiables

- Performance budget: --- 
- Security constraints: ---
- Browser/platform support: ---

---

## Core Principles

- Prefer simple solutions over clever ones.
- Write code for future maintainers, not just for today.
- Minimize unnecessary complexity and avoid premature abstractions.
- Reuse existing patterns before inventing new ones.
- Make small, reversible changes that are easy to review.

### Decision priorities

When multiple approaches are valid, prioritize in this order:

1. Correctness
2. Security
3. Clarity
4. Developer experience
5. Performance optimization

---

## Definition of Done

A task is done when:

- Requirements are implemented correctly.
- Code follows structure and conventions in this file.
- Relevant tests pass (or test gaps are clearly documented).
- Lint/format/type checks pass where applicable.
- Security/privacy impact is reviewed for sensitive changes.
- Documentation is updated for meaningful behavior changes.

---

## Single-App Folder Structure

Use this as the default structure for non-monorepo projects:

```
/
├── src/                    # Application source code
│   ├── app/                # App bootstrap / main wiring (routing, providers, entry setup)
│   ├── modules/            # Feature modules grouped by business domain
│   │   └── <feature>/      # Feature-local components, logic, tests
│   ├── components/         # Reusable UI/presentation components
│   ├── services/           # External integrations (APIs, storage, third-party services)
│   ├── lib/                # Shared utilities/helpers (pure, reusable)
│   ├── config/             # Runtime config parsing, env mapping, constants
│   ├── styles/             # Global styles/design tokens
│   ├── assets/             # Static assets imported by code
│   └── types/              # Shared type/domain definitions when needed
│
├── tests/                  # Integration/e2e/high-level test suites (if separate from src)
├── scripts/                # Build/release/maintenance scripts
├── public/                 # Static public files
├── docs/                   # Architecture notes, ADRs, runbooks
├── .env.example            # Required environment variables (no secrets)
├── README.md               # Setup, commands, architecture, conventions
└── agents.md               # This file
```

### Folder rules

- Keep feature-specific code inside `src/modules/<feature>/`.
- Keep shared code in shared folders only when used by multiple features.
- Avoid dumping unrelated helpers into one generic file.
- Co-locate tests with code unless there is a clear reason for separate test directories.

---

## Project Context AI Should Know

Before writing code, AI should align with the following:

### Product context

- What problem this app solves.
- Who the primary users are.
- What the critical user flows are (for regression awareness).

### Technical context

- Runtime(s): browser, server, CLI, worker, or mixed.
- Environment stages: local, staging, production.
- Data sources and external dependencies.
- Performance-sensitive paths and known constraints.

### Team context

- Review expectations (small PRs, explicit trade-offs).
- Backward compatibility requirements.
- Stability vs speed priorities for the project.

If any of these are unknown, AI should ask or document assumptions clearly.

---

## Coding Standards (Language-Agnostic)

### Readability and maintainability

- Use clear names that communicate intent.
- Keep functions/classes/modules focused on one responsibility.
- Avoid deep nesting; prefer guard clauses and early returns.
- Remove dead code instead of commenting it out.
- Keep files reasonably scoped; split when a file becomes hard to navigate.

### Reuse and abstraction

- Duplicate once if needed; abstract only after patterns are stable.
- Prefer composition over inheritance where both are possible.
- Keep shared abstractions minimal and purpose-driven.

### Side effects and state

- Isolate side effects at boundaries (I/O, network, filesystem, global state).
- Keep core business logic as pure as possible.
- Make state transitions explicit and predictable.

### Consistency

- Follow existing project naming, layout, and style conventions.
- Do not introduce a second pattern for the same problem without strong reason.

---

## Architecture and Separation of Concerns

- `modules` contain domain behavior and feature workflows.
- `services` handle external communication and integrations.
- `lib` contains generic, framework-agnostic helpers.
- `app` wires things together (composition root), not business logic.

### Suggested module shape

Each feature module should generally include:

- `domain` (core business rules)
- `application` (use cases/workflows)
- `infrastructure` (adapters/services)
- `ui` (if applicable)
- tests close to the layer they validate

Keep this pragmatic: adapt depth to project size.

---

## Dependencies and Tooling

- Use the project's chosen package manager consistently.
- Add dependencies only for concrete, active use cases.
- Prefer well-maintained, widely adopted libraries.
- Avoid dependency overlap (multiple libs solving the same problem).
- Re-evaluate large dependencies before adding them.

### Dependency policy

Before adding a package, check:

1. Is native/platform code sufficient?
2. Is this dependency actively maintained?
3. Is the API stable and well documented?
4. Does it increase bundle/runtime cost significantly?

---

## Error Handling and Observability

- Fail fast on invalid inputs at boundaries.
- Return actionable error messages (for developers and, when applicable, users).
- Never swallow errors silently.
- Use structured logging where available.
- Include contextual metadata in logs (operation, entity id, environment).

### Operational visibility

- Add tracing/logging around critical flows.
- Ensure async/background failures are observable.
- Prefer deterministic error handling over generic catch-all blocks.

---

## Security and Privacy Defaults

- Never hardcode secrets, tokens, or credentials.
- Keep secrets in environment variables or secret managers.
- Validate and sanitize all untrusted input.
- Apply least-privilege principles for data access and integrations.
- Avoid logging sensitive data (PII, credentials, tokens).

### Security checks for changes

For auth, billing, data access, uploads, or external callbacks:

- Explicitly assess security impact.
- Document assumptions and edge cases.
- Add or update tests for permission boundaries.

---

## Testing Strategy

Prefer a balanced test pyramid:

- Unit tests for isolated logic.
- Integration tests for module/service interaction.
- End-to-end tests for critical user workflows.

### Testing rules

- Test behavior, not implementation details.
- Add regression tests for bug fixes.
- Keep tests deterministic and independent.
- Avoid brittle snapshot-heavy test suites without purpose.

When changing code, update affected tests in the same PR.

---

## Git and Change Management

- Keep commits focused and atomic.
- Keep pull requests small enough for efficient review.
- Do not mix refactors with feature work unless necessary.
- Document high-risk changes and rollout concerns.
- Prefer reversible migrations and incremental rollout paths.

### AI change behavior

When implementing changes, AI should:

1. Inspect existing patterns first.
2. State assumptions when requirements are unclear.
3. Make minimal safe changes.
4. Verify with tests/lint/checks where available.
5. Summarize impact, risks, and follow-up actions.

---

## Documentation Requirements

Update documentation whenever behavior or workflow changes.

- `README.md`: setup, run commands, architecture overview.
- `docs/`: deeper design notes, runbooks, ADRs.
- `agents.md`: update conventions when team standards evolve.

### Documentation quality

- Write for someone new to the project.
- Prefer concrete examples over vague statements.
- Keep command examples copy-paste ready.

---

## React App Scaffolding

Use this chapter when starting a new React app from scratch. Follow the setup order below — each tool builds on the previous one.

---

### 1. Vite + React + TypeScript

**What it does:** Vite is the build tool, dev server, and bundler. It provides fast HMR and optimized production builds.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

**`vite.config.ts` — minimal base config with path alias:**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

The `@/` alias maps to `src/` — use it everywhere. Never use relative `../../` imports across feature boundaries.

AI rules:
- Always use `@/` imports, never relative cross-folder imports.
- Do not add plugins speculatively.
- Do not change the Vite port unless explicitly asked.

---

### 2. TypeScript (strict)

**What it does:** TypeScript adds static typing. Strict mode catches the most bugs.

**`tsconfig.json` — required settings:**

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Patterns AI must follow:**

```ts
// ✅ Narrow unknown types explicitly
function parse(raw: unknown): string {
  if (typeof raw !== "string") throw new Error("Expected string");
  return raw.trim();
}

// ✅ Use type for shapes, interface only when merging is needed
type User = { id: string; name: string };

// ❌ Never use any
const process = (data: any) => data.value; // avoid
```

- Never use `any`. Use `unknown` and narrow it.
- Avoid non-null assertions (`!`). Use optional chaining or explicit guards.
- Export types close to where they are used; avoid dumping everything into a single `types.ts`.

---

### 3. Tailwind CSS

**What it does:** Utility-first CSS framework. Styling happens in the JSX className, not in separate CSS files.

```bash
npm install -D tailwindcss @tailwindcss/vite
```

**`vite.config.ts` addition:**

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`src/index.css`:**

```css
@import "tailwindcss";
```

**`cn()` utility — always use for conditional classes:**

```bash
npm install clsx tailwind-merge
```

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// ✅ Use cn() for conditional or composed class names
<button className={cn("px-4 py-2 rounded", isActive && "bg-orange-500 text-white")}>
  Submit
</button>

// ❌ Avoid inline style={{}} unless values are truly dynamic
<div style={{ color: "orange" }} /> // avoid
```

AI rules:
- Use `cn()` from `@/lib/utils` for all conditional class composition.
- Never use inline `style={{}}` for values that could be Tailwind classes.
- Design mobile-first — use base classes for mobile, `sm:` / `md:` / `lg:` for larger viewports.
- Avoid arbitrary values like `w-[327px]` unless there is no Tailwind scale equivalent.

---

### 4. ShadCN + Base-UI

**What it does:** ShadCN provides accessible, composable components built on Radix/Base-UI primitives. Components are copied into your codebase, not installed as a black box — you own the code.

```bash
npx shadcn@latest init
```

During init, `components.json` is created in the project root. This file drives all subsequent `npx shadcn add` commands.

**`components.json` — key fields:**

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Adding a component:**

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

Components land in `src/components/ui/`. Never hand-edit generated files in `ui/` unless intentional.

**Usage pattern:**

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ConfirmDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <Button onClick={onClose}>Confirm</Button>
      </DialogContent>
    </Dialog>
  );
}
```

**Base-UI** — use for low-level, unstyled primitives when ShadCN doesn't cover a specific interaction (e.g., custom slider, tooltip, menu). Install only when needed:

```bash
npm install @base-ui-components/react
```

AI rules:
- Before creating a custom UI component, check if ShadCN already has it.
- Never recreate what ShadCN provides.
- `components.json` must always live in the project root — not in `src/`.
- When extending a ShadCN component, extend via props/composition, not by rewriting the generated file.

---

### 5. React Router (library mode)

**What it does:** Client-side routing. Use it in library mode (not framework mode) for Vite projects.

```bash
npm install react-router
```

**`src/app/router.tsx` — define all routes in one place:**

```tsx
import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/modules/home/ui/HomePage";
import { NotFoundPage } from "@/components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
```

**`src/main.tsx`:**

```tsx
import { RouterProvider } from "react-router";
import { router } from "@/app/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

**Navigating and reading params:**

```tsx
import { useNavigate, useParams, Link } from "react-router";

const { id } = useParams<{ id: string }>();
const navigate = useNavigate();

navigate("/dashboard");
<Link to="/profile">Profile</Link>
```

AI rules:
- All routes live in `src/app/router.tsx`. Never scatter `<Route>` components across the tree.
- Use `<Outlet />` in layouts to render child routes.
- Use URL state (search params) for filters and pagination before reaching for global state.
- Lazy-load heavy route modules: `const Page = React.lazy(() => import("@/modules/..."))`

---

### 6. TanStack Query *(add only when async data fetching is needed)*

**What it does:** Manages server state — caching, background refetching, loading/error states, and mutations. Removes the need for manual `useEffect` + `useState` data-fetching patterns.

```bash
npm install @tanstack/react-query
```

**`src/main.tsx` — wrap the app:**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 }, // 1 min default
  },
});

<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
</QueryClientProvider>
```

**Query pattern — define queries close to where they're used:**

```ts
// src/modules/users/queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser } from "@/services/usersApi";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
```

```tsx
// In a component
const { data, isLoading, error } = useUsers();
const { mutate: create, isPending } = useCreateUser();
```

AI rules:
- `queryKey` must always be a descriptive array, never a plain string.
- Never use `useEffect` + `useState` for remote data — use `useQuery`.
- Invalidate related queries in `onSuccess` of mutations.
- Use `staleTime` to avoid unnecessary refetches for stable data.
- Do not install if no async server-state is needed.

---

### 7. TanStack Virtual *(add only for long lists/large datasets)*

**What it does:** Renders only the visible DOM nodes in a scrollable list, keeping performance stable for hundreds or thousands of items.

```bash
npm install @tanstack/react-virtual
```

**Usage pattern:**

```tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // estimated row height in px
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: "600px", overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: virtualItem.start,
              height: virtualItem.size,
              width: "100%",
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

AI rules:
- Only add when a list has more than ~100 items or causes measurable frame drops.
- The scroll container must have a fixed height and `overflow: auto`.
- `estimateSize` does not need to be exact — use the closest row height.
- Do not install preemptively.

---

### 8. TanStack Table *(add only for complex data tables)*

**What it does:** Headless table logic — sorting, filtering, pagination, column visibility. You control all the markup.

```bash
npm install @tanstack/react-table
```

**Usage pattern:**

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

type User = { id: string; name: string; email: string };

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

export function UsersTable({ data }: { data: User[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

AI rules:
- Only add for tables that need sorting, filtering, or pagination. Use a plain `<table>` or ShadCN `Table` for static display.
- Define `columns` outside the component to avoid re-creation on every render.
- Add `getFilteredRowModel()`, `getPaginationRowModel()` etc. only when those features are needed.

---

### 9. React Helmet Async *(add only for public-facing pages that need SEO)*

**What it does:** Manages the `<head>` tag dynamically per route — title, meta description, open graph tags.

```bash
npm install react-helmet-async
```

**`src/main.tsx`:**

```tsx
import { HelmetProvider } from "react-helmet-async";

<HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
</HelmetProvider>
```

**Usage per page:**

```tsx
import { Helmet } from "react-helmet-async";

export function ProductPage({ product }: { product: Product }) {
  return (
    <>
      <Helmet>
        <title>{product.name} | My Store</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>
      {/* page content */}
    </>
  );
}
```

AI rules:
- Every public page should have a `<title>` and `<meta name="description">`.
- Wrap at the top of the component tree, above `RouterProvider`.
- Do not install for internal tools, dashboards, or apps not indexed by search engines.

---

### Full Provider stack in `src/main.tsx`

When all optional packages are active, the composition order is:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "@/app/router";
import "@/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
```

---

## UI Design Principles

Good UI design is not decoration. It reduces cognitive load, makes actions obvious, and communicates state clearly. These principles apply to every screen regardless of tooling.

---

### 1. Visual hierarchy — guide the eye

Every screen has one primary action. Make it obvious.

- **Size and weight** signal importance. Large headings, bold CTAs, muted secondary text.
- Arrange content so the eye reads: title → context → action.
- Avoid screens where everything competes for attention equally.

```
✅ Clear hierarchy          ❌ Flat hierarchy
────────────────────        ────────────────────
[Big heading]               label  label  label
 Supportive sentence        [btn]  [btn]  [btn]
       [Primary CTA]        text   text   text
```

---

### 2. Spacing — give things room to breathe

Tight spacing feels chaotic. Generous spacing feels calm and professional.

- Use a spacing scale consistently (4px, 8px, 12px, 16px, 24px, 32px, 48px...). Tailwind's scale covers this.
- Add more space between unrelated sections, less between related items.
- Increase padding inside cards and containers rather than making them too compact.
- White space is an active design element — use it intentionally.

---

### 3. Color — communicate meaning, not decoration

- Limit your palette: one primary action color, one neutral scale, semantic colors for state (success, error, warning).
- Use color to communicate state, not just to look interesting.
- Never rely on color alone to convey meaning — pair it with text or icons.
- Maintain enough contrast: body text ≥ 4.5:1 contrast ratio, large text ≥ 3:1.

```
Primary color   → call to action buttons, active states
Neutral scale   → backgrounds, borders, muted text
Green           → success, completed
Red             → error, destructive action
Yellow/amber    → warning, in-progress
```

---

### 4. Typography — readable and consistent

- Use 2–3 font sizes maximum per screen.
- Keep line length between 55–80 characters for readable body text.
- Default body text: 14–16px. Minimum for readable UI text: 12px.
- Use font weight to create hierarchy, not font size alone.
- Avoid mixing too many font styles in the same UI.

---

### 5. Feedback and state — always tell the user what's happening

A good UI never leaves the user guessing.

| Situation          | What to show                                  |
| ------------------ | --------------------------------------------- |
| Action in progress | Spinner, disabled button, loading skeleton    |
| Success            | Confirmation message, updated UI              |
| Error              | Inline message near the problem, not a toast  |
| Empty state        | Explain why, suggest a next action            |
| Destructive action | Confirmation dialog before executing          |

```tsx
// ✅ Communicate pending state
<Button disabled={isPending}>
  {isPending ? "Saving..." : "Save"}
</Button>
```

---

### 6. Consistency — same thing looks and works the same way

- All primary buttons look the same everywhere.
- Spacing between form fields is the same across all forms.
- Icons have a consistent size and weight.
- Links behave like links. Buttons behave like buttons.

Inconsistency is the fastest way to make a UI feel unpolished. Before adding a new pattern, check if one already exists.

---

### 7. Mobile-first — design for the smallest screen first

- Start layout decisions at ~375px wide, then scale up.
- Tap targets must be at least 44×44px.
- Avoid hover-only interactions — they don't exist on touch.
- Scrolling is more natural than pagination on mobile.
- Test font sizes, spacing, and button accessibility on a phone-sized viewport before calling it done.

---

### 8. Reduce friction — every extra step loses users

- Remove required fields that aren't actually required.
- Pre-fill what you can infer.
- Use sensible defaults in forms.
- Prefer one clear action per screen over multiple competing ones.
- If something feels complicated to explain, it's probably complicated to use — simplify the design, not the explanation.

---

### Quick design checklist

Before shipping a screen, verify:

- [ ] Is there a clear primary action?
- [ ] Does the hierarchy guide the eye naturally?
- [ ] Is spacing consistent and generous?
- [ ] Does color use pass contrast checks?
- [ ] Are loading, error, and empty states handled?
- [ ] Does it work at 375px wide?
- [ ] Are all interactive elements at least 44×44px on mobile?
- [ ] Does it feel consistent with the rest of the app?

---