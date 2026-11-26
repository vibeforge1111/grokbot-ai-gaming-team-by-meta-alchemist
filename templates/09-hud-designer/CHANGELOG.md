# Changelog

All notable changes to HUD and Game UI Designer (`gbf-09-hud-ui-designer`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of HUD and Game UI Designer: Check whether players can read the information they need, operate the controls and understand their first session on each target device.
- Rubric `gbf-09-hud-ui-designer` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-touch`, `touch-only`, `fixed-orientation`, `single-language`.
- Team spec 1.0.0: produces `hud-capture-set` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `feel-findings`, `atlas-manifest`, `loop-report`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `padReachableActions` to `navReachableActions`; `minPxAt1280` to `minPxLargeViewport`; `minPxPhone` to `minPxSmallViewport`; `screenCoverPctMaxCombat` to `screenCoverPctMaxDuringPlay`; `final-fight` to `busiest-moment`; `death` to `fail-state`. Grades are unchanged; rename these fields in older packs.
- Skill `zero-dom-thrash-combat-hud` from pre-release copies is now `live-hud-updates-and-cost`.
- Skill `near-miss-recap-and-damage-radar` from pre-release copies is now `event-cues-and-recaps`.
