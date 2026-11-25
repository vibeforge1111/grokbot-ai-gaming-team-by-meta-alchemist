---
name: assist-and-forgiveness-check
description: "Check that aim assist, ledge grabs, snap-to-tile and other input help land where the player meant, the same way on every supported control. Use only when your game has such help."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-01-game-feel v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Check assists and input forgiveness

An *assist* is help the game adds to the player's input: aim assist, a ledge grab, a tap that snaps to the nearest tile, steering help. *Forgiveness* is a small allowance that lets a nearly correct input still count, such as a jump pressed a few frames after running off a ledge (often called coyote time) or a press stored just before landing (a jump buffer). Both should do what the player meant and behave the same on every supported control.

Skip this skill if your game has no assists and no forgiveness windows. Never add one just to fill a rubric line.

## 1. List what your game does

Write each assist or window into the game profile notes with its trigger, its limit (time, distance or angle) and the controls it applies to. Examples:

| Genre | Assist or forgiveness to check | "Landed as intended" means |
|---|---|---|
| 2D platformer | Coyote time, jump buffer, ledge grab | The jump or grab happens inside the window and never outside it |
| 3D arena game | Aim assist on pad and touch | The attack lands on the intended target, with the same assist strength on each control |
| Mobile puzzle game | A drag that snaps to a tile | The piece lands on the tile the player touched, never a neighbour |
| Racing game | Steering or braking assist | The car follows the line the player steered, at the assist level the setting promises |
| Turn-based strategy | Cursor snapping to units or tiles | The selected unit or tile is the one under the cursor or finger |
| Narrative adventure | Auto-highlight of the nearest object | The highlighted object is the one the player faces or touches |

## 2. Replay cases at the edges

For each assist or window, replay inputs just inside and just outside its limit on each supported control. Add one case where the target is out of reach or hidden and record the expected refusal. Keep one capture at gameplay size for every case.

If your game has height differences, test targets above, below and next to an obstruction as seen by the gameplay camera. In a 2D game, compare the input point with the selected or landing point on the screen.

## 3. Record the evidence

- **Directional aiming** (shooting, throwing, a golf or pool shot, a slingshot puzzle): record one p95 aim error in degrees per control in `targeting.errorDegP95` (p95 is the value 95 percent of samples stay under), whether the assist is written down for players in `targeting.assistDocumented`, and the assist strength on touch and pad in `targeting.touchAssist` and `targeting.padAssist`. These feed `control-intent:2`.
- **No aimed, selected or steered input:** the owner can approve the `no-aiming` profile before scoring (`"rubricProfile": ["no-aiming"]` in the game profile). `control-intent:2` then reads N/A, not U and not a defect, `control-intent:1` takes the pillar's 20 points, and the `targeting` group can be left out. Without that approval, leave `targeting` out and the line stays U. Never fill it with made-up values.
- **Jump buffers and held input** feed `response:2`; see `game-feel-audit`.
- Window and snapping results that have no metric field go in the report as notes and local ticket drafts, never as invented metric values.

Gather evidence for `node engine/lens.mjs <pack.json>`.
