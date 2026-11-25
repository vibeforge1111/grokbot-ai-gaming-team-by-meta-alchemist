# Changelog

All notable changes to Playtest Bug Desk & Repro Triage Director (`gbf-18-bug-desk-triage`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-25

### Added

- First public release of Playtest Bug Desk & Repro Triage Director: Turn playtest observations into reproducible local issue drafts, group duplicate reports and verify fixes against the affected build.
- Rubric `gbf-18-bug-desk-triage` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `ticket-draft` 1.0.0, `change-list` 1.0.0, `grade-record` 1.0.0; reads `tracker-export`, `ticket-draft`, `incident-report`, `support-case-draft`.
- Shared memory: reads `decisions`, `incidents`, `releases`; writes `decisions`, `releases`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `matchLinesWithActionCapture` to `playFindingsWithActionCapture`; `matchLines` to `playFindings`; `routedToGrowth` to `routedToLinkOwner`; `share-attribution-intake` to `share-link-intake`; the fixed 24-hour limit in the p0-response check to profile key p0ResponseHours. Grades are unchanged; rename these fields in older packs.
- Skill `trace-minhash-crash-deduper` from pre-release copies is now `duplicate-report-grouping`.
- Skill `flightbox-600tick-repro-minimizer` from pre-release copies is now `minimal-repro-builder`.
- Skill `impact-score-git-ast-bisecter` from pre-release copies is now `severity-and-regression-bisect`.
- Skill `bug-repro-to-github-issue` from pre-release copies is now `issue-draft-and-fix-verification`.
