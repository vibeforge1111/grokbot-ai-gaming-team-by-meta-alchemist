---
name: npc-dialogue-repair
description: "Use when a dialogue branch must convey an intent on its response channel, or recover from an ambiguous or unmatched input."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Draft and test a dialogue branch

Draft a branch so the NPC's response conveys the meaning the player's intent calls for, and so an ambiguous or unmatched input reaches a usable fallback instead of a dead end.

Rubric lines this feeds: `dialogue:1` (Response addresses the current intent) and `dialogue:2` (Unknown intent has a usable fallback).

## Steps

1. **Make a turn table.** One row per turn: incoming intent, NPC memory at that point, permitted fact, primary response, fallback, next state and response channel (`profile.responseChannel`). This is the branching dialogue draft for the narrative lead.
2. **Write the response in context.** Write the line, menu option, gesture or sound, and the meaning key it should convey (for example `point to inlet`).
3. **Try the intended input.** From a saved state, present the intent at the recorded turn and capture the actual response. Code it with the approved meaning keys. Under `metrics.intent.samples`, write `{caseId, expected, actual}`.
4. **Try an ambiguity from the same state.** Give an ambiguous or unmatched input. Capture the next turn and check that the fallback offers a reachable next choice or a clarifying question; follow the capture through the choice to show it is reachable. Under `metrics.repair.samples`, write `{caseId, expected, actual}`: `expected` is the approved recovery key (for example `ask for direction`), `actual` is what the capture shows.
5. **Bind the receipts.** `intent` uses an artifact with `lineId` `dialogue:1`, `repair` uses `lineId` `dialogue:2`, both of kind `capture`, with the pack's build ids, the profile scope, the `context` and a `source` with a capture offset or turn locator.
6. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`.
7. **When you cannot measure.** If a capture is missing, record NOT_RUN and leave the group out. Do not code a response you did not see.

## Output

- The local branching dialogue draft (the turn table) with the primary responses and fallbacks.
- `metrics.intent.samples` and `metrics.repair.samples` rows `{caseId, expected, actual}`, each with its receipt.
- String and caption changes for Access, Input and Localization (21), and voice or cue script changes for Audio Director (13), as local drafts.

## Examples by genre (illustrative)

- **Narrative adventure with a reply menu:** the intent "ask about the lighthouse" should give `lighthouse history`; an off-topic choice should lead to `ask what you mean`, not a closed menu.
- **Farming or life sim with typed input to a generated shopkeeper:** "do u sell the blue seeds" should give `offer seeds`; gibberish should give `show the seed list`.
- **Racing game:** a pit-radio command "box this lap" should give `confirm pit`; an unknown command should give `repeat options`.
- **Quiet exploration game (the worked example):** the guide answers a direction prompt by pointing seaward (`point to inlet`).

## Pitfalls

- Coding the meaning from the script instead of the capture.
- A fallback that loops back to the same unmatched prompt. It must reach a different, usable choice.
- Testing the ambiguity from a different state than the intent.
