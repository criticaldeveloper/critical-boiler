---
name: beads-task-planning
description: Plan, claim, execute, coordinate, and close repository work through the Beads (`bd`) dependency-aware task graph. Use for feature or bug planning, breaking goals into tickets, finding ready work, coordinating multiple agents, recording blockers or discoveries, linking dependencies, and completing work with verification evidence.
---

# Beads Task Planning

Use Beads as the authoritative work graph. Keep transient execution notes in the current task and durable discoveries in Beads; do not create competing TODO Markdown files.

## Start With Reality

1. Confirm dependencies are installed and `.beads/` exists. On first use, follow the ordered bootstrap in `ai-docs/commands.md`: install, setup, prime, then ready.
2. Run `bd prime` to load the current workflow context.
3. Run `bd ready --json` to find unblocked work, or `bd search "<query>" --status all --json` before proposing a new task.
4. Run `bd show <id> --json` before claiming or changing a task.
5. Read `ai-docs/beads.md` for this project's taxonomy, lifecycle, evidence, and handoff rules.

If the CLI is unavailable or `.beads/` is missing, do not keep retrying `bd prime`; complete the documented bootstrap first. Use `bd ping --json` to distinguish database connectivity problems from workflow-context output.

## Plan a Task Graph

- Search before creating; update or link an existing task when it already represents the work.
- Create a parent epic for a multi-step outcome and children for independently verifiable deliverables.
- Give every task a concrete problem statement, acceptance criteria, priority, type, and verification approach.
- Represent ordering with dependencies, not prose. Use `bd dep add <dependent-task> <blocking-task>` when one task must wait for another.
- Represent hierarchy separately with `bd create "<child>" --parent <epic-id>` or `bd update <child-id> --parent <epic-id>`.
- Create explicit `task` issues labeled `spike` for unknowns that materially block implementation.
- Include tests, documentation, migrations, rollout, observability, and security work when the goal requires them.
- Keep tasks reviewable in scope. Do not fragment trivial steps into separate tickets.

Planner agents may create tasks and dependency edges. Worker agents should not expand scope silently; they should record discoveries and ask the planner to replan when new work is material.

## Import a Markdown Backlog

Use the deterministic importer for a Markdown file containing many tasks. Do not manually create a large batch from free-form interpretation.

1. Ensure actionable items use Markdown checkboxes such as `- [ ] Implement login`.
2. Preserve nested checkboxes for parent/child relationships.
3. Add explicit annotations where needed:
   - `[priority:P1]`
   - `[type:bug]`
   - `[labels:frontend,security]`
   - `[depends-on:Exact blocker title]`
4. Preview with the Markdown import command documented in `ai-docs/commands.md` (`pnpm beads:import-md <file.md>` in Node projects).
5. Read the generated `ai-docs/tmp/beads-import-*.json` report. Check titles, descriptions, acceptance criteria, parents, dependencies, skipped completed tasks, and task count.
6. Correct ambiguity in the source Markdown and regenerate the preview. Do not guess an intended dependency.
7. Apply with the documented command plus `--apply` only after review.
8. Rerun preview or apply safely when needed; stable metadata fingerprints match previously imported tasks instead of creating them again.

The importer intentionally ignores ordinary prose and non-checkbox lists. It defaults to 200 tasks, skips completed checkboxes, and requires explicit flags to raise scope or include completed work.

## Execute a Task

1. Claim exactly one ready task with `bd update <id> --claim` before editing.
2. Keep the task status and notes synchronized with actual progress.
3. When blocked, record the reason, evidence, and precise unblock condition. Link the blocking task when one exists.
4. Add concise progress notes for decisions or findings another agent would otherwise have to rediscover.
5. Run the repository's documented verification commands.
6. Attach concrete evidence: commit, PR, changed paths, test output, build result, benchmark, or deployment link.
7. Close with `bd close <id> "<verified outcome>"` only when acceptance criteria are satisfied.

Do not claim several unrelated tasks speculatively. Use `bd ready` again after closing work because dependency resolution can release the next task.

For a tracked blocker, add a dependency rather than relying only on `--status blocked`. Use `bd update <id> --status blocked` for an external or manual blocker with no task edge. Reopen regressed or incorrectly closed work with `bd reopen <id> --reason "<reason>"`; correct inaccurate task fields with `bd update` rather than creating a duplicate.

## Coordinate Agents

- Use task IDs in agent handoffs, branch names, commits, and PR titles when repository conventions permit.
- Give each worker a distinct claimed task with non-overlapping file ownership where possible.
- Treat Beads state as the coordination boundary; chat summaries are not authoritative task state.
- Prefer JSON output for automation and parse it instead of scraping human-formatted tables.
- Never close another agent's task without checking its evidence and acceptance criteria.

## Preserve Auditability

- Record who or what performed an update when it is not obvious from Beads history.
- Keep secrets, tokens, private URLs, and raw sensitive logs out of task descriptions and comments.
- Store stable project knowledge with `bd remember "<insight>"`; do not create `MEMORY.md` files.
- Run `bd status` and `bd ping` when task state or repository integration appears inconsistent.
