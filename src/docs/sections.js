import { PROMPT_TEMPLATES, REACT_TECHNOLOGIES } from "../catalog.js";
import { DEFAULT_PACKAGE_MANAGER, packageScriptsForTechnologies, packageTechnologies } from "../package-json.js";
import { isFrontendProject, selectedFileKeys } from "../project-plan.js";
import { unique } from "../utils.js";

export function listLines(items) {
  if (items.length === 0)
    return "- Add technology-specific guidance as the project takes shape.";
  return unique(items)
    .map((item) => `- ${item}`)
    .join("\n");
}

export function commandsInstall(args) {
  if (args.tech.includes("flutter")) {
    return "`flutter pub get`";
  }

  return "`pnpm install`";
}

export function commandsDev(args) {
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));

  if (args.tech.includes("flutter")) {
    return "`flutter run`";
  }

  if (scripts.dev) {
    return `\`pnpm dev\` (${scripts.dev})`;
  }

  return "Not configured yet.";
}

export function commandsTypecheck(args) {
  if (args.tech.includes("flutter")) {
    return "`flutter analyze`";
  }

  return "Not configured yet.";
}

export function commandsLint(args) {
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));

  if (args.tech.includes("flutter")) {
    return "`flutter analyze`";
  }

  if (scripts.lint) {
    return `\`pnpm lint\` (${scripts.lint})`;
  }

  return "Not configured yet.";
}

export function commandsTest(args) {
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));

  if (args.tech.includes("flutter")) {
    return "`flutter test`";
  }

  if (scripts.test && !scripts.test.includes("No test script")) {
    return `\`pnpm test\` (${scripts.test})`;
  }

  return "Not configured yet.";
}

export function commandsBuild(args) {
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));

  if (args.tech.includes("flutter")) {
    return "`flutter build <target>` after choosing the target platform.";
  }

  if (scripts.build) {
    return `\`pnpm build\` (${scripts.build})`;
  }

  return "Not configured yet.";
}

export function commandsE2e(args) {
  if (args.tech.includes("flutter")) {
    return "`flutter test integration_test` once integration tests exist.";
  }

  if (isFrontendProject(args)) {
    return "Not configured yet.";
  }

  return "Not configured yet.";
}

export function commandsFormat(args) {
  if (args.tech.includes("flutter")) {
    return "`dart format .`";
  }

  return "Not configured yet.";
}

export function commandsPreview(args) {
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));

  if (scripts.preview) {
    return `\`pnpm preview\` (${scripts.preview})`;
  }

  return "Not configured yet.";
}

export function commandsStart(args) {
  const scripts = packageScriptsForTechnologies(packageTechnologies(args));

  if (scripts.start) {
    return `\`pnpm start\` (${scripts.start})`;
  }

  return "Not configured yet.";
}

export function commandsRows(args) {
  const rows = [
    ["Install", commandsInstall(args)],
    ["Dev", commandsDev(args)],
    ["Typecheck", commandsTypecheck(args)],
    ["Lint", commandsLint(args)],
    ["Test", commandsTest(args)],
    ["Build", commandsBuild(args)],
    ["Start", commandsStart(args)],
    ["Preview", commandsPreview(args)],
    ["E2E", commandsE2e(args)],
    ["Format", commandsFormat(args)],
  ].filter(([, command]) => command !== "Not configured yet.");

  return rows.map(([task, command]) => `| ${task} | ${command} |`).join("\n");
}

export function commandsMissingNotes(args) {
  const checks = args.tech.includes("flutter")
    ? [
        ["preview", commandsPreview(args)],
      ]
    : [
        ["typecheck", commandsTypecheck(args)],
        ["lint", commandsLint(args)],
        ["test", commandsTest(args)],
        ["preview", commandsPreview(args)],
        ["e2e", commandsE2e(args)],
        ["format", commandsFormat(args)],
      ];
  const missing = checks
    .filter(([, command]) => command === "Not configured yet.")
    .map(([task]) => `\`${task}\``);

  if (missing.length === 0) {
    return "- All expected starter commands for this stack are configured.";
  }

  if (args.tech.includes("flutter")) {
    return `- ${formatMissingList(missing)} ${missing.length === 1 ? "is" : "are"} not configured for this Flutter starter.
- Add additional commands only when the project has chosen the corresponding Flutter tool, target platform, or test strategy.
- Document new commands in this file and update \`pubspec.yaml\`, Flutter tool config files, or project docs when those files own the change.`;
  }

  return `- ${formatMissingList(missing)} ${missing.length === 1 ? "is" : "are"} not configured in the starter scripts.
- Add them only when the project has chosen the corresponding tool, then update this file and \`package.json\`.
- Use the package manager declared in \`package.json\` (${DEFAULT_PACKAGE_MANAGER}) for new commands unless the repository intentionally changes package managers.`;
}

export function formatMissingList(items) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export function commandsVerificationNotes(args) {
  const notes = [
    "- Agents must use this file as the source of truth for project commands.",
    "- If a command is missing, inspect the repo and update this file before relying on a guessed command.",
    "- Report every command run in the final response, including failures and skipped checks.",
  ];

  if (args.tech.includes("flutter")) {
    notes.push(
      "- For Flutter UI changes, prefer widget tests, integration tests, or emulator/device checks depending on the risk of the change.",
    );
    return notes.join("\n");
  }

  if (isFrontendProject(args)) {
    notes.push(
      "- For UI changes, include a browser-rendered check when practical and document the exact command or tool used.",
    );
  }

  return notes.join("\n");
}

