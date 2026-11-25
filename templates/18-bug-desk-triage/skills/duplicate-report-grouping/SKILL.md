---
name: duplicate-report-grouping
description: "Use when many crash reports, error logs, player reports or findings from other templates may describe the same bug: propose candidate duplicate groups for the human to confirm, and never merge different root causes automatically."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-18-bug-desk-triage v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Group duplicate reports

Many reports can describe one bug, and one vague report can hide two bugs. This skill proposes groups. Only the human merges, after reviewing a local candidate draft.

Rubric lines this feeds: `correct-dedup:1` and `correct-dedup:2`. Growth checks (reported beside the grade, never scored): `crash-intake`, and `share-link-intake` only if your game has share, invite or referral links.

## Words used here

- **Dedup key:** what makes two reports the same bug: root cause area, reproduction signature and build id.
- **Reproduction signature:** a short label for how the bug shows up when replayed, for example `save-in-shop > empty-inventory-slot`.
- **Candidate pair:** two reports that a similarity measure says might be the same bug. A candidate is a suggestion, never a merge.
- **Other templates:** every template in the kit (HUD, Audio, Access and so on) drafts its own findings. The same bug can arrive from several of them.

## Method

1. Normalize each report. For crash reports and error logs: strip memory addresses, line numbers that shift between builds, player ids and timestamps; keep the top stack frames and the error type. For player reports and findings from other templates: keep the build, the screen or level, the player's action and the visible symptom.
2. Propose candidates. Compare the normalized reports with any similarity method (splitting the text into short overlapping chunks and comparing them with MinHash is one common choice; plain text distance works for a small queue). Tune the cutoff on past reports you have already labelled. The cutoff only proposes pairs.
3. Review. Draft the evidence for each candidate pair locally: both signatures, both builds, and a replay of each when one exists. Count the pairs that are really different bugs (`dedup.distinctPairs`) and how many of them stayed separate (`dedup.distinctPairsKeptSeparate`). Count the confirmed same-root pairs (`dedup.sameRoot`) and how many the human merged (`dedup.sameRootMerged`). Record every candidate pair in `dedup.pairs` with `sameRoot` and `autoMerged`. Any pair merged by a script without a human counts against the line.
4. Crash intake. Every crash report carries the build id it came from and is triaged inside the window your team agreed: `crashIntake.received`, `crashIntake.withBuildSha`, `crashIntake.triagedInWindow`.
5. Share, invite and referral links (only if your game has them). A report about a broken link carries a sample of the failing link and reaches the person who owns those links, often whoever runs marketing or growth: `shareIntake.reports`, `shareIntake.withLinkSample`, `shareIntake.routedToLinkOwner`. If your game has no such links, leave `shareIntake` out of the pack. The check then reads U and never changes the grade.

## Examples (illustrative)

- 2D platformer: three players say "the jump is broken". Replays show two causes: a late jump just after leaving a ledge, and a collision seam on one tile. Two groups, not one.
- Farming or life sim: two crashes share the top frame in the save writer. One comes from saving in the shop, one from saving during a festival. Same frame, different callers: keep them separate until a replay shows one root cause.
- Turn-based strategy: the Audio and HUD templates both draft a finding about the same missing end-of-turn cue. One root cause from two templates: propose one merge for the human to confirm.
- Mobile puzzle: "board freezes" reports from two phone models with the same signature on the same build. A likely duplicate; confirm with one replay on each phone.

## Negative fixture

Feed two reports with near-identical stacks but different root causes; the gate must keep them apart. A good control pair: two failures with the same visible symptom and different replay signatures, one when loading a save and one when resuming from pause. They stay separate candidates until a human verifies a common root cause.

## Pitfalls

- Grouping by the top stack frame only, which merges unrelated crashes in shared helpers.
- Dropping the build id, so fixed and still-live crashes mix.
- Treating the similarity cutoff as a decision. It only makes a list for the human.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `bug-desk-triage-lens-engine`).
