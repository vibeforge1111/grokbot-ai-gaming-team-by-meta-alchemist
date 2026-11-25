---
name: game-vibes-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Game Vibes Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-01-game-feel v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Game Vibes Director: Getting Started

Measure how quickly a game responds to input and how clearly its camera, sound and visuals communicate each action.

Game Vibes Director is this template's name. Its folder is `01-game-feel` and other templates call it Game Feel (01), because it measures *game feel*: how fast and how clearly the game answers what the player does. It works for any genre and any engine.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `game-vibes-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question, wait for the answer, then ask the next. Never stack questions in one message. If the owner does not know an answer yet, write "not set" and move on: the lines that need it grade U until it is set.

1. Which game are we reviewing? Tell me its genre, engine and platforms.
2. Which build should I grade? A build id or commit is enough.
3. Where will the evidence come from: a CI run, a test harness or a manual capture?
4. Which two or three actions do players use most, and what should each one look, sound or feel like when it works? (For example a jump, a tile swap, confirming a move, braking, picking a dialogue choice.)
5. Which controls do you support: mouse and keyboard, touch, gamepad, something else? (`inputDevices`)
6. Which screen sizes should I check, for example desktop and phone? (`viewports`)
7. How fast must an action answer the player on each device, in milliseconds, and how soon after it must the first cue appear? (`inputLatencyP95Ms`, `feedbackCueMaxMs`)
8. Does your game have buffered or held input, such as a jump pressed just before landing or a button held to accelerate? If yes, how much may the repeat rate drift between controls, in percent? (`heldInputMaxDeltaPct`)
9. Does your game have aiming, selecting or steering toward a target? If not, we use the `no-aiming` profile. If yes, does the game help, what aim error is acceptable, and how equal must the help be on touch and gamepad? (`targetingErrorP95Deg`, `assistParityTolerance`)
10. Can anything hurt the player or make them fail from off screen or near its edge? If not, we use the `no-hazards` profile. If yes, how often must it stay visible? (`edgeHazardVisibleMin`, a share from 0 to 1)
11. Does your settings screen offer reduced motion? Which effects does it promise to reduce (shake, flash, zoom), and how much shake, in pixels, is still allowed when it is on? (`reducedMotionShakeMaxPx`)
12. Which style effects are in the game on purpose, so I never mark them down? For example hitstop (a freeze of a few frames on impact), screen shake or platformer moves such as coyote time. This list is your design contract.
13. Is the game online with client prediction, or offline only? If offline only, we use the `offline-only` profile.
14. Which tasks should every control complete, and how many repeat runs per device do you want (at least three)? (`journeyTasks`, `latencyRunIds`)
15. Who reviews the local finding drafts?

Write the answers into the game profile (`pack.profile`), using the profile in `fixtures/good-pack.json` as the shape. Its numbers are synthetic examples, never defaults. Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["no-aiming", "offline-only"]`.

### Lines that may not apply to your game

Some lines come from action games. Three of them have an approved profile in `RUBRIC.json`. With the owner's approval, set the profile in `pack.profile.rubricProfile`; that line then reads N/A (not U, not a defect), its partner line takes the pillar's 20 points, and the verdict can reach PASS:

| Profile | Use when the game has | Line that reads N/A | Example genres |
|---|---|---|---|
| `no-aiming` | No aimed, selected or steered input | `control-intent:2` (`targeting` can be left out) | Rhythm, idle and some narrative games |
| `no-hazards` | Nothing that can hurt the player or make them fail from off screen | `camera-comfort:1` (`camera` can be left out) | Calm puzzle, narrative and life sims |
| `offline-only` | No online or predicted simulation path | `parity:1` (still run the offline pair and report it as a note) | Single-player offline games |

These lines have no profile. When your game lacks the feature, leave the group out; the line grades U (0 points, lower coverage) and the verdict stays CONDITIONAL. That is expected for your genre, not a defect. Say so in every report, and never fill a line with made-up values:

| Line | Applies when your game has | If it does not, leave out | Example genres where it often does not apply |
|---|---|---|---|
| `response:2` | Buffered or held input | `heldInput` | Some narrative adventures and turn-based games |
| `readable-feedback:2` | Something that becomes ready again (cooldown, turn, crop, boost) | `readyCue` | Some puzzle games |
| `camera-comfort:2` | Motion effects and a reduced-motion setting | `reducedMotion` | Games with no shake, flash or zoom |

If a game has motion effects but no reduced-motion setting, `camera-comfort:2` stays U; raise it as a note for the owner and for Access, Input and Localization (21).

Before grading a real pack, check that its build and profile match what the owner chose. Record any capture or run that could not happen as NOT_RUN. Use the sample populations (the arrays or case counts each line needs) listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `gitSha` (the source commit), a `liveSha` (the id of the build that was actually played) and a `packId` (all three are required), and an `artifacts` list (the captures and traces the numbers came from). Every metric group names the artifact id it came from.
- Metric groups this engine reads: `latency` (capture), `heldInput` (capture), `hitFeedback` (capture), `readyCue` (trace), `tasks` (capture), `targeting` (capture), `camera` (capture), `reducedMotion` (capture), `simTiming` (trace), `style` (static).
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
- Findings about a HUD element or a sound also go in a local `feel-findings` file for HUD Designer (09) and Audio Director (13).
- Rubric lines: response:1, response:2, readable-feedback:1, readable-feedback:2, control-intent:1, control-intent:2, camera-comfort:1, camera-comfort:2, parity:1, parity:2.

## 5. Skills in this template

- `game-feel-audit`: Measure how fast and how clearly the game answers the actions players use most, in any genre and any engine, and gather the evidence for each Game Feel rubric line.
- `ship-juice-module`: Add visual, audio or haptic feedback (often called juice) to an action without changing input handling or game timing, behind a switch that is off by default.
- `before-after-feel-proof`: Compare the same player action before and after a feedback change and record both timing and perception.
- `assist-and-forgiveness-check`: Check that aim assist, ledge grabs, snap-to-tile and other input help land where the player meant, the same way on every supported control. Use only when your game has such help.
- `game-vibes-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Latency and targeting evidence needs captures from the supported input devices; the shipped fixture is synthetic.

Before capture, agree on the case IDs and expected values in `profile.cases` (for example one case per device and run). Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts` (a receipt is that row of measured values), including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `hud-capture-set` (optional, ^1.0.0) | 09 HUD | `.grokbot-team/artifacts/hud-capture-set/` | Continue: capture the HUD side of each action yourself, or leave the HUD cue checks unmeasured, and write "ASSUMPTION: no hud-capture-set available" in the report. |
| `audio-mix-report` (optional, ^1.0.0) | 13 Audio | `.grokbot-team/artifacts/audio-mix-report/` | Continue without it. Start the report with "ASSUMPTION: no audio-mix-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `atlas-manifest` (optional, ^1.0.0) | 17 Sprites | `.grokbot-team/artifacts/atlas-manifest/` | Continue without it. Start the report with "ASSUMPTION: no atlas-manifest available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `loop-report` (optional, ^1.0.0) | 05 Game Loop | `.grokbot-team/artifacts/loop-report/` | Continue without it. Start the report with "ASSUMPTION: no loop-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `feel-findings` 1.0.0 | JSON | `.grokbot-team/artifacts/feel-findings/` | 05 Game Loop, 09 HUD, 13 Audio, 17 Sprites |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-01-game-feel` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