export function commandsTaskVerificationSection(args) {
  if (args.tech.includes("flutter")) {
    return `- Documentation-only change: no automated command is required unless generated docs or examples need validation.
- Type-only/model change: run \`flutter analyze\` and focused unit tests when relevant.
- Widget/UI change: run the smallest relevant widget test, then use an emulator/device check when visual behavior matters.
- Data/API change: run focused unit tests for repositories, services, serialization, and error handling.
- Routing/navigation change: verify affected navigation with widget tests, integration tests, or an emulator/device flow.
- Build/config change: run \`flutter analyze\` and the relevant \`flutter build <target>\` once the target platform is known.`;
  }

  return `- Documentation-only change: no automated command is required unless generated docs, links, or examples need validation.
- Type-only change: run the typecheck command when configured.
- UI/component change: run the smallest relevant build, test, or browser-rendered check available.
- Data/API change: run focused tests or integration checks when configured.
- Routing change: verify affected routes with the dev server, preview build, or configured route tests.
- Build/config change: run the relevant build or dry-run command.`;
}

export function agentVerificationExpectations(args) {
  if (args.tech.includes("flutter")) {
    return `- Run the smallest meaningful automated tests for the touched area.
- Add or update test files when changing behavior, fixing bugs, or covering important edge cases.
- For Flutter UI changes, prefer widget tests for behavior and emulator/device checks when rendered layout, platform behavior, or navigation matters.
- Use integration tests for important flows that cross screens, persistence, platform services, or app startup.
- Report every verification command run. If a relevant Flutter check could not run, explain the blocker clearly.`;
  }

  return `- Run the smallest meaningful automated tests for the touched area.
- Add or update test files when changing behavior, fixing bugs, or covering important edge cases.
- For frontend UI changes, verify the result with Playwright in addition to unit/component tests when a browser-rendered check is practical.
- Use Playwright to check that important views render, interactions work, responsive states are sane, and there are no obvious visual overlaps or broken states.
- Report every verification command run. If a relevant test or Playwright check could not run, explain the blocker clearly.`;
}

export function architectureEntrypointsSection(args) {
  const tech = args.tech;

  if (tech.includes("flutter")) {
    return `- \`lib/main.dart\`: Flutter app bootstrap.
- \`lib/app.dart\`: root \`MaterialApp\` setup.
- \`pubspec.yaml\`: package, asset, and Flutter SDK configuration.

Update this section when the app introduces flavor-specific entrypoints or platform-specific startup code.`;
  }

  if (tech.includes("nextjs")) {
    return `Expected once the Next.js app scaffold exists:

- \`app/layout.tsx\`: root App Router layout, metadata, fonts, and global providers.
- \`app/page.tsx\`: root route.
- \`app/api/**/route.ts\`: Route Handlers when this project exposes backend endpoints.
- \`next.config.*\`: framework and build configuration.

Prefer Server Components by default and document any root providers that require client-side execution.`;
  }

  if (tech.includes("nuxt")) {
    return `Expected once the Nuxt app scaffold exists:

- \`app.vue\`: Nuxt application shell when present.
- \`pages/\`: file-based page entrypoints.
- \`layouts/\`: reusable page shells.
- \`server/\`: server routes, middleware, and server utilities.
- \`nuxt.config.*\`: modules, runtime config, rendering, and route rules.

Keep client-only startup code isolated in plugins or components that explicitly need browser APIs.`;
  }

  if (tech.includes("astro")) {
    return `Expected once the Astro site scaffold exists:

- \`src/pages/\`: file-based route entrypoints.
- \`src/layouts/\`: shared page layouts.
- \`src/components/\`: Astro components and justified framework islands.
- \`astro.config.*\`: integrations, output mode, aliases, and build settings.

Prefer static-first pages and document any interactive islands that need client hydration.`;
  }

  if (tech.includes("angular")) {
    return `Expected once the Angular app scaffold exists:

- \`src/main.ts\`: Angular bootstrap.
- \`src/app/app.config.ts\` or \`src/app/app.module.ts\`: root providers and application wiring.
- \`src/app/app.routes.ts\`: top-level routes when routing is enabled.
- \`angular.json\`: workspace, build, test, and style configuration.

Keep standalone component, provider, and routing decisions documented here as the app grows.`;
  }

  if (tech.includes("react")) {
    return `Expected once the Vite app scaffold exists:

- \`src/main.tsx\`, \`src/main.ts\`, or \`src/main.js\`: client app bootstrap.
- \`src/App.*\`: root application component when this project uses one.
- \`index.html\`: Vite HTML shell.
- \`vite.config.*\`: build, plugin, alias, and dev-server configuration.

Document global providers, router setup, and app-wide side effects before adding more of them.`;
  }

  if (tech.includes("vue")) {
    return `Expected once the Vite Vue app scaffold exists:

- \`src/main.ts\` or \`src/main.js\`: creates and mounts the Vue app, usually with \`createApp(App).mount("#app")\`.
- \`src/App.vue\`: root application component.
- \`index.html\`: Vite HTML shell with the app mount element.
- \`vite.config.*\`: Vue plugin, aliases, build options, and dev-server configuration.

Document global plugins, router setup, Pinia or other store setup, and app-wide side effects before adding more of them.`;
  }

  if (tech.includes("svelte")) {
    return `Expected once the Vite Svelte app scaffold exists:

- \`src/main.ts\` or \`src/main.js\`: client app bootstrap and root component mounting.
- \`src/App.svelte\`: root application component.
- \`index.html\`: Vite HTML shell with the app mount element.
- \`vite.config.*\`: Svelte plugin, aliases, build options, and dev-server configuration.

Document global providers, router setup, stores, and app-wide side effects before adding more of them.`;
  }

  if (tech.includes("node")) {
    return `- \`src/index.ts\` or \`src/server.ts\`: Node process entrypoint.
- \`package.json\`: scripts and runtime metadata.
- Configuration should be loaded at the process boundary and passed inward explicitly.

Document long-running workers, scheduled jobs, CLIs, or HTTP servers as they are introduced.`;
  }

  return "- Add the files that start the app, server, CLI, worker, or build-time process.";
}

