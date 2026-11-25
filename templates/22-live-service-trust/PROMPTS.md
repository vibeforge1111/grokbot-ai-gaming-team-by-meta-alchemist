# Live Service, Payments and Trust: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the live-service-trust-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. It saves progress <on the device / in the cloud / on a server>, players <do / do not> sign in, and it <sells / does not sell> anything for real money. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me whether the `no-store` rubric profile applies.
```

Owner calls the bot will ask you to settle early:

- Who is the qualified person (for example a lawyer or a privacy lead) who reviews privacy, rights and age?
- Does the game sell anything for real money, and if so, which isolated sandbox will you use for the purchase drills? If not, you approve the `no-store` profile: the transaction lines read N/A and the paid-item blockers no longer apply.
- Which save failures and interruptions must the game survive?

## 2. Routine prompts

**Live Service, Payments and Trust: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, the grade range (interval), any blocking or unmeasured release blockers, and U lines, marking each U line for a system the game does not have (for example no online service) as does not apply. Name the rubric profiles used; under the approved no-store profile the transaction lines read N/A. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Live Service, Payments and Trust. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the live-service-trust-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **persistence-fault-injection** (every game that keeps progress): check that each save path keeps acknowledged progress through storage failures, crashes and interruptions.

  ```
  Use the persistence-fault-injection skill on <traces from my owner-run save failure tests on build>. Compare recovered and expected state for each storage and interruption case, then tell me which lines it moves and what is still unmeasured.
  ```

- **transaction-idempotency-and-entitlement-audit** (only if the game sells something): reconcile purchase and entitlement records from my sandbox results. Never makes a charge, refund or grant.

  ```
  Use the transaction-idempotency-and-entitlement-audit skill on <my store sandbox results for build>. Check failed, duplicate, out-of-order and restore cases, then tell me which lines it moves, whether any release blocker is measured, and what is still unmeasured.
  ```

- **live-ops-incident-drill-and-build-identity**: record which build is really published or running; for a running service, review my health, incident and rollback drill.

  ```
  Use the live-ops-incident-drill-and-build-identity skill on <build identifiers and my drill log>. Tell me which lines it moves and what is still unmeasured.
  ```

- **rights-privacy-and-safety-review** (every game): check that privacy, data retention, age rating, asset and music rights, player safety and support records exist and are complete. Never gives legal sign-off.

  ```
  Use the rights-privacy-and-safety-review skill on <folder of privacy, licence, age rating and support records>. List each record as present, missing, incomplete or does not apply, with file paths.
  ```

- **file-to-shared-ledger**: draft a local tracker change for human review with the evidence needed to verify it.

  ```
  Use the file-to-shared-ledger skill on <finding from the latest grade>. Check my tracker export for an existing ticket, then draft a local new issue or a local update for me to review and file.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-22-live-service-trust. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer, with no account, payment or player identifiers. All lines in this rubric are computed, so the reviewer comments on evidence quality and keeps the engine level. If a future rubric adds judged lines, return lineId, level, judge, evidenceIds and note for each, citing an artifact of the required type or returning U.
```
