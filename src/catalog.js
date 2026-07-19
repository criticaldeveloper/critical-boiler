export const PACKAGE_NAME = "@critical/critical-boiler";
export const VERSION = "1.0.0";

export const CONFIG_FILE = "critical-boiler.config.json";

export const DEFAULT_ARGS = {
  command: "init",
  cwd: process.cwd(),
  tech: [],
  standardScss: true,
  beads: true,
  force: false,
  dryRun: false,
  list: false,
  help: false,
  version: false,
  promptName: undefined,
  projectType: undefined,
  config: undefined,
  paths: {},
};

export const FILES = {
  agents: {
    path: "AGENTS.md",
    template: "AGENTS.md",
    description: "Project-specific instructions for coding agents.",
  },
  aiDocs: {
    path: "ai-docs/README.md",
    template: "ai-docs/README.md",
    description:
      "AI-facing project context, architecture notes, and conventions.",
  },
  architecture: {
    path: "ai-docs/architecture.md",
    template: "ai-docs/architecture.md",
    description:
      "A technology-aware map of entrypoints, routing, modules, data, state, styling, and tests.",
  },
  commands: {
    path: "ai-docs/commands.md",
    template: "ai-docs/commands.md",
    description:
      "A canonical command and verification list so agents do not guess how to install, run, test, or build.",
  },
  definitionOfDone: {
    path: "ai-docs/definition-of-done.md",
    template: "ai-docs/definition-of-done.md",
    description:
      "A completion checklist for scope control, consistency, quality, docs, verification, and handoff.",
  },
  beadsWorkflow: {
    path: "ai-docs/beads.md",
    template: "ai-docs/beads.md",
    description:
      "Authoritative Beads task lifecycle, planning, dependency, and evidence guidance.",
  },
  beadsSkill: {
    path: ".agents/skills/beads-task-planning/SKILL.md",
    template: ".agents/skills/beads-task-planning/SKILL.md",
    description:
      "Project-local Codex skill for dependency-aware task planning and execution with Beads.",
  },
  beadsSkillMetadata: {
    path: ".agents/skills/beads-task-planning/agents/openai.yaml",
    template: ".agents/skills/beads-task-planning/agents/openai.yaml",
    description: "Codex UI metadata for the Beads task-planning skill.",
  },
  beadsSetup: {
    path: "scripts/setup-beads.mjs",
    template: "scripts/setup-beads.mjs",
    description:
      "Idempotent setup script that appends Beads guidance without replacing existing docs.",
  },
  beadsMarkdownImport: {
    path: "scripts/import-beads-markdown.mjs",
    template: "scripts/import-beads-markdown.mjs",
    description:
      "Deterministic preview-and-apply importer for Markdown checkbox task backlogs.",
  },
  packageJson: {
    path: "package.json",
    template: null,
    description:
      "A starter package.json with runtime-resolved npm package versions.",
  },
  postcssConfig: {
    path: "postcss.config.mjs",
    template: "postcss.config.mjs",
    description:
      "PostCSS configuration for stacks that need Tailwind through PostCSS.",
  },
  angularPostcssConfig: {
    path: ".postcssrc.json",
    template: "postcssrc.json",
    description: "PostCSS configuration for Angular projects using Tailwind.",
  },
  viteConfig: {
    path: "vite.config.ts",
    template: "vite.config.ts",
    description: "Vite configuration for Vite-based frontend projects.",
  },
  astroConfig: {
    path: "astro.config.mjs",
    template: "astro.config.mjs",
    description:
      "Astro configuration for Astro projects using Tailwind through Vite.",
  },
  nuxtConfig: {
    path: "nuxt.config.ts",
    template: "nuxt.config.ts",
    description:
      "Nuxt configuration for Nuxt projects using Tailwind through Vite.",
  },
  tailwindCssEntry: {
    path: "src/styles/index.css",
    template: "styles/tailwind-index.css",
    description: "Tailwind CSS entrypoint for Vite-based frontend projects.",
  },
  scssSkill: {
    path: "ai-docs/skills/scss-implementation.md",
    template: "ai-docs/skills/scss-implementation.md",
    description:
      "A practical skill for implementing maintainable SCSS architecture.",
  },
  tailwindSkill: {
    path: "ai-docs/skills/tailwind-implementation.md",
    template: "ai-docs/skills/tailwind-implementation.md",
    description:
      "A practical skill for implementing maintainable Tailwind CSS.",
  },
  reactSkill: {
    path: "ai-docs/skills/react-best-practices.md",
    template: "ai-docs/skills/react-best-practices.md",
    description:
      "React best practices adapted from performance-focused agent guidance.",
  },
  nextjsSkill: {
    path: "ai-docs/skills/nextjs-best-practices.md",
    template: "ai-docs/skills/nextjs-best-practices.md",
    description:
      "Next.js best practices for component composition, prop design, server/client boundaries, and type safety.",
  },
  angularSkill: {
    path: "ai-docs/skills/angular-best-practices.md",
    template: "ai-docs/skills/angular-best-practices.md",
    description:
      "Angular best practices for architecture, strict TypeScript, RxJS, templates, state, and forms.",
  },
  vueSkill: {
    path: "ai-docs/skills/vue-best-practices.md",
    template: "ai-docs/skills/vue-best-practices.md",
    description:
      "Vue best practices adapted from the official Vue style guide.",
  },
  svelteSkill: {
    path: "ai-docs/skills/svelte-best-practices.md",
    template: "ai-docs/skills/svelte-best-practices.md",
    description: "Svelte best practices adapted from the official Svelte docs.",
  },
  nuxtSkill: {
    path: "ai-docs/skills/nuxt-best-practices.md",
    template: "ai-docs/skills/nuxt-best-practices.md",
    description:
      "Nuxt performance best practices adapted from the official Nuxt docs.",
  },
  astroSkill: {
    path: "ai-docs/skills/astro-best-practices.md",
    template: "ai-docs/skills/astro-best-practices.md",
    description:
      "Astro best practices for imports, component choice, frontmatter reuse, islands, slots, and images.",
  },
  typescriptSkill: {
    path: "ai-docs/skills/typescript-best-practices.md",
    template: "ai-docs/skills/typescript-best-practices.md",
    description:
      "Modern TypeScript guidance for strict, maintainable, type-safe code.",
  },
  flutterSkill: {
    path: "ai-docs/skills/flutter-best-practices.md",
    template: "ai-docs/skills/flutter-best-practices.md",
    description:
      "Flutter best practices for architecture, layout, routing, data, localization, and tests.",
  },
  flutterPubspec: {
    path: "pubspec.yaml",
    template: "flutter/pubspec.yaml",
    description: "A minimal Flutter pubspec for a runnable starter app.",
  },
  flutterMain: {
    path: "lib/main.dart",
    template: "flutter/main.dart",
    description: "Flutter application entrypoint.",
  },
  flutterApp: {
    path: "lib/app.dart",
    template: "flutter/app.dart",
    description: "Minimal Flutter root app widget.",
  },
  cssReset: {
    path: "src/styles/reset.scss",
    template: "styles/reset.scss",
    description: "A practical SCSS reset stylesheet.",
  },
  cssTokens: {
    path: "src/styles/tokens.scss",
    template: "styles/tokens.scss",
    description:
      "SCSS-compatible CSS custom properties for spacing, layout, and foundational sizing.",
  },
  cssUtilities: {
    path: "src/styles/utilities.scss",
    template: "styles/utilities.scss",
    description:
      "A tiny layout-only SCSS utility layer for spacing, alignment, and visibility.",
  },
  cssIndex: {
    path: "src/styles/index.scss",
    template: "styles/index.scss",
    description:
      "A single SCSS entrypoint importing reset, tokens, and utilities.",
  },
  editorconfig: {
    path: ".editorconfig",
    template: ".editorconfig",
    description: "Consistent editor formatting defaults.",
  },
  gitignore: {
    path: ".gitignore",
    template: "gitignore.tpl",
    description: "Common ignore rules for Node, frontend, and AI artifacts.",
  },
  envExample: {
    path: ".env.example",
    template: ".env.example",
    description: "Documented environment variable placeholder.",
  },
};

