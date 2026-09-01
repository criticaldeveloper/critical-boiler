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
            { "role": "planner", "afterRoles": [] },
            { "role": "coder", "afterRoles": ["planner"] },
            { "role": "tester", "afterRoles": ["coder"] },
            { "role": "reviewer", "afterRoles": ["tester"] }
          ],
          "exclusiveRoleGroups": [["coder", "tester", "reviewer"]]
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
task uses `type: "epic"`, a non-delivery workflow profile, and `gitDeliveryOwner: false`; its
verification describes finalization of its declared children rather than a second implementation.
Only declare capability and resource identifiers present in BCO's project inventory.

## Adopt an existing native catalog

Use schema version `{{ bcoTaskAdoptionSchemaVersion }}` only for tasks that already exist without
automation contracts. Start from an exact BCO catalog export. Never invent or reuse `taskId`,
`expectedVersion`, or `expectedContentFingerprint`. The plan must contain every active task; BCO
rejects partial or stale adoption atomically.

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
        "gitDeliveryOwner": true
      }
    }
  ]
}
```

## Validation boundary

BCO deterministically validates strict schema, stable authority, unique identities, graph integrity,
capability availability, role-policy consistency, and transaction idempotency. The planning agent
owns semantic decomposition, hidden prerequisites, acceptance quality, risk/profile choice, and
whether independent work is genuinely safe. Prose mentioning a dependency or ordinal task is an
advisory to inspect, not proof of an edge and not by itself a deterministic rejection.
