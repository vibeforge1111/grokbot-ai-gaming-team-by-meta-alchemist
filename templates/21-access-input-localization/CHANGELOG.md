# Changelog

All notable changes to Access, Input and Localization QA (`gbf-21-access-input-localization`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Access, Input and Localization QA: Check whether players can navigate, read and control your game across supported inputs, languages and accessibility settings.
- Rubric `gbf-21-access-input-localization` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `single-language`, `single-input`.
- Team spec 1.0.0: produces `access-report` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `hud-capture-set`, `audio-mix-report`, `tracker-export`, `dialogue-draft`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `navigableByKeyboardAndPad` to `navigableWithSupportedInputs`; `lobby` to `title-screen`; `rematch` to `play-again`; `match` to `core-play`; `pad` to `gamepad`; `mouse` to `keyboard-mouse`. Grades are unchanged; rename these fields in older packs.
