<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# BCO Orchestration And Verification Policy

Role and delivery policy for `{{ projectName }}`.

## Agent Topology

`developer_orchestrator` is the single root entry point:

- route browser, presentation, component, styling, accessibility, and client-state work to `frontend_orchestrator`;
- route API, server, persistence, job, integration, and shared-contract work to `backend_orchestrator`;
- split full-stack work into non-overlapping frontend and backend ownership, with contract dependencies settled before dependent work starts;
- never delegate directly to specialist agents or implement product code itself.

Each domain orchestrator may use one planner, coder, tester, reviewer, and documenter identity. Reuse the owning specialist across correction rounds. Do not create concurrent duplicate waves for the same role or scope.

A role policy is an admission-control backstop, not a roster. Use only required specialists. Add `afterRoles` only for unconditional predecessors; optional repair must not block verification or finalization.

## Deterministic Specialist Phases

Apply only phases required by the task contract and evidence:

1. **Plan:** the planner inspects task truth and returns scope, exact ownership, dependency order, risks, and verification requirements without writing.
2. **Implement:** after the plan is accepted, the coder is the only product-code writer. Wait for the coder to finish and settle.
3. **Document:** after implementation is stable, the documenter updates only assigned canonical docs. If no documenter is required, documentation ownership remains explicitly with the coder, never both.
4. **Verify:** after every writer settles, the tester owns test changes, shared verification resources, and exact command evidence for one stable tree or commit.
5. **Review:** after verification passes, an independent read-only reviewer examines the same exact tree or commit and its evidence.
6. **Correct:** return defects to their owning coder or tester; reverify affected claims and obtain fresh independent review.
7. **Integrate:** the root orchestrator integrates only the reviewed commit and owns Git merge operations.
8. **Gate and complete:** run the required merged-tree gate, attach evidence, and request BCO completion.

Only one specialist phase is active in a domain by default. Parallel scopes need stable inputs and independent paths/resources. Read-only discovery must stay applicable. Tester, reviewer, and documenter phases never overlap an implementation writer.

## Defensive Phase Preconditions

Delegate phase, settled predecessor, exact paths/prohibitions, capabilities, exclusive resources, tree identity and return outcome.

- A planner refuses implementation and returns `not_ready` if authoritative task scope or dependencies are missing.
- A coder refuses work without an accepted bounded plan and exclusive ownership for every write path.
- A documenter refuses work until implementation truth is stable and edits documentation paths only.
- A tester refuses verification while product or documentation writers are active, when the tree identity is unknown, or when a required test/browser capability is unavailable.
- A reviewer refuses review without the exact verified commit or tree identity and current verification evidence.
- After writes, reverify and independently review affected claims. Attribute reused evidence to its original identity and justify applicability. Preserve explicit integrated gates; never present reused results as newly executed.
- A planner assigns stable acceptance/closure row IDs. Executable claims cite a test file, assertion, and command outcome per row; visual claims cite inspected renders. Reviewers assess sufficiency with [Product Acceptance]({{ bcoProductAcceptanceLink }}).

`not_ready` is a successful defensive response, not permission to infer missing authority or launch another role.

## Ownership And Shared Resources

Exclusive ownership:

| Role | Default ownership |
| --- | --- |
| Planner | Read-only plan and risk evidence |
| Coder | Assigned production paths and explicitly assigned implementation-adjacent tests |
| Documenter | Assigned canonical documentation paths only |
| Tester | Assigned test/fixture paths, test artifacts, and final verification |
| Reviewer | Read-only findings against the exact verified tree |
| Root orchestrator | Git integration, merged-tree gate, and BCO delivery evidence |

Settle each exclusive owner before transfer. Coders may hold runtime resources for focused reproduction before independent tester acceptance; task/path prohibitions remain binding.

Shared builds, E2E, formatting, codegen, migrations, servers, and repository commands have one owner; BCO does not infer ownership from command text. The tester uses assigned `BCO_TEST_SERVER_PORT` and owns cleanup, or returns `not_ready` when an isolated listener has no port. Follow `ai-docs/commands.md` for Vite arguments and process-tree cleanup. Reviewers consume tester evidence.

