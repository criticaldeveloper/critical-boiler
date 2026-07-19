# critical-boiler

A pnpm-installable CLI for saving AI tokens on predictable project setup work.

Maintainer release instructions are documented in [RELEASING.md](./RELEASING.md).

`critical-boiler` generates the repetitive seed files that coding agents otherwise keep re-creating from scratch: root-level `AGENTS.md`, technology-aware `ai-docs`, implementation skills, canonical command notes, definition-of-done rules, Beads task planning, reusable prompt templates, Tailwind or SCSS setup, design tokens, editor defaults, ignore rules, environment examples, and small framework-specific config files.

The point is not novelty. The point is to stop spending expensive AI context on boilerplate that is mostly deterministic. Instead of asking Codex to rediscover “what commands exist?”, “where should components live?”, “what does done mean?”, “how should Tailwind be wired for this stack?”, or “what should the React/Vue/Angular/etc. guardrails be?” in every new repo, this CLI writes those predictable answers once.

This is a docs-and-starter-files seed, not a full framework scaffold. It can create package metadata, styling foundations, and small tool config files, but framework entrypoints such as Angular `src/main.ts`, Astro pages, Next.js `app/`, and Nuxt `app.vue` are documented as expected once the real framework scaffold exists. Flutter is the exception: mobile projects include a minimal runnable `pubspec.yaml`, `lib/main.dart`, and `lib/app.dart`.

## Why This Saves Tokens

The generated files are mostly long-lived project instructions and stack conventions. If an AI agent has to invent them in a conversation, those tokens are paid every time. If `critical-boiler` writes them, the agent can spend its context on the actual product work.

Approximate current output size, measured from the generated seed files and estimated at ~4 characters per token:

| Variant            | Files | Approx. generated tokens |
| ------------------ | ----: | -----------------------: |
| Angular + SCSS     |    16 |                    11.2k |
| Angular + Tailwind |    14 |                     9.3k |
| Astro + SCSS       |    16 |                    10.1k |
| Astro + Tailwind   |    14 |                     8.1k |
| Flutter            |    12 |                     5.5k |
| Next.js + SCSS     |    17 |                    12.4k |
| Next.js + Tailwind |    15 |                    10.6k |
| Nuxt + SCSS        |    16 |                    10.4k |
| Nuxt + Tailwind    |    14 |                     8.5k |
| React + SCSS       |    16 |                    10.4k |
| React + Tailwind   |    14 |                     8.7k |
| Svelte + SCSS      |    16 |                    10.4k |
| Svelte + Tailwind  |    14 |                     8.5k |
| Vue + SCSS         |    16 |                    10.4k |
| Vue + Tailwind     |    14 |                     8.5k |

Across the 15 supported starter variants, that is about **143k tokens** of repeatable setup text and config. A single project usually saves roughly **5.5k-12.4k tokens** of generation work before any real feature work begins. The more often a team creates repos or asks agents to review fresh scaffolds, the more this compounds.

Those numbers are intentionally approximate: tokenization varies by model and file content. They are useful as an order-of-magnitude comparison, not as billing math.

## Install

```sh
pnpm add -g @critical/critical-boiler
```

The intended workflow is to install the CLI globally, move into the project you want Codex to work on, and run `critical-boiler` there:

```sh
cd path/to/your-project
critical-boiler
```

When the target is not already inside a Git worktree, Critical Boiler initializes it with `git init -b main`. Existing repositories and their current branches are preserved.

This writes the files into the current project folder. `AGENTS.md` is generated at the repository root, where Codex expects project instructions. Supporting skills, project notes, a technology-aware architecture map, canonical command guidance, and a definition of done are generated under `ai-docs/`. Reusable prompt templates stay inside the CLI and are available through `critical-boiler prompt`.

When the generated file plan includes `package.json`, the CLI resolves real published npm versions before writing it by running:

```sh
npm view <package-name> versions --json
```

It writes exact versions from npm instead of `latest` or guessed versions.

When run from a real terminal without direct technology options, `critical-boiler` starts the guided setup automatically.

Guided setup uses keyboard selectors:

- `Project type` is a radio selector.
- `Technology` is a radio selector filtered by project type.
- Web applications and static websites always include TypeScript automatically.
- Mobile projects skip technology selection and use Flutter as the base technology.
- Mobile projects also skip web styling questions.
- Mobile projects generate a minimal Flutter scaffold instead of `package.json`.
- Beads task planning is enabled by default and can be disabled during guided setup.
- Single-choice questions use radio selectors.
- Use arrow keys to move.
- Use Enter to confirm.

During local development from this repository:

```sh
pnpm install
pnpm link --global
critical-boiler --help
```

## Usage

```sh
critical-boiler [target-folder] [options]
```

When no target folder is provided, the CLI writes into the current working directory.

