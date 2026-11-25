---
name: issue-draft-and-fix-verification
description: "Use when writing a reproducible bug report as a local draft for any tracker, recording which build players actually run, and checking that a fix was verified on the right build by someone other than the fixer before it closes."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-18-bug-desk-triage v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Draft an issue and verify the fix

This works with any tracker: GitHub, GitLab, Jira, a spreadsheet or a plain text file. You write the draft locally. Only the human files it.

Rubric lines this feeds: `closure-quality:1`, `closure-quality:2` and `evidence-completeness:2`.

## 1. Draft the issue

Record the affected build, platform, settings, starting state and the expected player-facing outcome. Include a seed or save file only if it affects reproduction. Examples (illustrative):

- Mobile puzzle: the board state and the tap sequence.
- 2D platformer collision: the level file and the controller input trace.
- Turn-based strategy: the save from the turn before and the orders given.
- Farming or life sim: the save slot, the in-game day and the screen where it happened.

Replay on the affected build and record successes out of attempts. Remove unrelated steps while keeping the same visible failure (see `minimal-repro-builder`). Link the smallest cleaned capture, its build id, and the evidence that shows this is a new issue rather than an existing one (see `duplicate-report-grouping`). Keep player data (names, accounts, emails, chat) out of the draft. Record severity and confidence separately (see `severity-and-regression-bisect`). Leave the draft locally for the human to review and file.

Use the fields of the kit's shared ledger example (`shared/ledger/tickets.example.json`) or map them to your own tracker.

## 2. Record which build players run

- `gitSha` is the source revision you are reviewing. `liveSha` is the build players actually run: the deployed web build, the store build or the build sent to testers.
- If the live build is older than the source (it is "behind"), findings taken from the live build describe older code. Record that you checked (`liveBehind.recorded`, with a positive `liveBehind.measuredCases`) and mark any score graded from the live build's runtime console or logs as capped until the live build catches up. The rubric line name "Build lag recorded and applied" means exactly this.
- Read both ids from a read-only history export (for example the output of `git log` saved to a file) and record one row in `receipts.buildLag`: `source` (the gitSha), `live` (the liveSha), `sourceHistory` (the ids from the live build up to the source, oldest first), `capped` (true when live is behind) and `historyArtifact` (the export's artifact id). If the two ids are not in one history, the line stays U.

## 3. Verify the fix before closure

- Write an acceptance check for the fixed build: the replay plus the expected result.
- Someone other than the fixer runs it. Record `closure.closures`, one row per closed ticket with `ticket`, `fixer`, `verifier` and `rawArtifacts` (true when the capture, trace or log of the passing run is kept).
- Check the fix on the build under review. Record `receipts.closureReview` rows with `ticket`, `fixer`, `verifier`, `fixedBuild` (must equal the pack's liveSha), `replay` (trace artifact id), `acceptance` and `passed`.
- A capture or fixture from the wrong build, or an artifact that does not match the claim, blocks closure. `mismatch.mismatchClosuresAllowed` counts closures that went through anyway and must be 0.

## 4. Intake and closure lists

Take the intake and closure case ids from a dated read-only export of your tracker. Keep the export and its row count in `populations.intakeReplay` and `populations.closureReview`. A verified empty queue has zero cases and gives no replay or closure credit (U). An unavailable export is NOT_RUN.

## Negative fixture

Set the verifier equal to the fixer on one closure row. `closure-quality:1` must drop to level 1.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `bug-desk-triage-lens-engine`).
