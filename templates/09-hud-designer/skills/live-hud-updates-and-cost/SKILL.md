---
name: live-hud-updates-and-cost
description: "Keep HUD elements that change often (score, timer, health, resources, lap time) readable during the busiest moment, and measure what updating them costs on each target device, in any engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-09-hud-ui-designer v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Update a live HUD without wasted work

A live HUD element is one that changes while the player plays: a score, a timer, a health or energy bar, a resource count, a lap time, a combo counter, a quest tracker. This skill keeps those elements readable at the busiest moment and measures what updating them costs.

## 1. Find the busiest moment

List what the player must read during the most hectic part of play, and what can wait. Examples:

| Genre | Busiest moment | Must stay readable | Can wait or shrink |
|---|---|---|---|
| Mobile puzzle game | A long chain of matches | Score, moves left, goal | Combo pop-ups |
| Racing game | A pack of cars at a corner | Position, lap, speed | Split times |
| Farming or life sim | Harvest at the end of a day | Clock, energy, the full inventory slot | Quest log |
| Turn-based strategy | The enemy turn with many units moving | Whose turn it is, unit health | Turn log |
| Narrative adventure | A timed dialogue choice | The choices and the timer | Relationship meters |
| 3D arena game, if your game has combat | A crowded fight | Health, ammo or cooldowns, threats | Damage numbers, kill feed |

Reserve screen space for the must-read elements and defer or merge the rest.

## 2. Update only what changed

Pick the adapter for your UI stack:

- **Browser DOM UI:** batch layout reads before writes, update text and transforms instead of rebuilding nodes, and avoid layout work on every event.
- **Canvas or WebGL UI:** redraw only the changed region or layer, and cache text that does not change.
- **Engine UI (Unity, Unreal, Godot or a custom engine):** keep fast-changing elements apart from static ones so a change does not rebuild the whole screen, and check layout invalidation, draw calls and memory allocation in the engine profiler.

Reuse frequent pop-ups (score numbers, "+1" pickups, damage numbers) from a pool when profiling shows it helps. Set the pool size and how long each item lives from observed bursts. Decide which pop-ups merge or drop when the pool is full, and never drop a must-read element.

## 3. Measure it

- Record UI frame time during the busiest moment on each target device, and once more with the HUD hidden for comparison. Put the HUD's share in `uiCost.uiMs`. This feeds `measured-ui-cost:1`.
- Record how much of the screen the HUD covers at that moment in `hudChrome.screenCoverPctMaxDuringPlay`. The name comes from a combat game; use the busiest moment of your game. This feeds the `hud-chrome-coverage` growth check, which is reported beside the grade and not scored.
- Note the peak number of active elements and whether focus stayed in place while values changed.
- Prove the check can fail: in a test copy, fill the pop-up pool past its limit and confirm the must-read elements stay readable.

Gather evidence for `node engine/lens.mjs <pack.json>`.
