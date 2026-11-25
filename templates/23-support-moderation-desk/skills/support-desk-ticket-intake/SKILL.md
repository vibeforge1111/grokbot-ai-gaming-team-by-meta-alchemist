---
name: support-desk-ticket-intake
description: "Use when a batch of redacted support intake (tickets, form replies or chat exports with personal details removed) needs one local case draft per case, routed by topic."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-23-support-moderation-desk v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Ticket intake

Turn each redacted intake item into a local case draft with an opaque reference and a topic. Purchases and safety concerns always go to the human review queue, and nothing is sent.

Rubric lines this informs: `cases-and-drafts:1`, `cases-and-drafts:2` (when draft preparation is timed) and `privacy:1`.

## Steps

1. Input: a redacted intake export the owner saved locally (for example `intake.json`, one item per case with a topic, no message bodies or contact details). If it holds names, emails, handles or account ids, stop and ask the owner for a redacted copy.
2. Give each case an opaque reference (`case-a`, `case-b`, and so on) and one topic: support, purchase, moderation or safety.
3. Make each draft from this folder: `node --input-type=module -e 'import { draft } from "./support/drafts.mjs"; console.log(JSON.stringify(draft({ caseRef: "case-a", topic: "support" })))'`. For a support case with an approved knowledge entry, pass the entry and the approved revision list as the second and third arguments.
4. Add the affected feature, the observed behavior and a suggested next question to each draft, and save the drafts to a local file such as `drafts/cases.json`. Nothing is sent.
5. For the pack: count the drafts (`cases.measuredCases`), the drafts that carry a reference (`cases.draftsWithRef`) and the delivery calls the agent made (`cases.outboundCalls`, must be 0), citing the drafts file as a trace artifact. If you timed draft preparation, record the median minutes as `live.firstResponseP50Min` with `live.observationDays`, `live.sampleCases` and `live.casesWithDraftShare`.
6. Stop or NOT_RUN: if the owner paused the queue, make no drafts and record NOT_RUN. With no intake, leave these groups out of the pack; the lines stay U.

## Output

Local case drafts, the counts above for the pack, and the list of lines that are still U.
