# Procedural World and Biome Architect: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the world-biome-getting-started skill. Ask me one question at a time. My game is <name or code name, genre, engine, platforms, generation method>. The build to grade is <commit and build id>. Evidence comes from <seeded exports, a nav report, an encounter report, or a manual capture>.
```

Decisions the bot will ask you about, one question at a time:

- Known seeds and a held-out seed.
- Traversal checks that matter in this game.
- The acceptable encounter density range.
- Where local drafts go and who reviews them.

## 2. Routine prompts

**Procedural World and Biome Architect: review** (create it as a routine once the owner picks a cadence; replace `<cadence>` first, for example "Monday at 09:00" or "after each playtest"):

```
Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json>. Lead with verdict, grade and coverage. List U lines with the capture that would measure them.
```
