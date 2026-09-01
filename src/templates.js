import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BCO_CONTRACT_VERSION, FILES, TECHNOLOGIES } from "./catalog.js";
import { mergeBcoAgentRegistry } from "./bco.js";
import { templatesDir } from "./paths.js";
import { renderPackageJson } from "./package-json.js";
import { isBcoManagedFileKey, selectedFileKeys } from "./project-plan.js";
import { agentVerificationExpectations, architectureBoundariesSection, architectureDataLayerSection, architectureEntrypointsSection, architectureRoutingSection, architectureSharedUiSection, architectureStateSection, architectureStylingSection, architectureTestSection, aiDocsPromptsSection, aiDocsSkillsSection, commandsMissingNotes, commandsRows, commandsTaskVerificationSection, commandsVerificationNotes, frontendComponentSkillInstruction, frontendStylingBaselineSection, listLines, scssRecommendedStructure, stylingArchitectureSection, stylingRefactorChecklist, stylingRefactorPromptIntro, stylingRefactorPromptTitle, stylingRefactorSkillInstruction, tailwindComponentGoodExample, tailwindComponentRiskyExample, typescriptFrameworkReviewChecklist, typescriptFrameworkSection, viteFrameworkPluginImport, vitePlugins } from "./docs/sections.js";

export async function renderTemplate(templatePath, args) {
  const absolutePath = path.join(templatesDir, templatePath);
  const raw = await readFile(absolutePath, "utf8");
  const techDetails = args.tech.map((key) => TECHNOLOGIES[key]);

  const data = {
    projectName: path.basename(args.cwd),
    flutterPackageName: normalizeDartPackageName(path.basename(args.cwd)),
    generatedAt: new Date().toISOString(),
    bcoContractVersion: BCO_CONTRACT_VERSION,
    technologies:
      techDetails.map((tech) => tech.label).join(", ") || "Not specified",
    agentTechnologyNotes: listLines(
      techDetails.flatMap((tech) => tech.agentNotes),
    ),
    agentVerificationExpectations: agentVerificationExpectations(args),
    aiDocsTechnologyNotes: listLines(
      techDetails.flatMap((tech) => tech.aiDocs),
    ),
    architectureEntrypointsSection: architectureEntrypointsSection(args),
    architectureRoutingSection: architectureRoutingSection(args),
    architectureBoundariesSection: architectureBoundariesSection(args),
    architectureSharedUiSection: architectureSharedUiSection(args),
    architectureDataLayerSection: architectureDataLayerSection(args),
    architectureStateSection: architectureStateSection(args),
    architectureStylingSection: architectureStylingSection(args),
    architectureTestSection: architectureTestSection(args),
    commandsRows: commandsRows(args),
    commandsMissingNotes: commandsMissingNotes(args),
    commandsVerificationNotes: commandsVerificationNotes(args),
    commandsTaskVerificationSection: commandsTaskVerificationSection(args),
    stylingArchitectureSection: stylingArchitectureSection(args),
    aiDocsSkillsSection: aiDocsSkillsSection(args),
    aiDocsPromptsSection: aiDocsPromptsSection(args),
    frontendStylingBaselineSection: frontendStylingBaselineSection(args),
    stylingRefactorPromptTitle: stylingRefactorPromptTitle(args),
    stylingRefactorPromptIntro: stylingRefactorPromptIntro(args),
    stylingRefactorSkillInstruction: stylingRefactorSkillInstruction(args),
    stylingRefactorChecklist: stylingRefactorChecklist(args),
    frontendComponentSkillInstruction: frontendComponentSkillInstruction(args),
    typescriptFrameworkSection: typescriptFrameworkSection(args),
    typescriptFrameworkReviewChecklist: typescriptFrameworkReviewChecklist(args),
    tailwindComponentGoodExample: tailwindComponentGoodExample(args),
    tailwindComponentRiskyExample: tailwindComponentRiskyExample(args),
    scssRecommendedStructure: scssRecommendedStructure(args),
    viteFrameworkPluginImport: viteFrameworkPluginImport(args),
    vitePlugins: vitePlugins(args),
    agentsPath: args.paths?.agents ?? FILES.agents.path,
    aiDocsPath: args.paths?.aiDocs ?? FILES.aiDocs.path,
    commandsPath: args.paths?.commands ?? FILES.commands.path,
  };

  return raw.replaceAll(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key) => data[key] ?? "",
  );
}

export function normalizeDartPackageName(name) {
  const normalized = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^[0-9]/, (digit) => `app_${digit}`);

  return normalized || "new_flutter_app";
}

export async function renderProjectFile(fileKey, args) {
  if (fileKey === "packageJson") {
    return renderPackageJson(args);
  }

  const file = FILES[fileKey];
  return renderTemplate(file.template, args);
}

export async function writeProjectFile(args, fileKey) {
  const file = FILES[fileKey];
  const relativePath = args.paths?.[fileKey] ?? file.path;
  const destination = path.join(args.cwd, relativePath);
  const exists = existsSync(destination);
  const syncBcoFile = args.bcoSync && isBcoManagedFileKey(fileKey, args);
  const overwrite = args.force || syncBcoFile;
  const action =
    exists && !overwrite ? "skip" : exists ? "overwrite" : "create";

  if (fileKey === "bcoAgentRegistry" && exists && !args.force) {
    const raw = await readFile(destination, "utf8");
    const generated = await renderProjectFile(fileKey, args);
    const merged = mergeBcoAgentRegistry(raw, generated, {
      replaceManaged: args.bcoSync,
    });
    if (merged === raw) return { fileKey, action: "skip", path: relativePath };
    if (!args.dryRun) await writeFile(destination, merged, "utf8");
    return {
      fileKey,
      action: args.bcoSync ? "overwrite" : "extend",
      path: relativePath,
    };
  }

  if (args.dryRun) {
    return { fileKey, action, path: relativePath };
  }

  if (exists && !overwrite) {
    return { fileKey, action, path: relativePath };
  }

  const contents = await renderProjectFile(fileKey, args);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents, "utf8");
  return { fileKey, action, path: relativePath };
}
