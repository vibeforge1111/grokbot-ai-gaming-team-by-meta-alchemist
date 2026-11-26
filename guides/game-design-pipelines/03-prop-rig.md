# Prop & Rig Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Build and optimize props and rigs for your runtime. Compare their appearance, animation and collision shapes with your art and performance targets.

Template folder: [templates/03-prop-rig](../../templates/03-prop-rig/). Install and prompts: [HOW-TO-USE.md](../../templates/03-prop-rig/HOW-TO-USE.md), [PROMPTS.md](../../templates/03-prop-rig/PROMPTS.md).

## When to use it

- **Stage:** Production
- **Trigger:** When you add or replace 3D props, characters or vehicles: furniture, plants, tools, creatures, buildings, held items and similar.
- **Works with:** any 3D pipeline, for example Unity, Unreal, Godot, Blender export (FBX or glTF) or Three.js. The bot asks which one you use before giving setup steps. For flat 2D sprites, use template 17 instead.

## Inputs and outputs

- **Inputs:** Reference images or source assets, plus geometry, frame-time and texture budgets in your game profile.
- **Outputs:** Reusable prop setups (prefabs, scenes or groups, depending on your engine), optimized assets, turntable captures and collider overlays.

## Handoffs

- **Takes from:** Art references, Environment Design requests.
- **Hands to:** Material artists, Environment Design and the team measuring asset performance.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `prop-rig-getting-started`. It asks which engine and pipeline you use, which props are in scope and whether the `static-props` rubric profile applies (no prop is held, attached or animated through extreme poses), then helps you write the values into your game profile. You approve the profile before scoring; it goes in `rubricProfile`, the two pose lines then read N/A, their partner lines take each pillar's 20 points, and the verdict can reach PASS.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
3. **procedural-prop-builder:** Build a prop or rig from art references in your engine, with reproducible seeded variation and measurable clearance.
4. **asset-lod-and-compression-pipeline:** Make simpler and smaller versions of a 3D asset for your target devices and check that its look, animation and collision still match the original.
5. **turntable-collider-proof:** Use after building a prop or rig: prove its collision shape matches the visible model from every angle and that clearance and grounding hold in real poses.
6. **entry-scene-optional-interactions (optional):** Only if your game has a title, menu or hub scene with decorative objects: design optional reactions and check that players can still find and use the main action.
7. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profile used.
8. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines above level 3.

## Rubric pillars

- **Silhouette** (20): Readable silhouettes at the gameplay camera; Held or attached prop silhouette at extreme poses (any held prop, such as a tool or lantern)
- **Animation and attachment clearance** (20): Clip capture of extreme poses; Grounding on slopes. "Weapon" here means any held or attached prop.
- **Collider agreement** (20): Visible shape vs collision shape overlay; Floor probe cost
- **Scene budget** (20): Full-scene draw and CPU cost; LOD transitions
- **Visual consistency** (20): One current art reference; Reproducible variation

See [README.md](README.md) for end to end pipelines that combine templates.
