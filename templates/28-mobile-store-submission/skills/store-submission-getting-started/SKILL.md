---
name: store-submission-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, set the profile from the worked example, and run the first Mobile App Store Submission grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-28-mobile-store-submission v1.1.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Mobile App Store Submission: Getting Started

Review target-specific evidence and draft a store readiness checklist for a human release owner. This is a preview: any target can supply a normalized checks.json, and an optional Capacitor adapter reads Android and iOS config files; a second worked example for another engine is still missing.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `store-submission-lens-engine` skill, and the domain files from the `store-submission-domain-engine` skill (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Profile (`pack.profile`):** the owner's settings and thresholds. They live in the pack, never in the engine.
- **gitSha, liveSha and packId:** the source revision, the build players actually run, and the pack's own id. A pack without all three is INVALID.
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a step was planned but did not run.
- **Requirement:** a check id the target needs, listed per group (config, hard, perm, privacy, billing, accounts, secrets, signing, listing) in `profile.requirements`.
- **Observation:** one `checks.json` row for one requirement on the build under review, with a source reference and passed true or false.
- **Owner answers:** facts only the owner can give (billing, login, deletion, signing custody), kept in `answers.json`.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Its name, genre and platforms are enough." Then ask: "Which build should I look at first? A build id, commit or version is enough." Then ask: "Who or what will produce the evidence: a checks.json for your target, or the store config folder for the optional Capacitor adapter?"
2. "Which store or distribution target and which build are being prepared?"
3. "Which current policy references and requirements apply to that target?" Store the check ids per group in `profile.requirements`.
4. "Who owns signing, listing materials, account decisions and the final submission?"
5. "Who reviews my local drafts before anything is sent, posted, filed or changed, and where should I save them?"

## 2. Walk the profile

Start from the worked example's synthetic values in `fixtures/good-pack.json` and ask about each key in turn, one at a time. Keep only values the owner confirms; a missing threshold makes its line U, never a default.

| Key | Worked example (synthetic) | What it sets |
|---|---|---|
| `requirements` | nine groups of check ids (the adapter's list) | which checks the target needs |
| `minProbeAttempts` | 12 | forbidden build, sign and upload calls the probe must try |
| `minTargetSdk, minIosTarget` | 35, 15 (adapter only) | the lowest Android target SDK and iOS deployment target |
| `allowedPermissions` | INTERNET (adapter only) | Android permissions that need no owner reason |

## 3. Run the first grade

```sh
node tests/run-all.mjs                           # contract, fixtures, empty sample and safety tests
node engine/lens.mjs fixtures/good-pack.json     # worked example, synthetic, not a measurement
node mobile/run.mjs checks.json --pack-id <id> --git-sha <sha> --live-sha <sha> > pack.json
node engine/lens.mjs pack.json                   # the owner's build
```

If a command fails, report the error and stop; never grade a half-made pack. If the owner has no checks.json or adapter folder yet, record NOT_RUN and leave the lines U.

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence, and say that this preview engine trusts the metrics the pack declares.
- List U lines as "not measured yet" with the evidence that would measure them. Never call them defects.
- One local finding draft per measured failure, citing the pack id and artifact ids. Label a synthetic pack as synthetic.
- Compare with an earlier grade only when the rubric hash and profile match.

## 5. Skills in this template

- `store-submission-checklist`: Use before a store upload when a build's store requirements (config, hardening, permissions, privacy, billing, accounts, secrets, signing, listing) need checking against local evidence. Informs `build-config:1`, `build-config:2`, `privacy:1`, `privacy:2`, `store-policy:1`, `store-policy:2`, `signing:1`, `signing:2` and `submission:2`.
- `store-submission-owner-answers`: Use when billing, privacy, login, account deletion, listing or signing questions that only the owner can answer are still open, and you need a questionnaire and the answers.json they fill in. Informs `privacy:2`, `store-policy:1`, `store-policy:2`, `signing:2` and `submission:2`, through the answers.
- `store-submission-code-brief`: Use when a failed store check needs a local implementation brief for a developer, with the target, a redacted reference and the acceptance test. Moves no rubric line directly.
- `file-to-shared-ledger`: Use when an observed defect needs a local ticket draft or a proposed amendment to a known issue.
- `store-submission-lens-engine`: the engine source and how to run it.
- `store-submission-domain-engine`: the domain tools and their safety tests.

## Blockers to tell the owner about

- Only the Capacitor adapter reads files; other engines write a checks.json by hand until a second example ships.
- The submission line probes this template's own code, not the release pipeline.
- The engine trusts the declared metrics (lens kit 1.1.0).

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `store-asset-manifest` (optional, ^1.0.0) | 19 Store Page | `.grokbot-team/artifacts/store-asset-manifest/` | Continue without it. Start the report with "ASSUMPTION: no store-asset-manifest available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `access-report` (optional, ^1.0.0) | 21 Access | `.grokbot-team/artifacts/access-report/` | Continue without it. Start the report with "ASSUMPTION: no access-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `trust-records` (optional, ^1.0.0) | 22 Live Service | `.grokbot-team/artifacts/trust-records/` | Continue without it. Start the report with "ASSUMPTION: no trust-records available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `entitlement-ledger` (optional, ^1.0.0) | 24 Ledger | `.grokbot-team/artifacts/entitlement-ledger/` | Continue without it. Start the report with "ASSUMPTION: no entitlement-ledger available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `store-submission-checklist` 1.0.0 | Markdown checklist draft plus JSON findings | `.grokbot-team/artifacts/store-submission-checklist/` | 12 Producer |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `entitlements`, `incidents` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `releases`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-28-mobile-store-submission` and `0.1.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
