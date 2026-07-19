const TERMINAL_FONT = {
  A: ["0110", "1001", "1111", "1001", "1001"],
  B: ["1110", "1001", "1110", "1001", "1110"],
  C: ["0111", "1000", "1000", "1000", "0111"],
  E: ["1111", "1000", "1110", "1000", "1111"],
  I: ["111", "010", "010", "010", "111"],
  L: ["1000", "1000", "1000", "1000", "1111"],
  O: ["0110", "1001", "1001", "1001", "0110"],
  R: ["1110", "1001", "1110", "1010", "1001"],
  T: ["111", "010", "010", "010", "010"],
};

const LOGO_LAYERS = {
  fill: { character: "█", color: "1;38;5;45" },
  edge: { character: "░", color: "38;5;255" },
};

export function terminalCellLogo() {
  return [renderTerminalWord("critical"), renderTerminalWord("boiler", 5)].join(
    "\n",
  );
}

function renderTerminalWord(value, indent = 0) {
  const glyphs = [...value.toUpperCase()].map(
    (character) => TERMINAL_FONT[character],
  );
  const pixels = Array.from({ length: glyphs[0].length }, (_, row) =>
    glyphs.flatMap((glyph, index) => [
      ...glyph[row].split("").flatMap((pixel) => [pixel === "1", pixel === "1"]),
      ...(index === glyphs.length - 1 ? [] : [false, false]),
    ]),
  );
  const canvas = Array.from({ length: pixels.length + 1 }, () =>
    Array(pixels[0].length + 1).fill(undefined),
  );

  drawLogoLayer(canvas, pixels, "edge", 1, 1);
  drawLogoLayer(canvas, pixels, "fill", 0, 0);

  return canvas
    .map((row) => `${" ".repeat(indent)}${renderLogoRow(row)}`.trimEnd())
    .join("\n");
}

function drawLogoLayer(canvas, pixels, layer, offsetX, offsetY) {
  for (let row = 0; row < pixels.length; row += 1) {
    for (let column = 0; column < pixels[row].length; column += 1) {
      if (pixels[row][column]) canvas[row + offsetY][column + offsetX] = layer;
    }
  }
}

function renderLogoRow(row) {
  let output = "";

  for (let index = 0; index < row.length; ) {
    const layer = row[index];
    let end = index + 1;
    while (end < row.length && row[end] === layer) end += 1;

    if (layer === undefined) output += " ".repeat(end - index);
    else {
      const style = LOGO_LAYERS[layer];
      output += paint(style.character.repeat(end - index), style.color);
    }
    index = end;
  }

  return output;
}

export function paint(value, code) {
  if (!useColor) return value;
  return `\u001b[${code}m${value}\u001b[0m`;
}
export const useColor = process.env.NO_COLOR === undefined && process.stdout.isTTY;
export const color = {
  bold: (value) => paint(value, "1"),
  dim: (value) => paint(value, "2"),
  cyan: (value) => paint(value, "36"),
  green: (value) => paint(value, "32"),
  yellow: (value) => paint(value, "33"),
  red: (value) => paint(value, "31"),
};
