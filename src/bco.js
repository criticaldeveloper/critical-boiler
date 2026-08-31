import { existsSync } from "node:fs";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { FILES } from "./catalog.js";

export const BCO_AGENT_REGISTRY_MARKER =
  "# critical-boiler:bco-agent-registry:start";

const EXTENSIONS = {
  agents: {
    marker: "<!-- critical-boiler:bco-agents -->",
    content: `<!-- critical-boiler:bco-agents -->
## Native BCO Orchestration

- Better Codex Orchestrator (BCO) owns task truth, workflow claims, dependencies, evidence, completion, and cross-workflow continuation. Do not create a repository task database or a competing Markdown backlog.
- Use only the capability-scoped \`bco_task_*\` and \`bco_memory_list\` tools injected by BCO. Never connect directly to BCO persistence or request its credentials.
- BCO starts each workflow from an operator-created native task. Read the assigned task, dependencies, acceptance criteria, and bounded project memory before editing.
- \`developer_orchestrator\` is the root agent for the Complete Orchestration System. It routes frontend work to \`frontend_orchestrator\`, backend work to \`backend_orchestrator\`, and full-stack work to both through non-overlapping task ownership.
- Domain orchestrators delegate to their planner, coder, tester, reviewer, and documenter roles. Every workflow agent, including the root, returns task-scoped evidence and never selects or starts a project-global successor.
- Use the latest task version and a stable command ID for every permitted BCO mutation. On stale state, reread authoritative truth before deciding whether to retry.
- Attach exact verification, independent-review, commit, merge, and artifact evidence. Request completion only after acceptance criteria and the repository definition of done pass.
- After workflow settlement, BCO's dedicated read-only AI governor selects and persists the next NextWorkflowPlan independently. Experimental Brain changes automatic launch timing only; it grants no extra task, approval, permission, or execution authority.
- Read \`ai-docs/bco-task-management.md\`, \`ai-docs/bco-orchestration-policy.md\`, and \`ai-docs/bco-next-action-policy.md\` before BCO-managed work.
`,
  },
  aiDocs: {
    marker: "<!-- critical-boiler:bco-docs -->",
    content: `<!-- critical-boiler:bco-docs -->
## Better Codex Orchestrator

- \`bco-task-management.md\` owns native task lifecycle, capability, recovery, and evidence rules.
- \`bco-orchestration-policy.md\` owns role separation, verification, Git delivery, correction, and cleanup.
- \`bco-next-action-policy.md\` owns the dedicated AI-governor and Experimental Brain boundary.
- \`../.agents/skills/bco-task-orchestration/SKILL.md\` is the executable project workflow for BCO-managed tasks.
- The generated \`.codex/config.toml\`, role configurations, and role prompts declare the Complete Orchestration System. Register this project in BCO and select \`developer_orchestrator\` as its main orchestrator.
`,
  },
  commands: {
    marker: "<!-- critical-boiler:bco-commands -->",
    content: `<!-- critical-boiler:bco-commands -->
## BCO Operations

BCO is an external local control plane; this project has no repository-local BCO install, bootstrap, or task CLI. Register the project root in BCO, select \`developer_orchestrator\` as the main orchestrator, choose the native BCO task system, and create the initial tasks in BCO's integrated task manager. Repository verification commands remain the commands documented above.

When BCO starts a workflow, use only its injected capability-scoped task and memory tools. An unavailable BCO capability is an orchestration blocker, not permission to install fallback task tooling or update BCO's database directly.

Workflow agents finish the assigned work and return evidence; they do not launch another workflow. BCO's dedicated AI governor evaluates persisted terminal truth afterward.
`,
  },
  definitionOfDone: {
    marker: "<!-- critical-boiler:bco-definition-of-done -->",
    content: `<!-- critical-boiler:bco-definition-of-done -->
## BCO Completion Evidence

- The assigned native BCO task and acceptance criteria are satisfied.
- Focused verification and required integrated gates passed with exact command evidence.
- An independent reviewer checked the exact task commit and all findings are resolved or blocked explicitly.
- Documentation is synchronized with the implementation.
- The reviewed task branch is merged into the integration branch and the merged-tree gate passes.
- Verification, review, commit, merge, and artifact evidence is attached through BCO before completion is requested.
- All workflow agents return task-scoped evidence only. BCO's separate read-only AI governor owns project-global next-action selection.
`,
  },
};

export async function applyBcoExtensions(args) {
  if (!args.bcoEnhancement) return [];

  const targets = [
    ["agents", relativePath(args, "agents")],
    ["aiDocs", relativePath(args, "aiDocs")],
    ["commands", relativePath(args, "commands")],
    ["definitionOfDone", relativePath(args, "definitionOfDone")],
  ];
  const results = [];

  for (const [name, target] of targets) {
    const destination = path.join(args.cwd, target);
    const extension = EXTENSIONS[name];
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
        `${existing.length > 0 ? separator : ""}${extension.content}`,
        "utf8",
      );
    }

    results.push({ fileKey: name, action: "extend", path: target });
  }

  return results;
}

export function mergeBcoAgentRegistry(existing, generated) {
  if (existing.includes(BCO_AGENT_REGISTRY_MARKER)) return existing;

  const generatedAgentIds = Array.from(
    generated.matchAll(/^\s*\[agents\.([a-z0-9_]+)\]\s*$/gmu),
    (match) => match[1],
  );
  const conflicts = generatedAgentIds.filter((agentId) =>
    new RegExp(
      `^\\s*\\[agents\\.${escapeRegExp(agentId)}\\]\\s*(?:#.*)?$`,
      "mu",
    ).test(existing),
  );

  if (conflicts.length > 0) {
    throw new Error(
      `Could not safely add the BCO agent registry because these agent IDs already exist: ${conflicts.join(", ")}. Rename the existing declarations or rerun with --force to replace .codex/config.toml.`,
    );
  }

  if (existing.trim().length === 0) return generated;

  const newline = existing.includes("\r\n") ? "\r\n" : "\n";
  const normalizedGenerated = generated.replaceAll(/\r?\n/g, newline).trim();
  const separator = existing.endsWith("\n") ? newline : `${newline}${newline}`;
  return `${existing}${separator}${normalizedGenerated}${newline}`;
}

function relativePath(args, fileKey) {
  return args.paths?.[fileKey] ?? FILES[fileKey].path;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
