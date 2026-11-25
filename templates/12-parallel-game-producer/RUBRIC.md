# Parallel Game Producer and Pitch Architect: rubric gbf-12-parallel-game-producer v2.0.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

Replaces studio-specific coordination claims with row-derived counts, predecessor evidence, shared-resource checks and pitch review. Start a new baseline at this version.

- Scale: 100 points. Contribution: weight x level / 4.
- Game profile: Owner-approved pack.profile defines the game facts, scope and budgets. Hash: `sha256:2a426f5750e59d859403b889ada50f041e135240de0816914b7fa65708676a88`.
- Score the share of observed cases meeting each condition against the profile floor, pass share and target.
- Open P0s and confirmed release blockers set the grade to 0. Missing observations reduce coverage. Invalid packs have a null grade.
- Evidence: An owner-approved ledger export, task graph, time and capacity estimates, discipline receipts, approved pitch facts and a reviewed local deck.

## Evidence populations

Every line reads uniquely keyed sample rows from its own receipt. Empty lists and zero measured cases give U and earn 0 points. Fractions use all eligible observed opportunities.

- `scope`: `samples`.
- `capacity`: `samples`.
- `dependency`: `samples`.
- `locks`: `samples`.
- `counts`: `samples`.
- `closure`: `samples`.
- `gate`: `samples`.
- `risk`: `samples`.
- `claims`: `samples`.
- `review`: `samples`.

## Release blockers

- A consumer ran before a required predecessor passed, or a required predecessor timed out. (`workstreams:1`).
- Two tasks in one wave claim an exclusive resource. (`workstreams:2`).
- A required discipline gate has a measured failure. (`release-decision:1`).

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Milestone | milestone:1 | Milestone work has acceptance evidence | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line milestone:1 |
| Milestone | milestone:2 | Role load fits wave capacity | 10 | 3 | config | node tests/lens-negative-fixtures.mjs --line milestone:2 |
| Workstreams | workstreams:1 | Predecessor receipts precede handoff | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line workstreams:1 |
| Workstreams | workstreams:2 | Parallel tasks respect exclusive locks | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line workstreams:2 |
| Ledger | ledger:1 | Backlog counts reconcile to ticket rows | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line ledger:1 |
| Ledger | ledger:2 | Closure has independent live verification | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line ledger:2 |
| Release decision | release-decision:1 | Required discipline gates pass | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line release-decision:1 |
| Release decision | release-decision:2 | Risks have owned decision paths | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line release-decision:2 |
| Pitch | pitch:1 | Pitch claims trace to approved facts | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line pitch:1 |
| Pitch | pitch:2 | Deck covers the reviewed decision | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line pitch:2 |

## Level anchors

### milestone:1 Milestone work has acceptance evidence

- **0**: No measured case meets this condition: each sampled deliverable has a role, done condition and named verification source.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: each sampled deliverable has a role, done condition and named verification source.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### milestone:2 Role load fits wave capacity

- **0**: No measured case meets this condition: the sum of assigned hours per role and wave fits its approved capacity envelope.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the sum of assigned hours per role and wave fits its approved capacity envelope.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### workstreams:1 Predecessor receipts precede handoff

- **0**: No measured case meets this condition: the consumer starts after its predecessor has current passing evidence.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the consumer starts after its predecessor has current passing evidence.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### workstreams:2 Parallel tasks respect exclusive locks

- **0**: No measured case meets this condition: tasks in the same wave never hold conflicting write locks.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: tasks in the same wave never hold conflicting write locks.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### ledger:1 Backlog counts reconcile to ticket rows

- **0**: No measured case meets this condition: the reported count in each severity bucket equals the count derived from distinct open rows.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the reported count in each severity bucket equals the count derived from distinct open rows.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### ledger:2 Closure has independent live verification

- **0**: No measured case meets this condition: a claimed closure has current verification by another role and its required config state.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: a claimed closure has current verification by another role and its required config state.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### release-decision:1 Required discipline gates pass

- **0**: No measured case meets this condition: the required gate reports a passing result for the decision build.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the required gate reports a passing result for the decision build.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### release-decision:2 Risks have owned decision paths

- **0**: No measured case meets this condition: the risk has an owner, trigger, fallback and decision point.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the risk has an owner, trigger, fallback and decision point.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### pitch:1 Pitch claims trace to approved facts

- **0**: No measured case meets this condition: the slide claim matches an approved project fact and cites its evidence.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the slide claim matches an approved project fact and cites its evidence.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.

### pitch:2 Deck covers the reviewed decision

- **0**: No measured case meets this condition: the reviewer signed off the current slide for the required audience and ask.
- **1**: Some cases meet the condition, below the profile floor.
- **2**: The observed share reaches the floor and falls short of the pass share.
- **3**: The observed share reaches the pass share and falls short of the target.
- **4**: At least the target share of cases shows this outcome: the reviewer signed off the current slide for the required audience and ask.
- **U**: UNMEASURED. The receipt, population, required observation or approved budget is missing, stale or unusable.
