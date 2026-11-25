---
name: hud-designer-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first HUD and Game UI Designer grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-09-hud-ui-designer v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# HUD and Game UI Designer: Getting Started

Check whether players can read the information they need, operate the controls and understand their first session on each target device.

The short name of this template is HUD Designer (09). It reviews any game's HUD and menus: score, timer, inventory, dialogue, map, health and anything else players must read. "Combat telemetry" (hit direction, damage recaps) is one optional part for games with combat, and "UI skin" means the visual theme of the interface. A browser DOM UI is one adapter among several; engine UI and canvas UI work the same way.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `hud-designer-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question, wait for the answer, then ask the next. Never stack questions in one message. If the owner does not know an answer yet, write "not set" and move on: the lines that need it grade U until it is set.

1. Which game are we reviewing? Tell me its genre, engine and platforms.
2. Which build should I grade? A build id or commit is enough.
3. Where will the evidence come from: a CI run, a test harness or a manual capture?
4. Which screens or moments must always be readable? For example planning, a dialogue, the inventory, the map, the results screen, or a boss fight if your game has one. (`states`)
5. Which screen sizes and orientations do you support, for example a 1280 px wide window, phone portrait and phone landscape? (`viewports`) If the game runs in one orientation and aspect ratio only, we use the `fixed-orientation` profile.
6. Which controls do you support: keyboard, gamepad, touch? Which HUD actions must each control reach? (`hudInputs`, `hudControls`) If no supported device uses touch, we use the `no-touch` profile. If every device is touch only, with no keyboard or gamepad navigation, we use the `touch-only` profile.
7. What is the smallest text size you accept, in pixels, and the smallest touch target if you support touch? (`minTextPx`, `minTouchTargetPx`)
8. What contrast must text, icons and focus outlines reach? (`minContrast` and a minimum per element in `cases.elementContrast`; `contrastElements` lists the element kinds)
9. Which two UI palettes should I check for colour blindness, for example your default palette and an alternative theme, and how different must their colours stay under simulated colour blindness, measured as deltaE where bigger means more different? (`minCvdDeltaE`)
10. How many milliseconds per frame may the UI use on your weakest device, and how much of the screen may the HUD cover at the busiest moment, in percent? (`uiBudgetMs`, `maxHudCoverPct`)
11. Will the game be translated? If not, we use the `single-language` profile. If yes, how much longer than your source language should the fake test text be (pseudo-localization), for example 1.4 for 40 percent longer? (`pseudoLocExpansion`)
12. Who reviews the local finding drafts?

Write the answers into the game profile (`pack.profile`), using the profile in `fixtures/good-pack.json` as the shape. Its numbers and its state names (taken from an action game) are synthetic examples, never defaults. Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["no-touch", "single-language"]`.

### Lines that may not apply to your game

Four lines have an approved profile in `RUBRIC.json`. With the owner's approval, set the profile in `pack.profile.rubricProfile`; that line then reads N/A (not U, not a defect), its partner line takes the pillar's 20 points, and the verdict can reach PASS:

| Profile | Use when the game has | Line that reads N/A | Example |
|---|---|---|---|
| `no-touch` | No supported device that uses touch | `operability:2` (`touch` can be left out) | A desktop or console game |
| `touch-only` | Touch on every supported device, with no keyboard or gamepad navigation | `operability:1` (`focus` can be left out) | A phone-only game |
| `fixed-orientation` | One orientation and aspect ratio only | `responsive-behaviour:2` (`orientation` can be left out) | A game shipped in landscape only |
| `single-language` | One language at release | `measured-ui-cost:2` (`expansion` can be left out) | A game with no translation planned |

Pick at most one of `no-touch` and `touch-only`. When more locales enter scope, drop `single-language` and test text expansion.

`information-priority:2` has no profile. A game with no player-facing text at all leaves `strings` out; the line grades U (0 points, lower coverage) and the verdict stays CONDITIONAL. That is expected for your game, not a defect. Say so in every report, and never fill a line with made-up values.

If you do not ship on phones, put your smallest supported screen (a handheld or the smallest window) in `text.minPxSmallViewport` and name that screen in the profile notes. The pillar called "Readable game states" covers readable game states in any genre.

Before grading a real pack, check that its build and profile match what the owner chose. Record any capture or run that could not happen as NOT_RUN. Use the sample populations (the arrays or case counts each line needs) listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `gitSha` (the source commit), a `liveSha` (the id of the build that was actually played) and a `packId` (all three are required), and an `artifacts` list (the screenshots and traces the numbers came from). Every metric group names the artifact id it came from.
- Metric groups this engine reads: `priority` (capture), `strings` (static), `contrast` (capture), `cvd` (capture: colour vision deficiency, that is colour blindness), `focus` (capture), `touch` (capture), `text` (capture), `orientation` (capture), `uiCost` (trace), `expansion` (capture), `hudChrome` (capture), and optionally `retryInput` for the retry check.
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
- Keep the screenshots and UI traces you used, per device and state, as a local `hud-capture-set` (for example under `.grokbot-team/artifacts/hud-capture-set/<pack id>/`) for Access, Input and Localization (21).
- Rubric lines: information-priority:1, information-priority:2, readable-combat-states:1, readable-combat-states:2, operability:1, operability:2, responsive-behaviour:1, responsive-behaviour:2, measured-ui-cost:1, measured-ui-cost:2.

## 5. Skills in this template

- `live-hud-updates-and-cost`: Keep HUD elements that change often (score, timer, health, resources, lap time) readable during the busiest moment, and measure what updating them costs on each target device, in any engine.
- `event-cues-and-recaps`: Show players what just happened and where: a direction cue for an off-screen event, or a short recap after a fail, a turn or a choice. Combat cues such as hit direction are one optional case.
- `wcag-luminance-and-ui-frame-gate`: Measure text and icon contrast (the WCAG contrast ratio) in real gameplay captures, and compare UI frame cost with each target device's budget.
- `first-30s-onboarding-and-friction-killer`: Observe a new player's first task and identify where discovery, controls or feedback interrupt progress.
- `hud-designer-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Contrast and colour-blindness (CVD) inputs must come from captures of your build; the worked example is synthetic.

Set the contrast target for each essential UI element and the text expansion factor. Plan the first screenshot of the final rendered screen, the input sequence and the matching UI frame trace on each supported device. If Game Feel (01) left a local `feel-findings` file, read it first: it lists actions whose feedback was late or missing on screen.

Before capture, agree on the case IDs and expected values in `profile.cases` (for example one case per element and state). Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts` (a receipt is that row of measured values), including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `feel-findings` (optional, ^1.0.0) | 01 Game Feel | `.grokbot-team/artifacts/feel-findings/` | Continue: review the HUD cues for the main actions yourself and write "ASSUMPTION: no feel-findings available" in the report. |
| `atlas-manifest` (optional, ^1.0.0) | 17 Sprites | `.grokbot-team/artifacts/atlas-manifest/` | Continue without it. Start the report with "ASSUMPTION: no atlas-manifest available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `loop-report` (optional, ^1.0.0) | 05 Game Loop | `.grokbot-team/artifacts/loop-report/` | Continue without it. Start the report with "ASSUMPTION: no loop-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `hud-capture-set` 1.0.0 | JSON manifest plus lossless PNG screenshots and UI traces | `.grokbot-team/artifacts/hud-capture-set/` | 01 Game Feel, 10 Trailer, 11 Environment, 19 Store Page, 21 Access |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-09-hud-ui-designer` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
