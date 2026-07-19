import { parseArgs, resolveArgs, shouldPromptForArgs, validateOptions } from "./args.js";
import { VERSION } from "./catalog.js";
import { printCatalog, printHelp, printPromptCatalog, printPromptHelp, printSummary } from "./output.js";
import { runPromptCommand } from "./prompts.js";
import { selectedFileKeys, skippedBySelectionResults } from "./project-plan.js";
import { writeProjectFile } from "./templates.js";
import { promptForArgs } from "./ui/guided-setup.js";
import { applyBeadsExtensions } from "./beads.js";
import { assertGitAvailable, initializeGitRepository } from "./git.js";

export async function run() {
  const parsed = parseArgs(process.argv.slice(2));
  let args = await resolveArgs(parsed.args, parsed.provided);

  if (args.version) {
    console.log(VERSION);
    return;
  }

  if (args.help) {
    if (args.command === "prompt") printPromptHelp();
    else printHelp();
    return;
  }

  if (args.list) {
    if (args.command === "prompt") printPromptCatalog();
    else printCatalog();
    return;
  }

  if (args.command === "prompt") {
    await runPromptCommand(args);
    return;
  }

  if (shouldPromptForArgs(args, parsed.provided)) {
    args = await promptForArgs(args);
  }

  validateOptions(args);
  assertGitAvailable();
  const keys = selectedFileKeys(args);
  const results = [];

  for (const key of keys) {
    results.push(await writeProjectFile(args, key));
  }

  results.push(...(await applyBeadsExtensions(args)));
  results.push(initializeGitRepository(args));

  printSummary(args, [...results, ...skippedBySelectionResults(args)]);
  terminateCli();
}

export function terminateCli() {
  process.stdin.pause();
  process.exit(0);
}