export function architectureRoutingSection(args) {
  const tech = args.tech;

  if (tech.includes("flutter")) {
    return `- Keep route definitions in a predictable place such as \`lib/router.dart\`, \`lib/app_router.dart\`, or a dedicated routing package setup.
- Prefer named routes or typed router definitions over scattered string literals.
- Document deep links, guarded routes, tab navigation, and platform-specific navigation behavior here.`;
  }

  if (tech.includes("nextjs")) {
    return `- \`app/**/page.tsx\`: route segments and pages.
- \`app/**/layout.tsx\`: nested layouts.
- \`app/**/loading.tsx\`, \`error.tsx\`, and \`not-found.tsx\`: route-level states.
- \`app/api/**/route.ts\`: HTTP endpoints.

Keep route groups, dynamic segments, and caching or revalidation expectations documented near the routes they affect.`;
  }

  if (tech.includes("nuxt")) {
    return `- \`pages/\`: file-based routes.
- \`layouts/\`: shared shells for route groups.
- \`middleware/\`: route middleware.
- \`server/api/\`: API endpoints.

Document route rules, server-side rendering expectations, and lazy-loading decisions when they affect user-visible behavior.`;
  }

  if (tech.includes("astro")) {
    return `- \`src/pages/\`: static and dynamic pages.
- Dynamic routes should document expected params and content/data sources.
- Keep redirects, endpoints, and content collection routing choices documented here.`;
  }

  if (tech.includes("angular")) {
    return `- Prefer route definitions in \`src/app/app.routes.ts\` plus feature-level route files for larger areas.
- Lazy-load feature routes when a feature has meaningful size or ownership.
- Document guards, resolvers, redirects, and route data conventions.`;
  }

  if (tech.includes("react") || tech.includes("vue") || tech.includes("svelte")) {
    return `- Document the router library before adding routes.
- Keep route definitions near \`src/router.*\`, \`src/routes/\`, or the framework's established routing folder.
- Route-level pages should compose feature components rather than contain all feature logic.`;
  }

  if (tech.includes("node")) {
    return `- HTTP route handlers should live in a clear routes or modules folder.
- Keep validation, auth, and business logic outside thin transport handlers.
- Document route prefixes, middleware order, and error response conventions here.`;
  }

  return "- Add the routing convention once the project has pages, screens, API routes, or command handlers.";
}

export function architectureBoundariesSection(args) {
  if (args.tech.includes("flutter")) {
    return `Recommended starting shape:

\`\`\`text
lib/
  features/<feature>/
    data/
    domain/
    presentation/
  shared/
  app/
\`\`\`

- Feature-specific widgets, models, and services stay inside the feature.
- Shared code moves to \`shared/\` only after reuse is real.
- Avoid importing sideways between unrelated feature folders.`;
  }

  if (args.tech.includes("angular")) {
    return `Recommended starting shape:

\`\`\`text
src/app/
  features/<feature>/
  shared/
  core/
\`\`\`

- Feature code owns its components, services, routes, and tests.
- \`core/\` is for singleton app services and app-wide providers.
- \`shared/\` is for reusable UI and utilities with multiple real consumers.`;
  }

  if (args.tech.includes("node")) {
    return `Recommended starting shape:

\`\`\`text
src/
  modules/<domain>/
  shared/
  server/
\`\`\`

- Domain behavior belongs in modules, not transport handlers.
- Keep infrastructure adapters at the edges.
- Shared utilities should be small, stable, and proven by more than one caller.`;
  }

  return `Recommended starting shape:

\`\`\`text
src/
  features/<feature>/
  components/
  lib/
  styles/
  test/
\`\`\`

- Feature-specific code stays in \`features/<feature>/\`.
- Shared components move to \`components/\` only after reuse is real.
- Cross-cutting utilities live in \`lib/\`; keep them framework-aware only when needed.
- Avoid imports between unrelated feature folders unless a documented boundary allows it.`;
}

