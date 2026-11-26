---
name: seeded-world-repeatability-check
description: "Use when checking that the same seed reproduces the same world, and that a held-out seed was also run."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Seeded repeatability check

Use this skill to fill the seed lines from owner-supplied exports. It works with any engine or generator.

1. Record how many known seeds were actually exported (`seed.knownRun`) and how many held-out seeds were run (`seed.heldOutRun`).
2. Re-run a known seed on the same build and record `seed.mismatches` for tiles, biomes, or objects that changed. It must be 0.

This preview has no bundled generator. Never invent a seed result. Missing exports earn U.
