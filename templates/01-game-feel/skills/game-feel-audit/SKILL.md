---
name: game-feel-audit
description: "Measure how fast and how clearly the game answers the actions players use most, in any genre and any engine, and gather the evidence for each Game Feel rubric line."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-01-game-feel v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Audit input and feedback

Pick the actions players repeat most. For each one, name the first visible, audible or haptic cue that tells the player the action worked. Examples:

| Genre | Action | First cue |
|---|---|---|
| 2D platformer | Jump | The character leaves the ground; the jump sound starts |
| Mobile puzzle game | Swap two tiles | The tiles start to move; a click or a short vibration |
| Turn-based strategy | Confirm a move | The unit starts to move; a confirm sound |
| Racing game | Brake | The car slows; brake lights and tyre sound |
| Narrative adventure | Pick a dialogue choice | The choice highlights; the next line starts |
| Farming or life sim | Water a crop | The watering animation and splash sound start |
| 3D arena game | Attack | The swing starts; a hit flash and impact sound on contact |

This works in any engine (Unity, Unreal, Godot, a custom engine or a browser build). Log the input time and the cue start on one clock, from an engine trace, a high-speed video or a test harness, and put the numbers in the pack.

## Steps

1. **Delay** (`response:1`, `readable-feedback:1`). Record input time and cue start for each control in `profile.inputDevices`. Say whether the trace stops when the game state changes or when the frame reaches the screen. The second includes display delay and is what players feel. Note whether each cue was visible and audible on each device.
2. **Repeat runs** (`response:1`). Repeat the same action on the same build, camera and device for each run id in `profile.latencyRunIds` (at least three). Compare the p95 (the value 95 percent of samples stay under) with the budget in the profile.
3. **Buffered and held input** (`response:2`). Test a press made just before the game can act on it (a jump pressed just before landing, a move queued during an animation) and a held input (hold to accelerate, charge, drag or fast-forward text). Record them in the `heldInput` group. The name comes from a held fire button, but the group covers any held or repeated input. `onlineMatchesOffline` asks whether the held input behaves the same in the real game mode as in a practice or test scene. If your game has no buffered or held input, leave `heldInput` out and the line stays U.
4. **Ready cues** (`readable-feedback:2`). If something becomes ready again (an ability recharges, a crop is ready to harvest, it is the player's turn, a boost refills), trace that its cue fires exactly once each time. If nothing in your game becomes ready again, leave `readyCue` out.
5. **Task on every control** (`control-intent:1`). Complete each task in `profile.journeyTasks` on each control, including one switch of control in the middle of a task.
6. **Camera framing** (`camera-comfort:1`). Check that anything that can hurt the player or make them fail (an enemy, a hazard, a rival car closing in, a falling piece) stays on screen at each viewport. The rubric calls these "threats". If nothing in your game can hurt or fail the player from off screen, the owner can approve the `no-hazards` profile: `camera-comfort:1` then reads N/A and `camera` can be left out.
7. **Effects never change the game** (`parity:1`). Replay the same inputs and seed with feedback effects on and off, and compare the final game state hash. The rubric compares an offline pair and a predicted pair (client prediction in an online game). If your game is offline only, the predicted pair does not exist: with the owner's approval select the `offline-only` profile, so `parity:1` reads N/A and `parity:2` takes the pillar's points. Report the offline result as a note.
8. **Reduced motion** (`camera-comfort:2`). List the motion reductions your settings promise (shake, flash, zoom). Turn the setting on, replay the same camera path and confirm each one is applied.
9. **Prove the check can fail.** In a test copy, remove one feedback cue and confirm that your evidence check reports it missing. Keep both captures and the build id.

When a finding is about a HUD element or a sound, save it in a local `feel-findings` file (for example `.grokbot-team/artifacts/feel-findings/<pack id>.json`) for HUD Designer (09) or Audio Director (13): one entry per action with the action, device, measured delay, the missing or late cue, the pack id and the capture ids.

Gather evidence for `node engine/lens.mjs <pack.json>`.
