import { REACT_TECHNOLOGIES, TYPESCRIPT_PROJECT_TYPES } from "./catalog.js";
import { unique } from "./utils.js";

export function selectedFileKeys(args) {
  return defaultFileKeys(args);
}

export function defaultFileKeys(args) {
  const keys = [
    "agents",
    "aiDocs",
    "architecture",
    "commands",
    "definitionOfDone",
    "editorconfig",
    "gitignore",
    "envExample",
  ];

  if (args.beads) {
    keys.push(
      "beadsWorkflow",
      "beadsSkill",
      "beadsSkillMetadata",
      "beadsSetup",
      "beadsMarkdownImport",
    );
  }

  if (args.projectType !== "mobileApplication") {
    keys.push("packageJson");
  }

  if (args.tech.includes("flutter")) {
    keys.push("flutterPubspec", "flutterMain", "flutterApp");
  }

  if (usesPostcssTailwind(args)) {
    keys.push("postcssConfig");
  }

  if (args.tech.includes("angular") && args.tech.includes("tailwind")) {
    keys.push("angularPostcssConfig", "tailwindCssEntry");
  }

  if (usesViteTailwind(args)) {
    keys.push("viteConfig", "tailwindCssEntry");
  }

  if (args.tech.includes("astro") && args.tech.includes("tailwind")) {
    keys.push("astroConfig", "tailwindCssEntry");
  }

  if (args.tech.includes("nuxt") && args.tech.includes("tailwind")) {
    keys.push("nuxtConfig", "tailwindCssEntry");
  }

  if (args.tech.includes("nextjs") && args.tech.includes("tailwind")) {
    keys.push("tailwindCssEntry");
  }

  keys.push(...technologyFileKeys(args));
  keys.push(...stylingFileKeys(args));

  return unique(keys);
}

export function technologyFileKeys(args) {
  const keys = [];

  if (args.tech.includes("typescript")) keys.push("typescriptSkill");
  if (args.tech.includes("flutter")) keys.push("flutterSkill");
  if (args.tech.some((technology) => REACT_TECHNOLOGIES.includes(technology))) {
    keys.push("reactSkill");
  }
  if (args.tech.includes("nextjs")) keys.push("nextjsSkill");
  if (args.tech.includes("angular")) keys.push("angularSkill");
  if (args.tech.includes("vue")) keys.push("vueSkill");
  if (args.tech.includes("svelte")) keys.push("svelteSkill");
  if (args.tech.includes("nuxt")) keys.push("nuxtSkill");
  if (args.tech.includes("astro")) keys.push("astroSkill");

  return keys;
}

export function stylingFileKeys(args) {
  if (!isFrontendProject(args)) return [];

  if (args.tech.includes("tailwind")) {
    return ["tailwindSkill"];
  }

  const keys = ["scssSkill"];

  if (args.standardScss) {
    keys.push("cssReset", "cssTokens", "cssUtilities", "cssIndex");
  }

  return keys;
}

export function usesPostcssTailwind(args) {
  return (
    args.tech.includes("tailwind") &&
    args.tech.includes("nextjs")
  );
}

export function usesViteTailwind(args) {
  return (
    args.tech.includes("tailwind") &&
    args.tech.some((technology) => ["react", "vue", "svelte"].includes(technology))
  );
}

export function isFrontendProject(args) {
  if (args.projectType === "mobileApplication") return false;
  if (TYPESCRIPT_PROJECT_TYPES.includes(args.projectType)) return true;

  return args.tech.some((technology) =>
    [
      "react",
      "angular",
      "vue",
      "svelte",
      "nextjs",
      "nuxt",
      "astro",
      "tailwind",
      "scss",
    ].includes(technology),
  );
}

export function skippedBySelectionResults(args) {
  return [];
}
