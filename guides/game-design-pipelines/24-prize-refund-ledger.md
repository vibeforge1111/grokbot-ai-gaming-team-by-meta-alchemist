# Prize, Refund and Entitlement Ledger in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Reconcile local claim histories against owner decisions and fulfillment evidence, then draft a review digest.

**Status: preview, not shipping.** The template works and its tests pass, but it is not held to the release standard. It still uses lens-kit 1.1.0. The importer prints a pack without receipts and drops some groups on the real path, and one line probes this template's own code. Use it to reconcile records on your machine. Do not treat the grade as a release gate. The template README lists the remaining ship blockers.

Template folder: [templates/24-prize-refund-ledger](../../templates/24-prize-refund-ledger/). Install and prompts: [HOW-TO-USE.md](../../templates/24-prize-refund-ledger/HOW-TO-USE.md), [PROMPTS.md](../../templates/24-prize-refund-ledger/PROMPTS.md).

## When to use it

- **Stage:** Live operations, when claims, refunds, or entitlements are being fulfilled by hand or by a script you run locally.
- **Trigger:** When you are reconciling claim, refund, or entitlement records on your own machine.

## Inputs and outputs

- **Inputs:** Your game profile (`game-profile`), an evidence pack (`evidence-pack`), and, when you have them, a support-case draft and an enforcement-policy draft.
- **Outputs:** A local entitlement ledger and digest draft (`entitlement-ledger`), a 100-point grade (`grade-record`), and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Local claim histories, owner decisions, and optional drafts from Support Desk (23) and Live Service Trust (22).
- **Hands to:** Support Desk (23) when a claim needs a reply; Bug Desk (18) for ticket drafts; Producer (12) for a milestone note. The human reviews every draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `prize-ledger-getting-started` and answer its questions one at a time.
2. **Import:** run `ledger/import-claim-ledger.mjs` on your local claim file if you use that helper, then `prize-ledger-claim-and-wallet-checks`. Know that some groups may stay unmeasured on this path until a producer with receipts ships.
3. **Reconcile:** run `prize-ledger-reconcile-and-digest`, then `prize-ledger-public-note-draft` only if you need a public note. Keep the note as a local draft.
4. **Grade:** `node engine/lens.mjs fixtures/good-pack.json` shows the synthetic example (verdict PASS, grade 100/100). For a real pack, run `node engine/lens.mjs <pack.json>` and read U lines as missing evidence, not as a pass.
5. **File locally:** you decide what is sent or filed.

