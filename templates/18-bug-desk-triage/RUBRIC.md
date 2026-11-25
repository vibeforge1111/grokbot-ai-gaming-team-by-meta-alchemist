# Playtest Bug Desk & Repro Triage Director: rubric gbf-18-bug-desk-triage v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: The severity anchor names the project-defined P0 scopes used by the engine. Scoring and fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. 1.1.4 to 1.1.5: Links intake, replays and independent closures to cases and derives the lag-cap requirement from build IDs. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged). 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (matchLinesWithActionCapture to playFindingsWithActionCapture; matchLines to playFindings; routedToGrowth to routedToLinkOwner; share-attribution-intake to share-link-intake). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:4b7bc60d6d1dbf94576da56859448d8e1a8c9f04a6811fc76b61b3ceccddb276`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Issue records, replay attempts, build identifiers and independent verification evidence.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `repro`: `highPriority`.
- `flaky`: `flakyReports`.
- `captures`: `playFindings`.
- `dedup`: `distinctPairs`, `sameRoot`, `pairs`.
- `severity`: `tickets`.
- `routing`: `auditDefects`.
- `closure`: `closures`.
- `crashIntake`: `received`.
- `shareIntake`: `reports`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Reproducibility | reproducibility:1 | High-priority reports replay | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line reproducibility:1 |
| Reproducibility | reproducibility:2 | Flaky status kept | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line reproducibility:2 |
| Evidence completeness | evidence-completeness:1 | Captures show real play | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line evidence-completeness:1 |
| Evidence completeness | evidence-completeness:2 | Build lag recorded and applied | 10 | 3 | config | node tests/lens-negative-fixtures.mjs --line evidence-completeness:2 |
| Correct dedup | correct-dedup:1 | Dedup key and owner confirmation | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line correct-dedup:1 |
| Correct dedup | correct-dedup:2 | Similarity cutoff is a candidate generator | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line correct-dedup:2 |
| Severity | severity:1 | Severity vs confidence | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line severity:1 |
| Severity | severity:2 | Review mistakes kept off the game bug list | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line severity:2 |
| Closure quality | closure-quality:1 | Verifier is not the fixer | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line closure-quality:1 |
| Closure quality | closure-quality:2 | Artifact mismatch blocks closure | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line closure-quality:2 |

## Level anchors

### reproducibility:1 High-priority reports replay

- **0**: A high-priority ticket cannot be replayed
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every high-priority report replays from its minimal repro. All approved `intakeReplay` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Start from a read-only high-priority intake export. Match each case to its replay, signature and observed attempt count. Record verified empty intake as a dated zero-row export with no execution credit.

Match each case in `profile.cases.intakeReplay` with one row in `receipts.intakeReplay` by id. Each row needs liveSha and a trace artifact ID. Required fields are ticket (text), signature (text), attempts (positive), reproduced (bool), rewind (artifact:trace), acceptance (text).

Supply `populations.intakeReplay` with count, liveSha, source `read-only-export` and a trace artifact ID. A verified empty export earns U.

Match case field `ticket` to `id` in `metrics.repro.highPriority`.

- `ticket == case.ticket` caps the line at 1 on failure.
- `signature == case.signature` caps the line at 1 on failure.
- `reproduced == true` caps the line at 1 on failure.

### reproducibility:2 Flaky status kept

- **0**: Flaky reported as fixed
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Flaky stays flaky until the repeated-run criterion is met
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### evidence-completeness:1 Captures show real play

- **0**: A capture of loading or menus only is treated as clean play
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Captures cover real action sequences; a menu-only log cannot pass a line about play
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### evidence-completeness:2 Build lag recorded and applied

- **0**: Live build not identified
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Whether the running build is behind the source is recorded, and scores read from its runtime logs are capped while it is behind. All approved `buildLag` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Read the source ancestry and deployed commit from a read-only history export. Compare IDs in the same revision namespace. Unrelated histories stay U.

Match each case in `profile.cases.buildLag` with one row in `receipts.buildLag` by id. Each row needs liveSha and a config artifact ID. Required fields are source (text), live (text), capped (bool), sourceHistory (ids), historyArtifact (artifact:config).

Compute `behind` using `ancestorBehind(sourceHistory, live)`.

Compute `tip` using `last(sourceHistory)`.

- `source == pack.gitSha` caps the line at 1 on failure.
- `live == pack.liveSha` caps the line at 1 on failure.
- `capped == row.behind` caps the line at 1 on failure.
- `tip == row.source` caps the line at 1 on failure.

### correct-dedup:1 Dedup key and owner confirmation

- **0**: Several templates file the same bug as separate tickets
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Two distinct bugs with similar messages stay separate; one root cause reported by several templates is merged after the owner confirms
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### correct-dedup:2 Similarity cutoff is a candidate generator

- **0**: Auto-merge on an unvalidated cutoff
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Similarity candidates (any method) are confirmed by the owner, never auto-merged
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### severity:1 Severity vs confidence

- **0**: Severity inflated by confidence
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Severity and confidence are recorded separately and P0 is limited to the scopes in the project's profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### severity:2 Review mistakes kept off the game bug list

- **0**: Review mistakes filed as game bugs
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Review mistakes go to the review fix list
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### closure-quality:1 Verifier is not the fixer

- **0**: Fixer verifies own fix
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: VERIFIED_FIXED needs a different verifier and raw artifacts. All approved `closureReview` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Use the closure intake export as the expected set. Link the independent verification replay, acceptance test and fixed build.

Match each case in `profile.cases.closureReview` with one row in `receipts.closureReview` by id. Each row needs liveSha and a trace artifact ID. Required fields are ticket (text), fixer (text), verifier (text), fixedBuild (text), replay (artifact:trace), acceptance (text), passed (bool).

Supply `populations.closureReview` with count, liveSha, source `read-only-export` and a trace artifact ID. A verified empty export earns U.

Match case field `ticket` to `ticket` in `metrics.closure.closures`.

- `ticket == case.ticket` caps the line at 1 on failure.
- `verifier != row.fixer` caps the line at 1 on failure.
- `fixedBuild == pack.liveSha` caps the line at 1 on failure.
- `passed == true` caps the line at 1 on failure.

### closure-quality:2 Artifact mismatch blocks closure

- **0**: Closure despite mismatch
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A raw artifact mismatch blocks closure
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
