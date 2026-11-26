---
name: lobby-fill-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, set the profile from the worked example, and run the first Matchmaking and Region Lobby Fill grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-25-matchmaking-lobby-fill v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Matchmaking and Region Lobby Fill: Getting Started

Measure queue fill, wait times and bot representation and draft alternatives for a human queue owner. This is a preview: the engine is bundled and reads your own de-identified seat export, but it averages over observed hours only and its queue-option flag is still a constant.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `lobby-fill-lens-engine` skill, and the domain files from the `lobby-fill-domain-engine` skill (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Profile (`pack.profile`):** the owner's settings and thresholds. They live in the pack, never in the engine.
- **gitSha, liveSha and packId:** the source revision, the build players actually run, and the pack's own id. A pack without all three is INVALID.
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a step was planned but did not run.
- **Seat row:** one anonymous seat in one region and hour: a salted seat key (sub_ plus 32 hex), a bot flag, a region code, an hour, and optionally an input code and a wait.
- **Input group:** your own code for a way of playing (a device class, a control scheme). The profile names two groups to compare; there are no defaults.
- **Thin region:** a region whose humans per hour fall below the profile's floor.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Its name, genre and platforms are enough." Then ask: "Which build should I look at first? A build id, commit or version is enough." Then ask: "Who or what will produce the evidence: a de-identified seat export from your matchmaker, or saved count snapshots?"
2. "Which queues, region codes and observation window should be compared?"
3. "Which two input groups should be compared (your own device or input codes), and what latency and wait budgets apply?" Store them as `primaryInput` and `comparisonInput`.
4. "Which local exports distinguish humans, bots and measured directional latency?"
5. "Who reviews my local drafts before anything is sent, posted, filed or changed, and where should I save them?"

## 2. Walk the profile

Start from the worked example's synthetic values in `fixtures/good-pack.json` and ask about each key in turn, one at a time. Keep only values the owner confirms; a missing threshold makes its line U, never a default.

| Key | Worked example (synthetic) | What it sets |
|---|---|---|
| `minHumansPerHour` | 4 | the fill floor below which a region is thin |
| `pingCapMs` | 120 | the highest p90 latency a merge may add |
| `maxBotShare` | 0.6 | the bot share above which a region needs a plan |
| `maxWaitS, maxWaitP90S` | 45, 90 | queue wait limits at p50 and p90 |
| `primaryInput, comparisonInput` | input-a, input-b | the two input groups to compare |
| `maxInputWaitGapS` | 15 | the largest wait gap allowed between the two groups |
| `inputQueueMinShare` | 0.6 | the primary group's share at which a dedicated queue is reviewed |
| `minRegionHours` | 24 | region-hours needed before fill counts as measured |
| `minProbeAttempts` | 12 | forbidden changes the authority probe must try |

## 3. Run the first grade

```sh
node tests/run-all.mjs                           # contract, fixtures, empty sample and safety tests
node engine/lens.mjs fixtures/good-pack.json     # worked example, synthetic, not a measurement
node mm/scenario.mjs input.json > pack.json   # or mm/import-counts.mjs for count snapshots
node engine/lens.mjs pack.json                   # the owner's build
```

If a command fails, report the error and stop; never grade a half-made pack. If the owner has no seat export yet, record NOT_RUN and leave the lines U.

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence, and grade the pack from its folder so artifact bytes and the producer receipt are checked.
- List U lines as "not measured yet" with the evidence that would measure them. Never call them defects.
- One local finding draft per measured failure, citing the pack id and artifact ids. Label a synthetic pack as synthetic.
- Compare with an earlier grade only when the rubric hash and profile match.

## 5. Skills in this template

- `lobby-fill-weekly-proposals`: Use when a de-identified seat export needs fill per region and hour, queue waits, bot share and thin-region alternatives measured and drafted for the queue owner. Informs `fill-measurement:1`, `fill-measurement:2`, `proposals:1`, `proposals:2`, `bot-honesty:2`, `wait-and-devices:1` and `wait-and-devices:2`.
- `lobby-fill-count-snapshots`: Use when only saved aggregate count snapshots exist (players per server or per queue, no seat rows) and the owner wants them recorded without claiming more than they show. Informs `safety-and-privacy:1` and `safety-and-privacy:2` (both probe this template's own code); every other line stays U.
- `lobby-fill-bot-honesty-check`: Use when the lobby shows bots alongside players and you need to confirm that bots carry a visible label and never count in the public player count. Informs `bot-honesty:1` and `bot-honesty:2`.
- `file-to-shared-ledger`: Use when an observed defect needs a local ticket draft or a proposed amendment to a known issue.
- `lobby-fill-lens-engine`: the engine source and how to run it.
- `lobby-fill-domain-engine`: the domain tools and their safety tests.

## Blockers to tell the owner about

- Averages cover observed hours only; a silent region can read as full until missing hours count as zero.
- The dedicated-queue flag is a constant, and the bot label line reads a configuration claim.
- Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest, 04 Netcode, 07 Shader, 08 World and Biome, 16 Splat Cleaner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `lobby-fill-proposal` 1.0.0 | JSON plan plus a Markdown proposal draft | `.grokbot-team/artifacts/lobby-fill-proposal/` | 27 Retention |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `regions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-25-matchmaking-lobby-fill` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