export function architectureSharedUiSection(args) {
  const selectedFiles = selectedFileKeys(args);

  if (args.tech.includes("flutter")) {
    return `- Shared reusable widgets should live under \`lib/shared/widgets/\` or another documented shared UI folder.
- Feature-only widgets stay inside \`lib/features/<feature>/presentation/\`.
- Reusable theme values belong in the app theme, not scattered widget literals.`;
  }

  if (args.tech.includes("angular")) {
    const stylingNote = selectedFiles.includes("tailwindSkill")
      ? "Use Tailwind utilities through Angular components and directives; extract repeated class combinations into shared components."
      : selectedFiles.includes("scssSkill")
        ? "Use component styles and semantic classes where the project establishes that pattern."
        : "Follow the project's established styling convention.";

    return `- \`src/app/shared/ui/\`: recommended home for reusable primitives such as buttons, dialogs, inputs, tabs, and menus.
- \`src/app/shared/layout/\`: recommended home for app shell, navigation, page chrome, and layout primitives.
- \`src/app/features/<feature>/components/\`: feature-owned UI that should not be reused globally yet.
- ${stylingNote}
- Document reference components in this file once the project has stable examples.`;
  }

  const stylingNote = selectedFiles.includes("tailwindSkill")
    ? "Use Tailwind utilities through established component patterns; extract repeated class combinations into components."
    : selectedFiles.includes("scssSkill")
      ? "Use semantic component classes and colocated component styles where the project establishes that pattern."
      : "Follow the project's established styling convention.";

  return `- \`src/components/ui/\`: recommended home for reusable primitives such as buttons, dialogs, inputs, tabs, and menus.
- \`src/components/layout/\`: recommended home for app shell, navigation, page chrome, and layout primitives.
- \`src/features/<feature>/components/\`: feature-owned UI that should not be reused globally yet.
- ${stylingNote}
- Document reference components in this file once the project has stable examples.`;
}

export function architectureDataLayerSection(args) {
  const tech = args.tech;

  if (tech.includes("flutter")) {
    return `- Keep API clients, repositories, DTOs, and persistence adapters in feature \`data/\` folders or a documented shared data layer.
- Convert external data into domain models before it reaches presentation widgets.
- Document auth, retry, caching, serialization, and error-shape conventions here.`;
  }

  if (tech.includes("nextjs")) {
    return `- Prefer server-side data access in Server Components, Route Handlers, or Server Actions.
- Keep API clients and database access in \`src/lib/\`, \`server/\`, or feature-owned server modules.
- Validate external input at route/action boundaries.
- Document cache, revalidation, auth, and error response conventions here.`;
  }

  if (tech.includes("nuxt")) {
    return `- Use \`server/api/\` and \`server/utils/\` for server-side API behavior.
- Use \`useFetch\` or \`useAsyncData\` consistently for page data.
- Document runtime config, caching, validation, and error response conventions here.`;
  }

  if (tech.includes("astro")) {
    return `- Keep build-time content in content collections or documented data modules.
- Use endpoints only when runtime behavior is actually needed.
- Document content schemas, external API clients, image/data transforms, and deployment assumptions here.`;
  }

  if (tech.includes("angular")) {
    return `- Keep HTTP access in services, with DTO mapping and validation at the boundary when needed.
- Prefer feature-owned services for feature data and shared services only for cross-cutting concerns.
- Document interceptors, auth headers, error handling, and caching conventions here.`;
  }

  if (tech.includes("react") || tech.includes("vue") || tech.includes("svelte")) {
    return `- Keep API clients in \`src/lib/api/\` or feature-owned \`api/\` folders.
- Keep transport details out of presentation components.
- Validate and normalize external data before broad use.
- Document server-state fetching, caching, auth, and error handling conventions here.`;
  }

  if (tech.includes("node")) {
    return `- Keep database, queue, filesystem, and network clients behind explicit adapters.
- Validate external input at the process or transport boundary.
- Use structured errors and document operational error handling, retries, and logging expectations here.`;
  }

  return "- Document where API clients, persistence, validation, auth, caching, and error handling live.";
}

export function architectureStateSection(args) {
  const tech = args.tech;

  if (tech.includes("flutter")) {
    return `- Document the chosen state-management approach before adding broad state dependencies.
- Keep ephemeral widget state local.
- Keep feature state near the owning feature.
- Keep server/cache state behind repositories or a documented state layer.`;
  }

  if (tech.includes("angular")) {
    return `- Prefer local component state for local UI concerns.
- Use services, signals, RxJS streams, or a documented state library for shared feature state.
- Keep observable lifetimes and cleanup explicit.
- Document global state only when multiple features truly depend on it.`;
  }

  if (tech.includes("vue") || tech.includes("nuxt")) {
    return `- Prefer local component state for local UI concerns.
- Use composables for reusable stateful behavior.
- Use Pinia or another documented store only for state shared across routes or features.
- Keep server state and client UI state separate.`;
  }

  if (tech.includes("svelte")) {
    return `- Prefer local component state for local UI concerns.
- Use runes, stores, or context according to the project's established Svelte version and conventions.
- Keep shared state small and named by product meaning.
- Keep server state and client UI state separate.`;
  }

  if (tech.includes("react") || tech.includes("nextjs")) {
    return `- Prefer local component state for local UI concerns.
- Prefer URL/search params for shareable navigation state.
- Use a server-state library or framework data APIs for remote data caching when the project adopts one.
- Add global client state only for cross-route concerns with clear ownership.`;
  }

  return "- Document local state, shared state, server/cache state, URL state, and any chosen state-management library.";
}

