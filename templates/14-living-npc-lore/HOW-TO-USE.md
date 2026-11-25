# How to use: Living AI NPC and Lore Architect

Created by @meta_alchemist (https://x.com/meta_alchemist).

**Status: preview, not shipping.** This template works and its tests pass, but it is not yet held to the kit's release standard.

Before it can ship:

- **Minimum sample size.** Today one observed case can earn level 4 on a line. The engine needs a profile setting (`profile.bands.minCases`) so a line backed by fewer observed cases reads U. Until then, treat any line with fewer cases than your test plan calls for as provisional.

Design what an NPC can remember, how it responds and which version of a world fact it may reveal. Audit those decisions against scoped transcripts and traces. It works for hand-written dialogue trees and for generated (AI) dialogue.

- **Pipeline stage:** Narrative prototyping and playtest.
- **When:** When an NPC interaction, a memory rule or a canon revision changes.
- **You provide:** A versioned canon excerpt, the role's knowledge and memory rules, seeded case traces, dialogue captures and independent readbacks of a held-out scenario; your game profile (`game-profile`) and an evidence pack (`evidence-pack`).
- **You get:** A 100-point grade (`grade-record`), a local memory policy, a branching dialogue draft and a canon exception list (together, a `dialogue-draft`), a replay report and local ticket drafts (`ticket-draft`). Nothing is filed until you file it.
- **Takes from:** The owner's versioned canon, the role's knowledge and memory rules, seeded harness traces and dialogue captures from the build, and held-out reader readbacks.
- **Hands to:** Producer (12), which can use this grade record as a milestone gate; Bug Desk (18) for ticket drafts (a fact kept after reset, a hidden fact disclosed and an early reveal are P0 candidates); dialogue revision drafts (`dialogue-draft`) to the narrative lead, to Access, Input and Localization (21) for strings and captions, and to Audio Director (13) for voice and cue scripts; a canon diff and exception list to the owner. See Team handoffs in [README.md](README.md#team-handoffs).

New to terms such as canon, response key, reveal gate, seeded replay or held-out scenario? See [Words used here](README.md#words-used-here).

## Install

### Option A: Add to Grok Bot after review

Share link pending review. Use Option B for Grok Bot or Option C for other agents. Both work offline with the local files.

### Option B: Manual setup in Grok Bot

1. For each folder in `skills/`, paste its `SKILL.md` into a Grok Bot chat and say: "Save this as a skill." Start with the [`living-npc-lore-lens-engine`](skills/living-npc-lore-lens-engine/SKILL.md) skill, then the [`living-npc-lore-getting-started`](skills/living-npc-lore-getting-started/SKILL.md) skill, then the five evidence skills below.
2. Paste each fact from [MEMORY.md](MEMORY.md) and say: "Remember this for this project."
3. When the owner picks a cadence, create the routine from section 2 of [PROMPTS.md](PROMPTS.md): "Create a routine with this prompt: ...". Replace `<cadence>` first.
4. Say: "Run the living-npc-lore-getting-started skill." It grades the synthetic example first, then helps you collect a real pack.

### Option C: Other agents (Cursor, Claude Code, Codex)

Copy `skills/<name>/SKILL.md` into your agent's skills folder (for example `.cursor/skills/`, `.claude/skills/` or the folder your Codex setup reads). Copy `engine/` and `fixtures/` into your repo so the agent can run the engine, or let the agent write them from the `-lens-engine` skill. See [INSTALL.md](../../INSTALL.md).

## First grade in two minutes

```
cd templates/14-living-npc-lore
node engine/lens.mjs fixtures/good-pack.json      # worked example (synthetic, not a measurement)
node tests/lens-negative-fixtures.mjs             # every negative and missing-input case must behave
node tests/test-lens-contract.mjs                 # rubric, recipe embed and text checks
node engine/lens.mjs your-pack.json               # your build
```

## Skills

| Skill | Use it when | Feeds rubric lines |
|---|---|---|
| [`living-npc-lore-getting-started`](skills/living-npc-lore-getting-started/SKILL.md) | First run with a new owner: agree the NPC role, canon and profile one question at a time and run the first grade. | all (setup) |
| [`npc-memory-boundaries`](skills/npc-memory-boundaries/SKILL.md) | An NPC must remember an event it witnessed, or forget it at a reset point. | `memory:1`, `memory:2` |
| [`npc-viewpoint`](skills/npc-viewpoint/SKILL.md) | A character might know something it could not have observed, or must hold a sourced belief, rumor or lie. | `viewpoint:1`, `viewpoint:2` |
| [`npc-dialogue-repair`](skills/npc-dialogue-repair/SKILL.md) | A dialogue branch must convey an intent, or recover from an ambiguous or unmatched input. | `dialogue:1`, `dialogue:2` |
| [`canon-reconciliation`](skills/canon-reconciliation/SKILL.md) | Competing lore sources or reveal rules change what the NPC may say. | `canon:1`, `canon:2` |
| [`npc-replay-panel`](skills/npc-replay-panel/SKILL.md) | You need a seeded replay of a known scene and a reviewer's readback of a held-out scene. Also carries the worked example scene book. | `review:1`, `review:2` |
| [`living-npc-lore-lens-engine`](skills/living-npc-lore-lens-engine/SKILL.md) | You need to grade a pack: write the engine files from this skill and run them. | all (grading) |

## First real pack

1. Agree the profile with the getting-started skill: one role, one canon revision, one response channel, one replay seed and one held-out scenario per pack.
2. Collect rows with the evidence skills. Keep each transcript, trace and readback sheet on disk under the pack's folder.
3. Copy the shape of `fixtures/good-pack.json`, set `synthetic` to false, and replace every value with your own.
4. Ask the evidence producer (the person or harness that made the captures) for a `game-evidence-v1` producer receipt:
   - Give each artifact a relative `path` under the pack directory and the hex SHA-256 of its bytes.
   - The receipt names `producer`, `profileId`, `device`, `hook`, and a capture or trace ID in `gameplayArtifact`. Set `schema` to `game-evidence-v1` and include the matching `packId`, `gitSha` and `liveSha`.
   - Its `profileSha256`, `artifactsSha256` and `observationsSha256` cover the profile, the artifact array and the array `[metrics, receipts, judgements, populations, openP0]`, using an empty object for absent collections and zero for an absent openP0.
   - Hash UTF-8 JSON with recursively sorted object keys and no whitespace.
5. Run `node engine/lens.mjs your-pack.json`. The engine checks these digests and the local files. If any check fails it reports INVALID and a null grade.

Keep the worked example labelled synthetic. Never copy a synthetic row into a real pack.

## Decisions only you make

- The NPC role and what it may observe. A shopkeeper in a farming sim might only know what happens in the shop; a companion in a narrative adventure might know everything the player saw.
- How long memories last and where they reset: the end of a chapter, a season, a cup or a save reload.
- The canon revision, and which source wins when two disagree.
- Each reveal gate: the event or state before which a fact must not be said.
- The response channel, replay seed and held-out scenario for this pack. Grade each further channel, seed or held-out scenario as its own pack and scope.
- The bands.

## Known limits

- One observed case can earn level 4 (see the status note at the top).
- One channel, seed and held-out scenario per pack.
- Needs your own transcripts and traces; the worked example is synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Works with other templates

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `access-report` (optional, ^1.0.0) | 21 Access | `.grokbot-team/artifacts/access-report/` | Continue without it. Start the report with "ASSUMPTION: no access-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `dialogue-draft` 1.0.0 | JSON plus a Markdown dialogue draft | `.grokbot-team/artifacts/dialogue-draft/` | 13 Audio, 21 Access |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-14-living-npc-lore` and `0.1.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->

## Safety defaults

- Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
- Missing evidence grades U (unmeasured), never a made-up number. Worked examples are labelled synthetic.
- Thresholds live in your game profile (`pack.profile`), never inside the engine.
- Reviewers and testers stay anonymous: role labels and case ids only. Memory changes in the game stay behind a switch that is off by default.
