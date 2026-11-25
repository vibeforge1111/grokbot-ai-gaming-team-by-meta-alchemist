# Prize, Refund and Entitlement Ledger

Created by @meta_alchemist (https://x.com/meta_alchemist).

**Status: preview, not shipping.** This template works and its tests pass, but it is not yet held to the kit's release standard.

Before it can ship:

- Move to the kit's shared lens engine. This template still carries its own lens kit 1.1.0, which trusts the metrics a pack declares and never checks artifact bytes or a producer receipt.
- A pack producer with receipts: `ledger/import-claim-ledger.mjs` prints a pack but writes no artifact files, digests or producer receipt.
- Let the importer carry claim flags and masked address results. Today it drops the `eligibility` and `wallet` groups, so eligibility:1, eligibility:2, wallet-safety:1 and wallet-safety:2 stay U on the real path; only the synthetic scenario measures them.
- Payout address checks as an owner adapter. The address format and mask now come from the profile, but the known and exchange address lists are still supplied by hand.
- Earn points from the game: authority-boundaries:1 probes this template's own ledger code, not the game.

Reconcile local claim histories against owner decisions and fulfillment evidence, then draft a review digest. Start with [HOW-TO-USE.md](HOW-TO-USE.md).

## Domain tools

Three files in `ledger/`:

- `ledger.mjs` is the state machine. The agent may only move a row along the agent transitions. Approvals need the `owner` role and a decision reference; confirmations need the `evidence-import` role and evidence of an allowed kind. It has no grant, pay, refund, ban, network or file-write call. Payout addresses are checked against `profile.addressPattern` and masked to `profile.maskHead` and `profile.maskTail` characters in every output.
- `import-claim-ledger.mjs` reads an owner-prepared journal and prints a pack, or the local digest with `--digest`. It stops on the first invalid transition and names the row.
- `scenario.mjs` is the synthetic worked example (chapter unlocks, contest awards paid to an address, refunds and a lookalike address).

```sh
node ledger/import-claim-ledger.mjs journal.json > pack.json
node ledger/import-claim-ledger.mjs journal.json --digest
node ledger/scenario.mjs --digest
```

A program that grants only in-game entitlements (a chapter unlock, a tournament entry) can set `profile.rubricProfile` to `account-only`; the two payout address lines then weigh 0 and read N/A.

## Evidence and grading

A grade describes the evidence supplied by the pack writer. For each group provide a cited artifact and the positive count or nonempty sample listed in `node engine/lens.mjs --meta`. Treat measured zero defects separately from zero cases examined. Missing build identity invalidates the pack. The worked example is synthetic.

| Rubric line | Observations |
|---|---|
| authority-boundaries:1 | authority.forbiddenAttempted, authority.forbiddenSucceeded, authority.valueMovingFunctions |
| authority-boundaries:2 | ledger.approvedWithoutDecision, ledger.confirmedWithoutEvidence, ledger.unknownState |
| eligibility:1 | eligibility.ineligibleProposedOrApproved, ledger.doubleGrants |
| eligibility:2 | eligibility.notWinnerAccepted, eligibility.redirectsWithoutDecision |
| wallet-safety:1 | wallet.exchangeCaught, wallet.exchangePlanted, wallet.flaggedProposed, wallet.poisonCaught, wallet.poisonPlanted |
| wallet-safety:2 | ops.digestHasFullAddress, wallet.unmaskedInOutputs |
| delivery:1 | sla.deadlineSet, sla.maxWaitDays, sla.overdue |
| delivery:2 | refunds.owed |
| reconciliation-and-reporting:1 | recon.confirmedReportedOnly, recon.mismatches, recon.snapshotPresent, recon.unrecorded |
| reconciliation-and-reporting:2 | ops.deadlineAlert, ops.digestBuilt |

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
