# Changelog

All notable changes to Live Service, Payments and Trust (`gbf-22-live-service-trust`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Live Service, Payments and Trust: Review progress saves, entitlements and recovery after service failures. Include payment checks when your game sells items or access.
- Rubric `gbf-22-live-service-trust` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-store`.
- Team spec 1.0.0: produces `incident-report` 1.0.0, `trust-records` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `economy-change-list`, `fairness-findings`, `enforcement-policy-draft`, `tracker-export`, `entitlement-ledger`.
- Shared memory: reads `decisions`, `incidents`, `entitlements`, `regions`, `releases`; writes `decisions`, `incidents`, `entitlements`.
