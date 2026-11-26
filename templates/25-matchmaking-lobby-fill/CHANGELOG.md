# Changelog

All notable changes to Matchmaking and Region Lobby Fill (`gbf-25-matchmaking-lobby-fill`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. Shared lens-kit 1.3.1 and pack producers (`mm/scenario.mjs`, `mm/import-counts.mjs`) that write artifact bytes and a producer receipt. Silent hours inside the declared window count as zero. The input-queue option is computed from the plan. Authority metrics come from an owner audit or export, not from this template's own source.

## [0.1.0] - 2026-11-25

### Added

- Preview release of Matchmaking and Region Lobby Fill: Measure queue fill, wait times and bot representation and draft alternatives for a human queue owner. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rubric `gbf-25-matchmaking-lobby-fill` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `lobby-fill-proposal` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads only the owner's game profile and evidence pack.
- Shared memory: reads `decisions`, `incidents`, `releases`; writes `decisions`, `regions`.
