---
name: bco-project-planning
description: Design or validate an operator-authorized native Better Codex Orchestrator project backlog with explicit dependency edges, bounded acceptance criteria, capability prerequisites, verification, and automation readiness. Use for project bootstrap, backlog restructuring, dependency repair, or preparing a chained BCO development plan; do not use for ordinary execution of an already assigned task.
---

# BCO Project Planning

BCO is authoritative for native task truth. This skill prepares or validates a project plan; it never invents execution authority.

## Workflow

1. Read `ai-docs/bco-project-planning.md`, `ai-docs/bco-automation-readiness.md`, and `references/task-contract.md` completely.
2. Read `ai-docs/context-map.md` when present, then inspect the project brief, routed repository architecture, commands, tests, exact specialist role IDs from `.codex/config.toml`, existing BCO task truth when exposed, and required environment capabilities.
3. Choose exactly one mode: a schema-versioned project-plan JSON for new work, or a complete `adopt-existing` JSON based on an exact BCO catalog export. Never mix the two schemas. Treat the export and returned adoption JSON as temporary operator artifacts, not project authority or deliverables; keep them outside the repository and normally do not commit them.
4. Draft outcome-sized tasks with stable keys. Resolve every dependency to `blockedByKeys` and keep `parentKey` hierarchy separate from execution order.
5. Add enabling tasks for missing contracts, migrations, browser automation, fixtures, infrastructure, or other required capabilities. Leave unresolved capability gaps non-ready.
6. Validate strict field names and enums, unique keys, references, acyclicity, acceptance observability, verification availability, resource ownership, container finalization, Git delivery boundaries, and explicit `afterRoles` edges between every unconditionally sequential phase. Never substitute generic role names for configured IDs.
7. Perform an explicit cross-layer semantic audit across task definitions, dependency and hierarchy intent, repository architecture, commands and tests, automation contracts, and shared resources. Find hidden prerequisites, incorrect ordering, overlapping scope or ownership, acceptance criteria that another agent cannot execute, and contracts whose workflow, risk, evidence, capabilities, resources, or role phases do not fit the work.
8. Present the exact JSON, compact dependency graph, audit findings, capability gaps, and proposed native changes for operator confirmation.
9. Apply only through BCO's project-plan or existing-task-adoption preview/validate/apply capability and only when authorized. Always preview the exact payload first and resolve BCO's fresh semantic-audit defects. Otherwise stop at the JSON draft boundary for operator paste into BCO.
10. After apply, reread authoritative BCO truth and its automation-readiness report before declaring the project automation-ready.

Do not create a Markdown backlog as a competing source of truth, connect directly to BCO persistence, turn prose dependencies into assumptions, or use workflow-scoped execution tools to create unrelated project tasks.

## Return

Return the exact schema-versioned JSON or applied change summary, dependency graph, structural validation and cross-layer semantic-audit outcomes, capability matrix, operator decisions still required, and whether BCO truth was reread successfully. Say `draft_only` when no authorized apply capability was available. Never fabricate authority fields for `adopt-existing`.
