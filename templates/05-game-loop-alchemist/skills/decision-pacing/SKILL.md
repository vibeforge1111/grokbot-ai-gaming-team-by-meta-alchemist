---
name: decision-pacing
description: "Use when a loop feels slow or a setback delays the next useful choice: measure the time between decisions and the time to act again."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Measure decision and recovery beats

Measure how long the player waits between one decision and the next, and how long it takes to act usefully again after a setback, undo or retry. The budgets come from the profile: `beatBudgetS` and `recoveryBudgetS`.

Rubric lines this feeds: `pacing:1` (Time between decisions) and `pacing:2` (Time to regain agency).

## Steps

1. **Pick the beat and the setback from the loop map.** The decision beat runs from the moment one choice resolves to the moment the next choice is available. The setback is the one the owner approved (a fall, a failed board, a lost unit, a wrong answer).
2. **List the approved pauses.** Cutscenes, loading or an opponent's turn are left out only if the owner listed them. Keep each pause as a separate annotation with its start and end, so a reviewer can check the subtraction.
3. **Mark the decision beat on one clock.** `resolvedS` is when the previous choice resolved; `choiceS` is when the next choice became available, with approved pauses taken out. Under `metrics.beat.samples`, write `{caseId, resolvedS, choiceS}`.
4. **Mark the recovery on the same clock.** `setbackS` is the setback; `controlS` is the first moment a useful input is possible again. Under `metrics.recovery.samples`, write `{caseId, setbackS, controlS}`.
5. **Bind the receipts.** `beat` uses an artifact with `lineId` `pacing:1`, `recovery` uses `lineId` `pacing:2`, both of kind `trace`, with the pack's build ids, the profile scope, the `context` and a `source` locator.
6. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`.
7. **When you cannot measure.** A beat that ran past the budget is a measured failure: keep the row. A missing end timestamp is not a failure; it makes the line U until you recapture. If the game has no setback, leave `recovery` out and report `pacing:2` as "does not apply".
8. **Draft one change.** For the slowest measured wait, draft one reversible change with its predicted effect and a condition for undoing it. This is the experiment card.

## Output

- `metrics.beat.samples` rows `{caseId, resolvedS, choiceS}` and `metrics.recovery.samples` rows `{caseId, setbackS, controlS}`, each with its receipt.
- A local pacing diagnosis: the measured waits against the budgets, with pauses shown separately.
- One experiment card for the slowest measured wait.

## Examples by genre (illustrative)

- **Mobile puzzle game:** beat from a resolved placement to the next available placement; recovery from a dead end to the first move on the retried board.
- **2D platformer:** recovery from a fall to the first input after the respawn.
- **Turn-based strategy game:** beat from the end of the enemy turn to the first available order, with the enemy animation as an approved pause if the owner says so.
- **Racing game:** recovery from a crash to throttle control.
- **Narrative adventure:** beat between two dialogue choices, with a cutscene as an approved pause.

## Pitfalls

- Subtracting pauses the owner never approved.
- Taking the start from a video and the end from a game log. One clock per row.
- Recording a timeout as a missing value. If the next choice was observed late, that is a measured failure.
