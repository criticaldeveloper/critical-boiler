# Native Task Draft Contract

Represent each proposed task with these fields. Use repository conventions for enum values and omit unsupported optional fields rather than inventing API values.

| Field | Requirement |
| --- | --- |
| `key` | Stable unique project key used by dependency references |
| `title` | One observable outcome, not an activity list |
| `type`, `priority`, `labels` | Project-supported classification |
| `scope.in` | Exact behavior and surfaces owned by the task |
| `scope.out` | Adjacent behavior intentionally excluded |
| `acceptanceCriteria` | Observable, independently checkable results |
| `verification` | Exact command, browser flow, artifact, or inspection evidence |
| `dependsOn` | Stable task keys persisted as native BCO edges |
| `parent` | Optional hierarchy key; never implies dependency |
| `domain`, `risk` | Routing and gate requirements |
| `capabilities` | Repository, environment, enabling-task, or blocked declarations |
| `resources` | Exclusive commands, server/port, database, codegen, or migration needs |
| `delivery` | Branch base, owner, review, merge, and merged-tree evidence |

Validation rejects duplicate or missing keys, unresolved or self-references, cycles, prose-only dependency claims, acceptance criteria without evidence, hidden cross-domain contracts, unavailable required capabilities without enabling predecessors, and tasks combining independently deliverable outcomes.

Render the plan in dependency order and include a compact edge list (`A -> B` means B depends on A). Preserve stable keys when correcting the graph so an operator can reconcile revisions safely.
