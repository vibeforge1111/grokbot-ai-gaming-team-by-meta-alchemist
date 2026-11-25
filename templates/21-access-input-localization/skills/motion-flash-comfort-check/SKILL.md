---
name: motion-flash-comfort-check
description: "Use when checking reduced motion, camera shake, flash safety (a release blocker) and hold or toggle alternatives with paired captures from the evidence pack."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-21-access-input-localization v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

# Motion, flash and comfort

Created by @meta_alchemist (https://x.com/meta_alchemist). Rubric pillar: Motion and flash comfort.

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Rubric lines this feeds: `motion-and-flash-comfort:1` (reduced motion respected everywhere) and `motion-and-flash-comfort:2` (flash safety and hold or toggle alternatives).

## 1. Reduced motion, in paired captures

A paired capture is two recordings of the same scenario on the same device with the same camera: one with reduced motion off and one with it on. Every reduction the game promises (screen shake, flashes, zoom, camera sway, screen effects) must visibly change.

- Record `motion.promisedReductions` and `motion.appliedInPairedCaptures`.
- For each approved case in `profile.cases.motionPairs` (one per device and per scenario in `profile.motionScenarios`), record a row in `receipts.motionPairs` with `scenario`, `normalDevice`, `reducedDevice`, `normalScenario`, `reducedArtifact`, `normalAmplitude` and `reducedAmplitude`. The engine compares the reduced amplitude with the case's `maxAmplitude`.
- Examples (illustrative): camera shake on a hard landing in a platformer, a camera pan across the map in a strategy game, speed lines in a racing game, a full-screen hit flash in an arena game.
- If your game promises no motion reductions, the line has no population and reads U. That is honest; do not invent reductions to measure.

## 2. Flash safety (release blocker)

Count luminance flashes per second in the brightest and busiest captured sequences: level complete screens, explosions, lightning, menu transitions. Record the capture id, frame rate, tested interval, counted flashes and the peak count in any one-second window as `flash.maxFlashesPerSecond`, with a positive `flash.measuredCases`.

- The limit is `profile.maxFlashesPerSecond`, taken from the safety guideline the owner follows. Many broadcast and platform guidelines use three flashes in any one second; that number is an example, never a default.
- Flashing above the limit is a release blocker under every profile, including single-language: the verdict becomes BLOCKED and the grade 0. Draft a local P1 ticket citing the capture for human review.
- Missing flash evidence keeps the verdict below PASS. A game with few effects still captures its brightest scenes and records the measured count.

## 3. Hold and toggle alternatives

Every action that needs a button or touch held down also needs a toggle or another way to do it. Record `flash.holdToggleAlternatives`. If the game has no hold actions at all, record true only with a capture of the full control list showing none.

Record requested hold or toggle exceptions and the owner's reason separately. Under the current rubric a measured missing alternative still fails that criterion. Only a newly approved, versioned scoring rule can change this result.

Level 4 needs all of the above on the supported devices, repeated across the pack's runs.

## Negative fixture

Set `flash.maxFlashesPerSecond` above `profile.maxFlashesPerSecond`. The verdict must become BLOCKED with grade 0.

## Pitfalls

- Testing reduced motion on one device and assuming the rest.
- Counting flashes in a calm scene instead of the busiest one.
- Treating an owner's exception as a pass.

Record skipped capture or execution as NOT_RUN.
