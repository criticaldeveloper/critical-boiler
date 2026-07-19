import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { PROMPT_TEMPLATES } from "./catalog.js";
import { color } from "./color.js";
import { renderTemplate } from "./templates.js";
import { stripAnsi } from "./output.js";
import { option, selectOne } from "./ui/terminal.js";

export async function runPromptCommand(args) {
  const promptName = await resolvePromptName(args);
  const prompt = PROMPT_TEMPLATES[promptName];
  const renderedMarkdown = await renderTemplate(prompt.template, args);
  const body = extractPromptBody(renderedMarkdown);
  const finalPrompt = await fillPromptVariables(body);
  const copied = await copyToClipboard(finalPrompt);

  console.log("");
  console.log(color.bold(`${prompt.label} prompt`));
  console.log(
    color.dim("-".repeat(Math.max(20, stripAnsi(prompt.label).length + 7))),
  );
  console.log(finalPrompt);
  console.log("");

  if (copied) {
    console.log(`${color.green("Copied")} final prompt to clipboard.`);
  } else {
    console.log(
      `${color.yellow("Clipboard unavailable.")} The final prompt is printed above.`,
    );
  }

}

export async function resolvePromptName(args) {
  if (args.promptName) {
    const normalized = normalizePromptName(args.promptName);
    if (!PROMPT_TEMPLATES[normalized]) {
      throw new Error(
        `Unknown prompt "${args.promptName}". Use one of: ${Object.keys(PROMPT_TEMPLATES).join(", ")}`,
      );
    }

    return normalized;
  }

  if (!process.stdin.isTTY) {
    throw new Error(
      `Choose a prompt: ${Object.keys(PROMPT_TEMPLATES).join(", ")}`,
    );
  }

  const selected = await selectOne({
    label: "Prompt",
    options: Object.entries(PROMPT_TEMPLATES).map(([name, prompt]) =>
      option(name, prompt.label, prompt.description),
    ),
    selected: Object.keys(PROMPT_TEMPLATES)[0],
  });

  return selected;
}

export function normalizePromptName(name) {
  const normalized = String(name).trim().toLowerCase();
  const aliases = {
    kickoff: "project-kickoff",
    feature: "feature-implementation",
    bug: "bug-investigation",
    frontend: "frontend-component",
    component: "frontend-component",
    scss: "scss-refactor",
    tailwind: "tailwind-refactor",
    styling: "scss-refactor",
    review: "code-review",
    tests: "test-creation",
    test: "test-creation",
  };

  return aliases[normalized] ?? normalized;
}

export function extractPromptBody(markdown) {
  const match = markdown.match(/```(?:text)?\r?\n([\s\S]*?)\r?\n```/i);
  return (match ? match[1] : markdown).trim();
}

export async function fillPromptVariables(template) {
  if (!process.stdin.isTTY) {
    return template.trim();
  }

  const lines = template.split(/\r?\n/);
  const result = [];
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    for (const line of lines) {
      const field = line.match(/^([A-Z][A-Za-z0-9 /,()'-]+):\s*$/);

      if (!field) {
        result.push(line);
        continue;
      }

      const value = await askWithInterface(rl, field[1]);
      result.push(value ? `${field[1]}: ${value}` : line);
    }
  } finally {
    rl.close();
    process.stdin.resume();
  }

  return result.join("\n").trim();
}

export async function askWithInterface(rl, label, defaultValue = "") {
  const suffix = defaultValue ? color.dim(` (${defaultValue})`) : "";
  const answer = await rl.question(`${color.cyan("?")} ${label}${suffix}: `);
  return answer.trim() || defaultValue;
}

export async function copyToClipboard(value) {
  const commands = clipboardCommands();

  for (const command of commands) {
    try {
      await writeToCommand(command.file, command.args, value);
      return true;
    } catch {
      // Try the next clipboard command for this platform.
    }
  }

  return false;
}

export function clipboardCommands() {
  if (process.platform === "win32") {
    return [{ file: "clip.exe", args: [] }];
  }

  if (process.platform === "darwin") {
    return [{ file: "pbcopy", args: [] }];
  }

  return [
    { file: "wl-copy", args: [] },
    { file: "xclip", args: ["-selection", "clipboard"] },
    { file: "xsel", args: ["--clipboard", "--input"] },
  ];
}

export function writeToCommand(file, args, value) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, args, { stdio: ["pipe", "ignore", "ignore"] });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${file} exited with ${code}`));
    });

    child.stdin.end(value);
  });
}
