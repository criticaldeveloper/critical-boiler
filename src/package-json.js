import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { PACKAGE_RECIPES } from "./catalog.js";
import { color } from "./color.js";
import { selectedFileKeys } from "./project-plan.js";
import { unique } from "./utils.js";
const execFileAsync = promisify(execFile);
export const DEFAULT_PACKAGE_MANAGER = "pnpm@11.1.2";
export const BEADS_PACKAGE = "@beads/bd";

export async function renderPackageJson(args) {
  const packagePlan = packagesForTechnologies(packageTechnologies(args));
  const allPackages = [
    ...packagePlan.dependencies,
    ...packagePlan.devDependencies,
  ];

  const resolvedPackages = await withPackageResolutionLoader(
    allPackages,
    async () => ({
      dependencies: await resolvePackageVersions(packagePlan.dependencies),
      devDependencies: await resolvePackageVersions(
        packagePlan.devDependencies,
      ),
    }),
  );
  const { dependencies, devDependencies } = resolvedPackages;
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));
  const packageJson = {
    name: normalizePackageName(path.basename(args.cwd)),
    version: "0.1.0",
    private: true,
    type: "module",
    packageManager: DEFAULT_PACKAGE_MANAGER,
    scripts,
    dependencies,
    devDependencies,
  };

  if (Object.keys(dependencies).length === 0) delete packageJson.dependencies;
  if (Object.keys(devDependencies).length === 0)
    delete packageJson.devDependencies;

  return `${JSON.stringify(packageJson, null, 2)}\n`;
}

export async function withPackageResolutionLoader(packageNames, task) {
  if (packageNames.length === 0) {
    return task();
  }

  return withSpinner(
    `Resolving npm package versions with ${color.bold("npm view <package-name> versions --json")}`,
    task,
  );
}

export async function withSpinner(message, task) {
  if (!process.stdout.isTTY) {
    console.log("");
    console.log(`${color.cyan("i")} ${message}...`);
    return task();
  }

  const frames = ["-", "\\", "|", "/"];
  let frameIndex = 0;
  let timer;
  const writeFrame = () => {
    const frame = frames[frameIndex % frames.length];
    frameIndex += 1;
    process.stdout.write(`\r${color.cyan(frame)} ${message}...`);
  };

  console.log("");
  writeFrame();
  timer = setInterval(writeFrame, 100);

  try {
    const result = await task();
    clearInterval(timer);
    process.stdout.write(
      `\r${color.green("+")} ${message} ${color.dim("done")}\n`,
    );
    return result;
  } catch (error) {
    clearInterval(timer);
    process.stdout.write(`\r${color.red("x")} ${message} failed\n`);
    throw error;
  }
}

export function packageTechnologies(args) {
  const technologies = [...args.tech];
  const selectedFiles = selectedFileKeys(args);
  const hasScssStarter = selectedFiles.some((key) =>
    ["scssSkill", "cssReset", "cssTokens", "cssUtilities", "cssIndex"].includes(
      key,
    ),
  );

  if (hasScssStarter && !technologies.includes("tailwind")) {
    technologies.push("scss");
  }

  if (args.beads) technologies.push("beads");

  return unique(technologies);
}

export function packagesForTechnologies(technologies) {
  const dependencies = [];
  const devDependencies = [];
  const usesPostcssTailwind =
    technologies.includes("tailwind") &&
    (technologies.includes("nextjs") || technologies.includes("angular"));

  for (const technology of technologies) {
    const recipe = PACKAGE_RECIPES[technology];
    if (!recipe) continue;

    dependencies.push(...recipe.dependencies);
    if (technology === "tailwind" && usesPostcssTailwind) {
      devDependencies.push("tailwindcss", "@tailwindcss/postcss", "postcss");
    } else {
      devDependencies.push(...recipe.devDependencies);
    }
  }

  return {
    dependencies: unique(dependencies),
    devDependencies: unique(devDependencies).filter(
      (dependency) => !dependencies.includes(dependency),
    ),
  };
}

