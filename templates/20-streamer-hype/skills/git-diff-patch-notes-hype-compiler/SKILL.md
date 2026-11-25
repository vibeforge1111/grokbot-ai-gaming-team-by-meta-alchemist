---
name: git-diff-patch-notes-hype-compiler
description: "Use when writing patch notes from commits: every line maps to a commit, and every claim matches the code that shipped."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-20-streamer-hype-director v1.4.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Patch notes from commits

Turn the changes between two releases into player-facing notes where every line is true on the build players get.

## Method
1. List the changes between the last release and the shipped commit (for example `git log <last-release-tag>..<shipped-sha>`), or start from a verified change list if your team keeps one.
2. Write one player-facing line per change that matters; each line names its commit (`notes.lines`, `notes.mappedToCommits`). Record one `receipts.shippedClaims` row per line with the claim, the commit, whether its feature switch is on in the shipped build, and a capture from that build.
3. Claims check: for each claim (numbers, new features, fixes, technical promises such as crash recovery or faster loading), confirm the code matches (`claims.claims`, `claims.matchingCode`).
4. Group by what players notice first: fixes to bugs they reported, then balance or tuning, then new content.
5. Never claim a fix that has not been verified on the live build. A feature behind a switch that is off stays out of the notes.
6. Fit the notes to how your game is updated:
   - One release with occasional patches (most single-player games): a short, version-numbered note per patch.
   - Regular updates, or seasons if your game runs them: a headline note per update, with the same commit mapping for every line.
   - Mobile store releases: a very short "what's new" text that fits the store's field, with the longer note on your own site.

## Examples (synthetic)
- Single-player narrative adventure, patch 1.0.2: "Fixed a save that would not load after chapter 3." "Added a subtitle size option." "Puzzle hints in chapter 5 now appear after 3 failed tries instead of 5."
- Mobile puzzle game: "Levels 41 to 60 are here." "Fixed the board not rotating on some tablets."
- Racing game: "Night tracks are brighter on low graphics settings."
- Online game with seasons (only if your game runs them): "Season 3 adds two new maps, and the ranked ladder resets."

## Pitfalls
- Writing notes from commit titles without checking the shipped build.
- Promising features that are behind a switch or not live yet.

## Negative fixture
Add an internal-only commit (a refactor or a secret rename) to a test range and confirm it does not reach player-facing notes. Mark one claimed feature's switch as off and confirm truthful-claims:1 drops to 0.

## Worked example (synthetic)
Synthetic example: 41 commits in the range; 9 player-facing changes confirmed in the shipped build; 3 internal refactors and 1 switched-off feature left out. Report: notes for 9 changes, each linked to its commit and checked in the build, plus the list of what was left out and why.

The notes stay a local draft; only the human posts them.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `streamer-hype-lens-engine`).
