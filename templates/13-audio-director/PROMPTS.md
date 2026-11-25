# Sound Effects & Adaptive Music Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the audio-director-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, audio middleware if any, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run, test harness or manual capture>. Ask me which rubric profiles apply (`no-music`, `no-spoken-lines`, `no-spatial-audio`) and tell me which other lines do not apply and will stay unmeasured.
```

Questions the bot will ask you to settle early:

- How loud should the game be overall, and what is the highest peak you allow?
- How many sounds may play at once on your weakest device, and how much audio may load before the first play?
- Does the game have music, spoken lines and sounds placed in space? Each "no" selects a profile (`no-music`, `no-spoken-lines`, `no-spatial-audio`) once you approve it. If sounds are placed in space, how sure must the direction test be (`minSpatialDirectionLow`)?
- Does the game use the microphone? (It stays off by default and players must agree before it turns on.)

## 2. Routine prompts

**Sound Effects & Adaptive Music Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Sound Effects & Adaptive Music Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the audio-director-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it, or say that it does not apply to this game. Draft one local ticket per measured finding for the human to review and file. If a local feel-findings file from Game Feel (01) exists, check the sounds it names.
```

- **sound-effect-bus-and-voice-limits**: Route recorded or generated sound effects through a mixer bus in your engine or audio middleware, set voice limits and stealing, and verify playback, loudness and lifecycle on target hardware.

  ```
  Use the sound-effect-bus-and-voice-limits skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **adaptive-music-stem-crossfader**: Change music with game states using stems (separate layers of one piece) or whole cues, then test transition timing, level jumps, ducking and interrupted transitions in any engine.

  ```
  Use the adaptive-music-stem-crossfader skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **optional-microphone-input**: Design optional sound-driven controls that use the microphone only after the owner and the player opt in, never record or send audio, and always offer an equal non-microphone control.

  ```
  Use the optional-microphone-input skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-13-audio-director. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
