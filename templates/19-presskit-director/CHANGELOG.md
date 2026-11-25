# Changelog

All notable changes to Store Page & Presskit Director (`gbf-19-store-presskit-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-25

### Added

- First public release of Store Page & Presskit Director: Prepare store copy, screenshots and press assets that show what players actually do in your game, then check each destination's requirements.
- Rubric `gbf-19-store-presskit-director` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-own-web-page`.
- Team spec 1.0.0: produces `store-asset-manifest` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `media-export-manifest`, `clip-list`, `hud-capture-set`, `access-report`, `trust-records`, `pitch-draft`, `atlas-manifest`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `capsules` to `storeArtFormats`; `entrance` to `firstScreen`; `cards` to `linkPreviews`. Grades are unchanged; rename these fields in older packs.
- Skill `capsule-grid-safezone7-auditor` from pre-release copies is now `store-art-format-auditor`.
- Skill `above-fold-hook300-tag-optimizer` from pre-release copies is now `store-copy-and-metadata-checker`.
- Skill `steam-presskit-getting-started` from pre-release copies is now `store-presskit-getting-started`.
- Skill `steam-presskit-lens-engine` from pre-release copies is now `store-presskit-lens-engine`.
