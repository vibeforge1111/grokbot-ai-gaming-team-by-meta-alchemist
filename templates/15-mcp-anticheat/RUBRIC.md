# Server Fairness & Anti-Cheat Guard: rubric gbf-15-mcp-anticheat-director v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Updated the public source note. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Assist parity compares at least two device samples. Detection rates must agree with their labelled populations. 1.1.4 to 1.1.5: Adds individual authority and reward cases, labelled assist devices and separate client/server geometry, rotation and spawn evidence. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles turn-based, no-input-assist. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (triggerParity to actionParity; wallObscuredSent to hiddenStateSent; relyOnRadiusOnly to relyOnDistanceOnly; interest to hiddenInfo; sybil to multiAccount). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:2e8217e291cc5846098308b08d4006a4b6d04362e0d7d4dae200384016dd01aa`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Server decision logs and synthetic fixtures support the fairness review. Record the confidence and evidence for each finding.

## Approved profiles

- **turn-based**: The server judges turns, not real-time hits, so there is no lag compensation window. Select only after the owner approves it, before scoring. Weights: cadence-and-timing:1 = 20, cadence-and-timing:2 = 0.
- **no-input-assist**: The game has no aim, steering or other input assist. Select only after the owner approves it, before scoring. Weights: parity:1 = 20, parity:2 = 0.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `authority`: `impossibleActions`.
- `clamping`: `malformedInputs`.
- `cadence`: `overRateAttempts`.
- `lagComp`: `rewindMsObserved`.
- `assist`: `strengthByDevicePct`.
- `multiAccount`: `flaggedClusters`.
- `detection`: `negativeCases`, `positiveCases`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Server authority | server-authority:1 | Server decides every action and reward (for example moves, turns, hits, scores, rewards) | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line server-authority:1 |
| Server authority | server-authority:2 | Input validation and clamping | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line server-authority:2 |
| Cadence and timing | cadence-and-timing:1 | Action rate and cooldown enforcement | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line cadence-and-timing:1 |
| Cadence and timing | cadence-and-timing:2 | Lag compensation window integrity (only for real-time hit judging) | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line cadence-and-timing:2 |
| Parity | parity:1 | Same action rules for humans, bots and scripted input | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line parity:1 |
| Parity | parity:2 | Input assist parity across devices (only with input assists) | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line parity:2 |
| Exposure and abuse | exposure-and-abuse:1 | Hidden information stays hidden | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line exposure-and-abuse:1 |
| Exposure and abuse | exposure-and-abuse:2 | Flooding, malformed packets, connection abuse | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line exposure-and-abuse:2 |
| Recovery and detection | recovery-and-detection:1 | Reconnect and duplicate-join handling | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line recovery-and-detection:1 |
| Recovery and detection | recovery-and-detection:2 | Score and reward integrity, detection and review | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line recovery-and-detection:2 |

## Level anchors

### server-authority:1 Server decides every action and reward (for example moves, turns, hits, scores, rewards)

- **0**: The server accepts a forbidden case or grants a reward different from the expected quantity.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Impossible actions rejected in authorized local tests. All approved `authorityCases` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Use sanitized results from a human-run isolated defensive harness. Match each labelled case to its authoritative decision and reward state.

Match each case in `profile.cases.authorityCases` with one row in `receipts.authorityCases` by id. Each row needs liveSha and a trace artifact ID. Required fields are scenario (text), isolated (bool), decision (text), rewardBefore (count), rewardAfter (count).

The row count must match `metrics.authority.impossibleActions`.

- `scenario == case.scenario` caps the line at 1 on failure.
- `isolated == true` caps the line at 1 on failure.
- `decision == case.expected` caps the line at 0 on failure.
- `rewardAfter == case.expectedReward` caps the line at 0 on failure.

### server-authority:2 Input validation and clamping

- **0**: Unclamped input accepted
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Move, aim, finite checks and lengths clamp in tests
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### cadence-and-timing:1 Action rate and cooldown enforcement

- **0**: An action ran faster than its allowed rate in an authorized test
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Server enforces cadence in tests
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### cadence-and-timing:2 Lag compensation window integrity (only for real-time hit judging)

- **0**: Window exceeds policy
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Lag compensation respects the declared timing policy
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### parity:1 Same action rules for humans, bots and scripted input

- **0**: Bots or scripts get an action rule humans do not
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Humans and bots follow the same action rules
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### parity:2 Input assist parity across devices (only with input assists)

- **0**: One device gets an undeclared edge
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Assist equal across devices per design. All approved `assistDevices` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare the supported devices by distinct input ID and measured assist strength.

Match each case in `profile.cases.assistDevices` with one row in `receipts.assistDevices` by id. Each row needs liveSha and a trace artifact ID. Required fields are device (text), strengthPct (number).

Cover every combination of device from profile.assistDevices.

The spread across `strengthPct` must stay within `profile.maxAssistDeltaPct` or the line is capped at 1.

- `device == case.device` caps the line at 1 on failure.
- `strengthPct >= 0` caps the line at 1 on failure.
- `strengthPct <= 100` caps the line at 1 on failure.

### exposure-and-abuse:1 Hidden information stays hidden

- **0**: The client and server geometry, rotation or spawn digests disagree.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Information a player should not have (behind walls, under fog of war, in an opponent's hand) is minimized per design; distance alone is not protection. All approved `sceneParity` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare independently produced client and server canonical geometry, rotation and spawn digests for the approved scene and coordinate system.

Match each case in `profile.cases.sceneParity` with one row in `receipts.sceneParity` by id. Each row needs liveSha and a trace artifact ID. Required fields are scene (text), coordinates (text), clientGeometry (sha256), serverGeometry (sha256), clientRotation (sha256), serverRotation (sha256), clientSpawn (sha256), serverSpawn (sha256), clientExport (artifact:trace), serverExport (artifact:trace).

- `scene == case.scene` caps the line at 1 on failure.
- `coordinates == case.coordinates` caps the line at 1 on failure.
- `clientExport != row.serverExport` caps the line at 1 on failure.
- `clientGeometry == row.serverGeometry` caps the line at 0 on failure.
- `clientRotation == row.serverRotation` caps the line at 0 on failure.
- `clientSpawn == row.serverSpawn` caps the line at 0 on failure.

### exposure-and-abuse:2 Flooding, malformed packets, connection abuse

- **0**: A flood degrades a session
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Rate and malformed-message tests bounded
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### recovery-and-detection:1 Reconnect and duplicate-join handling

- **0**: A duplicate join takes another player's place or duplicates state
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Duplicate joins and reconnects handled safely
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### recovery-and-detection:2 Score and reward integrity, detection and review

- **0**: A detector passes because it exists
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Detection meets approved false positive and false negative budgets, including assistive input
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
