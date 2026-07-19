# Beads Task Management

Beads is the authoritative task store for this repository. It provides stable IDs, dependencies, readiness queries, task history, and durable agent memory. Do not maintain a competing `TODO.md`, `tasks.md`, checklist, or chat-only backlog.

## Setup

For Node-based projects:

```sh
pnpm install
pnpm beads:setup
pnpm beads:prime
pnpm beads:ready
```

The project pins `@beads/bd` as a development dependency and explicitly allows that package's required native-binary installer in `pnpm-workspace.yaml`. No other dependency build script is approved by this integration. For a non-Node project, install Beads globally with `npm install -g @beads/bd`, then run `node scripts/setup-beads.mjs`.

Run the bootstrap commands in that order. Critical Boiler writes the package entry, scripts, and documentation, but it does not install dependencies, create `pnpm-lock.yaml`, or initialize `.beads/` during file generation. `bd prime` is workflow context, not setup or a health check; run it only after installation and `beads:setup` succeed. Use `bd ping` or `pnpm beads:status` when checking operational health.

Git is optional to Beads itself, but Critical Boiler initializes standalone generated targets as Git repositories with an unborn `main` branch. Existing repositories and branches are preserved. Configure a remote before relying on PR or remote-delivery linkage.

The setup script is idempotent. It initializes Beads with `--skip-agents` and appends marked Critical Boiler sections to existing `AGENTS.md` and AI docs without replacing their content.

### Executable Override

Both `scripts/setup-beads.mjs` and `scripts/import-beads-markdown.mjs` read `BEADS_BIN` before normal Beads executable discovery. Set it to a native executable or a `.js`/`.mjs` launcher when Beads is installed in a non-standard location. The configured path takes precedence over the project-local package and `PATH` lookup.

PowerShell:

```powershell
$env:BEADS_BIN = "C:\tools\beads\bd.exe"
```

POSIX shells:

```sh
BEADS_BIN=/opt/beads/bd.mjs pnpm beads:setup
```

## Source of Truth

- Beads owns planned work, status, dependencies, acceptance criteria, blockers, and completion evidence.
- Code and repository docs own implementation and architectural truth.
- The orchestrator may cache task data for a run, but must write durable changes back to Beads.
- Search the current graph before creating tasks to avoid duplicates and stale parallel plans.

## Lifecycle

Use the native Beads flow:

1. Create a scoped task with acceptance criteria.
2. Link blockers and parent/child relationships.
3. Let `bd ready` determine whether work is claimable.
4. Atomically claim work with `bd update <id> --claim`.
5. Record progress, decisions, blockers, and artifacts while executing.
6. Close only after acceptance criteria and verification are satisfied.

Treat blocked work as an event that requires a reason and an unblock condition. Do not represent lifecycle state only with prose labels.

## Task Quality

Every implementation task should contain:

- a precise outcome and problem statement;
- independently verifiable acceptance criteria;
- type and priority;
- parent epic when part of a larger goal;
- dependency edges for required ordering;
- verification expectations;
- security, migration, documentation, rollout, or observability work when relevant.

Use priorities consistently: P0 is urgent/critical, P1 is high, P2 is normal, P3 is low, and P4 is backlog or someday work.

Use native issue types consistently: `bug`, `feature`, `task`, `epic`, `chore`, or `decision`. Classify refactors and research spikes with labels on a native type, for example `type:task` plus `refactor`, or `type:task` plus `spike`. Use domain labels such as `frontend`, `backend`, `infra`, `docs`, or `security` alongside those work-kind labels.

## Agent Responsibilities

### Planner

- Inspect the repository and current Beads graph before planning.
- Create or refine dependency-aware epics and tasks.
- Separate unknowns into tasks labeled `spike` and implementation into verifiable work.
- Limit task count and granularity to what improves coordination.

### Worker

