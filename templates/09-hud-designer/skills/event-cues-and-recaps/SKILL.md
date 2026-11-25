---
name: event-cues-and-recaps
description: "Show players what just happened and where: a direction cue for an off-screen event, or a short recap after a fail, a turn or a choice. Combat cues such as hit direction are one optional case."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-09-hud-ui-designer v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Show what happened and where

Some events matter but are easy to miss: something happened off screen, two events happened at once, or the player failed and does not know why. This skill adds a cue that shows where an event happened, or a short recap that explains it afterwards.

## 1. Choose the events players must tell apart

Use real game events to label each outcome, and note whether a cue only informs the player or marks a change in game state. Examples:

| Genre | Event to explain | Cue or recap |
|---|---|---|
| 2D platformer | The player fell into a hazard | A recap frame showing the hazard and where it was touched |
| Mobile puzzle game | No moves left | A recap showing the last possible move the player missed |
| Racing game | A rival is about to overtake from behind | An edge arrow on the side the rival is coming from |
| Turn-based strategy | Several things happened during the enemy turn | A short turn summary the player can step through |
| Narrative adventure | A choice changed a relationship | A small note naming the character and the change |
| Farming or life sim | Crops are ready in another field | A map marker or edge arrow pointing to the field |
| 3D arena game, if your game has combat | A hit or a near miss from off screen | A direction indicator and an optional hit recap |

## 2. Point to where it happened

- **Events with a place in the world:** turn the event's direction into screen space for the current camera. Check that the cue still points the right way after the camera turns and with each supported control.
- **Events without a place:** attach the cue to the affected object or HUD element (the score, the inventory slot, the character portrait).
- Never rely on colour alone. Pair colour with a shape, an icon, a label or a sound, and hand sound cues to Audio Director (13).

Test two events close together, a camera turn, and a harmless event (a near miss or a cancelled action) that must leave the score, health or other state unchanged. A recap must be dismissible and must never cover the next required action.

## 3. Optional recap behind a switch

A recap shows only after the owner opts in; the switch is off by default. Feed it a local, anonymous event record: event type, amount (score lost, damage, time lost), optional relative direction and capture id. Test three inputs before opting in: an event with amount zero shows zero, an event without a direction shows no arrow, and no event keeps the recap hidden. Keep automatic replay off. If the recap offers a retry, check that one explicit retry input starts exactly one new attempt, and that no input starts none (the `optional-retry` growth check reads `retryInput.withoutGesture` and `retryInput.afterGesture`).

```js
function recapState(optIn, event) {
  if (optIn !== true || !event || !Number.isFinite(event.amount) || event.amount < 0) return null;
  return { type: String(event.type), amount: event.amount, direction: Number.isFinite(event.direction) ? event.direction : null };
}
```

## 4. Which lines this feeds

- `information-priority:1`: the event's essential information is visible in each state and viewport in the profile.
- `readable-combat-states:2`: the cue survives colour removal in both tested palettes. The pillar name comes from a combat game; for your game read it as "readable game states".
- `operability:1`: focus returns to the right control after a recap is dismissed.

Gather evidence for `node engine/lens.mjs <pack.json>`.