export function architectureStylingSection(args) {
  const selectedFiles = selectedFileKeys(args);

  if (args.tech.includes("flutter")) {
    return `- Keep app-wide visual decisions in the Flutter theme.
- Prefer reusable widgets for repeated UI patterns.
- Avoid scattered literal colors, spacing, text styles, and radii when they are part of the product language.
- Document responsive layout and platform-specific visual conventions here.`;
  }

  if (selectedFiles.includes("tailwindSkill")) {
    const setupNotes = [];

    if (args.tech.includes("angular")) {
      setupNotes.push(
        "- Tailwind CSS entrypoint: `src/styles/index.css`. Add it to `angular.json` styles once the Angular scaffold exists.",
      );
    } else if (args.tech.includes("nextjs")) {
      setupNotes.push(
        "- Tailwind CSS entrypoint: `src/styles/index.css`. Import it from `app/layout.*` once the Next.js scaffold exists.",
      );
    } else if (args.tech.includes("astro")) {
      setupNotes.push(
        "- Tailwind CSS entrypoint: `src/styles/index.css`. Import it from the shared Astro layout once the site scaffold exists.",
      );
    } else if (args.tech.includes("nuxt")) {
      setupNotes.push(
        "- Tailwind CSS entrypoint: `src/styles/index.css`, wired through `nuxt.config.ts`.",
      );
    } else if (args.tech.some((technology) => ["react", "vue", "svelte"].includes(technology))) {
      setupNotes.push(
        "- Tailwind CSS entrypoint: `src/styles/index.css`. Import it from the app bootstrap once the Vite scaffold exists.",
      );
    }

    return [
      "- Follow `ai-docs/skills/tailwind-implementation.md`.",
      ...setupNotes,
      "- Prefer configured theme tokens over arbitrary values.",
      "- Keep repeated utility combinations in reusable components.",
      "- Make hover, focus-visible, disabled, aria/data, responsive, dark-mode, and reduced-motion states explicit.",
    ].join("\n");
  }

  if (selectedFiles.includes("scssSkill")) {
    return `- Follow \`ai-docs/skills/scss-implementation.md\`.
- Global style entrypoint: \`src/styles/index.scss\`.
- Design tokens: \`src/styles/tokens.scss\`.
- Component visuals should use semantic classes with flat selectors.
- Keep utility classes limited to low-level layout and spacing.`;
  }

  return "- Document global styles, design tokens, component style ownership, responsive breakpoints, and accessibility states.";
}

export function architectureTestSection(args) {
  const tech = args.tech;

  if (tech.includes("flutter")) {
    return `- Unit and widget tests: \`test/\`.
- Integration tests: \`integration_test/\`.
- Keep test fixtures and helpers in predictable shared test folders.
- Cover routing, state, serialization, and important widget states when behavior changes.`;
  }

  if (tech.includes("angular")) {
    return `- Unit/component tests usually sit beside source files as \`*.spec.ts\`.
- E2E tests should live in a documented e2e folder if introduced.
- Prefer Angular testing utilities and document shared test builders or mocks here.`;
  }

  if (tech.includes("nextjs") || tech.includes("react") || tech.includes("vue") || tech.includes("svelte") || tech.includes("nuxt") || tech.includes("astro")) {
    return `- Unit and component tests should live beside the source file or in a nearby \`__tests__/\` folder, following the project's chosen convention.
- Shared test helpers should live in \`src/test/\` or \`test/\`.
- E2E tests should live in \`tests/e2e/\` or the configured Playwright folder.
- For UI changes, cover loading, empty, error, responsive, keyboard, and accessibility-relevant states when they are part of the behavior.`;
  }

  if (tech.includes("node")) {
    return `- Unit tests should live beside modules or under \`test/\`, following the chosen runner.
- Integration tests should isolate external services with fixtures or test containers when practical.
- Cover validation, error handling, persistence boundaries, and important operational paths.`;
  }

  return "- Document the test runner, test file naming, helper locations, fixture strategy, and e2e/integration test folders.";
}

export function stylingArchitectureSection(args) {
  const selectedFiles = selectedFileKeys(args);

  if (selectedFiles.includes("tailwindSkill")) {
    return `## Tailwind Architecture

- When implementing Tailwind CSS, follow \`ai-docs/skills/tailwind-implementation.md\`.
- Use Tailwind for layout, spacing, responsive behavior, and state variants while keeping component structure semantic.
- Prefer theme tokens and configured design values over arbitrary one-off utilities.
- Extract repeated UI patterns into components instead of copying long class strings.
- Keep accessibility states explicit, especially \`focus-visible\`, disabled, reduced-motion, and color contrast states.`;
  }

  if (selectedFiles.includes("scssSkill")) {
    return `## SCSS Architecture

- When implementing SCSS, follow \`ai-docs/skills/scss-implementation.md\`.
- Use semantic component classes, preferably BEM-style, for UI identity and component visuals.
- Keep utilities intentionally tiny and limited to layout, spacing, alignment, display, width, height, and visibility.
- Do not add utility classes for colors, typography, shadows, borders, branding, or component-specific visuals.
- Prefer CSS custom properties from \`src/styles/tokens.scss\` for spacing and layout constants.
- Add new utilities only when they remove repeated low-level layout boilerplate across multiple components.`;
  }

  return "";
}

