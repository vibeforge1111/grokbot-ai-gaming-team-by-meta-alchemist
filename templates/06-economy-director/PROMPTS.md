# Game Economy Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the economy-director-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. Players earn and spend <resources, for example coins, wood, lives, cards>. It <has / has no> combat and <sells / does not sell> anything for real money. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me whether the `no-combat` and `no-store` rubric profiles apply.
```

Owner calls the bot will ask you to settle early:

- How long should a typical player take to reach the next step of progression, and, if you sell anything, how close should a player who never pays get to a paying player?
- Does your game take real money at all, and if so, which store sandbox will you use for the failure tests?
- Does the game have combat, and does it sell anything? Each "no" selects a profile (`no-combat`, `no-store`) once you approve it.

## 2. Routine prompts

**Game Economy Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, the grade range (interval) and U lines, and mark each U line for a system the game does not have (combat, a store, random rewards) as does not apply. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Game Economy Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the economy-director-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **resource-sources-and-sinks-model** (start here, any game): list where each resource comes from and where it goes, model balances over time, and find stuck players, unreachable goals and double-counted rewards.

  ```
  Use the resource-sources-and-sinks-model skill on <resource definitions, session logs or save exports>. List every source, sink and transfer for <resource>, gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **monte-carlo-meta-balancer**: run many seeded simulations of player choices to measure progression time, whether one choice dominates (the meta) and what a proposed change would do.

  ```
  Use the monte-carlo-meta-balancer skill on <rules file and proposed change>. Compare current and proposed rules on the same seeds, report the spread with its uncertainty, and draft a local change list for me to review.
  ```

- **combat-timing-auditor** (optional, only if the game has combat): compare simulated and recorded time to defeat a target with the build's real rules.

  ```
  Use the combat-timing-auditor skill on <weapon or attack definitions and recorded fights>. Gather evidence for the two combat lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-06-game-economy-director. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. All lines in this rubric are computed, so the reviewer comments on evidence quality and keeps the engine level. If a future rubric adds judged lines, return lineId, level, judge, evidenceIds and note for each, citing an artifact of the required type or returning U.
```
