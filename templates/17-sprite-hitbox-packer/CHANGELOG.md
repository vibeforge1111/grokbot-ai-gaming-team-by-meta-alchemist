# Changelog

All notable changes to 2D Sprite Atlas & Hitbox Packer (`gbf-17-sprite-hitbox-packer`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-25

### Added

- First public release of 2D Sprite Atlas & Hitbox Packer: Pack sprites into atlases and check their silhouettes, hitboxes, palettes and memory use on your target devices.
- Rubric `gbf-17-sprite-hitbox-packer` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-height-layer`, `no-item-tiers`, `no-install-icons`, `no-hit-shapes`.
- Team spec 1.0.0: produces `atlas-manifest` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `feel-findings`, `fairness-findings`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `rewardArt` to `itemArt`; `maxRarityDeltaE` to `maxTierPaletteDeltaE`; `minRewardPx` to `minItemArtPx`; `rarity` to `tierPalette`; `elevation` to `heightLayer`; `damage-path` to `gameplay-path`. Grades are unchanged; rename these fields in older packs.
- Skill `maxrects-extrude-pixel-atlas-packer` from pre-release copies is now `sprite-atlas-packer`.
- Skill `hurt-push-hit-3box-frame-extractor` from pre-release copies is now `sprite-hit-shape-checker`.
- Skill `normal-lit-palette-lut-swapper` from pre-release copies is now `sprite-palette-and-readability-checker`.
