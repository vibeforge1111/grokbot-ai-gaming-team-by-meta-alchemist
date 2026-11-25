---
name: prize-ledger-claim-and-wallet-checks
description: "Use when a prize or refund claim needs eligibility checks (winner match, duplicates, exclusions, redirects), or a payout address needs format, lookalike and exchange checks before any grant is proposed."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-24-prize-refund-ledger v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Claim and payout address checks

Hold every doubtful claim and every flagged payout address for the owner. Addresses appear only masked, with the head and tail lengths from the profile.

Rubric lines this informs: `eligibility:1`, `eligibility:2`, `wallet-safety:1` and `wallet-safety:2`.

## Steps

1. Input: the owner's claim list for one program (row id, prize key, winner key, claimant key and subject key as sub_ ids) and, if the program pays to an address, the collected addresses with the owner's known payout addresses and exchange deposit addresses. Profile: `excludedKeys`, `addressPattern`, `maskHead` and `maskTail`.
2. See every check on the synthetic example first: `node ledger/scenario.mjs --digest`. For real claims, write a short local script that imports `newLedger`, `addRow`, `checkClaim` and `checkWallet` from `ledger/ledger.mjs`, following `ledger/scenario.mjs` call for call.
3. Claims: `checkClaim(L, id, claim, profile)` flags NOT_WINNER, REDIRECT, TEAM_OR_AFFILIATE, ALREADY_OWNS and DUPLICATE_SUBJECT. Hold every flagged row for the owner's decision.
4. Addresses: on a ledger made with `newLedger(profile)`, `checkWallet(L, id, address, { known, exchanges })` flags FORMAT_UNCHECKED (no pattern in the profile), BAD_FORMAT, EXCHANGE, POISON_SUSPECT (the same visible head and tail as a known address) and CHANGED_AFTER_COLLECTION. A flagged address is never proposed.
5. Draft a local proposal per row naming the proof still needed, showing addresses only as `mask(address, L.rules)`. For the pack, `packMetrics()` builds the `eligibility` and `wallet` groups as in the scenario, with planted lookalike and exchange addresses counted in `poisonPlanted` and `exchangePlanted`.
6. Stop: if the profile has no `addressPattern`, every address is held; ask the owner for the format. Preview gap: `ledger/import-claim-ledger.mjs` drops these two groups, so on the journal path these four lines stay U.

## Output

Local proposals with masked addresses and claim flags for the owner, and the `eligibility` and `wallet` groups when you built them.
