---
name: minimal-repro-builder
description: "Use when turning a crash, desync or player report into a replay that fails on the affected build, shrinking it to the smallest input that still fails, checking that captures show real play, and deciding when a flaky bug may leave flaky status."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-18-bug-desk-triage v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Build a minimal repro

A repro (reproduction) is a recorded set of steps or inputs that makes the bug happen again on the same build. A minimal repro is the shortest one that still fails. A desync is when two copies of the game (two players, or a client and a server) disagree about the game state.

Rubric lines this feeds: `reproducibility:1`, `reproducibility:2` and `evidence-completeness:1`.

## Method

1. Record recent play. Keep a rolling buffer of the last stretch of play: the random seed, the player inputs and the key game state, plus server messages if the game has a server. Choose the length to suit the game's update or turn rate. Examples (illustrative): a racing game keeps the last few seconds of inputs at its fixed update rate; a turn-based strategy game keeps the last few turns and the seed; a narrative adventure keeps the choice log and the save slot; a mobile puzzle game keeps the board state and the tap sequence.
2. Save on failure. On a crash or desync, save the buffer with the build id. Agree on a time and attempt budget with the owner first. Record attempts, successful reproductions and elapsed time on the same build. If the replay could not run, record NOT_RUN.
3. Shrink. Remove half of the input stream and keep the cut if the bug still happens; repeat with smaller pieces (this is called delta debugging). Stop when removing any single step makes the bug go away.
4. Flaky bugs. A flaky bug happens on some runs and not others. It keeps flaky status until it passes the number of clean repeated runs set in your profile (`profile.flakyRunsRequired`). Record `flaky.flakyReports`, `flaky.criterionRuns` (the runs actually done) and `flaky.fixedBelowCriterion` (reports called fixed before the criterion was met; this must be 0).
5. High-priority reports. Every high-priority report needs a working replay: one row per ticket in `repro.highPriority` with `id` and `replayed`. Take the ticket list from a dated read-only export of your tracker. Record one row per approved case in `receipts.intakeReplay` with `ticket`, `signature`, `attempts`, `reproduced`, `rewind` (the trace artifact id of the replay) and `acceptance` (what a passing replay shows).
6. Captures of real play. A finding about play needs a capture of the play itself, not only a menu or a loading screen. The pack counts these as `captures.playFindings` (findings that claim something about a play session) and `captures.playFindingsWithActionCapture` (how many of them have a capture of the actual action). Here "match" means one play session of any kind: a level, a run, a race, a puzzle board, a story chapter or a round.

## Negative fixture

Remove the input that triggers the bug from a recorded repro and confirm the replay no longer reproduces it, so the check fails.

## Pitfalls

- A replay on a different build is not a repro. Record the build id.
- A capture of the title screen or a loading bar does not show the bug. Capture the action.
- Calling a flaky bug fixed after one clean run.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `bug-desk-triage-lens-engine`).
