# Environment Design Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the environment-design-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. Players see the world as <2D side view, top-down, isometric, 3D third-person or first-person, or a fixed board>, and scenes are built in <engine or level tool>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me whether the `no-location-overlays` rubric profile applies.
```

Questions the bot will ask you to settle early:

- Who judges the five visual lines? For example an art director, a level designer or a small playtest panel.
- Which cues must always stay visible, and when must location overlays stay out of the way?
- Does the game show location names or area cards over play? If not, you approve the `no-location-overlays` profile.

## 2. Routine prompts

**Environment Design Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval (the lowest and highest grade possible once the U lines are measured) and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Environment Design Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the environment-design-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **environment-set-dressing-and-grounding-director**: Place decorative detail so players can recognize landmarks, tell usable objects from decoration and read the intended routes, in 2D or 3D.

  ```
  Use the environment-set-dressing-and-grounding-director skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **placement-and-support-surface-auditor**: Check that placed objects rest on the surface they belong on (floor, tile, shelf, terrain) and follow the project's placement rules.

  ```
  Use the placement-and-support-surface-auditor skill on <scene or level file>. Ask me which engine or level tool holds the scene first. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **sightline-silhouette-and-value-composition-gate**: Check whether important objects and actions stay readable from the cameras and routes players actually use, in 2D, top-down or 3D views.

  ```
  Use the sightline-silhouette-and-value-composition-gate skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **entry-scene-optional-interactions** (only if your game has a title, menu or hub scene with decorative objects): design optional reactions for them and check that players can still find and use the main action.

  ```
  Use the entry-scene-optional-interactions skill on <entry scene build or capture>. The main action on that screen is <for example Continue, Play or Start>. Tell me whether the results support scene-composition:2 or stay a local review note.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-11-environment-design. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
