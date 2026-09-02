import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs, resolveArgs, validateOptions } from "../src/args.js";
import {
  BCO_CONTRACT_VERSION,
  BCO_PROJECT_PLAN_SCHEMA_VERSION,
  BCO_TASK_ADOPTION_SCHEMA_VERSION,
  BCO_ORCHESTRATION_SYSTEMS,
  DEFAULT_ARGS,
  DEFAULT_BCO_ORCHESTRATION,
  FILES,
} from "../src/catalog.js";
import {
  applyBcoExtensions,
  BCO_AGENT_REGISTRY_MARKER,
  mergeBcoAgentRegistry,
} from "../src/bco.js";
import { selectedFileKeys } from "../src/project-plan.js";
import { writeProjectFile } from "../src/templates.js";

test("BCO enhancement is disabled by default", async (t) => {
  const root = await createFixture(t);
  const { args: cliArgs, provided } = parseArgs(["--cwd", root]);
  const args = await resolveArgs(cliArgs, provided);

  validateOptions(args);
  assert.equal(args.bcoEnhancement, false);
  assert.equal(args.bcoOrchestration, undefined);

  const selected = selectedFileKeys(args);
  for (const fileKey of BCO_ORCHESTRATION_SYSTEMS.complete.fileKeys) {
    assert.equal(selected.includes(fileKey), false);
  }
  assert.deepEqual(await applyBcoExtensions(args), []);
});

test("BCO enhancement selects the complete orchestration system", async (t) => {
  const root = await createFixture(t);
  const { args: cliArgs, provided } = parseArgs([
    "--cwd",
    root,
    "--bco-enhancement",
  ]);
  const args = await resolveArgs(cliArgs, provided);

  validateOptions(args);
  assert.equal(args.bcoEnhancement, true);
  assert.equal(args.bcoOrchestration, DEFAULT_BCO_ORCHESTRATION);

  const selected = selectedFileKeys(args);
  for (const fileKey of BCO_ORCHESTRATION_SYSTEMS.complete.fileKeys) {
    assert.equal(selected.includes(fileKey), true, fileKey);
  }
});

test("the orchestration option enables BCO and rejects unknown systems", async (t) => {
  const root = await createFixture(t);
  const parsed = parseArgs([
    "--cwd",
    root,
    "--bco-orchestration",
    "complete",
  ]);
  const args = await resolveArgs(parsed.args, parsed.provided);

  assert.equal(args.bcoEnhancement, true);
  assert.equal(args.bcoOrchestration, "complete");
  validateOptions(args);

  assert.throws(
    () => validateOptions({ ...args, bcoOrchestration: "unknown" }),
    /Unknown BCO orchestration system/u,
  );
});

test("BCO sync enables the enhancement and selects only managed BCO files", async (t) => {
  const root = await createFixture(t);
  const parsed = parseArgs(["--cwd", root, "--bco-sync"]);
  const args = await resolveArgs(parsed.args, parsed.provided);

  validateOptions(args);
  assert.equal(args.bcoEnhancement, true);
  assert.equal(args.bcoSync, true);
  assert.deepEqual(
    selectedFileKeys(args),
    BCO_ORCHESTRATION_SYSTEMS.complete.fileKeys,
  );
  assert.equal(selectedFileKeys(args).includes("packageJson"), false);
  assert.equal(selectedFileKeys(args).includes("architecture"), false);
});

