---
name: gpu-budget-and-shader-safety
description: "Use when checking GPU time and memory budgets, pack identity, and whether shader sources or logs leak secrets."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# GPU budget and shader safety

Use this skill for budget, identity, and safety.

1. Record GPU time samples in milliseconds as `budget.gpuMs`. The lens compares p95 to the owner budget. Record `budget.memoryMb` against the memory budget.
2. Confirm the pack records git and live SHAs (`identity.gitShaPresent`, `identity.liveShaPresent`).
3. Scan shader sources and logs for secrets or keys. Record `safety.secretLeaks`. It must be 0.

This preview has no bundled GPU sampler. Missing samples earn U.
