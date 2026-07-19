import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { renderTemplate } from "../src/templates.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const importerTemplate = path.join(
  repositoryRoot,
  "templates",
  "scripts",
  "import-beads-markdown.mjs",
);

test("setup is additive and idempotent", async (t) => {
  const fixture = await createFixture(t);
  await mkdir(path.join(fixture.root, "ai-docs"), { recursive: true });
  await writeFile(path.join(fixture.root, "AGENTS.md"), "existing agent rules\n");
  await writeFile(path.join(fixture.root, "ai-docs", "README.md"), "existing docs\n");
  await writeFile(path.join(fixture.root, "ai-docs", "commands.md"), "existing commands\n");
  await writeFile(path.join(fixture.root, "package.json"), "{}\n");
  await writeFile(path.join(fixture.root, "pnpm-workspace.yaml"), "packages:\n  - .\n");

  const setup = await renderTemplate("scripts/setup-beads.mjs", templateArgs(fixture.root));
  const setupPath = path.join(fixture.root, "scripts", "setup-beads.mjs");
  await writeFile(setupPath, setup);

  runScript(setupPath, [], fixture);
  runScript(setupPath, [], fixture);

  const agents = await readFile(path.join(fixture.root, "AGENTS.md"), "utf8");
  const commands = await readFile(
    path.join(fixture.root, "ai-docs", "commands.md"),
    "utf8",
  );
  const workspace = await readFile(
    path.join(fixture.root, "pnpm-workspace.yaml"),
    "utf8",
  );
  const state = await readState(fixture);

  assert.match(agents, /^existing agent rules/m);
  assert.equal(count(agents, "<!-- critical-boiler:beads-agents -->"), 1);
  assert.equal(count(agents, "<!-- critical-boiler:beads-import-agents -->"), 1);
  assert.equal(count(commands, "<!-- critical-boiler:beads-commands -->"), 1);
  assert.equal(count(commands, "<!-- critical-boiler:beads-import-commands -->"), 1);
  assert.match(commands, /BEADS_BIN=<path-to-bd-or-bd\.js-or-bd\.mjs>/u);
  assert.match(commands, /read `BEADS_BIN` before normal executable discovery/u);
  assert.equal(count(workspace, "'@beads/bd': true"), 1);
  assert.equal(state.initCalls, 1);
});

test("Markdown import preserves hierarchy and reconciles repeat applications", async (t) => {
  const fixture = await createFixture(t);
  const importerPath = path.join(
    fixture.root,
    "scripts",
    "import-beads-markdown.mjs",
  );
  await writeFile(importerPath, await readFile(importerTemplate, "utf8"));
  await writeFile(
    path.join(fixture.root, "PROJECT_TASKS.md"),
    `# Authentication

- [ ] Build authentication API [type:feature] [priority:P1] [labels:backend,security]
  - Validate external input.
  - [ ] Add authentication tests [labels:test] [depends-on:Build authentication API]
- [ ] Build login form [labels:frontend] [depends-on:Build authentication API]
- [x] Remove legacy prototype
`,
  );

  const preview = runScript(importerPath, ["PROJECT_TASKS.md"], fixture);
  assert.match(preview.stdout, /preview: 3 tasks, 1 skipped/u);

  const previewPlan = await readOnlyReport(fixture.root);
  assert.equal(previewPlan.tasks.length, 3);
  assert.equal(previewPlan.skipped.length, 1);
  assert.equal(previewPlan.tasks[1].parentIndex, 0);
  assert.deepEqual(previewPlan.tasks[1].dependsOnIndexes, []);
  assert.deepEqual(previewPlan.tasks[2].dependsOnIndexes, [0]);
  assert.equal(new Set(previewPlan.tasks.map((task) => task.fingerprint)).size, 3);

  const firstApply = runScript(
    importerPath,
    ["PROJECT_TASKS.md", "--apply"],
    fixture,
  );
  assert.match(firstApply.stdout, /3 created, 0 matched/u);
  const firstState = await readState(fixture);
  assert.equal(firstState.issues.length, 3);
  assert.equal(firstState.createCalls, 3);
  assert.equal(firstState.depAdds, 1);
  assert.equal(
    dependencyType(firstState, "Add authentication tests", "Build authentication API"),
    "parent-child",
  );
  assert.equal(
    dependencyType(firstState, "Build login form", "Build authentication API"),
    "blocks",
  );

  const secondApply = runScript(
    importerPath,
    ["PROJECT_TASKS.md", "--apply"],
    fixture,
  );
  assert.match(secondApply.stdout, /0 created, 3 matched/u);
  const secondState = await readState(fixture);
  assert.equal(secondState.issues.length, 3);
  assert.equal(secondState.createCalls, 3);
  assert.equal(secondState.depAdds, 1);

  const reconciledPlan = await readOnlyReport(fixture.root);
  assert.deepEqual(
    reconciledPlan.results.map((result) => result.action),
    ["matched", "matched", "matched"],
  );
});

