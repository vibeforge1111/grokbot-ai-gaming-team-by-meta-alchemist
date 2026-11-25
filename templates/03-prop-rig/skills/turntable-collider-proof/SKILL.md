---
name: turntable-collider-proof
description: "Use after building a prop or rig: prove its collision shape matches the visible model from every angle and that clearance and grounding hold in real poses."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-03-procedural-rig-crafter v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Turntable collider proof

Prove that what the player sees is what the physics touches, before the asset ships. A turntable is a capture where the asset spins in front of a fixed camera so every side is recorded. It feeds `collider-agreement:1`, `animation-and-weapon-clearance:1`, `animation-and-weapon-clearance:2` and `visual-consistency:2`.

## 0. Ask first

Ask which engine the project uses and how it can show collision shapes, then use only that route:

- Unity: the Physics Debugger window, or Gizmos drawn in the Scene view.
- Unreal: the `show collision` view option or console command.
- Godot: Debug, then Visible Collision Shapes.
- Three.js or another web engine: a wireframe helper drawn over the mesh.
- Blender only: render the collision meshes on their own layer; the in-game check stays NOT_RUN until the asset is in the engine.

## Method

1. Render the asset on a turntable with enough yaw (turn) and pitch (tilt) samples to cover its outline, at the gameplay camera distance, with the visible mesh and the collision shape drawn as two aligned masks.
2. For each view, compute IoU (intersection over union: the overlapping area divided by the combined area of the two masks). Store one value per view in `colliders.iou` and one row per approved view in `receipts.colliderViews` with the asset id, view, tool version and the two pixel areas. Report the lowest value with its view and capture id.
3. Pose sweep, only for animated or attached props: play every approved clip to its extremes and measure the deepest overlap into the body, walls, floor or other actors (`clearance.penetrationCm`, `clearance.posesChecked`, `receipts.poseSweep`). Static props (furniture, buildings, rocks) need no sweep. When no prop in the game is held, attached or animated, the owner can approve the `static-props` profile: leave this out and the line reads N/A, not U.
4. Grounding: place the asset on flat ground and on each slope in the profile, and record the largest foot or base gap (`grounding.footGapCm`, `grounding.slopeDegTested`, `receipts.slopeContacts`).
5. Seeded variation: export the same seed in two separate runs and compare their mesh digests (`variation.sameSeedHashes`, `receipts.seedRuns`).

Short examples (synthetic, for illustration only):

- Platformer in 3D: a moving platform whose collision box is taller than its mesh makes players stand on air.
- Racing game: a barrier whose collider sticks out past its mesh stops cars before they touch it.
- Life sim: a sofa whose collider is too small lets characters walk through its arms.
- Shooter or arena game: a crate whose collider is bigger than its mesh blocks shots that look clear.
- Point-and-click 3D adventure: a clickable object whose collider is offset makes clicks miss.

## Negative fixture

In a test copy, inflate the collision shape by a clear margin (for example 30 percent) and confirm the IoU check fails. A gate that never fails proves nothing.

## Pitfalls

- A collider that only matches from the default camera angle hides unfair hits, missed clicks and invisible walls from other angles.
- Thresholds (`minColliderIoU`, `maxPenetrationCm`, `maxFootGapCm`) live in your game profile, not here.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `prop-rig-lens-engine`). If an asset is missing or its format is not supported, return NOT_RUN and name the conversion or export the owner needs to provide.
