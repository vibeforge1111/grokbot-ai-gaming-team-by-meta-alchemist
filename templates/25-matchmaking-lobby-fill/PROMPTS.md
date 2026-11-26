# Matchmaking and Region Lobby Fill: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets. This template is a preview: its engine trusts the metrics a pack declares, so read every grade as a check of the evidence you supplied.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the lobby-fill-getting-started skill. Ask me one question at a time. My game is <name, genre, platforms>. The build to review is <build id>, and the evidence comes from <export, tool or person>.
```

Decisions the bot will ask you about early, one question at a time:

- Which queues, region codes and observation window should be compared?
- Which two input groups should be compared (your own device or input codes), and what latency and wait budgets apply?
- Which local exports distinguish humans, bots and measured directional latency?

## 2. Routine prompts

**Queue alternatives** (create it as a routine if you want a weekly proposal; otherwise run it when you ask):

```
Run `node mm/scenario.mjs <input.json> --report` on the owner's de-identified seat export and save the report as a local proposal draft. Compare human fill with the configured floor, list measured directional latency and the alternatives for each thin region, and mark missing latency as unknown. Then run `node mm/scenario.mjs <input.json>` for the pack. If the export is missing, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Count snapshot review** (run it when you ask; a counts-only snapshot measures little):

```
Run `node mm/import-counts.mjs <snapshots.json> --profile <profile.json> --pack-id <id> --git-sha <sha> --live-sha <sha>`. Record the capture window and build identities, and describe only the counts the snapshot contains. Keep seat, wait, bot and directional latency lines unmeasured until a seat export exists.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

**Evidence grade** (create it as a routine if you want a regular grade; it runs only when you ask or on the schedule you set):

```
Run `node engine/lens.mjs <pack.json>` (gbf-25-matchmaking-lobby-fill v1.2.0) on the owner-approved pack for the intended build. Record verdict, grade, coverage, every U line, both build ids and the rubric hash, and grade the pack from its folder so artifact bytes and the producer receipt are checked. Compare levels only with an earlier grade that has the same rubric hash and profile. Draft one local finding per measured failure. If there is no new pack, record NOT_RUN.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with `node engine/lens.mjs <pack.json>` (gbf-25-matchmaking-lobby-fill v1.2.0). Lead with verdict, grade and coverage, and grade the pack from its folder so artifact bytes and the producer receipt are checked. List every U line as not measured yet with the evidence that would measure it. Compare only with a grade that has the same rubric hash and profile. Draft one local finding per measured failure for the human to review.
```

- **lobby-fill-weekly-proposals**: a seat export needs fill, waits and thin-region alternatives measured.

  ```
  Use the lobby-fill-weekly-proposals skill on <input.json>. Measure fill per region and hour, list thin regions with options inside the ping cap, and save the proposal as a local draft. Tell me which rubric lines this informs and what is still unmeasured.
  ```

- **lobby-fill-count-snapshots**: only aggregate count snapshots exist (no seat export yet).

  ```
  Use the lobby-fill-count-snapshots skill on <snapshots.json> with my profile <profile.json>. Build the counts-only pack and tell me which lines stay U and what export would measure them.
  ```

- **lobby-fill-bot-honesty-check**: bot labels and public player counts need checking against the lobby configuration and seats.

  ```
  Use the lobby-fill-bot-honesty-check skill with <lobby config> and <seat export>. Check that bots carry a label and never count as players, and draft any discrepancy locally.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-25-matchmaking-lobby-fill v1.2.0. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds or the rubric. After I make the fix, regrade the new pack with `node engine/lens.mjs <pack.json>` and show the change per line. Keep U lines as U until real evidence arrives. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer of gbf-25-matchmaking-lobby-fill v1.2.0: the grade record, the pack's artifact list and redacted excerpts, never personal data or secrets. Every line in this rubric is computed, so the reviewer does not change levels. Ask them to say, per line, whether the cited artifact really measures what the line reads, which lines are backed by the cited artifacts, and which evidence would be stronger. Return lineId, verdict on the evidence, evidenceIds and a short note. The human decides whether to send the brief.
```
