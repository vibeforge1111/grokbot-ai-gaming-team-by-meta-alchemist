---
name: beat-sync-and-secret-redaction-gate
description: "Use when timing a cut to its music or voice and checking every final export for sensitive or unlicensed material, captions and loudness before the human hands it on."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-10-trailer-cut-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Time the cut and review every final export

Fit the edit to its rhythm, then check every final file for anything that must not ship: private names, sensitive information, unlicensed sound, wrong captions or wrong loudness.

## Method
1. Mark beats, visible action and dialogue on the timeline. Move a cut to a beat only when the player's action and its result stay clear.
2. Take the loudness, true-peak and caption targets from the profile (`targetLufs`, `lufsTolerance`, `maxTruePeakDb`, `minCaptionMatch`). LUFS is the standard loudness unit; many video sites play back near -14 LUFS, but that is an example, not a default. The true peak on the decoded file must be at or below `maxTruePeakDb` in dBTP; the worked example uses -1.
3. Review the actual export frame by frame around transitions. Check each channel in `profile.reviewChannels`: picture, audio, captions, title, filename and embedded metadata.
4. Look for what your game can leak. Examples:
   - Online games, if your game shows them: player names, chat, friend lists, invite codes.
   - Single-player games: desktop notifications on the capture machine, save slots named after real people, debug overlays, unreleased levels.
   - Any game: a recording with unlicensed music, a test build watermark, an internal ticket id in a title card.
5. Replace or mask sensitive material in the source sequence and export again. Recheck the final encoded file after any edit.
6. Planted-label test: put a visibly fictional label (for example "TEST NAME 01") in a test overlay. Confirm the review catches it and that the clean export removes it from every frame of the shot. This proves the review works. Keep its record with the export.
7. Captions: match every speech cue to the decoded caption track by id and time. If the cut has no speech, caption the key sounds and the on-screen text the viewer needs. If there is nothing to caption, leave accessible-delivery:1 unmeasured and say why.
8. Sound: measure integrated loudness and true peak on the decoded file (an EBU R128 pass in FFmpeg or your editor), never on the project timeline.
9. List every delivery file, video and audio stream, caption track and metadata field. Record total frames and frames inspected per cut.

Record timecodes or file locations for hits without copying the sensitive text. A missing scan, incomplete coverage or a confirmed hit keeps the file out of the handoff draft. Leave the human a local draft only when every final export passes review.

## What this fills in the pack
- `redaction`: frames scanned, total frames and names visible unredacted, plus one `receipts.finalReview` row per cut and channel.
- `captions`: matched and total cues, plus one `receipts.captionAlignment` row per cue.
- `sound`: checked on the decoded file, integrated LUFS and true peak.

## Negative fixture
Leave the planted label in one frame of one cut and confirm composition:2 fails. Raise the master by 6 dB and confirm the sound check fails.

## Worked example (synthetic)
Synthetic example, narrative adventure: two cuts of 1,800 frames each, every frame scanned; 1 hit, a save slot showing a tester's real first name. Report: composition:2 at 0 until the shot is masked and rescanned; captions 24 of 24 cues matched; loudness inside the profile's tolerance.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for `node engine/lens.mjs <pack.json>`.
