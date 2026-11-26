# Changelog

All notable changes to Mobile App Store Submission (`gbf-28-mobile-store-submission`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. Shared lens-kit 1.3.1 and `mobile/run.mjs`, which writes artifact bytes and a producer receipt. Submission authority comes from a pipeline export, not from this template's own source. `fixtures/plain-checks.json` is a second, non-Capacitor example.

## [0.1.0] - 2026-11-25

### Added

- Preview release of Mobile App Store Submission: Review target-specific evidence and draft a store readiness checklist for a human release owner. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rubric `gbf-28-mobile-store-submission` 1.1.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `store-submission-checklist` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `store-asset-manifest`, `access-report`, `trust-records`, `entitlement-ledger`.
- Shared memory: reads `decisions`, `entitlements`, `incidents`; writes `decisions`, `releases`.
