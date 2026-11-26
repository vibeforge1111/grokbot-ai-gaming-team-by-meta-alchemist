# Changelog

All notable changes to Prize, Refund and Entitlement Ledger (`gbf-24-prize-refund-ledger`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. Shared lens-kit 1.3.1 and `ledger/import-claim-ledger.mjs`, which writes artifact bytes and a producer receipt from an owner-prepared journal, including claim and wallet checks. Grades come from that journal and an owner audit file, not from this template's own source. The account-only rubric profile follows the kit's not-applicable rule.

## [0.1.0] - 2026-11-25

### Added

- Preview release of Prize, Refund and Entitlement Ledger: Reconcile local claim histories against owner decisions and fulfillment evidence, then draft a review digest. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rubric `gbf-24-prize-refund-ledger` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `account-only`.
- Team spec 1.0.0: produces `entitlement-ledger` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `support-case-draft`, `enforcement-policy-draft`.
- Shared memory: reads `decisions`, `incidents`, `releases`; writes `decisions`, `entitlements`.
