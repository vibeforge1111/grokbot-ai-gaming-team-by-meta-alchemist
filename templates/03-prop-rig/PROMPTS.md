# Prop & Rig Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the prop-rig-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. My asset pipeline is <for example Unity, Unreal, Godot, Blender export to FBX or glTF, or Three.js>. The props I care about are <for example furniture, vehicles, plants, tools, creatures, buildings>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>. Ask me whether the `static-props` rubric profile applies.
```

Questions the bot will ask you to settle early:

- How closely must collision shapes match the visible model, and how deep may an attached part pass into the body?
- Which art reference is current?
- Do any props attach to an animated character or move through extreme poses? If none do, you approve the `static-props` profile.

## 2. Routine prompts

**Prop & Rig Director: weekly grade** (create it as a routine; weekly by default, daily during a playtest week):

```
Use the owner-approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage, interval (the lowest and highest grade possible once the U lines are measured) and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

Daily variant during an active playtest:

```
Every day at <time>, check for a new evidence pack for Prop & Rig Director. If there is one, grade it with `node engine/lens.mjs <pack.json>` and save a local three-line draft for human review: verdict, grade with coverage, and the single biggest change since yesterday. If there is no new pack, record NOT_RUN in the local draft. Only the human reviews and sends it.
```

## 3. Audit prompts

```
Grade <pack.json> with the prop-rig-lens-engine engine. Lead with verdict, grade and coverage. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **procedural-prop-builder**: Build a prop or rig from art references in your engine, with reproducible seeded variation and measurable clearance.

  ```
  Use the procedural-prop-builder skill on <prop, file or capture>. Ask me which engine and pipeline I use before giving any setup step. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **asset-lod-and-compression-pipeline**: Make simpler and smaller versions of a 3D asset for your target devices and check that its look, animation and collision still match the original.

  ```
  Use the asset-lod-and-compression-pipeline skill on <asset file or build>. Use only the tools of my pipeline: <pipeline>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **turntable-collider-proof**: Use after building a prop or rig: prove its collision shape matches the visible model from every angle and that clearance and grounding hold in real poses.

  ```
  Use the turntable-collider-proof skill on <build, file or capture>. Gather evidence for the matching rubric lines, then tell me which lines it moves and what is still unmeasured.
  ```

- **entry-scene-optional-interactions** (only if your game has a title, menu or hub scene with decorative objects): design optional reactions for them and check that players can still find and use the main action.

  ```
  Use the entry-scene-optional-interactions skill on <entry scene build or capture>. The main action on that screen is <for example Continue, Play or Start>. Tell me whether the results feed scene-budget:1 or stay a local review note.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-03-procedural-rig-crafter. Pick the two lowest lines that are measured, propose the smallest fix for each, and tell me exactly what before and after evidence would prove it. Do not change thresholds. After I ship the fix, regrade the new pack and show the delta per line.
```

## 5. External judge prompt (optional)

```
For human delivery only. Prepare a sanitized local brief for an independent reviewer. For judged lines return lineId, level, judge, evidenceIds and note. Cite an artifact of the required type or return U. For computed lines comment on evidence quality and retain the engine level.
```
