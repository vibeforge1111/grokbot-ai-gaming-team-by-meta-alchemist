---
name: balance-director-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, set the profile from the worked example, and run the first Live-Ops Balance Patch Director grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-26-balance-patch-director v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Live-Ops Balance Patch Director: Getting Started

Compare configurable numeric parameters with observed outcomes and draft bounded, reversible changes. This is a preview: the director and its runner are bundled, but several checks pass by construction and the prediction check compares the model with itself.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `balance-director-lens-engine` skill, and the domain files from the `balance-director-domain-engine` skill (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Profile (`pack.profile`):** the owner's settings and thresholds. They live in the pack, never in the engine.
- **gitSha, liveSha and packId:** the source revision, the build players actually run, and the pack's own id. A pack without all three is INVALID.
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a step was planned but did not run.
- **Parameter:** one numeric value in the game's data, with an id, a unit and the names people use for it (aliases).
- **Reference export:** a second, independent read of the same values, so a parsing mistake shows as a mismatch.
- **Option step:** how far the decrease and increase options move a parameter, set by `stepPct` and capped by `maxStepPct`.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Its name, genre and platforms are enough." Then ask: "Which build should I look at first? A build id, commit or version is enough." Then ask: "Who or what will produce the evidence: the build's parameter files plus a separate reference export and an outcome export?"
2. "Which parameters, units, aliases and independent reference export describe this build?"
3. "What outcome and target should each parameter influence, and is a proportional model appropriate?"
4. "What observation floor, freshness limit, option step and change caps should govern recommendations?"
5. "Who reviews my local drafts before anything is sent, posted, filed or changed, and where should I save them?"

## 2. Walk the profile

Start from the worked example's synthetic values in `fixtures/good-pack.json` and ask about each key in turn, one at a time. Keep only values the owner confirms; a missing threshold makes its line U, never a default.

| Key | Worked example (synthetic) | What it sets |
|---|---|---|
| `stepPct` | 10 | the percent step between the hold, decrease and increase options |
| `maxStepPct` | 15 | the largest change any option may make |
| `maxLevers` | 2 | parameters one patch may move |
| `minParameters` | 2 | parameters the build must declare |
| `minObservations` | 20 | cases an observation needs before it counts |
| `maxTelemetryAgeDays` | 5 | the oldest observation that still counts |
| `minProbeAttempts` | 4 | forbidden actions the authority probe must try |

## 3. Run the first grade

```sh
node tests/run-all.mjs                           # contract, fixtures, empty sample and safety tests
node engine/lens.mjs fixtures/good-pack.json     # worked example, synthetic, not a measurement
node balance/run.mjs input.json > pack.json
node engine/lens.mjs pack.json                   # the owner's build
```

If a command fails, report the error and stop; never grade a half-made pack. If the owner has no parameter or outcome export yet, record NOT_RUN and leave the lines U.

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence, and grade the pack from its folder so artifact bytes and the producer receipt are checked.
- List U lines as "not measured yet" with the evidence that would measure them. Never call them defects.
- One local finding draft per measured failure, citing the pack id and artifact ids. Label a synthetic pack as synthetic.
- Compare with an earlier grade only when the rubric hash and profile match.

## 5. Skills in this template

- `balance-director-weekly-proposal`: Use when owners or players ask for balance changes by name and you need to resolve each name to one parameter and draft hold, decrease and increase options inside the profile's caps. Informs `data-fidelity:1`, `data-fidelity:2`, `evidence:1`, `evidence:2`, `proposals:1`, `proposals:2`, `authority:1`, `authority:2` and `patch-notes:2`.
- `balance-director-patch-notes-draft`: Use when the owner has picked which proposed balance options to ship and wants player-facing patch notes drafted, with holds and unresolved names kept honest. Informs `patch-notes:1`.
- `balance-director-post-release-read`: Use when a balance change has shipped and you need to compare like-for-like observations from the previous and current build against what the model predicted. Informs `evidence:2` on the new build; the result feeds the next proposal.
- `file-to-shared-ledger`: Use when an observed defect needs a local ticket draft or a proposed amendment to a known issue.
- `balance-director-lens-engine`: the engine source and how to run it.
- `balance-director-domain-engine`: the domain tools and their safety tests.

## Blockers to tell the owner about

- The prediction check compares the model with itself, and several proposal checks are true by construction.
- No input carries the owner's picks yet, and the post-release comparison is manual.
- Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `support-case-draft` (optional, ^1.0.0) | 23 Support Desk | `.grokbot-team/artifacts/support-case-draft/` | Continue without it. Start the report with "ASSUMPTION: no support-case-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `cohort-report` (optional, ^1.0.0) | 27 Retention | `.grokbot-team/artifacts/cohort-report/` | Continue without it. Start the report with "ASSUMPTION: no cohort-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `economy-change-list` (optional, ^1.0.0) | 06 Economy | `.grokbot-team/artifacts/economy-change-list/` | Continue without it. Start the report with "ASSUMPTION: no economy-change-list available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `balance-patch-draft` 1.0.0 | Markdown proposal and patch-notes drafts plus JSON | `.grokbot-team/artifacts/balance-patch-draft/` | 06 Economy, 20 Patch Notes, 27 Retention |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `balance`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `balance`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-26-balance-patch-director` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
