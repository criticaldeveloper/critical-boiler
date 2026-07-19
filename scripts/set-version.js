#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = path.join(root, "package.json");
const catalogPath = path.join(root, "src", "catalog.js");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const nextVersion = resolveVersion(process.argv[2], packageJson.version);
const catalog = await readFile(catalogPath, "utf8");
const versionDeclaration = /export const VERSION = "[^"]+";/u;

if (!versionDeclaration.test(catalog)) {
  throw new Error("Could not find the VERSION declaration in src/catalog.js.");
}

packageJson.version = nextVersion;
await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
await writeFile(
  catalogPath,
  catalog.replace(versionDeclaration, `export const VERSION = "${nextVersion}";`),
  "utf8",
);

console.log(`Version updated to ${nextVersion}.`);

function resolveVersion(value, current) {
  if (!value) {
    throw new Error("Usage: pnpm version:set <major|minor|patch|X.Y.Z>");
  }
  if (/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u.test(value)) {
    return value;
  }
  if (!new Set(["major", "minor", "patch"]).has(value)) {
    throw new Error("Version must be major, minor, patch, or a stable X.Y.Z value.");
  }

  const [major, minor, patch] = current.split(".").map(Number);
  if (![major, minor, patch].every(Number.isInteger)) {
    throw new Error(`Current package version is not stable semantic versioning: ${current}.`);
  }
  if (value === "major") return `${major + 1}.0.0`;
  if (value === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}
