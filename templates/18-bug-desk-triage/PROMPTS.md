# Playtest Bug Desk & Repro Triage Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the bug-desk-triage-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>.
```

Decisions the bot will ask you about early, one question at a time:

- Which kinds of bug may be P0 for your game (for example payments, lost saves or items players paid for).
- How many clean runs in a row a flaky bug must pass before it counts as fixed.
- Whether your game has share, invite or referral links (if not, that growth check stays unmeasured).

## 2. Routine prompts

**Playtest Bug Desk & Repro Triage Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval (the lowest and highest grade the U lines allow) and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Playtest Bug Desk & Repro Triage Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the bug-desk-triage-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **duplicate-report-grouping**: many crash reports, error logs, player reports or findings from other templates may describe the same bug.

  ```
  Use the duplicate-report-grouping skill on <crash export, error log or list of reports> for build <build id>. Propose candidate duplicate groups as a local draft with the evidence for each pair. Do not merge anything. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **minimal-repro-builder**: a crash, desync or report needs a replay that fails on the affected build, shrunk to the smallest input.

  ```
  Use the minimal-repro-builder skill on <ticket id> with <recorded inputs, save file or capture> from build <build id>. Replay it, record attempts and successes, shrink it to the smallest input that still fails, and tell me which rubric lines this moves and what is still unmeasured.
  ```

- **severity-and-regression-bisect**: set severity and confidence, check P0 scopes, route grading mistakes, and find the change that caused a regression.

  ```
  Use the severity-and-regression-bisect skill on <ticket id or tracker export>. The last good build is <build id> and the first bad build is <build id>. Draft severity and confidence separately, bisect with the working repro, and leave the result in a local ticket draft. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **issue-draft-and-fix-verification**: write a reproducible bug report as a local draft, record which build players run, and check a fix before closure.

  ```
  Use the issue-draft-and-fix-verification skill on <ticket id or finding> for build <build id>. Write a local issue draft for <tracker name> with the build, steps, expected result and evidence. If a fix exists, check that someone other than the fixer verified it on the build under review. Tell me which rubric lines this moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-18-bug-desk-triage. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
