---
name: file-to-shared-ledger
description: "Use when turning a confirmed save, recovery, payment, privacy or service finding into a local ticket draft, or a proposed change to an existing ticket, for the human to review and file in their tracker."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-22-live-service-trust v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Draft a finding

The shared ledger is your team's issue tracker or shared findings list. This skill only prepares a local draft for it; the human reviews and files.

Use the project's issue identifier and severity policy. Match on root cause, reproduction signature and build. When an existing ticket covers the same failure, ask the owner to confirm the match, then include the template ID and artifact IDs in a local change draft.

For a new local issue draft, record expected and observed behaviour, severity, confidence, build, pack ID and evidence. Use the fields in the kit's shared ledger example or map them to your tracker. Record who fixed and who independently verified a closed issue.

A mistake in an earlier grade or capture (not in the game) goes in the audit corrections list, a separate local list of corrections to past grades. Derive counts from the tracker export (`tracker-export`), never from memory.

If you also use Bug Desk (template 18), give it these drafts. It groups the same bug when several templates report it.

Gather evidence for `node engine/lens.mjs <pack.json>`.

Record skipped capture or execution as NOT_RUN.
