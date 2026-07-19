# Next.js Best Practices Skill

Use this skill when writing, reviewing, or refactoring Next.js code. It adapts the supplied Next.js component-pattern guidance into project-local rules for component composition, prop modeling, type safety, server/client boundaries, and data flow.

## Apply This First

- Follow the React and TypeScript skills generated for this project.
- Prefer Server Components by default. Add Client Components only for browser interactivity, state, effects, refs, or client-only libraries.
- Keep server logic, route handlers, server actions, and client event handlers clearly separated.
- Use composition and strict types to prevent invalid component states.
- Keep components specialized, explicit, and easy to test.

## Core Patterns

- Specialized component extraction: break large components into focused pieces with one responsibility.
- Compound components: expose related sub-components through a parent when flexible composition is needed.
- Config objects: group related props into named objects instead of spreading many loosely related props.
- Component composition: build complex UI from smaller components and children rather than piles of conditional props.
- Separation of concerns: keep data fetching, state transitions, rendering, and event handling in clear layers.
- Slots pattern: use named sub-components or render regions to customize content while preserving structure.

## Prop Design

- Avoid long lists of boolean props. Replace them with a `variant`, discriminated union, specialized component, or composition.
- Avoid props that can conflict, such as combinations that produce invalid UI states. Model mutually exclusive states as discriminated unions.
- Group related props into config objects when they change together or describe one concern.
- Keep prop names explicit and domain meaningful.
- Document prop relationships through TypeScript types instead of prose comments where possible.
- Test important prop combinations, especially state and variant combinations.

```typescript
type FieldState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; message?: string };
```

## Composition Over Conditionals

- Extract `Header`, `Content`, `Footer`, state message, actions, and layout pieces when one component starts doing several jobs.
- Prefer `children`, named slots, or compound components for flexible content placement.
- Use variant-specific components when each variant has meaningfully different structure or behavior.
- Keep parent components responsible for orchestration and child components responsible for rendering.

```tsx
<Form>
  <Form.Header title="Profile" />
  <Form.Content>{fields}</Form.Content>
  <Form.Footer>{actions}</Form.Footer>
</Form>
```

## Compound Components

- Use compound components when consumers need flexible arrangement of related pieces.
- Keep the parent responsible for shared context and structure.
- Keep each sub-component specialized and small.
- Do not hide required ordering or dependencies. Make invalid composition hard through types or runtime development warnings.

## Config Objects

- Use config objects for grouped display, state, validation, style, or behavior settings.
- Keep configs typed, named, and narrow.
- Avoid dumping every prop into one giant `config`.
- Use schema validation at boundaries when config can come from external data.

## Prop Drilling and Context

- Avoid passing props through components that do not use them.
- Use custom hooks near the components that need data.
- Use context for deeply nested shared state, theme-like values, or compound component coordination.
- Use context sparingly. Do not replace clear explicit props with hidden global dependencies.
- Keep context values stable and focused so unrelated consumers do not re-render unnecessarily.

## Callbacks and Events

- Avoid callback-heavy APIs with many handler props.
- Group related callbacks into an `events`, `handlers`, or domain-specific event object when they belong together.
- Extract stateful event logic into custom hooks.
- Keep UI components rendering-focused and let hooks or containers handle workflow logic.

## Explicit Prop Forwarding

- Avoid spreading unknown props across component boundaries.
- Whitelist forwarded DOM props and make the boundary clear.
- Use rest props only when building low-level primitives that intentionally forward safe DOM attributes.
- Do not let spread props create hidden styling, accessibility, or behavior dependencies.

## Controlled and Uncontrolled State

- Decide whether a component is controlled, uncontrolled, or supports both.
- If supporting both, model the API deliberately with clear `value`, `defaultValue`, and `onChange` behavior.
- Move reusable state logic into custom hooks.
- Keep local state local when no parent needs to control it.

## Type Safety and Validation

- Use strict TypeScript for component APIs.
- Use discriminated unions for mutually exclusive states.
- Use generic helpers only when they preserve real relationships.
- Use Zod or the project validation library for external data, server action input, route params, search params, and complex config objects.
- Keep runtime validation at boundaries and pass typed data inward.

## Server and Client Boundaries

- Keep server actions in server files or clearly server-only modules.
- Keep client event handlers inside Client Components.
- Do not mix server actions and client handlers in a way that obscures where code runs.
- Fetch async data in Server Components when possible.
- Pass serialized data to Client Components. Do not pass non-serializable values across the server/client boundary.
- Keep route handlers narrow: validate input, call domain logic, return a clear response.

## Async Props and Data

- Avoid pushing unresolved async state into generic component props when a Server Component can await it first.
- Keep loading, error, empty, and success states explicit.
- Use Suspense and streaming where it improves user experience.
- Do not duplicate data fetching across sibling components when a shared server-level fetch or cache can deduplicate it.

## Custom Hooks

- Prefer custom hooks for reusable client-side behavior.
- Do not pass hook results through many component layers. Call the hook where the behavior is needed when possible.
- Keep hooks focused on one concern.
- Separate hooks that read state from hooks that trigger mutations when it improves clarity.

## Implementation Priority

1. Start with strict TypeScript.
2. Split large components into specialized pieces.
3. Use composition for content and structure.
4. Introduce variants for clear visual or behavioral modes.
5. Group related props into typed config objects.
6. Add context only when prop drilling is real and repeated.
7. Validate external data and complex config at boundaries.

## Verification Checklist

- Server and client responsibilities are clear.
- No component has a large set of loosely related boolean props.
- Invalid prop combinations are prevented by types or validation.
- Components are decomposed by responsibility.
- Prop forwarding is explicit and safe.
- Context is used only where it improves data flow.
- Custom hooks own reusable client logic.
- Async data is fetched at the right server/client boundary.
- Important variants and prop combinations have tests or focused verification.
