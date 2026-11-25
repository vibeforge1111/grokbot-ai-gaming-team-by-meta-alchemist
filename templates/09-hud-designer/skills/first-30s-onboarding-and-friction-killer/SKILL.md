---
name: first-30s-onboarding-and-friction-killer
description: "Observe a new player's first task and identify where discovery, controls or feedback interrupt progress."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-09-hud-ui-designer v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Review the first session

"Friction" is anything that stops a new player in the first seconds or minutes: a prompt they cannot find, a control they cannot work out, feedback they cannot read. This skill finds it from recordings of first sessions.

## 1. Define the first meaningful action

Pick the first action that shows the player understood the game, and an observation window (for example the first 30 seconds, or the first 3 minutes for a slower game). Start every observation from the same fresh save. Examples:

| Genre | First meaningful action |
|---|---|
| 2D platformer | Clear the first gap |
| Mobile puzzle game | Make the first match or place the first tile |
| Turn-based strategy | Move a unit and end the turn |
| Racing game | Pass the first checkpoint |
| Narrative adventure | Make the first dialogue choice |
| Farming or life sim | Plant and water the first seed |
| 3D arena game | Reach the first objective or win the first exchange |

## 2. Observe and record

Ask testers for consent before recording, and keep recordings local. For each session record: time to the first action, failed attempts, prompts seen, and whether the player can explain what happened. Check every supported control (including keyboard focus and touch where present), text size, focus order and recovery from a mistake. Keep the discoveries the design wants players to make on their own; friction is a stop the design did not intend.

## 3. Change one thing at a time

Change one cue or interaction, then compare recordings of equivalent runs and report what changed for the player. To prove your capture can show friction, test a build where a required prompt is missing or covered and confirm the recording shows the stall.

If the game offers a retry after a fail, record one explicit retry input and a run with no input: the retry must start exactly one new attempt and no input must start none. The `optional-retry` growth check reads these as `retryInput.afterGesture` and `retryInput.withoutGesture`.

## 4. Which lines this feeds

- `information-priority:1`: the first-session states in `profile.states` are captured and nothing essential is missing.
- `operability:1` and `operability:2`: every first-session control is reachable with each input, and touch targets meet the profile size where touch is supported.
- `responsive-behaviour:1`: first-session text meets the minimum size on each layout.

Gather evidence for `node engine/lens.mjs <pack.json>`.
