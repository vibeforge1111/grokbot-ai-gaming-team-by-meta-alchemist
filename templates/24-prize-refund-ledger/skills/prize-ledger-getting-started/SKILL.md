---
name: prize-ledger-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, set the profile from the worked example, and run the first Prize, Refund and Entitlement Ledger grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-24-prize-refund-ledger v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Preview engine: the vendored lens kit 1.1.0 trusts the metrics a pack declares and does not check artifact bytes or a producer receipt. Say so beside every grade.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Prize, Refund and Entitlement Ledger: Getting Started

Reconcile local claim histories against owner decisions and fulfillment evidence, then draft a review digest. This is a preview: the ledger and its journal importer are bundled, but the importer does not yet carry the claim and payout address checks, so four lines stay U on a real journal.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `prize-ledger-lens-engine` skill, and the domain files from the `prize-ledger-domain-engine` skill (Node 18+, no dependencies).

## Words used here

- **Evidence pack:** one JSON file with the measurements for one build. The engine grades it.
- **Profile (`pack.profile`):** the owner's settings and thresholds. They live in the pack, never in the engine.
- **gitSha, liveSha and packId:** the source revision, the build players actually run, and the pack's own id. A pack without all three is INVALID.
- **U (UNMEASURED) and NOT_RUN:** U means no evidence yet and earns 0 points without counting as a defect. NOT_RUN means a step was planned but did not run.
- **Journal:** the owner's record of each claim row and its history of state changes, with roles agent, owner and evidence-import.
- **Subject key:** the kit's salted subject id (sub_ plus 32 hex) for the person a prize goes to. Never a name, handle or email.
- **Payout address:** where a contest award is paid, when a program pays out at all. It is shown only masked.

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message.

1. "Which game are we working on? Its name, genre and platforms are enough." Then ask: "Which build should I look at first? A build id, commit or version is enough." Then ask: "Who or what will produce the evidence: an owner-prepared claim journal (rows, history and an entitlement snapshot)?"
2. "Which prizes, entitlements and refund programs are in scope, and who approves exceptions?" Approvals in the journal use the `owner` role.
3. "What source proves fulfillment for each program (an entitlement read, a grant log, a refund receipt), and what is the wait limit?"
4. "Does this program grant account entitlements only, or does it pay to an address that needs a private address review? If it pays, what address format and mask lengths apply?" For entitlements only, set `profile.rubricProfile` to `account-only`.
5. "Who reviews my local drafts before anything is sent, posted, filed or changed, and where should I save them?"

## 2. Walk the profile

Start from the worked example's synthetic values in `fixtures/good-pack.json` and ask about each key in turn, one at a time. Keep only values the owner confirms; a missing threshold makes its line U, never a default.

| Key | Worked example (synthetic) | What it sets |
|---|---|---|
| `slaDays` | 3 | days an approved row may wait before it counts as overdue |
| `maxOverdue` | 0 | overdue rows allowed |
| `maxRefundsOwed` | 2 | refunds owed allowed at once |
| `maxReportedOnly` | 0 | confirmations resting on a report alone |
| `minProbeAttempts` | 18 | forbidden transitions the authority probe must try |
| `addressPattern` | an example pattern | the payout address format (a regular expression); leave out for account-only programs |
| `maskHead, maskTail` | 6, 4 | characters a masked address keeps at each end |
| `rubricProfile` | not set | `account-only` when no address is ever collected |

## 3. Run the first grade

```sh
node tests/run-all.mjs                           # contract, fixtures, empty sample and safety tests
node engine/lens.mjs fixtures/good-pack.json     # worked example, synthetic, not a measurement
node ledger/import-claim-ledger.mjs journal.json > pack.json
node engine/lens.mjs pack.json                   # the owner's build
```

If a command fails, report the error and stop; never grade a half-made pack. If the owner has no journal yet, record NOT_RUN and leave the lines U.

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence, and say that this preview engine trusts the metrics the pack declares.
- List U lines as "not measured yet" with the evidence that would measure them. Never call them defects.
- One local finding draft per measured failure, citing the pack id and artifact ids. Label a synthetic pack as synthetic.
- Compare with an earlier grade only when the rubric hash and profile match.

## 5. Skills in this template

- `prize-ledger-claim-and-wallet-checks`: Use when a prize or refund claim needs eligibility checks (winner match, duplicates, exclusions, redirects), or a payout address needs format, lookalike and exchange checks before any grant is proposed. Informs `eligibility:1`, `eligibility:2`, `wallet-safety:1` and `wallet-safety:2`.
- `prize-ledger-reconcile-and-digest`: Use when an owner-prepared claim journal needs replaying, reconciling against the game's entitlement snapshot and turning into a digest of what needs the owner's decision. Informs `authority-boundaries:1`, `authority-boundaries:2`, `delivery:1`, `delivery:2`, `reconciliation-and-reporting:1` and `reconciliation-and-reporting:2`.
- `prize-ledger-public-note-draft`: Use when players need a short status note about a prize, giveaway or refund program, written from aggregate counts only and left as a local draft for the owner. Moves no rubric line directly.
- `file-to-shared-ledger`: Use when an observed defect needs a local ticket draft or a proposed amendment to a known issue.
- `prize-ledger-lens-engine`: the engine source and how to run it.
- `prize-ledger-domain-engine`: the domain tools and their safety tests.

## Blockers to tell the owner about

- The importer drops the eligibility and payout address groups, so four lines stay U on a real journal.
- The authority line probes this template's own code, not the game.
- The engine trusts the declared metrics (lens kit 1.1.0).

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner, 02 Playtest | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `support-case-draft` (optional, ^1.0.0) | 23 Support Desk | `.grokbot-team/artifacts/support-case-draft/` | Continue without it. Start the report with "ASSUMPTION: no support-case-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `enforcement-policy-draft` (optional, ^1.0.0) | 15 Server Fairness | `.grokbot-team/artifacts/enforcement-policy-draft/` | Continue without it. Start the report with "ASSUMPTION: no enforcement-policy-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `entitlement-ledger` 1.0.0 | JSON plus a text digest draft | `.grokbot-team/artifacts/entitlement-ledger/` | 06 Economy, 22 Live Service, 23 Support Desk, 28 App Store |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `entitlements`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-24-prize-refund-ledger` and `0.1.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
