# Changelog

All notable changes to Game Vibes Director (`gbf-01-game-feel`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Game Vibes Director: Measure how quickly a game responds to input and how clearly its camera, sound and visuals communicate each action.
- Rubric `gbf-01-game-feel` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-aiming`, `no-hazards`, `offline-only`.
- Team spec 1.0.0: produces `feel-findings` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `hud-capture-set`, `audio-mix-report`, `atlas-manifest`, `loop-report`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `heldFireMaxDeltaPct` to `heldInputMaxDeltaPct`; `heldFire` to `heldInput`; `onlineMatchesPractice` to `onlineMatchesOffline`; `damagingThreatsOffscreen` to `hazardsOffscreen`; `edgeThreatVisibleRatio` to `edgeHazardVisibleRatio`; `edgeThreatVisibleMin` to `edgeHazardVisibleMin`; `aimErrorP95Deg` to `targetingErrorP95Deg`; `aim` to `targeting`. Grades are unchanged; rename these fields in older packs.
- Skill `elevation-aim-assist-and-cliff-ledge-save` from pre-release copies is now `assist-and-forgiveness-check`.