- Claim an unblocked task before editing.
- Stay within its acceptance criteria and report material scope discoveries.
- Update status and notes with real progress rather than optimistic intent.
- Attach verification and delivery artifacts before closing.

### Reviewer or Orchestrator

- Verify lifecycle rules and acceptance criteria.
- Replan blocked or materially changed work.
- Prevent conflicting parallel assignments.
- Require evidence before considering a task done.

## Commands

```sh
bd prime
bd ping --json
bd ready --json
bd search "<query>" --status all --json
bd show <id> --json
bd create "<title>" -t task -p 2 --description "<problem>" --acceptance "<criteria>" --json
bd create "<child title>" -t task --parent <epic-id> --json
bd update <id> --claim
bd update <id> --status blocked
bd comment <id> "<progress, decision, blocker, or evidence>"
bd dep add <dependent-task> <blocking-task>
bd reopen <id> --reason "<reason>"
bd remember "<durable insight>"
bd close <id> "<verified outcome>"
bd status
```

Prefer `--json` whenever output is consumed by a script or agent tool.

`bd dep add A B` means A cannot become ready until B closes; the first argument is the dependent task and the second is its blocker. Hierarchy is separate: create a child with `--parent <epic-id>` or reparent it with `bd update <child-id> --parent <epic-id>`. Do not use parent/child wording for ordinary blocking edges.

When work is blocked by a tracked task, add the dependency edge and comment with the evidence and unblock condition. Use `--status blocked` for a genuine external or manual blocker that has no Beads task edge. Reopen incorrectly closed or regressed work with `bd reopen`, and correct inaccurate fields with `bd update` instead of creating a replacement task.

## Code and Delivery Linkage

- Include the Beads task ID in branch, commit, and PR naming when the repository permits it.
- Add PR, commit, CI, build, benchmark, migration, or deployment evidence to the task history.
- Do not transition or close work based only on an agent's narrative claim.
- After closing a task, query `bd ready` again because a dependency may have become available.

## Importing a Markdown Backlog

Use the generated importer instead of asking an agent to create a large batch directly. Node projects use:

```sh
pnpm beads:import-md PROJECT_TASKS.md
pnpm beads:import-md PROJECT_TASKS.md --apply
```

Flutter projects use `node scripts/import-beads-markdown.mjs PROJECT_TASKS.md` with the same flags.

Preview is the default. It writes `ai-docs/tmp/beads-import-<name>-<source-hash>.json` containing normalized tasks, source lines, fingerprints, hierarchy, explicit dependencies, skipped completed tasks, and eventual Beads IDs. Applying is an explicit second step.

Input rules:

- Only Markdown checkbox items are tasks: `- [ ]` or `- [x]`.
- Nested checkboxes become parent/child tasks.
- Indented non-checkbox bullets become acceptance criteria.
- Indented prose becomes task description context.
- Completed tasks are skipped unless `--include-completed` is passed.
- Imports stop above 200 tasks unless `--max-tasks <number>` is explicitly supplied.
- `[priority:...]` accepts P0 through P4. `[type:...]` accepts the native types `bug`, `feature`, `task`, `epic`, `chore`, and `decision`; express refactors and spikes as labels.

Optional inline annotations are removed from the final title:

```md
- [ ] Build authentication [type:feature] [priority:P1] [labels:backend,security]
  - Callback and failure paths are covered by tests.
- [ ] Build login UI [labels:frontend] [depends-on:Build authentication]
```

Fingerprints derive from the source path, heading path, normalized title, and occurrence. They are stored in Beads metadata so a reviewed import can be rerun without duplicating tasks created by a previous run. If a dependency annotation matches zero or multiple titles, the importer stops and requires the Markdown source to be corrected.

## Safety

- Do not put secrets, credentials, private URLs, personal data, or unredacted sensitive logs in Beads.
- Keep service credentials out of prompts and use the repository's secret-management boundary.
- Run `bd status` and `bd ping` before attempting manual repair of `.beads/` state.
- Do not edit the Beads database files directly.
