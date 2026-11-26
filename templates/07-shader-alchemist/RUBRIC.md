# TSL and WebGPU Shader Alchemist: rubric gbf-07-shader-alchemist v0.1.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Initial 0.1.0 preview: shader grades from owner-supplied evidence.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:a05032c9377be207981311d5a4a4256ddd52e0360dd221c5d79239c3b4ac7cdb`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- Report the verdict and coverage beside the grade.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty or missing evidence earns U.


| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Compile | compile:1 | Required shaders compile without failure | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line compile:1 |
| Compile | compile:2 | Pre-warm stays inside the owner time budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line compile:2 |
| Parity | parity:1 | Required backends were compared | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line parity:1 |
| Parity | parity:2 | Backends match, with no silent fallback | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line parity:2 |
| Budget | budget:1 | GPU time stays inside the owner budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line budget:1 |
| Budget | budget:2 | Shader memory stays inside the owner budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line budget:2 |
| Variants | variants:1 | Required variants were built | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line variants:1 |
| Variants | variants:2 | Debug variants are not shipped | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line variants:2 |
| Safety | safety:1 | Shader sources and logs do not contain secrets | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:1 |
| Safety | safety:2 | The pack names its build | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line safety:2 |

## Level anchors

### compile:1 Required shaders compile without failure

- **0**: Required shaders fail to compile
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Compile failures are zero for the required set
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### compile:2 Pre-warm stays inside the owner time budget

- **0**: Pre-warm is far past the budget, or required variants hitch on first use
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Pre-warm time is inside the owner-set budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### parity:1 Required backends were compared

- **0**: A required backend was skipped
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every required backend was compared
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### parity:2 Backends match, with no silent fallback

- **0**: Backends disagree, or a backend silently dropped to a cheaper path
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Parity mismatches and silent fallbacks are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### budget:1 GPU time stays inside the owner budget

- **0**: GPU time regularly exceeds the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: p95 GPU time is inside the owner-set budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### budget:2 Shader memory stays inside the owner budget

- **0**: Shader memory is far past the budget
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Reported memory is inside the owner-set budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### variants:1 Required variants were built

- **0**: A required variant is missing
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Built variants meet the owner-set minimum
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### variants:2 Debug variants are not shipped

- **0**: A debug variant shipped in the intended build
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Debug variants shipped in the build are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:1 Shader sources and logs do not contain secrets

- **0**: Keys or secrets appear in shader sources or logs
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Secret leaks are zero
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### safety:2 The pack names its build

- **0**: The pack is missing a git SHA or a live SHA
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The pack records both a git SHA and a live SHA
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
