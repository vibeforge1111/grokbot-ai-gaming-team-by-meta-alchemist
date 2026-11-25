---
name: procedural-prop-builder
description: "Build a prop or rig from art references in your engine (for example Unity, Unreal, Godot, Blender or Three.js), with reproducible seeded variation and measurable clearance."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-03-procedural-rig-crafter v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Build a procedural prop or rig

Use this when you assemble a prop from parts, by script or by hand, and want variation that is repeatable and measurable. It feeds `silhouette:1`, `visual-consistency:1`, `visual-consistency:2` and, for animated props, `animation-and-weapon-clearance:1`.

## 0. Ask first

Ask which engine and asset pipeline the project uses before giving any setup step, then use only that row. If the answer is "none yet", ask the owner to choose; do not install tools on your own.

| Pipeline | Parent node for the prop | Seeded variation lives in |
|---|---|---|
| Unity | a prefab with child GameObjects | an editor script or a component that reads a stored seed |
| Unreal | a Blueprint actor with mesh components, or a Static Mesh with sockets | a construction script with a stored seed |
| Godot | a scene with a Node3D root | an editor (tool mode) script or an import script with a stored seed |
| Blender export | an Empty parent with child objects, exported as FBX or glTF | a Python script or Geometry Nodes with a fixed seed |
| Three.js | a `THREE.Group` | the build function that creates the group |

## 1. Build

1. Break the art reference into the shapes the player sees from the gameplay camera. Model those first; small detail comes last.
2. Put all parts under one named parent node. Give every moving joint (a wheel, a lid, a door hinge, a creature's jaw) a stable local pivot.
3. Match the project's world units, up axis, pivot placement and material setup. Check them against one existing asset that already looks right in game.
4. Reuse shared meshes and materials for repeated parts, so ten chairs cost little more than one.
5. Drive decorative variation (wear, colour shift, leaf count) from a seeded random stream. Keep that stream separate from placement and gameplay randomness, so the same seed always gives the same prop.
6. Build collision proxies (simple boxes, capsules or convex hulls) from the gameplay design, not from the fine visual mesh, and show them over the rendered prop.

Short examples (synthetic, for illustration only):

- Farming sim: a fence segment with seeded plank wear. Collision is one thin box; grounding matters on hills.
- Racing game: a car with four wheel pivots and a seeded decal set. Clearance means the wheels never sink into the body when the suspension compresses.
- Narrative adventure: a bookshelf with seeded book colours. No animation; if no prop in the game is held, attached or animated, the owner can approve the `static-props` profile and the pose lines read N/A.
- 3D arena game: a held tool or shield on a character's hand socket. Check it at the extreme poses in the profile.
- Mobile puzzle game with 3D pieces: one rounded block repeated in many colours. Silhouette and draw calls matter most.
- Creature: a jaw and tail rig. Check that the teeth stay outside the head across the bite clip.

## 2. Capture

- The rest pose, the pose with the greatest reach, and the prop at its smallest intended on-screen size.
- For seeded props, two separate export runs with the same seed, and the digest (hash) of each output mesh (`variation.sameSeedHashes`, `receipts.seedRuns`).
- Clearance, draw calls and frame time compared with the game profile.

## 3. Negative fixture

Offset one collision proxy on purpose in a test copy and confirm the overlay shows the mismatch and the check fails. A check that never fails proves nothing.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `prop-rig-lens-engine`). If the asset or tool is not available, record NOT_RUN and keep its numbers out of the pack.
