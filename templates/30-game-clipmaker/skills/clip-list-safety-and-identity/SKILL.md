---
name: clip-list-safety-and-identity
description: "Use when writing a local clip list, confirming the pack names its build, and confirming nothing was uploaded automatically."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Clip list safety and identity

Use this skill for identity and safety.

1. Confirm the pack records git and live SHAs (`identity.gitShaPresent`, `identity.liveShaPresent`).
2. Record `safety.uploads` for any upload or post this run attempted. It must be 0. Keep a local clip list only.

The human uploads. The bot does not.
