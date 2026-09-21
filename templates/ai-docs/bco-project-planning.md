<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Project Planning Contract

Use `$bco-project-planning` only for operator-authorized project bootstrap, backlog restructuring, or dependency repair. Ordinary assigned-task execution uses `$bco-task-orchestration`.

## Source Of Truth And Apply Boundary

BCO remains authoritative for native tasks, relationships, versions, and validation. The skill emits the exact strict JSON contract documented in `.agents/skills/bco-project-planning/references/task-contract.md`. It may preview, validate, or apply that JSON only through project-planning capabilities actually exposed by BCO and only within the operator's authorization.

When apply is not authorized or available, return one complete JSON file for operator paste/upload into BCO. Report the validation actually performed; local review is not BCO approval. Do not substitute Markdown, connect to BCO persistence, use workflow-scoped task tools to manufacture a backlog, or claim that a draft was applied. After authorized apply, reread BCO truth and native readiness. Preserve the user's Experimental Brain setting unless changing it is part of the request.

New work uses BCO project-plan schema version `{{ bcoProjectPlanSchemaVersion }}`. Existing native catalogs that predate automation contracts use complete `adopt-existing` schema version `{{ bcoTaskAdoptionSchemaVersion }}` exports. Adoption authority fields come only from BCO, cover the exact active catalog, and are never guessed by an agent. The catalog export and returned adoption JSON are temporary operator artifacts, not project authority or deliverables; keep them outside the repository and normally do not commit them.

## AI Scope And Feasibility Review

Use AI reasoning to reconcile the brief, latest user instructions, repository facts, and available execution environment before decomposition. The examples below explain common deficiencies; they are not a fixed rejection list. Discover other contradictions that matter to this project and repair them within the requested scope.

Separate required product outcomes, necessary implementation prerequisites, suggested techniques, and explicit exclusions. Trace material scope decisions to the brief or latest user instruction. A roadmap example, reference video, generic definition-of-done checklist, or suggested tool is not additional authority. Prefer autonomous local delivery when that is the selected target: a deployable build does not imply hosting, domain provisioning, remote publishing, paid subscriptions, operator-attended Narrator sessions, or physical-device tests. Add such work only when explicitly requested. If an older brief contains a human/external requirement that the user subsequently excludes, make the superseding scope clear in the existing task fields; do not retain its obsolete capability/resource requirement.

Preserve explicitly requested external or human outcomes. Identify the real input, owner, and authorization needed, and explain which dependent work cannot yet proceed. Do not silently replace a required deployment or manual accessibility audit with local checks. Conversely, retain agent-executable accessibility, responsive, and local production checks when human walkthroughs are excluded, with accurate limits on what they prove.

Work backward from each accepted outcome to the required technology, input artifacts, commands, and permissions. Inspect available facts before asking questions. Choose ordinary implementation details within scope and document consequential assumptions; ask only for missing authority or a product decision that cannot be safely resolved. An unavailable media provider, for example, may be replaced by a local production method if that still meets the requested outcome and no explicit method requirement forbids it. A coding model name alone is not a video/image/3D generation tool.

Then mentally execute the complete proposed graph as the assigned agents would: obtain durable inputs, establish tooling, implement, capture a candidate, verify, correct defects within scope, independently review, integrate, and check the integrated result where required. Identify the owner and feasible path at each relevant boundary. Repair definitions, dependencies, capability/resource declarations, and role/delivery contracts together. An acceptance task that needs fixture repairs or candidate commits cannot simultaneously forbid those actions. Choose genuine read-only acceptance after upstream delivery, or explicitly scoped correction and Git ownership; do not grant unrestricted product changes or force an optional coder phase.

For a new/unimported plan, return the entire revised series. For already imported tasks, preserve authoritative IDs and exact adoption fields; task-scope changes require an authorized native edit before fresh export and contract adoption. Never smuggle scope edits into `verification` or automation fields, refresh contracts from a workflow, or modify a running project as a side effect of planning another one.

## Delivery Reliability

Use these failure patterns when relevant to the inspected project; they are reasoning examples, not mandatory extra tasks or schema fields.

- **Provider commands:** A tooling task should demonstrate the exact invocation its consumers will use. For a test wrapper, prove that a selected suite excludes an unrelated canary, argument forwarding works through the declared package manager, an intentional failure returns nonzero, and owned resources are released. A green aggregate run alone does not establish scoped execution. Reuse existing demonstrations when current; do not repeat infrastructure acceptance in every consumer.
- **Permitted evolution:** State what later consumers may add or change without breaking the provider's contract. Tests should protect owned invariants, required inputs and provenance, rather than freeze an entire extensible repository inventory. An input task that owns three asset directories must not reject a later task's valid fourth directory. Missing or changed required inputs must still fail. Identify narrow adjacent-test maintenance authority where genuinely needed; do not grant broad writes or weaken valid assertions.
- **Durable asset identity:** For generated or hashed inputs, establish the byte-identity policy and its owner before consumers rely on it. Choose explicit Git text attributes or documented canonicalization for text, preserve exact binary bytes, and demonstrate commit/fresh-checkout reproducibility under the supported platform. Generate shared identity metadata from one source where practical; manually patching copied hashes is not a durable policy.
- **Complete delivery cost:** Use available measured command and review durations to budget implementation, rendering/browser verification, candidate capture, independent review, integration checks and cleanup. Record uncertainty rather than invent precision. Split only at independently acceptable outcomes when evidence indicates the complete cycle will not fit; do not multiply administrative tasks, extend runtime limits or remove explicit gates to make a plan appear feasible. Preserve applicable evidence by claim and identity instead of repeating unrelated checks.
- **Acceptance surface:** Name whether a task delivers an isolated fixture, reusable component, public route or complete release. Review must judge that surface on the current candidate. An isolated component showcase does not silently become a public-route task; conversely fixture-only evidence cannot close an explicitly public release. Findings should identify the criterion or concrete affected invariant, candidate and observed defect; separate missing evidence and proposed new scope.

