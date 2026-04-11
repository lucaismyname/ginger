# Accessibility Checklist

This guide documents baseline accessibility expectations when building custom UIs
with Ginger controls and hooks.

## Controls baseline

- Use semantic controls (`button`, `input[type=range]`, `select`).
- Keep accessible names in place for every interactive element.
- Preserve keyboard activation (`Enter` / `Space`) and focus rings.
- Use `aria-pressed` for toggle states (shuffle/mute).
- Pair sliders with `aria-valuetext` for screen reader context.

## Label patterns

- Use visible labels when possible.
- If icon-only controls are used, provide `aria-label` explicitly.
- Keep text labels and aria labels aligned for consistency.

## Playlist and queue

- Keep track items keyboard reachable.
- Expose currently playing item through text and stateful attributes.
- Avoid motion-only state updates; include textual status.

## Testing recommendations

- Assert control names with `getByRole`.
- Verify toggle state changes (`aria-pressed`) after interactions.
- Include at least one keyboard-only interaction path in integration tests.
