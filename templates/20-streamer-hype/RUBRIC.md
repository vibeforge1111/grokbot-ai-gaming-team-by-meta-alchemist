# Streamer Scout, Patch Notes & Update Hype Director: rubric gbf-20-streamer-hype-director v1.4.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged. 1.1.1 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Measured release blockers override the numerical grade. Check the attribution query key and score commit-backed draft notes. 1.1.4 to 1.1.5: Adds partner-feed delay and disclosure blockers, paired capture overhead and per-claim shipped switch evidence. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-spectator-mode, no-share-links. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (spectateLinks to spectatorLinks; spectateRead to spectatorRead; openedLiveMatch to openedIntendedView; spectate-links to spectator-links; spectate to spectatorPolicy). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0. 1.3.0 to 1.4.0: adds the owner-selected no-streamer-mode profile (creator-controls:1 not applicable, its redaction blockers do not apply). Lines, weights, conditions and pass marks unchanged.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:fdc88981a6561afc9abeaba8f148fdaeb64950463794d0271511cb08686530f4`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks. Each confirmed release blocker sets verdict BLOCKED and grade 0. Supported points, coverage and the evidence interval retain their uncapped values. Unmeasured safety evidence prevents PASS.
- Evidence: Gameplay recordings, spectator captures, redaction checks and release records for published claims.

## Approved profiles

- **no-spectator-mode**: The game has no spectator or live viewing mode; its 20 points are shared over the other lines and the spectator feed blockers do not apply. Select only after the owner approves it, before scoring. Weights: capture-reliability:1 = 12.5, capture-reliability:2 = 12.5, spectator-comprehension:1 = 0, spectator-comprehension:2 = 0, creator-controls:1 = 12.5, creator-controls:2 = 12.5, truthful-claims:1 = 12.5, truthful-claims:2 = 12.5, player-safety:1 = 12.5, player-safety:2 = 12.5.
- **no-share-links**: The game offers no share or watch links. Select only after the owner approves it, before scoring. Weights: creator-controls:1 = 20, creator-controls:2 = 0.
- **no-streamer-mode**: The game has no streamer mode and never shows player names, chat or account details on screen, so there is nothing to redact; the redaction blockers do not apply. Select only after the owner approves it, before scoring. Weights: creator-controls:1 = 0, creator-controls:2 = 20.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `captureCost`: `frameMsOn`.
- `spectatorRead`: `resolutionsChecked`.
- `links`: `links`.
- `notes`: `lines`.
- `claims`: `claims`.
- `spectatorLinks`: `tested`.
- `creatorLog`: `choices`.

## Release blockers

- A measured spectator information policy violation blocks release. (`spectator-comprehension:1`).
- A measured spectator feed or stream delay violation blocks release. (`spectator-links`).
- A player name exposed in the streamer capture blocks release. (`creator-controls:1`).
- Sensitive information exposed in the streamer capture blocks release. (`creator-controls:1`).
- A tested spectator feed that fails to open as intended blocks release. (`spectator-links`).

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Capture reliability | capture-reliability:1 | Recording replays and exports | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line capture-reliability:1 |
| Capture reliability | capture-reliability:2 | Capture performance budget | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line capture-reliability:2 |
| Spectator comprehension | spectator-comprehension:1 | Spectator view shows only allowed information | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line spectator-comprehension:1 |
| Spectator comprehension | spectator-comprehension:2 | Spectator view readable at stream resolutions | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line spectator-comprehension:2 |
| Creator controls | creator-controls:1 | Streamer mode and redaction | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line creator-controls:1 |
| Creator controls | creator-controls:2 | Share links | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line creator-controls:2 |
| Truthful claims | truthful-claims:1 | Patch notes checked against commits | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line truthful-claims:1 |
| Truthful claims | truthful-claims:2 | Technical claims match the code | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line truthful-claims:2 |
| Player safety | player-safety:1 | Creator and viewer features cannot change results | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line player-safety:1 |
| Player safety | player-safety:2 | Test results carry measured values | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line player-safety:2 |

## Level anchors

### capture-reliability:1 Recording replays and exports

- **0**: Export fails
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A complete recording replays and exports with correct sound and attribution
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### capture-reliability:2 Capture performance budget

- **0**: Capture adds frame time beyond the budget on a tested device
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Capture mode meets its own performance budget with capture off vs on. All approved `capturePairs` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Use the same replay, build and device with capture on and off. Compare observed p95 frame time for each pair.

Match each case in `profile.cases.capturePairs` with one row in `receipts.capturePairs` by id. Each row needs liveSha and a trace artifact ID. Required fields are device (text), replayOn (text), replayOff (text), ticksOn (positive), ticksOff (positive), onP95Ms (number), offP95Ms (number), offArtifact (artifact:trace).

Compute `overheadMs` using `diff(onP95Ms, offP95Ms)`.

- `device == case.device` caps the line at 1 on failure.
- `replayOn == row.replayOff` caps the line at 1 on failure.
- `ticksOn == row.ticksOff` caps the line at 1 on failure.
- `overheadMs <= profile.maxCaptureOverheadMs` caps the line at 2 on failure.

### spectator-comprehension:1 Spectator view shows only allowed information

- **0**: A tested feed fails to open, exposes restricted fields or falls short of its required delay.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Spectator information follows the approved information policy. All approved `partnerFeeds` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Inspect the partner-visible feed under the approved information policy. Record the observed delay and exposed fields from the sanitized capture.

Match each case in `profile.cases.partnerFeeds` with one row in `receipts.partnerFeeds` by id. Each row needs liveSha and a capture artifact ID. Required fields are feed (text), delayMs (count), restrictedFields (count), opened (bool).

A confirmed failure on delayMs, restrictedFields, opened blocks release, including when another case is missing.

- `feed == case.feed` caps the line at 1 on failure.
- `delayMs >= profile.minStreamDelayMs` caps the line at 0 on failure.
- `restrictedFields == 0` caps the line at 0 on failure.
- `opened == true` caps the line at 0 on failure.

### spectator-comprehension:2 Spectator view readable at stream resolutions

- **0**: Unreadable
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Spectate view is readable on stream resolutions
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### creator-controls:1 Streamer mode and redaction

- **0**: Names leak
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Streamer mode hides names and sensitive info
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### creator-controls:2 Share links

- **0**: Share links broken
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Share links carry the profile's source tag and resolve
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### truthful-claims:1 Patch notes checked against commits

- **0**: A draft describes a feature whose switch is disabled on the shipped build.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every player-facing draft line maps to a verified change on the reviewed build. All approved `shippedClaims` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Map each draft claim to its change and observe its switch state on the shipped build.

Match each case in `profile.cases.shippedClaims` with one row in `receipts.shippedClaims` by id. Each row needs liveSha and a static artifact ID. Required fields are claim (text), commit (text), switchEnabled (bool), buildReceipt (artifact:capture).

The row count must match `metrics.notes.lines`.

- `claim == case.claim` caps the line at 1 on failure.
- `commit == case.commit` caps the line at 1 on failure.
- `switchEnabled == true` caps the line at 0 on failure.

### truthful-claims:2 Technical claims match the code

- **0**: Claim not in code
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every technical claim (for example crash recovery or faster loading) matches the code
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### player-safety:1 Creator and viewer features cannot change results

- **0**: A creator feature changes outcomes
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Creator and viewer features cannot change results, saves or rankings
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### player-safety:2 Test results carry measured values

- **0**: Unconditional PASS receipt
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Receipts carry measured values; unconditional PASS/100 is rejected
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
