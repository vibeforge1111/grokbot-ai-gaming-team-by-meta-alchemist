---
name: runtime-and-rights-check
description: "Use when checking planned runtime against the owner's range, and whether rights or clearance notes are present."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Runtime and rights check

Use this skill for pace and rights.

1. Record planned runtime in seconds as `pace.runtimeS` and compare it to the owner's range. Record `pace.blackFrames` for planned black or empty holds the owner did not ask for. It must be 0.
2. Record missing rights or clearance notes as `rights.missing`. It must be 0. Record `rights.creditsPresent` when a credits pass is in the plan.

This bot does not grant rights. It only checks that notes exist for the human to review.
