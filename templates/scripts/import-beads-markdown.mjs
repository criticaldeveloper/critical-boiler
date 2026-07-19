#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const taskPattern = /^(\s*)[-*+]\s+\[([ xX])\]\s+(.+?)\s*$/;
const headingPattern = /^(#{1,6})\s+(.+?)\s*$/;
const detailPattern = /^(\s*)[-*+]\s+(?!\[[ xX]\])(.+?)\s*$/;
const annotationPattern =
  /\[(priority|type|labels|depends-on):([^\]]+)\]/giu;
const allowedTypes = new Set([
  "bug",
  "feature",
  "task",
  "epic",
  "chore",
  "decision",
]);

export function parseMarkdownTasks(source, sourcePath, options = {}) {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const headings = [];
  const openTasks = [];
  const tasks = [];
  const skipped = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = headingPattern.exec(line);
    if (heading) {
      const level = heading[1].length;
      headings.length = level - 1;
      headings[level - 1] = cleanInlineMarkdown(heading[2]);
      openTasks.length = 0;
      continue;
    }

    const match = taskPattern.exec(line);
    if (match) {
      const completed = match[2].toLowerCase() === "x";
      const indent = indentation(match[1]);
      const parsedTitle = parseTitle(match[3]);
      const headingPath = headings.filter(Boolean);

      while (
        openTasks.length > 0 &&
        openTasks.at(-1).indent >= indent
      ) {
        openTasks.pop();
      }

      const task = {
        index: tasks.length,
        title: parsedTitle.title,
        type: parsedTitle.type ?? "task",
        priority: parsedTitle.priority ?? options.priority ?? "P2",
        labels: parsedTitle.labels,
        dependsOnTitles: parsedTitle.dependsOnTitles,
        completed,
        sourceLine: index + 1,
        sourcePath,
        headingPath,
        parentIndex: openTasks.at(-1)?.task.index,
        indent,
        descriptionLines: [],
        acceptanceCriteria: [],
      };

      if (completed && !options.includeCompleted) {
        skipped.push({
          title: task.title,
          sourceLine: task.sourceLine,
          reason: "completed",
        });
        continue;
      }

      tasks.push(task);
      openTasks.push({ indent, task });
      continue;
    }

    const current = openTasks.at(-1)?.task;
    if (!current || line.trim().length === 0) continue;
    const leading = line.match(/^\s*/u)?.[0] ?? "";
    if (indentation(leading) <= current.indent) continue;

    const detail = detailPattern.exec(line);
    if (detail) {
      current.acceptanceCriteria.push(cleanInlineMarkdown(detail[2]));
    } else {
      current.descriptionLines.push(line.trim());
    }
  }

  validateTasks(tasks);
  const keyOccurrences = new Map();

  for (const task of tasks) {
    const semanticKey = [
      normalizePath(sourcePath),
      ...task.headingPath.map(normalizeText),
      normalizeText(task.title),
    ].join("|");
    const occurrence = (keyOccurrences.get(semanticKey) ?? 0) + 1;
    keyOccurrences.set(semanticKey, occurrence);
    task.fingerprint = sha256(`${semanticKey}|${occurrence}`);
    task.description = buildDescription(task);
    if (task.acceptanceCriteria.length === 0) {
      task.acceptanceCriteria = [
        `Complete the outcome described by “${task.title}”.`,
        "Run the relevant project verification and record concrete evidence in Beads.",
      ];
    }
    delete task.descriptionLines;
    delete task.indent;
  }

  validateDependencies(tasks);
  return { tasks, skipped };
}

