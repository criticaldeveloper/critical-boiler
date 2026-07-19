import { spawnSync } from "node:child_process";
import { PACKAGE_NAME, VERSION } from "./catalog.js";

const CHECK_TIMEOUT_MS = 1500;

let cachedStatus;

export function packageVersionStatus() {
  if (cachedStatus !== undefined) return cachedStatus;

  const latestVersion = latestPublishedPackageVersion();
  cachedStatus = {
    currentVersion: VERSION,
    latestVersion,
    updateAvailable:
      latestVersion !== undefined && compareSemver(latestVersion, VERSION) > 0,
  };

  return cachedStatus;
}

export function latestPublishedPackageVersion() {
  const result = spawnSync("pnpm", ["view", PACKAGE_NAME, "version", "--json"], {
    encoding: "utf8",
    timeout: CHECK_TIMEOUT_MS,
    windowsHide: true,
  });

  if (result.error || result.status !== 0) return undefined;

  const rawVersion = result.stdout.trim();
  if (!rawVersion) return undefined;

  try {
    const parsed = JSON.parse(rawVersion);
    if (typeof parsed === "string" && parsed.trim()) return parsed.trim();
  } catch {
    return rawVersion.replace(/^"|"$/g, "");
  }

  return undefined;
}

export function compareSemver(left, right) {
  const leftParts = semverParts(left);
  const rightParts = semverParts(right);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }

  return 0;
}

function semverParts(version) {
  return String(version)
    .replace(/^[^\d]*/, "")
    .split(".")
    .slice(0, 3)
    .map((part) => Number.parseInt(part, 10) || 0);
}
