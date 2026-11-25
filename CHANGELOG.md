# Changelog

All notable changes to the kit are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Each template also keeps its own `CHANGELOG.md`; see [docs/VERSIONING.md](docs/VERSIONING.md).

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

### Added

- A five minute quickstart on the README, a starter team of four bots in GETTING-STARTED.md (Game Feel, HUD, Bug Desk, Producer) with copy-paste first prompts, and an FAQ.
- A Start here block on every template README: what it does, when to use it, setup, a first prompt, and the synthetic sample grade. `npm run catalog` refreshes that block and the catalog.

### Changed

- The template catalog now shows the short name, the full name, and when to use each bot, and it points newcomers at the starter team before the full table.

## [1.0.1] - 2026-11-25

### Changed

- 03 Prop and Rig and 11 Environment Design are now 2.0.0: their shared optional entry-scene skill is renamed `entry-scene-optional-interactions` (same method; the old name carried an internal codename). Re-save it under the new name if you installed it.

## [1.0.0] - 2026-11-25

First public release.

### Added

- 15 shipping templates: 01 Game Feel, 03 Prop and Rig, 06 Economy, 09 HUD and Game UI, 10 Trailer, 11 Environment, 12 Parallel Game Producer, 13 Sound Effects and Adaptive Music, 15 Server Fairness and Anti-Cheat, 17 Sprite Atlas and Hitbox, 18 Bug Desk, 19 Store Page and Presskit, 20 Streamer Scout and Patch Notes, 21 Access, Input and Localization, and 22 Live Service and Trust. The [catalog](TEMPLATES.md) lists them with versions. Template numbers stay stable across releases.
- 8 preview templates (they work and their tests pass, but are not yet held to the release standard): 05 Game Loop Alchemist, 14 Living AI NPC and Lore, 23 Support and Moderation Desk, 24 Prize, Refund and Entitlement Ledger, 25 Matchmaking and Region Lobby Fill, 26 Live-Ops Balance Patch, 27 Retention and Cohort Analytics, and 28 Mobile App Store Submission. Each README lists what it needs before it can ship.
- Team map ([docs/TEAM-MAP.md](docs/TEAM-MAP.md)): every template declares what it produces and consumes, with a schema per artifact in [spec/artifacts/](spec/artifacts/). Each getting-started skill says where to look for each input and to continue with a marked assumption, never invented data, when one is missing. Every template still works alone.
- Shared team memory ([docs/SHARED-MEMORY.md](docs/SHARED-MEMORY.md)): an append-only store in the game project's `.grokbot-team/` folder (committed in a private repository, kept out of a public one) with a schema, a no-dependency helper that every template carries, salted hashing of subject ids and a lint that rejects personal data and secrets.
- Versions ([docs/VERSIONING.md](docs/VERSIONING.md)): a semver `version`, `teamSpec` and `compat` in every template, a Keep a Changelog file per template, a test that rejects a breaking change without a major bump, and `npm run compat`, which reports OK, WARN or BREAK for every pair of templates that exchanges artifacts.
- Owner-selected not-applicable rubric profiles (for example no-aiming, no-store, no-spectator-mode, no-streamer-mode, single-input) that can be combined, so a game without a feature can still reach PASS ([docs/RUBRIC_GUIDE.md](docs/RUBRIC_GUIDE.md#applicability)).
- Kit: spec, JSON schemas, validator, scrub check, link check, artifact check, starter template and scaffolder, catalog generator, CI on Node 18, 20 and 22. Guides for game design pipelines, pairing with other LLM tools, bridging to your own computer, and rubrics and polish loops. Worked example: Pixel Pantry, two builds of a browser cooking game.

### Changed

- Engine (lens-kit) 1.3.0: case-row checks used by the rewritten templates, build-scope receipts, combinable profiles, and release blockers that stop applying when a profile marks their line not applicable. Every shipping template grades its worked example exactly as on 1.2.0.
- Shipping rubrics 1.2.0: genre-neutral line, pillar and anchor wording (ids, weights, conditions and pass marks unchanged). Rubric 19 is now `gbf-19-store-presskit-director`.
- Evidence pack names made genre-neutral before the first release (rubrics that name them are now 1.3.0): for example `heldFire` is `heldInput`, `aim` is `targeting`, `weaponSilhouette` is `attachedPropSilhouette`, `loot` is `randomRewards`, `framing916` is `cropFraming`, `matchLines` is `playFindings`, `spectate` is `spectatorPolicy` and the worked journey in 21 is title screen, core play, results and play again. Every worked example grades exactly as before; each template's changelog lists its renames. Two more thresholds moved into the game profile (18's P0 response hours) alongside 10's true peak and 13's spatial direction floor.
- Skills renamed where a name tied the template to one genre, tool or store (each template's changelog lists them), and every template reviewed end to end for plain wording, broken flows and examples from several genres.
- Rubrics carry case receipts bound to the build, empty evidence earns U, measured release blockers in 20, 21 and 22 set the grade to zero, and every send, post, ticket and submission is a local draft for the human.

### Not included yet

| Held back | Why |
|---|---|
| 02 Playtest and Performance Director | Held back after outside review |
| 04 Multiplayer Netcode and Bot-Swarm Director | Held back after outside review |
| 07 TSL and WebGPU Shader Alchemist | Held back after outside review |
| 08 Procedural World, Biome and Encounter Architect | Held back after outside review |
| 16 Gaussian Splat and 3D World Cleaner | Held back pending evidence from a working build |
| Game Clipmaker | Held back. Trailer Director covers clip selection in this release. |
