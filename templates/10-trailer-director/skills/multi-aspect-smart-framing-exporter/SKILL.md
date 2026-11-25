---
name: multi-aspect-smart-framing-exporter
description: "Use when reframing gameplay for each approved delivery format (wide, vertical, square or feed) so the subject, essential UI and captions stay visible, then exporting and decoding every cut."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-10-trailer-cut-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Reframe and export every delivery cut

Turn one edit into each format the owner approved, keep what matters in frame, then export and decode every cut.

## Formats: one list, owned by the profile
The profile's `deliveryCuts` list is the only promise of formats. Each cut in it needs a matching `profile.cases.decodedCuts` entry (width, height, frame rate, codec). Offer a format only after the owner adds it to both. Common shapes, as examples:
- Wide 16:9: trailers, store pages, video sites.
- Vertical 9:16: short-video apps and phone stories.
- Square 1:1 or portrait 4:5: social feeds.

The reference rubric reads two of them. `readable-story:2` is judged on the wide cut. `composition:1` checks one cropped cut, named in `cropFraming.cut`. The group name says 9:16, but any approved crop works, for example a 1:1 or 4:5 cut.

## Method
1. For each cut, write down its aspect ratio, resolution, safe areas (the parts of the frame that a platform's buttons or captions cover) and caption position.
2. For each shot, mark the subject and the UI the viewer needs. Examples:
   - 2D platformer: the character and the next platform. A damped tracking centre (a crop that follows smoothly, without jitter) usually works.
   - Turn-based strategy game: the map is too wide for a vertical crop. Use a designed layout instead, such as the map on top and the unit card below.
   - Narrative adventure: the dialogue box and the speaker's face both stay in.
   - Racing game: the car, the next corner and the position or lap counter.
   - Mobile puzzle game: the whole board. A portrait game may need letterboxing (bars at the sides) in the wide cut instead of a crop.
3. Keyframe the crop or use a damped tracking centre, with bounds that keep the essential information visible. Never stretch game footage.
4. Inspect entrance and exit frames, fast subject changes and static UI. When a crop loses the action, pick another shot, a designed layout or letterboxing.
5. If your game shows no HUD, read `hudContextKept` as "the essential on-screen information survives the crop" (a score, a timer, dialogue text). If there is none at all, say so in the framing artifact and let the reviewer confirm it.
6. Export at the intended sizes and watch at normal playback size. Keep side-by-side samples and the source timestamps.
7. In a disposable export job, interrupt one render, then resume or restart it. Decode every requested cut with a separate decoder (ffprobe or similar). Record the interruption, final length, audio sync and corrupted outputs. If no decoder is available, mark the step NOT_RUN.
8. Music rights: link the track-by-track rights record in the `rights` field. If the cut has no music, attach the reviewed no-music decision and the final audio stream list instead.

## What this fills in the pack
- `cropFraming`: shots in the approved crop (`shots`), shots that keep an action point (`shotsWithActionPoint`), `hudContextKept`, and `cut` (a name from `deliveryCuts`).
- `exports`: rendered, length in seconds, independent decode and audio sync in ms, plus one `receipts.decodedCuts` row per cut.
- `recovery`: interruptions injected and corrupted outputs.
- `licensing` (growth check, not scored): licensed tracks against all tracks.

## Negative fixture
Place the subject at the edge of the frame in a test shot and confirm the crop check flags it. Export one cut at the wrong size and confirm its `decodedCuts` case fails.

## Worked example (synthetic)
Synthetic example, farming sim with `deliveryCuts` wide and square: 14 square shots, 13 keep the action point and 1 cuts off the shop sign the shot is about. One render was interrupted and restarted with 0 corrupted outputs, and both cuts decode at the approved sizes. Report: composition:1 below pass until that shot is reframed; technical-export:1 and technical-export:2 pass.

Tell the owner which lines this moved and which stay unmeasured.

Gather evidence for `node engine/lens.mjs <pack.json>`.