function parseTitle(rawTitle) {
  const annotations = {
    labels: ["imported-markdown"],
    dependsOnTitles: [],
  };
  let match;

  while ((match = annotationPattern.exec(rawTitle)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (key === "priority") annotations.priority = value.toUpperCase();
    if (key === "type") annotations.type = value.toLowerCase();
    if (key === "labels") {
      annotations.labels.push(
        ...value.split(",").map((label) => label.trim()).filter(Boolean),
      );
    }
    if (key === "depends-on") annotations.dependsOnTitles.push(value);
  }

  annotationPattern.lastIndex = 0;
  const title = cleanInlineMarkdown(rawTitle.replace(annotationPattern, ""));
  annotationPattern.lastIndex = 0;
  return { title, ...annotations };
}

function validateTasks(tasks) {
  for (const task of tasks) {
    if (!task.title) {
      throw new Error(`Task at ${task.sourcePath}:${task.sourceLine} has no title.`);
    }
    if (!/^P[0-4]$/u.test(task.priority)) {
      throw new Error(
        `Task “${task.title}” has invalid priority ${task.priority}; use P0-P4.`,
      );
    }
    if (!allowedTypes.has(task.type)) {
      throw new Error(
        `Task “${task.title}” has invalid type ${task.type}.`,
      );
    }
  }
}

function validateDependencies(tasks) {
  const byTitle = new Map();
  for (const task of tasks) {
    const key = normalizeText(task.title);
    const matches = byTitle.get(key) ?? [];
    matches.push(task);
    byTitle.set(key, matches);
  }

  for (const task of tasks) {
    task.dependsOnIndexes = task.dependsOnTitles.map((title) => {
      const matches = byTitle.get(normalizeText(title)) ?? [];
      if (matches.length !== 1) {
        throw new Error(
          `Dependency “${title}” referenced by “${task.title}” matched ${matches.length} tasks.`,
        );
      }
      if (matches[0].index === task.index) {
        throw new Error(`Task “${task.title}” cannot depend on itself.`);
      }
      return matches[0].index;
    }).filter((index, position, indexes) => (
      index !== task.parentIndex && indexes.indexOf(index) === position
    ));
    delete task.dependsOnTitles;
  }
}

function buildDescription(task) {
  const context = task.headingPath.length > 0
    ? `Section: ${task.headingPath.join(" > ")}`
    : "Section: document root";
  const details = task.descriptionLines.join("\n").trim();
  return [
    details,
    `Imported from ${task.sourcePath}:${task.sourceLine}.`,
    context,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildImportPlan(source, sourcePath, options = {}) {
  const parsed = parseMarkdownTasks(source, sourcePath, options);
  const sourceHash = sha256(source.replaceAll("\r\n", "\n"));
  return {
    schemaVersion: 1,
    source: { path: sourcePath, sha256: sourceHash },
    mode: options.apply ? "apply" : "preview",
    tasks: parsed.tasks,
    skipped: parsed.skipped,
    results: [],
  };
}

async function applyPlan(plan, bd) {
  const existingIssues = listExistingIssues(bd);
  const existingByFingerprint = new Map();
  const existingDependencies = new Set();
  for (const issue of existingIssues) {
    const fingerprint = readFingerprint(issue.metadata);
    if (fingerprint) existingByFingerprint.set(fingerprint, issue);
    for (const dependency of issue.dependencies ?? []) {
      const dependencyId = dependency.depends_on_id ?? dependency.id;
      if (issue.id && dependencyId) {
        existingDependencies.add(`${issue.id}:${dependencyId}`);
      }
    }
  }

  const ids = new Map();
  for (const task of plan.tasks) {
    const existing = existingByFingerprint.get(task.fingerprint);
    if (existing?.id) {
      ids.set(task.index, existing.id);
      plan.results.push({
        taskIndex: task.index,
        action: "matched",
        id: existing.id,
      });
      continue;
    }

    const metadata = JSON.stringify({
      criticalBoilerImport: {
        fingerprint: task.fingerprint,
        sourcePath: task.sourcePath,
        sourceLine: task.sourceLine,
      },
    });
    const args = [
      "create",
      task.title,
      "--type",
      task.type,
      "--priority",
      task.priority,
      "--description",
      task.description,
      "--acceptance",
      task.acceptanceCriteria.join("\n"),
      "--labels",
      [...new Set(task.labels)].join(","),
      "--metadata",
      metadata,
      "--json",
    ];
    const parentId = ids.get(task.parentIndex);
    if (parentId) args.push("--parent", parentId);

    const created = runBdJson(bd, args);
    const id = findIssueId(created);
    if (!id) throw new Error(`Beads did not return an ID for “${task.title}”.`);
    ids.set(task.index, id);
    plan.results.push({ taskIndex: task.index, action: "created", id });
  }

  for (const task of plan.tasks) {
    const taskId = ids.get(task.index);
    for (const dependencyIndex of task.dependsOnIndexes) {
      const dependencyId = ids.get(dependencyIndex);
      const dependencyKey = `${taskId}:${dependencyId}`;
      if (!existingDependencies.has(dependencyKey)) {
        runBd(bd, ["dep", "add", taskId, dependencyId]);
        existingDependencies.add(dependencyKey);
      }
    }
    if (task.completed && plan.results.find(
      (result) => result.taskIndex === task.index,
    )?.action === "created") {
      runBd(bd, ["close", taskId, "Completed in imported Markdown source"]);
    }
  }

  return plan;
}

function listExistingIssues(bd) {
  const output = runBdJson(bd, ["list", "--json", "--limit", "0"]);
  if (Array.isArray(output)) return output;
  if (Array.isArray(output?.issues)) return output.issues;
  return [];
}

function readFingerprint(metadata) {
  if (!metadata) return undefined;
  let value = metadata;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return value?.criticalBoilerImport?.fingerprint;
}

function findIssueId(value) {
  if (!value || typeof value !== "object") return undefined;
  if (typeof value.id === "string") return value.id;
  if (Array.isArray(value)) {
    for (const item of value) {
      const id = findIssueId(item);
      if (id) return id;
    }
  }
  for (const nested of Object.values(value)) {
    const id = findIssueId(nested);
    if (id) return id;
  }
  return undefined;
}

function resolveBd() {
  const configured = process.env.BEADS_BIN;
  const localScript = path.join(root, "node_modules", "@beads", "bd", "bin", "bd.js");
  if (configured) return executable(configured);
  if (existsSync(localScript)) {
    return { command: process.execPath, prefix: [localScript] };
  }

  if (process.platform === "win32") {
    const located = spawnSync("where.exe", ["bd"], { encoding: "utf8" });
    const binary = located.stdout
      ?.split(/\r?\n/u)
      .find((candidate) => candidate.toLowerCase().endsWith(".exe"));
    if (binary) return executable(binary);
    throw new Error(
      "Could not find a safe Beads executable. Run pnpm install or set BEADS_BIN to a native executable or .js/.mjs launcher.",
    );
  }

  return { command: "bd", prefix: [] };
}

function executable(filePath) {
  return /\.m?js$/u.test(filePath.toLowerCase())
    ? { command: process.execPath, prefix: [filePath] }
    : { command: filePath, prefix: [] };
}

function runBdJson(bd, args) {
  const result = runBd(bd, args, true);
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`Beads returned invalid JSON for bd ${args[0]}.`);
  }
}

function runBd(bd, args, capture = false) {
  const result = spawnSync(bd.command, [...bd.prefix, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = capture ? result.stderr.trim() : "See Beads output above.";
    throw new Error(`bd ${args[0]} failed. ${detail}`);
  }
  return result;
}

function parseArguments(argv) {
  const options = {
    apply: false,
    includeCompleted: false,
    maxTasks: 200,
    priority: "P2",
  };
  let file;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--apply") options.apply = true;
    else if (arg === "--include-completed") options.includeCompleted = true;
    else if (arg === "--max-tasks") {
      options.maxTasks = Number.parseInt(argv[++index], 10);
    } else if (arg === "--priority") {
      options.priority = String(argv[++index] ?? "").toUpperCase();
    } else if (!arg.startsWith("-") && !file) file = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!file) {
    throw new Error(
      "Usage: pnpm beads:import-md <file.md> [--apply] [--include-completed] [--max-tasks N]",
    );
  }
  if (!Number.isInteger(options.maxTasks) || options.maxTasks < 1) {
    throw new Error("--max-tasks must be a positive integer.");
  }
  if (!/^P[0-4]$/u.test(options.priority)) {
    throw new Error("--priority must be P0-P4.");
  }

  return { file, options };
}

async function main() {
  const { file, options } = parseArguments(process.argv.slice(2));
  const absoluteSource = path.resolve(root, file);
  const relativeSource = normalizePath(path.relative(root, absoluteSource));
  const source = await readFile(absoluteSource, "utf8");
  const plan = buildImportPlan(source, relativeSource, options);
  if (plan.tasks.length === 0) {
    throw new Error("No importable Markdown checkbox tasks were found.");
  }
  if (plan.tasks.length > options.maxTasks) {
    throw new Error(
      `Found ${plan.tasks.length} tasks, exceeding --max-tasks ${options.maxTasks}.`,
    );
  }

  const slug = path.basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "") || "tasks";
  const reportPath = path.join(
    root,
    "ai-docs",
    "tmp",
    `beads-import-${slug}-${plan.source.sha256.slice(0, 12)}.json`,
  );
  await mkdir(path.dirname(reportPath), { recursive: true });

  try {
    if (options.apply) await applyPlan(plan, resolveBd());
  } finally {
    await writeFile(reportPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  }

  const created = plan.results.filter((result) => result.action === "created").length;
  const matched = plan.results.filter((result) => result.action === "matched").length;
  console.log(
    options.apply
      ? `Beads import complete: ${created} created, ${matched} matched. Report: ${path.relative(root, reportPath)}`
      : `Beads import preview: ${plan.tasks.length} tasks, ${plan.skipped.length} skipped. Report: ${path.relative(root, reportPath)}`,
  );
  if (!options.apply) {
    console.log("Review the report, then rerun with --apply to create tasks.");
  }
}

function indentation(value) {
  return value.replaceAll("\t", "  ").length;
}

function cleanInlineMarkdown(value) {
  return value
    .replace(/^\s+|\s+$/gu, "")
    .replace(/^\*\*(.+)\*\*$/u, "$1")
    .replace(/^`(.+)`$/u, "$1")
    .trim();
}

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}

function normalizePath(value) {
  return value.replaceAll("\\", "/");
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const isMain = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(`Beads Markdown import failed: ${error.message}`);
    process.exitCode = 1;
  });
}
