---
name: parallel-game-producer-getting-started
description: "Use on first run with a new owner: agree the milestone, the ask and the Producer profile one question at a time, run the synthetic plan and grade, then build and grade the owner's own project."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Parallel Game Producer and Pitch Architect: getting started

Plan parallel work against actual capacity, reconcile ticket rows and turn verified project evidence into a local pitch deck draft. The short name is Producer (12). It works for a solo developer or a team, in any genre: the producer reads tasks, tickets, gate results and approved facts, not game mechanics.

If `engine/lens.mjs` is not on disk, write the files from the `parallel-game-producer-lens-engine` skill first (Node 18 or later, no dependencies). If `engine/plan.mjs` or `fixtures/project.json` is missing, write them from the "Worked example files" section of the `parallel-handoffs` skill.

## Words used here

- **Project file:** one local snapshot of the milestone (tasks, run receipts, tickets, gates, risks, facts, slides, deck review). The planner `engine/plan.mjs` reads it and prints a plan, a deck or a pack.
- **Wave:** a group of tasks that can run at the same time.
- **Role:** an anonymous label for who does the work, such as `design` or `art`. Never a person's name.
- **Lock:** a resource only one task may change at a time, such as a level file or a rules sheet.
- **Gate:** a check that must pass before go or hold, for example another template's grade record.
- **Deck review:** a reviewer's per-topic sign-off on one exact version of the slides, bound by a digest (a fingerprint of the slides, audience and ask).
- **U (UNMEASURED) and NOT_RUN:** U means no usable evidence yet; it earns 0 points and is not a defect. NOT_RUN means a planned run did not happen.

## 1. Onboard one question at a time

Start with the game, the milestone and the decision the owner needs. Ask one question, wait for the answer, then ask the next. Never stack questions in one message. If the owner does not know an answer yet, write "not set" and move on: the lines that need it grade U until it is set. Write each answer into a draft project file, using `fixtures/project.json` as the shape. Its values are synthetic examples, never defaults.

1. "Which game are we working on? Tell me its name or a code name, its genre, engine and platforms."
2. "Which milestone are we planning, who decides on it, and what decision do you need from them? For example: milestone 'world 1 vertical slice', audience 'publisher review', ask 'approve world 2'." (`milestone`, `audience`, `ask`)
3. "Which build should every receipt match? Give me the source revision and the build testers or players run." (`gitSha`, `liveSha`)
4. "Which roles work on this milestone, and how many hours can each give per wave? A solo developer might list `code` and `art` with their own weekly hours." (`hoursByRole`)
5. "Which task gathers the evidence everything else waits for, and which task is the final go or hold decision?" (`firstTask`, `decisionTask`)
6. "Which resources may only one task change at a time? For example a level file, the rules sheet or the build machine." (task `locks`)
7. "Which checks must pass before go or hold? For example the Game Feel (01) grade record, no open P0 tickets, or a playable build check." (`requiredGates`)
8. "Which severities does your tracker use? The list must include P0." (`severities`)
9. "Can you give me a read-only export of open and recently closed tickets, with who fixed and who verified each one as role labels, not names?"
10. "Which facts are approved for the pitch, with their sources? Which future work should appear only as a proposal, and what is cut if the ask is declined?" (`facts`)
11. "Which slide topics must the deck cover? The example uses promise, proof, scope, dependencies, risk and ask." (`requiredTopics`)
12. "What share of cases should count as the floor, the pass and the target? For example 0.5, 0.75 and 1." (`bands`)
13. "Where should I save local drafts (plans, decks, ticket drafts), and who reviews them before anything is sent or filed?"

Then choose a scope name for this approved profile revision (for example `world1-slice-review-a`). Confirm the bands again before any change of scope.

## 2. Run the synthetic example

```
node engine/plan.mjs fixtures/project.json --plan    # waves, ledger rollup and decision
node engine/plan.mjs fixtures/project.json --deck    # six-slide local pitch draft
node engine/lens.mjs fixtures/good-pack.json         # PASS, grade 100
```

## 3. Build and grade the owner's project

Ask for an owner-approved ledger export, task graph, time and capacity estimates, discipline receipts, approved pitch facts and a reviewed local deck. Gather them with the evidence skills:

