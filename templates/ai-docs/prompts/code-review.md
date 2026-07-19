# Code Review Prompt

Use this when asking Codex to review a change.

```text
Read AGENTS.md and ai-docs/README.md first.

Review target:

Context:

Areas of concern:

Verification already run:

Review with a bug-finding stance. Prioritize correctness, regressions, security, accessibility, performance, maintainability, and missing tests. Do not focus on style nits unless they hide a real risk.

Use ai-docs/definition-of-done.md as the completion standard when checking whether the change is ready.

Return findings first, ordered by severity. For each finding include:
- Severity.
- File and line.
- Why this is a real risk.
- Suggested fix.

Then include:
- Open questions or assumptions.
- Test gaps.
- Brief summary only if useful.
```
