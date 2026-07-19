# Test Creation Prompt

Use this when asking Codex to add or improve tests.

```text
Read AGENTS.md and ai-docs/README.md first.

Behavior to test:

Files or modules in scope:

Known edge cases:

Existing test patterns to follow:

Preferred test command:

Add focused tests that protect real behavior. Prefer the project's existing test style and helpers. Avoid broad snapshot churn unless snapshots are already the local convention and add clear value.

Before editing, identify the existing test pattern you will follow. Before the final response, verify the work against ai-docs/definition-of-done.md. After editing, report:
- Tests added or changed.
- Behavior covered.
- Verification run.
- Any remaining untested risk.
```