Examples:

```sh
critical-boiler --tech react,tailwind
critical-boiler
critical-boiler ./new-api --tech node,typescript
critical-boiler ./docs-site --project-type staticWebsite --tech astro
critical-boiler ./mobile-app --project-type mobileApplication
critical-boiler prompt feature-implementation
critical-boiler --dry-run --tech react,tailwind
```

## Generated Files

The CLI derives the file plan from `--project-type`, `--tech`, and the guided setup styling choices.

By default it writes `AGENTS.md`, `ai-docs/README.md`, `ai-docs/architecture.md`, `ai-docs/commands.md`, `ai-docs/definition-of-done.md`, `.editorconfig`, `.gitignore`, `.env.example`, and a starter `package.json` for non-mobile projects. Selected technologies add their matching skill docs. Frontend projects also receive Tailwind guidance when `tailwind` is selected, or the SCSS skill and starter styles otherwise.

Run this to see the full catalog:

```sh
critical-boiler --list
```

## Options

- `--tech, -t`: comma-separated technologies such as `react,tailwind` or `astro`. TypeScript is added automatically for web applications and static websites.
- `--project-type`: optional metadata for config, one of `webApplication`, `staticWebsite`, or `mobileApplication`
- `--no-standard-scss`: skip generated SCSS reset, tokens, utilities, and entrypoint
- `--no-beads`: disable the Beads package, project skill, setup script, and workflow documentation
- `--force, -f`: overwrite existing files
- `--dry-run`: preview planned writes
- `--cwd`: choose the target directory
- `--config, -c`: read options from a JSON config file

Existing files are skipped by default. Beads is the exception: its marked guidance blocks and missing `package.json` entries are merged additively without replacing existing instructions, dependencies, or scripts. Use `--force` when you explicitly want to overwrite generated files.

## Package JSON

Non-mobile project plans generate a starter `package.json` unless one already exists. Existing files are skipped by default. Mobile applications are the exception: when `--project-type mobileApplication` is selected, the CLI does not generate `package.json` because Flutter projects are not npm projects. Instead, it generates a minimal Flutter `pubspec.yaml`, `lib/main.dart`, and `lib/app.dart`.

Dependency names are derived from selected technologies. Before writing the file, the CLI queries npm with `npm view <package-name> versions --json`, chooses the latest stable published version, and writes that exact version into `dependencies` or `devDependencies`. Beads-enabled Node projects include an exact `@beads/bd` development dependency and idempotent `beads:*` scripts by default.

Web applications and static websites always include TypeScript. You do not need to pass `typescript` in `--tech` for React, Angular, Vue, Svelte, Astro, Next.js, or Nuxt; the generated `package.json` includes `typescript` in `devDependencies` automatically.

Examples:

- React: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
- Angular: Angular runtime packages, `rxjs`, `zone.js`, Angular CLI/compiler tooling
- Vue: `vue`, `vite`, `@vitejs/plugin-vue`
- Svelte: `svelte`, `vite`, `@sveltejs/vite-plugin-svelte`
- Static site tools: `astro`, `next`, or `nuxt` depending on selection
- Tailwind: `tailwindcss` plus the framework integration package, such as `@tailwindcss/vite` for Vite stacks or `@tailwindcss/postcss` with `postcss` for Angular and Next.js
- SCSS: `sass`
- TypeScript: `typescript`
- Mobile application: Flutter is selected as the base technology, no `package.json` is generated, and a minimal Flutter scaffold is created

## Architecture Doc

The CLI generates `ai-docs/architecture.md` as a concise project map for coding agents. It includes technology-aware guidance for:

- app entrypoints
- routing structure
- feature and module boundaries
- shared UI and components
- data and API layer
- state management
- styling system
- test locations

The content adapts to the selected stack. For example, Next.js projects mention App Router files and Server Components, Flutter projects mention `lib/main.dart`, feature layers, widgets, and `test/`, and Vite-style frontend projects mention `src/main.*`, `src/App.*`, `vite.config.*`, feature folders, and UI test locations.

## Commands And Verification

The CLI generates `ai-docs/commands.md` as the canonical command list for agents. It includes:

- the package manager install command
- configured starter scripts such as `dev`, `build`, and `preview`
- a short "not configured yet" section for checks such as typecheck, lint, test, E2E, and format when the starter does not create those scripts

Agents are instructed not to guess commands. If a command is missing or wrong, they should inspect the repo, update `ai-docs/commands.md`, and then run the corrected command.

## Definition Of Done

The CLI generates `ai-docs/definition-of-done.md` as the completion standard for agent work. It covers:

- scope control
- project consistency
- quality checks
- documentation expectations
- verification expectations
- final handoff content

`AGENTS.md` and the reusable prompt templates tell agents to check this file before handing work back.

