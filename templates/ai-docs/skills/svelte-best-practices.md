# Svelte Best Practices Skill

Use this skill when writing, reviewing, or refactoring Svelte code. It adapts the official Svelte best-practices guidance into project-local rules for runes, derived state, effects, props, events, snippets, keyed lists, styling, context, async features, and legacy APIs.

## Apply This First

- Follow existing project conventions for Svelte, routing, stores, tests, and styling. Apply SvelteKit-specific guidance only when this project actually uses SvelteKit.
- Prefer Svelte 5 runes mode for new code.
- Keep state local unless it must be shared.
- Prefer declarative state and markup over imperative lifecycle code.
- Preserve compiler warnings, accessibility warnings, keyboard behavior, focus states, and semantic markup.

## State

- Use `$state` only for values that must trigger template, `$derived`, or `$effect` updates.
- Use ordinary variables for non-reactive values.
- Remember that `$state({ ... })` and `$state([ ... ])` are deeply reactive and proxied.
- Use `$state.raw` for large objects or arrays that are only reassigned, such as API responses, to avoid unnecessary proxy overhead.
- Do not use shared module state for request-specific or user-specific data in SSR contexts.

## Derived Values

- Use `$derived` for values computed from state.
- Keep `$derived` expressions free of side effects.
- Use `$derived.by` when a derived value needs a multi-statement function.
- Prefer derived values over effects that assign computed state.
- Remember that derived object and array results are returned as-is, not deeply reactive.

## Effects

- Treat `$effect` as an escape hatch.
- Avoid updating state inside effects.
- Do not use effects for ordinary event response logic; put that logic in event handlers or function bindings.
- Do not use effects only to calculate values that belong in `$derived`.
- Use effects to synchronize with external systems only when no better Svelte primitive fits.
- Do not wrap effects in `if (browser)`. Effects do not run during server-side rendering.
- For debugging reactive dependencies, use `$inspect` and `$inspect.trace` instead of ad hoc logging effects.

## Props

- Use `$props` for component inputs in new code.
- Treat props as changing values.
- Use `$derived` for values that depend on props.
- Type props when using TypeScript.
- Use `$bindable` only for values that are intentionally writable by the parent.
- Avoid copying a prop into local state unless you intentionally need an editable local draft.

## Events

- Use element attributes that start with `on` for event listeners, such as `onclick`.
- Use event handler shorthand when it improves readability.
- Use `<svelte:window>` and `<svelte:document>` for window and document listeners.
- Avoid using `onMount` or `$effect` just to attach window or document listeners.
- Keep event handlers named by user intent when they contain more than a tiny inline expression.

## Snippets and Markup Reuse

- Use `{#snippet ...}` and `{@render ...}` for reusable chunks of markup.
- Declare snippets inside the template.
- Use snippets instead of legacy slots for new Svelte 5 code.
- Export top-level snippets from module context only when they do not depend on component state and reuse is intentional.
- Keep snippets small and named by the UI role they render.

## Each Blocks

- Prefer keyed `{#each}` blocks.
- Use keys that uniquely identify the item.
- Do not use array indexes as keys when item identity matters.
- Avoid destructuring each-block items when you need to mutate or bind to the item, such as `bind:value={item.count}`.

## Styling

- Use component-scoped styles by default.
- Use CSS custom properties to pass JavaScript values into CSS:

```svelte
<div style:--columns={columns}>...</div>
```

- Let child components expose style hooks through CSS custom properties when parents need styling control.
- Use `:global` only when styling a third-party or library child is impossible through a cleaner API.
- Follow the generated Tailwind or SCSS skill when the project selected a styling architecture.

## Context and Shared State

- Prefer context over shared module state when state should be scoped to a subtree.
- Use `createContext` rather than untyped `setContext` and `getContext` when type safety matters.
- Avoid leaking SSR state across users through module-level mutable state.
- Use classes with `$state` fields or the project's established store pattern for shared reactive logic.

## Async Svelte

- If the project uses Svelte 5.36+ with `experimental.async`, promises can be used directly in components through async Svelte features.
- Treat experimental async features as opt-in project architecture. Do not introduce them without checking `svelte.config.js` and local conventions.
- Keep loading, success, empty, and error states explicit for user-facing async UI.

## Avoid Legacy APIs in New Code

- Use `$state` instead of implicit reactive `let` mutation.
- Use `$derived` and `$effect` instead of `$:` assignments and statements, using effects only when no better primitive fits.
- Use `$props` instead of `export let`, `$$props`, and `$$restProps`.
- Use `onclick={...}` style events instead of `on:click`.
- Use snippets and render tags instead of legacy slots, `$$slots`, and `<svelte:fragment>`.
- Use normal dynamic components instead of legacy `<svelte:component>`.
- Import a component as `Self` instead of using `<svelte:self>`.
- Use `{@attach ...}` instead of legacy actions when the project has adopted the new API.
- Prefer clsx-style arrays and objects in `class` attributes instead of `class:` when that is the project convention.

## Verification Checklist

- Reactive values use `$state` only when updates are needed.
- Computed values use `$derived`, not state assignments inside `$effect`.
- Effects synchronize with external systems and do not contain avoidable state updates.
- Props are handled through `$props`, typed where applicable, and treated as changing.
- Window and document listeners use Svelte special elements.
- Repeated markup uses snippets or components.
- Lists use keyed each blocks with stable non-index keys.
- Styling uses component scope and CSS custom properties before `:global`.
- Context is typed and scoped, avoiding shared SSR module state leaks.
- The smallest relevant Svelte check, test, or build command passes. Include SvelteKit checks only when this project uses SvelteKit.
