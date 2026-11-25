# 2D Sprite Atlas & Hitbox Packer: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the sprite-hitbox-packer-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The art is <pixel art, smooth high-resolution art, or both>, packed with <engine or packing tool>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me which rubric profiles apply (`no-hit-shapes`, `no-height-layer`, `no-install-icons`, `no-item-tiers`).
```

Questions the bot will ask you to settle early:

- What is your texture budget per scene, and which install icon sizes do your platforms require?
- Do sprites have gameplay hit shapes, is there a height or depth layer, does the game ship install icons, and are items told apart by colour tiers? Each "no" selects a profile (`no-hit-shapes`, `no-height-layer`, `no-install-icons`, `no-item-tiers`) once you approve it.

## 2. Routine prompts

**2D Sprite Atlas & Hitbox Packer: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval (the lowest and highest grade possible once the U lines are measured) and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for 2D Sprite Atlas & Hitbox Packer. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the sprite-hitbox-packer-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **sprite-atlas-packer**: Pack sprites, icons or interface art into atlases with padding and extruded edges so filtering never bleeds, for pixel art or smooth art, and prove they render clean on every device.

  ```
  Use the sprite-atlas-packer skill on <atlas, sprite folder or build>. My art is <pixel art or smooth art> and my packing tool is <tool>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **sprite-hit-shape-checker**: Check the shapes the game uses to decide what touches what (attack hitboxes, platform collision, pickups, click or tap areas) against the code that really uses them, frame by frame.

  ```
  Use the sprite-hit-shape-checker skill on <build, file or capture>. The shapes my game uses are <for example platform collision boxes, tap areas or attack hitboxes>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **sprite-palette-and-readability-checker**: Check that reward, item or collectible art reads at its displayed size and that colour tiers and palette swaps stay distinct and match the palette rules.

  ```
  Use the sprite-palette-and-readability-checker skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-17-sprite-hitbox-packer. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
