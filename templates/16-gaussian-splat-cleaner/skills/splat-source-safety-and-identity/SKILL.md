---
name: splat-source-safety-and-identity
description: "Use when confirming the source capture was not overwritten, the pack names its build, and capture metadata has no personal data."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Source safety and identity

Use this skill for safety and identity.

1. Record `safety.sourceOverwrites`. It must be 0. Cleanup must write a new file.
2. Scan capture metadata for personal data. Record `safety.piiLeaks`. It must be 0.
3. Confirm pack identity (`identity.gitShaPresent`, `identity.liveShaPresent`).

Never invent a path. If you cannot prove the source is untouched, leave the group out and let the line read U.
