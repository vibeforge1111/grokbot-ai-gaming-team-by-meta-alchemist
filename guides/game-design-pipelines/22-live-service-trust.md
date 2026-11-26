# Live Service, Payments and Trust in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Review progress saves, entitlements and recovery after service failures. Include payment checks when your game sells items or access.

Every game that keeps player progress gets something from this template, even one that sells nothing: save durability, crash and interruption recovery, build identity, privacy and data handling, and rights, age rating and support records. Account and replay checks are added when players sign in, a rollback drill when there is a running service, and purchase checks when the game sells something.

Template folder: [templates/22-live-service-trust](../../templates/22-live-service-trust/). Install and prompts: [HOW-TO-USE.md](../../templates/22-live-service-trust/HOW-TO-USE.md), [PROMPTS.md](../../templates/22-live-service-trust/PROMPTS.md).

## When to use it

- **Stage:** Ship, Live
- **Trigger:** Before you store progress or take money, before each update or live event, and after any save or payment incident.

## Inputs and outputs

- **Inputs:** Save flows and a recovery plan, owner-run test results from a disposable copy, and your privacy, rights and support records. Sandbox purchase results only if the game sells something.
- **Outputs:** Save and recovery findings, a build identity check, a privacy, rights and safety records checklist, an incident summary draft (`incident-report`) and, for games that sell, a purchase reconciliation review.

## Handoffs

- **Takes from:** Game Economy Director (06) for proposed price and reward changes (`economy-change-list`), Server Fairness & Anti-Cheat Guard (15) for `fairness-findings` and an `enforcement-policy-draft`, and the approved `game-profile`.
- **Hands to:** Bug Desk (18) for local ticket drafts, and the owner for every money and legal decision.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `live-service-trust-getting-started`. It asks where progress is kept, which failures the game must survive, whether it sells anything (if not, you approve the `no-store` profile before scoring and it goes in `rubricProfile`), whether players sign in, and who the qualified reviewer is.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
3. **persistence-fault-injection (every game that saves):** review the owner's failure tests for each save path and interruption.
4. **live-ops-incident-drill-and-build-identity:** record which build is really published or running; for a running service, review the owner's health, incident and rollback drill.
5. **rights-privacy-and-safety-review (every game):** check privacy, retention, age, rights, safety and support records as files. Never gives legal sign-off.
6. **transaction-idempotency-and-entitlement-audit (only if the game sells something):** reconcile the owner's store sandbox results. The bot never makes a charge, refund or grant.
7. **file-to-shared-ledger:** draft a local tracker change for human review with the evidence needed to verify it.
8. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage. Name any measured release blocker first and the rubric profiles used; mark U lines for systems the game does not have as "does not apply".
9. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines at level 3 or above.

## Release blockers

A measured blocker sets the verdict to BLOCKED and the grade to 0: confirmed paid-item loss, a duplicate paid grant, a shortfall after restoring purchases, or an accepted transaction replay. Under the approved `no-store` profile the three paid-item blockers do not apply, the transaction lines read N/A, their 20 points are shared over the other eight lines, and a game that sells nothing can reach PASS. A blocker that applies but cannot be measured keeps the verdict at CONDITIONAL: a game with no online service has no profile for its account lines, so the replay blocker stays unmeasured and the report says why.

## Rubric pillars

- **Transactions and entitlements** (20, only if the game sells something): Failed, duplicate and reordered operations; Restore and reconciliation
- **Authorization and abuse boundaries** (20, accounts or an online service): Access isolation and state transitions; Replay resistance and bounded resources
- **Durability and recovery** (20, every game that saves): Storage failure and migration; Crash, concurrent sessions and deployment interruption
- **Operations** (20): Live build vs graded build (every shipped game); Service health, incident drill and rollback (a running service)
- **Privacy, age, rights, safety and support** (20, every game): Privacy and data handling; Rights, age, safety and support

See [README.md](README.md) for end to end pipelines that combine templates.
