# Changelog

All notable changes to Game Loop Alchemist (`gbf-05-game-loop-alchemist`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. `profile.bands.minCases` is now in the engine and in the getting-started profile. A line with fewer observed cases than that number reads U.
- The synthetic worked example and the rhythm pack use three cases per line (four on the rhythm return line) and `minCases` 3.
- Vendored lens-kit 1.3.1.


## [0.1.0] - 2026-11-25

### Added

- Preview release of Game Loop Alchemist: Map what the player chooses, what changes, and why the next turn is worth taking. Measure the core loop, its pace and the freedom to stop. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rewritten from scratch for any game; replaces a held-back version that assumed one shooter.
- Rubric `gbf-05-game-loop-alchemist` 2.0.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `loop-report` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `feel-findings`, `cohort-report`.
- Shared memory: reads `decisions`, `releases`, `balance`; writes `decisions`.
