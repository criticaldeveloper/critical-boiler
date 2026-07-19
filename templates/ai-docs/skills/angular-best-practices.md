# Angular Best Practices Skill

Use this skill when writing, reviewing, or refactoring Angular code. It adapts the supplied Angular guidance into project-local rules for architecture, strict TypeScript, RxJS, templates, state, forms, and maintainable code organization.

## Apply This First

- Follow existing project conventions first when they are already consistent.
- Treat architecture, state ownership, data flow, RxJS usage, and component boundaries as important choices that are expensive to refactor later.
- Keep naming and folder details consistent across the project, but do not churn existing code just to rename it.
- Prefer strict, explicit, boring Angular code over clever shortcuts.
- Keep components, services, templates, and state slices small enough to test and understand.

## Project Structure

- Split business logic into feature areas named by domain meaning, such as `user-info` or `details`.
- Keep feature internals grouped by role when the project has no stronger convention:

```text
feature-name/
  _components/
    _smart/
    _dumb/
  _constants/
  _directives/
  _guards/
  _models/
  _pipes/
  _providers/
  _resolvers/
  _services/
    api/
    facade/
  _store/
    actions/
    models/
    states/
```

- Store mocks next to the production implementation they replace.
- Give nested modules and component folders business names, not technical or abbreviated names.
- Prefer one class, interface, enum, record, or major entity per file.
- Put shared interfaces and models in feature `_models` or a shared/core model area. Keep component-only interfaces next to the component.

## TypeScript Rules

- Keep `strict` enabled.
- Specify access modifiers for class members and methods.
- Explicitly type class properties, constants, function arguments, return values, and RxJS operator callbacks when inference is not obvious.
- Avoid `any`. Use generics, unions, `unknown`, or typed adapters instead.
- Use `readonly` for DTOs, models, inputs, and state where mutation would be risky.
- Prefer immutable updates, especially with `OnPush` change detection and state managers.
- Use `const` by default and `let` only when the reference changes. Do not use `var`.
- Use strict equality.
- Make `null` and `undefined` explicit in types and initial values.
- Avoid stringly typed routes, statuses, and property lookups. Use typed constants, enums, literal unions, or route maps.
- Use generics offered by external APIs, such as Angular Material dialogs, so dialog data and close results stay typed.

## Naming

- Name entities by nouns or domain concepts, not implementation actions.
- Boolean properties should usually start with `is`, `has`, `can`, or `should`.
- Avoid abbreviations in component, class, and model names.
- Avoid vague names like `data`, `item`, `value`, or `count` when the business meaning is known.
- Use method prefixes intentionally:
  - `get...` for retrieving or deriving values.
  - `set...` for changing state based on an argument.
  - `change...` for changing state without an argument.
- Name `@Input()` and `@Output()` members so the parent template reveals what they do.

## Components

- Use `ChangeDetectionStrategy.OnPush` by default.
- Split large templates and controllers into smart and dumb components before they become hard to test.
- Keep smart components responsible for services, facades, routing, data preparation, and orchestration.
- Keep dumb components focused on displaying data and emitting UI events. Do not inject feature services into dumb components.
- Pass data from parent to child through inputs, and events from child to parent through outputs.
- Do not inherit components from each other. Extract shared behavior into services, directives, helpers, or an abstract non-component class when needed.
- Use `trackBy` for `ngFor` or the equivalent tracking syntax for modern Angular control flow.
- Keep component member order predictable:

```text
ViewChild/ViewChildren
Input
Output
public properties
private properties
constructor
getters
setters
public methods
private methods
```

- Prefer an `@Input()` setter for reacting to a single input change.
- Prefer a getter for values derived from inputs or state.
- Use `ngOnChanges` only when multiple inputs must be coordinated, and type the changes through a helper instead of raw string lookups.
- When updating UI objects created after view init, store pending data and apply it after the view child exists.

## Templates

