# Vue Best Practices Skill

Use this skill when writing, reviewing, or refactoring Vue code. It adapts the Vue style guide and modern Vue 3 conventions into project-local guidance unless a local convention says otherwise.

## Apply This First

- Follow existing project conventions for Composition API, Options API, routing, state, tests, and styling.
- Treat the essential rules as error-prevention rules, not preferences.
- Keep component APIs explicit: props, emits, slots, and exposed state should be easy to understand from the component file.
- Prefer readable templates and named computed values over clever inline expressions.
- Preserve accessibility semantics, keyboard behavior, focus states, and meaningful labels.

## Essential Rules

- Component names should be multi-word, except root `App` components and Vue built-ins.
- In Options API components, `data` must be a function that returns fresh state for each component instance.
- Prop definitions should be detailed. Specify types, required/default behavior, and validators for constrained values.
- Always use a stable unique `key` with `v-for`.
- Do not put `v-if` and `v-for` on the same element. Filter with computed state or move `v-if` to a wrapper.
- Scope component styles outside app/layout roots through `scoped`, CSS modules, BEM, or the project styling convention.
- Avoid private instance names that conflict with Vue internals. Prefer module-scoped helper functions; for plugin/mixin private instance properties, use a scoped `$_name_` prefix.

## Component Files and Naming

- Put each component in its own file when a build system is available.
- Use one filename casing convention consistently: PascalCase or kebab-case.
- Use base component prefixes for app-level presentational components, such as `Base`, `App`, or the project's chosen prefix.
- Prefix single-instance layout components with `The`, such as `TheHeader` or `TheSidebar`.
- For tightly coupled child components, prefix with the parent component name, such as `TodoListItem` and `TodoListItemButton`.
- Order component words from general to specific so related components group together in file lists.
- Prefer full words over abbreviations.

## Props, Emits, and Communication

- Declare props in camelCase in JavaScript or TypeScript, and pass them as kebab-case in templates.
- Avoid mutating props. Emit events or use `v-model` conventions instead.
- Prefer props down and events up for parent-child communication.
- Avoid `$parent`, `$root`, and global event buses for ordinary application data flow.
- Type `emits` and slots when using Vue 3 with TypeScript.
- Keep dumb/presentational components free of global store knowledge when possible.

## Templates

- Keep template expressions simple. Move complex logic into computed properties or methods.
- Split complex computed properties into smaller named computed values.
- Use multi-line formatting for elements with several attributes.
- Quote non-empty HTML attribute values.
- Use directive shorthands consistently: either always use `:`, `@`, and `#`, or always use long forms.
- Self-close components with no content in single-file components and JSX, but not in DOM templates.
- Use PascalCase component tags in single-file components when that is the project convention; use kebab-case in DOM templates.
- Keep element attributes ordered consistently:
  1. definition, such as `is`
  2. list rendering, such as `v-for`
  3. conditionals, such as `v-if` and `v-show`
  4. render modifiers, such as `v-pre` and `v-once`
  5. global awareness, such as `id`
  6. unique attributes, such as `ref` and `key`
  7. two-way binding, such as `v-model`
  8. other attributes
  9. events
  10. content overrides, such as `v-html` and `v-text`

## Component Organization

- Keep component options or setup sections ordered consistently.
- In Options API code, group global awareness, component dependencies, props, local state, computed state, watchers, lifecycle hooks, methods, and render/template sections predictably.
- In `<script setup>`, keep imports, type declarations, props/emits, composables, local state, computed values, watchers, functions, and exposed values in a consistent order.
- Keep `<style>` last in single-file components. Choose either `<script>`, `<template>`, `<style>` or `<template>`, `<script>`, `<style>` and stay consistent.

## State and Data Flow

- Use local component state for local UI behavior.
- Use composables for reusable reactive logic.
- Use a store such as Pinia or the project's established state layer for shared global state.
- Avoid `$root` state and global event buses in maintainable application code.
- Keep store access at container/page boundaries when presentational components can receive props instead.
- Avoid deep implicit coupling between parent and child components.

## Styling

- Scope component-owned styles.
- Use class selectors over element selectors in scoped styles for clearer intent and better performance.
- Follow the project's selected styling skill for Tailwind or SCSS.
- Keep global styles in app roots, layouts, or explicitly global style files.
- For component libraries, prefer stable class-based strategies over relying only on `scoped` internals.

## Cautionary Patterns

- Use `key` on same-type `v-if`/`v-else` branches when the branches must not reuse DOM or component state.
- Avoid `v-html` unless content is trusted and sanitized.
- Avoid prop mutation except in rare, well-understood migration or tightly coupled cases.
- Avoid global event buses and `$root` state for non-trivial applications.
- Avoid mixins for new reusable logic when composables can make dependencies clearer.

## Verification Checklist

- Component names are multi-word and consistently cased.
- Props and emits are explicit and typed where the project uses TypeScript.
- Lists use stable keys.
- No element combines `v-if` with `v-for`.
- Template expressions are simple, with complex logic moved to computed values or methods.
- Parent-child communication uses props and events.
- Shared state uses the project's store or composable pattern, not `$root` or event buses.
- Component styles are scoped or otherwise collision-resistant.
- The smallest relevant type check, lint, unit test, or rendered UI check passes.
