# Astro Best Practices Skill

Use this skill when writing, reviewing, or refactoring Astro code. It captures project-local rules for imports, `.astro` component preference, frontmatter reuse, framework island boundaries, slots, and image handling.

## Apply This First

- Prefer Astro's static-first model. Add client-side JavaScript only where interactivity requires it.
- Prefer `.astro` components for pages, layouts, sections, and static UI.
- Use framework islands deliberately. Do not reach for a UI framework unless that integration is installed and the component truly needs client-side framework behavior.
- Keep generated HTML semantic, accessible, and easy to scan.
- Follow existing project conventions for routing, content collections, styling, and component folders.

## Imports

- Prefer the `@` alias for imports from `src` when it is configured.
- Use relative imports only for files in the same directory or a very close sibling where that is already the project convention.
- Avoid deep relative paths that make moving files painful.

```ts
import Hero from "@/components/Hero.astro";
import FeatureCard from "./FeatureCard.astro";
```

## Reuse Without Shipping Extra JavaScript

- Remember that JavaScript in Astro frontmatter runs at build/server time and is not automatically shipped to the browser.
- Avoid copy-pasting repeated HTML blocks.
- Put repeated content in frontmatter arrays or objects and render it with `map`.
- Extract repeated markup into a component when it represents a reusable UI pattern.
- Keep frontmatter data simple and serializable unless the page truly needs server-side logic.

```astro
---
const items = ["Item 1", "Item 2", "Item 3"];
---

<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>
```

## Prefer Astro Components

- Use `.astro` for static and mostly-static UI.
- Use `.astro` for composition with slots, layouts, content pages, marketing sections, cards, lists, and image-heavy sections.
- Use a framework component only when the relevant Astro integration is installed and the component needs client state, context, effects, or a framework-specific primitive.
- Keep framework components at island boundaries instead of turning an entire page into a client app by default.

Good reasons to use a framework island inside Astro:

- The component belongs to a shared UI system for an installed framework integration.
- The feature needs framework context, and all children that consume that context are inside the same island.
- A component relies on framework-specific primitives or child-node composition.
- The UI needs client hooks, browser-only state, or complex interactive behavior.

## Framework Islands

- Keep framework islands as small as practical.
- Do not expect framework context to cross separate Astro islands.
- If a provider is required, wrap the provider and all consumers in the same framework island.
- Use `client:*` directives intentionally and document why hydration is needed.
- Do not introduce a UI framework integration just for examples or static UI.

## Slots Over Prop Nodes

- Prefer Astro slots for passing icons, content blocks, and markup into components.
- Use named slots instead of passing framework component classes or opaque node props from `.astro` files.
- Let the receiving component expose named regions rather than a pile of markup props.

```astro
<MyComponent>
  <Icon slot="icon" />
  <Content slot="content" />
  My default header goes here.
</MyComponent>
```

## Images

- Prefer Astro's optimized image tooling in `.astro` components when possible.
- Avoid moving image-heavy static UI into framework islands if it would lose Astro image optimization.
- For framework components that need optimized images, pass rendered images through Astro slots when that keeps the island simple.
- If a framework component must own an image element, generate optimized image props with Astro tooling such as `getImage` in Astro/server code, then pass plain `img` props into the island.
- Keep alt text meaningful and treat decorative images explicitly.

## Content and Data

- Keep content collections typed and documented when the project uses them.
- Put content mapping and lightweight transforms in frontmatter, not in client-side scripts.
- Avoid shipping data to the browser unless a client island needs it.
- Use stable slugs, route params, and collection schemas instead of ad hoc string parsing.

## Styling

- Follow the project's selected styling approach and generated styling skill.
- Keep static section styling in Astro components when it is component-owned.
- Extract repeated visual patterns into components rather than copying class lists or style blocks.
- Keep framework-specific styling contained to the framework island that owns it.

## Verification Checklist

- Static pages render without unnecessary client JavaScript.
- Imports from `src` use `@` when available.
- Repeated markup is generated from data or extracted into components.
- `.astro` is used unless client state, context, framework primitives, or framework reuse justifies an island.
- Framework providers and consumers live inside the same island.
- Named slots are used for markup composition from Astro.
- Images preserve Astro optimization where practical and include correct alt text.
- The smallest relevant build, type check, or page render verification passes.
