---
name: ship-juice-module
description: "Add visual, audio or haptic feedback (often called juice) to an action without changing input handling or game timing, behind a switch that is off by default."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-01-game-feel v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Implement action feedback

"Juice" is the extra feedback that makes an action feel good: a flash, a sound, a small camera move, a vibration. This skill adds it without changing what the game does.

## 1. Hook feedback to a game event

Send an existing gameplay event to a presentation handler. Keep the action, its time and its strength in the event data. Examples:

| Genre | Event | Feedback |
|---|---|---|
| 2D platformer | Landing | A dust puff and a landing thud, stronger after a long fall |
| Mobile puzzle game | A piece snaps into place | A highlight and a short vibration |
| Turn-based strategy | A unit finishes its move | A small settle animation and a footstep sound |
| Racing game | Hitting a wall | A short camera shake and a scrape sound |
| Narrative adventure | A new clue is found | A soft glow on the item and a chime |
| Farming or life sim | Harvest | Crops pop into the basket with a pluck sound |
| 3D arena game | A hit lands | Hitstop (a freeze of a few frames on impact), a flash and an impact sound |

Hitstop, shake and similar effects are style choices. Add them only when the owner's design contract (their written list of intended effects) includes them.

## 2. Keep game logic and presentation apart

Run the game simulation and the presentation on separate clocks: effects read the game state and never write to it. Drive fades from elapsed time so they look the same at any frame rate. Apply camera offsets to the rendered camera after aiming, picking or targeting has been computed, so a shake never moves where the player's input lands. Expose duration, strength and a reduced-motion option in the game's settings. Cap simultaneous effects with measured CPU, GPU and audio budgets.

For a camera shake that decays the same way at any frame rate, scale its strength each frame by `exp(-decayPerSecond * elapsedSeconds)`. In JavaScript: `intensity *= Math.exp(-decayPerSecond * elapsedSeconds)`. Sample the result only when rendering, and keep the unshaken camera for input and simulation.

## 3. Prove it changed nothing else

Capture a replay twice with the same input and seed, with the feedback on and off. Check that the game state matches, that the cue appears at the intended time, and that the reduced-motion run removes or softens the promised effects. Measure frame time on a target device at the busiest moment of effects.

The new feedback sits behind a switch that is off by default. Test the switch missing, invalid and explicitly off: each case must keep the original input and timing. Then test the effects switched on, with reduced motion on, and keep both captures.

Use typed settings in the presentation code. A request flag can only turn on an effect the owner has approved:

```js
function effectEnabled(ownerOptIn, requestFlag) {
  return ownerOptIn === true && requestFlag === true;
}
```

## 4. Hand on what other templates need

If the feedback adds or changes a sound, note the event name and its priority for Audio Director (13). If it adds or changes a HUD element, note it for HUD Designer (09). Put both in the local `feel-findings` file with the pack id and capture ids.

Gather evidence for `node engine/lens.mjs <pack.json>`.
