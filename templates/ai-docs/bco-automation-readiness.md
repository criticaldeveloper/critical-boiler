<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Automation Readiness

Critical Boiler generated BCO contract version: `{{ bcoContractVersion }}`.

Dedicated BCO docs, skills, agent configurations, prompts, and the managed `.codex/config.toml` registry section belong to this contract. Refresh only those managed assets in an existing project with:

```sh
critical-boiler --bco-sync --cwd <project-root>
```

The sync preserves unrelated project files and non-BCO Codex configuration. Bounded managed sections are replaced between their start and end markers. Do not remove or edit only one marker.

## Contract Freshness

BCO records the canonical task definition consumed by automation: task identity, title, description, acceptance criteria, verification, type, labels, parent, and container semantics. Claims, lifecycle changes, status reasons, comments, evidence, provenance, versions, timestamps, and ordinary workflow bookkeeping do not stale a contract.

A missing or stale contract is operator-owned project-plan authority. Use **Prepare automation** to export the exact current catalog, generate a complete plan, preview and validate it, then apply or supersede it once. Workflow agents and the AI governor cannot create, refresh, amend, or supersede automation contracts and must not launch a recovery workflow for that purpose.

## Capability Declaration

Before native tasks are confirmed, `$bco-project-planning` records each required capability as one of:

- **repository:** an exact documented command, dependency, configuration, fixture, or test harness exists;
- **environment:** an exposed BCO/Codex capability is available for the workflow;
- **enabling task:** a native predecessor will create the capability before dependent work;
- **blocked:** the capability is unavailable and no automated work may start.

Do not treat a package name in prose as capability evidence. Inspect the installed dependency, configuration, command, and runnable path.

## Browser Verification

For browser-critical acceptance criteria, declare one working path:

- repository-local Playwright (or the project's established E2E runner) with a documented command and server lifecycle; or
- an available browser-control capability exposed to the workflow.

If neither exists, create an enabling task or mark the dependent task blocked. Agents must not silently install a browser tool during verification, replace browser evidence with a build, or claim end-to-end acceptance from static inspection.

## Shared Resources

Every task that uses a build, E2E suite, formatter, code generator, database, migration runner, preview server, browser server, or fixed port declares the resource and expected lifecycle. Domain orchestrators grant one owner at a time. The owner records the command, chosen port or database where applicable, cleanup result, and exact tree identity in evidence.
