---
name: readability-and-caption-evidence
description: "Use when measuring text size and contrast over real game scenes, checking that meaning survives without colour, matching every required sound to an on-time caption, and checking that menus and error messages are usable."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-21-access-input-localization v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Check readability and captions

Rubric lines this feeds: `readability:1`, `readability:2`, `captions-and-assistive-info:1` and `captions-and-assistive-info:2`.

## 1. Text size and contrast over real scenes

Capture the smallest text and the lowest-contrast states on every viewport in the profile, including text over moving or busy scenes. Measure the rendered frame; a contrast value read from a style sheet alone does not count. Record `text.minPx` (the smallest rendered text height in pixels) and `text.pairs` (the foreground and background colour pairs you captured). The engine compares them with `profile.minTextPx` and `profile.minContrast`.

Examples (illustrative): a racing game's lap counter over a bright sky, a farming sim's crop tooltip over grass, a strategy game's unit health numbers over terrain, a puzzle game's score over animated tiles.

## 2. Meaning without colour

Review controls and important states with colour removed, or with simulated colour-vision differences. Record `colour.palette` (the colours that carry meaning) and `colour.shapeOrLabelBacked` (true when every colour-coded meaning also has a shape, label, pattern or sound). The engine checks how far apart the palette colours stay under colour-vision simulation, as a colour difference score (delta E), against `profile.minCvdDeltaE`.

Examples (illustrative): team colours in an arena game also get distinct shapes; gem colours in a puzzle game also get symbols; red and green zones on a strategy map also get icons.

## 3. Captions, event by event

List every sound that carries information the player needs (`captions.requiredCues`): spoken lines, warnings, a hazard approaching off screen, a timer running out. Match each one to a visible caption or a documented equivalent at the same playback time (`captions.captionedCues`). For each approved case in `profile.cases.cueMatches`, record a row in `receipts.cueMatches` with `event`, `caption`, `eventMs` and `captionMs`. The engine checks that the caption is the right one and that the delay is within `profile.maxCaptionOffsetMs`.

If no sound in your game carries information the player needs, record that decision with the profile approval. With zero required cues the line reads U, never a pass.

## 4. Menus and error messages

Use every menu with each supported input, and read each error message: does it say what went wrong and what to do next? Record `menus.navigableWithSupportedInputs`, `menus.errorsUnderstandable` and `menus.measuredCases`. The first field is named for keyboard and gamepad. If your game supports neither (for example a touch-only phone game), leave `menus` out so the line stays U, and write the reason next to the profile approval.

Record missing evidence locally as a capture task.

## Negative fixture

Swap one caption so it no longer matches its event. `captions-and-assistive-info:1` must drop to level 0.

## Pitfalls

- Measuring text in an empty test scene instead of over the busiest real scene.
- Counting a caption that appears long after the sound it describes.
- Calling red and green "fine" because the shapes differ slightly; check the simulated view.

Gather evidence for `node engine/lens.mjs <pack.json>`.

Record skipped capture or execution as NOT_RUN.