## Flutter Skill

When `--project-type mobileApplication` is selected, Flutter is selected automatically and the CLI generates a minimal Flutter scaffold plus `ai-docs/skills/flutter-best-practices.md`. The same skill can be included explicitly with the `flutterDocs` group.

The skill adapts the supplied Flutter summaries into concise project guidance for layered architecture, responsive layout, layout error fixes, declarative routing, networking, JSON serialization, localization, widget tests, integration tests, and verification.

## TypeScript Skill

When TypeScript is selected, the CLI generates `ai-docs/skills/typescript-best-practices.md`. Web applications and static websites include TypeScript automatically, so they also receive this skill by default.

The skill adapts the supplied TypeScript summary into concise agent guidance for strict compiler expectations, domain types, runtime validation, generics, framework-specific frontend typing, error handling, imports, and migration work.

Frontend component prompts automatically tell agents to read the TypeScript skill when it is present.

## React Skill

When React is selected, the CLI generates `ai-docs/skills/react-best-practices.md`. The same skill is included for Next.js because Next.js projects share React component and rendering rules, but Next.js-specific framework guidance lives in `ai-docs/skills/nextjs-best-practices.md`.

The skill adapts the supplied React best-practices summary into concise project guidance for agents. It prioritizes eliminating async waterfalls, keeping bundles analyzable, protecting server-side behavior, deduplicating client data fetching, reducing avoidable re-renders, and preserving accessibility while building components.

The frontend component prompt automatically tells agents to read this React skill when it is present.

## Next.js Skill

When Next.js is selected, the CLI generates `ai-docs/skills/nextjs-best-practices.md` in addition to the React and TypeScript skills. The skill adapts the supplied Next.js guidance into project rules for specialized components, compound components, config objects, composition, slots, strict prop modeling, custom hooks, server actions, Server Components, and client boundaries.

## Angular Skill

When Angular is selected, the CLI generates `ai-docs/skills/angular-best-practices.md`. The skill adapts the supplied Angular concepts into concise project guidance for feature structure, smart/dumb components, strict TypeScript, OnPush change detection, RxJS, templates, service mocking, facades, state, forms, and component styles.

## Vue Skill

When Vue is selected, the CLI generates `ai-docs/skills/vue-best-practices.md`. The skill adapts the official Vue style guide into concise project guidance for component naming, props, emits, templates, computed state, parent-child communication, state management, scoped styling, and cautionary patterns.

## Svelte Skill

When Svelte is selected, the CLI generates `ai-docs/skills/svelte-best-practices.md`. The skill adapts the official Svelte best-practices guidance into concise project rules for runes, derived state, effects, props, events, snippets, keyed each blocks, styling, context, async features, and avoiding legacy APIs.

## Nuxt Skill

When Nuxt is selected, the CLI generates `ai-docs/skills/nuxt-best-practices.md`. The skill adapts the official Nuxt performance guide into concise project rules for `NuxtLink`, route rules, hybrid rendering, lazy loading, lazy hydration, `useFetch`, `useAsyncData`, Nuxt Image, Nuxt Fonts, Nuxt Scripts, profiling, and common performance pitfalls.

## Astro Skill

When Astro is selected, the CLI generates `ai-docs/skills/astro-best-practices.md`. The skill adapts the supplied Astro concepts into concise project guidance for `@` imports, avoiding repeated markup, preferring `.astro` components, using framework islands only when justified, composing with slots, and preserving Astro image optimization.

## SCSS Starter

Frontend project plans follow a deliberately small styling architecture when Tailwind is not selected:

- `src/styles/reset.scss`: modern reset
- `src/styles/tokens.scss`: spacing and layout custom properties
- `src/styles/utilities.scss`: layout-only utilities
- `src/styles/index.scss`: imports the SCSS starter files in order

The utility layer is intentionally limited to display, layout, alignment, spacing, width, height, visibility, stack, cluster, section, and container helpers. Colors, typography, shadows, borders, branding, and component visuals should stay in semantic component classes such as BEM-style `.pricing-card` and `.pricing-card__title`.

The CLI also generates `ai-docs/skills/scss-implementation.md`, a practical skill for agents and developers implementing SCSS with tokens, BEM, flat selectors, explicit states, logical properties, container queries, and tiny utilities.

In guided setup, choosing Tailwind copies `ai-docs/skills/tailwind-implementation.md`, adapts the `critical-boiler prompt tailwind-refactor` template for Tailwind refactors, and skips the SCSS skill and standard SCSS files. Vite-based React, Vue, and Svelte projects receive `vite.config.ts` and `src/styles/index.css`; Astro receives `astro.config.mjs`; Nuxt receives `nuxt.config.ts`; Angular receives `.postcssrc.json`; Next.js receives `postcss.config.mjs`. Tailwind stacks also receive `src/styles/index.css` with `@import "tailwindcss";`; framework-specific docs explain where to wire or import that file once the full scaffold exists. Choosing no Tailwind enables the SCSS guidance and adds `sass` to `package.json`. You can then choose whether to include the standard SCSS utility files.

