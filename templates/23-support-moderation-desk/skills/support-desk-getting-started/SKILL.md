---
name: support-desk-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, set the profile from the worked example, and run the first Community Support and Moderation Desk grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-23-support-moderation-desk v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Community Support and Moderation Desk: Getting Started

Prepare support replies, moderation reviews and case digests from redacted local intake. This is a preview: the drafting library is bundled, but no bundled tool writes a pack, so the owner's own adapter or a person records the counts (see CODE-BRIEF.md).

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `support-desk-lens-engine` skill, and the domain files from the `support-desk-domain-engine` skill (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Profile (`pack.profile`):** the owner's settings and thresholds. They live in the pack, never in the engine.
- **gitSha, liveSha and packId:** the source revision, the build players actually run, and the pack's own id. A pack without all three is INVALID.
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a step was planned but did not run.
- **Case reference and topic:** an opaque label such as `case-a`, and one of support, purchase, moderation or safety. Message bodies and contact details stay in the owner's intake system.
- **Knowledge entry revision:** a digest of an entry's question, answer and source. An edit makes a new revision, which needs a fresh approval.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Its name, genre and platforms are enough." Then ask: "Which build should I look at first? A build id, commit or version is enough." Then ask: "Who or what will produce the evidence: a help desk export plus an adapter of your own, or a person keeping the counts by hand?"
2. "Which local policy and knowledge sources may the desk cite?"
3. "Which reviewer handles each case class (support, purchase, moderation, safety), and how long may draft references be kept?" Store the retention answer; it feeds `privacy.retentionDaysSet`.
4. "What sample size, observation days and first-draft turnaround should the desk measure?"
5. "Who reviews my local drafts before anything is sent, posted, filed or changed, and where should I save them?"

## 2. Walk the profile

Start from the worked example's synthetic values in `fixtures/good-pack.json` and ask about each key in turn, one at a time. Keep only values the owner confirms; a missing threshold makes its line U, never a default.

| Key | Worked example (synthetic) | What it sets |
|---|---|---|
| `minUnknownTools` | 12 | unknown tool calls to try against the agent's tool guard |
| `minRedteamCases` | 12 | red-team cases the owner's case file must hold |
| `minKbApprovedShare` | 0.8 | share of knowledge entries the reviewer approved |
| `minObservationDays` | 3 | days of draft observation for the turnaround line |
| `maxFirstResponseMin` | 5 | median minutes from intake to first draft |

## 3. Run the first grade

```sh
node tests/run-all.mjs                           # contract, fixtures, empty sample and safety tests
node engine/lens.mjs fixtures/good-pack.json     # worked example, synthetic, not a measurement
node tests/test-safety.mjs                       # the drafting library's own checks
node engine/lens.mjs pack.json                   # the owner's build
```

If a command fails, report the error and stop; never grade a half-made pack. If the owner has no pack or intake yet, record NOT_RUN and leave the lines U.

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence, and say that this preview engine trusts the metrics the pack declares.
- List U lines as "not measured yet" with the evidence that would measure them. Never call them defects.
- One local finding draft per measured failure, citing the pack id and artifact ids. Label a synthetic pack as synthetic.
- Compare with an earlier grade only when the rubric hash and profile match.

## 5. Skills in this template

- `support-desk-ticket-intake`: Use when a batch of redacted support intake (tickets, form replies or chat exports with personal details removed) needs one local case draft per case, routed by topic. Informs `cases-and-drafts:1`, `cases-and-drafts:2` (when draft preparation is timed) and `privacy:1`.
- `support-desk-scam-moderation`: Use when a reported conduct case (a scam attempt, impersonation of staff, harassment) needs a moderation review draft with the rule, confidence and proportionate options for a human moderator. Informs `moderation-safety:1` and `moderation-safety:2`.
- `support-desk-kb-approval-batch`: Use when knowledge base entries were added or edited and the reviewer needs to see which ones need a fresh approval before drafts may reuse them. Informs `answers:1` and `answers:2`.
- `support-desk-daily-digest`: Use when the reviewer wants a count of local drafts by topic for a period, with open policy questions and turnaround, and no message bodies or contact details. Informs `cases-and-drafts:1`, `cases-and-drafts:2` and `privacy:2`.
- `file-to-shared-ledger`: Use when an observed defect needs a local ticket draft or a proposed amendment to a known issue.
- `support-desk-lens-engine`: the engine source and how to run it.
- `support-desk-domain-engine`: the domain tools and their safety tests.

## Blockers to tell the owner about

- No bundled tool writes a pack; 8 of the 10 lines read groups the owner's adapter must fill (see README.md).
- The red-team line needs an owner-approved red-team case file; without one it stays U.
- The engine trusts the declared metrics (lens kit 1.1.0).

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `incident-report` (optional, ^1.0.0) | 22 Live Service | `.grokbot-team/artifacts/incident-report/` | Continue without it. Start the report with "ASSUMPTION: no incident-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `entitlement-ledger` (optional, ^1.0.0) | 24 Ledger | `.grokbot-team/artifacts/entitlement-ledger/` | Continue without it. Start the report with "ASSUMPTION: no entitlement-ledger available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `patch-notes-draft` (optional, ^1.0.0) | 20 Patch Notes | `.grokbot-team/artifacts/patch-notes-draft/` | Continue without it. Start the report with "ASSUMPTION: no patch-notes-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `support-case-draft` 1.0.0 | JSON local drafts plus a JSON digest | `.grokbot-team/artifacts/support-case-draft/` | 15 Server Fairness, 18 Bug Desk, 24 Ledger, 26 Balance Patch |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `entitlements`, `releases`, `balance` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `incidents`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-23-support-moderation-desk` and `0.1.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
