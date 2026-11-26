---
name: splat-proxy-and-budget-check
description: "Use when checking splat count or memory against a budget, and whether a walkable proxy or nav mesh is usable."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Splat proxy and budget check

Use this skill for budget and navigation.

1. Record `budget.splatCount` and, if you have it, `budget.memoryMb`. The lens checks splat count against the owner maximum.
2. Record walkable holes in the proxy as `navigation.holes`. It must be 0.
3. Record `navigation.proxyPresent` when a proxy or nav mesh was actually produced and reviewed.

If a proxy is not in scope, leave the navigation groups out and let those lines read U.
