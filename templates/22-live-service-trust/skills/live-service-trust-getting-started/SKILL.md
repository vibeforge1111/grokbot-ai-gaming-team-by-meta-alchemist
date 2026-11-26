---
name: live-service-trust-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Live Service, Payments and Trust grade with the lens engine."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-22-live-service-trust v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A test that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Game facts and budgets come from your game profile (`pack.profile`). Treat sample numbers as illustrative. A line that does not apply to your game is marked not applicable only through an approved rubric profile.
> - An automated gate needs a negative fixture that fails. Receipts carry measured values, never an unconditional PASS.
> - A measured release blocker sets the grade to 0 and the verdict to BLOCKED, whatever the other lines score.

Created by @meta_alchemist (https://x.com/meta_alchemist).

> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Live Service, Payments and Trust: Getting Started

Review progress saves, entitlements and recovery after service failures. Include payment checks when your game sells items or access.

Every game that keeps player progress gets something from this template, even one that sells nothing: save and restore checks, crash and interruption recovery, build identity, privacy and data handling, and rights, age rating and support records. Payment checks are added only when the game sells something.

Words used here: an entitlement is something a player owns or has unlocked (an item, a level pack, an ad-free upgrade). Idempotent means a request sent twice has the same effect as once. Fault injection means causing a failure on purpose (a full disk, a cut connection, a crash mid-save) in a disposable test copy. Reconciliation means checking that the store's record, the saved state and the number on screen agree. A replay is the same request sent again, for example a purchase confirmation resent to get the item twice.

If `engine/lens.mjs`, `engine/lens-kit.mjs` or `fixtures/good-pack.json` are not on disk yet, write them byte for byte from the `live-service-trust-lens-engine` skill first (Node 18+, no dependencies).

## 1. Onboard one question at a time

Ask one question at a time, wait for the answer, then ask the next. Never stack questions in one message. Skip a question when an earlier answer already settled it.

1. Which game are we reviewing?
2. Which build should I grade?
3. Who or what produces the evidence pack for that build: a CI job or a manual capture?
4. Where does the game keep player progress: on the device, in the cloud, on a server, or more than one of these?
5. Which save failures should we rehearse? For example storage unavailable, a corrupted save, a save from an older version, and a fallback to memory when storage fails. These become `storageCases`.
6. Which interruptions should the game survive? For example a crash, the same account on two devices at once, and an update deployed during play. These become `recoveryCases`.
7. Does the game sell anything for real money: items, currency, a pass, an ad-free upgrade or a subscription? If not, we use the `no-store` profile: the payment lines read N/A and the paid-item blockers no longer apply.
8. If it does: is there an isolated test service or store sandbox (no real money) where you can run failed, duplicate and out-of-order purchases yourself? Without one, the transaction lines are NOT_RUN and stay unmeasured: never test against real payments. I only review your sandbox results; I never make a charge, refund or grant, real or sandbox.
9. Do players sign in to accounts or an online service?
10. If so, how many requests per minute should one player be allowed before the service limits them? This becomes `maxRequestsPerMinute`.
11. Who is the qualified person (for example a lawyer or a privacy lead) who reviews privacy, rights and age? I only check that the records exist and are complete; I never give legal sign-off.
12. Who reviews the local finding drafts before anything is filed?

Start from the synthetic values in `fixtures/good-pack.json` and confirm or replace each profile value with the owner's answers. If the game sells nothing, read the `no-store` pick back to the owner and, once they approve, set `"rubricProfile": ["no-store"]` in `pack.profile` before scoring. Before grading a real pack, check that its build and profile match those answers. Record a capture or run that could not happen as NOT_RUN. Use the sample sizes listed by `node engine/lens.mjs --meta`.

## 2. What you provide

- An evidence pack (JSON) with `status: "VALID"`, a `liveSha`, a `gitSha` and a `packId` (all three are required), and an `artifacts` list. Every metric group names the artifact id it came from.
- Metric groups this engine reads, by what the game has:
  - Every game that keeps progress: `storage` (trace), `recovery` (trace), `live` (config), `privacy` (static), `rights` (static).
  - Accounts or an online service: `authz` (trace), `replay` (trace).
  - A running service: `ops` (trace).
  - Something sold for real money: `tx` (trace), `restore` (trace), and the growth check `storePolicy` (static).
  - A contest or prize event: the growth check `contestRules` (static).
- Profile thresholds in `pack.profile`. A missing threshold makes its line U, never a default.
- Anything you cannot capture yet, or a system your game does not have, stays out of the pack. It grades U (UNMEASURED), which is honest and costs no false defect. Under the approved `no-store` profile the transaction lines read N/A instead.

## 3. Run the first grade

```
node engine/lens.mjs fixtures/good-pack.json   # worked example, synthetic, not a measurement
node engine/lens.mjs your-pack.json            # your build
node engine/lens.mjs --meta                    # rubric lines, weights and what each reads
node engine/lens.mjs --fixtures fixtures/good-pack.json  # negative and missing-input self-test
```

Read the record: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`, then `blocking` and `unmeasuredBlockers`, then `checks` (growth checks reported beside the grade) and `tickets` (deduplicated candidates).

## 4. Report in plain English

- Lead with the verdict, grade and coverage in one sentence. Say how much of the rubric was measured.
- List U lines as "not measured yet" with the capture that would measure them. Never call them defects. For a system the game does not have, write "does not apply" instead. Name the rubric profiles used next to the grade.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic pack as synthetic.
- Rubric lines, grouped by what they need:
  - Every game that keeps progress: durability-and-recovery:1, durability-and-recovery:2, operations:1, privacy-age-rights-safety-and-support:1, privacy-age-rights-safety-and-support:2.
  - Accounts or an online service: authorization-and-abuse-boundaries:1, authorization-and-abuse-boundaries:2.
  - A running service: operations:2.
  - Something sold for real money: transactions-and-entitlements:1, transactions-and-entitlements:2.

## If your game sells nothing

You still get save durability, crash and interruption recovery, build identity, privacy and data handling, and rights, age and support records, plus account isolation and replay checks if players sign in. With the owner's approval before scoring, select the `no-store` profile (`"rubricProfile": ["no-store"]`). The two transaction lines then read N/A, never U and never a defect, their 20 points are shared over the other eight lines (12.5 each), the three paid-item release blockers no longer apply, and the verdict can reach PASS.

Accounts, an online service and a running service have no profile. A game without them leaves `authz`, `replay` and `ops` out: those lines stay U, the replay blocker stays unmeasured and the verdict stays CONDITIONAL. Write in the report that those systems do not apply, so the CONDITIONAL is not read as a defect.

## Blockers to tell the owner about

A confirmed release blocker sets the verdict to BLOCKED and the grade to 0, even if other cases are missing. The first three apply to every game that sells something and do not apply under the approved `no-store` profile; the replay blocker applies to any game with an online service:

- Confirmed paid-item loss blocks release: a player paid and did not get the item.
- A duplicate paid grant blocks release: one payment granted the item twice.
- A measured entitlement shortfall after restore blocks release: restoring purchases (for example on a new phone) gave back less than the player owns.
- An accepted transaction replay blocks release: a resent request (a purchase, a reward claim, a save) was accepted again.
- Legal sign-off is never given by the agent; it needs a qualified person.

## 5. Skills in this template

- `transaction-idempotency-and-entitlement-audit`: only if the game sells something. Reconcile purchase and entitlement records across retries, interruptions and restores in the owner's sandbox results.
- `persistence-fault-injection`: every game that keeps progress. Check that each save path keeps progress through interruptions and storage failures.
- `live-ops-incident-drill-and-build-identity`: record which build is really running or published; for a running service, review a health, incident and rollback drill.
- `rights-privacy-and-safety-review`: check that privacy, data retention, age rating, asset and music rights, player safety and support records exist and are complete. Never gives legal sign-off.
- `file-to-shared-ledger`: draft a local tracker change for human review with the evidence needed to verify it.
- `live-service-trust-lens-engine`: the engine source and how to run it.

Before capture, agree on the case IDs and expected values in `profile.cases`. Run `node engine/lens.mjs --meta` for the required row fields and comparisons. Record one row per approved case under `receipts`, including its id, liveSha and artifact ID. A skipped or stale case leaves its line U. The bundled rows and budgets are synthetic.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `economy-change-list` (optional, ^1.0.0) | 06 Economy | `.grokbot-team/artifacts/economy-change-list/` | Continue: review the current build only, and write "ASSUMPTION: no economy-change-list available" in the report. |
| `fairness-findings` (optional, ^1.0.0) | 15 Server Fairness | `.grokbot-team/artifacts/fairness-findings/` | Continue: grade the authorization lines from this template's own pack. |
| `enforcement-policy-draft` (optional, ^1.0.0) | 15 Server Fairness | `.grokbot-team/artifacts/enforcement-policy-draft/` | Continue without it. Start the report with "ASSUMPTION: no enforcement-policy-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `tracker-export` (optional, ^1.0.0) | the owner | `.grokbot-team/artifacts/tracker-export/` | Continue without it. Start the report with "ASSUMPTION: no tracker-export available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `entitlement-ledger` (optional, ^1.0.0) | 24 Ledger | `.grokbot-team/artifacts/entitlement-ledger/` | Continue without it. Start the report with "ASSUMPTION: no entitlement-ledger available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `incident-report` 1.0.0 | Markdown local draft plus JSON | `.grokbot-team/artifacts/incident-report/` | 15 Server Fairness, 18 Bug Desk, 23 Support Desk |
| `trust-records` 1.0.0 | JSON | `.grokbot-team/artifacts/trust-records/` | 19 Store Page, 28 App Store |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | 12 Producer |
| `ticket-draft` 1.0.0 | JSON or Markdown local draft | `.grokbot-team/artifacts/ticket-draft/` | 12 Producer, 18 Bug Desk |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `entitlements`, `regions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `incidents`, `entitlements`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-22-live-service-trust` and `1.0.1`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
