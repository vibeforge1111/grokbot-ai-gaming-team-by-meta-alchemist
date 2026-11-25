---
name: retention-cohorts-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, set the profile from the worked example, and run the first Retention and Cohort Analytics grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-27-retention-cohort-analytics v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Retention and Cohort Analytics: Getting Started

Measure mature return cohorts with uncertainty ranges and draft a privacy-preserving review. This is a preview: the engine is bundled and reads your own de-identified export, but segment membership depends on row order and two thresholds are still fixed in the lens.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `retention-cohorts-lens-engine` skill, and the domain files from the `retention-cohorts-domain-engine` skill (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Profile (`pack.profile`):** the owner's settings and thresholds. They live in the pack, never in the engine.
- **gitSha, liveSha and packId:** the source revision, the build players actually run, and the pack's own id. A pack without all three is INVALID.
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a step was planned but did not run.
- **Cohort:** the players whose first session falls in the same week.
- **Mature rate:** a D1, D7 or D30 rate that counts only players whose day 1, 7 or 30 has fully passed.
- **Cell size:** the smallest cohort the report may show; smaller cohorts read hidden.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Its name, genre and platforms are enough." Then ask: "Which build should I look at first? A build id, commit or version is enough." Then ask: "Who or what will produce the evidence: a de-identified session export (salted player keys and whole day numbers)?"
2. "What counts as a session and when does a reporting day end?"
3. "Which minimum cell size, segment codes and retention targets have you approved?"
4. "Which build and acquisition window belong in each comparison?"
5. "Who reviews my local drafts before anything is sent, posted, filed or changed, and where should I save them?"

## 2. Walk the profile

Start from the worked example's synthetic values in `fixtures/good-pack.json` and ask about each key in turn, one at a time. Keep only values the owner confirms; a missing threshold makes its line U, never a default.

| Key | Worked example (synthetic) | What it sets |
|---|---|---|
| `minCellSize` | 20 | the smallest cohort shown |
| `allowedSegments` | segment-a, segment-b | the segment codes the report may split by |
| `minCohorts, minPlayers, minDays` | 4, 500, 35 | how much data counts as enough |
| `targetD1, targetD7, targetD30` | 0.3, 0.12, 0.05 | the owner's retention targets |
| `minProbeAttempts` | 12 | forbidden calls the authority probe must try |

## 3. Run the first grade

```sh
node tests/run-all.mjs                           # contract, fixtures, empty sample and safety tests
node engine/lens.mjs fixtures/good-pack.json     # worked example, synthetic, not a measurement
node cohorts/scenario.mjs input.json > pack.json   # or cohorts/probe-only.mjs before an export exists
node engine/lens.mjs pack.json                   # the owner's build
```

If a command fails, report the error and stop; never grade a half-made pack. If the owner has no session export yet, record NOT_RUN and leave the lines U.

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence, and say that this preview engine trusts the metrics the pack declares.
- List U lines as "not measured yet" with the evidence that would measure them. Never call them defects.
- One local finding draft per measured failure, citing the pack id and artifact ids. Label a synthetic pack as synthetic.
- Compare with an earlier grade only when the rubric hash and profile match.

## 5. Skills in this template

- `retention-cohorts-weekly-report`: Use when a de-identified session export needs D1, D7 and D30 retention by first-play week, with ranges, small cohorts hidden and a recount check. Informs `correctness:1`, `correctness:2`, `confidence:1`, `confidence:2`, `retention:1`, `retention:2`, `privacy-in:2`, `reporting:1` and `reporting:2`.
- `retention-cohorts-release-compare`: Use when two builds need their mature retention compared on comparable acquisition windows before anyone says a release helped or hurt. Moves no rubric line directly.
- `retention-cohorts-export-check`: Use when a new or changed session export arrives and you need to confirm it is anonymous and well formed before any retention analysis. Informs `privacy-in:1`.
- `file-to-shared-ledger`: Use when an observed defect needs a local ticket draft or a proposed amendment to a known issue.
- `retention-cohorts-lens-engine`: the engine source and how to run it.
- `retention-cohorts-domain-engine`: the domain tools and their safety tests.

## Blockers to tell the owner about

- Segment membership depends on row order until the segment is fixed at cohort entry.
- The release comparison and weekly report are prompts, not code.
- The engine trusts the declared metrics (lens kit 1.1.0).

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `lobby-fill-proposal` (optional, ^1.0.0) | 25 Matchmaking | `.grokbot-team/artifacts/lobby-fill-proposal/` | Continue without it. Start the report with "ASSUMPTION: no lobby-fill-proposal available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `balance-patch-draft` (optional, ^1.0.0) | 26 Balance Patch | `.grokbot-team/artifacts/balance-patch-draft/` | Continue without it. Start the report with "ASSUMPTION: no balance-patch-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `cohort-report` 1.0.0 | JSON plus a Markdown report draft | `.grokbot-team/artifacts/cohort-report/` | 05 Game Loop, 06 Economy, 12 Producer, 26 Balance Patch |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `balance`, `regions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-27-retention-cohort-analytics` and `0.1.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
