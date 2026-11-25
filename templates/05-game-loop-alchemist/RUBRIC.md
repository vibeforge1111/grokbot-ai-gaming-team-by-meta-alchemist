# Game Loop Alchemist: rubric gbf-05-game-loop-alchemist v2.0.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Replaces mechanic-specific milestones and inherited stopwatch values with current-build choice, feedback and replay receipts. Start a new baseline at this version.

- Scale: 100 points. Contribution: weight x level / 4.
- Game profile: Owner-approved pack.profile defines the game facts, scope and budgets. Hash: `sha256:c7916c67867c9ceeefee9f490730a995a56ad0297124a9e73664bb8c7bbb6d19`.
- Score the share of observed cases meeting each condition against the profile floor, pass share and target.
- Open P0s and confirmed release blockers set the grade to 0. Missing observations reduce coverage. Invalid packs have a null grade.
- Evidence: Timestamped first-session traces, anonymous playtest observations and return opportunities from a closed observation window.

## Evidence populations

Every line reads uniquely keyed sample rows from its own receipt. Empty lists and zero measured cases give U and earn 0 points. Fractions use all eligible observed opportunities.

- `goal`: `samples`.
- `action`: `samples`.
- `state`: `samples`.
- `feedback`: `samples`.
- `beat`: `samples`.
- `recovery`: `samples`.
- `choice`: `samples`.
- `exit`: `samples`.
- `reason`: `samples`.
- `return`: `samples`.

## Release blockers

- A witnessed stop request forced another cycle. (`agency:2`).

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Opening | opening:1 | Opening goal understood | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line opening:1 |
| Opening | opening:2 | Time to meaningful action | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line opening:2 |
| Consequence | consequence:1 | Action produces its intended state | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line consequence:1 |
| Consequence | consequence:2 | Feedback explains the consequence | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line consequence:2 |
| Pacing | pacing:1 | Time between decisions | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line pacing:1 |
| Pacing | pacing:2 | Time to regain agency | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line pacing:2 |
| Agency | agency:1 | A choice changes the next beat | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line agency:1 |
| Agency | agency:2 | An explicit stop is honored | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line agency:2 |
| Replay | replay:1 | Reason to replay is intrinsic | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line replay:1 |
| Replay | replay:2 | Voluntary replay after an opportunity | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line replay:2 |

## Level anchors

### opening:1 Opening goal understood

- **0**: No measured case meets this condition: the unaided readback identifies the intended goal.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the unaided readback identifies the intended goal.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### opening:2 Time to meaningful action

- **0**: No measured case meets this condition: the first meaningful action falls within the action budget.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the first meaningful action falls within the action budget.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### consequence:1 Action produces its intended state

- **0**: No measured case meets this condition: the observed state matches the profile's expected consequence.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the observed state matches the profile's expected consequence.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### consequence:2 Feedback explains the consequence

- **0**: No measured case meets this condition: the participant can explain what changed from the feedback.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the participant can explain what changed from the feedback.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### pacing:1 Time between decisions

- **0**: No measured case meets this condition: the next decision becomes available within the beat budget.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the next decision becomes available within the beat budget.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### pacing:2 Time to regain agency

- **0**: No measured case meets this condition: control returns within the approved recovery budget.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: control returns within the approved recovery budget.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### agency:1 A choice changes the next beat

- **0**: No measured case meets this condition: the alternative input leads to its intended distinct state.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the alternative input leads to its intended distinct state.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### agency:2 An explicit stop is honored

- **0**: No measured case meets this condition: an explicit stop ends the loop at the promised boundary.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: an explicit stop ends the loop at the promised boundary.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### replay:1 Reason to replay is intrinsic

- **0**: No measured case meets this condition: the participant identifies an enjoyable choice, challenge or discovery.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the participant identifies an enjoyable choice, challenge or discovery.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### replay:2 Voluntary replay after an opportunity

- **0**: No measured case meets this condition: the participant voluntarily takes another eligible turn within the window.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the participant voluntarily takes another eligible turn within the window.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.
