# critical-boiler

A pnpm-installable CLI for saving AI tokens on predictable project setup work.

Maintainer release instructions are documented in [RELEASING.md](./RELEASING.md).

`critical-boiler` generates the repetitive seed files that coding agents otherwise keep re-creating from scratch: root-level `AGENTS.md`, technology-aware `ai-docs`, implementation skills, canonical command notes, definition-of-done rules, reusable prompt templates, Tailwind or SCSS setup, design tokens, editor defaults, ignore rules, environment examples, and small framework-specific config files. An optional BCO enhancement adds native-task guidance and a complete role-separated orchestration system for Better Codex Orchestrator.

The point is not novelty. The point is to stop spending expensive AI context on boilerplate that is mostly deterministic. Instead of asking Codex to rediscover “what commands exist?”, “where should components live?”, “what does done mean?”, “how should Tailwind be wired for this stack?”, or “what should the React/Vue/Angular/etc. guardrails be?” in every new repo, this CLI writes those predictable answers once.

This is a docs-and-starter-files seed, not a full framework scaffold. It can create package metadata, styling foundations, and small tool config files, but framework entrypoints such as Angular `src/main.ts`, Astro pages, Next.js `app/`, and Nuxt `app.vue` are documented as expected once the real framework scaffold exists. Flutter is the exception: mobile projects include a minimal runnable `pubspec.yaml`, `lib/main.dart`, and `lib/app.dart`.

## Why This Saves Tokens

The generated files are mostly long-lived project instructions and stack conventions. If an AI agent has to invent them in a conversation, those tokens are paid every time. If `critical-boiler` writes them, the agent can spend its context on the actual product work.

Approximate current output size, measured from the generated seed files and estimated at ~4 characters per token:

| Variant            | Files | Approx. generated tokens |
| ------------------ | ----: | -----------------------: |
| Angular + SCSS     |    16 |                    11.3k |
| Angular + Tailwind |    14 |                     9.4k |
| Astro + SCSS       |    16 |                    10.1k |
| Astro + Tailwind   |    14 |                     8.2k |
| Flutter            |    12 |                     5.6k |
| Next.js + SCSS     |    17 |                    12.5k |
| Next.js + Tailwind |    15 |                    10.7k |
| Nuxt + SCSS        |    16 |                    10.5k |
| Nuxt + Tailwind    |    14 |                     8.6k |
| React + SCSS       |    16 |                    10.5k |
| React + Tailwind   |    14 |                     8.7k |
| Svelte + SCSS      |    16 |                    10.5k |
| Svelte + Tailwind  |    14 |                     8.6k |
| Vue + SCSS         |    16 |                    10.4k |
| Vue + Tailwind     |    14 |                     8.5k |

Across the 15 supported starter variants, that is about **144k tokens** of repeatable setup text and config. A single project usually saves roughly **5.6k-12.5k tokens** of generation work before any real feature work begins. The optional Complete Orchestration System adds 37 BCO files and roughly 15.1k more reusable tokens. The more often a team creates repos or asks agents to review fresh scaffolds, the more this compounds.

Those numbers are intentionally approximate: tokenization varies by model and file content. They are useful as an order-of-magnitude comparison, not as billing math.

## Install

