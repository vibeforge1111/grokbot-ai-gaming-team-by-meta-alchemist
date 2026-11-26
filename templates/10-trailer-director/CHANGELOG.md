# Changelog

All notable changes to Stream-to-Devlog & Trailer Cut Director (`gbf-10-trailer-cut-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Stream-to-Devlog & Trailer Cut Director: Turn recorded gameplay into a devlog or trailer. Choose moments that show the player experience, frame them for each destination and check the cut for sensitive information.
- Rubric `gbf-10-trailer-cut-director` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `clip-list` 1.0.0, `media-export-manifest` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `hud-capture-set`, `audio-mix-report`, `change-list`, `pitch-draft`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `framing916` to `cropFraming`; unused exports.desktopWidth and exports.phoneHeight removed from the worked example. Grades are unchanged; rename these fields in older packs.
- Skill `ffmpeg-peak-action-and-clutch-detector` from pre-release copies is now `gameplay-moment-finder`.
