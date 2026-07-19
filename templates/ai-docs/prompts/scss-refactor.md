# {{ stylingRefactorPromptTitle }}

{{ stylingRefactorPromptIntro }}

```text
Read AGENTS.md and ai-docs/README.md first.
{{ stylingRefactorSkillInstruction }}

Refactor goal:

Files or components in scope:

Known problems:

Visual behavior that must not change:

Out of scope:

Verification expected:

{{ stylingRefactorChecklist }}

Before editing, summarize the existing styling pattern and the specific refactor plan. Before the final response, verify the work against ai-docs/definition-of-done.md. After editing, report:
- Files changed.
- Rules simplified or moved.
- Any selectors, components, or class lists renamed.
- Documentation updated, or why no docs update was needed.
- Tests and Playwright/browser verification run.
- Any visual risk that needs browser review.
```
