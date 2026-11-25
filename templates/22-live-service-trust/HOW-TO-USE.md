# How to use: Live Service, Payments and Trust

Created by @meta_alchemist (https://x.com/meta_alchemist).

Review progress saves, entitlements and recovery after service failures. Include payment checks when your game sells items or access.

- **Pipeline stage:** Ship, Live
- **Fits:** every game that keeps player progress, including one that sells nothing. Payment checks are added only when the game sells something.
- **When:** Before you store progress or take money, before each update or live event, and after any save or payment incident.
- **You provide:** Save flows and a recovery plan, owner-run test results from a disposable copy, and your privacy, rights and support records. Sandbox purchase results only if the game sells something.
- **You get:** Save and recovery findings, a build identity check, a privacy, rights and safety records checklist, an incident summary draft (`incident-report`) and, for games that sell, a purchase reconciliation review (idempotency: a request sent twice acts once).
- **Takes from:** Game Economy Director (06) for proposed price and reward changes (`economy-change-list`), Server Fairness & Anti-Cheat Guard (15) for `fairness-findings` and an `enforcement-policy-draft`, and the approved `game-profile`.
- **Hands to:** Bug Desk (18) for local ticket drafts, and the owner for every money and legal decision.

A game that sells nothing still gets save durability, crash and interruption recovery, build identity, privacy, rights, age and support checks, and account checks if players sign in. The owner approves the `no-store` profile before scoring and sets `"rubricProfile": ["no-store"]` in the game profile: the transaction lines read N/A, their 20 points are shared over the other eight lines, the paid-item release blockers no longer apply, and the verdict can reach PASS.

Use a CI run or a manual capture for build evidence. Playtest QA (template 02) is coming later.

## Install

### Option A: Add to Grok Bot after review

Share link pending review. Use Option B for Grok Bot or Option C for other agents.

### Option B: Manual setup in Grok Bot

1. For each folder in `skills/`, paste its `SKILL.md` into a Grok Bot chat and say: "Save this as a skill." Start with the `-lens-engine` skill, then the getting-started skill.
2. Paste each fact from [MEMORY.md](MEMORY.md) and say: "Remember this for this project."
3. Create each routine from the routine prompts in [PROMPTS.md](PROMPTS.md): "Create a weekly routine with this prompt: ...".
4. Say: "Run the live-service-trust-getting-started skill."

### Option C: Other agents (Cursor, Claude Code, Codex)

Copy `skills/<name>/SKILL.md` into your agent's skills folder (for example `.cursor/skills/`, `.claude/skills/` or the folder your Codex setup reads). Copy `engine/` and `fixtures/` into your repo so the agent can run the engine. See [INSTALL.md](../../INSTALL.md).

## First grade in two minutes

```
cd templates/22-live-service-trust
node engine/lens.mjs fixtures/good-pack.json      # worked example (synthetic, not a measurement)
node tests/lens-negative-fixtures.mjs             # every negative and missing-input case must behave
node tests/test-lens-contract.mjs                 # rubric, recipe embed and text checks
node engine/lens.mjs your-pack.json               # your build
```

## Skills

| Skill | Use it when |
|---|---|
| [`live-service-trust-getting-started`](skills/live-service-trust-getting-started/SKILL.md) | Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first Live Service, Payments and Trust grade. |
| [`transaction-idempotency-and-entitlement-audit`](skills/transaction-idempotency-and-entitlement-audit/SKILL.md) | Only if the game sells something: reconcile purchase and entitlement records across retries, duplicates, out-of-order notifications and restores, from the owner's sandbox results. Never makes a charge, refund or grant. |
| [`persistence-fault-injection`](skills/persistence-fault-injection/SKILL.md) | Every game that keeps progress: check that each save path keeps acknowledged progress through storage failures, crashes and interruptions, from owner-run tests in a disposable copy. |
| [`live-ops-incident-drill-and-build-identity`](skills/live-ops-incident-drill-and-build-identity/SKILL.md) | Record which build is really published or running; for a game with a running service, review an owner-run health, incident and rollback drill. |
| [`rights-privacy-and-safety-review`](skills/rights-privacy-and-safety-review/SKILL.md) | Use when checking that privacy, data retention, age gating, asset and music rights, player safety, moderation and support records exist and are complete. Never gives legal sign-off. |
| [`file-to-shared-ledger`](skills/file-to-shared-ledger/SKILL.md) | Draft a local tracker change for human review with the evidence needed to verify it. |
| [`live-service-trust-lens-engine`](skills/live-service-trust-lens-engine/SKILL.md) | Use when you need to grade a Live Service, Payments and Trust evidence pack: write the engine files from this skill and run them. |

## Rubric

`gbf-22-live-service-trust` v1.2.0, 100 points: 5 pillars of 20, 2 lines each, levels 0 to 4 or U. Full table: [RUBRIC.md](RUBRIC.md).

| Line | Name | Weight | Evidence | Needs |
|---|---|---|---|---|
| `transactions-and-entitlements:1` | Failed, duplicate and reordered operations | 10 | trace | something for sale |
| `transactions-and-entitlements:2` | Restore and reconciliation | 10 | trace | something for sale |
| `authorization-and-abuse-boundaries:1` | Access isolation and state transitions | 10 | trace | accounts or an online service |
| `authorization-and-abuse-boundaries:2` | Replay resistance and bounded resources | 10 | trace | accounts or an online service |
| `durability-and-recovery:1` | Storage failure and migration | 10 | trace | every game that saves |
| `durability-and-recovery:2` | Crash, concurrent sessions and deployment interruption | 10 | trace | every game that saves (list only the interruptions it can have) |
| `operations:1` | Live build vs graded build | 10 | config | every shipped game |
| `operations:2` | Service health, incident drill and rollback | 10 | trace | a running service |
| `privacy-age-rights-safety-and-support:1` | Privacy and data handling | 10 | static | every game |
| `privacy-age-rights-safety-and-support:2` | Rights, age, safety and support | 10 | static | every game |

Release blockers (verdict BLOCKED, grade 0) stay in force: confirmed paid-item loss, a duplicate paid grant, a shortfall after restoring purchases, and an accepted transaction replay. Under the approved `no-store` profile the first three do not apply (see [docs/RUBRIC_GUIDE.md](../../docs/RUBRIC_GUIDE.md#applicability)). Accounts and a running service have no profile: a game without them leaves those lines U, reported as "does not apply".

## Decisions only you make

- Who is the qualified person (for example a lawyer or a privacy lead) who reviews privacy, rights and age?
- Does the game sell anything for real money, and if so, which isolated sandbox will you use for the purchase drills? If not, approve the `no-store` profile before scoring.
- Which save failures and interruptions must the game survive?
- Every payment, refund, grant, deployment and rollback. The bot only reviews and drafts.

## Known limits

- Legal sign-off is never given by the agent; it needs a qualified person.
- A game with no accounts or online service has no profile for `authorization-and-abuse-boundaries` and `operations:2`: those lines stay U, the replay blocker stays unmeasured and the verdict stays CONDITIONAL, never a defect.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Works with other templates

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
- Write only `decisions`, `incidents`, `entitlements`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-22-live-service-trust` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->

## Safety defaults

- Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
- Missing evidence grades U (unmeasured), never a made-up number. Worked examples are labelled synthetic.
- The bot never makes a charge, refund or grant, real or sandbox, and never deploys or rolls back a service. The owner runs every drill in an isolated copy; production records are read-only. Legal sign-off is never given by the agent.
- Thresholds live in your game profile (`pack.profile`), never inside the engine.
