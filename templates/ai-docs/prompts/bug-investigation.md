# Bug Investigation Prompt

Use this when asking Codex to investigate and fix a bug.

```text
Read AGENTS.md and ai-docs/README.md first.

Bug:

Expected behavior:

Actual behavior:

How to reproduce:

Relevant logs, screenshots, or traces:

Suspected area:

Verification expected:

Start by investigating the smallest relevant area of the codebase. Identify the likely root cause before editing. Make the narrowest fix that addresses the root cause, and add or update tests when the risk justifies it. Before the final response, verify the work against ai-docs/definition-of-done.md.

After editing, report:
- Root cause.
- Fix applied.
- Files changed.
- Verification run.
- Any remaining uncertainty.
```
