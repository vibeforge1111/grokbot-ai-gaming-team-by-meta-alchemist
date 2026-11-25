# Prize, Refund and Entitlement Ledger: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets. This template is a preview: its engine trusts the metrics a pack declares, so read every grade as a check of the evidence you supplied.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the prize-ledger-getting-started skill. Ask me one question at a time. My game is <name, genre, platforms>. The build to review is <build id>, and the evidence comes from <export, tool or person>.
```

Decisions the bot will ask you about early, one question at a time:

- Which prizes, entitlements and refund programs are in scope, and who approves exceptions?
- What source proves fulfillment for each program (an entitlement read, a grant log, a refund receipt), and what is the wait limit?
- Does this program grant account entitlements only, or does it pay to an address that needs a private address review? If it pays, what address format and mask lengths apply?

## 2. Routine prompts

**Reconcile and draft a digest** (create it as a routine if you want it daily during a claim window; otherwise run it when you ask):

```
Run `node ledger/import-claim-ledger.mjs <journal.json> --digest` on the owner-prepared journal and save the output as a local digest draft. Compare confirmed grants to the entitlement snapshot and keep pending refunds separate. List overdue counts, missing receipts and report-only confirmations, each with its opaque evidence reference. If the import stops on an invalid transition, report the named row and stop.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Delivery window review** (run it when you ask, for example a day before a delivery window closes):

```
Run `node ledger/import-claim-ledger.mjs <journal.json>` and read `metrics.sla` (approved not confirmed, overdue, longest wait) and the hours left in the delivery window. Draft a short review note for the owner listing the rows that need a decision. If the journal has no deadlineMs, say the window is not set.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Evidence grade** (create it as a routine if you want a regular grade; it runs only when you ask or on the schedule you set):

```
Run `node engine/lens.mjs <pack.json>` (gbf-24-prize-refund-ledger v1.2.0) on the owner-approved pack for the intended build. Record verdict, grade, coverage, every U line, both build ids and the rubric hash, and say that this preview engine trusts the metrics the pack declares. Compare levels only with an earlier grade that has the same rubric hash and profile. Draft one local finding per measured failure. If there is no new pack, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with `node engine/lens.mjs <pack.json>` (gbf-24-prize-refund-ledger v1.2.0). Lead with verdict, grade and coverage, and say that this preview engine trusts the metrics the pack declares. List every U line as not measured yet with the evidence that would measure it. Compare only with a grade that has the same rubric hash and profile. Draft one local finding per measured failure for the human to review.
```

- **prize-ledger-claim-and-wallet-checks**: a claim needs eligibility checks, or a payout address needs format, lookalike and exchange checks.

  ```
  Use the prize-ledger-claim-and-wallet-checks skill on <claims.json> for program <program>. Hold duplicates, excluded subjects, replies from someone other than the winner and redirects for my decision, check any payout address against my profile's format, and show only masked addresses.
  ```

- **prize-ledger-reconcile-and-digest**: a journal needs reconciling against fulfillment evidence and a digest for the owner.

  ```
  Use the prize-ledger-reconcile-and-digest skill on <journal.json>. Import it, reconcile confirmed grants with the entitlement snapshot, and save the digest as a local draft. Tell me which rubric lines this informs and what is still unmeasured.
  ```

- **prize-ledger-public-note-draft**: players need a status note about a prize or refund program, from aggregate counts only.

  ```
  Use the prize-ledger-public-note-draft skill for program <program> using the latest digest. Draft a short public note with aggregate counts and approved wording only, no individual cases, addresses or amounts. Leave it as a local draft for me.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-24-prize-refund-ledger v1.2.0. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds or the rubric. After I make the fix, regrade the new pack with `node engine/lens.mjs <pack.json>` and show the change per line. Keep U lines as U until real evidence arrives. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer of gbf-24-prize-refund-ledger v1.2.0: the grade record, the pack's artifact list and redacted excerpts, never personal data or secrets. Every line in this rubric is computed, so the reviewer does not change levels. Ask them to say, per line, whether the cited artifact really measures what the line reads, which lines pass by construction or from probes of this template's own code, and which evidence would be stronger. Return lineId, verdict on the evidence, evidenceIds and a short note. The human decides whether to send the brief.
```