test("complete orchestration generates versioned BCO contracts and thirteen agent roles", async (t) => {
  const root = await createFixture(t);
  const args = templateArgs(root);

  for (const fileKey of selectedFileKeys(args)) {
    await writeProjectFile(args, fileKey);
  }
  await applyBcoExtensions(args);
  await applyBcoExtensions(args);

  const registry = await readFile(path.join(root, ".codex", "config.toml"), "utf8");
  const agentTables = registry.match(/^\[agents\.[a-z0-9_]+\]$/gmu) ?? [];
  assert.equal(agentTables.length, 13);
  assert.match(registry, /\[agents\.developer_orchestrator\]/u);
  assert.match(registry, /config_file = "agents\/frontend-coder\.toml"/u);
  assert.equal(count(registry, BCO_AGENT_REGISTRY_MARKER), 1);

  for (const fileKey of BCO_ORCHESTRATION_SYSTEMS.complete.fileKeys) {
    const target = path.join(root, FILES[fileKey].path);
    const contents = await readFile(target, "utf8");
    assert.doesNotMatch(contents, /\{\{/u, fileKey);
  }

  const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
  const aiDocs = await readFile(path.join(root, "ai-docs", "README.md"), "utf8");
  const commands = await readFile(
    path.join(root, "ai-docs", "commands.md"),
    "utf8",
  );
  const definitionOfDone = await readFile(
    path.join(root, "ai-docs", "definition-of-done.md"),
    "utf8",
  );
  const rootPrompt = await readFile(
    path.join(
      root,
      ".codex",
      "prompts",
      "agents",
      "developer-orchestrator.md",
    ),
    "utf8",
  );
  const frontendOrchestratorPrompt = await readFile(
    path.join(
      root,
      ".codex",
      "prompts",
      "agents",
      "frontend-orchestrator.md",
    ),
    "utf8",
  );
  const backendOrchestratorPrompt = await readFile(
    path.join(
      root,
      ".codex",
      "prompts",
      "agents",
      "backend-orchestrator.md",
    ),
    "utf8",
  );
  const frontendTesterPrompt = await readFile(
    path.join(root, ".codex", "prompts", "agents", "frontend-tester.md"),
    "utf8",
  );
  const frontendReviewerPrompt = await readFile(
    path.join(root, ".codex", "prompts", "agents", "frontend-reviewer.md"),
    "utf8",
  );

  assert.equal(count(agents, "<!-- critical-boiler:bco-agents:start -->"), 1);
  assert.equal(count(aiDocs, "<!-- critical-boiler:bco-docs:start -->"), 1);
  assert.equal(count(commands, "<!-- critical-boiler:bco-commands:start -->"), 1);
  assert.equal(
    count(
      definitionOfDone,
      "<!-- critical-boiler:bco-definition-of-done:start -->",
    ),
    1,
  );
  assert.match(agents, /Experimental Brain changes automatic launch timing only/u);
  assert.match(agents, /dedicated read-only AI governor/u);
  assert.match(agents, /Only operator\/governor authority classifies authority-conflict/u);
  assert.match(commands, /select `developer_orchestrator` as the main orchestrator/u);
  assert.match(rootPrompt, /never select, propose, claim, or start a successor/u);
  assert.match(rootPrompt, /story-finalization intent/u);
  assert.match(rootPrompt, /Do not enumerate or mutate child tasks, delegate, or write files/u);
  assert.match(frontendOrchestratorPrompt, /role policy constrains roles that appear/u);
  assert.match(frontendOrchestratorPrompt, /Story finalization is root-owned/u);
  assert.match(backendOrchestratorPrompt, /role policy constrains roles that appear/u);
  assert.match(backendOrchestratorPrompt, /Story finalization is root-owned/u);
  assert.match(backendOrchestratorPrompt, /Preserve planner row IDs/u);
  assert.match(frontendTesterPrompt, /return `not_ready` rather than calling an unmapped matrix complete/u);
  assert.match(frontendReviewerPrompt, /broad green suites do not close an unmapped row/u);
  assert.match(definitionOfDone, /For non-delivery container finalization/u);

  const policy = await readFile(
    path.join(root, "ai-docs", "bco-orchestration-policy.md"),
    "utf8",
  );
  const readiness = await readFile(
    path.join(root, "ai-docs", "bco-automation-readiness.md"),
    "utf8",
  );
  const planningSkill = await readFile(
    path.join(root, ".agents", "skills", "bco-project-planning", "SKILL.md"),
    "utf8",
  );
  const plannerConfig = await readFile(
    path.join(root, ".codex", "agents", "frontend-planner.toml"),
    "utf8",
  );
  const taskSkill = await readFile(
    path.join(root, ".agents", "skills", "bco-task-orchestration", "SKILL.md"),
    "utf8",
  );
  const taskManagement = await readFile(
    path.join(root, "ai-docs", "bco-task-management.md"),
    "utf8",
  );
  const nextActionPolicy = await readFile(
    path.join(root, "ai-docs", "bco-next-action-policy.md"),
    "utf8",
  );

  assert.match(policy, /Only one specialist phase is active in a domain by default/u);
  assert.match(policy, /Tester, reviewer, and documenter phases never overlap/u);
  assert.match(policy, /admission-control backstop/u);
  assert.match(policy, /Workflow agents never create or clear `authority-conflict`/u);
  assert.match(policy, /test file, assertion, and command outcome per row/u);
  assert.match(policy, /Do not enumerate or mutate child tasks, launch specialists, or write files/u);
  assert.match(readiness, new RegExp(`contract version: \`${BCO_CONTRACT_VERSION}\``, "u"));
  assert.match(readiness, /critical-boiler --bco-sync/u);
  assert.match(readiness, /Claims, lifecycle changes, status reasons, comments, evidence/u);
  assert.match(readiness, /operator-owned project-plan authority/u);
  assert.match(planningSkill, /Say `draft_only`/u);
  assert.match(planningSkill, /automation-readiness report/u);
  assert.match(taskSkill, /it is not a launch roster/u);
  assert.match(taskSkill, /spent repair wave stays `in-progress` with evidence/u);
  assert.match(taskSkill, /For story-finalization workflows/u);
  assert.match(taskManagement, /Automation-contract preview, validation, apply, and supersede remain operator-only/u);
  assert.match(taskManagement, /BCO admits story finalization only after validating/u);
  assert.match(nextActionPolicy, /operator action for \*\*Prepare automation\*\*/u);
  const planningContract = await readFile(
    path.join(
      root,
      ".agents",
      "skills",
      "bco-project-planning",
      "references",
      "task-contract.md",
    ),
    "utf8",
  );
  assert.match(
    planningContract,
    new RegExp(`Use schema version \`${BCO_PROJECT_PLAN_SCHEMA_VERSION}\``, "u"),
  );
  assert.match(
    planningContract,
    new RegExp(`Use schema version \`${BCO_TASK_ADOPTION_SCHEMA_VERSION}\``, "u"),
  );
  assert.match(planningContract, /"blockedByKeys"/u);
  assert.match(planningContract, /"operation": "adopt-existing"/u);
  assert.match(planningContract, /rejects partial or stale adoption atomically/u);
  assert.match(planningContract, /admission-control contract for observed roles/u);
  assert.match(planningContract, /"role": "frontend_planner"/u);
  assert.match(planningContract, /"afterRoles": \["frontend_coder"\]/u);
  assert.doesNotMatch(planningContract, /"role": "planner"/u);
  assert.match(planningContract, /container finalization task should not declare a specialist pipeline/u);
  assert.match(plannerConfig, /sandbox_mode = "read-only"/u);
});

test("generated BCO routing stays within bounded context budgets", async (t) => {
  const root = await createFixture(t);
  const args = {
    ...templateArgs(root),
    projectType: "webApplication",
    tech: ["typescript", "react", "scss"],
  };

  for (const fileKey of selectedFileKeys(args)) {
    if (fileKey === "packageJson") continue;
    await writeProjectFile(args, fileKey);
  }
  await applyBcoExtensions(args);

  const routes = {
    alwaysLoaded: ["AGENTS.md"],
    developer: [
      "AGENTS.md",
      ".agents/skills/bco-task-orchestration/SKILL.md",
      "ai-docs/bco-task-management.md",
      "ai-docs/bco-orchestration-policy.md",
      "ai-docs/bco-next-action-policy.md",
      ".codex/prompts/agents/developer-orchestrator.md",
    ],
    frontend: [
      "AGENTS.md",
      ".agents/skills/bco-task-orchestration/SKILL.md",
      "ai-docs/bco-task-management.md",
      "ai-docs/bco-orchestration-policy.md",
      "ai-docs/bco-automation-readiness.md",
      "ai-docs/architecture.md",
      "ai-docs/commands.md",
      ".codex/prompts/agents/frontend-orchestrator.md",
    ],
    backend: [
      "AGENTS.md",
      ".agents/skills/bco-task-orchestration/SKILL.md",
      "ai-docs/bco-task-management.md",
      "ai-docs/bco-orchestration-policy.md",
      "ai-docs/bco-automation-readiness.md",
      "ai-docs/architecture.md",
      "ai-docs/commands.md",
      ".codex/prompts/agents/backend-orchestrator.md",
    ],
  };
  const limits = { alwaysLoaded: 1_800, developer: 5_000, frontend: 5_400, backend: 5_400 };

  for (const [route, files] of Object.entries(routes)) {
    let words = 0;
    for (const file of files) {
      words += countWords(await readFile(path.join(root, file), "utf8"));
    }
    assert.ok(words <= limits[route], `${route} routing uses ${words}/${limits[route]} words`);
  }
});

test("BCO sync refreshes managed assets without overwriting project files", async (t) => {
  const root = await createFixture(t);
  const initialArgs = templateArgs(root);

  for (const fileKey of selectedFileKeys(initialArgs)) {
    await writeProjectFile(initialArgs, fileKey);
  }
  await applyBcoExtensions(initialArgs);

  const promptPath = path.join(
    root,
    ".codex",
    "prompts",
    "agents",
    "frontend-orchestrator.md",
  );
  const architecturePath = path.join(root, "ai-docs", "architecture.md");
  const agentsPath = path.join(root, "AGENTS.md");
  await writeFile(promptPath, "stale managed prompt\n", "utf8");
  await writeFile(architecturePath, "operator architecture notes\n", "utf8");
  await writeFile(
    agentsPath,
    (await readFile(agentsPath, "utf8")).replace(
      "Role policies constrain specialists that actually appear",
      "stale phase contract",
    ),
    "utf8",
  );

  const syncArgs = { ...initialArgs, bcoSync: true };
  for (const fileKey of selectedFileKeys(syncArgs)) {
    await writeProjectFile(syncArgs, fileKey);
  }
  await applyBcoExtensions(syncArgs);

  assert.match(await readFile(promptPath, "utf8"), /Default to one active specialist phase/u);
  assert.equal(
    await readFile(architecturePath, "utf8"),
    "operator architecture notes\n",
  );
  assert.doesNotMatch(await readFile(agentsPath, "utf8"), /stale phase contract/u);
  assert.match(
    await readFile(agentsPath, "utf8"),
    /Role policies constrain specialists that actually appear/u,
  );
  assert.equal(
    count(
      await readFile(agentsPath, "utf8"),
      "<!-- critical-boiler:bco-agents:start -->",
    ),
    1,
  );
});

test("BCO sync upgrades legacy unbounded extensions without losing later content", async (t) => {
  const root = await createFixture(t);
  const agentsPath = path.join(root, "AGENTS.md");
  const legacyEnd =
    "- Read `ai-docs/bco-task-management.md`, `ai-docs/bco-orchestration-policy.md`, and `ai-docs/bco-next-action-policy.md` before BCO-managed work.";
  await writeFile(
    agentsPath,
    `operator prefix\n\n<!-- critical-boiler:bco-agents -->\n## Native BCO Orchestration\n${legacyEnd}\n\noperator suffix\n`,
    "utf8",
  );

  await applyBcoExtensions({ ...templateArgs(root), bcoSync: true });
  const upgraded = await readFile(agentsPath, "utf8");

  assert.match(upgraded, /^operator prefix/u);
  assert.match(upgraded, /<!-- critical-boiler:bco-agents:start -->/u);
  assert.doesNotMatch(upgraded, /<!-- critical-boiler:bco-agents -->/u);
  assert.match(upgraded, /operator suffix\n$/u);
});

test("BCO registry merge preserves existing Codex config and is idempotent", async (t) => {
  const root = await createFixture(t);
  const args = templateArgs(root);
  const registryKey = "bcoAgentRegistry";
  const registryPath = path.join(root, FILES[registryKey].path);
  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(
    registryPath,
    "model = \"gpt-5.6-terra\"\n\n[features]\nexample = true\n",
  );

  const first = await writeProjectFile(args, registryKey);
  const second = await writeProjectFile(args, registryKey);
  const merged = await readFile(registryPath, "utf8");

  assert.equal(first.action, "extend");
  assert.equal(second.action, "skip");
  assert.match(merged, /^model = "gpt-5\.6-terra"/u);
  assert.equal(count(merged, BCO_AGENT_REGISTRY_MARKER), 1);
});

test("BCO registry merge fails on conflicting agent IDs", () => {
  const generated = `${BCO_AGENT_REGISTRY_MARKER}\n[agents.developer_orchestrator]\nconfig_file = "agents/developer-orchestrator.toml"\n`;
  const existing =
    "[agents.developer_orchestrator]\nconfig_file = \"custom/root.toml\"\n";

  assert.throws(
    () => mergeBcoAgentRegistry(existing, generated),
    /developer_orchestrator/u,
  );
});

test("BCO registry sync replaces only its bounded managed section", () => {
  const generated = `${BCO_AGENT_REGISTRY_MARKER}\n# generated\n# critical-boiler:bco-agent-registry:end\n`;
  const existing = `model = "custom"\n\n${BCO_AGENT_REGISTRY_MARKER}\n# stale\n# critical-boiler:bco-agent-registry:end\n\n[features]\nexample = true\n`;
  const merged = mergeBcoAgentRegistry(existing, generated, {
    replaceManaged: true,
  });

  assert.match(merged, /^model = "custom"/u);
  assert.match(merged, /# generated/u);
  assert.doesNotMatch(merged, /# stale/u);
  assert.match(merged, /\[features\]\nexample = true/u);
});

async function createFixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "critical-boiler-bco-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  return root;
}

function templateArgs(cwd) {
  return {
    ...DEFAULT_ARGS,
    cwd,
    tech: [],
    paths: {},
    bcoEnhancement: true,
    bcoOrchestration: "complete",
  };
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

function countWords(value) {
  return value.match(/[\p{L}\p{N}]+(?:[_'’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}