export const PROMPT_TEMPLATES = {
  "project-kickoff": {
    template: "ai-docs/prompts/project-kickoff.md",
    label: "Project kickoff",
    description: "Orient Codex before a larger task.",
  },
  "feature-implementation": {
    template: "ai-docs/prompts/feature-implementation.md",
    label: "Feature implementation",
    description: "Implement a scoped feature.",
  },
  "bug-investigation": {
    template: "ai-docs/prompts/bug-investigation.md",
    label: "Bug investigation",
    description: "Investigate and fix a bug.",
  },
  "frontend-component": {
    template: "ai-docs/prompts/frontend-component.md",
    label: "Frontend component",
    description: "Create or modify a frontend component.",
  },
  "scss-refactor": {
    template: "ai-docs/prompts/scss-refactor.md",
    label: "Styling refactor",
    description: "Refactor SCSS, CSS, or Tailwind styling.",
  },
  "tailwind-refactor": {
    template: "ai-docs/prompts/scss-refactor.md",
    label: "Tailwind refactor",
    description: "Refactor Tailwind styling.",
  },
  "code-review": {
    template: "ai-docs/prompts/code-review.md",
    label: "Code review",
    description: "Review changes with a bug-finding stance.",
  },
  "test-creation": {
    template: "ai-docs/prompts/test-creation.md",
    label: "Test creation",
    description: "Add focused test coverage.",
  },
};

