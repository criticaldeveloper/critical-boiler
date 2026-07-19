# Frontend Component Prompt

Use this when asking Codex to create or modify a frontend component.

```text
Read AGENTS.md and ai-docs/README.md first.
{{ frontendComponentSkillInstruction }}

Component:

Purpose:

States:

Props or inputs:

User interactions:

Accessibility requirements:

Responsive behavior:

Existing design patterns or components to follow:

Verification expected:

Build the component using existing project conventions. Keep component styling semantic, stateful, accessible, and easy to delete with the component. Use tiny utilities only for low-level layout and spacing. Before the final response, verify the work against ai-docs/definition-of-done.md.

After editing, report:
- Files changed.
- Component API or usage.
- States covered.
- Accessibility considerations.
- Verification run.
```
