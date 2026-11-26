# Changelog

All notable changes to Live-Ops Balance Patch Director (`gbf-26-balance-patch-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. Shared lens-kit 1.3.1 and `balance/run.mjs`, which writes artifact bytes and a producer receipt. Predictions are checked against the next build's observed outcomes. Authority metrics come from an owner audit, not from this template's own source.

## [0.1.0] - 2026-11-25

### Added

- Preview release of Live-Ops Balance Patch Director: Compare configurable numeric parameters with observed outcomes and draft bounded, reversible changes. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rubric `gbf-26-balance-patch-director` 1.1.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `balance-patch-draft` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `support-case-draft`, `cohort-report`, `economy-change-list`.
- Shared memory: reads `decisions`, `incidents`, `balance`, `releases`; writes `decisions`, `balance`.