## Beads Task Planning

Beads is enabled by default. The generated integration treats its dependency graph as the authoritative source for planned work and follows the closed loop described in the [CriticalDeveloper Beads orchestration article](https://blog.criticaldeveloper.com/posts/2026-07-18-how-to-integrate-beads-into-an-ai-orchestrated-system-for-agentic-task-planning/): plan, create tasks, execute, report evidence, and replan from actual state.

Enabled projects receive:

- `@beads/bd` as an exact development dependency for Node-based projects
- `.agents/skills/beads-task-planning/SKILL.md` with a discoverable Codex workflow
- `ai-docs/beads.md` with lifecycle, taxonomy, dependency, evidence, and role policies
- `scripts/setup-beads.mjs`, an idempotent initializer
- `scripts/import-beads-markdown.mjs`, a preview-first idempotent Markdown backlog importer
- `pnpm-workspace.yaml` approval limited to the native installer required by `@beads/bd`
- additive marked sections in `AGENTS.md`, `ai-docs/README.md`, and `ai-docs/commands.md`
- `beads:setup`, `beads:prime`, `beads:ready`, `beads:status`, and `beads:import-md` package scripts
- automatic Git initialization on a `main` branch for standalone non-repository targets

The setup logic never replaces an existing `AGENTS.md` section. It appends a uniquely marked block once and leaves existing instructions intact. Existing `package.json` files are parsed and receive only missing Beads dependency and script entries; existing values win on name collisions.

Bootstrap a generated Node project in this order:

```sh
pnpm install
pnpm beads:setup
pnpm beads:prime
pnpm beads:ready
```

Critical Boiler generates the integration files but does not install dependencies, create `pnpm-lock.yaml`, or initialize `.beads/`. Run `bd ping --json` for a lightweight database health check if setup or priming appears stuck.

Flutter projects do not generate `package.json`; install Beads globally with `npm install -g @beads/bd`, then run `node scripts/setup-beads.mjs`. Pass `--no-beads` or set `"beads": false` in `critical-boiler.config.json` to opt out completely.

To migrate a large Markdown backlog, generate a review report first and apply it explicitly:

```sh
pnpm beads:import-md PROJECT_TASKS.md
pnpm beads:import-md PROJECT_TASKS.md --apply
```

The importer accepts checkbox tasks, preserves nested relationships, supports explicit dependency and taxonomy annotations, skips completed work by default, enforces a task-count limit, and stores stable fingerprints in Beads metadata for idempotent reruns.

## Prompt Kit

Prompt templates are packaged with the CLI instead of copied into each project. Run a prompt command to choose a template, fill its variables, print the final prompt, and copy it to the clipboard:

```sh
critical-boiler prompt feature-implementation
critical-boiler prompt --list
```

Available templates:

- `project-kickoff`
- `feature-implementation`
- `bug-investigation`
- `frontend-component`
- `tailwind-refactor`
- `scss-refactor`
- `code-review`
- `test-creation`

The frontend component prompt automatically points to the React, Tailwind, or SCSS skills that were generated for the project.

The styling refactor prompt explicitly tells Codex to invoke the relevant Tailwind or SCSS implementation skill before editing styles.

## Config File

The CLI reads `critical-boiler.config.json` from the target folder when it exists. You can also pass a custom path:

```sh
critical-boiler --config ./starter.config.json
```

Example:

```json
{
  "projectType": "webApplication",
  "tech": ["typescript", "react", "tailwind"],
  "standardScss": true,
  "beads": true,
  "paths": {
    "packageJson": "package.json",
    "cssReset": "app/styles/reset.scss",
    "cssTokens": "app/styles/tokens.scss",
    "cssUtilities": "app/styles/utilities.scss",
    "cssIndex": "app/styles/index.scss"
  }
}
```

## Available Technology Hints

- `typescript`
- `react`
- `angular`
- `vue`
- `svelte`
- `nextjs`
- `nuxt`
- `tailwind`
- `scss`
- `node`
- `astro`
- `flutter`

Technology hints customize the generated `AGENTS.md`, `ai-docs/README.md`, `ai-docs/architecture.md`, and CLI prompt templates.

Guided technology choices are grouped by project type:

- Web application: React, Angular, Vue, Svelte, plus TypeScript automatically
- Static website: Astro, NextJS, Nuxt, plus TypeScript automatically
- Mobile application: Flutter is selected automatically, `package.json` is skipped, and a minimal Flutter scaffold is generated