export function aiDocsSkillsSection(args) {
  const selectedFiles = selectedFileKeys(args);
  const lines = [];

  if (selectedFiles.includes("beadsSkill")) {
    lines.push(
      "- `../.agents/skills/beads-task-planning/SKILL.md`: dependency-aware Beads planning, claiming, coordination, evidence, and completion workflow.",
    );
  }

  if (selectedFiles.includes("reactSkill")) {
    lines.push(
      "- `skills/react-best-practices.md`: React component, data-fetching, rendering, bundle, and performance rules. Use Next.js-specific rules only when this project also includes the Next.js skill.",
    );
  }

  if (selectedFiles.includes("nextjsSkill")) {
    lines.push(
      "- `skills/nextjs-best-practices.md`: Next.js component composition, prop design, type safety, server/client separation, and data-flow guidance.",
    );
  }

  if (selectedFiles.includes("angularSkill")) {
    lines.push(
      "- `skills/angular-best-practices.md`: Angular architecture, strict TypeScript, RxJS, templates, state, forms, and code organization guidance.",
    );
  }

  if (selectedFiles.includes("vueSkill")) {
    lines.push(
      "- `skills/vue-best-practices.md`: Vue component naming, props, templates, computed state, communication, styling, and cautionary patterns.",
    );
  }

  if (selectedFiles.includes("svelteSkill")) {
    lines.push(
      "- `skills/svelte-best-practices.md`: Svelte runes, derived state, effects, props, events, snippets, styling, context, and legacy API guidance.",
    );
  }

  if (selectedFiles.includes("nuxtSkill")) {
    lines.push(
      "- `skills/nuxt-best-practices.md`: Nuxt performance, NuxtLink, route rules, lazy loading, hydration, data fetching, assets, scripts, and profiling guidance.",
    );
  }

  if (selectedFiles.includes("astroSkill")) {
    lines.push(
      "- `skills/astro-best-practices.md`: Astro imports, component selection, frontmatter reuse, framework islands, slots, and image guidance.",
    );
  }

  if (selectedFiles.includes("typescriptSkill")) {
    lines.push(
      "- `skills/typescript-best-practices.md`: strict TypeScript patterns, boundary validation, generics, framework integration, and toolchain guidance.",
    );
  }

  if (selectedFiles.includes("flutterSkill")) {
    lines.push(
      "- `skills/flutter-best-practices.md`: Flutter architecture, responsive layout, routing, data, localization, and testing guidance.",
    );
  }

  if (selectedFiles.includes("scssSkill")) {
    lines.push(
      "- `skills/scss-implementation.md`: SCSS architecture, BEM, design tokens, tiny utilities, accessibility states, and modern CSS rules.",
    );
  }

  if (selectedFiles.includes("tailwindSkill")) {
    lines.push(
      "- `skills/tailwind-implementation.md`: Tailwind usage, theme tokens, component extraction, accessibility variants, and class hygiene.",
    );
  }

  return lines.length > 0
    ? lines.join("\n")
    : "- Add project skills here when repeatable implementation rules emerge.";
}

export function frontendComponentSkillInstruction(args) {
  const selectedFiles = selectedFileKeys(args);
  const instructions = [];

  if (selectedFiles.includes("reactSkill")) {
    instructions.push(
      "If the component is React, also read ai-docs/skills/react-best-practices.md.",
    );
  }

  if (selectedFiles.includes("typescriptSkill")) {
    instructions.push(
      "If TypeScript types are involved, also read ai-docs/skills/typescript-best-practices.md.",
    );
  }

  if (selectedFiles.includes("tailwindSkill")) {
    instructions.push(
      "If styling is involved, also read ai-docs/skills/tailwind-implementation.md.",
    );
  } else if (selectedFiles.includes("scssSkill")) {
    instructions.push(
      "If styling is involved, also read ai-docs/skills/scss-implementation.md.",
    );
  }

  return instructions.length > 0
    ? instructions.join("\n")
    : "Use the project's existing component and styling conventions.";
}

export function typescriptFrameworkSection(args) {
  if (args.tech.includes("angular")) {
    return `## Angular and Frontend TypeScript

- Type component inputs, outputs, services, guards, resolvers, interceptors, and route data explicitly.
- Prefer Angular's typed forms APIs when forms are present.
- Use readonly DTOs, domain models, and view models to keep backend shapes separate from templates.
- Type Observable streams at the service or facade boundary so templates consume clear values.
- Use Angular-provided generics for dialogs, HTTP calls, reactive forms, signals, and dependency injection helpers when available.
- Keep template-facing properties narrow and named by product meaning.

\`\`\`typescript
type ButtonVariant = "primary" | "secondary";

type ButtonViewModel = {
  readonly variant: ButtonVariant;
  readonly disabled: boolean;
  readonly label: string;
};
\`\`\``;
  }

  if (args.tech.includes("react") || args.tech.includes("nextjs")) {
    return `## React and Frontend TypeScript

- Type component props explicitly and keep them close to the component.
- Prefer plain function components over \`React.FC\` unless the project already uses \`React.FC\` consistently.
- Type event handlers from React when the event shape matters.
- Let \`useState\` infer simple values, but provide a type for nullable, empty array, or union state.
- Type refs with the underlying element or instance type.
- Keep server/client data contracts separate from component view models when the UI needs a different shape.

\`\`\`typescript
type ButtonProps = {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
};
\`\`\``;
  }

  return `## Frontend TypeScript

- Type component inputs, emitted events, route data, and service boundaries according to the selected framework.
- Keep server/client data contracts separate from component view models when the UI needs a different shape.
- Prefer framework-provided helper types over broad custom types when they improve correctness.
- Keep template-facing or render-facing state narrow and named by product meaning.

\`\`\`typescript
type ButtonViewModel = {
  readonly variant: "primary" | "secondary";
  readonly disabled: boolean;
  readonly label: string;
};
\`\`\``;
}

