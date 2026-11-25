# Changelog

All notable changes to Parallel Game Producer and Pitch Architect (`gbf-12-parallel-game-producer`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-25

### Added

- First public release of Parallel Game Producer and Pitch Architect: Plan parallel work against actual capacity, reconcile ticket rows and turn verified project evidence into a local pitch deck draft.
- Rewritten from scratch with a dependency planner (engine/plan.mjs); replaces a held-back version.
- Rubric `gbf-12-parallel-game-producer` 2.0.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `work-plan` 1.0.0, `pitch-draft` 1.0.0, `grade-record` 1.0.0; reads `tracker-export`, `grade-record`, `ticket-draft`, `cohort-report`, `store-submission-checklist`.
- Shared memory: reads `decisions`, `incidents`, `entitlements`, `balance`, `regions`, `releases`; writes `decisions`, `releases`.