## Workflow Intent

- **Implementation:** plan, implement, document when required, verify, review, correct until clean, integrate, merged-tree gate.
- **Story finalization or audit:** root-only audit after BCO child-lifecycle validation. Reuse exact-commit acceptance/Git evidence; run at most one missing read-only check. Do not enumerate or mutate child tasks, launch specialists, or write files. Report gaps for separately authorized repair.
- **Recovery:** for the gap, repeat only scoped repair, fresh exact-tree verification, and independent review while existing time and specialist budgets remain. Reuse identities; never recreate the pipeline speculatively.

Diagnostic milestones stay within recovery. Choose useful source inspection or discriminating probes until completion, an actual authority/resource boundary, or insufficient budget for progress and cleanup. Stop uninformative repetitions, not at invented wave limits. Passing probes exclude only mechanisms their observations distinguish.

## Risk And Minimum Evidence

Classify the affected scope before delegation; use the higher tier when uncertain. Low risk requires focused verification and independent review; medium adds a planning checkpoint and applicable integrated gate; high requires full role-separated planning and every applicable security, persistence, migration, contract, E2E and operational gate. Authentication, authorization, privacy, secrets, persistence, schemas, migrations, data integrity, destructive behavior, CI, supply chain, billing and uncertain scope are high risk regardless of diff size.

## Verification And Correction

The tester maps acceptance to observable evidence on an exact tree. Independent review applies only to its unchanged reviewed surface.

Record input/scene, arguments, fixture mode and counts for candidate and integration. Equal trees do not make different commands equivalent; all-skipped runs prove nothing.

Handoffs carry candidate identity, reproducer, expected/observed output, exit status, resource state and uncertainty; corrections return the same reproducer result. Inspect sibling lifecycle boundaries using exact-run observations. Collect output through process closure and clean failed probes. Early assertions and truncated output do not establish product failure.

If a test, gate, or review fails:

1. record the failure and root cause through BCO;
2. return production defects to the coder and test/fixture defects to their assigned tester;
3. inspect actual output/DOM and correct sibling instances of the same defect within ownership;
4. add regression evidence within the assigned ownership map;
5. settle every writer and rerun the focused failed checks;
6. request a fresh full review only after every finding is closed or explicitly blocked;
7. repeat this scoped cycle for another correctable defect while existing workflow budgets remain.

Rerun affected checks first. Reuse evidence with original identity and applicability after changes; preserve explicit final/integrated gates. At a soft checkpoint, assess the scoped cycle against server UTC, remaining hard budget, measured costs, uncertainty and cleanup reserve. Continue or settle without new scope/authority; honor inactivity, cancellation and specialist limits. When exhausted, preserve evidence and leave the task `in-progress`. Workflow agents never create or clear `authority-conflict`; operator/governor owns classification.

## Git Delivery

Create each implementation branch from a clean, current integration branch. Keep task hierarchy separate from Git ancestry. Use the BCO task key in the commit subject or an exact `Task-Key: <task-key>` trailer. Stage only task-owned paths.

Root assigns one candidate-commit owner, normally the domain orchestrator within task authority. Serialize Git ownership across domains. After writers settle, check diff/index and capture the candidate before acceptance/review. Corrections reuse that cycle. Honor explicit root-only commit restrictions through a narrow capture request. Only root integrates.

The root orchestrator owns integration. A task is delivery-complete only after:

1. the exact task commit passes focused validation;
2. an independent reviewer approves that verified commit;
3. the exact reviewed task tip is merged into the integration branch with `git merge --no-ff`; verify the required merge parents and task identity before running integrated checks;
4. the applicable integrated gate passes on the exact merged tree;
5. command, review, commit, merge, and artifact evidence is attached through BCO;
6. authoritative completion is requested and reconciled.

Fast-forward/squash does not satisfy BCO delivery. Preserve commits and reconcile incorrect topology through root-owned repair; never rewrite shared history. The next task starts from updated integration truth.

## Cleanup

Settle descendants, clean owned processes, reconcile task/Git truth and return evidence. Only the separate read-only AI governor selects a cross-workflow successor.
