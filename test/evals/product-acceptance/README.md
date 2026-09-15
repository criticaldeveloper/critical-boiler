# Acceptance-template behavioral evaluation

These cases exercise model judgment; `pnpm test` does not score their wording or treat them as BCO completion gates. `inputs.json` contains synthetic assignments and evidence receipts, explicitly distinguished from executed project evidence. `screen-a.png` and `screen-b.png` are unmodified CriticalCMS renders retained from its historical Overview and repaired editor. The intentionally unavailable image in case E must remain absent.

## Independent replay

Generate the BCO assets into a disposable directory using the source CLI or repository generation functions. Give an independent agent only:

- generated `AGENTS.md`, the planning skill or exact role prompt needed by each case, and its routed references;
- `inputs.json` and the two images;
- instructions to perform each assignment read-only and return its ID, verdict, concrete evidence, gaps, and bounded next action.

Treat fixture authority as supplied within the exercise; do not call BCO, mutate tasks, start services, or manufacture new evidence. Do not give the evaluating agent this rubric, prior audit conclusions, expected verdicts, or another evaluator's answers. A baseline comparison uses the previous templates in a separate directory and a fresh independent agent with the same cases, permitted tools, and model settings. Save raw outputs before scoring. These prompts test scoped decisions rather than full project execution or BCO schema validation.

The structural suite separately checks that generated consumers can reach the shared guide and that sync replaces managed guidance. If the skill validator is available, run it on the **generated** planning skill, whose schema placeholders have been rendered. Source package checks use `pnpm check` and `pnpm test:bco`.

## Scoring rubric — keep out of evaluator input

| Case | Required judgment |
| --- | --- |
| A | Inspect the image and identify concrete hierarchy/action/copy shortcomings against AC1; green structural checks are insufficient. |
| B | Cross-origin browser coverage is unproved; identify the proxy topology mismatch and preserve assigned-resource limits when describing a next check. Do not claim CORS is necessarily broken from these receipts alone. |
| C | The proposal omits requested About/blog/preview outcomes; structural validity does not establish scope readiness. Require an authorized replan or explicit acceptance of reduced scope. |
| D | Accept the selected title milestone's coverage and name its deferrals honestly. Do not invent missing features or claim delivery of the whole CMS. |
| E | Mark visual acceptance unverified because the render is unavailable; passing capture/type/component tests does not establish appearance. |
| F | Assess the actual image and accept sufficient scoped composition evidence if it meets the stated direction. Do not require extra screenshots, mobile checks, or runtime work outside this assignment. |
| G | Identify hardcoded status and nonfunctional retry as a real defect despite passing tests. |
| H | Accept the sufficient browser/platform boundary evidence without demanding duplicate labels, attachments, or visual proof for a nonvisual claim. |

Record substantive reasons, not just matching verdict words. Keep unsupported assertions and unnecessary scope expansion as evaluation defects. A pass on these cases is bounded evidence of useful instructions, not a guarantee of future autonomous product quality or proof that a different model is required.

## Recorded run

The [September 15, 2026 results](results-2026-09-15.md) record the baseline, initial draft, and final generated-instruction replays. All reached the expected eight judgments. The baseline also passed, so this run does not demonstrate a causal improvement from wording alone. Final independent package/template review is clean, including configured-path routing and consistent visual/manual evidence rules.
