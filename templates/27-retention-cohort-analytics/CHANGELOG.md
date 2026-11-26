# Changelog

All notable changes to Retention and Cohort Analytics (`gbf-27-retention-cohort-analytics`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. Shared lens-kit 1.3.1 and `cohorts/scenario.mjs`, which writes artifact bytes and a producer receipt. Segments are assigned at first play. Cohort and segment floors come from the pack profile. Authority metrics come from an owner audit, not from this template's own source.

## [0.1.0] - 2026-11-25

### Added

- Preview release of Retention and Cohort Analytics: Measure mature return cohorts with uncertainty ranges and draft a privacy-preserving review. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rubric `gbf-27-retention-cohort-analytics` 1.1.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `cohort-report` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `lobby-fill-proposal`, `balance-patch-draft`.
- Shared memory: reads `decisions`, `incidents`, `balance`, `regions`, `releases`; writes `decisions`.
