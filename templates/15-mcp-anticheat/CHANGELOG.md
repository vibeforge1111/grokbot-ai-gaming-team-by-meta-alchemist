# Changelog

All notable changes to Server Fairness & Anti-Cheat Guard (`gbf-15-mcp-anticheat-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Server Fairness & Anti-Cheat Guard: For games with a server, compare scene data across engines and review whether the server enforces your game's rules fairly.
- Rubric `gbf-15-mcp-anticheat-director` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `turn-based`, `no-input-assist`.
- Team spec 1.0.0: produces `fairness-findings` 1.0.0, `enforcement-policy-draft` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `layout-brief`, `tracker-export`, `incident-report`, `support-case-draft`.
- Shared memory: reads `decisions`, `incidents`, `regions`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `triggerParity` to `actionParity`; `wallObscuredSent` to `hiddenStateSent`; `relyOnRadiusOnly` to `relyOnDistanceOnly`; `interest` to `hiddenInfo`; check sybil to multi-account. Grades are unchanged; rename these fields in older packs.
- Skill `cross-engine-mcp-scene-bridge` from pre-release copies is now `cross-editor-scene-parity`.