export function typescriptFrameworkReviewChecklist(args) {
  if (args.tech.includes("angular")) {
    return "Angular inputs, outputs, services, Observable streams, forms, and route data are typed consistently with project conventions.";
  }

  if (args.tech.includes("react") || args.tech.includes("nextjs")) {
    return "React props, refs, and event handlers are typed consistently with project conventions.";
  }

  return "Framework component inputs, events, state, and service boundaries are typed consistently with project conventions.";
}

export function tailwindComponentGoodExample(args) {
  if (args.tech.includes("angular")) {
    return `<app-button variant="primary">Save</app-button>`;
  }

  if (args.tech.includes("vue") || args.tech.includes("nuxt")) {
    return `<AppButton variant="primary">Save</AppButton>`;
  }

  if (args.tech.includes("svelte")) {
    return `<Button variant="primary">Save</Button>`;
  }

  return `<Button variant="primary">Save</Button>`;
}

export function tailwindComponentRiskyExample(args) {
  if (args.tech.includes("react") || args.tech.includes("nextjs")) {
    return `<button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">`;
  }

  return `<button class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">`;
}

export function viteFrameworkPluginImport(args) {
  if (args.tech.includes("react")) {
    return 'import react from "@vitejs/plugin-react";';
  }

  if (args.tech.includes("vue")) {
    return 'import vue from "@vitejs/plugin-vue";';
  }

  if (args.tech.includes("svelte")) {
    return 'import { svelte } from "@sveltejs/vite-plugin-svelte";';
  }

  return "";
}

export function vitePlugins(args) {
  const plugins = [];

  if (args.tech.includes("react")) plugins.push("react()");
  if (args.tech.includes("vue")) plugins.push("vue()");
  if (args.tech.includes("svelte")) plugins.push("svelte()");
  if (args.tech.includes("tailwind")) plugins.push("tailwindcss()");

  return plugins.join(", ");
}

export function scssRecommendedStructure(args) {
  if (args.tech.includes("angular")) {
    return `Global foundations:

\`\`\`text
src/styles/
  reset.scss
  tokens.scss
  globals.scss
  typography.scss
  utilities.scss
  index.scss
\`\`\`

Angular component styles stay with the component that owns them:

\`\`\`text
src/app/shared/ui/button/
  button.component.ts
  button.component.html
  button.component.scss

src/app/shared/layout/app-shell/
  app-shell.component.ts
  app-shell.component.html
  app-shell.component.scss

src/app/features/<feature>/
  components/
    <feature-panel>/
      <feature-panel>.component.ts
      <feature-panel>.component.html
      <feature-panel>.component.scss
\`\`\`

Use Sass modules from the global entrypoint for foundations only:

\`\`\`scss
@use "styles/reset";
@use "styles/tokens";
@use "styles/globals";
@use "styles/typography";
@use "styles/utilities";
\`\`\`

Do not import every component stylesheet into the global entrypoint. Angular component styles should remain component-scoped unless a style is truly global.`;
  }

  if (args.tech.includes("vue") || args.tech.includes("nuxt")) {
    return `Global foundations:

\`\`\`text
src/styles/
  reset.scss
  tokens.scss
  globals.scss
  typography.scss
  utilities.scss
  index.scss
\`\`\`

Vue or Nuxt component styles should usually live inside the component that owns them:

\`\`\`vue
<style lang="scss" scoped>
.product-card {
  padding: var(--space-lg);
}
</style>
\`\`\`

Colocated SCSS files are also acceptable if the project adopts that convention consistently:

\`\`\`text
src/components/ProductCard.vue
src/components/ProductCard.scss

src/features/<feature>/components/FeaturePanel.vue
src/features/<feature>/components/FeaturePanel.scss
\`\`\`

Use Sass modules from the global entrypoint for foundations only:

\`\`\`scss
@use "styles/reset";
@use "styles/tokens";
@use "styles/globals";
@use "styles/typography";
@use "styles/utilities";
\`\`\`

Do not import every component stylesheet into the global entrypoint. Vue and Nuxt component styles should stay scoped in \`.vue\` files unless a style is truly global.`;
  }

  if (args.tech.includes("svelte")) {
    return `Global foundations:

\`\`\`text
src/styles/
  reset.scss
  tokens.scss
  globals.scss
  typography.scss
  utilities.scss
  index.scss
\`\`\`

Svelte component styles should usually live inside the component that owns them:

\`\`\`svelte
<!-- Button.svelte -->
<style lang="scss">
.button {
  padding: var(--space-md);
}
</style>
\`\`\`

Colocated SCSS files are also acceptable if the project adopts that convention consistently:

\`\`\`text
src/components/Button.svelte
src/components/Button.scss

src/features/<feature>/components/FeaturePanel.svelte
src/features/<feature>/components/FeaturePanel.scss
\`\`\`

Use Sass modules from the global entrypoint for foundations only:

\`\`\`scss
@use "styles/reset";
@use "styles/tokens";
@use "styles/globals";
@use "styles/typography";
@use "styles/utilities";
\`\`\`

Do not import every component stylesheet into the global entrypoint. Svelte component styles should stay in \`.svelte\` files unless a style is truly global.`;
  }

  if (args.tech.includes("astro")) {
    return `Global foundations:

\`\`\`text
src/styles/
  reset.scss
  tokens.scss
  globals.scss
  typography.scss
  utilities.scss
  index.scss
\`\`\`

Astro component styles should usually live inside the component that owns them:

\`\`\`astro
---
const title = "Feature";
---

<section class="feature-card">
  <h2>{title}</h2>
</section>

<style lang="scss">
.feature-card {
  padding: var(--space-lg);
}
</style>
\`\`\`

Colocated SCSS files are also acceptable if the project adopts that convention consistently:

\`\`\`text
src/components/FeatureCard.astro
src/components/FeatureCard.scss

src/pages/about.astro
src/pages/about.scss
\`\`\`

Use Sass modules from the global entrypoint for foundations only:

\`\`\`scss
@use "styles/reset";
@use "styles/tokens";
@use "styles/globals";
@use "styles/typography";
@use "styles/utilities";
\`\`\`

Do not import every component stylesheet into the global entrypoint unless the stylesheet is intentionally global. Astro component styles should stay in \`.astro\` files or a documented colocated convention.`;
  }

  return `\`\`\`text
src/styles/
  reset.scss
  tokens.scss
  globals.scss
  typography.scss
  utilities.scss
  index.scss

src/components/
  button.scss
  card.scss
  modal.scss
  form-field.scss
\`\`\`

Use Sass modules from the entrypoint:

\`\`\`scss
@use "styles/reset";
@use "styles/tokens";
@use "styles/globals";
@use "styles/typography";
@use "styles/utilities";
@use "components/button";
\`\`\``;
}

