import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs, resolveArgs, validateOptions } from "../src/args.js";
import {
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

test("complete orchestration generates BCO docs and thirteen agent roles", async (t) => {
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

  assert.equal(count(agents, "<!-- critical-boiler:bco-agents -->"), 1);
  assert.equal(count(aiDocs, "<!-- critical-boiler:bco-docs -->"), 1);
  assert.equal(count(commands, "<!-- critical-boiler:bco-commands -->"), 1);
  assert.equal(
    count(
      definitionOfDone,
      "<!-- critical-boiler:bco-definition-of-done -->",
    ),
    1,
  );
  assert.match(agents, /Experimental Brain changes automatic launch timing only/u);
  assert.match(agents, /dedicated read-only AI governor/u);
  assert.match(commands, /select `developer_orchestrator` as the main orchestrator/u);
  assert.match(rootPrompt, /never select, propose, claim, or start a successor/u);
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
