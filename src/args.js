import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CONFIG_FILE, DEFAULT_ARGS, FILES, PROJECT_TYPES, TECHNOLOGIES, TYPESCRIPT_PROJECT_TYPES, TYPESCRIPT_TECHNOLOGIES } from "./catalog.js";
import { splitList, normalizeList, unique } from "./utils.js";

export function parseArgs(argv) {
  const args = {
    ...DEFAULT_ARGS,
    tech: [],
    paths: {},
  };
  const provided = new Set();
  const values = [...argv];

  if (values[0] === "prompt") {
    args.command = "prompt";
    provided.add("command");
    values.shift();
  }

  for (let i = 0; i < values.length; i += 1) {
    const arg = values[i];
    const readValue = () => {
      const value = values[i + 1];
      if (!value || value.startsWith("-")) {
        throw new Error(`Missing value for ${arg}`);
      }
      i += 1;
      return value;
    };

    if (arg === "--cwd") {
      args.cwd = path.resolve(readValue());
      provided.add("cwd");
    } else if (arg === "--tech" || arg === "-t") {
      args.tech = splitList(readValue());
      provided.add("tech");
    } else if (arg === "--project-type") {
      args.projectType = readValue();
      provided.add("projectType");
    } else if (arg === "--no-standard-scss") {
      args.standardScss = false;
      provided.add("standardScss");
    } else if (arg === "--no-beads") {
      args.beads = false;
      provided.add("beads");
    } else if (arg === "--config" || arg === "-c") {
      args.config = path.resolve(readValue());
      provided.add("config");
    } else if (arg === "--force" || arg === "-f") {
      args.force = true;
      provided.add("force");
    } else if (arg === "--dry-run") {
      args.dryRun = true;
      provided.add("dryRun");
    } else if (arg === "--list") {
      args.list = true;
      provided.add("list");
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
      provided.add("help");
    } else if (arg === "--version" || arg === "-v") {
      args.version = true;
      provided.add("version");
    } else if (!arg.startsWith("-")) {
      if (args.command === "prompt" && !args.promptName) {
        args.promptName = arg;
        provided.add("promptName");
      } else {
        args.cwd = path.resolve(arg);
        provided.add("cwd");
      }
    } else throw new Error(`Unknown option: ${arg}`);
  }

  return { args, provided };
}

export function withRequiredTechnologies(args) {
  const tech = unique(args.tech);

  if (args.projectType === "mobileApplication") {
    return {
      ...args,
      tech: tech.includes("flutter") ? tech : unique([...tech, "flutter"]),
    };
  }

  const needsTypeScript =
    args.projectType !== "mobileApplication" &&
    (TYPESCRIPT_PROJECT_TYPES.includes(args.projectType) ||
      tech.some((technology) => TYPESCRIPT_TECHNOLOGIES.includes(technology)));

  if (needsTypeScript && !tech.includes("typescript")) {
    tech.unshift("typescript");
  }

  return {
    ...args,
    tech: unique(tech),
  };
}

export function validateOptions(args) {
  if (args.projectType && !PROJECT_TYPES[args.projectType]) {
    throw new Error(
      `Unknown project type "${args.projectType}". Use one of: ${Object.keys(PROJECT_TYPES).join(", ")}`,
    );
  }

  for (const key of [...args.tech]) {
    if (!TECHNOLOGIES[key]) {
      throw new Error(
        `Unknown technology "${key}". Use one of: ${Object.keys(TECHNOLOGIES).join(", ")}`,
      );
    }
  }

  for (const key of Object.keys(args.paths ?? {})) {
    if (!FILES[key]) {
      throw new Error(
        `Unknown path override "${key}". Use --list to inspect available files.`,
      );
    }

    if (path.isAbsolute(args.paths[key])) {
      throw new Error(
        `Path override for "${key}" must be relative to the target folder.`,
      );
    }
  }
}

export function shouldPromptForArgs(args, provided) {
  return (
    process.stdin.isTTY &&
    !args.dryRun &&
    !provided.has("tech") &&
    !provided.has("projectType") &&
    args.tech.length === 0 &&
    !args.projectType
  );
}

export async function resolveArgs(cliArgs, provided) {
  const configPath = cliArgs.config ?? path.join(cliArgs.cwd, CONFIG_FILE);
  const config = existsSync(configPath) ? await readConfig(configPath) : {};
  const args = {
    ...DEFAULT_ARGS,
    ...config,
    paths: { ...(config.paths ?? {}) },
  };

  for (const key of provided) {
    args[key] = cliArgs[key];
  }

  args.cwd = path.resolve(args.cwd);
  args.projectType = args.projectType ? String(args.projectType) : undefined;
  args.tech = normalizeList(args.tech);
  args.standardScss = args.standardScss !== false;
  args.beads = args.beads !== false;
  args.paths = args.paths ?? {};

  return withRequiredTechnologies(args);
}

export async function readConfig(configPath) {
  try {
    const raw = await readFile(configPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Could not read ${configPath}: ${error.message}`);
  }
}
