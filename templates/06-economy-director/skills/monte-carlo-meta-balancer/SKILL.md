---
name: monte-carlo-meta-balancer
description: "Run many seeded simulations (Monte Carlo) of player choices to measure how long progress takes, whether one choice dominates the rest (the meta) and how a proposed balance change shifts outcomes, with the uncertainty stated."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-06-game-economy-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Simulate player choices and balance changes

Monte Carlo simulation means running the same scenario many times with different random seeds and looking at the spread of results, not one lucky or unlucky run. The "meta" is the set of choices players settle on as the strongest. This skill checks whether a balance change keeps several choices worth picking and how long progress really takes.

## Method

1. Define the choices, the outcome you measure and a realistic mix of player behaviour. Version the rules, seeds and behaviour weights with the experiment.
2. Run the current rules and the proposed rules on the same seeds, so each pair of runs differs only in the change. Use enough runs for the precision you need.
3. For each choice, report the number of runs, completions divided by attempts, the spread of completion times (percentiles) and a range (interval) around each estimate. A choice nobody tried has no success rate; say so.
4. For choice diversity, compute normalized entropy from the observed choice shares when at least two choices exist: 1 means players spread evenly, near 0 means one choice dominates.
5. Check strong combinations on their own. If a choice is only dominant with a partner, rerun without the partner and report both results.
6. Change one parameter at a time, repeat the paired run and compare with the design target. Include a deliberately overpowered choice as a negative fixture to prove the comparison can detect it.
7. Hand the proposal and its uncertainty to the owner as a local draft change list. The owner decides.

## Short examples (synthetic, for illustration only)

- Farming or life sim: which crop to plant each in-game season, and how many days until the barn upgrade for a player who plays 20 minutes a day.
- Turn-based strategy game: opening build orders; one order winning most games against every mix of opponents is a dominance finding.
- Card game: deck archetypes; a buffed card that pushes one archetype from a third of games to most games.
- Racing game: car and tuning choices per track; median lap time per choice with its range.
- Mobile puzzle game with boosters: levels cleared per booster, and how many attempts a player who never buys anything needs on the hardest level.

## What it feeds in the pack

- `progression:1`: for each approved case in `profile.cases.simulationRun`, one row in `receipts.simulationRun` with the player group, seed, horizon, repetitions, config, and `lowDays`, `estimateDays` and `highDays`. The estimate must sit between low and high and within the profile's `maxProgressStepDays`.
- `reward-fairness:2` (only if your game sells something): simulate a player who never pays next to a paying player. Set `freeVsPaid.assumptionsStated` to true once the assumptions are written down, and record `freeVsPaid.freeItemsPerPeriod` and `freeVsPaid.paidItemsPerPeriod` (a season here is any fixed period your game uses, such as a week or an update). The free share must reach the profile's `minFreeShareOfPaid`. A game with no store leaves this group out; with the owner's approval it selects the `no-store` profile and the line reads N/A, not U.

Choice diversity and dominant strategies are not scored lines. Put them in the proposed change list beside the grade.

Gather evidence for `node engine/lens.mjs <pack.json>`.
