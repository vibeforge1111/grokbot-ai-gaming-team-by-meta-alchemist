# Stream-to-Devlog & Trailer Cut Director: rubric gbf-10-trailer-cut-director v1.3.0

Created by @meta_alchemist (https://x.com/meta_alchemist). The machine-readable definition is in `RUBRIC.json`.

1.0.0 to 1.1.0: anchors made game-agnostic (constants live in the game profile), lens gates added; ids, weights and passAt unchanged; 1.1.0 to 1.1.1: gameProfile generalized to your-game-profile for the public kit and hash recomputed with the documented kit algorithm (spec/RUBRIC_HASH.md); ids, weights, anchors and passAt unchanged. 1.1.1 to 1.1.3: Evidence descriptions and fixture working directories now refer to the distributed kit. 1.1.3 to 1.1.4: Empty samples and zero case counts earn U. Computed lines require the declared evidence type. Redaction covers the final frame count and matched caption counts cannot exceed the cue count. 1.1.4 to 1.1.5: Adds final-cut channel coverage, profile-specific decoder results and timed speech matches. 1.1.5 to 1.2.0: Line, pillar and anchor wording made genre-neutral (ids, weights, conditions and pass marks unchanged). 1.2.0 to 1.3.0: Evidence pack names made genre-neutral (framing916 to cropFraming). Scoring, weights, conditions and pass marks unchanged; rename these fields in packs made for 1.2.0.

- Scale: 100 points. Contribution: weight * level / 4.
- Game profile: your-game-profile@1.0.0. Hash: `sha256:182be69cbbd9d39c54901a50a5cff6029488eb546263cc8ddddc125a00779b6e`.
- Levels 0 to 4, or U. U earns zero points and excludes the line weight from measured coverage. Record skipped execution as NOT_RUN.
- PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.
- Evidence: Source recordings, an edit list, decoded exports and caption tracks from the reviewed cut.

## Evidence populations

Each computed metric group needs a nonempty population. Use the listed sample arrays or positive integer case counts. For other groups supply a positive integer measuredCases from the capture. Empty inputs or zero measured cases earn U and zero points. A measured zero failures is valid.

- `shots`: `total`.
- `claims`: `claimsChecked`.
- `edl`: `decisionsRecorded`.
- `cropFraming`: `shots`.
- `redaction`: `framesScanned`, `totalFrames`.
- `recovery`: `interruptionsInjected`.
- `captions`: `totalCues`.
- `licensing`: `tracks`.

| Pillar | Line | Name | Weight | Pass at | Evidence | Automated gate |
|---|---|---|---|---|---|---|
| Authentic gameplay | authentic-gameplay:1 | Build-bound shots | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line authentic-gameplay:1 |
| Authentic gameplay | authentic-gameplay:2 | No unavailable features implied | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line authentic-gameplay:2 |
| Readable story | readable-story:1 | Edit decisions recorded | 10 | 3 | static | node tests/lens-negative-fixtures.mjs --line readable-story:1 |
| Readable story | readable-story:2 | Action readable in the main wide cut | 10 | 3 | capture | Judged |
| Composition | composition:1 | Action and essential UI kept in the approved crop | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line composition:1 |
| Composition | composition:2 | Sensitive information redacted | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line composition:2 |
| Technical export | technical-export:1 | Approved delivery cuts exported and decoded | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line technical-export:1 |
| Technical export | technical-export:2 | Recovery after interruption | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line technical-export:2 |
| Accessible delivery | accessible-delivery:1 | Captions | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line accessible-delivery:1 |
| Accessible delivery | accessible-delivery:2 | Sound check | 10 | 3 | capture | node tests/lens-negative-fixtures.mjs --line accessible-delivery:2 |

## Level anchors

### authentic-gameplay:1 Build-bound shots

- **0**: Shots from an unknown build
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every shot is from the graded build and named in the pack
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### authentic-gameplay:2 No unavailable features implied

- **0**: A shot or line implies an unavailable feature
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: No claim implies gameplay that is not in the build
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### readable-story:1 Edit decisions recorded

- **0**: No edit record
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Source clips and edit decisions are recorded. Every approved editDecisions case passes.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Match each source shot and build to its final edit decision. Store in and out frames on the same timeline.

Match each case in `profile.cases.editDecisions` with one row in `receipts.editDecisions` by id. Each row needs liveSha and a static artifact ID. Required fields are shot (text), sourceBuild (text), sourceClip (artifact:capture), inFrame (count), outFrame (positive), decision (text).

The row count must match `metrics.shots.total`.

- `shot == case.shot` caps the line at 1 on failure.
- `sourceBuild == pack.liveSha` caps the line at 1 on failure.
- `outFrame > row.inFrame` caps the line at 1 on failure.

### readable-story:2 Action readable in the main wide cut

- **0**: Action unreadable
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Subjects and intended action read in the main wide cut at playback size
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### composition:1 Action and essential UI kept in the approved crop

- **0**: Crop loses the action
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Required action and UI context survive the approved crop.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### composition:2 Sensitive information redacted

- **0**: A final cut contains a confirmed unredacted sensitive item.
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Player names and other sensitive items are redacted where required. All approved `finalReview` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Review every final cut and channel, including audio, picture, captions, titles, filename and embedded metadata. Review the rendered file after packaging.

Match each case in `profile.cases.finalReview` with one row in `receipts.finalReview` by id. Each row needs liveSha and a capture artifact ID. Required fields are cut (text), channel (text), expectedUnits (positive), checkedUnits (positive), hits (count), reviewer (text), deliverable (artifact:capture).

Cover every combination of cut from profile.deliveryCuts, channel from profile.reviewChannels.

- `cut == case.cut` caps the line at 1 on failure.
- `channel == case.channel` caps the line at 1 on failure.
- `expectedUnits == case.expectedUnits` caps the line at 1 on failure.
- `checkedUnits == row.expectedUnits` caps the line at 1 on failure.
- `hits == 0` caps the line at 0 on failure.

### technical-export:1 Approved delivery cuts exported and decoded

- **0**: No real export (unrendered scores 0)
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Every approved delivery cut: size, length, frames, independent decode and audio sync all pass; unrendered means 0. All approved `decodedCuts` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Compare independent decoder output against each required delivery format, including dimensions, frame rate and encoding.

Match each case in `profile.cases.decodedCuts` with one row in `receipts.decodedCuts` by id. Each row needs liveSha and a capture artifact ID. Required fields are width (positive), height (positive), fps (number), codec (text), decoder (text), rights (artifact:static).

Cover every combination of id from profile.deliveryCuts.

- `width == case.width` caps the line at 1 on failure.
- `height == case.height` caps the line at 1 on failure.
- `fps == case.fps` caps the line at 1 on failure.
- `codec == case.codec` caps the line at 1 on failure.

### technical-export:2 Recovery after interruption

- **0**: An interrupted export corrupts the clip
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Recording and export recover after interruption without corrupting the clip
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

### accessible-delivery:1 Captions

- **0**: No captions
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: Every speech cue has a decoded observation and the measured match rate meets the approved minimum, with at least one mismatch.
- **4**: Captions match speech and key sounds. All approved `captionAlignment` cases pass on the reviewed build.
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.

Match each expected speech cue to the decoded caption track by ID and time.

Match each case in `profile.cases.captionAlignment` with one row in `receipts.captionAlignment` by id. Each row needs liveSha and a capture artifact ID. Required fields are cue (text), caption (text), offsetMs (count).

The row count must match `metrics.captions.totalCues`.

For caption and offsetMs, count matched cases against `metrics.captions.matchedCues`. A partial match at or above `profile.minCaptionMatch` earns level 3. Below that minimum, apply the listed failure caps.

- `cue == case.cue` caps the line at 1 on failure.
- `caption == case.caption` caps the line at 1 on failure.
- `offsetMs <= case.maxOffsetMs` caps the line at 2 on failure.

### accessible-delivery:2 Sound check

- **0**: Loudness or true peak outside the profile on the decoded file
- **1**: Nominal success is unreliable or major supported cases fail.
- **2**: Common path works; material supported edge cases remain.
- **3**: All required cases and budgets pass; only minor defects remain.
- **4**: Loudness and sync checked on the decoded file
- **U**: UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect.
