---
name: creator-shortlist-scout
description: "Use when shortlisting streamers and creators to contact: fit with the game, audience, safety and a clear reason, without inventing audience numbers, with outreach kept as local drafts."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-20-streamer-hype-director v1.4.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Creator shortlist

Find creators whose viewers would enjoy your game, record why, and draft outreach for the owner to send. This works the same for a single-player game, a co-op game or a competitive one.

## Method
1. Fit: the creator already plays games like yours, on the platforms you support. Note two recent videos or streams as evidence. Examples of fit:
   - Single-player narrative or horror game: creators who play story games start to finish with commentary.
   - Farming or life sim: creators with long, relaxed sessions and returning viewers.
   - Turn-based strategy game: creators who run long campaign series and explain their moves.
   - Mobile puzzle game: short-video creators who post daily puzzle clips.
   - Racing game: creators who post time trials or car setups.
   - Competitive multiplayer game: creators who already stream the genre with friends or viewers.
2. Audience: record numbers only from a source you opened this run, with the date. Save the source link locally. If access fails, mark the check NOT_RUN and leave the number blank.
3. Safety: check recent content against your brand and age rules.
4. Reason: one sentence on why this creator and what you would offer, for example a key, early access to an update, or the press kit from template 19.
5. Outreach: draft one short, honest message per creator for the owner to approve and send. Never contact anyone automatically. If the offer is paid or includes a free key, the draft asks the creator to disclose it as their platform requires.
6. Keep a local source log per shortlist decision with the observation date, two source references, the review role and the reason. Leave inaccessible numbers blank and mark the observation NOT_RUN.

## Example outreach draft (synthetic)
"Hi <creator name>, I make <game name>, a single-player <genre> about <one line>. Your <series name> series is why I am writing: <one specific reason>. I would like to offer you a key and our press kit (<link>). No deadline and no obligation. If you play it on stream, please mention that the key was free."

The owner edits and sends it. The agent never sends.

## What this fills in the pack
- `creatorLog` for the `creator-sources` growth check: one entry per shortlist decision with `observedOn`, `sourceRef`, `reason`, `sourceOpened` and `reviewed`. The creator log supports the draft shortlist and earns no grade points.

## Pitfalls
- Follower counts are not reach; prefer recent average views when they are visible.
- Ranking by size alone; a small creator who plays your genre often reaches more of the right players.

## Negative fixture
Add a creator with no opened source for their numbers and confirm the shortlist check marks the entry unmeasured.

## Worked example (synthetic)
Synthetic example, single-player puzzle adventure: 12 candidates found; 7 have two recent videos of story or puzzle games; numbers were visible for 5 (opened this run, dated); 1 fails the brand check. Report: shortlist of 6 with reasons, 1 dropped for safety, numbers marked unmeasured where not visible, outreach drafts waiting for the owner.

Tell the owner what the shortlist covers and what stays unmeasured.

Gather evidence for: `node engine/lens.mjs <pack.json>` (see `streamer-hype-lens-engine`).
