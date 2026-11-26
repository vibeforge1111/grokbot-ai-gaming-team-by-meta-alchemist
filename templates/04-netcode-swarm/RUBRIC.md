# Multiplayer Netcode and Bot-Swarm Director: rubric gbf-04-netcode-swarm v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: netcode grades from owner-supplied evidence.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:d7b839256c87bd31331607986e3c31637529747f542495078c2beb8f7813eff4`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Prediction | prediction:1 | Prediction error stays inside the owner budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line prediction:1 |
| Prediction | prediction:2 | Interpolation does not overshoot the confirmed pose | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line prediction:2 |
| Authority | authority:1 | Required events are decided by the server | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line authority:1 |
| Authority | authority:2 | No valuable event is trusted from the client alone | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line authority:2 |
| Sync | sync:1 | Desync rate stays inside the soak budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line sync:1 |
| Sync | sync:2 | The soak lasts at least the owner-set duration | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line sync:2 |
| Swarm | swarm:1 | Scripted bot scenarios complete | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line swarm:1 |
| Swarm | swarm:2 | Bots are flagged and never counted as players | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line swarm:2 |
| Safety | safety:1 | Traces do not contain personal data | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:1 |
| Safety | safety:2 | The pack names its build and the run does not write to a live server | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:2 |

## Level anchors

### prediction:1 Prediction error stays inside the owner budget

- **0**: Predicted state regularly misses the confirmed state by more than the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: p95 prediction error is inside the owner-set budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### prediction:2 Interpolation does not overshoot the confirmed pose

- **0**: Interpolation regularly travels past the confirmed pose
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Interpolation overshoot stays at or below the profile maximum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authority:1 Required events are decided by the server

- **0**: Required events are accepted from a client claim with no server check
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required event type in the profile is server-owned
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authority:2 No valuable event is trusted from the client alone

- **0**: A client can grant a score, item, or outcome without a server check
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Client-trusted valuable events are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### sync:1 Desync rate stays inside the soak budget

- **0**: Desyncs are common during the soak
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Desync rate is at or below the owner-set maximum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### sync:2 The soak lasts at least the owner-set duration

- **0**: The soak is far shorter than the agreed duration, or was not run
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Soak length meets the owner-set minimum, in minutes
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### swarm:1 Scripted bot scenarios complete

- **0**: Scripted bot scenarios rarely complete
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Completed bot scenarios meet the owner-set minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### swarm:2 Bots are flagged and never counted as players

- **0**: Bots are counted as real players, or they are not flagged
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every bot is flagged as a bot and none are counted as players
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:1 Traces do not contain personal data

- **0**: Names, handles, emails, or raw user ids appear in traces or reports
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Personal-data leaks in traces and reports are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:2 The pack names its build and the run does not write to a live server

- **0**: The pack is missing a build id, or the run wrote to a live server
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records git and live SHAs, and live server writes are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
