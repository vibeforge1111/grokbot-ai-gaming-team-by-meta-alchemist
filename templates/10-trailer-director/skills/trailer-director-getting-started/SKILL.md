---
name: trailer-director-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Stream-to-Devlog & Trailer Cut Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-10-trailer-cut-director v1.3.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. Set the frame-time budget separately for each target device in your game profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Stream-to-Devlog & Trailer Cut Director: Getting Started

Turn recorded gameplay into a devlog or trailer. Choose moments that show the player experience, frame them for each destination and check the cut for sensitive information.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `trailer-director-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Start every profile value from `fixtures/good-pack.json` and ask the owner to confirm or replace it; the sample values are synthetic examples, never defaults.

1. Which game are we working on? Then ask, one at a time: which build should the footage come from (a build id or commit), and what produces the evidence pack (a CI job or a manual capture)?
2. What should a viewer understand or feel by the end of the cut? For example "every level is one screen of tight jumps" or "your farm changes with the seasons".
3. Does your game log its own events, such as level complete, puzzle solved, lap record or story choice? If not, we pick moments by hand while watching.
4. Which formats do you need? Name each cut, for example a wide 16:9 cut for a store page and a vertical 9:16 cut for short-video apps. Add square 1:1 or portrait 4:5 only if you will post to a feed that uses them. Each answer becomes an entry in `deliveryCuts` and one `decodedCuts` case.
5. How long may each cut be on the platforms you chose? This sets `maxLengthS`.
6. How loud should the final mix be, how far off may it be, and how high may its true peak go? This sets `targetLufs`, `lufsTolerance` and `maxTruePeakDb` (in dBTP). Your platforms decide; the sample uses -14, 1 and -1.
7. How far may sound drift from picture before it looks wrong? This sets `maxAvSyncMs`.
8. What share of speech cues must the captions match? This sets `minCaptionMatch`.
9. Which parts of each file should the final review cover? This sets `reviewChannels`: picture, audio, captions, title, filename and metadata.
10. Can the footage show anything private, such as player names, chat, desktop notifications or unreleased content? Who checks it?
11. Who will watch the wide cut and judge whether the action reads? That person records the `readable-story:2` judgement.
12. Who reviews the local finding drafts?

Before grading a real pack, match its build and profile to what the owner approved. Record unavailable capture or execution as NOT_RUN. Run `node engine/lens.mjs --meta` to see the population each line needs (the list or count of things measured, such as shots or caption cues).

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads: `shots` (capture), `claims` (static), `edl` (static), `cropFraming` (capture), `redaction` (capture), `exports` (capture), `recovery` (capture), `captions` (capture), `sound` (capture), `licensing` (static).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Receipts: one result row per test case agreed in `profile.cases`, with the measured values. For example, one `decodedCuts` row per delivery cut with the decoded width, height, frame rate and codec.
- Judgements for the perception lines (`readable-story:2`): `{ level, judge, evidenceIds, note }`, citing artifact ids that exist in the pack.
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
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines: authentic-gameplay:1, authentic-gameplay:2, readable-story:1, readable-story:2, composition:1, composition:2, technical-export:1, technical-export:2, accessible-delivery:1, accessible-delivery:2.

## 5. Skills in this template

Use them in this order:

- `gameplay-moment-finder`: picks the moments from the game's own events, the footage or hand picks. Fills `shots`, `claims` and `edl` (authentic-gameplay:1 and 2, readable-story:1).
- `multi-aspect-smart-framing-exporter`: reframes each approved cut, exports it and decodes it. Fills `cropFraming`, `exports`, `recovery` and `licensing` (composition:1, technical-export:1 and 2).
- `beat-sync-and-secret-redaction-gate`: times the cut and reviews every final export. Fills `redaction`, `captions` and `sound` (composition:2, accessible-delivery:1 and 2).
- `trailer-director-lens-engine`: the engine source and how to run it.

## Blockers to tell the owner about

- Action readable in the main wide cut (`readable-story:2`) needs a person to watch the wide cut; it stays U until a named reviewer records a judgement.

Confirm content rights, protected subjects, required formats and the reviewer. For missing footage or tools, draft the outstanding checks locally and record NOT_RUN.

Before capture, agree on the case IDs and expected values in `profile.cases`. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `hud-capture-set` (optional, ^1.0.0) | 09 HUD | `.grokbot-team/artifacts/hud-capture-set/` | Continue: mark the essential UI by hand while framing, and write "ASSUMPTION: no hud-capture-set available" in the report. |
| `audio-mix-report` (optional, ^1.0.0) | 13 Audio | `.grokbot-team/artifacts/audio-mix-report/` | Continue: measure loudness on the decoded file yourself, and write "ASSUMPTION: no audio-mix-report available" in the report. |
| `change-list` (optional, ^1.0.0) | the owner, 18 Bug Desk | `.grokbot-team/artifacts/change-list/` | Continue: check every feature claim directly against the build, and write "ASSUMPTION: no change-list available" in the report. |
| `pitch-draft` (optional, ^1.0.0) | 12 Producer | `.grokbot-team/artifacts/pitch-draft/` | Continue without it. Start the report with "ASSUMPTION: no pitch-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `clip-list` 1.0.0 | JSON | `.grokbot-team/artifacts/clip-list/` | 19 Store Page, 20 Patch Notes |
| `media-export-manifest` 1.0.0 | JSON manifest plus the exported video and still files | `.grokbot-team/artifacts/media-export-manifest/` | 19 Store Page, 20 Patch Notes |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-10-trailer-cut-director` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