test("Markdown import rejects ambiguous dependency titles", async (t) => {
  const fixture = await createFixture(t);
  const importerPath = path.join(
    fixture.root,
    "scripts",
    "import-beads-markdown.mjs",
  );
  await writeFile(importerPath, await readFile(importerTemplate, "utf8"));
  await writeFile(
    path.join(fixture.root, "AMBIGUOUS.md"),
    `- [ ] Duplicate
- [ ] Duplicate
- [ ] Dependent [depends-on:Duplicate]
`,
  );

  const result = runScript(
    importerPath,
    ["AMBIGUOUS.md"],
    fixture,
    false,
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /matched 2 tasks/u);
});

async function createFixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "critical-boiler-beads-"));
  const scripts = path.join(root, "scripts");
  await mkdir(scripts, { recursive: true });
  const fakeBd = path.join(scripts, "fake-bd.mjs");
  await writeFile(fakeBd, FAKE_BD);
  t.after(async () => rm(root, { recursive: true, force: true }));
  return { root, fakeBd, statePath: path.join(root, ".fake-beads.json") };
}

function templateArgs(cwd) {
  return {
    cwd,
    beads: true,
    force: false,
    paths: {},
    projectType: undefined,
    standardScss: true,
    tech: ["node", "typescript"],
  };
}

function runScript(script, args, fixture, expectSuccess = true) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: fixture.root,
    encoding: "utf8",
    env: { ...process.env, BEADS_BIN: fixture.fakeBd, NO_COLOR: "1" },
  });
  if (result.error) throw result.error;
  if (expectSuccess) {
    assert.equal(result.status, 0, result.stderr || result.stdout);
  }
  return result;
}

async function readState(fixture) {
  return JSON.parse(await readFile(fixture.statePath, "utf8"));
}

async function readOnlyReport(root) {
  const reportDirectory = path.join(root, "ai-docs", "tmp");
  const reports = (await readdir(reportDirectory)).filter((name) =>
    name.endsWith(".json")
  );
  assert.equal(reports.length, 1);
  return JSON.parse(
    await readFile(path.join(reportDirectory, reports[0]), "utf8"),
  );
}

function dependencyType(state, issueTitle, dependencyTitle) {
  const issue = state.issues.find((candidate) => candidate.title === issueTitle);
  const dependency = state.issues.find(
    (candidate) => candidate.title === dependencyTitle,
  );
  return issue.dependencies.find(
    (candidate) => candidate.depends_on_id === dependency.id,
  )?.type;
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

const FAKE_BD = String.raw`#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const statePath = path.join(root, ".fake-beads.json");
const args = process.argv.slice(2);
const state = existsSync(statePath)
  ? JSON.parse(readFileSync(statePath, "utf8"))
  : { initCalls: 0, createCalls: 0, depAdds: 0, nextId: 1, issues: [] };
const save = () => writeFileSync(statePath, JSON.stringify(state, null, 2));
const flag = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

if (args[0] === "init") {
  mkdirSync(path.join(root, ".beads"), { recursive: true });
  state.initCalls += 1;
  save();
} else if (args[0] === "list") {
  process.stdout.write(JSON.stringify(state.issues));
} else if (args[0] === "create") {
  const id = "bd-" + state.nextId++;
  const parent = flag("--parent");
  const issue = {
    id,
    title: args[1],
    description: flag("--description"),
    acceptance_criteria: flag("--acceptance"),
    priority: flag("--priority"),
    issue_type: flag("--type"),
    metadata: JSON.parse(flag("--metadata") ?? "{}"),
    labels: (flag("--labels") ?? "").split(",").filter(Boolean),
    dependencies: parent
      ? [{ issue_id: id, depends_on_id: parent, type: "parent-child" }]
      : [],
    ...(parent ? { parent } : {}),
  };
  state.issues.push(issue);
  state.createCalls += 1;
  save();
  process.stdout.write(JSON.stringify(issue));
} else if (args[0] === "dep" && args[1] === "add") {
  const issue = state.issues.find((candidate) => candidate.id === args[2]);
  const duplicate = issue.dependencies.some(
    (dependency) => dependency.depends_on_id === args[3],
  );
  if (duplicate) {
    process.stderr.write("duplicate dependency");
    process.exitCode = 9;
  } else {
    issue.dependencies.push({
      issue_id: issue.id,
      depends_on_id: args[3],
      type: "blocks",
    });
    state.depAdds += 1;
    save();
  }
} else if (args[0] === "close") {
  const issue = state.issues.find((candidate) => candidate.id === args[1]);
  issue.status = "closed";
  save();
} else {
  process.stderr.write("unsupported fake bd command: " + args.join(" "));
  process.exitCode = 2;
}
`;