| Group | Line | Row fields the planner writes | Skill |
|---|---|---|---|
| `scope` | `milestone:1` | `{caseId, testable}` | `milestone-scope` |
| `capacity` | `milestone:2` | `{caseId, role, hours}` | `milestone-scope` |
| `dependency` | `workstreams:1` | `{caseId, ready}` | `parallel-handoffs` |
| `locks` | `workstreams:2` | `{caseId, conflictFree}` | `parallel-handoffs` |
| `counts` | `ledger:1` | `{caseId, derived, reported}` | `ledger-reconciliation` |
| `closure` | `ledger:2` | `{caseId, verified}` | `ledger-reconciliation` |
| `gate` | `release-decision:1` | `{caseId, passed}` | `decision-gates` |
| `risk` | `release-decision:2` | `{caseId, actionable}` | `decision-gates` |
| `claims` | `pitch:1` | `{caseId, grounded}` | `evidence-pitch` |
| `review` | `pitch:2` | `{caseId, reviewed}` | `evidence-pitch` |

Never write these rows by hand. Build the pack with `node engine/plan.mjs <project.json> --pack > <pack.json>` and grade it with `node engine/lens.mjs <pack.json>`. A snapshot that does not match the approved build and scope, a duplicate id, a missing predecessor or a dependency cycle stops the planner with an error. For a real project set `synthetic` to false and follow "First real pack" in `HOW-TO-USE.md`.

If several kit templates work on this game, read the owner's earlier decisions first with `node engine/team-memory.mjs read decisions` from the game project root. Other templates' grade records live under `.grokbot-team/artifacts/grade-record/`; the `decision-gates` skill says how to use one as a gate. Save this template's own engine output as a local `grade-record` in the same folder, the plan as a local `work-plan` (under `.grokbot-team/artifacts/work-plan/`) and the slides as a local `pitch-draft` (under `.grokbot-team/artifacts/pitch-draft/`). Other templates may read the pitch draft only after the owner has reviewed it.

## 4. Report in plain English

- Lead with the go or hold recommendation, the verdict, grade and coverage in one sentence.
- List U lines as "not measured yet" with the receipt that would measure them. Never call them defects.
- Name every blocker with its receipt: a handoff before its predecessor passed, a lock clash, a failed required gate or an open P0.
- One local ticket draft per measured finding, with the pack id and artifact ids. Label any synthetic project as synthetic.
- Hand the owner a local wave plan, dependency exceptions, ledger rollup, go or hold recommendation and slide-by-slide pitch draft.

## 5. Skills in this template

