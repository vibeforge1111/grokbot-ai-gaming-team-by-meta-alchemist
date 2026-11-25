---
name: sprite-hit-shape-checker
description: "Check the shapes the game uses to decide what touches what (attack hitboxes, platform collision, pickups, click or tap areas) against the code that really uses them, frame by frame."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-17-sprite-hitbox-packer v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Hit shape verification

A hit shape is the invisible box, circle or polygon the game uses to decide what touches what. Use this skill only if sprites in your game take part in gameplay collision; otherwise the owner approves the `no-hit-shapes` profile and both lines read N/A, never a defect. It feeds `hit-shape:1` and `hit-shape:2`.

## 0. Ask first

Ask which kinds of shapes the game uses, then check only those. Examples (synthetic, for illustration only):

- Platformer: the body box that stands on the ground and one-way platforms. A crouch frame may shrink it; a jump frame must not snag on ledges.
- Point-and-click adventure: hotspots on scene objects. A hotspot can be larger than the drawn object on purpose; the expected shape comes from the design, not the pixels.
- Mobile puzzle game: tap areas on pieces, often padded to a minimum touch size.
- Top-down RPG or farming sim: pickup and interaction areas (harvest a crop, open a chest, talk to a villager).
- Shoot 'em up: a player hitbox much smaller than the ship sprite.
- Fighting or action game: per frame, three shapes kept apart: hurt (where the character can be hit), push (keeps bodies from overlapping) and hit (the attack). Mixing them causes ghost hits and stuck bodies.

## Method

1. Trace the real caller. For each shape, find the gameplay code that actually reads it: damage, collision resolution, a pickup trigger or a click or tap hit test. Shapes drawn only by a debug or diagnostics overlay do not count (`hitShape.diagnosticsOnly` must be false). The engine expects `hitShape.tracedCaller` to be the fixed value `"gameplay-path"`, which means "traced to the gameplay code that really uses the shape". Use that value even when the code is a collision or click handler, and name the real function in the trace artifact.
2. Per animation frame, compare the frame and shape the gameplay code consumed with the exported frame manifest: frame ID, shape ID, pixel hash, pivot, source size, trim offset and rotation. Store one row per approved case in `receipts.frameColliders`. When frames share pixels after deduplication, they keep their own pivots.
3. Height or depth: if the game has a height or depth layer, list repro cases where two things sit at different heights or depths. For example jumping over a hazard in a top-down game, walking under a bridge, standing on a different lane in a side-scrolling brawler, or two clickable objects stacked on screen. Each case must resolve by the model the design declares (`heightLayer.reproCases`, `heightLayer.resolvedByDeclaredModel`). Without such a layer, the owner approves the `no-height-layer` profile and `hit-shape:2` reads N/A.
4. Capture a short clip of each repro before and after a fix.

## Negative fixture

In a test copy, move a shape onto the wrong frame and confirm the check fails.

## Pitfalls

- Shapes taken from a debug overlay instead of the gameplay code.
- Frame indexes shifted by one after an animation is trimmed.
- A click or tap area tested at desktop size only; touch screens may need a larger area.

Gather evidence for `node engine/lens.mjs <pack.json>` (see `sprite-hitbox-packer-lens-engine`). Features the game does not have (install icons, reward tiers, a height layer) read N/A under their approved profile (`no-install-icons`, `no-item-tiers`, `no-height-layer`), never as failures.
