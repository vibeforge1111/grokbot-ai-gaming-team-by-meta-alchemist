---
name: lobby-fill-weekly-proposals
description: "Use when a de-identified seat export needs fill per region and hour, queue waits, bot share and thin-region alternatives measured and drafted for the queue owner."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-25-matchmaking-lobby-fill v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Queue alternatives

Measure fill, waits and bot share per region from anonymous seat rows, and draft options for every thin region with its trade-off. Every option is a proposal for the owner.

Rubric lines this informs: `fill-measurement:1`, `fill-measurement:2`, `proposals:1`, `proposals:2`, `bot-honesty:2`, `wait-and-devices:1` and `wait-and-devices:2`.

## Steps

1. Input: `input.json` (shape in HOW-TO-USE.md) with sub_ seat keys, region codes, integer hours, optional device codes and waits, the directional p90 latency matrix `rtt`, and the profile (`minHumansPerHour`, `pingCapMs`, `maxBotShare`, `maxWaitS`, `maxWaitP90S`, `primaryInput`, `comparisonInput`, `maxInputWaitGapS`, `inputQueueMinShare`, `minRegionHours`).
2. Proposal: `node mm/scenario.mjs input.json --report > drafts/lobby-proposals.md`.
3. Pack and grade: `node mm/scenario.mjs input.json > pack.json`, then `node engine/lens.mjs pack.json`.
4. Read the proposal: each thin region has merges inside the ping cap (never with unknown latency), labelled bot fill and a peak-window option, each with its trade-off; every option is PROPOSED and needs the owner.
5. Stop or NOT_RUN: rows with personal fields or raw ids are refused and counted. If every row is refused, stop and ask for a de-identified export. Without `primaryInput` and `comparisonInput`, `wait-and-devices:2` stays U. Averages cover observed hours only in this preview, so say so when a region has silent hours.

## Output

A local proposal draft, `pack.json` and the grade record.
