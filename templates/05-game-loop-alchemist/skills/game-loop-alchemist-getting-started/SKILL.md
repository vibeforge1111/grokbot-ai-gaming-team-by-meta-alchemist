---
name: game-loop-alchemist-getting-started
description: "Use on first run with a new owner: agree the Game Loop Alchemist game profile one question at a time, grade the synthetic example, then collect and grade the first real evidence pack."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Game Loop Alchemist: getting started

Map what the player chooses, what changes, and why the next turn is worth taking. This template checks a game's core loop: what the player does first, what that action changes, how long the player waits for the next choice, whether a different choice leads somewhere different, whether the player can stop when they want, and whether they come back by choice. It works for any genre: a puzzle board, a platformer level, a strategy turn, a race, a farming day or a story chapter.

A line with fewer observed cases than `profile.bands.minCases` reads U, even if those cases would have passed. Ask the owner to set this number. If it is not set yet, write "not set" and tell them that thin lines are provisional until they set it.

If `engine/lens.mjs` is not on disk, write the files from the `game-loop-alchemist-lens-engine` skill first (Node 18 or later, no dependencies). If `fixtures/session-notes.md` or `fixtures/rhythm-pack.json` is missing, write it from the "Worked example files" section of the `voluntary-replay` skill.

## Words used here

