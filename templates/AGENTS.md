# Agent Instructions

Generated for `{{ projectName }}` on `{{ generatedAt }}`.

## Operating Principles

- Read nearby code before changing behavior.
- Keep edits focused on the requested task.
- Preserve user changes and do not revert unrelated work.
- Prefer existing project patterns over new abstractions.
- Add tests when behavior changes or risk is not trivial.
- Read `ai-docs/commands.md` before running commands. Do not guess install, dev, typecheck, lint, test, build, E2E, or format commands.
- Run the smallest meaningful verification command before handing work back.
- Check `ai-docs/definition-of-done.md` before handing work back.
- Document important assumptions in `ai-docs/README.md`, `ai-docs/architecture.md`, `ai-docs/commands.md`, or `ai-docs/definition-of-done.md`.
- Keep documentation synchronized with implementation changes. When behavior, architecture, commands, styling conventions, APIs, setup, or workflows change, update the relevant docs in `ai-docs/`, `README.md`, component docs, or inline usage examples.

## Documentation Expectations

- Update docs in the same change set as the implementation.
- Prefer practical documentation that helps the next agent or maintainer understand what changed and how to work with it.
- Record new commands, environment variables, package scripts, architectural decisions, styling conventions, and testing notes where future work will look for them. Keep command updates in `ai-docs/commands.md`.
- If no documentation update is needed, mention why in the delivery summary.

## Component and Styling Determinism

- Before creating a component, search for existing components, patterns, and style primitives that already solve the same case.
- Reuse or extend an existing component when it matches the same role, behavior, or visual pattern. Do not create a parallel component for the same use case.
- If the project has no component library, build each needed component as a reusable local component with clear props, accessible states, and predictable composition.
- Keep component APIs deterministic: avoid one-off prop names, hidden global dependencies, and behavior that differs between similar components without a documented reason.
- Follow the selected styling approach for the project. Use Tailwind when Tailwind is selected; use SCSS when SCSS is selected.
- When using Tailwind, prefer configured theme tokens and established utility patterns. Extract repeated class combinations into reusable components instead of copying them across files.
- When using SCSS, put component visuals in semantic component classes, keep selectors flat, and use reusable CSS custom properties or SCSS variables for design tokens instead of scattered literal values.
- Keep styling reusable and tokenized. New colors, spacing, typography, shadows, radii, or layout constants should become documented tokens when they are part of the design language.
- Document new component conventions, reusable variants, and token decisions where future agents will look for them.

## Verification Expectations

{{ agentVerificationExpectations }}

## Definition Of Done

- Before the final response, verify the work against `ai-docs/definition-of-done.md`.
- If any relevant item is not satisfied, either complete it or call out the blocker clearly in the final response.

## Technology Notes

Project technologies: {{ technologies }}

{{ agentTechnologyNotes }}

{{ stylingArchitectureSection }}

## Delivery Checklist

- Explain the change in plain language.
- Mention verification performed and any command that could not run.
- Call out follow-up work only when it is genuinely useful.
