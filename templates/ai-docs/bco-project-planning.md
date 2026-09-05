<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Project Planning Contract

Use `$bco-project-planning` only for operator-authorized project bootstrap, backlog restructuring, or dependency repair. Ordinary assigned-task execution uses `$bco-task-orchestration`.

## Source Of Truth And Apply Boundary

BCO remains authoritative for native tasks, relationships, versions, and validation. The skill emits the exact strict JSON contract documented in `.agents/skills/bco-project-planning/references/task-contract.md`. It may preview, validate, or apply that JSON only through project-planning capabilities actually exposed by BCO and only within the operator's authorization.

If no project-planning mutation capability is available, return the validated JSON for operator paste into BCO. Do not substitute Markdown, connect to BCO persistence, use workflow-scoped task tools to manufacture a backlog, or claim that a draft was applied. After apply, reread BCO truth and validate the native graph before enabling Experimental Brain.

New work uses BCO project-plan schema version `{{ bcoProjectPlanSchemaVersion }}`. Existing native catalogs that predate automation contracts use complete `adopt-existing` schema version `{{ bcoTaskAdoptionSchemaVersion }}` exports. Adoption authority fields come only from BCO, cover the exact active catalog, and are never guessed by an agent. The catalog export and returned adoption JSON are temporary operator artifacts, not project authority or deliverables; keep them outside the repository and normally do not commit them.

## Planning Rules

- Express every dependency as `blockedByKeys` using stable task keys. A sentence such as “depends on Task 2” is an advisory to inspect, not an edge.
- Keep hierarchy and dependency separate. Parent/child organization does not imply execution order.
- Give each task one observable outcome, bounded in-scope and out-of-scope surfaces, acceptance criteria, verification, risk/domain labels, and required capabilities.
- Add enabling tasks for missing capabilities, migrations, contracts, or infrastructure. Block dependent work with native edges.
- Design the smallest useful dependency graph. Independent tasks may be parallel only when paths, contracts, data, and shared resources are genuinely independent.
- Avoid stacked task branches. Each implementation task starts from updated integration truth after its predecessor is merged.
- Treat `rolePolicy` as admission control for roles that actually appear, not an agent roster. Declare only unconditional predecessor edges for the workflow profile. Verification-only work does not require an optional coder predecessor, and container finalization declares no specialist pipeline.
- Use only exact specialist role IDs declared in `.codex/config.toml`. For every unconditionally required phase, persist the real predecessor in `afterRoles`—for example `backend_planner` → `backend_coder` → `backend_tester` → `backend_reviewer`. Do not emit generic role names or empty edges for a sequential delivery chain.
- Before preview, perform an explicit cross-layer semantic audit across task definitions, the dependency and hierarchy graph, repository architecture, commands and tests, automation contracts, and shared resources. Find hidden prerequisites, incorrect ordering, overlapping scope or ownership, acceptance criteria that an independent agent cannot execute, and contracts whose workflow, risk, evidence, capabilities, resources, or role phases do not fit the work.

Reject cycles, missing keys, self-dependencies, broad multi-outcome tasks, verification without observable commands or evidence, and tasks requiring unavailable capabilities without an explicit enabling dependency. Treat prose dependency language and ordinal task references as review advisories; deterministic text matching must not invent project semantics.

## Automation Readiness Gate

A task is automation-ready only when:

1. its scope and observable acceptance criteria are complete;
2. every prerequisite is a persisted native BCO `blocked-by` relationship;
3. verification is concrete and available in the repository or environment;
4. browser-critical work declares Playwright or an available browser-control capability;
5. database, server, port, codegen, build, E2E, and migration resource needs are explicit;
6. delivery ownership and evidence expectations are defined;
7. BCO validation confirms a cycle-free, internally consistent graph;
8. containers have non-delivery finalization contracts and do not own Git delivery;
9. required sequential specialist phases use exact configured role IDs and explicit `afterRoles` edges;
10. the cross-layer semantic audit has no unresolved hidden prerequisite, ordering, overlap, executable-acceptance, or automation-contract-fit defect;
11. the operator confirms the plan or applied changes.

BCO preview and apply run their own fresh read-only semantic audit and may return readiness defects even when structural validation passes. Resolve those defects instead of encoding deterministic text, path, or error-count heuristics in the project plan. Experimental Brain changes launch timing only. It must not compensate for an incomplete graph, missing capability, or ambiguous task definition.
