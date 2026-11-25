---
name: entry-scene-optional-interactions
description: "If your game has a title, menu or hub scene with decorative objects, design optional reactions for them and check that players can still find and use the main action."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-11-environment-design v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Make an interactive entry scene

Use this only if your game has an entry scene: a title screen, main menu, lobby or hub where decorative objects sit around the main controls. If the entry is a plain menu with no scene behind it, skip this skill.

The goal is small optional reactions (a sign tilts when tapped, a cat looks at the cursor) that add charm without slowing the player down. The main action always wins.

## 0. Ask first

Ask, one at a time: what is the player's first task on this screen (for example continue a save, start a level, join a session or pick a puzzle)? Is the scene 2D or 3D, and which engine draws it? Which inputs does the game support (mouse, touch, controller, keyboard)? Then plan only for those answers.

Short examples (synthetic, for illustration only):

- 2D platformer title screen: a parallax forest; a bird hops when the cursor passes. Main action: Start.
- Mobile puzzle game: tiles on the start screen jiggle when tapped. Main action: Play, which must stay the largest tap target.
- Farming or life sim: a farmhouse porch; the mailbox wobbles on focus. Main action: Continue.
- Racing game: a garage; headlights flash when the car is focused. Main action: Race.
- Turn-based strategy game: a map table; flags sway on hover. Main action: Resume campaign.
- 3D menu scene: a shelf of collectibles; one spins when clicked. Main action: Play.

## 1. Design

Place optional interactions away from the main controls and keep focus order stable for every supported input (a controller or keyboard must reach the main action in the same number of steps as before). Choose one reaction that fits the art direction. Limit how many effects can run at once, release temporary audio and animation objects when they finish, and respect reduced-motion and mute settings.

Put the reactions behind a feature switch that is off by default. Before any decorative motion starts, check both the owner's opt-in and the current accessibility setting:

```js
function entranceMotion(ownerOptIn, enabled, reducedMotion) {
  return ownerOptIn === true && enabled === true && reducedMotion === false;
}
```

## 2. Measure

Compare, with and without the reactions: time to reach the main action, accidental activations of decorations, and worst-case frame time. Repeat on the smallest supported display. Test the switch when it is missing, set to an invalid value and set to off; each case must behave exactly like the baseline. Then test the switch on with reduced motion enabled and keep the paired captures.

Negative fixture: in a test copy, let a decorative object overlap the main button. The input check must fail because the decoration steals the tap or click.

## 3. Which rubric lines this feeds

No rubric line scores the entry scene on its own. When the owner lists the entry scene as one of the representative scenes in the game profile, its frame-time trace can count toward the full-scene budget line in Prop & Rig Director (`scene-budget:1`), and its focal-point captures can support the prop hierarchy judgement in Environment Design Director (`scene-composition:2`). Otherwise keep the results as a local review note: they do not change the grade, and nothing is filed or shared without the human.

Gather evidence for `node engine/lens.mjs <pack.json>` only for the lines named above. If the scene or build is not available, record NOT_RUN.
