---
name: gameplay-moment-finder
description: "Use when picking moments for a trailer, devlog or short from recorded gameplay: rank candidates from the game's own events and the footage, with a hand-picked fallback when no event fits."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-10-trailer-cut-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Find the moments worth cutting

Pick the moments that show what your game is about, from footage of the build you are grading. The game's own events and the footage drive the pick. Loudness, fast motion or a high score never qualify a moment on their own.

## Method
1. Ask the owner, in one sentence, what a viewer should understand by the end of the cut (for example "every level is one screen of tight jumps" or "your farm changes with the seasons").
2. Collect signals from the same build on one timeline:
   - Game events, if your game logs them: level complete, puzzle solved, new area reached, lap record, story choice, item crafted, objective taken.
   - Footage changes: scene cuts, camera moves, on-screen text, music changes, sound onsets.
   - Hand picks: moments the owner or a reviewer marks while watching.
3. Choose the signals that fit your genre and write them, with how much each counts, into the local edit list before ranking. Examples:
   - 2D platformer: a hard jump landed, a secret found, a checkpoint reached.
   - Mobile puzzle game: the last piece settling, a chain reaction, a board cleared.
   - Turn-based strategy game: a flank that turns a battle, a city founded, an end-of-turn reveal.
   - Racing game: an overtake into the last corner, a photo finish, a new lap record.
   - Narrative adventure: a choice and its visible result, a character's first line, a reveal.
   - Farming or life sim: the first harvest, a change of season, a festival, a house upgrade.
   - 3D arena game: a team objective taken, a comeback, a round won. Combat signals belong here, as one genre among many.
4. Hand-picked fallback: when the game logs no events, or none fit (a cozy or puzzle game often has few spikes), watch the footage at playback size and mark moments by hand. Record who picked each one and why. A hand pick is as valid as a logged event.
5. Add lead-in and recovery time so the viewer can follow cause and effect. Drop candidates that tell the same story twice. Trim copies with FFmpeg or your editor and keep the source timecode in the edit list.
6. Review each candidate at its playback size with sound on and off. Save accepted and rejected time ranges with a reason.
7. Check each shot against the build: it comes from the graded build, and no shot or line implies a feature the build does not have.

## What this fills in the pack
- `shots`: total shots, shots from the graded build (`fromGradedBuild`) and shots named in the pack (`namedInPack`).
- `claims`: claims checked (`claimsChecked`) and claims that imply a feature the build lacks (`unavailableImplied`).
- `edl` (the edit decision list): source clips recorded and `decisionsRecorded`, plus one `receipts.editDecisions` row per approved shot.
- `readable-story:2` stays U until a named reviewer watches the wide cut and records a judgement.

## Negative fixture
Add a loud menu transition with no gameplay to the candidates and confirm it is rejected, because volume alone cannot qualify a clip. Add one shot from an older build and confirm `authentic-gameplay:1` drops.

## Worked examples (synthetic)
- Synthetic example, mobile puzzle game: no event log, so the owner marks 14 moments by hand and 6 survive review, all from the graded build. Report: shots 6 of 6 from the graded build, edit list written, readable-story:2 not measured yet.
- Synthetic example, racing game: the event log offers 40 overtakes and 5 are picked; one shows a car that is not in the build. Report: claims checked 9, unavailableImplied 1, top fix: replace that shot.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for `node engine/lens.mjs <pack.json>`.
