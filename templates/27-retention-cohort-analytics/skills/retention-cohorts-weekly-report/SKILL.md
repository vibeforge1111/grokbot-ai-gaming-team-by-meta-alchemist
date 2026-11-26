---
name: retention-cohorts-weekly-report
description: "Use when a de-identified session export needs D1, D7 and D30 retention by first-play week, with ranges, small cohorts hidden and a recount check."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-27-retention-cohort-analytics v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Weekly cohort report

Group players by first-play week and count a return only after its day has fully passed. Every rate carries a range, small cohorts stay hidden, and an independent recount checks the totals.

Rubric lines this informs: `correctness:1`, `correctness:2`, `confidence:1`, `confidence:2`, `retention:1`, `retention:2`, `privacy-in:2`, `reporting:1` and `reporting:2`.

## Steps

1. Input: `input.json` with `events` (sub_ player key, whole day number, optional segment code), `today` (the first unfinished day), the build ids and the profile (`minCellSize`, `allowedSegments`, `minCohorts`, `minPlayers`, `minDays`, `targetD1`, `targetD7`, `targetD30`, `minProbeAttempts`).
2. Report: `node cohorts/scenario.mjs input.json --report > drafts/retention-report.md`.
3. Pack and grade: `node cohorts/scenario.mjs input.json > pack.json`, then `node engine/lens.mjs pack.json`.
4. Check the report: every rate has a range, cohorts under `minCellSize` read hidden, and the pooled rates match the recount (`math.oracleMismatches` is 0).
5. Stop or NOT_RUN: rows with personal fields, raw ids or timestamps are refused; if most rows are refused, stop and run `retention-cohorts-export-check`. In this preview a player's segment comes from the last row read, so confirm that each player has one segment code.

## Output

A local report draft, `pack.json` and the grade record.
