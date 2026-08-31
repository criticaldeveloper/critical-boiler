import path from "node:path";
import {
  BCO_ORCHESTRATION_SYSTEMS,
  DEFAULT_BCO_ORCHESTRATION,
  PROJECT_TYPES,
  TECHNOLOGIES,
} from "../catalog.js";
import { color } from "../color.js";
import { withRequiredTechnologies } from "../args.js";
import { packagesForTechnologies } from "../package-json.js";
import { unique } from "../utils.js";
import { askText, option, selectOne, settleInput } from "./terminal.js";
import { printBanner } from "../output.js";

export async function promptForArgs(args) {
  if (!process.stdin.isTTY) {
    throw new Error(
      "Guided setup requires a TTY. Pass options directly or run from a terminal.",
    );
  }

  printBanner();

  const cwdInput = await askText("Target folder", args.cwd);
  await settleInput();
  const projectTypeInput = await selectOne({
    label: "Project type",
    options: Object.entries(PROJECT_TYPES).map(([key, projectType]) =>
      option(key, projectType.label),
    ),
    selected: args.projectType ?? "webApplication",
  });
  let techInput = [];
  let standardScss = args.standardScss;

  if (projectTypeInput === "mobileApplication") {
    techInput = ["flutter"];
    console.log("");
    console.log(
      `${color.cyan("i")} Mobile application selected. ${color.bold("Flutter")} will be used as the base technology.`,
    );
  } else {
    const availableTech = PROJECT_TYPES[projectTypeInput].technologies;
    const selectedTechnology = await selectOne({
      label: "Technology",
      help: "Options are filtered by project type.",
      options: availableTech.map((key) => option(key, TECHNOLOGIES[key].label)),
      selected:
        args.tech.find((key) => availableTech.includes(key)) ??
        availableTech[0],
    });
    techInput = [selectedTechnology];

    const useTailwind = await selectOne({
      label: "Use Tailwind?",
      options: [option("false", "No"), option("true", "Yes")],
      selected: args.tech.includes("tailwind") ? "true" : "false",
    });
    const usesTailwind = useTailwind === "true";

    if (usesTailwind) {
      techInput = unique([...techInput, "tailwind"]);
      console.log("");
      console.log(
        `${color.cyan("i")} Tailwind selected. SCSS skill, SCSS refactor prompt, and standard SCSS utility files will be skipped.`,
      );
    } else {
      techInput = unique([...techInput, "scss"]);
      standardScss =
        (await selectOne({
          label: "Include standard SCSS utility files?",
          options: [option("true", "Yes"), option("false", "No")],
          selected: "true",
        })) === "true";
    }

    techInput = withRequiredTechnologies({
      ...args,
      projectType: projectTypeInput,
      tech: techInput,
    }).tech;
  }

  const useBcoEnhancement = await selectOne({
    label: "Enable BCO enhancement?",
    options: [option("false", "No"), option("true", "Yes")],
    selected: String(args.bcoEnhancement),
  });
  const bcoEnhancement = useBcoEnhancement === "true";
  const bcoOrchestration = bcoEnhancement
    ? await selectOne({
        label: "BCO orchestration system",
        options: Object.entries(BCO_ORCHESTRATION_SYSTEMS).map(
          ([key, system]) => option(key, system.label),
        ),
        selected: args.bcoOrchestration ?? DEFAULT_BCO_ORCHESTRATION,
      })
    : undefined;

  printPackagePlan(techInput, projectTypeInput);

  const forceInput = await selectOne({
    label: "Overwrite existing files?",
    options: [option("false", "No"), option("true", "Yes")],
    selected: String(args.force),
  });

  return {
    ...args,
    cwd: path.resolve(cwdInput),
    projectType: projectTypeInput,
    tech: techInput,
    standardScss,
    bcoEnhancement,
    bcoOrchestration,
    force: forceInput === "true",
  };
}

export function printPackagePlan(technologies, projectType = undefined) {
  if (projectType === "mobileApplication") {
    console.log("");
    console.log(
      `${color.cyan("i")} No npm packages are required for this Flutter starter.`,
    );
    return;
  }

  const packagePlan = packagesForTechnologies(technologies);
  const allPackages = [
    ...packagePlan.dependencies,
    ...packagePlan.devDependencies,
  ];

  console.log("");

  if (allPackages.length === 0) {
    console.log(
      `${color.cyan("i")} No npm packages are required for the selected technologies.`,
    );
    return;
  }

  console.log(
    `${color.cyan("i")} Packages planned for ${color.bold("package.json")}:`,
  );

  if (packagePlan.dependencies.length > 0) {
    console.log(
      `  ${color.bold("dependencies")}: ${packagePlan.dependencies.join(", ")}`,
    );
  }

  if (packagePlan.devDependencies.length > 0) {
    console.log(
      `  ${color.bold("devDependencies")}: ${packagePlan.devDependencies.join(", ")}`,
    );
  }

  console.log(
    `  ${color.dim("Exact versions will be resolved with npm view <package-name> versions --json before writing.")}`,
  );
}
