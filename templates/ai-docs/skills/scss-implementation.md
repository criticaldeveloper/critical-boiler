# SCSS Implementation Skill

Use this skill whenever you create, review, or refactor SCSS/CSS in this project.

## Goal

Build styling that is fast to write, easy to delete, low in specificity, accessible by default, and stable across redesigns.

The baseline is:

- Modern reset.
- CSS variables as design tokens.
- Organized SCSS foundation files and component files.
- BEM for real components.
- Tiny utilities for low-level layout only.
- Modern CSS primitives such as logical properties, Grid, Flexbox, container queries, and `clamp()`.

## Recommended Structure

{{ scssRecommendedStructure }}

Avoid one giant `main.scss`.

## Design Tokens

Put design decisions in CSS custom properties, not scattered literal values.

```scss
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-surface: #ffffff;
  --color-text: #111827;
  --color-focus: #f59e0b;

  --font-body: system-ui, sans-serif;

  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 500;
  --z-toast: 700;
}
```

Prefer:

```scss
.card {
  padding: var(--space-md);
}
```

Avoid:

```scss
.card {
  padding: 17px;
}
```

## Reset And Globals

Use a modern reset for foundations only.

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}
```

Global element styling should stay foundational:

```scss
body {
  font-family: var(--font-body);
  color: var(--color-text);
}
```

Avoid component visuals on global elements:

```scss
button {
  border-radius: 999px;
  background: red;
}
```

Use a component class instead:

```scss
.button {
  border-radius: var(--radius-md);
}
```

## Components

Use BEM for real UI components.

```html
<article class="product-card product-card--featured">
  <h2 class="product-card__title">Pro Plan</h2>
  <p class="product-card__description">Best for teams.</p>
</article>
```

```scss
.product-card {
  padding: var(--space-lg);

  &--featured {
    border: 1px solid var(--color-primary);
  }

  &__title {
    margin-block-end: var(--space-sm);
  }
}
```

Keep selectors flat. One level of Sass nesting for BEM elements, modifiers, and states is usually enough.

Avoid:

```scss
.page .section .card .content .title span {
  color: red;
}
```

Avoid styling by IDs:

```scss
#header {
  padding: 2rem;
}
```

Prefer:

```scss
.site-header {
  padding: var(--space-lg);
}
```

## Utilities

Keep utilities tiny and low-level. They may solve:

- Display.
- Layout.
- Alignment.
- Spacing.
- Width and height.
- Visibility.

Good examples:

```scss
.u-flex {
  display: flex;
}

.u-grid {
  display: grid;
}

.u-items-center {
  align-items: center;
}

.u-gap-md {
  gap: var(--space-md);
}

.u-container {
  width: min(1200px, 100% - 2rem);
  margin-inline: auto;
}

.u-stack-md > * + * {
  margin-block-start: var(--space-md);
}

.u-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  align-items: center;
}
```

Do not add utilities for:

- Colors.
- Typography.
- Shadows.
- Borders.
- Branding.
- Component-specific visuals.

Avoid recreating Tailwind badly in SCSS.

## Modern CSS Rules

Use logical properties:

```scss
.card {
  margin-inline: auto;
  padding-block: var(--space-lg);
}
```

Prefer modern layout primitives:

```scss
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-lg);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
```

Use container queries when component size matters:

```scss
.card-grid {
  container-type: inline-size;
}

@container (min-width: 600px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

Use media queries for viewport changes. Use container queries for component-context changes.

Use `clamp()` for fluid sizing:

```scss
.hero-title {
  font-size: clamp(2rem, 5vw, 4.5rem);
}
```

## States And Accessibility

Style states explicitly:

```scss
.button {
  background: var(--color-primary);

  &:hover {
    background: var(--color-primary-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
```

Never remove focus styles without replacing them.

Respect reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Prefer class toggles for JavaScript state:

```html
<div class="accordion accordion--open">
```

```scss
.accordion {
  &--open {
    display: block;
  }
}
```

Avoid JavaScript writing inline styles for normal UI state.

## Specificity And Composition

Do not overuse `!important`.

Acceptable cases:

- Utility overrides.
- Third-party library fixes.
- Accessibility helpers.

Prefer composition over Sass inheritance. Avoid `%placeholder` plus `@extend` for component systems because it can generate surprising selectors.

Prefer:

```scss
.button {
  padding: var(--space-md);
}

.button--primary {
  background: var(--color-primary);
}
```

Keep mixins boring:

```scss
@mixin media-sm {
  @media (max-width: 768px) {
    @content;
  }
}
```

Avoid mixins that hide the design behind large configuration objects.

Use cascade layers carefully when they help control specificity:

```scss
@layer reset, base, components, utilities;

@layer base {
  body {
    color: var(--color-text);
  }
}

@layer components {
  .button {
    padding: var(--space-md);
  }
}

@layer utilities {
  .u-hidden {
    display: none !important;
  }
}
```

## Naming And Deletion

Name classes by meaning, not appearance.

Prefer:

- `.alert--danger`
- `.product-card`
- `.checkout-summary`

Avoid:

- `.red-box`
- `.big-title`
- `.left-column`

Keep components self-contained. Avoid one component reaching deeply into another.

Bad:

```scss
.dashboard .alert .button span {
  color: red;
}
```

A good deletion rule:

If you delete a component, you should know which SCSS can be deleted with it.

## Review Checklist

- Tokens are used instead of magic numbers.
- Selectors are flat and class-based.
- Components use meaningful BEM names.
- Utilities stay layout-only.
- Logical properties are used where they fit.
- Grid, Flexbox, container queries, and `clamp()` are used appropriately.
- Focus, hover, disabled, and reduced-motion states are covered.
- No unnecessary IDs, deep selectors, `@extend`, or `!important`.
- Z-index values come from tokens.
- CSS remains easy to delete with the component it styles.
