# Changelog

All notable changes to Prop & Rig Director (`gbf-03-procedural-rig-crafter`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-25

### Added

- First public release of Prop & Rig Director: Build and optimize props and rigs for your runtime. Compare their appearance, animation and collision shapes with your art and performance targets.
- Rubric `gbf-03-procedural-rig-crafter` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `static-props`.
- Team spec 1.0.0: produces `asset-budget-report` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `layout-brief`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `weaponSilhouette` to `attachedPropSilhouette`; `aim-up` to `reach-up`; `aim-down` to `reach-down`. Grades are unchanged; rename these fields in older packs.
- Skill `procedural-three-group-crafter` from pre-release copies is now `procedural-prop-builder`.
- Skill `glb-decimate-draco-pipeline` from pre-release copies is now `asset-lod-and-compression-pipeline`.
