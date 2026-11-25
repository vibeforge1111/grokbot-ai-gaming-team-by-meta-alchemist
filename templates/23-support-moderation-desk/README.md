# Community Support and Moderation Desk

Created by @meta_alchemist (https://x.com/meta_alchemist).

**Status: preview, not shipping.** This template works and its tests pass, but it is not yet held to the kit's release standard.

Before it can ship:

- Move to the kit's shared lens engine. This template still carries its own lens kit 1.1.0, which trusts the metrics a pack declares and never checks artifact bytes or a producer receipt.
- Ship a pack producer. No bundled tool writes a pack: `support/drafts.mjs` only makes drafts and digests, and 8 of the 10 lines read groups (`tools`, `redteam`, `mod`, `live`, `privacy`) that nothing here computes. Either ship a producer and a generic red-team case file, or drop those lines and re-version the rubric.
- Worked examples in the evidence skills: a crisis draft, a protected-role case and an empty queue.
- Earn points from the game's own support system. Today every line reads values the pack writer declares by hand.

Prepare support replies, moderation reviews and case digests from redacted local intake. Start with [HOW-TO-USE.md](HOW-TO-USE.md).

## Domain tools

`support/drafts.mjs` is a small library with three functions and no command line:

- `draft({ caseRef, topic }, entry, approvedRevisions, { paused })` returns a frozen LOCAL_DRAFT for one case. `caseRef` is an opaque reference such as `case-a`; `topic` is support, purchase, moderation or safety. A knowledge entry is reused only for a support case and only when its exact revision is in the owner-approved list; every other case gets the topic's fallback text. A paused queue returns no draft.
- `revision(entry)` returns the SHA-256 revision of a knowledge entry (question, answer, source), or null when a field is missing or looks sensitive (an email, a link, a long number, a key or an address pattern).
- `digest(drafts)` counts local drafts by topic.

Call them from this folder, for example:

```sh
node --input-type=module -e 'import { draft } from "./support/drafts.mjs"; console.log(JSON.stringify(draft({ caseRef: "case-a", topic: "purchase" })))'
node tests/test-safety.mjs
```

A production pack needs reviewed local records and a timed sample of draft preparation, written by your own adapter (see CODE-BRIEF.md).

## Evidence and grading

A grade describes the evidence supplied by the pack writer. For each group provide a cited artifact and the positive count or nonempty sample listed in `node engine/lens.mjs --meta`. Treat measured zero defects separately from zero cases examined. Missing build identity invalidates the pack. The worked example is synthetic.

| Rubric line | Observations |
|---|---|
| authority-boundaries:1 | tools.privilegedExposed, tools.unknownAttempted, tools.unknownDenied |
| authority-boundaries:2 | redteam.cases, redteam.categories, redteam.failed |
| moderation-safety:1 | mod.liveActions, mod.protectedActions |
| moderation-safety:2 | mod.localPauseHolds, mod.unknownActionsDenied |
| answers:1 | kb.approvedShare, kb.entries, kb.entriesGuardPass |
| answers:2 | kb.editResetsApproval, kb.purchaseRepliesWithoutReview |
| cases-and-drafts:1 | cases.draftsWithRef, cases.measuredCases, cases.outboundCalls |
| cases-and-drafts:2 | live.casesWithDraftShare, live.firstResponseP50Min, live.observationDays |
| privacy:1 | privacy.directContactFirstAllowed, privacy.identifierEchoBlocked, privacy.secretAskBlocked |
| privacy:2 | privacy.exportHasIdentifiers, privacy.retentionDaysSet |

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
