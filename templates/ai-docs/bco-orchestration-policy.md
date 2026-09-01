<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Orchestration And Verification Policy

This policy defines the Complete Orchestration System generated for `{{ projectName }}`.

## Agent Topology

`developer_orchestrator` is the single root entry point:

- route browser, presentation, component, styling, accessibility, and client-state work to `frontend_orchestrator`;
- route API, server, persistence, job, integration, and shared-contract work to `backend_orchestrator`;
- split full-stack work into non-overlapping frontend and backend ownership, with contract dependencies settled before dependent work starts;
- never delegate directly to specialist agents or implement product code itself.

Each domain orchestrator may use one planner, coder, tester, reviewer, and documenter identity. Reuse the owning specialist for corrections. Do not create duplicate waves for the same role or scope.

A declared role policy is an admission-control backstop for roles that actually appear, not a roster that the workflow must instantiate. Launch only the minimum specialists required by the selected task, risk, and current evidence. Encode an `afterRoles` edge only when that predecessor is unconditionally required for the workflow profile; do not make an optional repair coder a required predecessor of verification or finalization.

## Deterministic Specialist Phases

The ordered phase catalog is a state machine for roles the task actually needs, not a list of agents to launch. Low-risk or verification work may omit planning, implementation, or separate documentation when its contract and evidence do not require those roles:

1. **Plan:** the planner inspects task truth and returns scope, exact ownership, dependency order, risks, and verification requirements without writing.
2. **Implement:** after the plan is accepted, the coder is the only product-code writer. Wait for the coder to finish and settle.
3. **Document:** after implementation is stable, the documenter updates only assigned canonical docs. If no documenter is required, documentation ownership remains explicitly with the coder, never both.
4. **Verify:** after every writer settles, the tester owns test changes, shared verification resources, and exact command evidence for one stable tree or commit.
5. **Review:** after verification passes, an independent read-only reviewer examines the same exact tree or commit and its evidence.
6. **Correct:** a defect returns to the original coder. The correction invalidates prior verification and review; repeat documentation when affected, then obtain fresh verification and review.
7. **Integrate:** the root orchestrator integrates only the reviewed commit and owns Git merge operations.
8. **Gate and complete:** run the required merged-tree gate, attach evidence, and request BCO completion.

Only one specialist phase is active in a domain by default. Parallel work is allowed only for explicitly independent, non-overlapping scopes whose inputs are already stable and that share no command, server, database, generated artifact, or Git resource. Read-only discovery may overlap only when its result cannot become stale before use. Tester, reviewer, and documenter phases never overlap an implementation writer.

## Defensive Phase Preconditions

Every delegation names its phase, predecessor result, exact owned paths, prohibited paths, required capabilities, resource lease, expected commit or tree identity, and return contract.

- A planner refuses implementation and returns `not_ready` if authoritative task scope or dependencies are missing.
- A coder refuses work without an accepted bounded plan and exclusive ownership for every write path.
- A documenter refuses work until implementation truth is stable and edits documentation paths only.
- A tester refuses verification while product or documentation writers are active, when the tree identity is unknown, or when a required test/browser capability is unavailable.
- A reviewer refuses review without the exact verified commit or tree identity and current verification evidence.
- Any post-verification write makes the evidence stale. Any post-review write requires both fresh verification and fresh review.

`not_ready` is a successful defensive response, not permission to infer missing authority or launch another role.

## Ownership And Shared Resources

The domain orchestrator records a non-overlapping ownership map before implementation:

| Role | Default ownership |
| --- | --- |
| Planner | Read-only plan and risk evidence |
| Coder | Assigned production paths and explicitly assigned implementation-adjacent tests |
| Documenter | Assigned canonical documentation paths only |
| Tester | Assigned test/fixture paths, test artifacts, and final verification |
| Reviewer | Read-only findings against the exact verified tree |
| Root orchestrator | Git integration, merged-tree gate, and BCO delivery evidence |

The coder and tester must never share a writable test path. If tests must change during correction, the orchestrator assigns each path to one owner and waits for that owner to settle before the next phase.

Builds, E2E suites, formatters, code generation, migration runners, preview servers, browser servers, and repository-wide commands are exclusive shared resources. The tester owns final verification and any browser-server lifecycle it starts: select an available project-approved port, record it, do not terminate another owner's process, and clean up the owned process. Reviewers consume tester evidence and run only a narrowly missing read-only check after the tester; they do not duplicate the full gate.

## Workflow Intent

- **Implementation:** plan, implement, document when required, verify, review, correct until clean, integrate, merged-tree gate.
- **Story finalization or audit:** BCO has already validated the declared native child lifecycle. The root audits only the selected container's acceptance, recorded evidence, Git provenance, and exact stable commit. Reuse current exact-commit evidence and run at most one narrowly missing read-only check. Do not enumerate or mutate child tasks, launch specialists, or write files. Report any exact gap so a separately authorized repair workflow can own it.
- **Recovery:** diagnose settled repository and BCO truth, authorize one bounded repair wave, then obtain fresh verification and review. Never recreate the whole agent pipeline speculatively.

## Risk And Minimum Evidence

Classify the complete affected scope before delegation. When uncertain, use the higher tier.

- **Low:** bounded implementation, focused verification, independent review.
- **Medium:** concise planning checkpoint, implementation, focused testing, independent review, and the applicable integrated gate.
- **High:** full role-separated planning, implementation, focused testing, independent review, and every applicable security, persistence, migration, contract, E2E, or operational gate.

Authentication, authorization, privacy, secrets, persistence, schemas, migrations, data integrity, destructive behavior, CI, supply chain, billing, and uncertain scope are high risk. Small diffs do not lower risk.

## Verification And Correction

Run the smallest focused checks first. The tester maps acceptance criteria to observable evidence and records the exact tree or commit. A reviewer must be independent from the coder and review that same identity. A clean review remains valid only while the reviewed surface remains unchanged.

If a test, gate, or review fails:

1. record the failure and root cause through BCO;
2. return correction to the original owning coder;
3. inspect sibling paths affected by the same defect class;
4. add regression evidence within the assigned ownership map;
5. settle every writer and rerun the focused failed checks;
6. request a fresh full review only after every finding is closed or explicitly blocked.

## Git Delivery

Create each implementation branch from a clean, current integration branch. Keep task hierarchy separate from Git ancestry. Use the BCO task key in the commit subject or an exact `Task-Key: <task-key>` trailer. Stage only task-owned paths.

The root orchestrator owns integration. A task is delivery-complete only after:

1. the exact task commit passes focused validation;
2. an independent reviewer approves that verified commit;
3. the task branch is merged into the integration branch;
4. the applicable integrated gate passes on the exact merged tree;
5. command, review, commit, merge, and artifact evidence is attached through BCO;
6. authoritative completion is requested and reconciled.

The next task branch starts from the updated integration branch. Do not rewrite history, discard unrelated changes, or close branch-only work as complete.

## Cleanup

After completion, stop or release obsolete delegated work and owned processes, reconcile every required agent result, confirm the worktree and task state, and return consolidated evidence to BCO. No workflow agent chooses or starts a project-global successor; BCO's separate read-only AI governor owns that decision after settlement.
