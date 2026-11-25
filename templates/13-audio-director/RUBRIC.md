# Sound Effects & Adaptive Music Director: rubric gbf-13-audio-director v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged; 1.1.1 to 1.1.2: Updated the public source note. Scoring rules and pack fields are unchanged. 1.1.2 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. 1.1.4 to 1.1.5: Adds per-transition, voice stress and timed caption receipts with device and mix budgets. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged); adds owner-selected not-applicable profiles no-music, no-spoken-lines, no-spatial-audio. 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (maxFirstTapHandlerMs to maxFirstInputHandlerMs; firstTapHandlerMs to firstInputHandlerMs; announcerLines to spokenLines; leakedNodesAfter10Matches to leakedNodesAfterRepeatedSessions; autoplayBlockedHandled to startBlockedHandled). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:f2a4ca49a3558221e0623ba23f9fd4c11a36f9d9cf12a382794a11cfe31bad99`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Audio evidence includes asset and startup costs, mix measurements, voice usage and playback lifecycle.

## Approved profiles

- **no-music**: The game has no music system. Select only after the owner approves it, before scoring. Weights: music-and-mix:1 = 0, music-and-mix:2 = 20.
- **no-spoken-lines**: The game has no spoken lines. Select only after the owner approves it, before scoring. Weights: voice-and-lifecycle:1 = 0, voice-and-lifecycle:2 = 20.
- **no-spatial-audio**: The game has no positional or occluded sound. Select only after the owner approves it, before scoring. Weights: space-and-variety:1 = 0, space-and-variety:2 = 20.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `load`: `startLatencyMs`.
- `gesture`: `firstInputHandlerMs`.
- `music`: `statesSpecified`.
- `mix`: `worstCaseRecordings`.
- `voices`: `peakVoices`.
- `spatial`: `directionTrials`.
- `captions`: `spokenLines`.
- `micFallback`: `tested`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Load and start | load-and-start:1 | Load cost and asset streaming | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line load-and-start:1 |
| Load and start | load-and-start:2 | Audio start on first input | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line load-and-start:2 |
| Music and mix | music-and-mix:1 | Music system | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line music-and-mix:1 |
| Music and mix | music-and-mix:2 | Mix and bus structure | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line music-and-mix:2 |
| Loudness and voices | loudness-and-voices:1 | Loudness and true-peak limiting | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line loudness-and-voices:1 |
| Loudness and voices | loudness-and-voices:2 | Active voice cap and stealing on the target device | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line loudness-and-voices:2 |
| Space and variety | space-and-variety:1 | Spatial audio and occlusion | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line space-and-variety:1 |
| Space and variety | space-and-variety:2 | SFX variety and procedural pooling | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line space-and-variety:2 |
| Voice and lifecycle | voice-and-lifecycle:1 | Spoken lines and captions | 10 | 3 | trace | node tests/lens-negative-fixtures.mjs --line voice-and-lifecycle:1 |
| Voice and lifecycle | voice-and-lifecycle:2 | Lifecycle (mute, backgrounding, start rules, memory) | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line voice-and-lifecycle:2 |

## Level anchors

### load-and-start:1 Load cost and asset streaming

- **0**: Loading audio exceeds the startup budget for the first playable session
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Cold and warm audio bytes and latency within budget from the pack
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### load-and-start:2 Audio start on first input

- **0**: Starting audio blocks the first player input
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: First input handler meets the approved device budget
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### music-and-mix:1 Music system

- **0**: Music fails its design in a capture
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Music behaves per design in captures (state changes, ducking); stem count is not mandated. All approved `transitions` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Capture the scheduled beat, measured start, gain change at the splice and ducking depth, including an interrupted fade.

Match each case in `profile.cases.transitions` with one row in `receipts.transitions` by id. Each row needs liveSha and a capture artifact ID. Required fields are fromState (text), toState (text), interruption (bool), scheduleErrorMs (count), gainJumpDb (number), duckDb (number).

- `fromState == case.fromState` caps the line at 1 on failure.
- `toState == case.toState` caps the line at 1 on failure.
- `interruption == case.interruption` caps the line at 1 on failure.
- `scheduleErrorMs <= profile.maxScheduleErrorMs` caps the line at 1 on failure.
- `gainJumpDb <= profile.maxGainJumpDb` caps the line at 1 on failure.
- `duckDb >= profile.minDuckDb` caps the line at 1 on failure.

### music-and-mix:2 Mix and bus structure

- **0**: A cue is masked in a recording
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Essential cues stay distinguishable in the busiest representative recordings
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### loudness-and-voices:1 Loudness and true-peak limiting

- **0**: The decoded overlapping-cue recording exceeds the approved true-peak ceiling.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Loudness and true peak measured from a fresh recording in the pack. Every approved mixedPeak case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Decode the recorded output from a worst-case overlapping cue burst. Measure true peak with the declared meter and keep the recording.

Match each case in `profile.cases.mixedPeak` with one row in `receipts.mixedPeak` by id. Each row needs liveSha and a capture artifact ID. Required fields are meter (text), simultaneous (positive), truePeakDb (number).

- `simultaneous > 1` caps the line at 1 on failure.
- `truePeakDb <= profile.maxTruePeakDb` caps the line at 0 on failure.

### loudness-and-voices:2 Active voice cap and stealing on the target device

- **0**: Voice count unmeasured or above the cap
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Peak active voices stay within the approved device cap. All approved `voiceStress` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Trigger overlapping cues beyond the cap. Record admitted, stolen and remaining voices from the mixer trace.

Match each case in `profile.cases.voiceStress` with one row in `receipts.voiceStress` by id. Each row needs liveSha and a trace artifact ID. Required fields are attempted (positive), cap (positive), peak (positive), stolen (count), activeAfterStop (count).

- `cap == profile.voiceCap` caps the line at 1 on failure.
- `attempted > row.cap` caps the line at 1 on failure.
- `peak <= row.cap` caps the line at 1 on failure.
- `stolen > 0` caps the line at 1 on failure.
- `activeAfterStop == 0` caps the line at 1 on failure.

### space-and-variety:1 Spatial audio and occlusion

- **0**: Spatial cues misleading
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Direction and distance read in recordings
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### space-and-variety:2 SFX variety and procedural pooling

- **0**: Cue storm in a recording
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No repeated cue storm in recordings
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### voice-and-lifecycle:1 Spoken lines and captions

- **0**: A traced utterance is paired with the wrong caption.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Captions checked event by event against spoken lines. All approved `captionEvents` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Match each scheduled utterance to its caption and measured absolute onset offset.

Match each case in `profile.cases.captionEvents` with one row in `receipts.captionEvents` by id. Each row needs liveSha and a trace artifact ID. Required fields are cue (text), caption (text), offsetMs (count).

The row count must match `metrics.captions.spokenLines`.

- `cue == case.cue` caps the line at 1 on failure.
- `caption == case.caption` caps the line at 0 on failure.
- `offsetMs <= profile.maxCaptionOffsetMs` caps the line at 1 on failure.

### voice-and-lifecycle:2 Lifecycle (mute, backgrounding, start rules, memory)

- **0**: Audio lost after resume
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Audio starts and resumes correctly after backgrounding and interruption
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
