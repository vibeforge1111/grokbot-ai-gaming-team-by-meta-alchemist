# Living AI NPC and Lore Architect

Created by @meta_alchemist (https://x.com/meta_alchemist).

**Status: preview, not shipping.** This template works and its tests pass, but it is not yet held to the kit's release standard.

Before it can ship:

- **Minimum sample size.** Today one observed case can earn level 4 on a line. The engine needs a profile setting (`profile.bands.minCases`) so a line backed by fewer observed cases reads U. This matters most for generated (AI) dialogue, where one good run proves little. Until then, treat any line with fewer cases than your test plan calls for as provisional, and say so in the report.

Design what an NPC can remember, how it responds and which version of a world fact it may reveal. Audit those decisions against scoped transcripts and traces. The narrative lead gets a local memory policy, a branching dialogue draft, a canon exception list and a replay report.

An *NPC* is any non-player character: a shopkeeper, a guide, a rival, a companion, a witness. It works for hand-written dialogue trees and for generated (AI) dialogue, and for any way a character responds: spoken or written lines, a menu of replies, a gesture or a sound. *Canon* is the owner's approved set of world facts, with a revision label.

[Install and run](HOW-TO-USE.md) | [Prompts](PROMPTS.md) | [Frozen rubric](RUBRIC.md)

Rubric: `gbf-14-living-npc-lore` v2.0.0, 100-point scale (5 pillars of 20 points, 10 lines, levels 0 to 4 or U). Contribution per line is weight x level / 4 and a line passes at level 3. U (UNMEASURED) earns 0 and is never filed as a defect.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

## Quick start

Run these in this folder (Node 18 or later):

```sh
node engine/lens.mjs fixtures/good-pack.json      # synthetic route guide example, grade 100
node engine/lens.mjs --meta                       # every line, its fields and profile values
node tests/lens-negative-fixtures.mjs             # every negative and missing-input case must behave
node tests/test-lens-contract.mjs                 # rubric, recipe embed and text checks
node engine/lens.mjs your-pack.json               # your build
```

To rebuild the installed recipe after editing a skill, memory fact or routine, run `node scripts/build-recipe.mjs templates/14-living-npc-lore` from the repository root.

## Words used here

- **Evidence pack:** one JSON file with the observations for one build. The engine (`engine/lens.mjs`, also called the lens) grades it.
- **Game profile (`pack.profile`):** the owner's settings for one NPC role: what it may observe, when its memory resets, the canon revision, the reveal rule, the response channel, the replay seed, the held-out scenario and the bands.
- **Scope of a pack:** one NPC role, one canon revision, one response channel, one replay seed and one held-out scenario. Grade each further channel, seed or held-out scenario as its own pack and scope.
- **Response channel:** how the NPC answers: spoken line, written text, a reply menu, a gesture, a sound.
- **Response key:** a short code for what a response means, such as `point to inlet`, so two different wordings with the same meaning match.
- **Viewpoint:** what this character could know from where it was. A character may believe something false or lie, if an approved exception says so.
- **Reveal gate:** a prerequisite (an event or a state) before which a canon fact must not be said.
- **Seeded replay:** running the same scene twice from the same seed, context and memory, to check the meaning stays the same.
- **Held-out scenario:** a scene the writers reserved before tuning, so a reviewer can check the NPC is understood in a case nobody tuned for.
- **Case, receipt, U and NOT_RUN:** a case is one observed opportunity with an anonymous `caseId`; a receipt is the entry in `pack.artifacts` that names the line, both build ids, the scope and the source file; U means no usable evidence (0 points, not a defect); NOT_RUN means a planned run did not happen.
- **gitSha and liveSha:** the source revision you are reviewing, and the build players or testers actually run.

## How the engine decides a level

For each line the engine takes the rows in its sample group, checks each row against the line's condition and divides the cases that met it by all observed cases. Then 0 when no case met it; 1 below `bands.floor`; 2 at or above the floor, below `bands.pass`; 3 at or above the pass share, below `bands.target`; 4 at or above the target. Example (illustrative bands 0.5, 0.75 and 1): 3 of 4 probes withheld the hidden fact is a share of 0.75, level 3.

A line is U when its receipt is missing or does not match the pack, a row is malformed or marked NOT_RUN, or a profile value it needs is missing. A measured failure stays in the share. Three measured failures are release blockers and set the grade to 0: a fact still remembered after a mandatory reset (`memory:2`), a hidden fact disclosed (`viewpoint:1`) and a gated fact revealed early (`canon:2`). An open P0 does the same. Read the grade with its supported points and its interval (the lowest and highest grade the U lines allow).

## Evidence contract

Supply a versioned canon excerpt, a role's knowledge and memory rules, seeded case traces, dialogue captures and independent scenario readbacks. Copy the structure of [the synthetic pack](fixtures/good-pack.json) and replace its profile, build ids, artifacts and samples. Set `synthetic` to false only for measurements from your own build.

Every receipt must carry this line's `lineId`, the pack's `gitSha` and `liveSha`, the profile `scope`, and a `context` that repeats the profile's `role`, `canonRevision`, `responseChannel`, `heldOut` and `scenarioSeed`. Its `source` is a local transcript or trace path with a turn locator. Use anonymous case ids, distinct within a group. Record every eligible case in the agreed scenarios, including observed failures.

| Line | Group (evidence) | Row fields | How to get a row | Meets the condition when |
|---|---|---|---|---|
| `memory:1` Permitted memory recalled | `recall` (trace) | `{caseId, expected, recalled}` | Show the NPC an allowed event, then later ask something that depends on it within the memory scope. Log the stored and recalled fact keys. | `recalled` equals `expected` |
| `memory:2` Expired memory stays forgotten | `expiry` (trace) | `{caseId, forgotten}` | Cross the approved reset or expiry point and ask about the same fact again. | `forgotten` is true. `false` is a release blocker. |
| `viewpoint:1` Unseen information stays private to the scene | `knowledge` (capture) | `{caseId, withheld}` | Ask about a fact the NPC could not have observed. Inspect the actual response turn for disclosure. | `withheld` is true. `false` is a release blocker. |
| `viewpoint:2` Character belief follows its source | `belief` (trace) | `{caseId, expected, asserted}` | Use a sourced belief, rumor or admitted uncertainty. Compare the intended viewpoint key with what the NPC asserted. | `asserted` equals `expected` |
| `dialogue:1` Response addresses the current intent | `intent` (capture) | `{caseId, expected, actual}` | Present the chosen intent at the recorded turn. Code the actual line, sound or gesture with the meaning keys. | `actual` equals `expected` |
| `dialogue:2` Unknown intent has a usable fallback | `repair` (capture) | `{caseId, expected, actual}` | Try an ambiguous or unmatched input. Record the next reachable choice or clarification with a capture offset. | `actual` equals `expected` |
| `canon:1` Claims match active canon | `version` (static) | `{caseId, expected, claim}` | Cite the canon entry, revision and precedence rule. Compare the normalized claim with the entry, after any viewpoint exception. | `claim` equals `expected` |
| `canon:2` Reveal follows its prerequisite | `reveal` (trace) | `{caseId, legal}` | Play both sides of a reveal gate and record the first turn the fact appears against its prerequisite. | `legal` is true. `false` is a release blocker. |
| `review:1` Seeded replay preserves response meaning | `replay` (trace) | `{caseId, first, second, firstRef, secondRef, seed}` | Reset the same seed, context and case twice. Compare the meaning keys and keep both run locators. | `second` equals `first`, the two refs differ and are non-empty, and `seed` equals `profile.scenarioSeed` |
| `review:2` Held-out response is understood | `heldout` (capture) | `{caseId, expected, readback, reviewRole, turnRef, reason, scenario, channel}` | In the unseen scenario on the profile's channel, an anonymous reviewer interprets the response without the branch label. | `readback` equals `expected`, `reviewRole`, `turnRef` and `reason` are non-empty, `scenario` equals `profile.heldOut` and `channel` equals `profile.responseChannel` |

Profile values the lines read: `scope`, `bands` (`floor`, `pass`, `target`), `role`, `canonRevision`, `responseChannel`, `heldOut` and `scenarioSeed`. The worked example also records `memoryBoundary` and `revealGate` for the reader.

## Adapt to your game

The owner names the role, its memory and its canon. Examples (illustrative):

- **Quiet exploration game (the worked example):** a route guide answers with gestures; it may remember a signal it heard until the chapter closes; the inlet route is revealed only after the signal.
- **Mystery or detective game:** a witness may believe something false. Record the false belief as an approved viewpoint exception so `viewpoint:2` checks it and `canon:1` does not flag it.
- **Farming or life sim:** a shopkeeper remembers a festival you attended until the season ends (the reset point), and must not mention a crop you never showed them.
- **Turn-based strategy game:** an advisor must not reveal an enemy's hidden army before your scouts report it (the reveal gate).
- **Racing game:** a rival's taunts recall your last race result within one cup and forget it when a new cup starts.
- **Narrative adventure with a reply menu:** the channel is the menu; an unmatched choice leads to a clarifying option rather than a dead end.

If your NPC has no memory across scenes, leave `recall` and `expiry` out: both memory lines read U and the report says "does not apply". The same goes for a game with no reveal gates (`reveal`). Never fill a group with made-up rows.

## Owner decisions

- The NPC role and what it is allowed to observe.
- How long a memory lasts and where it must reset.
- The canon revision and the precedence rule when sources conflict.
- Each reveal gate.
- The response channel, replay seed and held-out scenario for this pack. Grade each further channel, seed or held-out scenario as its own pack and scope.
- The bands.

## Worked example

Synthetic quiet exploration game: a route guide gestures toward an open inlet after hearing a signal. Before the signal the guide can express uncertainty. Closing the chapter erases the memory of the signal. Grade 100.

- [fixtures/good-pack.json](fixtures/good-pack.json): the synthetic pack.
- [fixtures/scene-book.md](fixtures/scene-book.md): the synthetic scene notes it cites, turn by turn. A known replay needs distinct run locators and the approved seed; the held-out readback needs the approved unseen scenario and channel, a review role, a turn locator and the reason for the interpretation.

## Team handoffs

Files are exchanged locally under `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

| Artifact | Direction | Required | Other end | If it is missing |
|---|---|---|---|---|
| `game-profile` | consumes | required | The owner, via the getting-started skill (role, canon revision, memory and reveal rules) | Run the getting-started skill first; lines with no profile value grade U |
| `evidence-pack` | consumes | required | Your dialogue harness, CI run or manual capture, plus held-out reader readbacks | No grade; the engine refuses the pack (INVALID) |
| `dialogue-draft` | produces | optional | Audio Director (13), Access, Input and Localization (21), the narrative lead | They work from the shipped script; new lines reach them later |
| `grade-record` | produces | required | Producer (12) as a milestone gate, the owner | The Producer leaves that gate unmeasured |
| `ticket-draft` | produces | optional | Bug Desk (18), then the human files it | Findings stay in the report only. A fact kept after reset, a hidden fact disclosed or an early reveal is a P0 candidate. |

Dialogue revisions, memory policy notes and canon exceptions are saved as a local `dialogue-draft` for the narrative lead, for Access, Input and Localization (21) (strings and captions) and for Audio Director (13) (voice and cue scripts). The canon diff and exception list go to the owner. All stay local drafts.

## Known limits

- One observed case can earn level 4 (see the status note at the top).
- `memory:2`, `viewpoint:1` and `canon:2` rows carry only a yes or no flag. Keep the probe, the turn and the response in the cited source so a reviewer can check them.
- One channel, seed and held-out scenario per pack.
- Needs your own transcripts and traces; the worked example is synthetic.

## Files

- `recipe.json`: the importable bot template. The `-lens-engine` skill carries the engine source so a new owner gets it without this folder.
- `engine/lens-kit.mjs`, `engine/lens.mjs`: the engine (no dependencies, Node 18+). `engine/team-memory.mjs`: the shared team memory helper.
- `fixtures/good-pack.json`, `fixtures/scene-book.md`: the worked example. `fixtures/mutations.json`: negative and missing-input cases.
- `tests/`: portable tests. `RUBRIC.json` and `RUBRIC.md`: the frozen rubric.

[MIT license](../../LICENSE).
