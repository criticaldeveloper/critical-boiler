#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VERSION } from "../src/catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8"),
);
const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME ?? `v${packageJson.version}`;

if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u.test(tag)) {
  throw new Error(`Release tag must use stable semantic versioning (vX.Y.Z); received ${tag}.`);
}

if (VERSION !== packageJson.version) {
  throw new Error(
    `Version mismatch: package.json is ${packageJson.version}, but src/catalog.js is ${VERSION}.`,
  );
}

if (tag !== `v${packageJson.version}`) {
  throw new Error(
    `Tag ${tag} does not match package version v${packageJson.version}.`,
  );
}

console.log(`Release metadata verified for ${tag}.`);
