---
name: loop-consequence
description: "Use when checking whether a core action causes the intended outcome and whether the player can say what changed."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Map one complete loop

Check that the core action causes the change the designer intended, and that the tester can say what changed from the game's feedback (a sound, a visual cue, a vibration or a line of text).

Rubric lines this feeds: `consequence:1` (Action produces its intended state) and `consequence:2` (Feedback explains the consequence).

## Steps

1. **Draft a loop card.** One line each: starting state, player choice, system response, visible or audible cue, next choice. This is the local loop map the designer receives. A design diagram can define what to expect but earns no evidence credit on its own.
2. **Write the expected state before the input.** For each case pick a state key from the owner's list, for example `connected`. This is `expected`.
3. **Reproduce the transition.** Perform the action on the build under review and read the resulting state from the same trace or save, for example `connected` or `unchanged`. This is `actual`. Under `metrics.state.samples`, write `{caseId, expected, actual}`.
4. **Ask what changed.** Right after the cue, ask the tester "What just happened?" Keep the verbatim answer with its capture offset and code it with the agreed consequence key, for example `route opened`.
5. **Record a feedback row.** Under `metrics.feedback.samples`, write `{caseId, expected, readback}`: `expected` is the consequence key for that cue, `readback` is the coded answer.
6. **Bind the receipts.** `state` uses an artifact with `lineId` `consequence:1` and kind `trace`; `feedback` uses `lineId` `consequence:2` and kind `capture`. Both carry the pack's build ids, the profile scope, the `context` and a `source` locator.
7. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`.
8. **When you cannot measure.** If the state cannot be read from a trace or save, record NOT_RUN and leave `state` out. Do not read the state from the screen alone and call it a trace.

## Output

- `metrics.state.samples` rows `{caseId, expected, actual}` and `metrics.feedback.samples` rows `{caseId, expected, readback}`, each with its receipt.
- The local loop card for the designer.
- For a failed feedback case, a note for Game Feel (01), HUD Designer (09) or Audio Director (13) naming the cue that was missed.

## Examples by genre (illustrative)

- **Mobile puzzle game:** placing a tile should turn `disconnected` into `connected`; the expected readback is `route opened`.
- **Farming or life sim:** watering a crop should change it to `watered`; the expected readback is `plant will grow`.
- **Turn-based strategy game:** a flank order should change the target to `flanked`; the expected readback is `enemy is exposed`.
- **Rhythm game:** a tap should change the phrase to `answered`; the expected readback is `it echoed my phrase`.

## Pitfalls

- Writing `expected` after seeing the result.
- Treating "the tester smiled" as a readback. Code what they said.
- Mixing up the two lines: the state can change correctly (`consequence:1` passes) while the cue fails to explain it (`consequence:2` fails). Report both.
