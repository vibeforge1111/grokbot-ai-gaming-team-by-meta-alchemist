# Streamer Scout, Patch Notes & Update Hype Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the streamer-hype-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me which rubric profiles apply (`no-spectator-mode`, `no-share-links`).
```

Decisions the bot will ask you to make early, one question at a time:

- How much frame time recording may add on each device (the capture overhead budget).
- If your game has a spectator or streaming mode: what a spectator may see, and the minimum stream delay.
- Does the game have a spectator or live viewing mode, and share or watch links? Each "no" selects a profile (`no-spectator-mode`, `no-share-links`) once you approve it.

## 2. Routine prompts

**Streamer Scout, Patch Notes & Update Hype Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Streamer Scout, Patch Notes & Update Hype Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the streamer-hype-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **creator-shortlist-scout**: Use when shortlisting streamers and creators to contact: fit with the game, audience, safety and a clear reason, without inventing audience numbers, with outreach kept as local drafts.

  ```
  Use the creator-shortlist-scout skill for <game, genre and platforms>. Our players also like <similar games or creators>. Draft a shortlist with dated sources and one outreach draft per creator for me to review. Do not contact anyone.
  ```

- **git-diff-patch-notes-hype-compiler**: Use when writing patch notes from commits: every line maps to a commit, and every claim matches the code that shipped.

  ```
  Use the git-diff-patch-notes-hype-compiler skill on the changes from <last release tag> to <shipped commit>. We update the game as <one release with patches, regular updates or seasons>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **stream-and-replay-features-review**: Use when your game has recording, replays, a streamer mode, share links or a spectator view: check each works, hides private information, keeps any required stream delay and cannot change results.

  ```
  Use the stream-and-replay-features-review skill on <build, file or capture>. Our game has <recording, streamer mode, share links, spectator view: list only what exists>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-20-streamer-hype-director. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
