# Sound Effects & Adaptive Music Director

Created by @meta_alchemist (https://x.com/meta_alchemist).

Review sound effects, music transitions and mix levels against your game's feedback needs and device budgets.

The short name of this template is Audio Director (13). It reviews any game's sound, recorded or generated ("procedural"), in any engine or audio middleware: an engine mixer (Unity, Unreal, Godot), FMOD or Wwise, a custom mixer, or Web Audio in a browser.

Rubric: `gbf-13-audio-director` v1.3.0, 100-point scale (5 pillars of 20 points, 10 lines, levels 0 to 4 or U). Contribution per line is weight x level / 4 and a line passes at level 3. U (UNMEASURED) earns 0 and is never filed as a defect.

Evidence comes from a CI run, a test harness or a manual capture of your build. Playtest QA (template 02) is coming later.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

## Quick start

Run these from this folder (`templates/13-audio-director`):

```
node engine/lens.mjs fixtures/good-pack.json      # grade the worked example (synthetic, not a measurement)
node tests/lens-negative-fixtures.mjs             # every negative and missing-input case must behave
node tests/test-lens-contract.mjs                 # rubric match, recipe embed and text checks
node engine/lens.mjs your-pack.json               # grade your own evidence pack
```

The engine prints one grade record: per-line level, evidence ids, findings, supported points, coverage, verdict (PASS, CONDITIONAL, BLOCKED or INVALID), growth checks and deduplicated ticket candidates. It refuses (verdict INVALID, grade null) a pack that is missing, not VALID, or has no liveSha, gitSha or packId.

## How the engine decides a level

- Computed lines read `metrics.<group>` from the pack. Each group must name an `artifact` id that exists in `pack.artifacts`; otherwise the line is U.
- A failed condition caps the level: hard conditions at 1, normal ones at 2, level-4-only ones at 3. Receipt checks have the caps shown in the rubric. All conditions passing gives 4. A receipt is one row per approved test case (for example one music transition) with the values measured for it.
- Judged lines (perception calls a script cannot make) accept `pack.judgements[lineId] = { level, judge, evidenceIds, note }` only when every evidence id is in the pack and at least one matches the line's evidence type. A made-up id gives U.
- Thresholds come from `pack.profile` (your game profile). Missing thresholds give U, never a default.

See `node engine/lens.mjs --meta` for the sample population (the array of samples or the case count) each line needs. Scalar summaries without a listed population require a positive `measuredCases`. Missing or empty evidence earns U. Each computed line requires an artifact of its declared type.

For real packs, supply the producer receipt (your capture tool's record of the build, device and files behind the pack) and the local artifact files described in the [evidence contract](../../spec/TEMPLATE_SPEC.md#live-evidence). The [rubric](RUBRIC.md) lists case fields, comparisons and failure caps.

## Pack fields (one row per rubric line)

| Line | Name | Kind | Reads | Passes when |
|---|---|---|---|---|
| `load-and-start:1` | Load cost and asset streaming | computed | `load.coldBytes`, `load.startLatencyMs` | load.coldBytes <= P.maxColdAudioBytes; p95(load.startLatencyMs) <= P.maxAudioStartMs |
| `load-and-start:2` | Audio start on first input | computed | `gesture.device`, `gesture.firstInputHandlerMs` | `gesture.device == P.audioDevice`, `p95(gesture.firstInputHandlerMs) <= P.maxFirstInputHandlerMs` |
| `music-and-mix:1` | Music system | computed | `music.statesObserved`, `music.statesSpecified`, `music.duckingObserved`, `receipts.transitions` | `missing(music.statesObserved,music.statesSpecified) == 0`, `music.duckingObserved is true`, approved receipt cases pass |
| `music-and-mix:2` | Mix and bus structure | computed | `mix.worstCaseRecordings`, `mix.essentialCueMarginDb` | mix.worstCaseRecordings >= 1; min(mix.essentialCueMarginDb) >= P.minCueSeparationDb |
| `loudness-and-voices:1` | Loudness and true-peak limiting | computed | `loudness.freshRecording`, `loudness.integratedLufs`, `loudness.truePeakDb`, `receipts.mixedPeak` | `loudness.freshRecording is true`, `absdiff(loudness.integratedLufs,P.targetLufs) <= P.lufsTolerance`, `loudness.truePeakDb <= P.maxTruePeakDb`, approved receipt cases pass |
| `loudness-and-voices:2` | Active voice cap and stealing on the target device | computed | `voices.device`, `voices.peakVoices`, `receipts.voiceStress` | `voices.device == P.audioDevice`, `max(voices.peakVoices) <= P.voiceCap`, approved receipt cases pass |
| `space-and-variety:1` | Spatial audio and occlusion | computed | `spatial.directionCorrect`, `spatial.directionTrials` | wilsonLow(spatial.directionCorrect,spatial.directionTrials) >= P.minSpatialDirectionLow |
| `space-and-variety:2` | SFX variety and procedural pooling | computed | `variety.sameCuePerSecondMax` | variety.sameCuePerSecondMax <= P.maxSameCuePerSecond |
| `voice-and-lifecycle:1` | Spoken lines and captions | computed | `captions.captionedMatching`, `captions.spokenLines`, `receipts.captionEvents` | `captions.captionedMatching == captions.spokenLines`, approved receipt cases pass |
| `voice-and-lifecycle:2` | Lifecycle (mute, backgrounding, start rules, memory) | computed | `lifecycle.resumeAfterBackground`, `lifecycle.muteRespected`, `lifecycle.startBlockedHandled`, `lifecycle.leakedNodesAfterRepeatedSessions` | lifecycle.resumeAfterBackground is true (hard: level 1 on failure); lifecycle.muteRespected is true; lifecycle.startBlockedHandled is true; lifecycle.leakedNodesAfterRepeatedSessions == 0 |

## Growth checks (reported beside the grade, not scored)

| Check | Areas | Reads | Passes when |
|---|---|---|---|
| `mic-fallback` | optional-input | `micFallback.tested`, `micFallback.openTracksAfterStop`, `micFallback.baselineAction`, `micFallback.deniedAction`, `micFallback.revokedAction` | denied and revoked access both tested; no microphone track left open after stopping; the alternative control gives the same action as the baseline after denied and after revoked access (all hard) |

`mic-fallback` applies only when the game uses the microphone. Microphone input starts off and needs the owner's opt-in and the player's consent; see the `optional-microphone-input` skill. Leave `micFallback` out if your game does not use the microphone.

## Adapt to your game

Collect startup, mix and lifecycle evidence from your own audio stack. Name the sounds players must never miss and test them at the busiest moment:

| Genre | Sounds players must never miss | Busiest moment to record |
|---|---|---|
| Mobile puzzle game | Invalid move, level complete | A long chain of matches |
| 2D platformer | Hurt, checkpoint | A crowded screen of enemies and pickups |
| Racing game | Lap complete, a rival close behind | The start of the race, all engines at once |
| Turn-based strategy | Your turn starts, a unit is attacked | The enemy turn with many units moving |
| Narrative adventure | Dialogue lines, a clue found | A tense scene with music and voices |
| Farming or life sim | The day is ending, a full inventory | A busy market or festival |
| 3D arena game | Low health, an ability ready | A crowded fight |

Browser-only checks: browsers start audio only after a first tap or key press (`load-and-start:2`) and may block autoplay (`lifecycle.startBlockedHandled`). In a native build, measure the first input handler on the target device anyway, and test the closest native case for autoplay (another app holding the audio, or a call interrupting it). Name that case in the report.

Some field names come from one kind of game: `captions.spokenLines` counts any spoken lines (narrator, characters or announcer), and `lifecycle.leakedNodesAfterRepeatedSessions` counts voices or audio nodes left after ten full play sessions (levels, races, rounds or in-game days).

### Lines that may not apply

Three lines have an approved profile in `RUBRIC.json`. The owner approves the profile before scoring and sets it in the game profile, for example `"rubricProfile": ["no-spoken-lines", "no-spatial-audio"]` in `pack.profile`:

| Profile | Use when the game has | Line that reads N/A | Line that takes the pillar's 20 points | Group you can leave out |
|---|---|---|---|---|
| `no-music` | No music system | `music-and-mix:1` | `music-and-mix:2` | `music` |
| `no-spoken-lines` | No spoken lines (narrator, characters or announcer) | `voice-and-lifecycle:1` | `voice-and-lifecycle:2` | `captions` |
| `no-spatial-audio` | No positional or occluded sound | `space-and-variety:1` | `space-and-variety:2` | `spatial` |

An N/A line is not U and not a defect, and with every other line at level 3 or more the verdict can be PASS. A puzzle game with no spoken lines and no positional sound, for example, selects `["no-spoken-lines", "no-spatial-audio"]`. Name the profiles next to the grade.

`load-and-start:2` has no profile. A native build whose audio starts before any input leaves `gesture` out; the line grades U (0 points, lower coverage) and the verdict stays CONDITIONAL. Say in the report that it does not apply, and never fill a line with made-up values.

### Set up the pack

- Measure loudness with an EBU R128 meter (the broadcast loudness standard) on a fresh in-game recording; write integrated LUFS (overall loudness) and true peak.
- Log peak active voices on the least capable supported audio device.
- Copy `fixtures/good-pack.json`, keep its shape, and replace every value with numbers from your own build. Keep `synthetic` false (or remove it) for real packs.
- Never edit thresholds inside the engine; put them in `pack.profile`.

## Owner calls

- How loud the game should be overall, and the highest peak you allow, on each target device.
- How many sounds may play at once on the weakest device, and how much audio may load before the first play.
- If sounds are placed in space: how sure the direction test must be (`minSpatialDirectionLow`, the lowest share of correct answers the test may support, for example 0.8).
- Which rubric profiles apply (`no-music`, `no-spoken-lines`, `no-spatial-audio`), approved before scoring and set as `rubricProfile` in the game profile.

## Blockers

- Recordings and voice counts need a target device; the worked example is synthetic.

## Team handoffs

Files are exchanged locally under `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

| Artifact | Direction | Required | Other end | If it is missing |
|---|---|---|---|---|
| `game-profile` | consumes | required | The owner, via the getting-started skill | Run the getting-started skill first; lines with no threshold grade U |
| `evidence-pack` | consumes | required | Your CI run, test harness or manual capture | No grade; the engine refuses the pack (INVALID) |
| `feel-findings` | consumes | optional | Game Feel (01) | Grade without it; list the essential sounds with the owner instead |
| `audio-mix-report` | produces | optional | Game Feel (01), Trailer Director (10), Access, Input and Localization (21) | They measure loudness and caption timing themselves or leave it unmeasured |
| `grade-record` | produces | required | Bug Desk (18), the owner | Nothing to compare next week; run the engine again |
| `ticket-draft` | produces | optional | Bug Desk (18), then the human files it | Findings stay in the report only |

## Files

- `recipe.json`: the importable bot template. The `*-lens-engine` skill carries the engine source so a new owner gets it without this folder.
- `engine/lens-kit.mjs`, `engine/lens.mjs`: the engine (no dependencies, Node 18+).
- `fixtures/good-pack.json`, `fixtures/mutations.json`: worked example and its negative and missing-input cases.
- `tests/`: portable tests. `RUBRIC.json` and `RUBRIC.md`: the frozen rubric.

