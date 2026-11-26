---
name: floater-and-seam-cleanup-review
description: "Use when reviewing a before and after splat cleanup for remaining floaters, outliers, and seam breaks."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Floater and seam cleanup review

Use this skill to fill the cleanup and seam lines from an owner-supplied before and after pair. This skill does not edit the splat itself.

1. Record remaining floaters or outliers as `cleanup.floatersLeft`. It must be 0 at level 4.
2. Record whether a before and after pair was reviewed (`cleanup.beforeAfterReviewed`).
3. Record seam or continuity breaks as `continuity.seamBreaks`. It must be 0.

There is no bundled cleaner here. Never overwrite the source capture. Missing reports earn U.
