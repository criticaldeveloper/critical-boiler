import { existsSync } from "node:fs";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BCO_CONTRACT_VERSION, FILES } from "./catalog.js";

export const BCO_AGENT_REGISTRY_MARKER =
  "# critical-boiler:bco-agent-registry:start";
export const BCO_AGENT_REGISTRY_END_MARKER =
  "# critical-boiler:bco-agent-registry:end";

const EXTENSIONS = {
  agents: {
    legacyMarker: "<!-- critical-boiler:bco-agents -->",
    legacyEnd:
      "- Read `ai-docs/bco-task-management.md`, `ai-docs/bco-orchestration-policy.md`, and `ai-docs/bco-next-action-policy.md` before BCO-managed work.",
    startMarker: "<!-- critical-boiler:bco-agents:start -->",
    endMarker: "<!-- critical-boiler:bco-agents:end -->",
    content: `<!-- critical-boiler:bco-agents:start -->
<!-- critical-boiler:bco-contract:${BCO_CONTRACT_VERSION} -->
## Native BCO Orchestration

- Better Codex Orchestrator (BCO) owns task truth, workflow claims, dependencies, evidence, completion, and cross-workflow continuation. Do not create a repository task database or a competing Markdown backlog.
- Use only the capability-scoped \`bco_task_*\` and \`bco_memory_list\` tools injected by BCO. Never connect directly to BCO persistence or request its credentials.
- Bootstrap or replan native tasks with \`$bco-project-planning\`; no task is automation-ready until its native dependency edges, verification, and required capabilities validate in BCO.
- BCO starts each workflow from an operator-confirmed native task. Read the assigned task, dependencies, acceptance criteria, and bounded project memory before editing.
- \`developer_orchestrator\` is the root agent for the Complete Orchestration System. It routes frontend work to \`frontend_orchestrator\`, backend work to \`backend_orchestrator\`, and full-stack work to both through non-overlapping task ownership.
- Domain orchestrators enforce one active specialist phase by default: plan, implement, document, verify, independently review, correct if needed, integrate, and verify the merged tree. Tester, reviewer, and documenter work must never start from a tree that an implementation writer can still invalidate.
- Assign exact path ownership and one owner for build, E2E, codegen, formatter, browser-server, and other shared commands. Do not run those resources concurrently.
- Every workflow agent, including the root, returns task-scoped evidence and never selects or starts a project-global successor.
- Use the latest task version and a stable command ID for every permitted BCO mutation. On stale state, reread authoritative truth before deciding whether to retry.
- Attach exact verification, independent-review, commit, merge, and artifact evidence. Request completion only after acceptance criteria and the repository definition of done pass.
- After workflow settlement, BCO's dedicated read-only AI governor selects and persists the next NextWorkflowPlan independently. Experimental Brain changes automatic launch timing only; it grants no extra task, approval, permission, or execution authority.
- Read \`ai-docs/bco-task-management.md\`, \`ai-docs/bco-orchestration-policy.md\`, \`ai-docs/bco-automation-readiness.md\`, and \`ai-docs/bco-next-action-policy.md\` before BCO-managed work.
<!-- critical-boiler:bco-agents:end -->
`,
  },
  aiDocs: {
    legacyMarker: "<!-- critical-boiler:bco-docs -->",
    legacyEnd:
      "- The generated `.codex/config.toml`, role configurations, and role prompts declare the Complete Orchestration System. Register this project in BCO and select `developer_orchestrator` as its main orchestrator.",
    startMarker: "<!-- critical-boiler:bco-docs:start -->",
    endMarker: "<!-- critical-boiler:bco-docs:end -->",
    content: `<!-- critical-boiler:bco-docs:start -->
<!-- critical-boiler:bco-contract:${BCO_CONTRACT_VERSION} -->
## Better Codex Orchestrator

- \`bco-task-management.md\` owns native task lifecycle, capability, recovery, and evidence rules.
- \`bco-project-planning.md\` owns backlog dependency, acceptance, capability, and operator-confirmation rules.
- \`bco-orchestration-policy.md\` owns declared specialist phases, ownership, verification, Git delivery, correction, and cleanup.
- \`bco-automation-readiness.md\` owns the generated contract version and capability/resource readiness declaration.
- [\`bco-next-action-policy.md\`](bco-next-action-policy.md) owns the dedicated AI-governor and Experimental Brain boundary.
- \`../.agents/skills/bco-task-orchestration/SKILL.md\` is the executable project workflow for BCO-managed tasks.
- \`../.agents/skills/bco-project-planning/SKILL.md\` prepares or validates operator-authorized native BCO project plans.
- The generated \`.codex/config.toml\`, role configurations, and role prompts declare the Complete Orchestration System. Register this project in BCO and select \`developer_orchestrator\` as its main orchestrator.
<!-- critical-boiler:bco-docs:end -->
`,
  },
  commands: {
    legacyMarker: "<!-- critical-boiler:bco-commands -->",
    legacyEnd:
      "Workflow agents finish the assigned work and return evidence; they do not launch another workflow. BCO's dedicated AI governor evaluates persisted terminal truth afterward.",
    startMarker: "<!-- critical-boiler:bco-commands:start -->",
    endMarker: "<!-- critical-boiler:bco-commands:end -->",
    content: `<!-- critical-boiler:bco-commands:start -->
<!-- critical-boiler:bco-contract:${BCO_CONTRACT_VERSION} -->
## BCO Operations

BCO is an external local control plane; this project has no repository-local BCO install, bootstrap, or task CLI. Register the project root in BCO, select \`developer_orchestrator\` as the main orchestrator, and choose the native BCO task system. Use \`$bco-project-planning\` to prepare or validate the initial native task graph, then confirm and apply it through capabilities actually exposed by BCO or manually in its integrated task manager. Repository verification commands remain the commands documented above.

When BCO starts a workflow, use only its injected capability-scoped task and memory tools. An unavailable BCO capability is an orchestration blocker, not permission to install fallback task tooling or update BCO's database directly.

The tester owns final verification and the lifecycle of any browser server it starts. Build, E2E, formatter, codegen, preview-server, and migration commands run under one explicit resource owner at a time.

Workflow agents finish the assigned work and return evidence; they do not launch another workflow. BCO's dedicated AI governor evaluates persisted terminal truth afterward.
<!-- critical-boiler:bco-commands:end -->
`,
  },
  definitionOfDone: {
    legacyMarker: "<!-- critical-boiler:bco-definition-of-done -->",
    legacyEnd:
      "- All workflow agents return task-scoped evidence only. BCO's separate read-only AI governor owns project-global next-action selection.",
    startMarker: "<!-- critical-boiler:bco-definition-of-done:start -->",
    endMarker: "<!-- critical-boiler:bco-definition-of-done:end -->",
    content: `<!-- critical-boiler:bco-definition-of-done:start -->
<!-- critical-boiler:bco-contract:${BCO_CONTRACT_VERSION} -->
## BCO Completion Evidence

- The assigned native BCO task and acceptance criteria are satisfied.
- Required repository and external capabilities were declared available, or the task was blocked before implementation.
- Focused verification ran on a stable tree with no active implementation writer and passed with exact command evidence.
- An independent reviewer checked the same exact task commit after verification and all findings are resolved or blocked explicitly.
- Documentation is synchronized with the implementation.
- The reviewed task branch is merged into the integration branch and the merged-tree gate passes.
- Verification, review, commit, merge, and artifact evidence is attached through BCO before completion is requested.
- All workflow agents return task-scoped evidence only. BCO's separate read-only AI governor owns project-global next-action selection.
<!-- critical-boiler:bco-definition-of-done:end -->
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

    if (existing.includes(extension.startMarker)) {
      if (!args.bcoSync) {
        results.push({ fileKey: name, action: "skip", path: target });
        continue;
      }

      const updated = replaceManagedSection(
        existing,
        extension.content,
        extension.startMarker,
        extension.endMarker,
        target,
      );
      if (!args.dryRun) await writeFile(destination, updated, "utf8");
      results.push({ fileKey: name, action: "overwrite", path: target });
      continue;
    }

    if (args.bcoSync && existing.includes(extension.legacyMarker)) {
      const updated = replaceManagedSection(
        existing,
        extension.content,
        extension.legacyMarker,
        extension.legacyEnd,
        target,
      );
      if (!args.dryRun) await writeFile(destination, updated, "utf8");
      results.push({ fileKey: name, action: "overwrite", path: target });
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

export function mergeBcoAgentRegistry(
  existing,
  generated,
  { replaceManaged = false } = {},
) {
  if (existing.includes(BCO_AGENT_REGISTRY_MARKER)) {
    return replaceManaged
      ? replaceManagedSection(
          existing,
          generated,
          BCO_AGENT_REGISTRY_MARKER,
          BCO_AGENT_REGISTRY_END_MARKER,
          FILES.bcoAgentRegistry.path,
        )
      : existing;
  }

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

function replaceManagedSection(
  existing,
  generated,
  startMarker,
  endMarker,
  target,
) {
  const start = existing.indexOf(startMarker);
  const end = existing.indexOf(endMarker, start + startMarker.length);

  if (start < 0 || end < 0) {
    throw new Error(
      `Could not safely sync ${target} because its Critical Boiler-managed BCO section is incomplete. Restore both managed markers or review the file manually.`,
    );
  }

  const newline = existing.includes("\r\n") ? "\r\n" : "\n";
  const replacement = generated.replaceAll(/\r?\n/g, newline).trimEnd();
  return `${existing.slice(0, start)}${replacement}${existing.slice(
    end + endMarker.length,
  )}`;
}

function relativePath(args, fileKey) {
  return args.paths?.[fileKey] ?? FILES[fileKey].path;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
