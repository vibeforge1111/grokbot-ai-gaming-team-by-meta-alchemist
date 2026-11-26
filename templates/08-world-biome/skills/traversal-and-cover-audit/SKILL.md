---
name: traversal-and-cover-audit
description: "Use when checking navmesh or walkable routes, cover or sightlines, and chunk streaming cost on a generated world."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
>
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement; label every worked example synthetic.

# Traversal and cover audit

Use this skill to fill the layout and traversal lines.

1. Record cover or sightline gaps the owner cares about as `layout.coverGaps`. It must be 0 at level 4.
2. Record biome or region coverage issues as `layout.biomeGaps`.
3. Record unwalkable traps (places a player can enter and not leave) as `traversal.unwalkableTraps`. It must be 0.
4. Record chunk streaming hitch samples in milliseconds as `traversal.streamMs`. The lens compares p95 to the owner budget.

There is no bundled navmesh tool here. Use the owner's exporter. Missing reports earn U.