```sh
pnpm add -g @twmw/critical-boiler
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
- `BCO enhancement` is disabled by default. Enabling it opens a second radio selector for the orchestration system; the current choice is `Complete Orchestration System`.
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
critical-boiler ./new-app --tech react --bco-enhancement
critical-boiler --bco-sync --cwd ./existing-bco-project
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
- `--bco-enhancement`: add BCO operating docs and orchestrated agent declarations; disabled by default
- `--bco-orchestration`: select the BCO orchestration system; currently `complete`. Passing this option also enables the enhancement.
- `--bco-sync`: refresh only Critical Boiler-managed BCO docs, skills, role declarations, prompts, registry block, and bounded documentation sections in an existing project. This also enables the enhancement.
- `--force, -f`: overwrite existing files
- `--dry-run`: preview planned writes
- `--cwd`: choose the target directory
- `--config, -c`: read options from a JSON config file

Existing files are skipped by default. The BCO enhancement appends uniquely marked sections to existing agent and AI documentation and safely adds its agent registry to an existing `.codex/config.toml`. Existing agent IDs are never replaced implicitly; a collision fails with a clear error. Use `--bco-sync` to update only versioned, Critical Boiler-managed BCO assets while preserving unrelated project files and non-BCO Codex configuration. Legacy 2.0 extension blocks are upgraded when their generated boundary can be identified safely. Use `--force` only when you explicitly want to overwrite the entire generated file set, including project-owned files and the complete Codex agent registry.

## Package JSON

Non-mobile project plans generate a starter `package.json` unless one already exists. Existing files are skipped by default. Mobile applications are the exception: when `--project-type mobileApplication` is selected, the CLI does not generate `package.json` because Flutter projects are not npm projects. Instead, it generates a minimal Flutter `pubspec.yaml`, `lib/main.dart`, and `lib/app.dart`.

Dependency names are derived from selected technologies. Before writing the file, the CLI queries npm with `npm view <package-name> versions --json`, chooses the latest stable published version, and writes that exact version into `dependencies` or `devDependencies`. The BCO enhancement adds no runtime dependency or repository-local task service.

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

## BCO Enhancement

The BCO enhancement is opt-in. Enable it during guided setup or pass `--bco-enhancement`. Contract version 2.6.2 generates 37 managed BCO assets. The current `complete` orchestration system follows a defensive role topology and versioned phase contract:

- `developer_orchestrator` is the root agent and the main orchestrator selected when the project is registered in BCO.
- Frontend and backend orchestrators own their domain pipelines.
- Each domain can use planner, coder, tester, independent reviewer, and documenter roles. The role policy is an admission backstop, not a roster; only roles required by the task, risk, and current evidence are launched.
- Automation plans use exact configured role IDs and explicit `afterRoles` edges for every unconditionally sequential phase, so BCO can project the same planner → coder → tester → reviewer graph it enforces.
- A domain runs one required specialist phase at a time by default: plan when needed, implement, document under one owner, verify a stable tree, independently review that exact tree, correct through the original owner, integrate, and run the merged-tree gate.
- Planners and reviewers are read-only. Coders, documenters, and testers require settled predecessor evidence plus exact non-overlapping path ownership before writing.
- Planner acceptance and closure-matrix rows keep stable IDs through tester assertion evidence and independent review; a broad green suite cannot hide an unproved row.
- Build, E2E, formatter, codegen, migration, database, browser-server, port, and Git resources have one explicit owner at a time. The tester owns final verification and any browser-server lifecycle.
- Generated `.codex/agents/*.toml` files define model, reasoning, sandbox, and role loading.
- Generated `.codex/prompts/agents/*.md` files define task-bounded role contracts.
- `.agents/skills/bco-task-orchestration/SKILL.md` defines the reusable native-task workflow.
- `.agents/skills/bco-project-planning/SKILL.md` turns an operator-authorized project brief into a validated native-task draft with stable keys, explicit dependency edges, capability prerequisites, observable acceptance, verification, resources, and Git delivery evidence.
- `ai-docs/bco-task-management.md`, `ai-docs/bco-project-planning.md`, `ai-docs/bco-orchestration-policy.md`, `ai-docs/bco-automation-readiness.md`, and `ai-docs/bco-next-action-policy.md` define task, planning, capability, delivery, NextWorkflowPlan, and Experimental Brain behavior.
- Marked sections are added to `AGENTS.md`, `ai-docs/README.md`, `ai-docs/commands.md`, and `ai-docs/definition-of-done.md`.

Critical Boiler prepares the repository side only. After generation, register the project root in BCO, choose its native task system, and select `developer_orchestrator`. Invoke `$bco-project-planning` for operator-authorized bootstrap, backlog restructuring, or adoption of an older native catalog. The skill emits BCO's exact schema-versioned JSON and applies it only through BCO preview/validate/apply capabilities; otherwise it returns `draft_only` for operator paste. Existing-task adoption starts from BCO's exact catalog export and never guesses IDs, versions, or fingerprints. After apply, native dependency relationships and automation readiness must be reread before automatic chaining is enabled.

The planning readiness gate makes native `blocked-by` edges—not phrases such as “Task 2”—the execution graph. Prose dependency language is a review advisory rather than a brittle deterministic rejection. Browser-critical tasks still declare a working repository E2E runner such as Playwright or an exposed browser-control capability. If neither exists, the plan adds an enabling predecessor or remains non-ready; a build is not browser evidence.

BCO owns claims, injected task capabilities, evidence, completion, and persisted next-workflow decisions. Workflow agents return evidence for their assigned work; BCO's separate read-only AI governor decides what follows after terminal settlement.

Ordinary failed verification, rejected review, or exhaustion of one bounded repair wave remains `in-progress` with exact evidence for governor recovery. Workflow agents do not classify or clear `authority-conflict`; that state is reserved for operator/governor authority.

Experimental Brain does not change the generated plan contract or agent permissions. With Brain off, BCO waits for manual launch of its persisted decision. With Brain on, it executes the same decision automatically through the normal claim, approval, sandbox, permission, concurrency, and recovery boundaries.

Automation-contract freshness follows only the task definition used by orchestration; lifecycle bookkeeping, comments, evidence, and claims do not stale it. Real definition changes remain one operator-owned **Prepare automation** action. Container finalization is a root-only read-only audit after BCO validates child lifecycle; it does not launch a specialist pipeline or create another Git delivery.

### Updating an existing BCO project

Preview the BCO-only refresh, then apply it:

```sh
critical-boiler --bco-sync --cwd ./your-project --dry-run
critical-boiler --bco-sync --cwd ./your-project
```

The sync overwrites dedicated Critical Boiler-managed BCO templates, replaces bounded managed sections and the BCO registry block, and leaves baseline architecture, source, package, styling, and unrelated Codex configuration untouched. Keep both generated start/end markers intact so later versions can update the section safely.

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
  "bcoEnhancement": true,
  "bcoOrchestration": "complete",
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
