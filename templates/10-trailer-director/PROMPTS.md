# Stream-to-Devlog & Trailer Cut Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the trailer-director-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>.
```

Decisions the bot will ask you to make early, one question at a time:

- Which delivery formats you need, and the loudness target, true-peak limit and maximum length for each platform.
- Who reviews the story in each delivery format.

## 2. Routine prompts

**Stream-to-Devlog & Trailer Cut Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Stream-to-Devlog & Trailer Cut Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the trailer-director-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **gameplay-moment-finder**: Use when picking moments for a trailer, devlog or short from recorded gameplay: rank candidates from the game's own events and the footage, with a hand-picked fallback when no event fits.

  ```
  Use the gameplay-moment-finder skill on <recordings of the build>. The cut should show <what a viewer should understand, for example "every level is one screen of tight jumps">. Our event log is <path, or "none, pick by hand">. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **multi-aspect-smart-framing-exporter**: Use when reframing gameplay for each approved delivery format (wide, vertical, square or feed) so the subject, essential UI and captions stay visible, then exporting and decoding every cut.

  ```
  Use the multi-aspect-smart-framing-exporter skill on <edit or timeline>. Our approved cuts are <for example wide 16:9 and vertical 9:16>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **beat-sync-and-secret-redaction-gate**: Use when timing a cut to its music or voice and checking every final export for sensitive or unlicensed material, captions and loudness before the human hands it on.

  ```
  Use the beat-sync-and-secret-redaction-gate skill on <final export files>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-10-trailer-cut-director. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
