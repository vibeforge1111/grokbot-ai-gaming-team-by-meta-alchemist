---
name: prize-ledger-public-note-draft
description: "Use when players need a short status note about a prize, giveaway or refund program, written from aggregate counts only and left as a local draft for the owner."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-24-prize-refund-ledger v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Draft a public note

Write a short public status note from the digest's aggregate counts. Individual cases, keys, addresses and amounts stay out.

Rubric lines: none directly; it drafts from the digest that `reconciliation-and-reporting:2` reads.

## Steps

1. Input: the latest digest (`node ledger/import-claim-ledger.mjs journal.json --digest`) and the owner's approved wording or tone notes.
2. Use aggregate counts only: delivered, awaiting confirmation, refunds owed and the delivery window. Leave out individual cases, subject keys, addresses, amounts and handles.
3. Save the note locally (for example `drafts/public-note.md`) and label it DRAFT. Promise no date unless the owner gave one.
4. Stop: if the digest is older than the latest journal, rebuild it first. The owner reviews and posts the note.

## Output

One local DRAFT note for the owner to review and post.
