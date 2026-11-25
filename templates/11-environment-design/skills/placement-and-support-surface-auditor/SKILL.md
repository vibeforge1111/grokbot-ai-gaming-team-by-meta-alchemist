---
name: placement-and-support-surface-auditor
description: "Check that placed objects rest on the surface they belong on (floor, tile, shelf, terrain) and follow the project's placement rules."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-11-environment-design v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Inspect support surfaces

Check that every placed object rests on the surface it belongs on, with no corner floating over an edge and no base sunk into the ground. A support surface is whatever an object should stand on: a floor, a tile, a shelf, a table top, terrain or a road. No line in this template computes grounding by itself: the overlay you produce goes to the named judge for `environment-consistency:1` and `traversal-affordance:2`. For numeric foot and base gaps on single props, use `animation-and-weapon-clearance:2` in Prop & Rig Director (03).

## 0. Ask first

Ask which engine or level tool holds the scene, then use only the matching way to read world positions:

- Unity: each Transform's `localToWorldMatrix`, and `Physics.Raycast` down from each footprint sample.
- Unreal: the actor or instance transform, and a line trace down from each footprint sample.
- Godot: `global_transform`, and a ray query (`intersect_ray`) or a RayCast node for each sample.
- Tile maps (Tiled, LDtk, or the tile map node in Unity or Godot): the tile under each footprint cell and its tile type or tags.
- Three.js: an instance's world matrix is the object's `matrixWorld` multiplied by its local instance matrix. Transform the footprint by that product before testing contacts, and test one instance inside a rotated parent to catch coordinate-space mistakes.

If the scene format is not one you can read, record NOT_RUN and name the export the owner would need to provide. Do not install tools on your own.

## 1. Sample the footprint

Expand instanced or batched geometry into world-space positions, keyed by a stable object or instance ID (use the instance or batch ID when the object has no name). Sample each footprint at its corners, along its edges and across the interior, scaled to the object. A centre-point test alone misses a corner floating over an edge. For large scenes, use the engine's spatial index before precise tests.

Compare contact depth, slope and material tags with the project's placement rules (the allowed surfaces and the largest allowed gap, agreed with the owner). Bridges, steps and intentional overhangs need explicit expected values.

Short examples (synthetic, for illustration only):

- 2D platformer: a crate placed half over a one-way platform edge, so it hovers when the tile below is removed.
- Top-down RPG: a market stall straddling a road tile and a water tile.
- City or racing game: a bin sitting half on the pavement and half over a kerb edge, so one corner floats.
- Life sim: a lamp on a table that is placed slightly above the table top.
- Strategy game: a tree on a tile tagged as buildable, which contradicts the movement rules.

## 2. Classify and export

Given the world-space sample hits from the chosen adapter, classify the complete footprint before accepting the placement:

```js
function assessFootprint(samples, expectedCount, allowedMaterials, maxGap) {
  if (!Number.isSafeInteger(expectedCount) || expectedCount < 1 || !Array.isArray(samples) ||
      samples.length !== expectedCount || !allowedMaterials.length || !Number.isFinite(maxGap)) return { status: "NOT_RUN" };
  const cells = new Set();
  const rejected = [];
  for (const sample of samples) {
    if (!sample || !Number.isFinite(sample.gap) || typeof sample.material !== "string") return { status: "NOT_RUN" };
    if (sample.cell == null || cells.has(sample.cell)) return { status: "NOT_RUN" };
    cells.add(sample.cell);
    if (!allowedMaterials.includes(sample.material)) rejected.push({ cell: sample.cell, reason: "material" });
    if (Math.abs(sample.gap) > maxGap) rejected.push({ cell: sample.cell, reason: "contact gap" });
  }
  return { status: rejected.length ? "FAIL" : "PASS", rejected };
}
```

Export a support grid, an annotated overlay of the outliers and a rejection reason per object ID. Use a synthetic or local scene for the worked example.

## 3. Negative fixture

Include a deliberately misplaced object whose footprint crosses two incompatible surfaces (for example a floor tile and a ledge edge). The check must return FAIL for it.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `environment-design-lens-engine`).
