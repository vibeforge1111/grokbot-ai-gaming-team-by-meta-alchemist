---
name: streamer-hype-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Streamer Scout, Patch Notes & Update Hype Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-20-streamer-hype-director v1.4.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Streamer Scout, Patch Notes & Update Hype Director: Getting Started

Match creators to your intended audience and turn verified build changes into patch notes and updates for players.

This template fits any game. Spectator, streamer-mode and season features apply only if your game has them. "Update Hype" in the name means the build-up to each update, or to each season when your game runs them.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `streamer-hype-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Start every profile value from `fixtures/good-pack.json` and ask the owner to confirm or replace it; the sample values are synthetic examples, never defaults.

1. Which game are we working on? Then ask, one at a time: which build should we check (a build id or commit), and what produces the evidence pack (a CI job or a manual capture)?
2. How do you update the game: one release with occasional patches, regular updates, or seasons? This sets the rhythm for patch notes. Season wording is used only if you run seasons.
3. Does your game record replays or clips, or offer a streamer mode? If it has no streamer mode and never shows player names, chat or account details on screen, we use the `no-streamer-mode` profile: `creator-controls:1` reads N/A, `creator-controls:2` takes its points and the redaction blockers no longer apply.
4. Does your game have a spectator mode, a live watch view or a public feed of live play? If not, we use the `no-spectator-mode` profile: the spectator lines read N/A, their 20 points are shared over the other eight lines, and the spectator release blockers no longer apply.
5. Does your game create share or watch links? If not, we use the `no-share-links` profile: `creator-controls:2` reads N/A and `creator-controls:1` takes the pillar's 20 points.
6. How much frame time may recording add on each device? This sets `maxCaptureOverheadMs`.
7. At which resolutions do creators stream or record your game? This sets `streamResolutions`.
8. Only if your game has share links: what tag should every link carry, so you can tell where visits come from? This sets `shareTag`.
9. Only if your game has a spectator or streaming mode: what may a spectator see, and how long must a feed lag behind live play? This sets the information policy and `minStreamDelayMs`.
10. Which creators or communities already play games like yours? These are starting points for the shortlist.
11. Who reviews the local drafts: patch notes, outreach messages and findings?

Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["no-spectator-mode"]` in `pack.profile`. An N/A line is not U and not a defect, and the verdict can reach PASS.

Before grading a real pack, match its build and profile to what the owner approved. Record unavailable capture or execution as NOT_RUN. Run `node engine/lens.mjs --meta` to see the population each line needs (the list or count of things measured, such as share links or patch note lines).

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads: `recording` (capture), `captureCost` (trace), `spectatorPolicy` (capture), `spectatorRead` (capture), `streamerMode` (capture), `links` (trace), `notes` (static), `claims` (static), `fairness` (trace), `receipts` (static), `spectatorLinks` (capture).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Receipts: one result row per test case agreed in `profile.cases`, with the measured values. For example, one `shippedClaims` row per patch note line with its commit and whether its feature switch is on in the shipped build.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. A feature your game does not have (for example a spectator mode) also stays out of the pack; when an approved profile covers it, its lines read N/A instead of U.

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `checks` (growth checks reported beside the grade) and `tickets` (deduplicated candidates).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- Name the rubric profiles used next to the grade. List U lines as "not measured yet" with the capture that would measure them, or "does not apply" when the game lacks the feature. Never call U or N/A lines defects.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines: capture-reliability:1, capture-reliability:2, spectator-comprehension:1, spectator-comprehension:2, creator-controls:1, creator-controls:2, truthful-claims:1, truthful-claims:2, player-safety:1, player-safety:2.

## 5. Skills in this template

- `git-diff-patch-notes-hype-compiler`: patch notes where every line maps to a commit and every claim matches the shipped build. Fills `notes` and `claims` (truthful-claims:1 and 2).
- `stream-and-replay-features-review`: recording, capture cost, streamer mode, share links, fairness and, if your game has one, the spectator view and stream delay. Fills `recording`, `captureCost`, `streamerMode`, `links`, `fairness`, `receipts`, and for spectator games `spectatorPolicy`, `spectatorRead` and `spectatorLinks`.
- `creator-shortlist-scout`: a creator shortlist with dated sources and outreach drafts for the owner. Fills `creatorLog` (a growth check, not scored).
- `streamer-hype-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Recording checks need a real capture of your build; nothing is published by the agent.
- If your game has a spectator or streaming mode, a measured stream delay or spectator information failure blocks release. If your game has a streamer mode or shows names, an exposed name or sensitive detail in a capture blocks release; without either, the `no-streamer-mode` profile switches those blockers off.

Use the same scene and build for paired capture-on and capture-off runs. Reopen the export and, if your game has spectators, compare spectator views to the approved information and delay policy.

Before capture, agree on the case IDs and expected values in `profile.cases`. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `change-list` (optional, ^1.0.0) | the owner, 18 Bug Desk | `.grokbot-team/artifacts/change-list/` | Continue: build the change list from the repository history for the shipped range; without repository access, record NOT_RUN for patch notes. |
| `economy-change-list` (optional, ^1.0.0) | 06 Economy | `.grokbot-team/artifacts/economy-change-list/` | Continue without it. Start the report with "ASSUMPTION: no economy-change-list available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `balance-patch-draft` (optional, ^1.0.0) | 26 Balance Patch | `.grokbot-team/artifacts/balance-patch-draft/` | Continue without it. Start the report with "ASSUMPTION: no balance-patch-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `clip-list` (optional, ^1.0.0) | 10 Trailer | `.grokbot-team/artifacts/clip-list/` | Continue without it. Start the report with "ASSUMPTION: no clip-list available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `media-export-manifest` (optional, ^1.0.0) | 10 Trailer | `.grokbot-team/artifacts/media-export-manifest/` | Continue without it. Start the report with "ASSUMPTION: no media-export-manifest available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `store-asset-manifest` (optional, ^1.0.0) | 19 Store Page | `.grokbot-team/artifacts/store-asset-manifest/` | Continue: outreach drafts leave out the press kit link and say so. |
| `fairness-findings` (optional, ^1.0.0) | 15 Server Fairness | `.grokbot-team/artifacts/fairness-findings/` | Continue without it. Start the report with "ASSUMPTION: no fairness-findings available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `work-plan` (optional, ^1.0.0) | 12 Producer | `.grokbot-team/artifacts/work-plan/` | Continue without it. Start the report with "ASSUMPTION: no work-plan available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `patch-notes-draft` 1.0.0 | Markdown draft plus a JSON map from each line to its change | `.grokbot-team/artifacts/patch-notes-draft/` | 23 Support Desk |
| `creator-shortlist` 1.0.0 | JSON with outreach drafts | `.grokbot-team/artifacts/creator-shortlist/` | the owner |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases`, `balance` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `releases`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-20-streamer-hype-director` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
