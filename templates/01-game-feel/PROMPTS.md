# Game Vibes Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the game-vibes-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run, test harness or manual capture>. Ask me which rubric profiles apply (`no-aiming`, `no-hazards`, `offline-only`) and tell me which other lines do not apply and will stay unmeasured.
```

Questions the bot will ask you to settle early:

- How fast must each action answer on each device, and how soon must its first cue appear?
- If players aim: what aim error is acceptable, and how equal must aim help be across controls?
- Does the game have aiming, selecting or steering toward a target, anything that can hurt the player from off screen, and an online predicted mode? Each "no" selects a profile (`no-aiming`, `no-hazards`, `offline-only`) once you approve it.
- Which style effects are in the game on purpose (hitstop, screen shake, platformer moves such as coyote time), so they are never marked down?

## 2. Routine prompts

**Game Vibes Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Game Vibes Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the game-vibes-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it, or say that it does not apply to this game. Draft one local ticket per measured finding for the human to review and file. Save findings about HUD elements or sounds in a local feel-findings file for HUD Designer (09) and Audio Director (13).
```

- **game-feel-audit**: Measure how fast and how clearly the game answers the actions players use most, in any genre and any engine, and gather the evidence for each Game Feel rubric line.

  ```
  Use the game-feel-audit skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **ship-juice-module**: Add visual, audio or haptic feedback (often called juice) to an action without changing input handling or game timing, behind a switch that is off by default.

  ```
  Use the ship-juice-module skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **before-after-feel-proof**: Compare the same player action before and after a feedback change and record both timing and perception.

  ```
  Use the before-after-feel-proof skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **assist-and-forgiveness-check**: Check that aim assist, ledge grabs, snap-to-tile and other input help land where the player meant, the same way on every supported control. Use only when your game has such help.

  ```
  Use the assist-and-forgiveness-check skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-01-game-feel. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
