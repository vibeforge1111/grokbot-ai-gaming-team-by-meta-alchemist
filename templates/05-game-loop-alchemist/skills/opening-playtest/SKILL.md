---
name: opening-playtest
description: "Use when a new opening needs an unaided goal readback and a time to the first meaningful action, in any genre."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Capture the first meaningful action

Check that a new player understands the goal without help, and reaches the first action that changes the game state within the owner's time budget. A *meaningful action* is the first input that can change the game state, as the owner defined it in the profile (`profile.action`). A menu input counts only if the profile says so.

Rubric lines this feeds: `opening:1` (Opening goal understood) and `opening:2` (Time to meaningful action).

## Steps

1. **Prepare a private observer sheet.** Copy the profile's `action` and `outcome` and the goal key (the short phrases observers use to code a goal, for example `connect exits`). Testers never see the sheet.
2. **Start at first control.** Begin the recording or trace at the first moment the tester can control the game (`startS`, seconds on the session clock). Title screens and loading before control are not part of the budget unless the owner says so.
3. **Ask for the goal before any hint.** Ask "What are you trying to do?" without naming the goal. Keep the anonymous verbatim answer with its capture offset, then code it with the goal key.
4. **Record a goal row.** Under `metrics.goal.samples`, write `{caseId, expected, readback}`: `expected` is the goal key, `readback` is the coded answer. A hint given before the answer makes the case invalid; leave it out and note why.
5. **Timestamp the first meaningful action.** Mark `actionS`, the first input of the profile's action, on the same clock as `startS`. Under `metrics.action.samples`, write `{caseId, startS, actionS}`.
6. **Bind the receipts.** Give each group an artifact in `pack.artifacts`: `lineId` `opening:1` (kind `capture`) or `opening:2` (kind `trace`), the pack's `gitSha` and `liveSha`, the profile `scope`, a `context` copying the profile's `cohort`, `window`, `action` and `outcome`, and a `source` such as `notes/session-12.md#goal`.
7. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>` and read the levels of `opening:1` and `opening:2`.
8. **When you cannot measure.** If the session was not recorded, write NOT_RUN in the local report and leave the group out of the pack. A missing timestamp or an end before the start makes the line U; recapture rather than estimate.

## Output

- `metrics.goal.samples` rows `{caseId, expected, readback}` and `metrics.action.samples` rows `{caseId, startS, actionS}`, each group with its receipt.
- A local note per case with the verbatim answer, its capture offset and the coding.
- The next missing capture for any U line.

## Examples by genre (illustrative)

- **Mobile puzzle game:** goal key `connect exits`; first action is placing a tile.
- **2D platformer:** goal key `reach the flag`; first action is the first jump onto a platform, not walking right.
- **Turn-based strategy game:** goal key `take the bridge`; first action is the first order that moves a unit.
- **Narrative adventure:** goal key `find the missing sister`; first action is the first dialogue choice.
- **Racing game:** goal key `finish in the top three`; first action is the first throttle input after the countdown.

## Pitfalls

- Asking "Are you trying to connect the exits?" leads the tester. Ask an open question.
- Coding the readback after seeing whether the tester succeeded. Code it first.
- Two clocks in one row (a video timer for the start and a game log for the action). Use one clock per row.
- Counting a menu press as the meaningful action when the profile does not say so.
