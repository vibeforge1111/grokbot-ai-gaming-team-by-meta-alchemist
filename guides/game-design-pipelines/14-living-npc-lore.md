# Living AI NPC and Lore Architect in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Design what an NPC can remember, how it responds and which version of a world fact it may reveal. Audit those decisions against scoped transcripts and traces.

**Status: preview, not shipping.** The template works and its tests pass, but one observed case can still earn level 4 on a line until the engine gains a minimum case count. This matters most for generated (AI) dialogue; run each probe several times and read thin lines as provisional.

An *NPC* is any non-player character: a shopkeeper, a guide, a rival, a companion, a witness. It works for hand-written dialogue trees and for generated dialogue, and for any response channel: spoken or written lines, a reply menu, a gesture or a sound. Each pack covers one role, one canon revision, one channel, one replay seed and one held-out scenario.

Template folder: [templates/14-living-npc-lore](../../templates/14-living-npc-lore/). Install and prompts: [HOW-TO-USE.md](../../templates/14-living-npc-lore/HOW-TO-USE.md), [PROMPTS.md](../../templates/14-living-npc-lore/PROMPTS.md).

## When to use it

- **Stage:** Narrative prototyping and playtest.
- **Trigger:** When an NPC interaction, a memory rule or a canon revision changes, and before a dialogue lock for localization or voice recording.

## Inputs and outputs

- **Inputs:** The owner's versioned canon, the role's knowledge and memory rules, seeded harness traces and dialogue captures from the build, held-out reader readbacks, your game profile (`game-profile`) and an evidence pack (`evidence-pack`).
- **Outputs:** A 100-point grade (`grade-record`), a local memory policy, a branching dialogue draft and a canon diff and exception list (together, a `dialogue-draft`), a replay report and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** The owner (canon, role knowledge, memory and reveal rules); the build's dialogue harness or a manual capture (seeded traces and captures); anonymous reviewers (held-out readbacks).
- **Hands to:** Producer (12), which can use the grade record as a milestone gate; Bug Desk (18) for ticket drafts, where a fact kept after reset, a hidden fact disclosed and an early reveal are P0 candidates; the narrative lead for dialogue revision drafts (`dialogue-draft`), which also go to Access, Input and Localization (21) for strings and captions and to Audio Director (13) for voice and cue scripts; the owner for the canon diff and exception list.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `living-npc-lore-getting-started`; answer its questions one at a time (the role, what it may observe, the memory reset point, the canon revision and precedence, reveal gates, and the channel, seed and held-out scenario for this pack); write the answers into your game profile.
2. **Get a pack:** use your dialogue harness, a CI run or a manual capture of this build. Reserve the held-out scene before any tuning.
3. **npc-memory-boundaries:** draft the memory table; show a permitted event is recalled and is gone after the reset point.
4. **npc-viewpoint:** ask about facts the NPC could not have observed; for a generated NPC, try a leading question, a false premise and a request to ignore its rules for each hidden fact.
5. **npc-dialogue-repair:** draft the turn table; check the intended response and a usable fallback for an unmatched input.
6. **canon-reconciliation:** compare claims with the active canon after viewpoint exceptions; play both sides of each reveal gate.
7. **npc-replay-panel:** replay a known scene twice from the same seed, and have an anonymous reviewer read back the held-out scene.
8. **Grade:** `node engine/lens.mjs <pack.json>` from the template folder. Lead with verdict, grade and coverage, and say how many cases each line rests on.
9. **Polish loop:** draft the smallest change to one memory rule or dialogue branch, keep reveal and reset rules, replay the same known and held-out cases on a fresh build, keep passing lines at level 3 or above.

To cover another channel (for example voice after text), another seed or another held-out scenario, grade it as its own pack and scope.

## Examples by genre (illustrative)

- **Narrative adventure:** a companion remembers a promise until the chapter closes; after reloading a save from before the promise, it must not mention it.
- **Mystery or detective game:** a witness who left before the crime is asked "So you saw who took the key?"; any name in the reply is a disclosure. The witness's wrong accusation is an approved viewpoint exception, not a canon error.
- **Farming or life sim:** a generated shopkeeper replayed from one seed offers seeds both times, in different words; that passes.
- **Turn-based strategy game:** the advisor must not reveal the enemy's hidden army before the scout report (the reveal gate).
- **Racing game:** the crew chief's radio line on a held-out track is read by a reviewer as "pit next lap".
- **Quiet exploration game (the worked example):** a guide answers with gestures and points to the inlet only after hearing the signal.

## Rubric pillars

- **Memory** (20): Permitted memory recalled; Expired memory stays forgotten (a fact kept after reset is a release blocker)
- **Viewpoint** (20): Unseen information stays private to the scene (a disclosure is a release blocker); Character belief follows its source
- **Dialogue** (20): Response addresses the current intent; Unknown intent has a usable fallback
- **Canon** (20): Claims match active canon; Reveal follows its prerequisite (an early reveal is a release blocker)
- **Review** (20): Seeded replay preserves response meaning; Held-out response is understood

An NPC without a feature a line needs (for example no memory across scenes, or no reveal gates) leaves that line unmeasured (U). The report says it does not apply, and the verdict stays CONDITIONAL.

See [README.md](README.md) for end to end pipelines that combine templates.