For an authorized retrospective of an existing project, inspect current claims and exact task versions before edits. Preserve completed delivery history. Repair remaining code defects explicitly and amend only affected unfinished task definitions, then obtain a fresh complete adoption catalog and preview/apply its contracts. Template sync updates repository guidance, not native tasks. Do not change a running task's contract or the project's launch settings implicitly; reconcile execution ownership before applying affected changes.

## Planning Rules

- For user-visible releases and integration work, apply [Product Acceptance]({{ bcoProductAcceptanceLink }}): preserve the selected release target, map accepted outcomes and exposed surfaces to owners, define representative environment and composed-screen evidence, and keep deferrals explicit. Use existing native descriptions, acceptance criteria, and verification fields; no additional plan/adoption schema properties or competing backlog are introduced. Adoption cannot rewrite scope through automation fields: report a scope gap for an authorized native-task edit/replan.
- Express every dependency as `blockedByKeys` using stable task keys. A sentence such as “depends on Task 2” is an advisory to inspect, not an edge.
- Keep hierarchy and dependency separate. Parent/child organization does not imply execution order.
- Give each task one observable outcome, bounded in-scope and out-of-scope surfaces, acceptance criteria, verification, risk/domain labels, and required capabilities.
- Add enabling tasks only for missing capabilities, migrations, contracts, or infrastructure needed by the selected outcome. Consumers wait through native edges; providers must not require their own future output at launch.
- Design the smallest useful dependency graph. Independent tasks may be parallel only when paths, contracts, data, and shared resources are genuinely independent.
- Avoid stacked task branches. Each implementation task starts from updated integration truth after its predecessor is merged.
- Treat `rolePolicy` as admission control for roles that actually appear, not an agent roster. Declare only unconditional predecessor edges for the workflow profile. Verification-only work does not require an optional coder predecessor, and container finalization declares no specialist pipeline.
- Use only exact specialist role IDs declared in `.codex/config.toml`. For every unconditionally required phase, persist the real predecessor in `afterRoles`—for example `backend_planner` → `backend_coder` → `backend_tester` → `backend_reviewer`. Do not emit generic role names or empty edges for a sequential delivery chain.
- Before preview, perform an explicit cross-layer semantic audit across task definitions, the dependency and hierarchy graph, repository architecture, commands and tests, automation contracts, and shared resources. Find hidden prerequisites, incorrect ordering, overlapping scope or ownership, acceptance criteria that an independent agent cannot execute, and contracts whose workflow, risk, evidence, capabilities, resources, or role phases do not fit the work.

Reject cycles, missing keys, self-dependencies, verification without observable commands or evidence, and uncovered required capabilities. Use judgment about useful task size rather than a fixed task count. Validate the combined hierarchy/dependency graph through BCO: a parent blocked by its own descendant can form a cycle despite an independently acyclic dependency list. Container closure relies on native child finalization, not a descendant `blockedByKeys` edge. Treat prose dependency language and ordinal task references as review advisories; deterministic text matching must not invent project semantics.

## Honest Planning And Launch Readiness

Plan admission is distinct from individual task launch readiness. A coherent plan may be imported before its enabling tasks produce later commands, fixtures, and tools. Keep those future requirements and their providers explicit. Do not require every downstream tool to exist before import, falsely mark it available, or empty arrays to bypass validation. General resources are coordination declarations, not a separate registry; an assigned workflow port normally does not exist in a planning session. See `ai-docs/bco-automation-readiness.md` for the evidence boundary.

A task is automation-ready only when:

1. its scope and observable acceptance criteria are complete;
2. every prerequisite is a persisted native BCO `blocked-by` relationship;
3. verification is concrete and available in the repository or environment;
4. browser-critical work declares Playwright or an available browser-control capability;
5. database, server, port, codegen, build, E2E, and migration resource needs are explicit;
6. delivery ownership and evidence expectations are defined;
7. BCO validation confirms a cycle-free, internally consistent graph;
8. containers use non-delivery finalization without Git ownership; root-only child closure uses `decision`, since verification/integration profiles require a separate upstream delivery dependency;
9. required sequential specialist phases use exact configured role IDs and explicit `afterRoles` edges;
10. the cross-layer semantic audit has no unresolved accepted-outcome coverage, hidden prerequisite, ordering, overlap, executable-acceptance, evidence-sufficiency, or automation-contract-fit defect;
11. execution is within the user's existing authorization and BCO's admission boundaries.

BCO preview and apply run their own fresh read-only semantic audit and may return readiness defects even when structural validation passes. Resolve those defects instead of encoding deterministic text, path, or error-count heuristics in the project plan. Experimental Brain changes launch timing only. It must not compensate for an incomplete graph, missing capability, or ambiguous task definition.

Reassess material corrections against the accepted outcome and affected dependencies. Stop revising when the plan is coherent or a specific unresolved input requires the user; repeating an unchanged audit is not progress. Report local checks, BCO preview, apply, and post-apply readiness separately for the exact returned artifact. A successful preview is evidence of admission, not proof that future implementation or EBE chaining has succeeded.
