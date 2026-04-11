## Setup commands

- always use `npm`
- assume that the dev server is already running, no need to start again on a another port
- when asked to create a react applications, always use the followinf software and packages in the project until otherwise specified:
    - Vite
    - Typescript
    - Tailwind for styling
    - ShadCN with Base-UI for compoenents (and components.json)
    - Base-UI for UI-primitives
    - React Router (library mode)
    - tanstack react query (when needed, not automatically installed)
    - tanstack virtual for virtualization (when needed, not automatically installed)
    - tanstack table for data tables (when needed, not automatically installed)
    - React Helmet Async for SEO (when needed, not automatically installed)

## Code style

- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible
- consider this when using `useEffect` in react: https://react.dev/learn/you-might-not-need-an-effect
- keep the code clean and maintanable
- update the readme.md after making changes to reflect the new state of the app
- when suggesting code changes, always asses the rest risk of code breaking and how much effort the change is

## Styling

- Avoid `purple`, `blue`and `violet`as default accent/primary colors until otherwise specified
- Avoid gradients in UI elements like buttons, links, ... until otherwise specified
