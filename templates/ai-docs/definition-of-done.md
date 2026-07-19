# Definition Of Done

A task is complete only when all relevant items below are satisfied.

## Scope

- The smallest useful change has been implemented.
- The solution addresses the actual request, not adjacent cleanup.
- Existing user work and unrelated files are preserved.
- No unrelated refactors, formatting churn, dependency changes, or generated-file changes are included.

## Project Consistency

- Existing architecture, naming, file placement, and local patterns are followed.
- New abstractions are added only when they remove real duplication or complexity.
- Public APIs, component props, command names, routes, and data contracts remain backward-compatible unless the task explicitly changes them.

## Quality

- Relevant edge cases are handled.
- Errors, empty states, loading states, accessibility, and responsive behavior are covered when the change touches UI or user workflows.
- Security, validation, permissions, and data integrity are considered when the change touches external input, auth, persistence, or APIs.

## Documentation

- User-facing behavior is documented when needed.
- `ai-docs/architecture.md` is updated when structure, routing, data flow, state, styling, or test locations change.
- `ai-docs/commands.md` is updated when commands, scripts, tooling, or verification expectations change.
- If no docs update is needed, the final response says why.

## Verification

- The commands in `ai-docs/commands.md` are used as the source of truth.
- The smallest meaningful verification command has passed.
- Relevant tests, typechecks, lint, builds, or E2E checks pass when applicable.
- If a relevant check cannot run, the blocker is explained clearly.
- Failures are not ignored; they are either fixed or reported with the reason they are outside the task.

## Handoff

- For implementation tasks, the final response lists changed files.
- For review-only or investigation-only tasks, the final response lists findings instead of changed files.
- The final response explains behavior changed, or says no behavior changed.
- The final response reports verification run.
- Remaining risks or follow-up work are called out only when real.
