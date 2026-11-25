---
name: before-after-feel-proof
description: "Compare the same player action before and after a feedback change and record both timing and perception."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-01-game-feel v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Capture a comparable pair

A before and after comparison is only fair when everything except the feedback change stays the same. Fix the build, input sequence, device, camera and scenario. Either use an effects switch on one build, or record the revision of each build. Capture the input, the moment the action takes effect and the first player-facing cue on one clock.

Examples of a fair pair:

- **2D platformer:** the same recorded jump sequence on the same level, before and after a new landing sound.
- **Mobile puzzle game:** the same seeded board and the same swaps, before and after a new snap vibration.
- **Racing game:** the same replayed lap on the same car and track, before and after a new impact shake.
- **Narrative adventure:** the same dialogue path from the same save, before and after a new choice highlight.

| Evidence | What to record |
|---|---|
| Responsiveness | Input-to-cue times, the sample count and the device |
| Readability | Matched clips at playback size and what the reviewer saw |
| Gameplay parity | Final state or replay hash for the same inputs |
| Performance | Frame-time distribution and the peak number of effects at once |
| Accessibility | The same sequence with the game's reduced-motion or sound alternatives on |

Keep the raw ids of both clips. In a test copy, delay one cue on purpose and confirm that the timing comparison shows the change.

## Receipt rows this skill fills

A receipt is one row per approved test case with the measured values (see `node engine/lens.mjs --meta` for the fields).

- `pairedTiming` (`parity:1`): one row per replay pair. Use the replay id as the run key on both sides, keep both trace files, and compare tick counts before comparing the game state hashes.
- `readyEmissions` (`readable-feedback:2`): one row per traced ready event, naming the code that emitted the cue and its source line in the measured build.

Gather evidence for `node engine/lens.mjs <pack.json>`.
