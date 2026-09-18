<!-- critical-boiler:bco-contract:{{ bcoContractVersion }} -->
# Product Acceptance

Use this guide when planning, testing, or reviewing user-visible outcomes or integration boundaries. Apply only the sections relevant to the assigned scope. BCO still owns task truth and completion authority; this guide defines how agents judge evidence, not a new task store, schema, or mandatory role pipeline.

## Preserve the accepted outcome

Before decomposing a project, identify the selected release: who will use it, what they can accomplish, the supported operating environment, and explicit deferrals. Compare that target with the user's brief. A technical slice is a valid milestone when accepted as such; do not silently replace a requested usable product with a smaller demonstration. Report uncovered requested outcomes before calling the plan ready, without inventing approval or expanding execution scope.

Reconcile the main brief with the user's latest scope decisions. Suggested tools, reference-project roadmaps, and generic quality checklists do not authorize additional outcomes. Do not turn local release readiness into mandatory hosting or add human screen-reader/device walkthroughs unless explicitly requested. Preserve those requirements when they are requested and identify their real provider/authority; do not label an unresolved human dependency autonomous. Excluding a human test preserves relevant agent-executable accessibility checks and honest limits, not a claim that the excluded test passed.

Record the target and deferrals in existing native container/task descriptions and acceptance criteria, using the supported JSON fields. Map each accepted outcome to owning task keys and an integrated acceptance case. Keep product vision, selected milestone, and completed task count distinct. A demonstration should exercise the selected capabilities through real data flows; hardcoded presentation does not establish that the underlying product supports them.

For the affected release surfaces, identify each exposed route, action, and relevant state, its real behavior, implementation owner, and evidence. Examples used to develop a shell need an owner to replace, remove, or separate them before release. This is bounded acceptance coverage within native task descriptions/evidence, not a second Markdown backlog. A separate integration task owns product testing; read-only container finalization consumes its evidence without launching more work.

## Match evidence to the claim

Each stable acceptance row retains the original claim, expected observable result, verification layer, and evidence that could disprove it. During verification, record the actual result, exact artifact or assertion, identity, and limitations. Distinguish a failed criterion from one that could not be verified. A task-local matrix must not narrow the authoritative acceptance criteria.

| Claim | Suitable evidence | Insufficient substitute |
| --- | --- | --- |
| A browser can read a separate API origin | Real-browser request in representative origin, cookie, and credential conditions | HTTP 200 or an injected Origin header alone |
| Draft content stays private and publishing works | Known revisions checked through the editor and public consumer before and after publication | A successful save response |
| UI has deliberate hierarchy and usable actions | Inspected composed screens against the design target, supported by focused layout checks | Installed component library, heading roles, or no overflow alone |
| Health and retry are truthful | Observable healthy, failed, and recovered requests and UI states | A rendered error component or disabled demonstration button |
| The selected release is usable | Integrated journey and reproducible operator handoff covering accepted outcomes | Closed task rows or screenshot counts |

For automated claims, cite the test file, test/assertion, command outcome, and tested identity. For visual or manual claims, cite the inspected artifact, route/state/viewport where relevant, reviewed identity, and concrete observation against the criterion. Neither format replaces semantic judgment. Shared artifacts may support several rows; do not require duplicate labels, copies, or timestamps to imply execution order.

## Preserve the delivered environment

Compare the documented operator setup with the test setup before accepting an integration claim. Check relevant origins, scheme, routing/base paths, cookies/credentials, anonymous versus authenticated consumers, caching, and browser versus server rendering. Disposable ports and data may differ while those properties remain representative.

A test-only proxy can remove the very boundary being tested. Cover that boundary in a real browser or use the same supported proxy architecture in delivery. If assigned resources cannot represent it, state the exact unverified claim and required capability; do not bypass BCO's assigned port/resource permissions or quietly certify the substituted topology.

Inspect what verification commands actually run. Explicitly target test-owned databases, services, fixtures, and process groups; a random database name on the user's server is not an isolated server. Record bounded cleanup and never stop or reset another owner's resources. Request unavailable resources through the existing readiness/authority path.

## Assess the composed experience

For design work, use the user's references and existing design direction to define an early representative screen target: typography hierarchy, content/form widths, action prominence, density, and relevant narrow-screen behavior. Where no reference exists, choose and explain a direction within scope; do not add a universal approval checkpoint or impose a particular aesthetic or framework.

Test and inspect the affected exposed screens, including meaningful loading, empty, error, recovery, keyboard/focus, and responsive states. Judge the actual renders. A screenshot's existence or a first captured baseline is not visual approval. Missing, unreadable, or stale images leave the visual claim unverified. Give a distinct visual verdict with concrete observations, even when the same reviewer also reviews code; an extra designer/reviewer roster is unnecessary.

## Hand off only what is proved

Name the accepted milestone and its remaining deferrals. For a runnable release, the integration task verifies the documented startup, fixture/access prerequisites, URLs, meaningful user journey, persistence or refresh behavior, and safe recovery relevant to that release. Use the instructions as an operator would; do not make them reconstruct the setup from agent logs.

Reviewers assess acceptance independently of the implementer's chosen matrix and commands. Return precise defects or missing evidence; never turn cosmetic keywords, screenshot counts, CSS scores, or task completion counts into semantic gates. Accept sufficient evidence without demanding extra artifacts. After a correction, recheck affected claims on the new identity and explicitly attribute any reusable unchanged evidence to its original identity and the compared surfaces/configuration. Do not present reused results as newly executed tests.
