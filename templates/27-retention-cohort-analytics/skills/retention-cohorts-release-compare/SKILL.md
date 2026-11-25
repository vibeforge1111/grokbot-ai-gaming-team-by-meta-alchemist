---
name: retention-cohorts-release-compare
description: "Use when two builds need their mature retention compared on comparable acquisition windows before anyone says a release helped or hurt."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-27-retention-cohort-analytics v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Release comparison

Compare mature rates and ranges across two builds. No bundled tool compares builds yet, so the side-by-side table is built by hand and labelled manual.

Rubric lines: none directly; it reads the same lines as the weekly report, on two packs.

## Steps

1. Input: one `input.json` per build, with the same profile and comparable acquisition windows.
2. Run `node cohorts/scenario.mjs build-a.json --report` and `node cohorts/scenario.mjs build-b.json --report`, and the packs without `--report`.
3. Grade both with `node engine/lens.mjs <pack.json>` and compare only when the rubric hash and profile match.
4. Place the two tables side by side by hand. Describe missing windows, cohort size changes and population changes first. Overlapping ranges are not a difference.
5. Stop: if the windows or cohort sizes are not comparable, say so and draw no conclusion.

## Output

A local, manual comparison draft with both grade records.
