# Parallel Game Producer and Pitch Architect: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the parallel-game-producer-getting-started skill. Ask me one question at a time. My game is <name or code name, genre, engine, platforms>. The milestone is <milestone>, the audience is <who decides> and the decision I need is <the ask>. The build to check is <commit and build id>. Tickets come from <tracker export file>.
```

Decisions the bot will ask you about, one question at a time:

- The milestone, its audience and the decision requested.
- The roles and each role's hours per wave.
- Which resources only one task may change at a time.
- The required gates, including other templates' grade records.
- The approved pitch claims and the scope cut if the ask is declined.
- The bands, where drafts go and who reviews them.

## 2. Routine prompts

**Parallel Game Producer: milestone review** (create it as a routine once the owner picks a cadence; replace `<cadence>` first, for example "Friday at 15:00" or "day before each milestone review"):

```
Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Every <cadence> (for example before each milestone decision, or weekly during production), check for a fresh project snapshot for Parallel Game Producer. Regenerate the local plan from fresh ledger rows with `node engine/plan.mjs <project.json> --plan`, review the locks and current gate receipts, then regenerate the pitch draft with `--deck`. Pin the build, profile revision and pack ID. Skip an unchanged snapshot. Mark skipped or unavailable runs NOT_RUN. On a fresh snapshot build the pack with `node engine/plan.mjs <project.json> --pack` and grade it with `node engine/lens.mjs <pack.json>`. Draft a local report with the go or hold recommendation, verdict, grade, supported points, coverage, interval, blocker receipts, and the next capture for each U line. Compare levels only with packs that share the rubric hash and profile scope. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Build the pack with `node engine/plan.mjs <project.json> --pack` and grade it with the parallel-game-producer-lens-engine engine. Lead with the go or hold recommendation, verdict, grade and coverage. Derive open counts from individual ticket keys. Show any blocking gate even if the ledger reconciles. List every U line as not measured yet with the capture that would measure it. Cite the case, receipt, build and scope for each finding.
```

- **milestone-scope**: bound the milestone and estimate capacity.

  ```
  Use the milestone-scope skill for milestone <milestone> and decision <ask>. Draft one task row per deliverable with id, role, needs, locks, hours, accept and proof. Put deferrable work under an explicit cut. Tell me which roles are over their hours in any wave.
  ```

- **parallel-handoffs**: order the work and check locks.

  ```
  Use the parallel-handoffs skill on <project.json>. Run `node engine/plan.mjs <project.json> --plan`. Show the waves, any lock clash, and every handoff with a stale, expired, failed or missing predecessor receipt.
  ```

- **ledger-reconciliation**: reconcile the backlog and closures.

  ```
  Use the ledger-reconciliation skill on <tracker export or Bug Desk drafts> for build <build id>. Map the rows onto ticket rows, reject duplicate ids, compare derived and reported counts per severity, and check each claimed closure for a source fix, a verification by a different role on this build, and its config state.
  ```

- **decision-gates**: go or hold.

  ```
  Use the decision-gates skill for milestone <milestone>. Read each required gate, including grade records under .grokbot-team/artifacts/grade-record/, and set passed only from a current record on this liveSha. Draft one risk row per material risk with role, trigger, fallback and decision point. Hold the decision if a required gate is missing.
  ```

- **evidence-pitch**: the pitch deck.

  ```
  Use the evidence-pitch skill for audience <audience> and ask <ask>. Draft one slide per required topic from approved facts only, label future work as a proposal, run `node engine/plan.mjs <project.json> --deck`, and give me the deck digest to review.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-12-parallel-game-producer. Draft a change to one resource clash or one unsupported slide, keeping the task and claim keys stable. Recompute the totals with the planner and show the slide diff. Do not change hours, gates or bands. Regrade under the same profile on a fresh snapshot and label each difference as evidence, design or scope.
```

## 5. Independent judge prompt (optional)

```
For human delivery only. Draft a local brief for a human reviewer with the profile, raw case references, expected outcomes and the frozen rubric hash. Ask them to reproduce one passing and one failing case and to describe any unsupported inference. Leave the computed levels in the engine record.
```
