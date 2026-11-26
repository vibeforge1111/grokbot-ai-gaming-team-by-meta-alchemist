---
name: studio-export-plan-and-safety
description: "Use when writing a local export plan, confirming the pack names its build, and confirming nothing was published automatically."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Export plan and safety

Use this skill for identity and safety.

1. Confirm the pack records git and live SHAs (`identity.gitShaPresent`, `identity.liveShaPresent`).
2. Record `safety.publishes` for any upload, post, or publish this run attempted. It must be 0. Keep a local media export manifest and a work plan only.

The human publishes. The bot does not.
