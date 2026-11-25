---
name: transaction-idempotency-and-entitlement-audit
description: "Only if your game sells something: reconcile purchase and entitlement records across retries, duplicates, out-of-order notifications and restores, using the owner's store sandbox results. Never makes a charge, refund or grant."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-22-live-service-trust v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Reconcile transactions

Use this skill only if the game sells something for real money: items, currency, a pass, an ad-free upgrade, a level pack or a subscription. A game that sells nothing skips it: the owner approves the `no-store` profile before scoring (`"rubricProfile": ["no-store"]`), both `transactions-and-entitlements` lines read N/A, their points move to the other lines, and the paid-item release blockers no longer apply.

Payments stay with the owner. The owner runs every test purchase in an isolated test service or store sandbox with synthetic orders. This skill only reviews the results. It never makes a charge, refund or grant, real or sandbox, and production records are read-only.

## Method

1. Write down the game's order lifecycle and the exact event that grants the item (the commit point).
2. In the owner's isolated sandbox results, compare three records after each case: the order ledger (what the store says), the final entitlement (what the save or server says the player owns) and the balance shown on screen.
3. Cover at least these cases: a failed payment, a duplicate delivery of the same confirmation, notifications arriving out of order, a timeout, and an interrupted restore of purchases.
4. For each case record the starting state, the expected end state and the number of grants. A completed purchase grants exactly once. A declined or cancelled payment follows the documented policy. Include refunds or revoked access where the game supports them.
5. Review authorization with existing synthetic tests: a player can only use and restore their own purchases.
6. Keep real account, payment and player identifiers out of evidence. Link each mismatch to the affected build and a verified acceptance check.

## Short examples (synthetic, for illustration only)

- Mobile puzzle game: a coin pack confirmation arrives twice; the player must get the coins once.
- PC game with an expansion: the store times out after charging; the expansion must unlock once the confirmation arrives, never twice.
- Free game with an ad-free upgrade: the player reinstalls on a new phone and restores purchases; the upgrade must come back.
- Subscription: a renewal notification arrives before the original purchase; access must not be lost or doubled.

## What it feeds in the pack

- `tx`: `isolated` (true only for the owner's sandbox), `injectedCases` (must cover failure, duplicate and reorder), `lostPaid` and `duplicatedPaid`. For each approved case in `profile.cases.transactionOutcomes`, one row in `receipts.transactionOutcomes` with before and after snapshots. Feeds `transactions-and-entitlements:1`.
- `restore`: `restored`, `expected` and `displayVsAuthoritativeMismatch` (times the screen disagreed with the saved state). Feeds `transactions-and-entitlements:2`.

A measured lost or duplicated paid item is a release blocker, even when another case was skipped.

Gather evidence for `node engine/lens.mjs <pack.json>`.

Record skipped capture or execution as NOT_RUN.

For a confirmed blocker, compare its case and artifact ID with the approved read-only incident ledger. Draft a new P0 candidate or reference the existing incident for the reviewer. The measured blocker stands while reconciliation is pending.
