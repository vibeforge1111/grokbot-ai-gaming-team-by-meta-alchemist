---
name: input-navigation-and-device-switch-audit
description: "Use when checking that players can finish the game's required tasks with every supported input (for example touch, gamepad, or keyboard and mouse), and that remapping, button prompts, controller disconnects and menu focus all recover."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-21-access-input-localization v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Test input and navigation

Rubric lines this feeds: `input:1` (required tasks across supported inputs) and `input:2` (remapping, prompts and device switching).

## 1. Build the task matrix

Take the supported input devices from `profile.devices` and the required tasks from `profile.journeyTasks`. Every device must complete every task. Name the tasks after your own game. Examples (illustrative):

- Mobile puzzle game: `title-screen`, `select-level`, `swap-tiles`, `undo-move`, `pause-menu`.
- 2D platformer: `title-screen`, `jump-and-run`, `restart-checkpoint`, `remap-controls`, `pause-menu`.
- Turn-based strategy game: `main-menu`, `select-unit`, `issue-order`, `end-turn`, `save-game`.
- Racing game: `garage-menu`, `drive-a-lap`, `pause-menu`, `restart-race`.
- Narrative adventure: `title-screen`, `pick-dialogue-choice`, `open-journal`, `save-and-load`.

The worked example uses `title-screen`, `core-play`, `results` and `play-again` from one synthetic online game. Replace them with your own tasks.

## 2. Run the journey on real hardware

Test the complete journey with each supported input, from the first screen to saving or seeing results. Record the device, task, build id and capture for each result, then fill:

- `journey.devicesPassed`: devices that completed every task.
- `journey.tasksPassed`: tasks completed on every device.
- `journey.passedByDevice`: one `{ "device": ..., "task": ... }` pair per successful observation.

## 3. Remapping, prompts and recovery

Where the game supports them, check that:

- controls can be remapped (`remap.remapWorks`);
- on-screen button prompts change to match the device in use (`remap.promptsSwitch`);
- unplugging a controller pauses or recovers safely (`remap.disconnectRecovers`);
- after a dialog closes, the selection highlight (focus) returns to a sensible place (`remap.focusRecovers`).

Set `remap.measuredCases` to the number of checks you ran. For each approved device and task pair in `profile.cases.navigationRecovery`, record a row in `receipts.navigationRecovery` with `device`, `task`, `remapped`, `recovered` and `focusRestored`. For a device switch, confirm the player can carry on with the same task on the new input.

If your game supports only one input method (for example a touch-only phone game with nothing to remap and no controller to disconnect), never record it as passed. Ask the owner to approve the `single-input` profile before scoring (`"rubricProfile": ["single-input"]`, or with `single-language`). `input:2` then reads N/A, never U and never a defect, and `input:1` is worth 20 points; leave `remap` out. If the game has several inputs but one part is missing (for example no controller to disconnect), no profile covers it: leave that check out so `input:2` stays U, and write the reason next to the profile approval.

## Negative fixture

Remove one device and task pair from `journey.passedByDevice`. `input:1` must drop below level 3.

## Pitfalls

- Testing touch with a mouse in a desktop browser and then claiming touch support.
- Checking only the first screen; the journey runs from start to save or results.
- A support claim without a capture. An uncaptured required task stays unmeasured.

Draft a local ticket for a confirmed problem with the shared ledger key (see `file-to-shared-ledger`).

Gather evidence for `node engine/lens.mjs <pack.json>`.

Record skipped capture or execution as NOT_RUN.
