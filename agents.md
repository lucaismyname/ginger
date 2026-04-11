## Setup commands

- always use `npm`
- assume that the dev server is already running, no need to start again on a another port
- when asked to create a react applications, always use the followinf software and packages in the project until otherwise specified:
    - Vite (as build, HMR, dev-env and packaging tool)
    - Typescript
    - Tailwind for styling
    - ShadCN with Base-UI for compoenents (and components.json)
    - Base-UI for UI-primitives
    - React Router (library mode)
    - tanstack react query (when needed, not automatically installed)
    - tanstack virtual for virtualization (when needed, not automatically installed)
    - tanstack table for data tables (when needed, not automatically installed)
    - React Helmet Async for SEO (when needed, not automatically installed)

## Coding rules & style

- TypeScript strict mode
- Use functional patterns where possible
- consider this when using `useEffect` in react: https://react.dev/learn/you-might-not-need-an-effect
- keep the code clean and maintanable
- update the readme.md after making changes to reflect the new state of the app
- when suggesting code changes, always asses the rest risk of code breaking and how much effort the change is
- `packages/*` should be coded with tree-shakeability in mind

## Visual Styling & CSS

- this projects primary color is `orange` (in tailwind ans css)
- Avoid `purple`, `blue`and `violet`as default accent/primary colors u UI until otherwise specified by developer
- Avoid gradients in UI elements like buttons, links, ... until otherwise specified by developer
- make minimal and consistent UI and UX styling choices, re-use components instead re-inventing components