import { FILES, PROJECT_TYPES, PROMPT_TEMPLATES, TECHNOLOGIES } from "./catalog.js";
import { color, terminalCellLogo } from "./color.js";
import { packageVersionStatus } from "./package-version-check.js";

export function printHelp() {
  printBanner();
  console.log(`${color.bold("Usage:")}
  ${color.cyan("critical-boiler")} [target-folder] [options]
  ${color.cyan("critical-boiler prompt")} [name] [options]

${color.bold("Options:")}
  -t, --tech <items>        Comma-separated technologies: ${Object.keys(TECHNOLOGIES).join(", ")}
      --project-type <name> Project type metadata: ${Object.keys(PROJECT_TYPES).join(", ")}
      --no-standard-scss    Skip generated SCSS reset, tokens, utilities, and entrypoint
      --no-beads            Disable Beads package, skill, setup script, and task docs
  -c, --config <path>       JSON config file. Defaults to critical-boiler.config.json when present
      --cwd <path>          Target folder. Defaults to current directory
  -f, --force               Overwrite existing files
      --dry-run             Show what would happen without writing files
      --list                List file keys and technologies
  -v, --version             Print version
  -h, --help                Print help

${color.bold("Examples:")}
  critical-boiler --tech react,tailwind
  critical-boiler
  critical-boiler prompt feature-implementation
  critical-boiler prompt --list
  critical-boiler ./new-app
  critical-boiler --dry-run --tech node,typescript
  critical-boiler --no-beads --tech node,typescript
`);
}

export function printPromptHelp() {
  printBanner();
  console.log(`${color.bold("Usage:")}
  ${color.cyan("critical-boiler prompt")} [name] [options]

${color.bold("Prompt names:")}
  ${Object.keys(PROMPT_TEMPLATES).join(", ")}

${color.bold("Options:")}
      --list                List available prompt templates
  -t, --tech <items>        Render technology-aware prompt text
      --project-type <name> Render project-type-aware prompt text
      --cwd <path>          Project folder used for config lookup. Defaults to current directory
  -c, --config <path>       JSON config file. Defaults to critical-boiler.config.json when present
  -h, --help                Print help

${color.bold("Examples:")}
  critical-boiler prompt feature-implementation
  critical-boiler prompt frontend-component --tech react,tailwind
  critical-boiler prompt tailwind-refactor --config ./critical-boiler.config.json
`);
}

export function printCatalog() {
  printBanner();
  console.log(color.bold("Files:"));
  for (const [key, file] of Object.entries(FILES)) {
    console.log(
      `  ${color.green(key)}: ${file.path} ${color.dim("-")} ${file.description}`,
    );
  }

  console.log(`\n${color.bold("Technologies:")}`);
  for (const [key, tech] of Object.entries(TECHNOLOGIES)) {
    console.log(`  ${color.green(key)}: ${tech.label}`);
  }

  console.log(`\n${color.bold("Project types:")}`);
  for (const [key, projectType] of Object.entries(PROJECT_TYPES)) {
    console.log(
      `  ${color.green(key)}: ${projectType.label} ${color.dim("-")} ${projectType.technologies.join(", ")}`,
    );
  }
}

export function printPromptCatalog() {
  printBanner();
  console.log(color.bold("Prompt templates:"));

  for (const [name, prompt] of Object.entries(PROMPT_TEMPLATES)) {
    console.log(`  ${color.green(name)}: ${prompt.description}`);
  }
}

export function printSummary(args, results) {
  const title = args.dryRun
    ? "Dry run complete"
    : "Project starter files ready";
  const visibleResults = results.filter((result) => result.action !== "skip");

  console.log(`${color.bold(title)} ${color.dim("in")} ${args.cwd}`);

  for (const result of visibleResults) {
    const reason = result.reason ? color.dim(` (${result.reason})`) : "";
    console.log(`  ${formatAction(result.action)} ${result.path}${reason}`);
  }

  if (args.dryRun) {
    printDryRunCompletion(results);
  } else {
    printSuccessCompletion(results, args.cwd);
  }
}

export function printSuccessCompletion(results, cwd) {
  const counts = actionCounts(results);
  const width = 58;
  const border = "=".repeat(width - 2);

  console.log("");
  console.log(color.green(`+${border}+`));
  console.log(
    color.green("|") +
      centerText(
        color.bold("Success! Your project is Codex-ready."),
        width - 2,
      ) +
      color.green("|"),
  );
  console.log(
    color.green("|") +
      centerText(
        `${counts.create} created  ${counts.overwrite} overwritten  ${counts.extend} extended`,
        width - 2,
      ) +
      color.green("|"),
  );
  console.log(color.green(`+${border}+`));
  console.log("");
  console.log(
    `${color.cyan("Next:")} open ${color.bold(cwd)} in Codex and start with ${color.bold("AGENTS.md")}.`,
  );
  console.log("");
}

export function printDryRunCompletion(results) {
  const counts = actionCounts(results);

  console.log("");
  console.log(
    `${color.cyan("Dry run summary:")} ${counts.create} would be created, ${counts.overwrite} would be overwritten, ${counts.extend} would be extended.`,
  );
  console.log("");
}

export function actionCounts(results) {
  return {
    create: results.filter((result) => result.action === "create").length,
    overwrite: results.filter((result) => result.action === "overwrite").length,
    extend: results.filter((result) => result.action === "extend").length,
  };
}

export function printBanner() {
  const status = packageVersionStatus();
  const subtitle = `v${status.currentVersion}`;
  const update = status.updateAvailable
    ? `Update available: v${status.latestVersion}`
    : undefined;
  const tagline = "Project starter for Codex-ready repos";
  const author = "Created by CriticalDeveloper";
  const rows = [
    color.bold(subtitle),
    ...(update ? [color.yellow(update)] : []),
    color.cyan(tagline),
    color.dim(author),
  ];
  const width = Math.max(...rows.map((row) => stripAnsi(row).length)) + 6;
  const border = "-".repeat(width - 2);

  console.log("");
  console.log(terminalCellLogo());
  console.log("");
  console.log(color.dim(`+${border}+`));
  for (const row of rows) {
    console.log(color.dim("|") + centerText(row, width - 2) + color.dim("|"));
  }
  console.log(color.dim(`+${border}+`));
  console.log("");
}

export function centerText(value, width) {
  const visibleLength = stripAnsi(value).length;
  const totalPadding = Math.max(0, width - visibleLength);
  const left = Math.floor(totalPadding / 2);
  const right = totalPadding - left;
  return `${" ".repeat(left)}${value}${" ".repeat(right)}`;
}

export function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

export function formatAction(action) {
  const label = action.padEnd(9);
  if (action === "create") return `${color.green("+")} ${color.green(label)}`;
  if (action === "extend") return `${color.green("+")} ${color.green(label)}`;
  if (action === "overwrite")
    return `${color.yellow("~")} ${color.yellow(label)}`;
  return `${color.dim("-")} ${color.dim(label)}`;
}
