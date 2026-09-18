<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Automation Readiness

Critical Boiler generated BCO contract version: `{{ bcoContractVersion }}`.

Refresh managed BCO docs, skills, prompts, and agent configuration with:

```sh
critical-boiler --bco-sync --cwd <project-root>
```

Sync preserves unrelated files/configuration. Keep both boundary markers of managed sections intact.

## Contract Freshness

BCO records the canonical task definition consumed by automation: task identity, title, description, acceptance criteria, verification, type, labels, parent, and container semantics. Claims, lifecycle changes, status reasons, comments, evidence, provenance, versions, timestamps, and ordinary workflow bookkeeping do not stale a contract.

A missing or stale contract is operator-owned project-plan authority. Use **Prepare automation** to export the exact current catalog, generate a complete plan, preview and validate it, then apply or supersede it once. Workflow agents and the AI governor cannot create, refresh, amend, or supersede automation contracts and must not launch a recovery workflow for that purpose.

## Capability Declaration

`$bco-project-planning` binds requirements to observed repository/runtime capabilities, named enabling predecessors, explicitly requested external inputs, or precise unresolved needs. Use BCO-supported identifiers. A package declaration, model name, or planner tool does not prove workflow availability; distinguish inspected existence from successful execution.

Providers create and demonstrate future capabilities before consumers through native dependencies. Their absent outputs need not prevent plan import; BCO rechecks consumers at launch. Do not fake availability or empty requirement arrays to bypass validation. Resolve genuine gaps for affected tasks without blocking independent work. Detailed scope and feasibility reasoning belongs in `ai-docs/bco-project-planning.md`.

## Browser Verification

For browser-critical acceptance criteria, declare one working path:

- repository-local Playwright (or the project's established E2E runner) with a documented command and server lifecycle; or
- an available browser-control capability exposed to the workflow.

If neither exists, create an enabling task or mark the dependent task blocked. Agents must not silently install a browser tool during verification, replace browser evidence with a build, or claim end-to-end acceptance from static inspection.

## Shared Resources

Declare shared build, E2E, formatter, codegen, database, migration, server, and port resources and lifecycle. Domain orchestrators grant one owner at a time, recording commands, assigned ports/databases, cleanup, and exact tree identity.

`requiredResources` names coordination scopes, not registry IDs. BCO assigns `BCO_TEST_SERVER_PORT` at launch; its absence during planning is expected. Commands consume that port. Keep briefs/assets at durable project or authorized artifact paths accessible to execution agents.