- Keep templates readable. Split templates that are too large or mix several responsibilities.
- Use semantic HTML and accessible Angular Material or native controls.
- Order element attributes consistently:
  1. structural directives or control flow
  2. static attributes
  3. classes
  4. inputs
  5. outputs
- Keep business logic out of dumb component input names. Map domain data into view models at the smart component boundary.
- Avoid calling expensive methods from templates. Prefer properties, signals, observables with `async`, or precomputed view models.

## RxJS

- Prefer RxJS over Promises for cancellable UI workflows, dependent data, route guards, and Angular async streams.
- Do not subscribe in constructors. Subscribe in lifecycle hooks or bind through `async` pipe.
- Always manage subscriptions created with `subscribe()`.
- Put `takeUntil`, `takeUntilDestroyed`, or the project unsubscribe pattern immediately before `subscribe()`.
- Do not add unsubscribe logic to streams that are only consumed by `async` pipe.
- Avoid nested subscriptions. Use `switchMap`, `concatMap`, `mergeMap`, `exhaustMap`, `forkJoin`, `combineLatest`, or `zip` based on the workflow.
- Keep side effects in `tap` or `subscribe`, not in `map` or other transformation operators.
- Avoid calling `subject.next()` inside shared streams when the same result can be modeled as another derived stream.
- Use array destructuring in RxJS callbacks for combined streams.
- Do not create subscriptions inside frequently called lifecycle hooks such as `ngOnChanges`.

## Services, APIs, and Mocking

- Inject abstractions when swapping real and mock implementations matters.
- For mockable services, define an abstract service or interface-like abstract class, then provide either production or mock implementation through a provider.
- Store provider definitions in the feature `_providers` folder.
- Store API services under `_services/api` and facades under `_services/facade`.
- Prefer backend or proxy-based mocking for integration-like flows, and service mocking for UI development or targeted error states.
- Avoid `providedIn: 'root'` for feature services when module-level or feature-level providers make ownership clearer.

## Architecture and State

- Use services for simple shared state. Consider a state manager when many business models must be coordinated or reused.
- Hide state-manager details behind facades. Components and business services should not import store-specific APIs directly.
- Name facade methods by business actions such as `loadUser`, `updateDraft`, or `getStatus`, not by store mechanics.
- Use DTOs for backend shapes, domain models for business objects, and view models for component-specific display needs.
- Map DTOs to domain models in API services, repositories, adapters, or facades before data reaches dumb components.
- Wrap state that needs lifecycle tracking in a typed status model, for example `{ data, status }`.
- Keep selectors focused. Do not create one selector for unrelated smart components unless they truly share business meaning.

## Forms

- Create dedicated view models for forms when the form edits only part of a domain model.
- Clone data before passing it into mutable form libraries or controls.
- Initialize default form models and options before binding.
- Emit form models only when user changes should be propagated.
- Clone emitted models before sending them to parents or stores.
- Use typed helpers for form field keys so model keys and form config stay synchronized.
- Avoid returning new object instances from reactive form expression callbacks when that would trigger endless updates.

## Styling

- Keep component styles in the component style file.
- Use `:host` for styling a component's root behavior.
- Follow the project's selected styling architecture, including Tailwind or SCSS guidance generated in `ai-docs/skills`.
- If using BEM in component styles, keep class names semantic and component-scoped.
- Store static SVG icons under assets. Wrap SVGs in components only when they need behavior, accessibility labels, or reuse.

## Comments

- Prefer self-documenting names and small functions over comments.
- Add comments for non-obvious business rules, framework quirks, bugs, workarounds, or choices that future maintainers could misread.
- Comments should explain why, not restate what the code says.

## Verification Checklist

- Angular build, type check, or the smallest relevant test command passes.
- New components use OnPush unless there is a clear reason not to.
- Inputs, outputs, services, guards, and dialogs are typed.
- Observable subscriptions are managed and not nested.
- Templates remain accessible and readable.
- DTO, model, and view model boundaries are clear.
- State-manager access is hidden behind a facade when state is shared.
- Forms clone mutable data and emit typed view models.
