# Live Service, Payments and Trust: rubric gbf-22-live-service-trust v1.2.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Clarified the public rubric wording and evidence descriptions. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Measured release blockers override the numerical grade. The owner profile declares supported storage and recovery cases. 1.1.4 to 1.1.5: Adds case-level transaction blockers, recovery state comparisons, build and rollback receipts and separate reviewer decisions. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-store.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:b4a123e8d9ff1a8ea88e7986fd3acb84a488bbb86fc8aeff214d55364db1bc34`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks. Each confirmed release blocker sets verdict BLOCKED and grade 0. Supported points, coverage and the evidence interval retain their uncapped values. Unmeasured safety evidence prevents PASS.
- Evidence: Transaction and recovery fixtures, service records and the project’s rights and privacy documentation.

## Approved profiles

- **no-store**: The game sells nothing; its 20 points are shared over the other lines and the payment blockers do not apply. Select only after the owner approves it, before scoring. Weights: transactions-and-entitlements:1 = 0, transactions-and-entitlements:2 = 0, authorization-and-abuse-boundaries:1 = 12.5, authorization-and-abuse-boundaries:2 = 12.5, durability-and-recovery:1 = 12.5, durability-and-recovery:2 = 12.5, operations:1 = 12.5, operations:2 = 12.5, privacy-age-rights-safety-and-support:1 = 12.5, privacy-age-rights-safety-and-support:2 = 12.5.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `tx`: `injectedCases`.
- `restore`: `expected`.
- `authz`: `forbiddenTransitionsAttempted`.
- `replay`: `replaysAttempted`.
- `storage`: `cases`.
- `recovery`: `cases`.
- `storePolicy`: `platforms`.

## Release blockers

- Confirmed paid-item loss blocks release. (`transactions-and-entitlements:1`).
- A duplicate paid grant blocks release. (`transactions-and-entitlements:1`).
- A measured entitlement shortfall after restore blocks release. (`transactions-and-entitlements:2`).
- An accepted transaction replay blocks release. (`authorization-and-abuse-boundaries:2`).

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Transactions and entitlements | transactions-and-entitlements:1 | Failed, duplicate and reordered operations | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line transactions-and-entitlements:1 |
| Transactions and entitlements | transactions-and-entitlements:2 | Restore and reconciliation | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line transactions-and-entitlements:2 |
| Authorization and abuse boundaries | authorization-and-abuse-boundaries:1 | Access isolation and state transitions | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line authorization-and-abuse-boundaries:1 |
| Authorization and abuse boundaries | authorization-and-abuse-boundaries:2 | Replay resistance and bounded resources | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line authorization-and-abuse-boundaries:2 |
| Durability and recovery | durability-and-recovery:1 | Storage failure and migration | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line durability-and-recovery:1 |
| Durability and recovery | durability-and-recovery:2 | Crash, concurrent sessions and deployment interruption | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line durability-and-recovery:2 |
| Operations | operations:1 | Live build vs graded build | 10 | 3 | config | node tests/lens-negative-fixtures.mjs --line operations:1 |
| Operations | operations:2 | Service health, incident drill and rollback | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line operations:2 |
| Privacy, age, rights, safety and support | privacy-age-rights-safety-and-support:1 | Privacy and data handling | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line privacy-age-rights-safety-and-support:1 |
| Privacy, age, rights, safety and support | privacy-age-rights-safety-and-support:2 | Rights, age, safety and support | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line privacy-age-rights-safety-and-support:2 |

## Level anchors

### transactions-and-entitlements:1 Failed, duplicate and reordered operations

- **0**: An isolated case shows a lost or duplicated paid entitlement.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Injected failure, duplicate and reorder cases never lose or duplicate a paid item, in an isolated test service. All approved `transactionOutcomes` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Read authoritative before and after entitlement state from isolated owner-run transactions. Report measured lost or duplicate paid units even if another case was skipped.

Match each case in `profile.cases.transactionOutcomes` with one row in `receipts.transactionOutcomes` by id. Each row needs liveSha and a trace artifact ID. Required fields are scenario (text), isolated (bool), lostPaid (count), duplicatedPaid (count), before (artifact:trace), after (artifact:trace).

A confirmed failure on lostPaid, duplicatedPaid blocks release, including when another case is missing.

- `scenario == case.scenario` caps the line at 1 on failure.
- `isolated == true` caps the line at 1 on failure.
- `lostPaid == 0` caps the line at 0 on failure.
- `duplicatedPaid == 0` caps the line at 0 on failure.