export const PACKAGE_RECIPES = {
  beads: {
    dependencies: [],
    devDependencies: ["@beads/bd"],
  },
  react: {
    dependencies: ["react", "react-dom"],
    devDependencies: ["@vitejs/plugin-react", "vite"],
  },
  angular: {
    dependencies: [
      "@angular/animations",
      "@angular/common",
      "@angular/compiler",
      "@angular/core",
      "@angular/forms",
      "@angular/platform-browser",
      "@angular/router",
      "rxjs",
      "tslib",
      "zone.js",
    ],
    devDependencies: ["@angular/cli", "@angular/compiler-cli", "typescript"],
  },
  vue: {
    dependencies: ["vue"],
    devDependencies: ["@vitejs/plugin-vue", "vite"],
  },
  svelte: {
    dependencies: ["svelte"],
    devDependencies: ["@sveltejs/vite-plugin-svelte", "vite"],
  },
  nextjs: {
    dependencies: ["next", "react", "react-dom"],
    devDependencies: [],
  },
  nuxt: {
    dependencies: ["nuxt", "vue"],
    devDependencies: [],
  },
  astro: {
    dependencies: ["astro"],
    devDependencies: [],
  },
  tailwind: {
    dependencies: [],
    devDependencies: ["tailwindcss", "@tailwindcss/vite"],
  },
  scss: {
    dependencies: [],
    devDependencies: ["sass"],
  },
  typescript: {
    dependencies: [],
    devDependencies: ["typescript"],
  },
  node: {
    dependencies: [],
    devDependencies: [],
  },
  flutter: {
    dependencies: [],
    devDependencies: [],
  },
};

export const PROJECT_TYPES = {
  webApplication: {
    label: "Web application",
    technologies: ["react", "angular", "vue", "svelte"],
  },
  staticWebsite: {
    label: "Static website",
    technologies: ["astro", "nextjs", "nuxt"],
  },
  mobileApplication: {
    label: "Mobile application",
    technologies: ["flutter"],
  },
};

export const TYPESCRIPT_PROJECT_TYPES = ["webApplication", "staticWebsite"];

export const TYPESCRIPT_TECHNOLOGIES = [
  "react",
  "angular",
  "vue",
  "svelte",
  "astro",
  "nextjs",
  "nuxt",
];

export const REACT_TECHNOLOGIES = ["react", "nextjs"];

