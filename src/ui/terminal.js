import readline from "node:readline";
import { createInterface } from "node:readline/promises";
import { color } from "../color.js";

export async function askText(label, defaultValue = "") {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const suffix = defaultValue ? color.dim(` (${defaultValue})`) : "";
  try {
    console.log("");
    const answer = await rl.question(`${color.cyan("?")} ${label}${suffix}: `);
    return answer.trim() || defaultValue;
  } finally {
    rl.close();
    process.stdin.resume();
  }
}

export function settleInput() {
  return new Promise((resolve) => {
    setTimeout(resolve, 80);
  });
}

export async function selectOne({ label, options, selected }) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((item) => item.value === selected),
  );
  const values = await selectTerminalList({
    label,
    options,
    selected: [options[selectedIndex].value],
    multiple: false,
  });
  return values[0];
}

export async function selectMany({ label, help, options, selected }) {
  return selectTerminalList({ label, help, options, selected, multiple: true });
}

export function option(value, label, description = "") {
  return { value, label, description };
}

export async function selectTerminalList({
  label,
  help = "",
  options,
  selected,
  multiple,
}) {
  if (options.length === 0) return [];

  const selectedValues = new Set(
    selected.filter((value) => options.some((item) => item.value === value)),
  );
  if (!multiple && selectedValues.size === 0) {
    selectedValues.add(options[0].value);
  }

  let cursor = Math.max(
    0,
    options.findIndex((item) => selectedValues.has(item.value)),
  );
  if (cursor === -1) cursor = 0;
  const startedAt = Date.now();
  let ignoredInitialEnter = false;
  let hasMovedOrToggled = false;

  readline.emitKeypressEvents(process.stdin);
  const wasRaw = process.stdin.isRaw;
  process.stdin.resume();
  process.stdin.setRawMode(true);

  let renderedLines = 0;

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      process.stdin.off("keypress", onKeypress);
      process.stdin.setRawMode(wasRaw);
    };

    const finish = () => {
      cleanup();
      redraw();
      resolve(multiple ? [...selectedValues] : [options[cursor].value]);
    };

    const redraw = () => {
      if (renderedLines > 0) {
        readline.moveCursor(process.stdout, 0, -renderedLines);
        readline.cursorTo(process.stdout, 0);
        readline.clearScreenDown(process.stdout);
      }

      const lines = renderSelectLines({
        label,
        help,
        options,
        selectedValues,
        cursor,
        multiple,
      });
      renderedLines = lines.length;
      process.stdout.write(`${lines.join("\n")}\n`);
    };

    const onKeypress = (_text, key = {}) => {
      const isEnter = key.name === "return" || key.name === "enter";

      if (
        isEnter &&
        !ignoredInitialEnter &&
        !hasMovedOrToggled &&
        Date.now() - startedAt < 700
      ) {
        ignoredInitialEnter = true;
        return;
      }

      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Guided setup cancelled."));
        return;
      }

      if (key.name === "up") {
        hasMovedOrToggled = true;
        cursor = cursor === 0 ? options.length - 1 : cursor - 1;
        redraw();
        return;
      }

      if (key.name === "down") {
        hasMovedOrToggled = true;
        cursor = cursor === options.length - 1 ? 0 : cursor + 1;
        redraw();
        return;
      }

      if (multiple && key.name === "space") {
        hasMovedOrToggled = true;
        const value = options[cursor].value;
        if (selectedValues.has(value)) selectedValues.delete(value);
        else selectedValues.add(value);
        redraw();
        return;
      }

      if (!multiple && key.name === "space") {
        hasMovedOrToggled = true;
        selectedValues.clear();
        selectedValues.add(options[cursor].value);
        redraw();
        return;
      }

      if (multiple && key.name === "a") {
        hasMovedOrToggled = true;
        if (selectedValues.size === options.length) selectedValues.clear();
        else options.forEach((item) => selectedValues.add(item.value));
        redraw();
        return;
      }

      if (isEnter) {
        if (!multiple) {
          selectedValues.clear();
          selectedValues.add(options[cursor].value);
        }
        finish();
      }
    };

    process.stdin.on("keypress", onKeypress);
    redraw();
  });
}

export function renderSelectLines({
  label,
  help,
  options,
  selectedValues,
  cursor,
  multiple,
}) {
  const markerHelp = multiple
    ? "Space toggles, A selects all, Enter confirms"
    : "Arrows move, Enter confirms";
  const lines = [
    "",
    `${color.cyan("?")} ${color.bold(label)} ${color.dim(markerHelp)}`,
  ];

  if (help) lines.push(`  ${color.dim(help)}`);

  for (let index = 0; index < options.length; index += 1) {
    const item = options[index];
    const active = index === cursor;
    const selected = selectedValues.has(item.value);
    const pointer = active ? color.cyan(">") : " ";
    const control = multiple
      ? `[${selected ? "x" : " "}]`
      : `(${selected ? "*" : " "})`;
    const description = item.description
      ? color.dim(` - ${item.description}`)
      : "";
    const content = active ? color.bold(item.label) : item.label;
    lines.push(`  ${pointer} ${control} ${content}${description}`);
  }

  return lines;
}
