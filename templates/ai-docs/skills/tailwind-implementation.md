# Tailwind Implementation Skill

Use this skill whenever you create, review, or refactor Tailwind CSS in this project.

## Goal

Use Tailwind for speed without turning markup into unmaintainable class soup. Styling should remain token-driven, accessible, responsive, and easy to refactor into components.

## Core Rules

- Prefer configured theme tokens over arbitrary values.
- Keep repeated UI patterns in components, not repeated long class strings.
- Use semantic component names and file structure even when styling is utility-first.
- Keep state variants explicit: `hover:`, `focus-visible:`, `disabled:`, `aria-*`, `data-*`, `motion-safe:`, and `motion-reduce:`.
- Preserve accessibility semantics and focus visibility.
- Use responsive variants intentionally instead of piling on breakpoints by habit.

## Theme Tokens

Put durable design decisions in Tailwind theme configuration or CSS variables.

Prefer:

```html
<button class="rounded-md bg-primary px-4 py-2 text-primary-foreground">
```

Avoid:

```html
<button class="rounded-[11px] bg-[#2563eb] px-[17px] py-[9px] text-[#fff]">
```

Arbitrary values are acceptable for rare one-off integration constraints, but they should not become the project's design language.

## Component Extraction

When a class list is repeated or starts encoding component behavior, extract it.

Good:

```html
{{ tailwindComponentGoodExample }}
```

Risky:

```html
{{ tailwindComponentRiskyExample }}
```

Long class lists are fine inside the component that owns them. They are not fine copied across the app.

## Class Ordering

Keep class strings readable. A useful order is:

- Layout and display.
- Box model and sizing.
- Spacing.
- Typography.
- Visuals.
- Effects and transitions.
- State variants.
- Responsive variants.

Do not bikeshed ordering if the project has a formatter or convention. Follow the local convention.

## Layout

Use Tailwind for common layout primitives:

```html
<section class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
```

Prefer `gap-*`, `space-*`, Grid, and Flex utilities over custom layout CSS unless a component truly needs bespoke styling.

## States

Style states explicitly:

```html
<button class="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
```

Never remove focus styles without replacing them.

## Reduced Motion

Respect motion preferences:

```html
<div class="transition motion-reduce:transition-none">
```

Use `motion-safe:` for animation that should only run when motion is acceptable.

## Dark Mode

If the project supports dark mode, prefer tokens or dark variants that preserve contrast:

```html
<article class="bg-surface text-foreground dark:bg-surface-dark dark:text-foreground-dark">
```

Do not add dark-mode classes by visual guesswork. Check contrast and existing theme tokens.

## Review Checklist

- Theme tokens are used before arbitrary values.
- Repeated class strings are extracted into components.
- Responsive variants are intentional and readable.
- Hover, focus-visible, disabled, aria/data, and reduced-motion states are covered.
- Class lists are understandable and follow local ordering.
- Accessibility semantics are preserved.
- Tailwind is not mixed with unrelated ad hoc CSS unless the component needs it.
