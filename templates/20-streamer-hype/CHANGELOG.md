# Changelog

All notable changes to Streamer Scout, Patch Notes & Update Hype Director (`gbf-20-streamer-hype-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Streamer Scout, Patch Notes & Update Hype Director: Match creators to your intended audience and turn verified build changes into patch notes and updates for players.
- Rubric `gbf-20-streamer-hype-director` 1.4.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-spectator-mode`, `no-share-links`, `no-streamer-mode`.
- Team spec 1.0.0: produces `patch-notes-draft` 1.0.0, `creator-shortlist` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `change-list`, `economy-change-list`, `balance-patch-draft`, `clip-list`, `media-export-manifest`, `store-asset-manifest`, `fairness-findings`, `work-plan`.
- Shared memory: reads `decisions`, `releases`, `balance`; writes `decisions`, `releases`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `spectateLinks` to `spectatorLinks`; `spectateRead` to `spectatorRead`; `openedLiveMatch` to `openedIntendedView`; `spectate-links` to `spectator-links`; `spectate` to `spectatorPolicy`. Grades are unchanged; rename these fields in older packs.
- Skill `eliminated-player-ghost-director-loop` from pre-release copies is now `stream-and-replay-features-review`.
- Skill `creator-fit-roi4d-scout-engine` from pre-release copies is now `creator-shortlist-scout`.
