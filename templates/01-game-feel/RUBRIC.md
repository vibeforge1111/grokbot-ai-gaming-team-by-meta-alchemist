# Game Vibes Director: rubric gbf-01-game-feel v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged. 1.1.1 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. 1.1.4 to 1.1.5: Requires supported-device runs, traced ready events and comparable simulation replays. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-aiming, no-hazards, offline-only. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (heldFireMaxDeltaPct to heldInputMaxDeltaPct; heldFire to heldInput; onlineMatchesPractice to onlineMatchesOffline; damagingThreatsOffscreen to hazardsOffscreen; edgeThreatVisibleRatio to edgeHazardVisibleRatio; edgeThreatVisibleMin to edgeHazardVisibleMin; aimErrorP95Deg to targetingErrorP95Deg; aim to targeting). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:4d8030ea2e37ea17337d68acfb9469ba366c072050a39723fad04beac0509555`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Input traces, matched feedback captures and simulation replays from the build under review.

## Approved profiles

- **no-aiming**: The game has no aimed, selected or steered input to compare with intent. Select only after the owner approves it, before scoring. Weights: control-intent:1 = 20, control-intent:2 = 0.
- **no-hazards**: Nothing in the game can hurt the player or make them fail from off screen. Select only after the owner approves it, before scoring. Weights: camera-comfort:1 = 0, camera-comfort:2 = 20.
- **offline-only**: The game has no online or predicted simulation path to compare. Select only after the owner approves it, before scoring. Weights: parity:1 = 0, parity:2 = 20.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `latency`: `runs`.
- `heldInput`: `bufferedPressHonored`.
- `hitFeedback`: `visualByDevice`.
- `readyCue`: `emitCounts`.
- `tasks`: `devices`.
- `targeting`: `errorDegP95`.
- `camera`: `viewports`.
- `reducedMotion`: `promised`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Response | response:1 | Input-to-action latency sample | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line response:1 |
| Response | response:2 | Buffered and held input behaviour | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line response:2 |
| Readable feedback | readable-feedback:1 | Action feedback capture | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line readable-feedback:1 |
| Readable feedback | readable-feedback:2 | Ready-again cues | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line readable-feedback:2 |
| Control intent | control-intent:1 | Input task completion | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line control-intent:1 |
| Control intent | control-intent:2 | Input intent and assist parity | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line control-intent:2 |
| Camera comfort | camera-comfort:1 | Camera framing of hazards | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line camera-comfort:1 |
| Camera comfort | camera-comfort:2 | Reduced motion respected | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line camera-comfort:2 |
| Parity | parity:1 | Feedback preserves simulation timing | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line parity:1 |
| Parity | parity:2 | Style effects are owner calls | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line parity:2 |

## Level anchors

### response:1 Input-to-action latency sample

- **0**: No latency sample exists for the build, or a required action produces no response
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Input response meets the approved budget across the supported devices and repeated runs. All approved `deviceLatency` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Record independent runs for every supported input. Compare the observed p95 against the signed-off latency budget.

Match each case in `profile.cases.deviceLatency` with one row in `receipts.deviceLatency` by id. Each row needs liveSha and a capture artifact ID. Required fields are device (text), run (text), seed (text), samples (positive), latencyMs (samples).

Cover every combination of device from profile.inputDevices, run from profile.latencyRunIds.

Compute `p95Ms` using `p95(latencyMs)`.

Compute `sampleCount` using `length(latencyMs)`.

- `device == case.device` caps the line at 1 on failure.
- `run == case.run` caps the line at 1 on failure.
- `seed == case.seed` caps the line at 1 on failure.
- `p95Ms <= profile.inputLatencyP95Ms` caps the line at 2 on failure.
- `samples == row.sampleCount` caps the line at 1 on failure.

### response:2 Buffered and held input behaviour

- **0**: A capture shows a held or buffered input behaving differently from what the game teaches
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A buffered press and a held input produce the documented action at the intended cadence across the tested input paths
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### readable-feedback:1 Action feedback capture

- **0**: The expected action confirmation is missing or unreadable in the capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The expected visual and audio cues for the chosen action are recognizable in captures for each tested device
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### readable-feedback:2 Ready-again cues

- **0**: An observed ready event emits zero cues or emits more than once.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: A ready-again event (cooldown done, turn start, crop ready) emits its configured cue exactly once (the emitting caller traced to file and line) on every run. All approved `readyEmissions` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Identify the emitting caller and count once per traced ready event.

Match each case in `profile.cases.readyEmissions` with one row in `receipts.readyEmissions` by id. Each row needs liveSha and a trace artifact ID. Required fields are caller (text), sourceLine (positive), emits (count).

The row count must match `metrics.readyCue.emitCounts`.

- `emits == 1` caps the line at 0 on failure.

### control-intent:1 Input task completion

- **0**: A required action is unreachable on a supported input device
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: The same task sequence completes across the tested input devices, including after a device switch. All approved `inputTasks` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Capture the same profile task on each supported input.

Match each case in `profile.cases.inputTasks` with one row in `receipts.inputTasks` by id. Each row needs liveSha and a capture artifact ID. Required fields are device (text), task (text), completed (bool).

Cover every combination of device from profile.inputDevices, task from profile.journeyTasks.

- `device == case.device` caps the line at 1 on failure.
- `task == case.task` caps the line at 1 on failure.
- `completed == true` caps the line at 1 on failure.

### control-intent:2 Input intent and assist parity

- **0**: Aimed, selected or steered input snaps or drifts against intent in the capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Aimed, selected or steered input lands where the player intended on every device; any assist is documented and equal across devices
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### camera-comfort:1 Camera framing of hazards

- **0**: Something that can hurt the player or make them fail is off screen or hidden by the camera
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Hazards at screen edges and at elevation stay visible in the fixed seed routes at every viewport in the game profile
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### camera-comfort:2 Reduced motion respected

- **0**: A promised reduction is not applied, with a capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Reduced-motion setting alters every promised effect (shake, flash, zoom) in a paired capture
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### parity:1 Feedback preserves simulation timing

- **0**: Effects change the simulation digest on a comparable replay.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Feedback effects never change simulation timing in any simulation path the game has (offline, and online predicted when present; same-seed trace). All approved `pairedTiming` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare equal-length traces from the same build, seed, device, simulation path and input replay with effects on and off.

Match each case in `profile.cases.pairedTiming` with one row in `receipts.pairedTiming` by id. Each row needs liveSha and a trace artifact ID. Required fields are device (text), onSeed (text), offSeed (text), onRun (text), offRun (text), onTicks (positive), offTicks (positive), offArtifact (artifact:trace), onHash (sha256), offHash (sha256).

- `device == case.device` caps the line at 1 on failure.
- `onSeed == case.seed` caps the line at 1 on failure.
- `offSeed == row.onSeed` caps the line at 1 on failure.
- `onRun == row.offRun` caps the line at 1 on failure.
- `onTicks == row.offTicks` caps the line at 1 on failure.
- `onHash == row.offHash` caps the line at 0 on failure.

### parity:2 Style effects are owner calls

- **0**: A deduction is applied for a stylistic effect the owner removed by design
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Stylistic effects (for example hitstop, screen shake or platformer moves) are scored only against the owner's written design contract
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
