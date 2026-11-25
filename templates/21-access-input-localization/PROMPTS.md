# Access, Input and Localization QA: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the access-input-localization-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me which rubric profiles apply (`single-language`, `single-input`).
```

Decisions the bot will ask you about early, one question at a time:

- Does this release ship in one language? If so, you approve the `single-language` profile: the locale tests line becomes N/A and the string inventory line is worth 20 points.
- Does the game support only one input method, for example touch only? If so, you approve the `single-input` profile: remapping, prompts and device switching become N/A and the required tasks line is worth 20 points.
- Which flash safety limit you follow. Flashing above it blocks release under every profile.
- Which input devices and journey tasks every player must be able to use (for example title screen, settings, pause menu, one core play task, save or results).

## 2. Routine prompts

**Access, Input and Localization QA: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval (the lowest and highest grade the U lines allow) and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Access, Input and Localization QA. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the access-input-localization-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **input-navigation-and-device-switch-audit**: check required tasks on every supported input, plus remapping, prompts and recovery.

  ```
  Use the input-navigation-and-device-switch-audit skill on build <build id>. The supported inputs are <devices> and the required tasks are <journey tasks>. Use my captures from <folder or capture ids>. Tell me which device and task pairs passed, which rubric lines this moves and what is still unmeasured.
  ```

- **readability-and-caption-evidence**: text size and contrast over real scenes, meaning without colour, captions and menus.

  ```
  Use the readability-and-caption-evidence skill on build <build id> with <screenshots, caption log or capture ids>. Measure the smallest text and weakest contrast over real scenes, check colour-only meaning, and match each required sound to its caption. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **motion-flash-comfort-check**: reduced motion, flash safety (a release blocker) and hold or toggle alternatives.

  ```
  Use the motion-flash-comfort-check skill on build <build id> with paired captures from <capture ids>. Count flashes per second in the brightest scenes against my profile limit, check each promised motion reduction, and list hold actions without a toggle. If flashing is over the limit, say so first. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **string-inventory-and-pseudo-locale**: the string inventory and build guard, and locale captures once a second language is planned.

  ```
  Use the string-inventory-and-pseudo-locale skill on <source folder or string table> for build <build id>. This release ships in <one language | these languages>. Build the string inventory, test the hard-coded string guard with a disposable planted string, and run locale captures only if more than one language is in scope. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **file-to-shared-ledger**: turn a confirmed finding into a local ticket draft for you to review and file.

  ```
  Use the file-to-shared-ledger skill on <finding or grade record> for build <build id>. Check my tracker export <file> for an existing ticket with the same root cause, signature and build, then write a local draft (new ticket or proposed change) with the pack and artifact ids. Do not file it.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-21-access-input-localization. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
