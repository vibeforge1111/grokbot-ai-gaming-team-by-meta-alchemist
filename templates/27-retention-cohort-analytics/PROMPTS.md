# Retention and Cohort Analytics: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets. This template is a preview: its engine trusts the metrics a pack declares, so read every grade as a check of the evidence you supplied.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the retention-cohorts-getting-started skill. Ask me one question at a time. My game is <name, genre, platforms>. The build to review is <build id>, and the evidence comes from <export, tool or person>.
```

Decisions the bot will ask you about early, one question at a time:

- What counts as a session and when does a reporting day end?
- Which minimum cell size, segment codes and retention targets has the owner approved?
- Which build and acquisition window belong in each comparison?

## 2. Routine prompts

**Weekly cohort report** (create it as a routine if you want a weekly report; otherwise run it when you ask):

```
Run `node cohorts/scenario.mjs <input.json> --report` on the owner's de-identified session export and save the output as a local report draft. Rates count only days that have fully passed, pooled rates are checked against an independent recount, and small cells stay hidden. Then run `node cohorts/scenario.mjs <input.json>` for the pack. If the export is missing, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Release comparison** (run it when you ask, after a release has had time for its cohorts to mature):

```
Run `node cohorts/scenario.mjs <input.json> --report` once per build on comparable acquisition windows. No bundled tool compares two builds yet, so place the two tables side by side by hand and label it a manual comparison. Describe missing windows and changes in population before drawing a conclusion; overlapping ranges are not a difference.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Evidence grade** (create it as a routine if you want a regular grade; it runs only when you ask or on the schedule you set):

```
Run `node engine/lens.mjs <pack.json>` (gbf-27-retention-cohort-analytics v1.1.0) on the owner-approved pack for the intended build. Record verdict, grade, coverage, every U line, both build ids and the rubric hash, and grade the pack from its folder so artifact bytes and the producer receipt are checked. Compare levels only with an earlier grade that has the same rubric hash and profile. Draft one local finding per measured failure. If there is no new pack, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with `node engine/lens.mjs <pack.json>` (gbf-27-retention-cohort-analytics v1.1.0). Lead with verdict, grade and coverage, and grade the pack from its folder so artifact bytes and the producer receipt are checked. List every U line as not measured yet with the evidence that would measure it. Compare only with a grade that has the same rubric hash and profile. Draft one local finding per measured failure for the human to review.
```

- **retention-cohorts-weekly-report**: a de-identified session export needs D1, D7 and D30 by cohort.

  ```
  Use the retention-cohorts-weekly-report skill on <input.json>. Build the cohort report with ranges, small cells hidden, and the recount check, and tell me which rubric lines this informs and what is still unmeasured.
  ```

- **retention-cohorts-release-compare**: two builds need their mature retention compared.

  ```
  Use the retention-cohorts-release-compare skill with <input for build A> and <input for build B>. Compare mature rates and ranges on comparable windows and describe what is missing first.
  ```

- **retention-cohorts-export-check**: a new or changed session export needs checking before any analysis.

  ```
  Use the retention-cohorts-export-check skill on <input.json>. Report how many rows were refused and why, with no original rows, and whether build references and day boundaries are known.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-27-retention-cohort-analytics v1.1.0. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds or the rubric. After I make the fix, regrade the new pack with `node engine/lens.mjs <pack.json>` and show the change per line. Keep U lines as U until real evidence arrives. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer of gbf-27-retention-cohort-analytics v1.1.0: the grade record, the pack's artifact list and redacted excerpts, never personal data or secrets. Every line in this rubric is computed, so the reviewer does not change levels. Ask them to say, per line, whether the cited artifact really measures what the line reads, which lines are backed by the cited artifacts, and which evidence would be stronger. Return lineId, verdict on the evidence, evidenceIds and a short note. The human decides whether to send the brief.
```
