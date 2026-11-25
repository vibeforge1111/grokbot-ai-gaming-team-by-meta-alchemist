---
name: support-desk-kb-approval-batch
description: "Use when knowledge base entries were added or edited and the reviewer needs to see which ones need a fresh approval before drafts may reuse them."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-23-support-moderation-desk v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Knowledge review

Check every knowledge entry's revision against the reviewer's approved list. An edit to the question, answer or source needs a fresh human review, and purchase, moderation and safety answers are never reused automatically.

Rubric lines this informs: `answers:1` and `answers:2`.

## Steps

1. Input: the knowledge base file (`kb.json`, a list of `{ question, answer, source }`) and the reviewer's approved revision list (`approved.json`, a list of revision digests).
2. Check each entry: `node --input-type=module -e 'import fs from "node:fs"; import { revision } from "./support/drafts.mjs"; const ok = new Set(JSON.parse(fs.readFileSync("approved.json", "utf8"))); for (const [i, e] of JSON.parse(fs.readFileSync("kb.json", "utf8")).entries()) { const r = revision(e); console.log(i, r === null ? "REFUSED" : ok.has(r) ? "APPROVED" : "NEEDS_REVIEW"); }'`
3. REFUSED means a field is missing or looks sensitive (an email, a link, a long number, a key or an address pattern): draft a fix for the reviewer. NEEDS_REVIEW means the entry is new or was edited since its approval.
4. Draft the approval request locally: entry number, question, source and status. Approve nothing yourself.
5. For the pack: `kb.entries`, `kb.entriesGuardPass` (entries not refused), `kb.approved`, `kb.approvedShare`, `kb.editResetsApproval` (true when an edited entry lost its approval in this check) and `kb.purchaseRepliesWithoutReview` (purchase replies that skipped human review, must be 0). Cite the KB file as a static artifact and this check as a trace (`artifactsByLine` for `answers:2`).
6. Stop: without an approved list every entry reads NEEDS_REVIEW. Record that, mark nothing approved, and ask the reviewer for the list.

## Output

A local approval request for the reviewer and the `kb` counts for the pack.
