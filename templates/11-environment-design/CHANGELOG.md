# Changelog

All notable changes to Environment Design Director (`gbf-11-environment-design`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [2.0.0] - 2026-11-25

### Breaking

- The optional entry-scene skill (interactive decorations on a title, menu or hub screen) is renamed `entry-scene-optional-interactions`; the old name carried an internal codename. The method is the same. Save the skill again under its new name and update any routine or prompt that names it.

## [1.0.0] - 2026-11-25

### Added

- First public release of Environment Design Director: Review placement, sightlines and visual cues so players can identify landmarks and navigate the spaces in your game.
- Rubric `gbf-11-environment-design` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-location-overlays`.
- Team spec 1.0.0: produces `layout-brief` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `asset-budget-report`, `hud-capture-set`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `regionCards` to `locationOverlays`; `cardStates` to `overlayStates`. Grades are unchanged; rename these fields in older packs.
- Skill `scene-graph-curb-and-surface-uniformity-auditor` from pre-release copies is now `placement-and-support-surface-auditor`.
