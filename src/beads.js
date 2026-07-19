import { existsSync } from "node:fs";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { FILES } from "./catalog.js";

const EXTENSIONS = {
  agents: {
    marker: "<!-- critical-boiler:beads-agents -->",
    content: `<!-- critical-boiler:beads-agents -->
## Beads Task Management

- This project uses Beads through the \`bd\` CLI as the authoritative task store.
- Invoke the \`beads-task-planning\` skill for planning, ticket creation, dependency changes, or coordinated execution.
- Before first use, follow the ordered bootstrap in \`ai-docs/commands.md\`: install dependencies, initialize Beads, prime context, then query ready work. Do not run \`bd prime\` before installation and setup succeed.
- Run \`bd prime\` at the start of a task-planning session and after context compaction.
- Search existing and closed tasks with \`bd search "<query>" --status all --json\` before creating one. Use dependency-aware task graphs with explicit acceptance criteria, not Markdown TODO lists.
- Use \`bd ready\` to find unblocked work, \`bd show <id>\` to inspect it, and \`bd update <id> --claim\` to claim it atomically.
- Planner agents may create and link tasks. Worker agents should claim, update, comment on, and close assigned tasks with concrete evidence.
- Record blockers with an explanation and the dependency or action that will unblock the task.
- Close tasks only after verification, then include PRs, commits, test output, or other artifacts in the task history.
- Read \`ai-docs/beads.md\` for the lifecycle, taxonomy, command conventions, and handoff policy.
`,
  },
  aiDocs: {
    marker: "<!-- critical-boiler:beads-docs -->",
    content: `<!-- critical-boiler:beads-docs -->
## Beads Task Planning

- \`beads.md\` is the project policy for task lifecycle, dependencies, evidence, and agent responsibilities.
- \`../.agents/skills/beads-task-planning/SKILL.md\` is the executable Codex workflow for planning and delivering Beads tasks.
- Beads is the source of truth for planned work. Do not create competing Markdown task lists.
`,
  },
  commands: {
    marker: "<!-- critical-boiler:beads-commands -->",
    content: (args) => `<!-- critical-boiler:beads-commands -->
## Beads Commands

| Task | Command |
| --- | --- |
| Initialize or repair project integration | \`${beadsCommand(args, "setup")}\` |
| Override Beads executable discovery | \`BEADS_BIN=<path-to-bd-or-bd.js-or-bd.mjs>\` |
| Load agent workflow context | \`${beadsCommand(args, "prime")}\` |
| List unblocked work | \`${beadsCommand(args, "ready")}\` |
| Inspect task database status | \`${beadsCommand(args, "status")}\` |
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

Run first-time setup in this order: \`${beadsInstallCommand(args)}\`, \`${beadsCommand(args, "setup")}\`, \`${beadsCommand(args, "prime")}\`, then \`${beadsCommand(args, "ready")}\`. Critical Boiler does not install dependencies, create a lockfile, or initialize \`.beads/\` while generating files.

\`bd dep add A B\` means A depends on and is blocked by B. Parent/child hierarchy is separate and uses \`--parent\`. Use \`--json\` when a command's output is consumed by automation.

Both generated Beads scripts read \`BEADS_BIN\` before normal executable discovery. Set it to a native executable or a \`.js\`/\`.mjs\` launcher when Beads is installed in a non-standard location. Environment-variable syntax varies by shell.
`,
  },
  agentsImport: {
    marker: "<!-- critical-boiler:beads-import-agents -->",
    content: `<!-- critical-boiler:beads-import-agents -->
## Markdown Backlog Imports

- For a Markdown backlog, invoke the \`beads-task-planning\` skill and run the deterministic importer in preview mode first.
- Review \`ai-docs/tmp/beads-import-*.json\` before applying. Resolve ambiguous titles or dependencies in the source instead of guessing.
- Apply only with the explicit \`--apply\` flag. Stable fingerprints reconcile reruns with tasks created by earlier imports.
`,
  },
  commandsImport: {
    marker: "<!-- critical-boiler:beads-import-commands -->",
    content: (args) => `<!-- critical-boiler:beads-import-commands -->
## Markdown Backlog Import Commands

| Task | Command |
| --- | --- |
| Preview a Markdown backlog | \`${beadsImportCommand(args, false)}\` |
| Apply a reviewed import | \`${beadsImportCommand(args, true)}\` |

The importer reads Markdown checkbox tasks, writes a review report under \`ai-docs/tmp/\`, preserves nesting, and supports \`[depends-on:Exact task title]\`, \`[priority:P1]\`, \`[type:bug]\`, and \`[labels:frontend,security]\` annotations.
`,
  },
};

