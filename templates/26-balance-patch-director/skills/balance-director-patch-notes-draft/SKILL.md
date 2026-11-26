---
name: balance-director-patch-notes-draft
description: "Use when the owner has picked which proposed balance options to ship and wants player-facing patch notes drafted, with holds and unresolved names kept honest."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-26-balance-patch-director v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Patch notes draft

Draft player-facing notes for the options the owner picked. Holds and unresolved names stay visible, and every change reads as proposed until the owner ships it.

Rubric lines this informs: `patch-notes:1`.

## Steps

1. Input: the same `input.json` and the owner's pick for each requested label (an option or a hold), confirmed in chat. No input file carries the picks yet (a preview gap), so confirm them before drafting.
2. Draft: `node balance/run.mjs input.json --notes > drafts/patch-notes.md`. The tool's notes follow its own recommendation; edit the draft to match the owner's picks and keep every hold and unresolved name.
3. Label the notes DRAFT, describe changes as proposed, and add no dates, prices or long dashes (`notes.draftLabelled`, `notes.datesOrPrices`, `notes.dashes`).
4. Stop: if a pick names a parameter the tool could not resolve, ask the owner which id they mean. The release owner publishes the notes.

## Output

A local DRAFT of the patch notes for the release owner.
