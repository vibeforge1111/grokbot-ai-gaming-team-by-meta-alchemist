# Live-Ops Balance Patch Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets. This template is a preview: its engine trusts the metrics a pack declares, so read every grade as a check of the evidence you supplied.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the balance-director-getting-started skill. Ask me one question at a time. My game is <name, genre, platforms>. The build to review is <build id>, and the evidence comes from <export, tool or person>.
```

Decisions the bot will ask you about early, one question at a time:

- Which parameters, units, aliases and independent reference export describe this build?
- What outcome and target should each parameter influence, and is a proportional model appropriate?
- What observation floor, freshness limit, option step and change caps should govern recommendations?

## 2. Routine prompts

**Weekly balance proposal** (create it as a routine if you want a weekly proposal; otherwise run it when you ask):

```
Run `node balance/run.mjs <input.json> --md` on the owner's current parameters, reference export and observations, and save the output as a local proposal draft. Each resolved parameter shows hold, decrease and increase options within the profile limits, with predictions, rollback and follow-up. Ambiguous labels go back to the owner. If the input is missing, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Post-release measurement** (run it when you ask, after a balance change has been live long enough to measure):

```
Compare like-for-like local observations from the previous and current build: counts, units, windows, observed differences and any change in population. No bundled tool does this yet, so build the table by hand from the two input files and label it a manual comparison. Prepare a follow-up draft naming where the model missed the outcome.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Evidence grade** (create it as a routine if you want a regular grade; it runs only when you ask or on the schedule you set):

```
Run `node engine/lens.mjs <pack.json>` (gbf-26-balance-patch-director v1.1.0) on the owner-approved pack for the intended build. Record verdict, grade, coverage, every U line, both build ids and the rubric hash, and grade the pack from its folder so artifact bytes and the producer receipt are checked. Compare levels only with an earlier grade that has the same rubric hash and profile. Draft one local finding per measured failure. If there is no new pack, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with `node engine/lens.mjs <pack.json>` (gbf-26-balance-patch-director v1.1.0). Lead with verdict, grade and coverage, and grade the pack from its folder so artifact bytes and the producer receipt are checked. List every U line as not measured yet with the evidence that would measure it. Compare only with a grade that has the same rubric hash and profile. Draft one local finding per measured failure for the human to review.
```

- **balance-director-weekly-proposal**: requested balance changes need resolving to parameters and bounded options.

  ```
  Use the balance-director-weekly-proposal skill on <input.json>. Resolve each requested label, draft hold, decrease and increase options inside my caps with predictions and rollback, and tell me which rubric lines this informs and what is still unmeasured.
  ```

- **balance-director-patch-notes-draft**: the owner has picked options and wants player-facing patch notes drafted.

  ```
  Use the balance-director-patch-notes-draft skill on <input.json> with my picks <picks>. Draft patch notes labelled as a draft, keep holds and unresolved names, and add no dates or prices.
  ```

- **balance-director-post-release-read**: a change shipped and its outcome needs measuring against the prediction.

  ```
  Use the balance-director-post-release-read skill with <previous input.json> and <current input.json>. Compare like for like and draft where the model missed.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-26-balance-patch-director v1.1.0. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds or the rubric. After I make the fix, regrade the new pack with `node engine/lens.mjs <pack.json>` and show the change per line. Keep U lines as U until real evidence arrives. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer of gbf-26-balance-patch-director v1.1.0: the grade record, the pack's artifact list and redacted excerpts, never personal data or secrets. Every line in this rubric is computed, so the reviewer does not change levels. Ask them to say, per line, whether the cited artifact really measures what the line reads, which lines are backed by the cited artifacts, and which evidence would be stronger. Return lineId, verdict on the evidence, evidenceIds and a short note. The human decides whether to send the brief.
```
