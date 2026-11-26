---
name: access-input-localization-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Access, Input and Localization QA grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-21-access-input-localization v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Access, Input and Localization QA: Getting Started

Check whether players can navigate, read and control your game across supported inputs, languages and accessibility settings. This works for any genre: a puzzle game, a platformer, a strategy game, a racing game or a story game all have menus, text, sounds and controls to check.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `access-input-localization-lens-engine` skill first (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Game profile (`pack.profile`):** the owner's settings: devices, required tasks and limits. Thresholds live here, never in the engine.
- **Journey task:** something every player must be able to do, such as open the pause menu or finish a level.
- **Approved profile:** a rubric variant the owner chooses on purpose. This template has two: `single-language`, for a release in one language, and `single-input`, for a game with one input method. Both can be selected.
- **Release blocker:** a measured problem that stops release whatever the score. Here: flashing above the safety limit.
- **Case and receipt:** a case is one item the owner approved for checking, listed in `profile.cases`. A receipt is the matching row under `receipts` that records what was run, on which build, and what happened.
- **U (UNMEASURED), N/A and NOT_RUN:** U means no evidence yet (0 points, not a defect). N/A means the approved profile leaves the line out. NOT_RUN means a test was planned but did not run.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Start from the profile in `fixtures/good-pack.json` and replace each sample value with the owner's answer.

1. "Which game are we working on? Tell me its name, genre and platforms." Then ask: "Which build should I check first?" Then ask: "Where will the evidence come from: a CI run or a manual capture?"
2. "Which input devices does your game support? For example touch, gamepad, keyboard and mouse, or a switch device." Store the answer as `devices`.
3. "Does your game support only one input method, so there is nothing to remap or switch?" If so, we use the `single-input` profile once the owner approves it: `input:2` (remapping, prompts and device switching) reads N/A and `input:1` is worth 20 points. Leave `remap` and `receipts.navigationRecovery` out of the pack.
4. "Which tasks must every player be able to finish with each of those inputs? Think of the path from starting the game to playing and back: the title screen, settings, the pause menu, one core play task and saving or seeing results." Store the answer as `journeyTasks`. The worked example's `title-screen`, `core-play`, `results` and `play-again` come from one synthetic online game; use your own task names.
5. "What is the smallest text size you will accept, in pixels on your smallest supported screen, and the lowest text contrast? Many teams use a 4.5 to 1 contrast ratio as a starting point; that is an example, not a default." Store the answers as `minTextPx` and `minContrast`.
6. "How different must two colours that carry meaning stay for players with colour-vision differences? This is a colour difference score called delta E; the worked example uses 12 as a sample." Store the answer as `minCvdDeltaE`.
7. "Which flash safety limit do you follow? Many broadcast and platform guidelines use three flashes in any one second; take the number from the guideline you follow." Store the answer as `maxFlashesPerSecond`. Tell the owner that flashing above this limit blocks release under every profile.
8. "How late may a caption appear after its sound, in milliseconds?" Store the answer as `maxCaptionOffsetMs`. If no sound carries information the player needs, note that instead.
9. "Which scenes have motion that the reduced-motion setting should calm, such as screen shake, camera pans or zooms?" Store the answer as `motionScenarios`. If the game promises no reduced-motion setting, note that instead.
10. "Will this release ship in one language, or in more than one?" If one, we use the `single-language` profile once the owner approves it; record who approved it, the build and the reason. Under it the locale tests line is N/A and the string inventory line is worth 20 points. If more than one, ask which languages (`reviewLocales`) and which screen sizes (`localeViewports`) to capture.
11. "Who should review my local finding drafts before anything is filed?"

Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["single-language", "single-input"]` in `pack.profile`. An N/A line is not U and not a defect, and the verdict can reach PASS.

Before grading a real pack, check that its build and profile match what the owner chose. Record unavailable capture or execution as NOT_RUN. Use the populations (the sets of measured cases) listed by `--meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Profile values in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect.

Metric groups this engine reads, and the skill that fills each one:

| Group | Evidence type | Skill |
|---|---|---|
| `journey`, `remap` | capture | `input-navigation-and-device-switch-audit` |
| `text`, `colour`, `menus` | capture | `readability-and-caption-evidence` |
| `captions` | trace | `readability-and-caption-evidence` |
| `motion`, `flash` | capture | `motion-flash-comfort-check` |
| `strings` | static | `string-inventory-and-pseudo-locale` |
| `locale` | capture (default profile only) | `string-inventory-and-pseudo-locale` |

If part of a line does not exist in your game, never record it as passed. A game with one input method uses the `single-input` profile, so `input:2` reads N/A. For anything no profile covers (for example no keyboard or gamepad menus on a touch-only phone game, for `captions-and-assistive-info:2`), leave that group out so the line stays U, and write the reason next to the profile approval.

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `blocking` and `unmeasuredBlockers` (the flash release blocker), then `tickets` (candidate ticket drafts, already deduplicated).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- If the verdict is BLOCKED, say so first and name the capture that shows the flashing.
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects. List N/A lines as "not applicable under the approved profile" and name it (`single-language`, `single-input`).
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines: input:1, input:2, readability:1, readability:2, captions-and-assistive-info:1, captions-and-assistive-info:2, motion-and-flash-comfort:1, motion-and-flash-comfort:2, localization-readiness:1, localization-readiness:2.

## 5. Skills in this template

- `input-navigation-and-device-switch-audit`: Use when checking that players can finish the game's required tasks with every supported input (for example touch, gamepad, or keyboard and mouse), and that remapping, button prompts, controller disconnects and menu focus all recover. Feeds `input:1` and `input:2`.
- `readability-and-caption-evidence`: Use when measuring text size and contrast over real game scenes, checking that meaning survives without colour, matching every required sound to an on-time caption, and checking that menus and error messages are usable. Feeds `readability:1`, `readability:2`, `captions-and-assistive-info:1` and `captions-and-assistive-info:2`.
- `motion-flash-comfort-check`: Use when checking reduced motion, camera shake, flash safety (a release blocker) and hold or toggle alternatives with paired captures from the evidence pack. Feeds `motion-and-flash-comfort:1` and `motion-and-flash-comfort:2`.
- `string-inventory-and-pseudo-locale`: Use when building the inventory of every player-facing string and the build guard against new hard-coded text (this applies to single-language games too), and, once a second language is planned, running pseudo-locale and supported-locale captures for truncation, missing glyphs and layout. Feeds `localization-readiness:1` and `localization-readiness:2`.
- `file-to-shared-ledger`: Use when turning a confirmed access, input or localization finding into a local ticket draft, or a proposed change to an existing ticket, for the human to review and file in their tracker.
- `access-input-localization-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Flashing above the approved safety limit blocks release (verdict BLOCKED, grade 0) under every profile. Missing flash evidence keeps the verdict below PASS.
- Capture the player journey on each supported input device; the worked example is synthetic.

Before capture, agree on the case ids and expected values in `profile.cases` (for example the device and task pairs to test for recovery, and the sound cues to match). Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact id. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `hud-capture-set` (optional, ^1.0.0) | 09 HUD | `.grokbot-team/artifacts/hud-capture-set/` | Continue: capture text and contrast states yourself, or leave readability:1 and readability:2 unmeasured, and write "ASSUMPTION: no hud-capture-set available". |
| `audio-mix-report` (optional, ^1.0.0) | 13 Audio | `.grokbot-team/artifacts/audio-mix-report/` | Continue: build the cue list from the game's event log, or leave captions-and-assistive-info:1 unmeasured. |
| `tracker-export` (optional, ^1.0.0) | the owner | `.grokbot-team/artifacts/tracker-export/` | Continue without it. Start the report with "ASSUMPTION: no tracker-export available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `dialogue-draft` (optional, ^1.0.0) | 14 NPC and Lore | `.grokbot-team/artifacts/dialogue-draft/` | Continue without it. Start the report with "ASSUMPTION: no dialogue-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `access-report` 1.0.0 | JSON plus a Markdown summary | `.grokbot-team/artifacts/access-report/` | 14 NPC and Lore, 19 Store Page, 28 App Store |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-21-access-input-localization` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
