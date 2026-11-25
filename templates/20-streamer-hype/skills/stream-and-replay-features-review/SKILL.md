---
name: stream-and-replay-features-review
description: "Use when your game has recording, replays, a streamer mode, share links or a spectator view: check each works, hides private information, keeps any required stream delay and cannot change results."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-20-streamer-hype-director v1.4.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Review stream, replay and spectator features

Check the features that creators and viewers touch. Each part applies only if your game has that feature; skip the rest. A missing spectator mode or share links has an approved profile (its lines read N/A); any other missing part leaves its lines unmeasured.

## Which parts apply

| If your game has | Check | Lines |
|---|---|---|
| Recording, replays or clip export | It replays and exports with correct sound and credit, and recording costs little frame time | capture-reliability:1 and 2 |
| A spectator mode, a live watch view or a public feed | Viewers see only what the policy allows, after the required delay, and the view reads at stream resolutions | spectator-comprehension:1 and 2, the `spectator-links` check (if none: `no-spectator-mode` profile) |
| A streamer mode, or names and chat on screen | Names and sensitive details are hidden in captures | creator-controls:1 (if none: `no-streamer-mode` profile) |
| Share links | Each link carries your source tag and opens | creator-controls:2 (if none: `no-share-links` profile) |
| Viewer or creator features (votes, chat commands, rewards for watching) | They cannot change results, saves or rankings | player-safety:1 |

A single-player game with no spectator mode usually still has recording or share links, and may have a streamer mode (hiding the player's account name or swapping licensed music). With the owner's approval before scoring, set `"rubricProfile": ["no-spectator-mode"]` in the game profile and leave the spectator groups out of the pack. The spectator lines then read N/A, never U and never a defect, their 20 points are shared over the other eight lines, the spectator release blockers no longer apply, and the verdict can reach PASS. Say in the report which profiles were used.

## Method
1. Recording and replay: record one complete session, replay it and export it. Check the sound, the attribution (the game name and creator credit, where shown) and that the file opens (`recording`).
2. Capture cost: run the same replay or scene on the same build and device twice, capture off then on. Compare p95 frame time (the time that 95 percent of frames stay under) against `maxCaptureOverheadMs` (`captureCost`, `receipts.capturePairs`).
3. Spectator view, if your game has one: define when a viewer can enter, switch and leave watch mode. In a turn-based game a player may watch other players' turns. In a co-op game a downed player may watch until revived. In a racing game a finished driver may watch the rest of the field. In a competitive game an eliminated player may watch the rest of the match. Record which viewpoints and information a viewer may see.
4. Spectator policy and stream delay, if your game has a spectator or streaming mode: inspect every feed a viewer can open (a public view, a partner feed, a tournament feed) under the approved information policy. Record the observed delay and any restricted fields shown (`spectatorPolicy`, `receipts.partnerFeeds`, `spectatorLinks`). The delay must be at least `minStreamDelayMs`, so a viewer cannot pass live hidden information to a player. A measured delay or disclosure failure blocks release.
5. Readability: watch the spectator view at every resolution in `streamResolutions` (`spectatorRead`).
6. Streamer mode: capture a session with streamer mode on and look for player names, account details, chat, friend lists and other sensitive information (`streamerMode`). Any leak blocks release.
7. Share links: open every share link and confirm it carries the `shareTag` and resolves (`links`).
8. Fairness: replay the same scenario with and without viewer or creator input. Compare results and saves (`fairness`). Include a fixture where a hidden objective is visible to a viewer and confirm the review flags it.
9. Results: every receipt carries measured values, and an unconditional PASS is rejected (`receipts`).

## Negative fixture
Set the delay of a test feed below `minStreamDelayMs` and confirm the release blocker fires. Show a fictional player name in a streamer-mode capture and confirm creator-controls:1 fails.

## Worked examples (synthetic)
- Synthetic example, single-player farming sim with recording and share links but no spectator mode: the recording replays and exports; capture adds 0.6 ms at p95 against a 1.5 ms budget; 4 share links are tagged and resolve; streamer mode hides the save name. With `no-spectator-mode` approved, the report reads: capture-reliability and creator-controls pass; spectator lines N/A because the game has no spectator mode; verdict PASS if the remaining lines are measured at level 3 or more.
- Synthetic example, 3D arena game with a public spectator feed: the partner feed opens with a 300 ms delay against an 800 ms minimum. Report: release blocked by the stream delay; fix the feed delay and recapture.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for `node engine/lens.mjs <pack.json>`.
