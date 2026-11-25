---
name: environment-set-dressing-and-grounding-director
description: "Place decorative detail so players can recognize landmarks, tell usable objects from decoration and read the intended routes, in 2D or 3D."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-11-environment-design v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Place and ground scene detail

Set dressing means placing the detail objects that make a space feel real (crates, plants, signs, furniture, debris) around the playable layout. Done well, it points players toward where to go and what they can use. Done badly, it hides the route or makes decoration look usable. This skill feeds the judged lines `scene-composition:2`, `traversal-affordance:1`, `traversal-affordance:2` and `environment-consistency:1`, and the computed line `visual-navigation:1`.

## 0. Ask first

Ask how the player sees the world (2D side view, top-down, isometric, 3D third-person, first-person or a fixed board) and which tool builds the scenes. Then use only the matching checks:

- 2D side view or top-down: check layer order, foreground overlap, silhouettes against the background and tile edges.
- Isometric: check draw order around tall objects and whether objects behind walls stay readable.
- 3D: check contact points, scale, perspective and what the camera sees at player height.

If the game has no free movement (for example a fixed-screen puzzle or a card game), only the composition parts apply: keep decoration from competing with the pieces the player acts on, and leave the route lines U.

## 1. Plan before detail

Mark the player's route, camera positions and decision points (forks, jumps, doors, shop counters, the next puzzle piece) before adding detail. Use scale, grouping, local contrast and empty space to draw the eye toward each decision.

Short examples (synthetic, for illustration only):

- 2D platformer: foreground vines frame the screen but never overlap the ledge the player must land on.
- Top-down RPG village: a tall well and a red-roofed inn act as landmarks; small barrels never block a doorway.
- Farming or life sim: crops and fences read as usable, while flower pots read as decoration.
- Racing game: trackside banners and cones lean into the next turn and stay outside the racing line.
- Turn-based strategy game: terrain props show which tiles block movement and which are only scenery.
- 3D arena or exploration game: crates that can be climbed share one look; decorative rubble looks different.

## 2. Fit and ground

Fit each object to its support surface and intended material: no floating crates, no chairs half inside a wall. Keep decorative collision separate from walkable geometry unless the design calls for an obstacle. Sample views at the approach, the decision point and the exit, including the smallest supported display.

## 3. Compare and prove

Compare captures with the approved art reference. For the judged lines, give the named judge annotated captures and record their call as `pack.judgements["<line id>"] = { level, judge, evidenceIds, note }`. In a test copy, deliberately lift a grounded object or cover a route cue and verify that the review catches it.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `environment-design-lens-engine`). If the scene or tool is not available, record NOT_RUN.
