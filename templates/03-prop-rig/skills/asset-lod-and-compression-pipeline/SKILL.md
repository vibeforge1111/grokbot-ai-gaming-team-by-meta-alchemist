---
name: asset-lod-and-compression-pipeline
description: "Make simpler and smaller versions of a 3D asset for your target devices and check that its look, animation and collision still match the original."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-03-procedural-rig-crafter v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Optimize a 3D asset

Make lighter versions of an asset (fewer triangles, smaller files, levels of detail) and prove they still look, animate and collide like the original. It feeds `scene-budget:1`, `scene-budget:2` and `silhouette:1`, and re-checks `collider-agreement:1` after the change.

## 0. Ask first

Ask which engine and export pipeline the project uses before giving any command, then use only that row. If a tool in the row is not installed, record NOT_RUN and ask the owner; do not install it on your own.

| Pipeline | Simplify and make LODs (levels of detail) | Compress for delivery | Measure in game |
|---|---|---|---|
| Unity | LOD Group component with simplified meshes | Mesh Compression in the model import settings | Profiler and Frame Debugger |
| Unreal | LOD settings in the Static Mesh editor, or Nanite where your target supports it | the engine's cooked packaging | Unreal Insights, `stat unit` |
| Godot | LOD generation in the glTF or scene import settings | the import settings for meshes and textures | Profiler and Monitors |
| Blender export | Decimate modifier on a copy, exported as extra LOD meshes | done in the target engine | measured in the target engine |
| Three.js with glTF | `gltf-transform simplify` | `gltf-transform draco` or `gltf-transform meshopt`, only if the matching decoder ships with your build | browser performance trace and `renderer.info` |

## 1. Record the starting point

Keep an untouched copy of the original. Record its triangle count, material count, texture bytes, download size, load or decode time and the largest size it appears on screen. Normalise scale and axes to the project's import settings.

## 2. Simplify one step at a time

Make one LOD at a time. Preserve outline edges, skin weights, joint names, animation tracks, sockets and collision markers. Measure file size and decode cost separately: a smaller file that takes longer to decode can be slower overall.

Example from the Three.js row (synthetic, for illustration only):

```sh
gltf-transform simplify original.glb candidate.glb --ratio 0.5
gltf-transform draco candidate.glb candidate-draco.glb
```

Load the candidate with the decoder your game actually ships, not a desktop viewer.

## 3. Compare

Overlay the original and the candidate at matched camera positions. Test shadows, ground contact, extreme joint motion and LOD switches at the distances players really see. Short examples:

- Racing game: a trackside grandstand seen at 200 km/h needs aggressive LODs; check for popping on the straight.
- Farming sim: hundreds of crop plants share one mesh; draw calls and instancing matter more than triangles.
- Mobile puzzle game: one prop on screen at a time; texture bytes and load time matter most.
- Open-world 3D game: buildings switch LOD often; record `lod.swapsPerSecondMax` along a real route.

## 4. Negative fixture and record

Build a test candidate with a missing joint or a moved collider and confirm the comparison fails. Record the chosen export settings, the source format, exporter and decoder versions, and the peak frame time on target hardware. If an asset or tool is unavailable, record NOT_RUN and keep its measurements out of the pack.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `prop-rig-lens-engine`).
