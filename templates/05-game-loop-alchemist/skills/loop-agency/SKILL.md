---
name: loop-agency
description: "Use when verifying that a different choice leads somewhere different and that a player can stop freely at the agreed stop point."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Test alternative choices and stopping

Check two things: a different choice from the same starting state leads to a different, intended next beat; and a player who asks to stop at the agreed stop point is not pulled into another cycle.

Rubric lines this feeds: `agency:1` (A choice changes the next beat) and `agency:2` (An explicit stop is honored). A tester forced into another cycle after asking to stop is a release blocker: it sets the grade to 0.

## Steps

1. **Pick a starting state.** Use a save, seed or board the owner approved, so both routes start the same.
2. **Write the expected difference first.** For the alternate choice, write the state key it should lead to, for example `alternate route`. This is `expected`.
3. **Play both routes.** Take the baseline choice, reload, then take the alternate. Read the state the alternate leads to from the trace. This is `actual`. Under `metrics.choice.samples`, write `{caseId, expected, actual}`.
4. **Test the stop point.** At the profile's stop point (a level end, a results screen, end of a day, a chapter end), the tester declines the next cycle. Record whether play stopped. Under `metrics.exit.samples`, write `{caseId, honored}` with `honored` true or false. Keep the capture of the decline and what happened next in the cited source.
5. **Bind the receipts.** `choice` uses an artifact with `lineId` `agency:1` and kind `trace`; `exit` uses `lineId` `agency:2` and kind `capture`. Both carry the pack's build ids, the profile scope, the `context` and a `source` locator.
6. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`. A row with `honored: false` shows as the `forced-continuation` blocker.
7. **Route a blocker.** For a witnessed forced continuation, draft a local P0 ticket candidate for Bug Desk (18) with the capture and the stop point. Do not file it.
8. **When you cannot measure.** If the stop point was never reached, record NOT_RUN and leave `exit` out; `agency:2` reads U.

## Output

- `metrics.choice.samples` rows `{caseId, expected, actual}` and `metrics.exit.samples` rows `{caseId, honored}`, each with its receipt.
- A local P0 ticket candidate for each forced continuation.

## Examples by genre (illustrative)

- **Mobile puzzle game:** a different tile opens an alternate route; declining the optional board ends the run.
- **Narrative adventure:** a different reply leads to a different scene; quitting at a chapter end returns to the menu without starting the next chapter.
- **Farming or life sim:** planting a different crop changes the next day's harvest; sleeping and choosing "save and quit" does not start another day.
- **Racing game:** a different pit choice changes the race order; declining the rematch returns to the menu instead of starting a countdown.
- **Turn-based strategy game:** a different order changes the enemy's next move; save and quit at end of turn does not auto-start the next turn.

## Pitfalls

- Comparing two routes from different saves.
- If the tester declined but a countdown or auto-start began the next cycle anyway, record `honored: false`.
- Recording `honored: true` without keeping the capture that shows it.