- `milestone-scope`: bounded deliverables with role, done condition, proof and hours. Feeds `milestone:1` and `milestone:2`.
- `parallel-handoffs`: dependency order, waves, locks and the planner. Feeds `workstreams:1` and `workstreams:2`.
- `ledger-reconciliation`: backlog counts and closures from ticket rows, including Bug Desk (18) drafts. Feeds `ledger:1` and `ledger:2`.
- `decision-gates`: required gates (including other templates' grade records) and owned risks. Feeds `release-decision:1` and `release-decision:2`.
- `evidence-pitch`: the local pitch deck from approved facts. Feeds `pitch:1` and `pitch:2`.
- `parallel-game-producer-lens-engine`: the engine source and how to run it.

<!-- team:begin (generated by scripts/build-team.mjs from template.json; edit template.json, not this block) -->

## Team inputs and outputs

This template works on its own. When other templates from the kit run in the same game project, they exchange files under `.grokbot-team/artifacts/<artifact>/` (read the newest file) and share an append-only memory under `.grokbot-team/memory/`. Team spec 1.0.0.

Before acting, look for these inputs:

| Input | From | Where to look | If it is missing |
|---|---|---|---|
| `game-profile` (required, ^1.0.0) | the owner | `pack.profile` in the evidence pack, or `.grokbot-team/artifacts/game-profile/` | Ask the getting-started questions and write it with the owner. A missing threshold leaves its line unmeasured, never a default. |
| `evidence-pack` (required, ^1.0.0) | the owner | the pack path the owner gives, or `.grokbot-team/artifacts/evidence-pack/` | Stop and ask the owner for a pack. Without one there is no grade; record NOT_RUN. |
| `tracker-export` (optional, ^1.0.0) | the owner | `.grokbot-team/artifacts/tracker-export/` | Continue: count only the tickets in the owner's project file, and write "ASSUMPTION: no tracker-export available" in the report; reconciliation lines stay unmeasured. |
| `grade-record` (optional, ^1.0.0) | 01 Game Feel, 03 Prop and Rig, 05 Game Loop, 06 Economy, 09 HUD, 10 Trailer, 11 Environment, 13 Audio, 14 NPC and Lore, 15 Server Fairness, 17 Sprites, 18 Bug Desk, 19 Store Page, 20 Patch Notes, 21 Access, 22 Live Service, 23 Support Desk, 24 Ledger, 25 Matchmaking, 26 Balance Patch, 27 Retention, 28 App Store, 00 Starter | `.grokbot-team/artifacts/grade-record/` | Continue: a gate with no grade record from the other template stays unmeasured; never mark it passed. |
| `ticket-draft` (optional, ^1.0.0) | 01 Game Feel, 03 Prop and Rig, 05 Game Loop, 06 Economy, 09 HUD, 10 Trailer, 11 Environment, 13 Audio, 14 NPC and Lore, 15 Server Fairness, 17 Sprites, 18 Bug Desk, 19 Store Page, 20 Patch Notes, 21 Access, 22 Live Service, 23 Support Desk, 24 Ledger, 25 Matchmaking, 26 Balance Patch, 27 Retention, 28 App Store, 00 Starter | `.grokbot-team/artifacts/ticket-draft/` | Continue without it. Start the report with "ASSUMPTION: no ticket-draft available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `cohort-report` (optional, ^1.0.0) | 27 Retention | `.grokbot-team/artifacts/cohort-report/` | Continue without it. Start the report with "ASSUMPTION: no cohort-report available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |
| `store-submission-checklist` (optional, ^1.0.0) | 28 App Store | `.grokbot-team/artifacts/store-submission-checklist/` | Continue without it. Start the report with "ASSUMPTION: no store-submission-checklist available" and say which checks it would have informed. Leave lines that need it unmeasured. Never invent the missing data. |

After acting, save these outputs as local files for the human to review:

| Output | Format | Where | Read by |
|---|---|---|---|
| `work-plan` 1.0.0 | JSON plus a Markdown plan draft | `.grokbot-team/artifacts/work-plan/` | 20 Patch Notes |
| `pitch-draft` 1.0.0 | Markdown slide draft plus a JSON claim list | `.grokbot-team/artifacts/pitch-draft/` | 10 Trailer, 19 Store Page |
| `grade-record` 1.0.0 | JSON (the engine's grade record) | `.grokbot-team/artifacts/grade-record/` | the owner |

Each output file is JSON with `artifact`, `version`, `producer` (this template's id and version), `createdAt` (UTC), `synthetic` and `items`, as the kit's `spec/artifacts/<artifact>.schema.json` describes. Name files `<UTC date>-<short label>.json` so the newest sorts last.

Shared memory:

- Before acting, read `decisions`, `incidents`, `entitlements`, `balance`, `regions`, `releases` from `.grokbot-team/memory/<topic>.jsonl`. Skip records that have expired or that a later record supersedes.
- Write only `decisions`, `releases`. Append one line per record with `engine/team-memory.mjs` (or the same JSON by hand): id, UTC time, writer (`gbf-12-parallel-game-producer` and `1.0.0`), topic, kind, summary, data, source, confidence (measured, reported or assumed), expires_at and supersedes. Never edit or delete a line; supersede it.
- Never put secrets, names, handles, wallets, emails or raw user ids in memory. Refer to a person or account only by `node engine/team-memory.mjs hash <id>`, which needs the salt in `GROKBOT_TEAM_SALT`. Run `node engine/team-memory.mjs lint` before you finish.
- Keep `.grokbot-team/` out of a public game repository (add it to `.gitignore`); in a private one, commit it so the append-only rule can be checked against history.

<!-- team:end -->
