<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Project Planning Contract

Use `$bco-project-planning` only for operator-authorized project bootstrap, backlog restructuring, or dependency repair. Ordinary assigned-task execution uses `$bco-task-orchestration`.

## Source Of Truth And Apply Boundary

BCO remains authoritative for native tasks, relationships, versions, and validation. The skill emits the exact strict JSON contract documented in `.agents/skills/bco-project-planning/references/task-contract.md`. It may preview, validate, or apply that JSON only through project-planning capabilities actually exposed by BCO and only within the operator's authorization.

If no project-planning mutation capability is available, return the validated JSON for operator paste into BCO. Do not substitute Markdown, connect to BCO persistence, use workflow-scoped task tools to manufacture a backlog, or claim that a draft was applied. After apply, reread BCO truth and validate the native graph before enabling Experimental Brain.

New work uses BCO project-plan schema version `{{ bcoProjectPlanSchemaVersion }}`. Existing native catalogs that predate automation contracts use complete `adopt-existing` schema version `{{ bcoTaskAdoptionSchemaVersion }}` exports. Adoption authority fields come only from BCO, cover the exact active catalog, and are never guessed by an agent.

## Planning Rules

- Express every dependency as `blockedByKeys` using stable task keys. A sentence such as “depends on Task 2” is an advisory to inspect, not an edge.
- Keep hierarchy and dependency separate. Parent/child organization does not imply execution order.
- Give each task one observable outcome, bounded in-scope and out-of-scope surfaces, acceptance criteria, verification, risk/domain labels, and required capabilities.
- Add enabling tasks for missing capabilities, migrations, contracts, or infrastructure. Block dependent work with native edges.
- Design the smallest useful dependency graph. Independent tasks may be parallel only when paths, contracts, data, and shared resources are genuinely independent.
- Avoid stacked task branches. Each implementation task starts from updated integration truth after its predecessor is merged.

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
9. the operator confirms the plan or applied changes.

Experimental Brain changes launch timing only. It must not compensate for an incomplete graph, missing capability, or ambiguous task definition.
