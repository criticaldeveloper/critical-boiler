# Flutter Best Practices Skill

Use this skill when writing, reviewing, or refactoring Flutter code. It adapts the supplied Flutter task skills into one project-local guide for architecture, responsive layout, routing, data, localization, and tests.

## Apply This First

- Keep UI rendering, state logic, business rules, and data access separate.
- Prefer small, composable widgets named by product meaning.
- Base layout decisions on available constraints, not device labels.
- Preserve platform accessibility, keyboard behavior, pointer behavior, and navigation conventions.
- Run targeted Flutter tests or analysis for the touched area before handing work back.

## Architecture

- Use a layered structure: UI, data, and optional domain logic.
- In the UI layer, keep views lean. Put user interactions and UI state in ViewModels or the project's established state-management layer.
- In the data layer, use repositories as the single source of truth for feature data.
- Keep services stateless. Services wrap HTTP clients, local databases, platform plugins, or other external APIs.
- Map raw API models into clean domain models before exposing them to UI code.
- Add use cases only when business logic is complex, reused across ViewModels, or making a ViewModel difficult to read.
- Inject repositories, services, and use cases through constructors or the project's dependency-injection pattern.

Recommended shape when the project has no stronger convention:

```text
lib/
  data/
    models/
    repositories/
    services/
  domain/
    models/
    use_cases/
  ui/
    core/
    features/
      feature_name/
        view_models/
        views/
```

## Feature Workflow

1. Define immutable domain models.
2. Implement or update services for external data.
3. Implement repositories that transform raw data into domain models.
4. Add a use case only when logic is reusable or too complex for the ViewModel.
5. Implement the ViewModel or state owner with immutable state snapshots.
6. Build lean widgets that receive data and callbacks.
7. Register dependencies in the project's DI pattern.
8. Add focused tests for repositories, ViewModels, and important widgets.

## Responsive Layout

- Remember Flutter's layout rule: constraints go down, sizes go up, parent sets position.
- Use `LayoutBuilder` for parent-size decisions and `MediaQuery.sizeOf(context)` for app-window dimensions.
- Do not switch layouts based on hardware labels such as phone or tablet.
- Do not use orientation as the primary layout signal. Resizable windows and foldables make orientation unreliable.
- Use `Expanded` and `Flexible` inside `Row`, `Column`, and `Flex` to distribute available space.
- Constrain content width on large screens with `ConstrainedBox`, `SizedBox`, or max-width layout primitives.
- Use `ListView.builder` and `GridView.builder` for large or unknown-length collections.
- Avoid locking orientation unless a product requirement is explicit.

## Layout Error Fixes

- For "Vertical viewport was given unbounded height," constrain the scrollable with `Expanded`, `Flexible`, or a bounded `SizedBox`.
- For "InputDecorator cannot have an unbounded width," wrap the text field in `Expanded` or `Flexible` inside horizontal layouts.
- For `RenderFlex overflowed`, constrain or wrap the overflowing child, usually with `Expanded`, `Flexible`, or text wrapping.
- For "Incorrect use of ParentDataWidget," make sure `Expanded` and `Flexible` are direct children of `Flex` widgets, and `Positioned` is a direct child of `Stack`.
- Ignore cascading "RenderBox was not laid out" messages until the first constraint violation is fixed.

## Routing

- Use the project's existing routing package and conventions.
- For new declarative routing, prefer `go_router` with `MaterialApp.router`.
- Keep route definitions centralized enough to reason about deep links, auth redirects, and nested shells.
- Use `StatefulShellRoute` when bottom-tab or rail navigation needs each branch to preserve navigation state.
- For Flutter web or deep linking, configure clean URL strategy and platform-specific Android/iOS link handling deliberately.
- Use named routes or typed route helpers when the project already has them.

## Networking and JSON

- Use the project's established HTTP client. For simple REST work, the `http` package is acceptable.
- Always build URLs with `Uri.parse` or `Uri` constructors.
- Set headers explicitly, including auth and content type.
- Encode mutation bodies with `jsonEncode`.
- Validate status codes and throw explicit exceptions or return typed result objects on failure. Do not return `null` for failed requests.
- Decode JSON into typed models at the boundary.
- For small payloads, parse synchronously with explicit casts or pattern matching.
- For large payloads, use `compute()` with a top-level or static parsing function to avoid UI jank.
- Write unit tests for serialization and parsing behavior.

## Localization

- Use Flutter's generated localization flow when localization is needed.
- Add `flutter_localizations` and `intl`, enable `flutter.generate`, and configure `l10n.yaml`.
- Store localized strings in ARB files with descriptions for translators.
- Keep placeholders, plurals, and selects in ARB metadata so generated APIs stay type-safe.
- Access localized strings through generated `AppLocalizations` from widgets below `MaterialApp` or `CupertinoApp`.

## Widget Tests

- Put widget tests in `test/` and suffix files with `_test.dart`.
- Use `testWidgets` and `WidgetTester` for render and interaction tests.
- Wrap widgets in `MaterialApp`, `CupertinoApp`, `Directionality`, providers, or localization shells when inherited context is required.
- Verify initial render, simulate interaction, pump frames, then verify updated state.
- Use `pump()` for ordinary state changes and `pumpAndSettle()` for animations or asynchronous UI transitions.
- Use stable keys for interactive or repeated widgets when text/type finders are ambiguous.

## Integration Tests and Previews

- Add integration tests for high-value flows that cross screens, platform services, or persistence boundaries.
- Keep widget previews or sample harnesses lightweight and close to reusable UI when the project uses previews.
- Prefer deterministic fake services and repositories in tests over live network calls.

## Verification Checklist

- `flutter analyze` passes or unrelated existing failures are reported.
- Relevant `flutter test` targets pass.
- Layout changes are checked at small and large widths.
- Scrollables are bounded and do not trigger layout exceptions.
- Navigation changes handle back behavior and deep links where relevant.
- Network and JSON code handles success, failure, and malformed data.
- Localized strings are generated and consumed through typed APIs.
- Accessibility semantics, touch targets, keyboard navigation, and focus behavior are preserved.
