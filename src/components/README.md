# Component

This directory contains **domain-specific UI components**. These components are
designed to be reusable across the application, free of side effects.

## Characteristics

- **No side effects**
  - Components do not perform external API calls, modify global state, or
    manipulate the DOM outside their scope.
- **Reusable**
  - Can be safely used in different contexts.
- **Local internal state is allowed**
  - Internal state for UI purposes (e.g., button toggle, modal open/close) is
    permitted if it is confined within the component.
  - In Server Components (RSC), use `'use client'` only where necessary to
    localize state.