export async function applyBeadsExtensions(args) {
  if (!args.beads) return [];

  const targets = [
    ["agents", relativePath(args, "agents")],
    ["aiDocs", relativePath(args, "aiDocs")],
    ["commands", relativePath(args, "commands")],
    ["agentsImport", relativePath(args, "agents")],
    ["commandsImport", relativePath(args, "commands")],
  ];
  const results = [];

  for (const [name, target] of targets) {
    const destination = path.join(args.cwd, target);
    const extension = EXTENSIONS[name];
    const content =
      typeof extension.content === "function"
        ? extension.content(args)
        : extension.content;
    const existing = existsSync(destination)
      ? await readFile(destination, "utf8")
      : "";

    if (existing.includes(extension.marker)) {
      results.push({ fileKey: name, action: "skip", path: target });
      continue;
    }

    if (!args.dryRun) {
      await mkdir(path.dirname(destination), { recursive: true });
      const separator =
        existing.length > 0 && !existing.endsWith("\n") ? "\n\n" : "\n";
      await appendFile(
        destination,
        `${existing.length > 0 ? separator : ""}${content}`,
        "utf8",
      );
    }

    results.push({ fileKey: name, action: "extend", path: target });
  }

  if (!args.tech.includes("flutter")) {
    results.push(await allowBeadsBuild(args));
  }

  return results;
}

async function allowBeadsBuild(args) {
  const target = "pnpm-workspace.yaml";
  const destination = path.join(args.cwd, target);
  const exists = existsSync(destination);
  const existing = exists ? await readFile(destination, "utf8") : "";
  const merged = mergeBeadsBuildApproval(existing);

  if (merged === existing) {
    return { fileKey: "beadsPnpmApproval", action: "skip", path: target };
  }

  if (!args.dryRun) await writeFile(destination, merged, "utf8");
  return {
    fileKey: "beadsPnpmApproval",
    action: exists ? "extend" : "create",
    path: target,
  };
}

export function mergeBeadsBuildApproval(raw) {
  if (/^\s*['"]?@beads\/bd['"]?\s*:\s*true\s*$/m.test(raw)) return raw;

  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const block = `allowBuilds:${newline}  '@beads/bd': true${newline}`;
  if (raw.trim().length === 0) return block;

  const emptyInline = /^allowBuilds:\s*\{\s*\}\s*$/m;
  if (emptyInline.test(raw)) return raw.replace(emptyInline, block.trimEnd());

  const header = /^allowBuilds:\s*$/m;
  const match = header.exec(raw);
  if (match) {
    const insertAt = match.index + match[0].length;
    return `${raw.slice(0, insertAt)}${newline}  '@beads/bd': true${raw.slice(
      insertAt,
    )}`;
  }

  if (/^allowBuilds:/m.test(raw)) {
    throw new Error(
      "Could not safely merge @beads/bd into inline allowBuilds in pnpm-workspace.yaml.",
    );
  }

  const separator = raw.endsWith("\n")
    ? newline
    : `${newline}${newline}`;
  return `${raw}${separator}${block}`;
}

function relativePath(args, fileKey) {
  return args.paths?.[fileKey] ?? FILES[fileKey].path;
}

function beadsCommand(args, command) {
  if (!args.tech.includes("flutter")) return `pnpm beads:${command}`;
  if (command === "setup") return "node scripts/setup-beads.mjs";
  return `bd ${command}`;
}

function beadsInstallCommand(args) {
  return args.tech.includes("flutter")
    ? "npm install -g @beads/bd"
    : "pnpm install";
}

function beadsImportCommand(args, apply) {
  const base = args.tech.includes("flutter")
    ? "node scripts/import-beads-markdown.mjs <file.md>"
    : "pnpm beads:import-md <file.md>";
  return apply ? `${base} --apply` : base;
}
