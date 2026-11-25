---
name: prize-ledger-reconcile-and-digest
description: "Use when an owner-prepared claim journal needs replaying, reconciling against the game's entitlement snapshot and turning into a digest of what needs the owner's decision."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-24-prize-refund-ledger v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Reconcile and draft a digest

Replay the journal through the ledger's state machine, compare confirmed grants with the game's own entitlement read, and draft the owner's digest. Nothing is granted, paid or refunded.

Rubric lines this informs: `authority-boundaries:1`, `authority-boundaries:2`, `delivery:1`, `delivery:2`, `reconciliation-and-reporting:1` and `reconciliation-and-reporting:2`.

## Steps

1. Input: `journal.json` prepared by the owner (shape in HOW-TO-USE.md), with `snapshot` read from the game's own entitlement store and `deadlineMs` when a delivery window applies. Approvals in the history carry the `owner` role and a `decisionRef`.
2. Pack: `node ledger/import-claim-ledger.mjs journal.json > pack.json`.
3. Digest: `node ledger/import-claim-ledger.mjs journal.json --digest > drafts/ledger-digest.md`. It lists the rows that need a decision, masked addresses, overdue counts and refunds owed, and ends with "Nothing in this digest was granted, paid or sent by the agent."
4. Grade: `node engine/lens.mjs pack.json`.
5. Stop: if the import throws "Invalid journal transition for row <id>", report that row and its reason to the owner and stop; never edit the journal to make it pass. Without a snapshot, `reconciliation-and-reporting:1` stays U.

## Output

`pack.json`, the local digest draft for the owner and the grade record.
