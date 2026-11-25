# Game Economy Director: rubric gbf-06-game-economy-director v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Clarified the public rubric wording and evidence descriptions. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. 1.1.4 to 1.1.5: Adds model selection, seeded storage comparison and isolated entitlement drill receipts. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-combat, no-store. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (perWeaponP50S to perAttackP50S; maxFocusFireErrS to maxMultiAttackerErrS; focusFire to multiAttacker; ttkBandS to timeToDefeatBandS; maxLootIntervalWidth to maxRewardIntervalWidth; maxTierDays to maxProgressStepDays; tierDaysEstimate to stepDaysEstimate; minF2pShareOfPaid to minFreeShareOfPaid; freeItemsPerSeason to freeItemsPerPeriod; paidItemsPerSeason to paidItemsPerPeriod; passEdge to paidEdge; passItems to paidOfferItems; pass-paid-edge to paid-advantage; ttk to timeToDefeat; loot to randomRewards; f2p to freeVsPaid). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:3b51548e25131d097b6fde7b4a445d5b9cc1a0a531da214e9d22dc03e13d36aa`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Resource definitions, session logs, simulated distributions and reconciliation tests from your game.

## Approved profiles

- **no-combat**: The game has no combat; its 20 points are shared over the other lines. Select only after the owner approves it, before scoring. Weights: combat-balance:1 = 0, combat-balance:2 = 0, loot-access:1 = 12.5, loot-access:2 = 12.5, progression:1 = 12.5, progression:2 = 12.5, reward-fairness:1 = 12.5, reward-fairness:2 = 12.5, entitlement-consistency:1 = 12.5, entitlement-consistency:2 = 12.5.
- **no-store**: The game sells nothing (no paid items, currency or access). Select only after the owner approves it, before scoring. Weights: reward-fairness:1 = 20, reward-fairness:2 = 0, entitlement-consistency:1 = 0, entitlement-consistency:2 = 20.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `timeToDefeat`: `perAttackP50S`.
- `multiAttacker`: `examples`.
- `randomRewards`: `drops`.
- `reachability`: `requiredPaths`.
- `progression`: `assumptionsStated`.
- `storage`: `pathACounts`.
- `rewards`: `retriesSimulated`.
- `freeVsPaid`: `paidItemsPerPeriod`.
- `payments`: `failurePathTests`.
- `balance`: `operations`.
- `storePricing`: `items`.
- `paidEdge`: `paidOfferItems`, `reviewedItems`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Combat balance | combat-balance:1 | Time to defeat a target (only with combat) | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line combat-balance:1 |
| Combat balance | combat-balance:2 | Multi-attacker damage follows the build's rules | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line combat-balance:2 |
| Rewards and goal access | loot-access:1 | Random reward rates reported with intervals | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line loot-access:1 |
| Rewards and goal access | loot-access:2 | No unreachable required path | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line loot-access:2 |
| Progression | progression:1 | Time to the next progression step states its assumptions | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line progression:1 |
| Progression | progression:2 | Progress consistency across save paths | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line progression:2 |
| Reward fairness | reward-fairness:1 | Idempotent reward counting | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line reward-fairness:1 |
| Reward fairness | reward-fairness:2 | Free and paid paths compared (only if the game sells something) | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line reward-fairness:2 |
| Entitlement consistency | entitlement-consistency:1 | Payment safety fails closed | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line entitlement-consistency:1 |
| Entitlement consistency | entitlement-consistency:2 | Displayed vs authoritative balance | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line entitlement-consistency:2 |

## Level anchors

### combat-balance:1 Time to defeat a target (only with combat)

- **0**: Time to defeat estimated from averages, or with an attacker multiplier the game does not use
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Per-weapon or per-attack time-to-defeat distributions simulated from the build's definitions, labelled simulated, checked against recorded fights
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### combat-balance:2 Multi-attacker damage follows the build's rules

- **0**: A damping factor or multiplier the game does not have is used
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Multi-attacker examples follow the implemented cadence and hit model (no damper the game does not have). All approved `modelInputs` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Link the versioned build configuration and an independently recorded timing trace. Export effective post-rounding damage and timestamps for each staggered contribution.

Match each case in `profile.cases.modelInputs` with one row in `receipts.modelInputs` by id. Each row needs liveSha and a static artifact ID. Required fields are config (artifact:config), timingTrace (artifact:trace), seed (text), rounding (text), cadence (text), reload (text), routing (text).

- `routing == case.routing` caps the line at 1 on failure.

### loot-access:1 Random reward rates reported with intervals

- **0**: Random reward rates claimed without intervals
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Reward rates from the reward table source are reported with probability intervals
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### loot-access:2 No unreachable required path

- **0**: A required path is unreachable
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No required progression path becomes unreachable
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### progression:1 Time to the next progression step states its assumptions

- **0**: Completion time claimed without assumptions
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Estimates of time to the next progression step state daily play and success assumptions. Every approved simulationRun case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Save the seeded cohort, action schedule, horizon and model inputs with replicate count and estimated interval.

Match each case in `profile.cases.simulationRun` with one row in `receipts.simulationRun` by id. Each row needs liveSha and a static artifact ID. Required fields are cohort (text), seed (text), horizon (positive), repetitions (positive), config (artifact:config), lowDays (number), estimateDays (number), highDays (number).

- `lowDays <= row.estimateDays` caps the line at 1 on failure.
- `highDays >= row.estimateDays` caps the line at 1 on failure.
- `estimateDays <= profile.maxProgressStepDays` caps the line at 2 on failure.

### progression:2 Progress consistency across save paths

- **0**: Save paths disagree
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Each supported save path counts progress identically. All approved `storageReplay` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Replay the same seeded operation sequence using each approved storage path and compare authoritative terminal state.

Match each case in `profile.cases.storageReplay` with one row in `receipts.storageReplay` by id. Each row needs liveSha and a trace artifact ID. Required fields are path (text), seed (text), operationDigest (sha256), stateDigest (sha256).

- `path == case.path` caps the line at 1 on failure.
- `seed == case.seed` caps the line at 1 on failure.
- `operationDigest == case.operationDigest` caps the line at 1 on failure.
- `stateDigest == case.stateDigest` caps the line at 1 on failure.

### reward-fairness:1 Idempotent reward counting

- **0**: A retry double-counts or drops a reward
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Reward counting stays idempotent on every supported save path under retry
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### reward-fairness:2 Free and paid paths compared (only if the game sells something)

- **0**: Paid advantage claimed or denied without data
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Free and paid paths are compared with stated assumptions
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### entitlement-consistency:1 Payment safety fails closed

- **0**: An isolated entitlement drill produces an authoritative quantity different from the expected quantity.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Failure-path tests prove a failed or duplicate payment never grants or loses an item; without them this line fails closed. All approved `entitlementDrills` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Use owner-run isolated cases. Compare authoritative state with expected post-retry and post-rollback quantities.

Match each case in `profile.cases.entitlementDrills` with one row in `receipts.entitlementDrills` by id. Each row needs liveSha and a trace artifact ID. Required fields are isolated (bool), expected (count), observed (count), snapshot (artifact:trace).

- `isolated == true` caps the line at 1 on failure.
- `observed == row.expected` caps the line at 0 on failure.

### entitlement-consistency:2 Displayed vs authoritative balance

- **0**: Displayed balance diverges from server state
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Displayed balances match server state after every operation
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
