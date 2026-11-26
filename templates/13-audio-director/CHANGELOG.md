# Changelog

All notable changes to Sound Effects & Adaptive Music Director (`gbf-13-audio-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Sound Effects & Adaptive Music Director: Review sound effects, music transitions and mix levels against your game's feedback needs and device budgets.
- Rubric `gbf-13-audio-director` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-music`, `no-spoken-lines`, `no-spatial-audio`.
- Team spec 1.0.0: produces `audio-mix-report` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `feel-findings`, `dialogue-draft`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `maxFirstTapHandlerMs` to `maxFirstInputHandlerMs`; `firstTapHandlerMs` to `firstInputHandlerMs`; `announcerLines` to `spokenLines`; `leakedNodesAfter10Matches` to `leakedNodesAfterRepeatedSessions`; `autoplayBlockedHandled` to `startBlockedHandled`. Grades are unchanged; rename these fields in older packs.
- Skill `zzfx-procedural-audio-bus` from pre-release copies is now `sound-effect-bus-and-voice-limits`.
- Skill `acoustic-gameplay-and-mic-rms-mechanics` from pre-release copies is now `optional-microphone-input`.
