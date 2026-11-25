# HUD and Game UI Designer: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the hud-designer-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run, test harness or manual capture>. Ask me which rubric profiles apply (`no-touch` or `touch-only`, `fixed-orientation`, `single-language`) and tell me which other lines do not apply and will stay unmeasured.
```

Questions the bot will ask you to settle early:

- What is the smallest text size you accept, and the smallest touch target if you support touch?
- Does any supported device use touch, and does every one use touch only? Does the game run in one orientation only, and ship in one language? Each answer can select a profile (`no-touch`, `touch-only`, `fixed-orientation`, `single-language`) once you approve it.
- How many milliseconds per frame may the UI use on your weakest device?
- What contrast must text, icons and focus outlines reach, and which two palettes should be checked for colour blindness?

## 2. Routine prompts

**HUD Designer: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for HUD and Game UI Designer. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the hud-designer-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it, or say that it does not apply to this game. Draft one local ticket per measured finding for the human to review and file. If a local feel-findings file from Game Feel (01) exists, check the HUD cues it names.
```

- **live-hud-updates-and-cost**: Keep HUD elements that change often (score, timer, health, resources, lap time) readable during the busiest moment, and measure what updating them costs on each target device, in any engine.

  ```
  Use the live-hud-updates-and-cost skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **event-cues-and-recaps**: Show players what just happened and where: a direction cue for an off-screen event, or a short recap after a fail, a turn or a choice. Combat cues such as hit direction are one optional case.

  ```
  Use the event-cues-and-recaps skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **wcag-luminance-and-ui-frame-gate**: Measure text and icon contrast (the WCAG contrast ratio) in real gameplay captures, and compare UI frame cost with each target device's budget.

  ```
  Use the wcag-luminance-and-ui-frame-gate skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **first-30s-onboarding-and-friction-killer**: Observe a new player's first task and identify where discovery, controls or feedback interrupt progress.

  ```
  Use the first-30s-onboarding-and-friction-killer skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-09-hud-ui-designer. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
