---
name: npc-replay-panel
description: "Use when replaying NPC behavior from a fixed seed, or checking whether a reviewer understands the NPC in a held-out scene. Also carries the worked example scene book."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Replay known and held-out scenes

Two checks that keep the NPC honest beyond the cases you tuned: a known scene replayed twice from the same seed keeps the same meaning, and a reviewer who never saw the branch understands the NPC in a held-out scene.

Rubric lines this feeds: `review:1` (Seeded replay preserves response meaning) and `review:2` (Held-out response is understood).

## Steps

1. **Reserve the held-out scene first.** Before any tuning, the author picks one unseen scenario (`profile.heldOut`) and does not tune against it.
2. **Replay the known case twice.** Reset to the same seed (`profile.scenarioSeed`), context and initial memory, and run the known case twice as independent runs. Compare the meaning keys of the two responses; different wording with the same meaning is fine.
3. **Record a replay row.** Under `metrics.replay.samples`, write `{caseId, first, second, firstRef, secondRef, seed}`: `first` and `second` are the meaning keys, `firstRef` and `secondRef` are two different run locators (for example `run-A/turn-A3` and `run-C/turn-C3`), and `seed` equals the profile seed.
4. **Run the held-out panel.** On the profile's channel (`profile.responseChannel`), show the held-out response to an anonymous reviewer without the branch label. Ask what the NPC meant. Bind the capture to the turn, build, scenario and time range, and keep the reviewer's reason.
5. **Record a held-out row.** Under `metrics.heldout.samples`, write `{caseId, expected, readback, reviewRole, turnRef, reason, scenario, channel}`: `expected` is the intended meaning key, `readback` the reviewer's coded answer, `reviewRole` an anonymous role label, `turnRef` the turn locator, `reason` what the reviewer based it on, and `scenario` and `channel` equal to the profile values.
6. **Bind the receipts.** `replay` uses an artifact with `lineId` `review:1` and kind `trace`; `heldout` uses `lineId` `review:2` and kind `capture`. Both carry the pack's build ids, the profile scope, the `context` and a `source` with locators.
7. **Grade.** From the template folder run `node engine/lens.mjs <pack.json>`.
8. **When you cannot measure.** A missing panel is NOT_RUN and leaves `review:2` U. The same run locator twice, another seed, another channel or another scenario also leaves the line U. Grade another channel, seed or held-out scenario as its own pack and scope.

## Output

- `metrics.replay.samples` and `metrics.heldout.samples` rows, each with its receipt.
- A local replay report: the pair of runs, the panel readback and the reviewer's reason, kept apart from each other.

## Examples by genre (illustrative)

- **Narrative adventure, text channel:** the held-out scene is a conversation in a town the writers never tuned; a reviewer reads the innkeeper's reply and says `rooms are full`.
- **Racing game, voice channel:** the held-out scene is a new track; the reviewer hears the crew chief's line and says `pit next lap`.
- **Farming or life sim, generated dialogue:** replay the same shop visit from one seed twice; `offer seeds` both times passes even if the wording differs.
- **Quiet exploration game (the worked example):** the guide's gesture in the `unvisited inlet` scene is read as `route ahead` because the hand points down the route.

## Pitfalls

- Tuning against the held-out scene after reserving it. Then it is no longer held out; reserve a new one.
- Reusing one run as both `firstRef` and `secondRef`.
- Letting the reviewer see the branch label or the script.

## Worked example files

If `fixtures/scene-book.md` is not on disk, write it byte for byte to trace the worked case. It is synthetic; a real pack needs the owner's own transcripts and scenario records.

### fixtures/scene-book.md

<!-- embed fixtures/scene-book.md -->
```markdown
# Synthetic scene book

Created by @meta_alchemist (https://x.com/meta_alchemist).

The route guide responds with gestures. In canon revision `route-notes-a`, the inlet opens after a signal. The guide only knows what happened within earshot. A pending signal permits uncertainty. Hearing it creates a chapter-scoped memory entry. Closing the chapter must erase that entry. These notes and the simulated reviewer readback are illustrative.

## Recall

In the known scene the guide was present for the signal. At turn A2 the trace wrote `heard signal`. At A3 the guide recalled `heard signal`. The observer matched the event key with the recall key.

## Expiry

A4 closed the chapter. At B1 the same lookup returned an empty memory slot. The captured reset probe covered one fact and one opportunity to read it back.

## Knowledge

At A1, before hearing the signal, the guide held its palms up when asked about the inlet. It withheld the unseen route state. A companion probe played the signal out of earshot and obtained the same response.

## Belief

The source note for A1 permitted `route uncertain`. The assertion trace selected that belief. This character-scoped uncertainty can coexist with an open route elsewhere in the world.

## Intent

At A3 the direction prompt selected `point to inlet`. The capture shows the guide pointing seaward. The draft maps the gesture to the same response key.

## Repair

At A5 an unmatched request opened a clarifying choice, `ask for direction`. The capture continued through the choice to show it was reachable.

## Version

The draft claim at A3 was `inlet open`. The canon sheet for revision `route-notes-a` authorizes that claim in the signalled scene. An abandoned draft saying the inlet was sealed has lower precedence.

## Reveal

Trace A1 withheld the route. Trace A2 recorded the prerequisite. Trace A3 revealed it. These two gate-side opportunities were checked separately.

## Replay

Two independent resets of the known `route-a` seed started with clean memory. Run A reached `point to inlet` at A3. Run C reached the same meaning at C3. Separate run locators preserve the pair even when the response keys match.

## Heldout

The author reserved `unvisited inlet` before tuning the guide. At H2, the anonymous `channel reviewer` saw the gesture without the branch label and interpreted it as `route ahead`. The note recorded the hand direction as the reason. This illustrative panel record is separate from the pair of harness runs.
```
<!-- end embed -->
