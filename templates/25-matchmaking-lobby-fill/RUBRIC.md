# Matchmaking and Region Lobby Fill: rubric gbf-25-matchmaking-lobby-fill v1.2.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.2.0 replaces input names taken from one game with neutral ones. Metrics device.touchWaitGapS and device.touchQueueOptionConsidered are now device.primaryInputWaitGapS and device.inputQueueOptionConsidered; profile maxTouchGapS and touchQueueMinShare are now maxInputWaitGapS and inputQueueMinShare. The input groups come only from profile.primaryInput and profile.comparisonInput, with no default device codes, and seat keys are the kit's salted subject ids (sub_ plus 32 hex). Line ids, weights and anchors are unchanged. Rename the fields in existing packs and profiles and regrade.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: owner-configured. Hash: `sha256:f79e06c8a8fb224341b91dd02f0be638e81dc4f8ddd485df58acb8b992bc0d78`.
- 0 to 4, or U (UNMEASURED, 0 points, not a defect). A test that did not run is NOT_RUN and never reads as PASS.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- `fill`: `regions`, `regionHoursMeasured`.
- `merge`: `proposals`, `thinRegions`.
- `bots`: `measuredCases`.
- `wait`: `measuredCases`.
- `device`: `measuredCases`.
- `authority`: `forbiddenAttempted`.
- `privacy`: `measuredCases`.
- `latency`: `pairs`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Fill measurement | fill-measurement:1 | Humans and bots counted apart | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line fill-measurement:1 |
| Fill measurement | fill-measurement:2 | Thin regions found correctly | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line fill-measurement:2 |
| Proposals | proposals:1 | Merges respect the ping cap | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line proposals:1 |
| Proposals | proposals:2 | Options with trade-offs | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line proposals:2 |
| Bot honesty | bot-honesty:1 | Bots labelled, never counted as players | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line bot-honesty:1 |
| Bot honesty | bot-honesty:2 | Bot-heavy regions have a plan | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line bot-honesty:2 |
| Wait and devices | wait-and-devices:1 | Queue wait | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line wait-and-devices:1 |
| Wait and devices | wait-and-devices:2 | Input group wait gap | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line wait-and-devices:2 |
| Safety and privacy | safety-and-privacy:1 | Proposals only | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line safety-and-privacy:1 |
| Safety and privacy | safety-and-privacy:2 | No personal data | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line safety-and-privacy:2 |

## Level anchors

### fill-measurement:1 Humans and bots counted apart

- **0**: Bots counted as players, or no per-hour data
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A full day of region-hours is measured from seat events, and no bot is ever counted as a human
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### fill-measurement:2 Thin regions found correctly

- **0**: Thin regions missed or invented
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The thin-region list matches an independent recount from the raw rows
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### proposals:1 Merges respect the ping cap

- **0**: A merge over the cap was proposed
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No merge over the ping cap or with unknown ping is proposed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### proposals:2 Options with trade-offs

- **0**: One option or none
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every thin region has two or more options, each with its cost in ping, bots or timing
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### bot-honesty:1 Bots labelled, never counted as players

- **0**: Bots shown as players
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Bots carry a label in the lobby and are never in the public player count
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### bot-honesty:2 Bot-heavy regions have a plan

- **0**: Bot-heavy regions with no plan
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every region over the bot share cap has a proposal in front of the owner
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### wait-and-devices:1 Queue wait

- **0**: Players wait past the limits
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Human queue wait p50 and p90 are inside the owner's limits
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### wait-and-devices:2 Input group wait gap

- **0**: The primary group waits longer than the configured limit.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The configured input groups meet the wait-gap target and a dedicated queue has been considered.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety-and-privacy:1 Proposals only

- **0**: The director changed a live setting
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every attempt to apply, rewrite or call a live change through the engine fails, and the engine has no network or write calls
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety-and-privacy:2 No personal data

- **0**: Personal data in the data or the report
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Personal rows are refused, no seat id reaches an output, and planted personal rows are caught
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
