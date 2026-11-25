---
name: decision-gates
description: "Use when the owner needs a go or hold decision after the workstreams finish: check required gates, including other templates' grade records, and owned risk rows."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Draft a release decision

Prepare the go or hold recommendation: every required gate must have a current passing receipt, and every material risk must have an owner, a trigger, a fallback and a decision point. A measured failed gate or an open P0 holds the decision even when everything else looks complete.

Rubric lines this feeds: `release-decision:1` (Required discipline gates pass) and `release-decision:2` (Risks have owned decision paths).

## Steps

1. **List the required gates.** Take them from `profile.requiredGates`. Each needs a row in `snapshot.gates` with `id`, `gitSha`, `liveSha`, `scope`, `source` and `passed`.
2. **Read another template's grade record as a gate.** A required gate can be another template's grade record. Copy its templateId, rubricHash and liveSha into the gate source. Set passed to true only for verdict PASS on this liveSha, and false for BLOCKED or a required line below 3. A missing or other-build record leaves the gate unmeasured. Records live in `.grokbot-team/artifacts/grade-record/` when the team runs together. In practice:
   - `source` reads like `gbf-01-game-feel sha256:<rubric hash> <liveSha> .grokbot-team/artifacts/grade-record/<file>.json`.
   - The gate row's `gitSha` and `liveSha` are the record's build ids; if they are not this pack's build, the gate is not current and stays unmeasured.
   - Verdict PASS on this liveSha: `passed: true`. Verdict BLOCKED, or any measured line the owner listed as required below level 3: `passed: false`.
   - Verdict CONDITIONAL with no measured required line below 3, verdict INVALID, or a synthetic record: leave `passed` out (unmeasured) and ask for the missing capture.
3. **Other gates.** A playable build check, a sign-off from a lead or a store compliance check can be a gate too, with its own receipt as `source`.
4. **Hold on missing receipts.** If a required gate has no current receipt, the decision is hold, not go. The final decision task waits for every other task (see `parallel-handoffs`).
5. **Draft risk rows.** For each material risk add a row to `snapshot.risks` with `id`, `role` (who owns it, as a role label), `trigger` (what you will observe), `fallback` (what you will do) and `decision` (the milestone or meeting where it is decided).
6. **Build and grade.** From the template folder run `node engine/plan.mjs <project.json> --pack > <pack.json>`, then `node engine/lens.mjs <pack.json>`. The pack holds `gate` rows `{caseId, passed}` (one per required gate) and `risk` rows `{caseId, actionable}`. A `passed: false` gate is the `failed-gate` release blocker and sets the grade to 0.
7. **Write the decision.** In the local decision note cite the pack id, the gate receipts, the open P0 count and each blocker. Recommend go only for verdict PASS.

## Output

- A local go or hold recommendation with the gate table and the risk table.
- `gate` and `risk` rows in the pack the planner builds.

## Examples by genre (illustrative)

- **Mobile puzzle game:** gates are the Game Loop Alchemist (05) grade record for the first session and the HUD Designer (09) record for touch targets on the smallest supported phone.
- **Narrative adventure:** gates are the Living AI NPC and Lore (14) record for the chapter and the Access, Input and Localization (21) record for captions.
- **Racing game:** a risk row: role `code`, trigger "frame time above budget on the lowest supported device in the first track", fallback "ship two tracks instead of three", decision "milestone 3 review".

## Pitfalls

- Treating a CONDITIONAL grade record as a pass.
- Using a grade record from an older build because "nothing changed in that area".
- A risk row whose fallback just says "monitor". Name what you will do.
