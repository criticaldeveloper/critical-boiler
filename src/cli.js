#!/usr/bin/env node
import { color } from "./color.js";
import { run } from "./run.js";

if (process.stdout.isTTY) console.clear();

run().catch((error) => {
  console.error(`${color.red("Error:")} ${error.message}`);
  process.exitCode = 1;
});
