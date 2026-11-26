---
name: audio-director-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Sound Effects & Adaptive Music Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-13-audio-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Sound Effects & Adaptive Music Director: Getting Started

Review sound effects, music transitions and mix levels against your game's feedback needs and device budgets.

The short name of this template is Audio Director (13). It reviews any game's sound, recorded or generated ("procedural"), in any engine or audio middleware. Browser-only checks (starting audio on the first tap, autoplay rules) apply to browser builds; native builds test the closest native case and name it in the report, as explained below.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `audio-director-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question, wait for the answer, then ask the next. Never stack questions in one message. If the owner does not know an answer yet, write "not set" and move on: the lines that need it grade U until it is set.

1. Which game are we reviewing? Tell me its genre, engine, audio middleware if any, and platforms.
2. Which build should I grade? A build id or commit is enough.
3. Where will the evidence come from: a CI run, a test harness or a manual capture?
4. Which sounds must players never miss? For example a turn starting, an invalid move, a lap completed or low health.
5. Which is the weakest device you support for audio, and how many sounds may play at once on it? (`audioDevice`, `voiceCap`)
6. How loud should the game be overall, how far may it drift, and what is the highest peak you allow? Loudness is measured in LUFS (loudness units relative to full scale) and peaks in dBTP (decibels true peak). (`targetLufs`, `lufsTolerance`, `maxTruePeakDb`)
7. How much audio may load before the first play, in bytes, and how fast must the first sound and the first input respond, in milliseconds? (`maxColdAudioBytes`, `maxAudioStartMs`, `maxFirstInputHandlerMs`)
8. At the busiest moment, how many decibels must essential sounds stand above everything else, and how many times per second may one sound repeat? (`minCueSeparationDb`, `maxSameCuePerSecond`)
9. Does the game have music? If not, we use the `no-music` profile. If yes, which states does it have, how late may a transition start, how big a volume jump is acceptable, and how far should music dip under important sounds? (`maxScheduleErrorMs`, `maxGainJumpDb`, `minDuckDb`)
10. Does the game have spoken lines (a narrator, characters, an announcer)? If not, we use the `no-spoken-lines` profile. If yes, how far may a caption drift from its line, in milliseconds? (`maxCaptionOffsetMs`)
11. Does the game place sounds in space, so players can tell where a sound comes from? If not, we use the `no-spatial-audio` profile. If yes, how sure must the direction test be? This is the lowest share of correct answers the test may support (the Wilson lower bound), for example 0.8. (`minSpatialDirectionLow`)
12. Does the game use the microphone? If yes, it stays off by default and the player must agree before it turns on.
13. Who reviews the local finding drafts?

Write the answers into the game profile (`pack.profile`), using the profile in `fixtures/good-pack.json` as the shape. Its numbers are synthetic examples, never defaults. Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["no-spoken-lines", "no-spatial-audio"]`.

### Lines that may not apply to your game

Three lines have an approved profile in `RUBRIC.json`. With the owner's approval, set the profile in `pack.profile.rubricProfile`; that line then reads N/A (not U, not a defect), its partner line takes the pillar's 20 points, and the verdict can reach PASS:

| Profile | Use when the game has | Line that reads N/A | Example |
|---|---|---|---|
| `no-music` | No music system | `music-and-mix:1` (`music` can be left out) | A game with only sound effects |
| `no-spoken-lines` | No spoken lines | `voice-and-lifecycle:1` (`captions` can be left out) | Many puzzle games |
| `no-spatial-audio` | No positional or occluded sound | `space-and-variety:1` (`spatial` can be left out) | A flat 2D puzzle game |

`load-and-start:2` has no profile. A native build whose audio starts before any input leaves `gesture` out; the line grades U (0 points, lower coverage) and the verdict stays CONDITIONAL. That is expected for your game, not a defect. Say so in every report, and never fill a line with made-up values.

Some field names come from one kind of game: `captions.spokenLines` counts any spoken lines, and `lifecycle.leakedNodesAfterRepeatedSessions` counts voices or audio nodes left over after ten full play sessions (levels, races, rounds or in-game days). `lifecycle.startBlockedHandled` is the browser autoplay rule; in a native build, test the closest case (another app holding the audio, or a call interrupting it) and name it in the report.

If Game Feel (01) left a local `feel-findings` file, read it first: it lists actions whose sound was late, missing or unclear.

Before grading a real pack, check that its build and profile match what the owner chose. Record any capture or run that could not happen as NOT_RUN. Use the sample populations (the arrays or case counts each line needs) listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `gitSha` (the source commit), a `liveSha` (the id of the build that was actually played) and a `packId` (all three are required), and an `artifacts` list (the recordings and traces the numbers came from). Every metric group names the artifact id it came from.
- Metric groups this engine reads: `load` (trace), `gesture` (trace), `music` (capture), `mix` (capture), `loudness` (capture), `voices` (trace), `spatial` (capture), `variety` (capture), `captions` (trace), `lifecycle` (capture), and optionally `micFallback` for the microphone check.
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect.

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `checks` (growth checks reported beside the grade) and `tickets` (deduplicated candidates).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects. For a line that does not apply to this game, say so instead.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Save the loudness, bus and caption timing results as a local `audio-mix-report` (for example under `.grokbot-team/artifacts/audio-mix-report/<pack id>.json`) for Game Feel (01), Trailer Director (10) and Access, Input and Localization (21).
- Rubric lines: load-and-start:1, load-and-start:2, music-and-mix:1, music-and-mix:2, loudness-and-voices:1, loudness-and-voices:2, space-and-variety:1, space-and-variety:2, voice-and-lifecycle:1, voice-and-lifecycle:2.

## 5. Skills in this template

- `sound-effect-bus-and-voice-limits`: Route recorded or generated sound effects through a mixer bus in your engine or audio middleware, set voice limits and stealing, and verify playback, loudness and lifecycle on target hardware.
- `adaptive-music-stem-crossfader`: Change music with game states using stems (separate layers of one piece) or whole cues, then test transition timing, level jumps, ducking and interrupted transitions in any engine.
- `optional-microphone-input`: Design optional sound-driven controls that use the microphone only after the owner and the player opt in, never record or send audio, and always offer an equal non-microphone control.
- `audio-director-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Recordings and simultaneous voice counts need a target device; the worked example is synthetic.

Agree on a list of sound events and the devices to test. Record the first interaction, load time, sounds playing at once, mix levels, mute, backgrounding and shutdown on each target. Mark hardware you could not test NOT_RUN.

Before capture, agree on the case IDs and expected values in `profile.cases` (for example one case per music transition). Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts` (a receipt is that row of measured values), including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `feel-findings` (optional, ^1.0.0) | 01 Game Feel | `.grokbot-team/artifacts/feel-findings/` | Continue: list the essential sounds with the owner, and write "ASSUMPTION: no feel-findings available" in the report. |
| `dialogue-draft` (optional, ^1.0.0) | 14 NPC and Lore | `.grokbot-team/artifacts/dialogue-draft/` | Continue without it. Start the report with "ASSUMPTION: no dialogue-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `audio-mix-report` 1.0.0 | JSON | `.grokbot-team/artifacts/audio-mix-report/` | 01 Game Feel, 10 Trailer, 21 Access |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-13-audio-director` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
