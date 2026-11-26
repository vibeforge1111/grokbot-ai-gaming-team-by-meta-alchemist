---
name: shader-graph-and-compile-check
description: "Use when reading compile logs and pre-warm times for a shader graph, node material, or equivalent, on any engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Compile and pre-warm check

Use this skill to fill the compile and variant lines from owner-supplied logs. TSL and WebGPU are supported paths; other graphs and languages are welcome.

1. Record compile failures as `compile.failures`. It must be 0.
2. If a pre-warm is required, record `compile.prewarmMs` and compare it to the owner's budget.
3. Record how many required variants were actually built (`variants.built`) against the owner's minimum, and `variants.debugShipped` (must be 0).

This preview has no bundled compiler. Never invent a log line. Missing logs earn U.
