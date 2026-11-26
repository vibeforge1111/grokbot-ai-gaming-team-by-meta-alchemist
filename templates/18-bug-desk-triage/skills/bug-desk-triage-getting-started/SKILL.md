---
name: bug-desk-triage-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Playtest Bug Desk & Repro Triage Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-18-bug-desk-triage v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Playtest Bug Desk & Repro Triage Director: Getting Started

Turn playtest observations into reproducible issues, group duplicate reports and verify fixes against the affected build. This works for any genre: a bug is a bug whether it shows up in a puzzle board, a race, a story choice or a save file.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `bug-desk-triage-lens-engine` skill first (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Game profile (`pack.profile`):** the owner's settings, such as which bugs may be P0. Thresholds live here, never in the engine.
- **P0:** the top severity: stop and fix now.
- **Flaky:** a bug that happens on some runs and not others.
- **Case and receipt:** a case is one item the owner approved for checking (for example one high-priority ticket), listed in `profile.cases`. A receipt is the matching row under `receipts` that records what was run, on which build, and what happened.
- **gitSha and liveSha:** the source revision under review, and the build players actually run (the deployed or shipped build, or the build sent to testers).
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a test was planned but did not run.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Tell me its name, genre and the platforms it ships on." Then ask: "Which build should I look at first? A build id, commit or version number is enough." Then ask: "Where will the evidence come from: a CI run, a manual playtest capture or an export from your tracker?"
2. "Which kinds of bug count as P0 for your game, the ones where everyone stops and fixes them now? For example payments, lost or corrupted saves, or items players paid for. A single-player offline game might only use lost saves and crashes on start." Store the answer as `p0Scopes` in the profile.
3. "When a bug only happens some of the time, how many clean runs in a row should it pass before we call it fixed? The worked example uses 10 as a sample; choose what fits your game." Store the answer as `flakyRunsRequired`.
4. "Which issue tracker do you use? Can you give me a read-only export of open and recently closed tickets, with who fixed and who verified each one, plus severity, scope and confidence where you track them?"
5. "Does your game have share, invite or referral links that players send to each other? If not, I will leave that check out and it will show as not measured." Leave `shareIntake` out of the pack when the answer is no.
6. "Who should review my local ticket drafts before anything is filed?"

Before grading a real pack, check that its build and profile match what the owner chose. Record unavailable capture or execution as NOT_RUN. Use the populations (the sets of measured cases) listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Profile values in `pack.profile`: `p0Scopes`, `flakyRunsRequired` and the approved `cases`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect.

Metric groups this engine reads, and the skill that fills each one:

| Group | Evidence type | What it holds | Skill |
|---|---|---|---|
| `repro` | trace | high-priority tickets and whether each replays | `minimal-repro-builder` |
| `flaky` | trace | flaky reports and runs done against the profile criterion | `minimal-repro-builder` |
| `captures` | trace | findings about play, and how many have a capture of the actual action | `minimal-repro-builder` |
| `liveBehind` | config | whether you checked if the live build is behind the source | `issue-draft-and-fix-verification` |
| `dedup` | trace | candidate duplicate pairs and what happened to each | `duplicate-report-grouping` |
| `severity` | static | severity, scope and confidence per ticket; P0 scopes used | `severity-and-regression-bisect` |
| `routing` | static | grading mistakes and how many went to the audit fix list | `severity-and-regression-bisect` |
| `closure` | trace | closed tickets with fixer, verifier and raw artifacts | `issue-draft-and-fix-verification` |
| `mismatch` | trace | closures allowed despite an artifact mismatch (must be 0) | `issue-draft-and-fix-verification` |
| `sla` | trace | age of the oldest open P0 (growth check only) | `severity-and-regression-bisect` |
| `crashIntake` | trace | crash reports with a build id, triaged in the agreed window (growth check only) | `duplicate-report-grouping` |
| `shareIntake` | static | share or invite link reports (growth check only; leave out if your game has no such links) | `duplicate-report-grouping` |

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `checks` (growth checks reported beside the grade, never scored) and `tickets` (candidate ticket drafts, already deduplicated).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines: reproducibility:1, reproducibility:2, evidence-completeness:1, evidence-completeness:2, correct-dedup:1, correct-dedup:2, severity:1, severity:2, closure-quality:1, closure-quality:2.
- Two rubric names need a plain reading. "Captures show real play" (`evidence-completeness:1`) means findings about play have a capture of real play, not only menus or loading; a "match" is any play session (a level, a race, a puzzle board, a story chapter). "Build lag recorded and applied" (`evidence-completeness:2`) means you recorded whether the build players run is older than the source, and capped scores read from its runtime logs when it is.

## 5. Skills in this template

- `duplicate-report-grouping`: Use when many crash reports, error logs, player reports or findings from other templates may describe the same bug: propose candidate duplicate groups for the human to confirm, and never merge different root causes automatically. Feeds `correct-dedup:1` and `correct-dedup:2`.
- `minimal-repro-builder`: Use when turning a crash, desync or player report into a replay that fails on the affected build, shrinking it to the smallest input that still fails, checking that captures show real play, and deciding when a flaky bug may leave flaky status. Feeds `reproducibility:1`, `reproducibility:2` and `evidence-completeness:1`.
- `severity-and-regression-bisect`: Use when setting a bug's severity and confidence, keeping P0 to the scopes your profile allows, sending grading mistakes to the audit fix list instead of the bug list, and bisecting a working repro to the change that introduced the bug. Feeds `severity:1` and `severity:2`.
- `issue-draft-and-fix-verification`: Use when writing a reproducible bug report as a local draft for any tracker, recording which build players actually run, and checking that a fix was verified on the right build by someone other than the fixer before it closes. Feeds `closure-quality:1`, `closure-quality:2` and `evidence-completeness:2`.
- `bug-desk-triage-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Needs your real ticket export; the worked example is synthetic.

Before capture, agree on the case ids and expected values in `profile.cases` (for example the high-priority tickets to replay and the closures to review). Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact id. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest, 04 Netcode, 07 Shader, 08 World and Biome, 16 Splat Cleaner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `tracker-export` (optional, ^1.0.0) | the owner | `.grokbot-team/artifacts/tracker-export/` | Continue: intake and closure receipts are NOT_RUN and their lines stay unmeasured; write "ASSUMPTION: no tracker-export available" in the report and ask the owner for a read-only export. |
| `ticket-draft` (optional, ^1.0.0) | 01 Game Feel, 02 Playtest, 03 Prop and Rig, 04 Netcode, 05 Game Loop, 06 Economy, 07 Shader, 08 World and Biome, 09 HUD, 10 Trailer, 11 Environment, 13 Audio, 14 NPC and Lore, 15 Server Fairness, 16 Splat Cleaner, 17 Sprites, 19 Store Page, 20 Patch Notes, 21 Access, 22 Live Service, 23 Support Desk, 24 Ledger, 25 Matchmaking, 26 Balance Patch, 27 Retention, 28 App Store, 29 Studio, 30 Clipmaker, 00 Starter | `.grokbot-team/artifacts/ticket-draft/` | Continue: group only crash and player reports, and say cross-template grouping was not measured. |
| `incident-report` (optional, ^1.0.0) | 22 Live Service | `.grokbot-team/artifacts/incident-report/` | Continue without it. Start the report with "ASSUMPTION: no incident-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `support-case-draft` (optional, ^1.0.0) | 23 Support Desk | `.grokbot-team/artifacts/support-case-draft/` | Continue without it. Start the report with "ASSUMPTION: no support-case-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer |
| `change-list` 1.0.0 | JSON (closures verified on the fixed build) | `.grokbot-team/artifacts/change-list/` | 06 Economy, 10 Trailer, 20 Patch Notes |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `releases`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-18-bug-desk-triage` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
