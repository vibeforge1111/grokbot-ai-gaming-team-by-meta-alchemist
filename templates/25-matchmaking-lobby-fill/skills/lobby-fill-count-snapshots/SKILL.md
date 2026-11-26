---
name: lobby-fill-count-snapshots
description: "Use when only saved aggregate count snapshots exist (players per server or per queue, no seat rows) and the owner wants them recorded without claiming more than they show."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-25-matchmaking-lobby-fill v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Count snapshot review

Turn saved count snapshots into a pack that measures only what counts can show. Seat, wait, bot and latency lines stay U until a seat export exists.

Rubric lines this informs: `safety-and-privacy:1` and `safety-and-privacy:2` (both probe this template's own code); every other line stays U.

## Steps

1. Input: `snapshots.json`, an array of `{ region, players }` rows the owner saved, and the owner's `profile.json` (at least `minProbeAttempts`).
2. Pack: `node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha> > pack.json`.
3. Grade: `node engine/lens.mjs pack.json`.
4. Describe only the counts in the pack's `note`, and name the seat export that would measure the U lines.
5. Stop: without `--profile` the profile is empty and the threshold lines grade U; ask the owner for their profile instead of using the synthetic example's.

## Output

A counts-only `pack.json`, its grade and a short local note of what the counts show.
