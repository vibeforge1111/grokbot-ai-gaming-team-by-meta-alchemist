# Community Support and Moderation Desk: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets. This template is a preview: its engine trusts the metrics a pack declares, so read every grade as a check of the evidence you supplied.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the support-desk-getting-started skill. Ask me one question at a time. My game is <name, genre, platforms>. The build to review is <build id>, and the evidence comes from <export, tool or person>.
```

Decisions the bot will ask you about early, one question at a time:

- Which local policy and knowledge sources may the desk cite?
- Which reviewer handles each case class (support, purchase, moderation, safety), and how long may draft references be kept?
- What sample size, observation days and first-draft turnaround should the desk measure?

## 2. Routine prompts

**Desk digest** (create it as a routine if you want it daily; otherwise run it when you ask):

```
Read the local drafts the reviewer saved for <period>. Count them by topic with `digest()` from `support/drafts.mjs` and list unresolved policy questions and draft turnaround. Include only opaque case references where the reviewer needs to find a case. Save the digest as a local draft for the reviewer. If there are no drafts, say so and record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Support safety review** (run it when you ask, for example after the agent's tools or prompts change):

```
Run `node tests/test-safety.mjs` and record the tested build, the case count, failed cases and any missing coverage. If the owner has supplied a red-team case file, run each case against the agent configuration for this build and count passes and failures per category for the `redteam` group. If there is no case file, record the red-team line as NOT_RUN; it stays U.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Evidence grade** (create it as a routine if you want a regular grade; it runs only when you ask or on the schedule you set):

```
Run `node engine/lens.mjs <pack.json>` (gbf-23-support-moderation-desk v1.2.0) on the owner-approved pack for the intended build. Record verdict, grade, coverage, every U line, both build ids and the rubric hash, and say that this preview engine trusts the metrics the pack declares. Compare levels only with an earlier grade that has the same rubric hash and profile. Draft one local finding per measured failure. If there is no new pack, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with `node engine/lens.mjs <pack.json>` (gbf-23-support-moderation-desk v1.2.0). Lead with verdict, grade and coverage, and say that this preview engine trusts the metrics the pack declares. List every U line as not measured yet with the evidence that would measure it. Compare only with a grade that has the same rubric hash and profile. Draft one local finding per measured failure for the human to review.
```

- **support-desk-ticket-intake**: a redacted intake batch needs one local case draft per case.

  ```
  Use the support-desk-ticket-intake skill on <redacted intake export>. Draft one local case per item with an opaque reference and a topic, route purchases and safety concerns to the human queue, and tell me which rubric lines this informs and what is still unmeasured.
  ```

- **support-desk-scam-moderation**: a reported conduct case (a scam, impersonation or harassment) needs a moderation review draft.

  ```
  Use the support-desk-scam-moderation skill on case <case-ref> with <redacted evidence>. Draft the rule, confidence, protected-role check and proportionate options for the reviewer. Take no action. Tell me which rubric lines this informs.
  ```

- **support-desk-kb-approval-batch**: knowledge entries were added or edited and need a fresh approval.

  ```
  Use the support-desk-kb-approval-batch skill on <kb.json> with the approved revision list <approved.json>. List entries whose revision changed or that are refused as sensitive, and draft the approval request for the reviewer.
  ```

- **support-desk-daily-digest**: the reviewer wants counts by topic for a period.

  ```
  Use the support-desk-daily-digest skill on <drafts.json> for <period>. Count by topic, list open policy questions and save the digest draft locally.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-23-support-moderation-desk v1.2.0. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds or the rubric. After I make the fix, regrade the new pack with `node engine/lens.mjs <pack.json>` and show the change per line. Keep U lines as U until real evidence arrives. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer of gbf-23-support-moderation-desk v1.2.0: the grade record, the pack's artifact list and redacted excerpts, never personal data or secrets. Every line in this rubric is computed, so the reviewer does not change levels. Ask them to say, per line, whether the cited artifact really measures what the line reads, which lines pass by construction or from probes of this template's own code, and which evidence would be stronger. Return lineId, verdict on the evidence, evidenceIds and a short note. The human decides whether to send the brief.
```
