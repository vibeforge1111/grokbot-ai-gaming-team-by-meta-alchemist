# Server Fairness & Anti-Cheat Guard: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the mcp-anticheat-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. Its server is <dedicated server, host player or backend service> and tests may run only against <local or staging server>, which I authorize. The build to grade is <URL or path>, and evidence packs come from <CI run or manual capture from that test server>. Ask me which rubric profiles apply (`turn-based`, `no-input-assist`) and tell me which other lines do not apply.
```

Owner calls the bot will ask you to settle early (only for features your game has):

- If your game has an automatic cheat detector, how many honest sessions may it wrongly flag, and how many known-cheat test sessions may it miss?
- If your game judges hits in real time, how far back may the server rewind time to judge a hit?
- If your game has input assists, how strong should each be per device, and how much difference between devices is acceptable?
- Does the server judge hits in real time, and does the game have any input assist? Each "no" selects a profile (`turn-based`, `no-input-assist`) once you approve it.

## 2. Routine prompts

**Server Fairness & Anti-Cheat Guard: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, the grade range (interval) and U lines, and mark each U line for a feature the game does not have as does not apply. Keep suspected multi-account groups as local review-queue drafts for a human; never ban, mute or contact a player. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Server Fairness & Anti-Cheat Guard. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the mcp-anticheat-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **cross-editor-scene-parity** (the Scene Parity part, games with level geometry): after a scene moves between editors or is edited by an agent over MCP, prove the server's collision, spawn and visibility data match what players see.

  ```
  Use the cross-editor-scene-parity skill on <client export and server export of scene name>. Convert both to <target coordinate system>, compare the digests, then tell me which lines it moves and what is still unmeasured.
  ```

- **server-authority-fairness-audit** (the Anti-Cheat Guard part, defensive only): review on your own test server that it applies your game's rules the same way for every player and client.

  ```
  Use the server-authority-fairness-audit skill on <sanitized decision records from my local or staging server>. Use the rubric profiles I approved, mark other lines for features my game does not have as does not apply, gather evidence for the rest, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-15-mcp-anticheat-director. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer, with no player identifiers. All lines in this rubric are computed, so the reviewer comments on evidence quality and keeps the engine level. If a future rubric adds judged lines, return lineId, level, judge, evidenceIds and note for each, citing an artifact of the required type or returning U.
```