### transactions-and-entitlements:2 Restore and reconciliation

- **0**: Restore fails
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Restored access and displayed vs authoritative outcomes reconcile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authorization-and-abuse-boundaries:1 Access isolation and state transitions

- **0**: Unauthorized transition succeeds
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Only permitted state transitions succeed
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authorization-and-abuse-boundaries:2 Replay resistance and bounded resources

- **0**: Replay accepted
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Replays rejected and resource use bounded
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### durability-and-recovery:1 Storage failure and migration

- **0**: Recovered storage has a different state digest from the expected state.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Each supported storage failure and migration case preserves acknowledged state. All approved `storageOutcomes` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare the recovered state with its expected digest for each failure path in the approved architecture.

Match each case in `profile.cases.storageOutcomes` with one row in `receipts.storageOutcomes` by id. Each row needs liveSha and a trace artifact ID. Required fields are scenario (text), expected (sha256), recovered (sha256).

Cover every combination of scenario from profile.storageCases.

- `scenario == case.scenario` caps the line at 1 on failure.
- `expected == case.expected` caps the line at 1 on failure.
- `recovered == row.expected` caps the line at 0 on failure.

### durability-and-recovery:2 Crash, concurrent sessions and deployment interruption

- **0**: The recovery drill restores a state with the wrong digest.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every interruption case required by the approved service architecture recovers. All approved `recoveryOutcomes` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare the recovered state with its expected digest for each failure path in the approved architecture.

Match each case in `profile.cases.recoveryOutcomes` with one row in `receipts.recoveryOutcomes` by id. Each row needs liveSha and a trace artifact ID. Required fields are scenario (text), expected (sha256), recovered (sha256).

Cover every combination of scenario from profile.recoveryCases.

- `scenario == case.scenario` caps the line at 1 on failure.
- `expected == case.expected` caps the line at 1 on failure.
- `recovered == row.expected` caps the line at 0 on failure.

### operations:1 Live build vs graded build

- **0**: Grade issued without live identity
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The running or published build id, how far it is behind the source, and its running config are recorded from the pack; no grade without the running build id. All approved `runningBuild` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Identify the deployed build, source build and running configuration from the runtime receipt.

Match each case in `profile.cases.runningBuild` with one row in `receipts.runningBuild` by id. Each row needs liveSha and a config artifact ID. Required fields are source (text), running (text), configuration (sha256).

- `source == pack.gitSha` caps the line at 1 on failure.
- `running == pack.liveSha` caps the line at 1 on failure.

### operations:2 Service health, incident drill and rollback

- **0**: The completed rollback restores the wrong target.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Health signals, an incident drill and an exercised rollback are recorded. All approved `rollback` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Distinguish an unobserved rollback from an executed drill restoring the wrong state.

Match each case in `profile.cases.rollback` with one row in `receipts.rollback` by id. Each row needs liveSha and a trace artifact ID. Required fields are target (text), restored (text), isolated (bool), ownerRole (text).

- `isolated == true` caps the line at 1 on failure.
- `restored == row.target` caps the line at 0 on failure.

### privacy-age-rights-safety-and-support:1 Privacy and data handling

- **0**: A qualified reviewer rejects the evidence for an applicable privacy obligation.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Data handling and retention documented and checked as files. All approved `privacyReview` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Attach a qualified reviewer decision and the evidence inspected for each applicable obligation.

Match each case in `profile.cases.privacyReview` with one row in `receipts.privacyReview` by id. Each row needs liveSha and a static artifact ID. Required fields are topic (text), reviewer (text), reviewedRecord (artifact:static), accepted (bool).

- `topic == case.topic` caps the line at 1 on failure.
- `accepted == true` caps the line at 0 on failure.

### privacy-age-rights-safety-and-support:2 Rights, age, safety and support

- **0**: A qualified reviewer rejects the evidence for an applicable rights, age, safety or support obligation.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Rights inventory and a recorded qualified review exist; the agent checks completeness, never gives legal sign-off. All approved `rightsReview` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Attach a qualified reviewer decision and the evidence inspected for each applicable obligation.

Match each case in `profile.cases.rightsReview` with one row in `receipts.rightsReview` by id. Each row needs liveSha and a static artifact ID. Required fields are topic (text), reviewer (text), reviewedRecord (artifact:static), accepted (bool).

- `topic == case.topic` caps the line at 1 on failure.
- `accepted == true` caps the line at 0 on failure.