- **Evidence pack:** one JSON file with the observations for one build. The engine grades it.
- **Game profile (`pack.profile`):** the owner's settings: the meaningful action, its outcome, the time budgets, the cohort, the observation window and the bands. Thresholds live here, never in the engine.
- **Case:** one observed opportunity (one tester's opening, one decision beat, one invitation to play again), with an anonymous `caseId`.
- **Receipt:** the entry in `pack.artifacts` that names the rubric line, both build ids, the profile scope and the source file for one group of rows.
- **Bands:** the `floor`, `pass` and `target` shares (between 0 and 1) that the share of passing cases is compared with, and `minCases`, the fewest observed cases a line needs before that share is scored.
- **Cohort and observation window:** who is eligible, and the period in which a return to play counts. Replay is only counted after the window closes.
- **U (UNMEASURED) and NOT_RUN:** U means no usable evidence yet; it earns 0 points and is not a defect. NOT_RUN means a planned capture did not happen.

## 1. Onboard one question at a time

Ask one question, wait for the answer, then ask the next. Never stack questions in one message. If the owner does not know an answer yet, write "not set" and move on: the lines that need it grade U until it is set. Write each answer into a draft game profile, using the profile in `fixtures/good-pack.json` as the shape. Its numbers are synthetic examples, never defaults.

1. "Which game are we working on? Tell me its name or a code name, its genre, engine and platforms."
2. "Which build should I look at? Give me the source revision and the build testers actually play, for example a commit id and a version number." (`gitSha`, `liveSha`)
3. "Which loop change do you want to check? For example a new opening, a faster retry or a new invitation to play again."
4. "What is the first meaningful action a new player takes, and what should it change? For example placing a tile connects a path, or the first jump reaches a ledge." (`action`, `outcome`)
5. "How many seconds from the first moment of control to that action is acceptable?" (`actionBudgetS`)
6. "After one choice resolves, how many seconds may pass before the next choice is available? Which pauses, such as cutscenes, loading or an opponent's turn, should I leave out?" (`beatBudgetS`)
7. "Which setback, undo or retry should we test, and how many seconds may pass before the player can act usefully again? If the game has no setback, say so and that line will show as does not apply." (`recoveryBudgetS`)
8. "Where can a player stop, and what should happen when they decline another round, level, day or chapter?"
9. "Who is in the cohort, and when does the observation window for a return close? For example first-session testers, with the window closing when the session ends." (`cohort`, `window`)
10. "How will observers code answers? I need a short key for the goal, for what changed, and for the reason to play again, with indifference and obligation as options."
11. "What share of cases should count as the floor, the pass and the target? For example 0.5, 0.75 and 1, but choose what fits your playtest." (`bands`)
12. "How many observed cases must a line have before a share is scored? If it has fewer, that line reads U. For example 3." (`bands.minCases`)
13. "Who makes the captures and traces, and where will the files live?"
14. "Where should I save local drafts (reports, loop maps, experiment cards, ticket drafts), and who reviews them before anything is filed or sent?"

Then choose a scope name for this approved profile revision (for example `opening-window-a`). Confirm the bands and minCases again before any change of scope. Run `node engine/lens.mjs --meta` to check that every profile value a line reads is set.

## 2. Run the synthetic example

```
node engine/lens.mjs fixtures/good-pack.json     # synthetic puzzle, grade 100
node engine/lens.mjs fixtures/rhythm-pack.json   # synthetic rhythm game, grade 97.5
node engine/lens.mjs --fixtures fixtures/good-pack.json   # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `blocking` and `tickets`.

## 3. Collect and grade a real pack

Ask for timestamped first-session traces, anonymous playtest observations and return opportunities from a closed observation window. Gather the rows with the evidence skills:

| Group | Line | Row fields | Skill |
|---|---|---|---|
| `goal` | `opening:1` | `{caseId, expected, readback}` | `opening-playtest` |
| `action` | `opening:2` | `{caseId, startS, actionS}` | `opening-playtest` |
| `state` | `consequence:1` | `{caseId, expected, actual}` | `loop-consequence` |
| `feedback` | `consequence:2` | `{caseId, expected, readback}` | `loop-consequence` |
| `beat` | `pacing:1` | `{caseId, resolvedS, choiceS}` | `decision-pacing` |
| `recovery` | `pacing:2` | `{caseId, setbackS, controlS}` | `decision-pacing` |
| `choice` | `agency:1` | `{caseId, expected, actual}` | `loop-agency` |
| `exit` | `agency:2` | `{caseId, honored}` | `loop-agency` |
| `reason` | `replay:1` | `{caseId, intrinsic}` | `voluntary-replay` |
| `return` | `replay:2` | `{caseId, offerRef, cohort, window, windowClosed, returned}` | `voluntary-replay` |

Each group names its receipt in `artifact`. The receipt carries the line id, both build ids, the profile scope, a `context` with the profile's `cohort`, `window`, `action` and `outcome`, and a `source` path with a locator. For a real pack set `synthetic` to false and follow "First real pack" in `HOW-TO-USE.md` for the producer receipt. A pack without `gitSha`, `liveSha` or `packId` is INVALID. Then run `node engine/lens.mjs <pack.json>`.

If several kit templates work on this game, read the owner's earlier decisions first with `node engine/team-memory.mjs read decisions` from the game project root, so you do not ask again. Save the engine output as a local `grade-record` (for example under `.grokbot-team/artifacts/grade-record/<pack id>.json`) for Producer (12), which can use it as a milestone gate. Save the loop map, pacing diagnosis and experiment card together as a local `loop-report` (under `.grokbot-team/artifacts/loop-report/`) for Game Feel (01), Economy Director (06) and HUD Designer (09).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured and how many cases each measured line rests on.
- List U lines as "not measured yet" with the capture that would measure them. For a line that does not apply to this game, say so instead. Never call a U line a defect.
- One local ticket draft per measured finding, with the pack id and artifact ids. A tester forced into another cycle after asking to stop is a P0 candidate for Bug Desk (18).
- Hand the playtest lead and designer a local loop map, pacing diagnosis and experiment card.
- Label any synthetic pack as synthetic.

## 5. Skills in this template

- `opening-playtest`: unaided goal readback and time to the first meaningful action. Feeds `opening:1` and `opening:2`.
- `loop-consequence`: the action makes the intended change and testers can say what changed. Feeds `consequence:1` and `consequence:2`.
- `decision-pacing`: time between decisions and time to act again after a setback. Feeds `pacing:1` and `pacing:2`.
- `loop-agency`: a different choice leads somewhere different, and a stop request is honored. Feeds `agency:1` and `agency:2`.
- `voluntary-replay`: the stated reason to play again and the observed return, in a closed window. Feeds `replay:1` and `replay:2`, and carries the worked example files.
- `game-loop-alchemist-lens-engine`: the engine source and how to run it.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `feel-findings` (optional, ^1.0.0) | 01 Game Feel | `.grokbot-team/artifacts/feel-findings/` | Continue without it. Start the report with "ASSUMPTION: no feel-findings available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `cohort-report` (optional, ^1.0.0) | 27 Retention | `.grokbot-team/artifacts/cohort-report/` | Continue without it. Start the report with "ASSUMPTION: no cohort-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `loop-report` 1.0.0 | JSON plus a Markdown loop map draft | `.grokbot-team/artifacts/loop-report/` | 01 Game Feel, 06 Economy, 09 HUD |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases`, `balance` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-05-game-loop-alchemist` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
