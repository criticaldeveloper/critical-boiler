# React Best Practices Skill

Use this skill when writing, reviewing, or refactoring React code. For Next.js projects, pair it with `ai-docs/skills/nextjs-best-practices.md` and let the Next.js skill own framework-specific server, routing, and caching rules.

## Apply This First

- Prefer simple React code that is correct, accessible, and easy to reason about before adding memoization or advanced patterns.
- Keep components small, named by product meaning, and explicit about props, state ownership, effects, and rendering states.
- Treat performance work as risk-based: remove waterfalls and bundle waste first, then address server/client data flow, then re-render hot spots.
- Follow the existing project conventions for routing, data loading, styling, tests, and file layout.

## Priority Order

1. Eliminate async waterfalls.
2. Keep bundles small and statically analyzable.
3. Protect server-side rendering and server actions.
4. Deduplicate client-side data fetching and global listeners.
5. Reduce unnecessary re-renders in hot paths.
6. Use rendering and browser APIs intentionally.
7. Apply JavaScript micro-optimizations only in repeated or measured hot paths.
8. Use advanced React patterns only when the simpler option cannot meet the requirement.

## Components

- Do not define components inside other components. Move nested components to module scope or a separate file.
- Keep component APIs stable and predictable. Prefer explicit props over hidden global state or implicit behavior.
- Model loading, empty, error, disabled, and optimistic states deliberately when the workflow needs them.
- Preserve semantic HTML and accessible names, keyboard behavior, focus states, and ARIA only where native semantics are not enough.
- Derive values during render when they are pure. Do not add state and effects for values that can be computed from props or existing state.
- Use lazy `useState` initialization for expensive initial values.
- Use functional state updates when the next value depends on the previous value.
- Use refs for transient values that change frequently but do not need to render.

## Effects and Events

- Keep effects for synchronization with external systems, not for ordinary event logic or derived state.
- Move interaction-specific logic into event handlers instead of triggering it from effects after state changes.
- Keep effect dependencies primitive and honest. Do not silence dependency rules to hide design problems.
- Split unrelated effects and hooks when they have different dependencies or lifecycles.
- Clean up event listeners, timers, subscriptions, observers, and pending async work.
- Use passive event listeners for scroll, touch, and wheel handlers when the handler does not call `preventDefault()`.

## Async and Data Loading

- Start independent async work early and await it together with `Promise.all`.
- Check cheap synchronous conditions before awaiting remote flags, permissions, or configuration.
- Move `await` into the branch that actually needs the result.
- For dependent work, keep the dependency explicit and parallelize each independent branch.
- In Next.js route handlers and server code, start independent promises before validation or transformation work when it is safe.
- Use Suspense boundaries where streaming or progressive reveal improves user experience.
- For client data fetching, use the project's established cache or data library. Deduplicate requests instead of starting duplicate fetches from sibling components.

## Next.js and Server Code

Apply this section only when the project actually uses Next.js or another server-rendered React framework.

- Prefer Server Components by default. Add Client Components only when browser APIs, stateful interactions, or client hooks are required.
- Keep Server Action and route handler authorization as strict as API route authorization.
- Never store mutable request-specific data in module-level variables.
- Use request-scoped caching, such as React cache patterns, only for values that are safe to deduplicate within a request.
- Use process or deployment-level caches only for stable, non-user-specific data with clear invalidation.
- Minimize data serialized from server to client components. Pass only what the client actually renders or needs for interaction.
- Parallelize server fetching across sibling work instead of nesting awaits inside component trees.

## Bundle Discipline

- Import directly from the module that owns the code. Avoid broad barrel imports when they pull unnecessary code into the bundle.
- Keep dynamic imports statically analyzable. Avoid computed import paths unless the bundler is configured for them.
- Use dynamic imports for heavy, rarely used UI, admin-only surfaces, charts, editors, maps, and third-party widgets.
- Load analytics, logging, and non-critical third-party scripts after the core UI is interactive unless product requirements say otherwise.
- Preload likely next interactions on hover, focus, viewport entry, or route intent when the project has an established pattern for it.

## Rendering Performance

- Memoize only when work is expensive, props are stable enough to benefit, or profiling shows avoidable renders.
- Do not wrap simple primitive expressions in `useMemo`.
- Hoist default objects, arrays, callbacks, and static JSX that would otherwise create new identities every render.
- Use `startTransition` or deferred values for non-urgent updates that would block typing, filtering, navigation, or animation.
- For long lists or below-the-fold sections, consider virtualization, pagination, or CSS `content-visibility` when supported by the project.
- Avoid hydration flicker. Prefer server-rendered stable values, project-supported hydration scripts, or narrowly scoped mismatch handling.

## JavaScript Hot Paths

- Use `Map` or `Set` for repeated membership checks and lookups.
- Combine repeated array passes only when the code remains readable and the data size makes it worthwhile.
- Hoist regular expressions and stable lookup data out of render loops.
- Avoid sorting only to get a minimum or maximum value.
- Cache expensive pure results only when invalidation is obvious and memory growth is bounded.
- Defer non-critical browser work to idle time when user-visible rendering should win.

## Review Checklist

- No avoidable sequential awaits for independent work.
- No broad imports or computed import paths that make bundles harder to analyze.
- Server code has no shared mutable request state.
- Server Actions and route handlers authorize sensitive operations.
- Client data fetching is deduplicated through the project pattern.
- Effects synchronize with external systems and include cleanup.
- Derived state is computed during render unless there is a strong reason not to.
- Expensive renders, large lists, and heavy third-party modules are isolated or deferred.
- Accessibility semantics and keyboard behavior are preserved.
