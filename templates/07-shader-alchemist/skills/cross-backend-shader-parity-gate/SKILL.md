---
name: cross-backend-shader-parity-gate
description: "Use when comparing the same material or shader graph across two or more backends, such as WGSL and GLSL or WebGPU and a fallback."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Backend parity gate

Use this skill to fill the parity lines.

1. List backends that were actually compared (`parity.backendsCompared`) against the owner's required set.
2. Record `parity.mismatches` for visual or numeric mismatches the owner did not already accept. It must be 0.
3. Record `parity.silentFallbacks` for a backend that quietly dropped to a cheaper path without a record. It must be 0.

If only one backend is in scope, leave these groups out and let the lines read U. Do not invent a match.
