# Mobile App Store Submission: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets. This template is a preview: its engine trusts the metrics a pack declares, so read every grade as a check of the evidence you supplied.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the store-submission-getting-started skill. Ask me one question at a time. My game is <name, genre, platforms>. The build to review is <build id>, and the evidence comes from <export, tool or person>.
```

Decisions the bot will ask you about early, one question at a time:

- Which store or distribution target and which build are being prepared?
- Which current policy references and requirements apply to that target (the check ids per group)?
- Who owns signing, listing materials, account decisions and the final submission?

## 2. Routine prompts

**Store checklist** (run it when you ask, for example before each store upload):

```
Run `node mobile/run.mjs <checks.json or adapter folder> --report` for the target build and save the output as a local checklist draft. Distinguish a measured failure from missing evidence, keep the source reference for each check, and list the owner questions. Then run it without `--report` for the pack. If the evidence is missing, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Evidence grade** (create it as a routine if you want a regular grade; it runs only when you ask or on the schedule you set):

```
Run `node engine/lens.mjs <pack.json>` (gbf-28-mobile-store-submission v1.1.0) on the owner-approved pack for the intended build. Record verdict, grade, coverage, every U line, both build ids and the rubric hash, and grade the pack from its folder so artifact bytes and the producer receipt are checked. Compare levels only with an earlier grade that has the same rubric hash and profile. Draft one local finding per measured failure. If there is no new pack, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with `node engine/lens.mjs <pack.json>` (gbf-28-mobile-store-submission v1.1.0). Lead with verdict, grade and coverage, and grade the pack from its folder so artifact bytes and the producer receipt are checked. List every U line as not measured yet with the evidence that would measure it. Compare only with a grade that has the same rubric hash and profile. Draft one local finding per measured failure for the human to review.
```

- **store-submission-checklist**: a build needs its store requirements checked against local evidence.

  ```
  Use the store-submission-checklist skill on <checks.json or adapter folder> for build <build id>. Save the checklist as a local draft and tell me which rubric lines this informs and what is still unmeasured.
  ```

- **store-submission-owner-answers**: billing, privacy, account or signing questions only the owner can answer are still open.

  ```
  Use the store-submission-owner-answers skill. Draft the questionnaire for the open answers and the answers.json I should fill in, with no keys or credentials.
  ```

- **store-submission-code-brief**: a failed check needs a local implementation brief for a developer.

  ```
  Use the store-submission-code-brief skill on check <check id>. Draft a local brief with the target, a redacted reference, the acceptance test and who verifies it.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-28-mobile-store-submission v1.1.0. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds or the rubric. After I make the fix, regrade the new pack with `node engine/lens.mjs <pack.json>` and show the change per line. Keep U lines as U until real evidence arrives. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer of gbf-28-mobile-store-submission v1.1.0: the grade record, the pack's artifact list and redacted excerpts, never personal data or secrets. Every line in this rubric is computed, so the reviewer does not change levels. Ask them to say, per line, whether the cited artifact really measures what the line reads, which lines are backed by the cited artifacts, and which evidence would be stronger. Return lineId, verdict on the evidence, evidenceIds and a short note. The human decides whether to send the brief.
```
