# BCO Orchestration And Verification Policy

This policy defines the Complete Orchestration System generated for `{{ projectName }}`.

## Agent Topology

`developer_orchestrator` is the single root entry point:

- route browser, presentation, component, styling, accessibility, and client-state work to `frontend_orchestrator`;
- route API, server, persistence, job, integration, and shared-contract work to `backend_orchestrator`;
- split full-stack work into non-overlapping frontend and backend ownership with explicit contract dependencies;
- never delegate directly to specialist agents or implement product code itself.

Each domain orchestrator owns its planner, coder, tester, reviewer, and documenter pipeline. Planners clarify bounded scope; coders implement; testers add focused evidence; reviewers remain independent and read-only; documenters update canonical project documentation. Reuse the owning agent for corrections instead of creating duplicate waves.

## Risk And Minimum Pipeline

Classify the complete affected scope before delegation. When uncertain, use the higher tier.

- **Low:** bounded implementation, focused verification, independent review.
- **Medium:** concise planning checkpoint, implementation, focused testing, independent review, and the applicable integrated gate.
- **High:** full role-separated planning, implementation, focused testing, independent review, and every applicable security, persistence, migration, contract, E2E, or operational gate.

Authentication, authorization, privacy, secrets, persistence, schemas, migrations, data integrity, destructive behavior, CI, supply chain, billing, and uncertain scope are high risk. Small diffs do not lower risk.

## Delegation Contract

Every delegated task includes:

- BCO task ID and current version;
- owned paths and prohibited overlaps;
- acceptance criteria and dependencies;
- required evidence and applicable gates;
- the expected return contract.

Do not allow concurrent edits to overlapping files. When constraints change, steer the existing owning agent. Wait for required results through event-driven coordination and report only actual state changes, completion, failure, or operator decisions.

## Verification And Independent Review

Run the smallest focused checks first. A tester owns focused behavioral evidence when the risk or acceptance criteria require it. A reviewer must be independent from the coder and must review the exact task commit. A clean review does not need repetition unless a subsequent correction changes the reviewed surface.

If a test, gate, or review fails:

1. record the failure and root cause through BCO;
2. return correction to the owning coder;
3. inspect sibling paths affected by the same defect class;
4. add regression evidence;
5. rerun the focused failed checks;
6. request rereview only after every finding is closed or explicitly blocked.

## Git Delivery

Create each implementation branch from a clean, current integration branch. Keep task hierarchy separate from Git ancestry. Use the BCO task key in the commit subject or an exact `Task-Key: <task-key>` trailer. Stage only task-owned paths.

The root orchestrator owns integration. A task is delivery-complete only after:

1. the exact task commit passes focused validation;
2. an independent reviewer approves that commit;
3. the task branch is merged into the integration branch;
4. the applicable integrated gate passes on the exact merged tree;
5. command, review, commit, merge, and artifact evidence is attached through BCO;
6. authoritative completion is requested and reconciled.

The next task branch starts from the updated integration branch. Do not rewrite history, discard unrelated changes, or close branch-only work as complete.

## Cleanup

After completion, stop or release obsolete delegated work, reconcile every required agent result, confirm the worktree and task state, and return consolidated evidence to BCO. No workflow agent chooses or starts a project-global successor; BCO's separate read-only AI governor owns that decision after settlement.