export function packageScriptsForTechnologies(technologies) {
  let scripts;

  if (technologies.includes("angular")) {
    scripts = {
      dev: "ng serve",
      build: "ng build",
      test: "ng test",
    };
  } else if (technologies.includes("nextjs")) {
    scripts = {
      dev: "next dev",
      build: "next build",
      start: "next start",
    };
  } else if (technologies.includes("nuxt")) {
    scripts = {
      dev: "nuxt dev",
      build: "nuxt build",
      preview: "nuxt preview",
    };
  } else if (technologies.includes("astro")) {
    scripts = {
      dev: "astro dev",
      build: "astro build",
      preview: "astro preview",
    };
  } else if (
    technologies.some((technology) =>
      ["react", "vue", "svelte"].includes(technology),
    )
  ) {
    scripts = {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    };
  } else {
    scripts = {
      test: 'echo "No test script configured yet"',
    };
  }

  if (!technologies.includes("beads")) return scripts;

  return {
    ...scripts,
    "beads:setup": "node scripts/setup-beads.mjs",
    "beads:prime": "bd prime",
    "beads:ready": "bd ready",
    "beads:status": "bd status",
    "beads:import-md": "node scripts/import-beads-markdown.mjs",
  };
}

export async function mergeBeadsPackageJson(raw, resolveVersion = true) {
  let packageJson;

  try {
    packageJson = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Could not add Beads to package.json: ${error.message}`);
  }

  const beadsScripts = Object.fromEntries(
    Object.entries(packageScriptsForTechnologies(["beads"])).filter(([name]) =>
      name.startsWith("beads:"),
    ),
  );
  const scripts = { ...(packageJson.scripts ?? {}) };
  const hasPackage = Boolean(
    packageJson.dependencies?.[BEADS_PACKAGE] ??
      packageJson.devDependencies?.[BEADS_PACKAGE],
  );
  let changed = false;

  for (const [name, command] of Object.entries(beadsScripts)) {
    if (scripts[name] !== undefined) continue;
    scripts[name] = command;
    changed = true;
  }

  if (!hasPackage) changed = true;
  if (!changed) return { changed: false, contents: raw };
  if (!resolveVersion) return { changed: true, contents: raw };

  packageJson.scripts = scripts;
  if (!hasPackage) {
    packageJson.devDependencies = {
      ...(packageJson.devDependencies ?? {}),
      [BEADS_PACKAGE]: await latestPublishedVersion(BEADS_PACKAGE),
    };
  }

  const indent = raw.match(/\n([\t ]+)"/)?.[1] ?? "  ";
  return {
    changed: true,
    contents: `${JSON.stringify(packageJson, null, indent)}\n`,
  };
}

export async function resolvePackageVersions(packageNames) {
  const entries = [];

  for (const packageName of packageNames) {
    const version = await latestPublishedVersion(packageName);
    entries.push([packageName, version]);
  }

  return Object.fromEntries(entries);
}

export async function latestPublishedVersion(packageName) {
  const command = process.platform === "win32" ? "cmd.exe" : "npm";
  const npmArgs = ["view", packageName, "versions", "--json"];
  const commandArgs =
    process.platform === "win32"
      ? ["/d", "/s", "/c", "npm", ...npmArgs]
      : npmArgs;
  let stdout;

  try {
    ({ stdout } = await execFileAsync(command, commandArgs, {
      maxBuffer: 1024 * 1024 * 8,
    }));
  } catch (error) {
    throw new Error(
      `Could not resolve npm versions for "${packageName}". ${error.message}`,
    );
  }

  let versions;

  try {
    versions = JSON.parse(stdout);
  } catch {
    throw new Error(`npm returned invalid version data for "${packageName}".`);
  }

  if (!Array.isArray(versions) || versions.length === 0) {
    throw new Error(`npm returned no versions for "${packageName}".`);
  }

  return selectLatestStableVersion(versions);
}

export function selectLatestStableVersion(versions) {
  const stableVersions = versions.filter((version) => !version.includes("-"));
  const candidates = stableVersions.length > 0 ? stableVersions : versions;
  return candidates.sort(compareSemver).at(-1);
}

export function compareSemver(left, right) {
  const leftParts = parseSemver(left);
  const rightParts = parseSemver(right);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }

  return left.localeCompare(right);
}

export function parseSemver(version) {
  return version
    .split("-")[0]
    .split(".")
    .slice(0, 3)
    .map((part) => Number.parseInt(part, 10) || 0);
}

export function normalizePackageName(name) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "");

  return normalized || "new-project";
}
