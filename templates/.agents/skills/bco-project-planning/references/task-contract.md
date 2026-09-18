# Native BCO Planning Contracts

BCO accepts JSON and becomes the only task authority after apply. Do not emit a Markdown backlog as
an import format. Preserve field names, enum values, and directions exactly; BCO rejects unknown
fields.

## Create a project plan

Use schema version `{{ bcoProjectPlanSchemaVersion }}`. `blockedByKeys` contains the stable keys of
tasks that must finish before this task. `parentKey` is organization only and never implies order.

```json
{
  "schemaVersion": 1,
  "planId": "release-2026-09",
  "tasks": [
    {
      "key": "FE-001",
      "title": "Deliver the observable frontend outcome",
      "description": "In scope, out of scope, affected surfaces, and durable constraints.",
      "acceptanceCriteria": "Observable results that another agent can check independently.",
      "verification": "corepack pnpm --filter @project/web test && corepack pnpm --filter @project/web typecheck",
      "type": "feature",
      "priority": 1,
      "labels": ["frontend"],
      "ownerId": "optional-owner",
      "parentKey": "EPIC-001",
      "blockedByKeys": ["API-001"],
      "automation": {
        "schemaVersion": 1,
        "workflowProfile": "delivery",
        "riskTier": "standard",
        "requiredCapabilities": ["script:test"],
        "expectedEvidence": ["verification", "review", "git-commit"],
        "requiredResources": ["repo"],
        "gitDeliveryOwner": true,
        "rolePolicy": {
          "schemaVersion": 1,
          "phases": [
            { "role": "frontend_planner", "afterRoles": [] },
            { "role": "frontend_coder", "afterRoles": ["frontend_planner"] },
            { "role": "frontend_tester", "afterRoles": ["frontend_coder"] },
            { "role": "frontend_reviewer", "afterRoles": ["frontend_tester"] }
          ],
          "exclusiveRoleGroups": [["frontend_coder", "frontend_tester", "frontend_reviewer"]]
        }
      }
    }
  ]
}
```

Required enums:

- `type`: `bug`, `feature`, `task`, `epic`, `chore`, or `decision`;
- `priority`: integer `0` through `4`;
- `workflowProfile`: `delivery`, `verification`, `integration`, `documentation`, or `decision`;
- `riskTier`: `low`, `standard`, or `high`;
- `expectedEvidence`: `workflow-artifact`, `command-output`, `review`, `git-commit`, `archive`,
  `external-reference`, or `verification`.

An integration or verification task must reach delivery work through `blockedByKeys`. A container
task uses `type: "epic"` and `gitDeliveryOwner: false`; use `workflowProfile: "decision"` for
root-only child-closure auditing without a separate upstream delivery dependency. The
verification/integration delivery-dependency rule also applies to containers; do not choose one
of those profiles merely because closure checks evidence. Its
verification describes finalization of its declared children rather than a second implementation.
Do not make a container depend on its own descendant; BCO's combined hierarchy/dependency graph
and native child-finalization preflight own that boundary. Use capability identifiers supported by
BCO, including capabilities a named predecessor will produce and demonstrate. Current inventory
is an observation, not a requirement that future outputs already exist before plan import.
Resource identifiers declare concrete coordination scopes and ownership; they are not IDs from a
general resource registry. Preserve unresolved requirements honestly instead of emptying arrays or
asserting false availability. Use existing task fields for provider, evidence, and ownership details.

`rolePolicy` is an admission-control contract for observed roles, not an instruction to launch every listed role. Use exact IDs from `.codex/config.toml`; use the equivalent `backend_*` IDs for backend work. Include only roles relevant to the workflow profile, and add an `afterRoles` edge whenever that predecessor is unconditionally required. A delivery task may use the full example chain. A verification task that needs no implementation should normally declare tester then reviewer. A container finalization task should not declare a specialist pipeline: BCO validates its native child lifecycle before launch, and the root workflow performs only the bounded closure audit. Never encode an optional repair coder as a mandatory predecessor. Define any permitted correction paths, role ownership, candidate commits and Git delivery coherently when planning; changed work needs affected verification and independent review. A read-only task with no correction authority returns evidence for governor follow-up rather than inventing permission.

## Adopt an existing native catalog

Use schema version `{{ bcoTaskAdoptionSchemaVersion }}` for tasks that already exist and need missing
or stale automation contracts prepared. Start from an exact BCO catalog export. Never invent or reuse `taskId`,
`expectedVersion`, or `expectedContentFingerprint`. The plan must contain every active task; BCO
rejects partial or stale adoption atomically. The export and returned adoption JSON are temporary
operator artifacts, not project authority or deliverables; keep them outside the repository and
normally do not commit them.

```json
{
  "schemaVersion": 1,
  "operation": "adopt-existing",
  "planId": "adopt-existing-2026-09",
  "tasks": [
    {
      "taskId": "server-exported-task-id",
      "taskKey": "FE-001",
      "expectedVersion": 7,
      "expectedContentFingerprint": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "verification": "corepack pnpm --filter @project/web test",
      "automation": {
        "schemaVersion": 1,
        "workflowProfile": "delivery",
        "riskTier": "standard",
        "requiredCapabilities": ["script:test"],
        "expectedEvidence": ["verification", "review", "git-commit"],
        "requiredResources": ["repo"],
        "gitDeliveryOwner": true,
        "rolePolicy": {
          "schemaVersion": 1,
          "phases": [
            { "role": "frontend_planner", "afterRoles": [] },
            { "role": "frontend_coder", "afterRoles": ["frontend_planner"] },
            { "role": "frontend_tester", "afterRoles": ["frontend_coder"] },
            { "role": "frontend_reviewer", "afterRoles": ["frontend_tester"] }
          ],
          "exclusiveRoleGroups": [["frontend_coder", "frontend_tester", "frontend_reviewer"]]
        }
      }
    }
  ]
}
```

## Validation boundary

BCO deterministically validates strict schema, stable authority, unique identities, graph integrity,
role-policy consistency, and transaction idempotency, and observes capability availability for
admission and fresh launch checks. The planning agent
owns an explicit cross-layer semantic audit across the complete plan and repository: hidden
prerequisites, incorrect ordering, overlapping scope or ownership, executable acceptance criteria,
automation-contract fit, risk/profile choice, and whether independent work is genuinely safe. BCO
preview and apply add a fresh read-only semantic audit. Prose mentioning a dependency or ordinal
task is an advisory to inspect, not proof of an edge and not by itself a deterministic rejection.
Return the complete final JSON with no audit fields, comments, or invented properties. Keep its
validation receipt and material-change explanation alongside it. If no BCO preview was available,
say so; a custom validator or planning-session model review is not BCO acceptance. Adoption updates
verification and automation only: scope changes need authorized native-task edits and a fresh export.
