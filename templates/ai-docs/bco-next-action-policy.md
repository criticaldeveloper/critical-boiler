# BCO Next Action And Experimental Brain Policy

BCO evaluates terminal workflows and persists one server-owned `NextWorkflowPlan`. The plan may select one task workflow, one bounded prompt workflow, an authorized native-task repair or completion, an operator action, or project completion. Agents do not infer continuation from prose, task ordering, branch names, or claimability results.

## Selection Authority

- Every workflow agent, including `developer_orchestrator`, finishes only its assigned workflow and returns task-scoped status and evidence. Workflow agents never rank candidates, select or propose a successor, claim another task, or start another workflow.
- After terminal settlement, BCO launches a separate ephemeral AI-governor thread with a read-only sandbox, no delegation authority, no task mutation tools, and a strict structured-output schema.
- BCO supplies that governor with bounded persisted workflow, task, repository, policy, permission, budget, and candidate evidence. The governor owns semantic interpretation and returns exactly one schema-valid decision.
- Deterministic BCO code validates current identities, lifecycle, claimability, repository truth, bounds, policy, confidence, and concurrency before persisting a `NextWorkflowPlan`.

The governor must treat conflicting or stale evidence as a reason to stop and must never invent a candidate, task, prompt, evidence reference, or missing field. Workflow prompts must not imitate, preempt, or replace this governor boundary.

## Manual And Experimental Brain Execution

Experimental Brain changes launch timing only:

- with Brain off, BCO displays the persisted plan for an operator to run, repair, complete, or resolve;
- with Brain on, BCO executes that same persisted plan automatically through the normal claim, approval, permission, sandbox, concurrency, and recovery boundaries.

Brain does not create task authority, approve generated prompts, bypass Standard or YoLo permissions, expand capabilities, or make an unsafe plan executable. Manual and automatic paths execute the same persisted decision. If BCO reports a waiting or blocked operator action, Brain cannot bypass it.

## Fail-Closed Rules

- Do not choose executable work below BCO's configured confidence threshold or after a relevant budget is exhausted.
- Do not reuse a consumed task or repeat a prompt without proven repository progress.
- Do not claim a blocker is resolved without cited authoritative evidence.
- Do not turn provider failure, invalid output, stale evidence, or unavailable capabilities into fallback work.
- When no executable action is proven, return the schema's operator-action, blocked, or complete outcome rather than inventing work.

BCO validates and persists the proposal before any effect. The model supplies semantic interpretation; deterministic BCO code owns identity, bounds, persistence, permissions, claims, concurrency, execution, and recovery.