export function aiDocsPromptsSection(args) {
  const usesTailwind = selectedFileKeys(args).includes("tailwindSkill");
  const usesScss = selectedFileKeys(args).includes("scssSkill");

  return Object.entries(PROMPT_TEMPLATES)
    .filter(([name]) => {
      if (name === "scss-refactor") return usesScss;
      if (name === "tailwind-refactor") return usesTailwind;
      return true;
    })
    .map(
      ([name, prompt]) =>
        `- \`critical-boiler prompt ${promptCommandName(name)}\`: ${promptDescription(name, prompt, args)}`,
    )
    .join("\n");
}

export function promptCommandName(name) {
  return name;
}

export function promptDescription(name, prompt, args) {
  if (name === "scss-refactor" || name === "tailwind-refactor") {
    return stylingRefactorPromptDescription(args);
  }

  return prompt.description;
}

export function stylingRefactorPromptDescription(args) {
  const selectedFiles = selectedFileKeys(args);

  if (selectedFiles.includes("tailwindSkill")) {
    return "Refactor Tailwind styling while invoking `skills/tailwind-implementation.md`.";
  }

  if (selectedFiles.includes("scssSkill")) {
    return "Refactor SCSS while invoking `skills/scss-implementation.md`.";
  }

  return "Refactor styling according to the project styling conventions.";
}

export function stylingRefactorPromptTitle(args) {
  return selectedFileKeys(args).includes("tailwindSkill")
    ? "Tailwind Refactor Prompt"
    : "SCSS Refactor Prompt";
}

export function stylingRefactorPromptIntro(args) {
  return selectedFileKeys(args).includes("tailwindSkill")
    ? "Use this when asking Codex to refactor Tailwind styling in this project."
    : "Use this when asking Codex to refactor SCSS or CSS in this project.";
}

export function stylingRefactorSkillInstruction(args) {
  return selectedFileKeys(args).includes("tailwindSkill")
    ? "Invoke and follow ai-docs/skills/tailwind-implementation.md before editing any styling."
    : "Invoke and follow ai-docs/skills/scss-implementation.md before editing any styles.";
}

export function stylingRefactorChecklist(args) {
  if (selectedFileKeys(args).includes("tailwindSkill")) {
    return `Refactor toward the Tailwind implementation skill:
- Theme tokens before arbitrary values.
- Repeated class strings extracted into components.
- Clear layout, spacing, responsive, and state variants.
- Explicit hover, focus-visible, disabled, aria/data, and reduced-motion behavior.
- No copied long class strings, avoidable arbitrary values, or styling hidden in unrelated logic.`;
  }

  return `Refactor toward the SCSS implementation skill:
- CSS variables for design tokens.
- Flat, class-based selectors.
- BEM for real components.
- Tiny utilities for layout only.
- Logical properties where they fit.
- Explicit hover, focus-visible, disabled, and reduced-motion behavior.
- No unnecessary IDs, deep selectors, magic numbers, Sass @extend, or broad !important usage.`;
}

export function frontendStylingBaselineSection(args) {
  const selectedFiles = selectedFileKeys(args);

  if (selectedFiles.includes("tailwindSkill")) {
    return `The default styling architecture is:

- Tailwind CSS for utility-first styling.
- Theme tokens for color, spacing, typography, radius, shadows, and breakpoints.
- Semantic components for repeated UI patterns.
- Explicit responsive, hover, focus-visible, disabled, dark-mode, and reduced-motion states.
- Minimal arbitrary values and no repeated long class strings without component extraction.`;
  }

  if (selectedFiles.includes("scssSkill")) {
    return `The default styling architecture is:

- Modern reset.
- CSS variables as design tokens.
- SCSS organization by foundation and component.
- BEM for real components.
- Tiny utilities for layout, spacing, alignment, display, width, height, and visibility.
- Low specificity, flat selectors, explicit states, and accessible focus styles.

Do not expand the utility layer into colors, typography, shadows, borders, branding, or component visuals.`;
  }

  return "Add styling conventions here when the project chooses a styling approach.";
}
