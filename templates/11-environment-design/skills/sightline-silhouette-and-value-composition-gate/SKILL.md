---
name: sightline-silhouette-and-value-composition-gate
description: "Check whether important objects and actions stay readable from the cameras and routes players actually use, in 2D, top-down or 3D views."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-11-environment-design v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Check sightlines and composition

A sightline is the clear line of view from the player's camera to something they need to see. Composition is how the scene arranges shapes, light and dark so the eye goes to the right place. "Value" here is the art term for how light or dark a colour is: a dark object on a light background reads even when the colours are similar. This skill feeds `camera-occlusion:1`, `camera-occlusion:2` and the judged line `scene-composition:1`.

## 0. Ask first

Ask how the player sees the world and which engine draws it, then use only the matching check:

- 2D side view: check overlap, layer order and foreground effects between the camera and the player or target.
- Top-down or isometric: check tall objects, roofs and tree canopies drawn over the player or a target, and whether they fade or cut away.
- 3D: cast rays from the camera to each target and check what geometry sits between them.
- Fixed board or screen: check that effects and decoration never cover the pieces or tiles the player acts on.

## 1. Pick the targets and routes

Name the focal point and the cues the player must see at each decision point (from the owner's answer during setup). Record normal and extreme camera views along each approved route.

Short examples (synthetic, for illustration only):

- 2D platformer: a foreground pillar hides the player for several frames while they line up a jump.
- Top-down action RPG: a tree canopy hides a pickup until the player is standing on it.
- Isometric strategy game: a tall building hides a unit standing behind it; the wall should cut away.
- 3D third-person adventure: the camera slides behind a column and the next ledge disappears.
- Racing game: a trackside billboard blocks the view of the next corner.
- Mobile puzzle game: a sparkle effect covers the tile the player needs to tap.
- 3D arena game: smoke or foliage hides an opponent's outline at a range the design says should be visible.

## 2. Measure

- `camera-occlusion:1`: export one versioned sightline trace (schema `sightline-v1`) per approved case, with the seed, route, camera, whether the target was visible by ray, whether it should be visible, and how many frames the cue was hidden. Store one row per case in `receipts.sightlines`. If another team or template also reads this trace (for example level design), record that use separately with its own artifact ID and build; if nobody else reads it yet, note the shared use as NOT_RUN.
- `camera-occlusion:2`: count frames on each test route where scenery hides a needed cue (`occlusion.routes`, `occlusion.occludedCueFrames`).
- `scene-composition:1`: capture bright, dark and busy versions of the scene (for example a night level, a crowded market or a screen full of effects) and give them to the named judge. Compare outline separation, light and dark contrast, and time obscured with the art reference.

If decorative geometry fades or cuts away, check that its collision still matches the design, so the player cannot walk through something that looks solid.

## 3. Negative fixture and review

Keep paired images with the focal point marked. In a test copy, place an object that blocks a required cue and confirm the check fails. Ask a reviewer to name the next action from a capture at the smallest intended display size.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `environment-design-lens-engine`). If the build or capture tool is not available, record NOT_RUN.
