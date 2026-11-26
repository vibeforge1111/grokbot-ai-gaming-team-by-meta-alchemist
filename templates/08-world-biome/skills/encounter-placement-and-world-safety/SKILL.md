---
name: encounter-placement-and-world-safety
description: "Use when checking encounter density and fairness, pack identity, and whether seed logs leak personal data."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Encounter placement and world safety

Use this skill for encounters, identity, and safety.

1. Record encounter density as `encounters.density` and check it against the owner's low and high bounds.
2. Record clearly unfair spawns (for example an inescapable trap encounter the owner did not accept) as `encounters.unfairSpawns`. It must be 0.
3. Confirm pack identity (`identity.gitShaPresent`, `identity.liveShaPresent`). Record `safety.piiLeaks` in seed logs. It must be 0.

Never invent a spawn count. Missing reports earn U.
