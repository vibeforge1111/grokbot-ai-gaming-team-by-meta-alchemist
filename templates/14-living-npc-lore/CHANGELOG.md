# Changelog

All notable changes to Living AI NPC and Lore Architect (`gbf-14-living-npc-lore`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.0] - 2026-11-26

### Added

- First shipping release. `profile.bands.minCases` is now in the engine and in the getting-started profile. A line with fewer observed cases than that number reads U.
- The synthetic worked example uses three cases per line and `minCases` 3. For generated dialogue, the getting-started skill asks for at least that many runs of each probe.
- Vendored lens-kit 1.3.1.


## [0.1.0] - 2026-11-25

### Added

- Preview release of Living AI NPC and Lore Architect: Design what an NPC can remember, how it responds and which version of a world fact it may reveal. Audit those decisions against scoped transcripts and traces. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rewritten from scratch as an NPC memory and lore workflow; replaces a held-back combat audit.
- Rubric `gbf-14-living-npc-lore` 2.0.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `dialogue-draft` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `access-report`.
- Shared memory: reads `decisions`, `releases`; writes `decisions`.
