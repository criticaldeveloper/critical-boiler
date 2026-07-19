#!/usr/bin/env node
import { existsSync } from "node:fs";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extensions = [
  {
    path: "{{ agentsPath }}",
    marker: "<!-- critical-boiler:beads-agents -->",
    content: `## Beads Task Management

- This project uses Beads through the \`bd\` CLI as the authoritative task store.
- Invoke the \`beads-task-planning\` skill for planning, ticket creation, dependency changes, or coordinated execution.
- Before first use, follow the ordered bootstrap in \`ai-docs/commands.md\`: install dependencies, initialize Beads, prime context, then query ready work. Do not run \`bd prime\` before installation and setup succeed.
- Run \`bd prime\` at the start of a task-planning session and after context compaction.
- Search existing and closed tasks with \`bd search "<query>" --status all --json\` before creating one. Use dependency-aware task graphs with explicit acceptance criteria, not Markdown TODO lists.
- Use \`bd ready\` to find unblocked work, \`bd show <id>\` to inspect it, and \`bd update <id> --claim\` to claim it atomically.
- Planner agents may create and link tasks. Worker agents should claim, update, comment on, and close assigned tasks with concrete evidence.
- Record blockers with an explanation and the dependency or action that will unblock the task.
- Close tasks only after verification, then include PRs, commits, test output, or other artifacts in the task history.
- Read \`ai-docs/beads.md\` for the lifecycle, taxonomy, command conventions, and handoff policy.`,
  },
  {
    path: "{{ aiDocsPath }}",
    marker: "<!-- critical-boiler:beads-docs -->",
    content: `## Beads Task Planning

- \`beads.md\` is the project policy for task lifecycle, dependencies, evidence, and agent responsibilities.
- \`../.agents/skills/beads-task-planning/SKILL.md\` is the executable Codex workflow for planning and delivering Beads tasks.
- Beads is the source of truth for planned work. Do not create competing Markdown task lists.`,
  },
  {
    path: "{{ commandsPath }}",
    marker: "<!-- critical-boiler:beads-commands -->",
    content: `## Beads Commands

| Task | Command |
| --- | --- |
| Initialize or repair integration | \`{{ beadsSetupCommand }}\` |
| Override Beads executable discovery | \`BEADS_BIN=<path-to-bd-or-bd.js-or-bd.mjs>\` |
| Load agent context | \`{{ beadsPrimeCommand }}\` |
| List unblocked work | \`{{ beadsReadyCommand }}\` |
| Inspect task database status | \`{{ beadsStatusCommand }}\` |
| Check database connectivity | \`bd ping --json\` |
| Search open and closed tasks | \`bd search "<query>" --status all --json\` |
| Inspect a task | \`bd show <id>\` |
| Create a scoped task | \`bd create "<title>" --type task --priority P2 --description "<problem>" --acceptance "<criteria>" --json\` |
| Create a child under an epic | \`bd create "<child title>" --type task --parent <epic-id> --json\` |
| Atomically claim a task | \`bd update <id> --claim\` |
| Record an external/manual blocker | \`bd update <id> --status blocked\` |
| Record progress or evidence | \`bd comment <id> "<note>"\` |
| Add a blocking dependency | \`bd dep add <dependent-task> <blocking-task>\` |
| Correct task fields | \`bd update <id> <field flags>\` |
| Reopen work | \`bd reopen <id> --reason "<reason>"\` |
| Close verified work | \`bd close <id> "<reason>"\` |

Run first-time setup in this order: \`{{ beadsInstallCommand }}\`, \`{{ beadsSetupCommand }}\`, \`{{ beadsPrimeCommand }}\`, then \`{{ beadsReadyCommand }}\`. Critical Boiler does not install dependencies, create a lockfile, or initialize \`.beads/\` while generating files.

\`bd dep add A B\` means A depends on and is blocked by B. Parent/child hierarchy is separate and uses \`--parent\`. Use \`--json\` when a command's output is consumed by automation.

Both generated Beads scripts read \`BEADS_BIN\` before normal executable discovery. Set it to a native executable or a \`.js\`/\`.mjs\` launcher when Beads is installed in a non-standard location. Environment-variable syntax varies by shell.`,
  },
  {
    path: "{{ agentsPath }}",
    marker: "<!-- critical-boiler:beads-import-agents -->",
    content: `## Markdown Backlog Imports

- For a Markdown backlog, invoke the \`beads-task-planning\` skill and run the deterministic importer in preview mode first.
- Review \`ai-docs/tmp/beads-import-*.json\` before applying. Resolve ambiguous titles or dependencies in the source instead of guessing.
- Apply only with the explicit \`--apply\` flag. Stable fingerprints reconcile reruns with tasks created by earlier imports.`,
  },
  {
    path: "{{ commandsPath }}",
    marker: "<!-- critical-boiler:beads-import-commands -->",
    content: `## Markdown Backlog Import Commands

| Task | Command |
| --- | --- |
| Preview a Markdown backlog | \`{{ beadsImportCommand }}\` |
| Apply a reviewed import | \`{{ beadsImportApplyCommand }}\` |

The importer reads Markdown checkbox tasks, writes a review report under \`ai-docs/tmp/\`, preserves nesting, and supports \`[depends-on:Exact task title]\`, \`[priority:P1]\`, \`[type:bug]\`, and \`[labels:frontend,security]\` annotations.`,
  },
];

