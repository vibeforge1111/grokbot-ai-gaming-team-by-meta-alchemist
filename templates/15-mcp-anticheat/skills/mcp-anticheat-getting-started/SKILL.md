---
name: mcp-anticheat-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Server Fairness & Anti-Cheat Guard grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-15-mcp-anticheat-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Server Fairness & Anti-Cheat Guard: Getting Started

For games with a server, compare scene data across engines and review whether the server enforces your game's rules fairly.

The template has two parts:

- Scene Parity (skill `cross-editor-scene-parity`): when levels move between editors such as Blender, Unity, Godot or Unreal, or an agent edits them over MCP (Model Context Protocol, a way to connect an AI agent to an editor), prove the server's collision, spawn and visibility data match what players see.
- Anti-Cheat Guard (skill `server-authority-fairness-audit`): review that your own server rejects impossible actions, bounds inputs and timing, hides what players should not see and survives floods and duplicate joins.

It is defensive only. It reviews your own server on a local or staging copy with your written go-ahead. It never targets players, live servers or other games, never writes cheats, and never bans anyone. Suspected cheating and suspected multi-account groups become local drafts for a human reviewer.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `mcp-anticheat-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Skip a question when an earlier answer already settled it.

1. Does your game have a server, or a host player, that decides outcomes such as moves, hits, scores or rewards? If not (a fully offline game), this template does not apply: say so and stop.
2. Which game are we reviewing?
3. Which build should I grade?
4. Which local or staging server may the tests run against?
5. Do I have your written go-ahead to review that server? I never test against live players or anyone else's server.
6. Who or what produces the evidence pack: a CI job or a manual capture from that test server?
7. Are your levels built in one editor and loaded by another, or edited by an agent over MCP?
8. If so, which editors are involved, and which coordinate convention (up axis, handedness, unit) does the server use?
9. Does the server judge hits in real time, rewinding time to compensate for lag? If not (for example it judges turns), we use the `turn-based` profile.
10. Does your game have any input assist, such as aim assist, steering assist or touch snap? If not, we use the `no-input-assist` profile.
11. Does your game have bots or scripted input? If not, `parity:1` has no profile: it stays unmeasured and I mark it "does not apply".
12. Does your game have an automatic cheat detector? If not, `recovery-and-detection:2` has no profile: it stays unmeasured and I mark it "does not apply".
13. Read the profiles you picked back to the owner and, once they approve, set them before scoring, for example `"rubricProfile": ["turn-based", "no-input-assist"]` in `pack.profile`. Each selected line then reads N/A (not U, not a defect), its partner line takes the pillar's 20 points, and the verdict can reach PASS.
14. Then ask the targets one per message, only for what the game has, starting from the synthetic values in `fixtures/good-pack.json`:
    - How many messages per second should the server accept from one player before it limits them? (`maxMsgsPerSecond`)
    - Lag compensation: How far back in time, in milliseconds, may the server rewind to judge a hit? (`lagCompMaxMs`)
    - Input assists: Which devices should we compare, for example pad and touch? (`assistDevices`)
    - Input assists: How much difference in assist strength between those devices is acceptable, in percentage points? (`maxAssistDeltaPct`)
    - Automatic detector: What share of honest sessions may it wrongly flag? (`maxFalsePositiveRate`)
    - Automatic detector: What share of known-cheat test sessions may it miss? (`maxFalseNegativeRate`)
15. Who reviews the local finding drafts and the multi-account review queue?

Before grading a real pack, check that its build and profile match the owner's answers. Record a capture or run that could not happen as NOT_RUN. Use the sample sizes listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads (all trace evidence): `authority`, `clamping`, `cadence`, `flood`, `joins` (every server game); `hiddenInfo` with scene receipts (games with level geometry); `lagComp` (real-time hit judging); `actionParity` (bots or scripted input); `assist` (input assists); `detection` (an automatic detector); `multiAccount` (the multi-account growth check).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet, or a feature your game does not have, stays out of the pack. A line covered by an approved profile reads N/A; any other line grades U (UNMEASURED), which is honest and costs no false defect.

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
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects. For a feature the game does not have, write "does not apply" instead. Name the rubric profiles used next to the grade; their lines read N/A. A missing feature with no profile leaves coverage below 100 percent and the verdict CONDITIONAL.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic. Keep player identifiers out.
- Multi-account suspicion: one local review-queue draft per flagged group for the human reviewer. Never an automatic ban, mute or message.
- Rubric lines: server-authority:1, server-authority:2, cadence-and-timing:1, cadence-and-timing:2, parity:1, parity:2, exposure-and-abuse:1, exposure-and-abuse:2, recovery-and-detection:1, recovery-and-detection:2. The `server-authority-fairness-audit` skill explains each one in plain words.

## 5. Skills in this template

- `cross-editor-scene-parity`: the Scene Parity part. Prove the server's collision, spawn and visibility data match the scene players see after an editor export or an MCP edit.
- `server-authority-fairness-audit`: the Anti-Cheat Guard part. Review, defensively and on your own test server, that the server applies your game's rules the same way for every player and client.
- `mcp-anticheat-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Detection rates need labelled sessions; the worked example is synthetic.

Have the owner identify the authorized isolated fixture and supply sanitized decision records. Use read-only evidence. Player enforcement is a human decision.

Before capture, agree on the case IDs and expected values in `profile.cases`. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `layout-brief` (optional, ^1.0.0) | 11 Environment | `.grokbot-team/artifacts/layout-brief/` | Continue: the owner lists the scenes in profile.cases.sceneParity, and the report says "ASSUMPTION: no layout-brief available". |
| `tracker-export` (optional, ^1.0.0) | the owner | `.grokbot-team/artifacts/tracker-export/` | Continue without it. Start the report with "ASSUMPTION: no tracker-export available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `incident-report` (optional, ^1.0.0) | 22 Live Service | `.grokbot-team/artifacts/incident-report/` | Continue without it. Start the report with "ASSUMPTION: no incident-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `support-case-draft` (optional, ^1.0.0) | 23 Support Desk | `.grokbot-team/artifacts/support-case-draft/` | Continue without it. Start the report with "ASSUMPTION: no support-case-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `fairness-findings` 1.0.0 | JSON plus a Markdown summary | `.grokbot-team/artifacts/fairness-findings/` | 17 Sprites, 20 Patch Notes, 22 Live Service |
| `enforcement-policy-draft` 1.0.0 | Markdown local draft plus a JSON rule list | `.grokbot-team/artifacts/enforcement-policy-draft/` | 22 Live Service, 24 Ledger |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `regions` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-15-mcp-anticheat-director` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
