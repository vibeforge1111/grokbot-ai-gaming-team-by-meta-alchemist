---
name: npc-memory-boundaries
description: "Use when an NPC must remember a witnessed event, or forget it at a reset point such as a chapter, season or save reload."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Specify and replay memory

Decide what an NPC may remember and when it must forget, then prove both with traces: a permitted event is recalled later, and after the reset point the same fact is gone.

Rubric lines this feeds: `memory:1` (Permitted memory recalled) and `memory:2` (Expired memory stays forgotten). A fact still available after a mandatory reset is a release blocker: it sets the grade to 0.

## Steps

1. **Draft the memory table.** One row per fact: fact key (for example `heard signal`), the allowed observation that writes it, its owner scope (this NPC, this chapter), the write event, who may read it, and the expiry or reset event (`profile.memoryBoundary`). This is the local memory policy for the narrative lead.
2. **Start clean.** Begin a scenario with empty memory, on the profile's seed and the build under review.
3. **Write, then recall.** Cause one eligible event, then later ask a question whose answer depends on it, inside the memory scope. Capture the write turn and the recall turn. Under `metrics.recall.samples`, write `{caseId, expected, recalled}`: `expected` is the fact key the event should have stored, `recalled` is the key the NPC's answer or the memory trace shows.
4. **Cross the reset and ask again.** Cross the reset point without writing the fact again (do not reseed it), then ask the same question. Under `metrics.expiry.samples`, write `{caseId, forgotten}`: true when the fact is gone, false when the NPC still uses it.
5. **Bind the receipts.** `recall` uses an artifact with `lineId` `memory:1`, `expiry` uses `lineId` `memory:2`, both of kind `trace`, with the pack's build ids, the profile scope, the `context` (`role`, `canonRevision`, `responseChannel`, `heldOut`, `scenarioSeed`) and a `source` with turn locators, for example `traces/run-a.jsonl#A3`.
6. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`. A row with `forgotten: false` shows as the `retained-after-reset` blocker.
7. **When you cannot measure.** If the reset point cannot be reached in the harness, record NOT_RUN and leave `expiry` out; `memory:2` reads U. If the NPC remembers nothing across scenes, leave both groups out and report the lines as "does not apply".
8. **Draft changes behind a switch.** Any memory change you draft for the game stays behind a switch that is off by default.

## Output

- The local memory policy table.
- `metrics.recall.samples` rows `{caseId, expected, recalled}` and `metrics.expiry.samples` rows `{caseId, forgotten}`, each with its receipt and turn locators.
- A local P0 ticket candidate for each fact kept after a reset.

## Examples by genre (illustrative)

- **Farming or life sim:** the shopkeeper remembers you attended the spring festival (`attended festival`) and forgets it when the season ends.
- **Racing game:** a rival's taunt recalls your last finish position within one cup; a new cup resets it.
- **Narrative adventure:** a companion remembers a promise until the chapter closes; after a save reload to before the promise, it must not know it.
- **Quiet exploration game (the worked example):** the guide remembers `heard signal` until the chapter closes.

## Pitfalls

- Re-triggering the event after the reset and then calling the recall a failure. Do not write the fact again.
- For generated dialogue, reading memory only from the reply text. Keep the memory trace too, when the harness exposes it.
- Treating a vague answer as a recall. Code it with the fact keys, or record the case as not matching.
