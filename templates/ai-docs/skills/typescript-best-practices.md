# TypeScript Best Practices Skill

Use this skill when writing, reviewing, or refactoring TypeScript. It adapts the supplied TypeScript guidance into project-local rules for strict, maintainable, type-safe code.

## Apply This First

- Prefer type safety at module boundaries, not noisy annotations everywhere.
- Let TypeScript infer local implementation details when inference is clear.
- Make public APIs, exported functions, data contracts, and framework boundaries explicit.
- Treat `unknown` as the default for untrusted input and narrow it before use.
- Avoid `any` in production code. If `any` is unavoidable, isolate it at a boundary and explain why.
- Run the project type checker before handing work back when TypeScript files changed and that command is configured. Otherwise, use the closest configured compile check, such as the build command.

## Compiler Expectations

- Keep `strict` enabled.
- Prefer `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` for new projects unless the framework starter conflicts.
- Use ESM consistently when the project has `"type": "module"`.
- Keep `skipLibCheck` acceptable for dependency noise, but do not use it to hide first-party errors.
- Prefer framework-provided `tsconfig` presets when they exist, then add project-specific strictness deliberately.

## Domain Types

- Name types by domain meaning, not storage shape alone.
- Use literal unions for finite states instead of enums unless runtime enum behavior is required.
- Use discriminated unions for workflows with distinct states.
- Keep nullable and optional values precise: `null`, `undefined`, and omitted properties are different signals.
- Prefer `Readonly`, readonly arrays, and immutable update patterns for shared or derived data.

```typescript
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

## Boundaries and Validation

- Validate API responses, local storage, URL params, environment variables, and user input at runtime.
- Derive TypeScript types from schemas when the project uses a schema library such as Zod.
- Do not trust `response.json()` to return the type you want. Parse or validate before using it as domain data.
- Keep validation close to the boundary, then pass typed values through the application.
- Use type guards for narrow, reusable checks when a full schema would be too heavy.

```typescript
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
```

## Type Design

- Use `type` aliases for unions, mapped types, and function signatures.
- Use `interface` when declaration merging or class-style object extension is useful.
- Use `satisfies` for config objects when you want conformance checking without losing literal inference.
- Prefer `Pick`, `Omit`, `Partial`, `Required`, `Record`, `ReturnType`, `Parameters`, and `Awaited` over hand-rolled equivalents.
- Avoid broad type assertions. Prefer narrowing, `satisfies`, or small adapter functions.

```typescript
const routes = {
  home: "/",
  settings: "/settings"
} satisfies Record<string, `/${string}`>;
```

## Generics

- Use generics when the caller should keep a relationship between input and output types.
- Constrain generics with `extends` when the implementation depends on a property or capability.
- Keep generic names readable in public APIs. `TData`, `TError`, and `TKey` are often clearer than a pile of single letters.
- Do not add generics where a concrete union or overload communicates the behavior better.
- Avoid deeply nested conditional types unless they protect a real public API.

```typescript
function groupBy<TItem, TKey extends string | number>(
  items: readonly TItem[],
  getKey: (item: TItem) => TKey
): Record<TKey, TItem[]> {
  return items.reduce(
    (groups, item) => {
      const key = getKey(item);
      groups[key] ??= [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<TKey, TItem[]>
  );
}
```

{{ typescriptFrameworkSection }}

## Error Handling

- Do not throw or reject with plain strings.
- Use typed result objects for expected failures that callers should handle.
- Use exceptions for truly exceptional failures or framework-controlled error flows.
- Narrow caught errors from `unknown` before reading properties.

```typescript
type Result<T, E extends string = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

## Imports and Modules

- Use `import type` for type-only imports when the project or linter expects it.
- Avoid circular imports between domain modules, components, and utilities.
- Keep barrel files small and intentional. Do not hide large runtime imports behind convenience exports.
- Prefer stable path aliases only when they are configured in both TypeScript and the build/test tooling.

## Migration and Refactors

- Migrate from JavaScript incrementally: turn on TypeScript, add boundary types, then tighten internals.
- Replace `any` with `unknown` first, then narrow where values are consumed.
- Convert high-value shared modules before leaf modules when a full migration is too large.
- Avoid large type-only refactors mixed with behavior changes unless the user asked for both.

## Review Checklist

- Type checker passes or the remaining failures are clearly unrelated and reported.
- Exported functions, components, hooks, and API contracts have explicit useful types.
- Untrusted data is validated or narrowed before becoming domain data.
- `any`, broad `as` assertions, and non-null assertions are absent or justified.
- State machines use discriminated unions instead of scattered booleans when states are mutually exclusive.
- Generics preserve real relationships and are not decorative.
- {{ typescriptFrameworkReviewChecklist }}
- Type-only imports and runtime imports are separated where the toolchain benefits.
