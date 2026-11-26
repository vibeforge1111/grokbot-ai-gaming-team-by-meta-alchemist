---
name: retention-cohorts-export-check
description: "Use when a new or changed session export arrives and you need to confirm it is anonymous and well formed before any retention analysis."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-27-retention-cohort-analytics v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Export review

Check an export against the engine's strict schema before analysis. Rejected rows are counted with their reasons; the original rows are never copied.

Rubric lines this informs: `privacy-in:1`.

## Steps

1. Input: the candidate `input.json`.
2. Run `node cohorts/scenario.mjs input.json > pack.json` and read `metrics.privacy`: `piiAccepted` and `rawIdsAccepted` must be 0. The engine refuses rows with personal fields, raw ids (anything other than sub_ plus 32 hex), timestamps or unknown fields.
3. For a game with no export yet: `node cohorts/probe-only.mjs --profile profile.json --git-sha <sha> --live-sha <sha> > pack.json`. Only the privacy and authority checks run and the retention lines stay U.
4. Record the refused-row counts and reasons, never the rows themselves, and confirm that the build references and the reporting day boundary are known.
5. Stop: if the export holds names, emails, handles or raw ids, stop and ask the owner to salt and strip it before export; never clean it yourself.

## Output

A local note of refused counts and reasons, and the `privacy` group in the pack.
