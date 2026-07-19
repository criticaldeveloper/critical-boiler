# Nuxt Best Practices Skill

Use this skill when writing, reviewing, or refactoring Nuxt code. It adapts the official Nuxt performance guidance into project-local rules for routing, rendering, lazy loading, data fetching, images, fonts, scripts, profiling, and common performance pitfalls.

## Apply This First

- Treat Nuxt performance as a route-by-route and component-by-component design concern.
- Prefer Nuxt built-ins before custom abstractions.
- Keep server, client, and hybrid rendering choices explicit.
- Follow the Vue and TypeScript skills generated for this project.
- Measure before and after performance-sensitive changes when practical.

## Links

- Use `<NuxtLink>` for internal navigation instead of raw `<a>` or Vue Router links.
- Let Nuxt handle internal/external link behavior and smart prefetching.
- Tune prefetch behavior deliberately when default viewport-based prefetching is too eager for the app.
- Prefer interaction-based prefetching for pages where viewport prefetch causes unnecessary JavaScript loading.

## Hybrid Rendering and Route Rules

- Use route rules to choose the right rendering and caching behavior per route.
- Prerender stable static routes.
- Use SWR or ISR-style rules for pages that can be cached and refreshed.
- Disable SSR only for routes that genuinely require client-only rendering, such as certain admin or browser-only tools.
- Document route rule decisions in `ai-docs/README.md` when they affect behavior, freshness, or deployment.

```ts
export default defineNuxtConfig({
  routeRules: {
    "/": { prerender: true },
    "/products/**": { swr: 3600 },
    "/admin/**": { ssr: false }
  }
});
```

## Lazy Components and Hydration

- Lazy-load components that are not always needed by using Nuxt's `Lazy` component prefix.
- Use lazy hydration for components that do not need to become interactive on initial load.
- Prefer hydration-on-visible or idle-like strategies for below-the-fold, heavy, or secondary UI.
- Do not lazy-load essential above-the-fold content when it harms LCP or perceived completeness.

```vue
<LazyProductRecommendations v-if="showRecommendations" />
<LazyComments hydrate-on-visible />
```

## Data Fetching

- Use `useFetch` and `useAsyncData` for Nuxt data fetching so server-fetched data is serialized into the client payload instead of fetched twice.
- Keep fetch keys stable and meaningful.
- Avoid duplicating the same API call in sibling components.
- Keep loading, empty, error, and success states explicit.
- Be mindful of cache and revalidation behavior when changing data fetching.

## Images

- Use Nuxt Image when the project includes it.
- Prefer `<NuxtImg>` over raw `<img>` for optimizable local and remote images.
- Set `width` and `height` to reduce layout shift.
- Use modern formats such as WebP or AVIF where supported by the configured provider.
- Prioritize LCP images with eager loading, preload, and high fetch priority.
- Lazy-load non-critical images and mark their fetch priority lower.
- Keep meaningful alt text, and mark decorative images appropriately.

## Fonts

- Use Nuxt Fonts when the project includes it.
- Prefer self-hosted or Nuxt-managed fonts to reduce external requests and improve privacy.
- Ensure font loading minimizes layout shift with fallback metrics.
- Avoid adding additional font providers or runtime font loaders without measuring impact.

## Third-Party Scripts

- Treat analytics, embeds, maps, social widgets, and other third-party scripts as performance risks.
- Use Nuxt Scripts when the project includes it.
- Load third-party scripts manually, lazily, or after user interaction when possible.
- Queue analytics events until scripts load rather than blocking initial rendering.
- Keep script loading choices documented when they affect analytics or product behavior.

## Plugins

- Avoid overusing plugins. Nuxt plugins run during hydration and can block rendering.
- Prefer composables or utilities when initialization does not need plugin lifecycle behavior.
- Keep plugins narrow, fast, and environment-aware.
- Split client-only and server-only behavior clearly.
- Remove unused plugins and plugin dependencies as the app evolves.

## Dependencies and Bundle Size

- Regularly inspect `package.json` for unused dependencies.
- Remove unused composables, utilities, components, and imports.
- Avoid importing entire libraries when a smaller direct import works.
- Lazy-load large standalone features or third-party UI.
- Use Vue performance primitives where appropriate, such as `shallowRef`, `v-memo`, and `v-once`.

## Progressive Enhancement

- Do not load everything at once.
- Render core content first, then layer interactivity and secondary features as bandwidth, device capability, and user intent allow.
- Keep critical above-the-fold content lightweight.
- Defer non-critical widgets, recommendations, comments, embeds, and analytics.

## Profiling

- Use `nuxi analyze` to inspect production bundle composition.
- Use Nuxt DevTools to inspect timelines, assets, render trees, files, and evaluation cost.
- Use Chrome DevTools Performance and Lighthouse for local Core Web Vitals and audit feedback.
- Use PageSpeed Insights for lab and field data.
- Use WebPageTest for deeper diagnostics across locations, browsers, devices, and network conditions.
- Let measurements guide optimization priorities instead of guessing.

## Common Pitfalls

- Too many plugins doing work during hydration.
- Unused dependencies or dead code increasing bundle size.
- Forgetting Vue-level performance tools because the app is Nuxt.
- Introducing inconsistent patterns that make performance and ownership harder to reason about.
- Loading all UI, scripts, and data at the same time instead of progressively enhancing.
- Raw image, font, or script handling where Nuxt modules already solve the problem.

## Verification Checklist

- Internal links use `<NuxtLink>`.
- Route rendering and cache rules are explicit for changed routes.
- Non-critical components are lazy-loaded or lazily hydrated.
- Server-fetched data uses `useFetch` or `useAsyncData` where appropriate.
- Images use Nuxt Image or equivalent optimization and define dimensions.
- Third-party scripts are deferred or managed through Nuxt Scripts where available.
- Plugins are necessary, narrow, and not doing avoidable hydration work.
- Bundle or performance changes are checked with `nuxi analyze`, Nuxt DevTools, Lighthouse, or another relevant profiling tool when practical.