for (const extension of extensions) {
  const destination = path.join(root, extension.path);
  const existing = existsSync(destination)
    ? await readFile(destination, "utf8")
    : "";
  if (existing.includes(extension.marker)) continue;

  await mkdir(path.dirname(destination), { recursive: true });
  const separator =
    existing.length === 0 ? "" : existing.endsWith("\n") ? "\n" : "\n\n";
  await appendFile(
    destination,
    `${separator}${extension.marker}\n${extension.content}\n`,
    "utf8",
  );
}

const workspacePath = path.join(root, "pnpm-workspace.yaml");
if (existsSync(path.join(root, "package.json"))) {
  const workspace = existsSync(workspacePath)
    ? await readFile(workspacePath, "utf8")
    : "";
  const approval = /^\s*['"]?@beads\/bd['"]?\s*:\s*true\s*$/m;

  if (!approval.test(workspace)) {
    const newline = workspace.includes("\r\n") ? "\r\n" : "\n";
    const emptyInline = /^allowBuilds:\s*\{\s*\}\s*$/m;
    const header = /^allowBuilds:\s*$/m;
    const match = header.exec(workspace);
    let updated;

    if (emptyInline.test(workspace)) {
      updated = workspace.replace(
        emptyInline,
        `allowBuilds:${newline}  '@beads/bd': true`,
      );
    } else if (match) {
      const insertAt = match.index + match[0].length;
      updated = `${workspace.slice(
        0,
        insertAt,
      )}${newline}  '@beads/bd': true${workspace.slice(insertAt)}`;
    } else if (/^allowBuilds:/m.test(workspace)) {
      throw new Error(
        "Could not safely merge @beads/bd into inline allowBuilds in pnpm-workspace.yaml.",
      );
    } else {
      const separator =
        workspace.trim().length === 0 ? "" : `${newline}${newline}`;
      updated = `${workspace}${separator}allowBuilds:${newline}  '@beads/bd': true${newline}`;
    }

    await writeFile(workspacePath, updated, "utf8");
  }
}

if (!existsSync(path.join(root, ".beads"))) {
  const configured = process.env.BEADS_BIN;
  const configuredScript = configured?.toLowerCase().endsWith(".js") ||
    configured?.toLowerCase().endsWith(".mjs");
  const command = configured
    ? configuredScript ? process.execPath : configured
    : process.platform === "win32"
      ? (process.env.ComSpec ?? "cmd.exe")
      : "bd";
  const commandArgs = configured
    ? [...(configuredScript ? [configured] : []), "init", "--quiet", "--skip-agents"]
    : process.platform === "win32"
      ? ["/d", "/s", "/c", "bd init --quiet --skip-agents"]
      : ["init", "--quiet", "--skip-agents"];
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: "inherit",
  });

  if (result.error || result.status !== 0) {
    console.error(
      "Beads instructions were added, but `bd init` failed. Run `pnpm install`, or set BEADS_BIN to a native executable or .js/.mjs launcher, then rerun `pnpm beads:setup`.",
    );
    process.exitCode = 1;
  }
}
