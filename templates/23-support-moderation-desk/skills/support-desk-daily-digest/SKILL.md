---
name: support-desk-daily-digest
description: "Use when the reviewer wants a count of local drafts by topic for a period, with open policy questions and turnaround, and no message bodies or contact details."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-23-support-moderation-desk v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Desk digest

Summarize a period's local drafts for the reviewer. The digest carries counts, open questions and opaque case references only.

Rubric lines this informs: `cases-and-drafts:1`, `cases-and-drafts:2` and `privacy:2`.

## Steps

1. Input: the drafts saved for the period (for example `drafts/cases.json`).
2. Count them by topic: `node --input-type=module -e 'import fs from "node:fs"; import { digest } from "./support/drafts.mjs"; console.log(JSON.stringify(digest(JSON.parse(fs.readFileSync("drafts/cases.json", "utf8")))))'`
3. Add unresolved policy questions and draft turnaround (the median minutes from intake to draft, when timed). Use opaque case references only where the reviewer needs to find a case.
4. Save the digest locally (for example `drafts/digest.md`) and check that it holds no message bodies, names, handles, emails or account ids. That check is `privacy.exportHasIdentifiers` (must be false); `privacy.retentionDaysSet` comes from the owner's retention setting.
5. Stop or NOT_RUN: with no drafts for the period, write "no drafts" and record the turnaround as NOT_RUN.

## Output

A local digest draft for the reviewer and the observations above for the pack.
