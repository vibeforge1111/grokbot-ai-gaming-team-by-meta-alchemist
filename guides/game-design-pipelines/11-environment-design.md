# Environment Design Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Review placement, sightlines and visual cues so players can identify landmarks and navigate the spaces in your game.

Template folder: [templates/11-environment-design](../../templates/11-environment-design/). Install and prompts: [HOW-TO-USE.md](../../templates/11-environment-design/HOW-TO-USE.md), [PROMPTS.md](../../templates/11-environment-design/PROMPTS.md).

## When to use it

- **Stage:** Production, Polish
- **Trigger:** After blockout (the first rough version of a level, built from simple shapes), when scenes feel empty, floaty or noisy.
- **Works with:** any view (2D side view, top-down, isometric, 3D, a fixed board) and any engine or level tool. The bot asks which you use first.

## Inputs and outputs

- **Inputs:** Scenes or level files, camera paths and art references.
- **Outputs:** A set dressing plan (where decorative detail goes), a support surface audit, and a sightline and composition check.

## Handoffs

- **Takes from:** Layouts from the level design team.
- **Hands to:** Prop and Rig, material artists and playtesters.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `environment-design-getting-started`. It asks how your game is seen, which tool builds the scenes, which cues must stay visible, who judges the visual lines and whether the `no-location-overlays` rubric profile applies (no location names or area cards over play), then helps you write the values into your game profile. You approve the profile before scoring; it goes in `rubricProfile`, `visual-navigation:2` then reads N/A, `visual-navigation:1` takes the pillar's 20 points, and the verdict can reach PASS.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest QA (template 02) is coming later.
3. **environment-set-dressing-and-grounding-director:** Place decorative detail so players can recognize landmarks, tell usable objects from decoration and read the intended routes, in 2D or 3D.
4. **placement-and-support-surface-auditor:** Check that placed objects rest on the surface they belong on (floor, tile, shelf, terrain) and follow the project's placement rules.
5. **sightline-silhouette-and-value-composition-gate:** Check whether important objects and actions stay readable from the cameras and routes players actually use, in 2D, top-down or 3D views.
6. **entry-scene-optional-interactions (optional):** Only if your game has a title, menu or hub scene with decorative objects: design optional reactions and check that players can still find and use the main action.
7. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profile used.
8. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines above level 3.

## Rubric pillars

- **Visual navigation** (20): Landmarks at the approved minimum display size; Location overlays respect critical gameplay
- **Scene composition** (20): Bright, dark and crowded states; Prop hierarchy
- **Camera occlusion** (20): Shared level-design sightline test; Occlusion overlays
- **Usable objects and routes** (20): Usable objects vs decoration readable (in a game without cover: usable or walkable objects vs decoration); Route clips
- **Environment consistency** (20): Art reference match; Cross-device consistency

See [README.md](README.md) for end to end pipelines that combine templates.
