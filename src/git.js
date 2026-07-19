import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

export function assertGitAvailable() {
  const result = runGit(["--version"]);
  if (result.status !== 0) {
    throw new Error(
      "Git is required to initialize the project repository. Install Git and rerun Critical Boiler.",
    );
  }
}

export function initializeGitRepository(args) {
  if (isInsideGitWorkTree(args.cwd)) {
    return { fileKey: "git", action: "skip", path: ".git" };
  }

  if (args.dryRun) {
    return {
      fileKey: "git",
      action: "create",
      path: ".git",
      reason: "main branch",
    };
  }

  const result = runGit(["init", "-b", "main"], args.cwd);
  if (result.status !== 0) {
    throw new Error(
      `Could not initialize Git with main as the default branch: ${gitError(result)}`,
    );
  }

  return {
    fileKey: "git",
    action: "create",
    path: ".git",
    reason: "main branch",
  };
}

function isInsideGitWorkTree(cwd) {
  if (!existsSync(cwd)) return false;
  const result = runGit(["rev-parse", "--is-inside-work-tree"], cwd);
  return result.status === 0 && result.stdout.trim() === "true";
}

function runGit(args, cwd) {
  return spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
}

function gitError(result) {
  return result.error?.message ?? result.stderr.trim() ?? "unknown Git error";
}
