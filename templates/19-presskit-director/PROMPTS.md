# Store Page & Presskit Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the store-presskit-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me whether the `no-own-web-page` rubric profile applies.
```

Decisions the bot will ask you to make early, one question at a time:

- Which destinations the game will be listed on (for example a PC store such as Steam, itch.io, a console store, a mobile app store or your own website), and which spec version of each destination's asset guidelines applies.
- Does the game have a web page you control, such as its own website or a landing page? If not, the `no-own-web-page` profile applies once you approve it.

## 2. Routine prompts

**Store Page & Presskit Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Document stale destination previews, destinations whose asset spec version changed, and missing rights references in the local draft. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Store Page & Presskit Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the store-presskit-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **store-art-format-auditor**: Use when checking store art for every destination (a PC store such as Steam, itch.io, a console store, a mobile app store or your own website): each required format against that store's current spec, text contrast at displayed size, safe zones and icons.

  ```
  Use the store-art-format-auditor skill on <folder of store art>. Our destinations are <for example itch.io and two mobile app stores>, checked against <spec version or date for each>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **store-copy-and-metadata-checker**: Use when writing or checking store and landing page copy: the hook shows on the first screen, every advertised feature has current build evidence, and page metadata and share previews work where you control the page.

  ```
  Use the store-copy-and-metadata-checker skill on <store page draft or preview URL>. The pages we control are <for example our own website, or none>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **presskit-zip-zero-leak-compiler**: Use when assembling a presskit: factsheet, logos and media from the current build, rights records, and nothing private inside the archive.

  ```
  Use the presskit-zip-zero-leak-compiler skill on <press kit folder or archive>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-19-store-presskit-director. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