export const TECHNOLOGIES = {
  typescript: {
    label: "TypeScript",
    agentNotes: [
      "Follow `ai-docs/skills/typescript-best-practices.md` for TypeScript design and refactors.",
      "Prefer explicit domain types at module boundaries.",
      "Keep `any` out of production code unless it is isolated and explained.",
      "Run the type checker when configured before considering TypeScript work complete; otherwise use the closest configured compile check.",
    ],
    aiDocs: [
      "Record important exported types and cross-package contracts in the architecture notes.",
    ],
  },
  react: {
    label: "React",
    agentNotes: [
      "Follow `ai-docs/skills/react-best-practices.md` before writing, reviewing, or refactoring React UI.",
      "Prefer small components with clear data ownership.",
      "Keep side effects in hooks that make their dependencies explicit.",
      "Preserve accessibility semantics when changing UI.",
    ],
    aiDocs: [
      "Document routing, shared UI primitives, data-loading patterns, and state ownership.",
    ],
  },
  angular: {
    label: "Angular",
    agentNotes: [
      "Follow `ai-docs/skills/angular-best-practices.md` for Angular architecture, RxJS, templates, state, and forms.",
      "Follow Angular conventions for standalone components, services, routing, and dependency injection.",
      "Keep templates accessible and avoid hiding complex logic in markup.",
      "Use Angular testing utilities for component and service behavior.",
    ],
    aiDocs: [
      "Document application structure, shared modules, services, routing, and state-management choices.",
    ],
  },
  vue: {
    label: "Vue",
    agentNotes: [
      "Follow `ai-docs/skills/vue-best-practices.md` for Vue component style, naming, props, templates, and state guidance.",
      "Prefer the project's established Composition API or Options API pattern consistently.",
      "Keep component props, emits, and slots explicit.",
      "Preserve accessibility semantics when changing templates.",
    ],
    aiDocs: [
      "Document component conventions, routing, state ownership, and plugin usage.",
    ],
  },
  svelte: {
    label: "Svelte",
    agentNotes: [
      "Follow `ai-docs/skills/svelte-best-practices.md` for Svelte runes, events, snippets, styling, context, and legacy API decisions.",
      "Keep component state local unless shared state is clearly needed.",
      "Prefer clear reactive declarations over hidden side effects.",
      "Preserve accessibility warnings and semantics.",
    ],
    aiDocs: [
      "Document routing, store usage, component conventions, and build assumptions.",
    ],
  },
  nextjs: {
    label: "Next.js",
    agentNotes: [
      "Follow `ai-docs/skills/nextjs-best-practices.md` for Next.js component design, prop modeling, and server/client boundaries.",
      "Choose Server Components by default and add Client Components only for browser interactivity.",
      "Keep route handlers and server actions narrow, validated, and observable.",
      "Check cache and revalidation behavior when changing data fetching.",
    ],
    aiDocs: [
      "Document app router structure, rendering strategy, cache rules, and deployment assumptions.",
    ],
  },
  nuxt: {
    label: "Nuxt",
    agentNotes: [
      "Follow `ai-docs/skills/nuxt-best-practices.md` for Nuxt performance, route rules, lazy loading, data fetching, and profiling.",
      "Follow Nuxt conventions for pages, layouts, composables, plugins, and server routes.",
      "Check rendering, data fetching, and cache behavior when changing routes.",
      "Keep client-only code isolated where browser APIs are required.",
    ],
    aiDocs: [
      "Document Nuxt modules, rendering strategy, route structure, and deployment assumptions.",
    ],
  },
  tailwind: {
    label: "Tailwind CSS",
    agentNotes: [
      "Use existing design tokens and utilities before adding custom CSS.",
      "Extract repeated utility groups into local components, not global style sprawl.",
    ],
    aiDocs: [
      "Document theme tokens, responsive breakpoints, and any custom plugin usage.",
    ],
  },
  scss: {
    label: "SCSS",
    agentNotes: [
      "Follow `ai-docs/skills/scss-implementation.md` for styling work.",
      "Use CSS custom properties as design tokens and keep selectors flat.",
      "Prefer semantic BEM component classes plus a tiny layout-only utility layer.",
    ],
    aiDocs: [
      "Document SCSS structure, token decisions, utility boundaries, and component styling conventions.",
    ],
  },
  node: {
    label: "Node.js",
    agentNotes: [
      "Keep I/O boundaries explicit and validate external input.",
      "Use structured errors and avoid swallowing operational failures.",
      "Prefer built-in Node APIs before adding dependencies.",
    ],
    aiDocs: [
      "Document runtime version, process model, background jobs, and external services.",
    ],
  },
  astro: {
    label: "Astro",
    agentNotes: [
      "Follow `ai-docs/skills/astro-best-practices.md` for Astro component, island, slot, import, and image decisions.",
      "Prefer static-first pages and add client islands only where interactivity needs them.",
      "Keep content collections and frontmatter schemas documented.",
    ],
    aiDocs: [
      "Document content collections, integrations, and hydration boundaries.",
    ],
  },
  flutter: {
    label: "Flutter",
    agentNotes: [
      "Follow `ai-docs/skills/flutter-best-practices.md` for Flutter architecture, UI, routing, data, and testing work.",
      "Use Flutter as the base mobile technology.",
      "Keep widgets small, composable, and named by product meaning.",
      "Preserve platform accessibility, state ownership, and navigation conventions.",
    ],
    aiDocs: [
      "Document Flutter version, app architecture, state-management approach, routing, and platform-specific setup.",
    ],
  },
};
