# Playtest and Performance Director: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the playtest-performance-getting-started skill. Ask me one question at a time. My game is <name or code name, genre, engine, platforms>. The build to grade is <commit and build id>. The opening journey is <plain description>. The core journey is <plain description>. Evidence comes from <playtest sessions, a CI run, a manual capture, or a browser script I already have>.
```

Decisions the bot will ask you about, one question at a time:

- The required viewports.
- The frame-time budget on the primary device. 16.67 ms is a common 60 Hz starting point. Do not assume a 90 fps target.
- Whether a second device profile is in scope.
- How many observed cases a journey or frame line needs (`minCases`).
- Where local drafts go and who reviews them.

## 2. Routine prompts

**Playtest and Performance Director: review** (create it as a routine once the owner picks a cadence; replace `<cadence>` first, for example "Monday at 09:00" or "day after each playtest"):

```
Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved pack for the intended build and profile. If capture or execution is unavailable, record NOT_RUN locally. Run `node engine/lens.mjs <pack.json>`. Draft a local report with verdict, grade, supported points, coverage and U lines. Record both build IDs and rubric hashes. Compare levels only for matching rubric hashes and profiles, and explain the cause of each change. Draft one local ticket candidate per measured finding with its pack and artifact IDs for human review. Only the human files or sends drafts. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json>. Lead with verdict, grade and coverage. List U lines with the capture that would measure them.
```
