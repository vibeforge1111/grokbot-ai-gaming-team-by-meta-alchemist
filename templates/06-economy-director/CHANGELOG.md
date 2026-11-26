# Changelog

All notable changes to Game Economy Director (`gbf-06-game-economy-director`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [1.0.1] - 2026-11-26

### Changed

- Vendored lens-kit 1.3.1, which can treat a line as unmeasured when `profile.bands.minCases` is set and the line has fewer observed cases than that number. Templates that do not set `minCases` grade as before.


## [1.0.0] - 2026-11-25

### Added

- First public release of Game Economy Director: Model sources and sinks for a currency or reward, compare progression paths, and simulate how balance changes affect player choices.
- Rubric `gbf-06-game-economy-director` 1.3.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Owner-selected not-applicable profiles: `no-combat`, `no-store`.
- Team spec 1.0.0: produces `economy-change-list` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `change-list`, `tracker-export`, `loop-report`, `cohort-report`, `balance-patch-draft`, `entitlement-ledger`.
- Shared memory: reads `decisions`, `balance`, `entitlements`, `releases`; writes `decisions`, `balance`.

### Changed

- Evidence pack names from pre-release copies made genre-neutral: `perWeaponP50S` to `perAttackP50S`; `maxFocusFireErrS` to `maxMultiAttackerErrS`; `focusFire` to `multiAttacker`; `ttkBandS` to `timeToDefeatBandS`; `maxLootIntervalWidth` to `maxRewardIntervalWidth`; `maxTierDays` to `maxProgressStepDays`; `tierDaysEstimate` to `stepDaysEstimate`; `minF2pShareOfPaid` to `minFreeShareOfPaid`; `freeItemsPerSeason` to `freeItemsPerPeriod`; `paidItemsPerSeason` to `paidItemsPerPeriod`; `passEdge` to `paidEdge`; `passItems` to `paidOfferItems`; `pass-paid-edge` to `paid-advantage`; `ttk` to `timeToDefeat`; `loot` to `randomRewards`; `f2p` to `freeVsPaid`; focusFireMaxErr (engine function) to multiAttackerMaxErr. Grades are unchanged; rename these fields in older packs.
- Skill `ttk-and-combat-envelope-auditor` from pre-release copies is now `combat-timing-auditor`.
- Skill `machinations-faucet-sink-solver` from pre-release copies is now `resource-sources-and-sinks-model`.
