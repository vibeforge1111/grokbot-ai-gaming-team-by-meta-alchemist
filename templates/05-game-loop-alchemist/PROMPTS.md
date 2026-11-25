# Game Loop Alchemist: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the game-loop-alchemist-getting-started skill. Ask me one question at a time. My game is <name or code name, genre, engine, platforms>. The build to grade is <commit and build id>. The loop change I want to check is <for example a new opening, a faster retry or a new invitation to play again>. Evidence comes from <playtest sessions, a CI run or a manual capture>.
```

Decisions the bot will ask you about, one question at a time:

- The meaningful first action and what it should change.
- The decision beat, the setback or retry point, and the stop point.
- The time budgets and which pauses (cutscenes, loading, an opponent's turn) are left out.
- The eligible cohort and when the observation window closes.
- The coding keys for goals, consequences and reasons to play again.
- The bands (floor, pass and target shares).
- Where local drafts go and who reviews them.

## 2. Routine prompts

**Game Loop Alchemist: review** (create it as a routine once the owner picks a cadence; replace `<cadence>` first, for example "Monday at 09:00" or "day after each playtest"):

```
Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Every <cadence> (for example after each loop change, or weekly during a playtest), check for a fresh evidence pack for Game Loop Alchemist. Close the observation window before computing voluntary replay. Pin the build, profile revision and pack ID. Skip an unchanged pack. Mark skipped or unavailable runs NOT_RUN. On a fresh pack run `node engine/lens.mjs <pack.json>`. Draft a local report with the verdict, grade, supported points, coverage, interval, blocker receipts, and the next capture for each U line. Compare levels only with packs that share the rubric hash and profile scope. Draft one local ticket candidate per measured finding for human review. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with the game-loop-alchemist-lens-engine engine. Lead with verdict, grade and coverage. Show supported points and the interval. List every U line as not measured yet with the capture that would measure it, or as "does not apply" if the owner said so. Cite the case, receipt, build and scope for each finding. Draft one local ticket per measured finding for the human to review and file.
```

- **opening-playtest**: a new opening needs an unaided goal readback and a time to the first meaningful action.

  ```
  Use the opening-playtest skill on <session recordings or observer sheets> from build <build id>. Record goal rows as {caseId, expected, readback} and action rows as {caseId, startS, actionS}. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **loop-consequence**: check that the core action makes the intended change and that testers can say what changed.

  ```
  Use the loop-consequence skill on <the core action> in build <build id>. Draft the loop card, then record state rows {caseId, expected, actual} and feedback rows {caseId, expected, readback}. Tell me which rubric lines this moves and what is still unmeasured.
  ```

- **decision-pacing**: the loop feels slow or a setback delays the next useful choice.

  ```
  Use the decision-pacing skill on <trace export> from build <build id>. Record beat rows {caseId, resolvedS, choiceS} and recovery rows {caseId, setbackS, controlS} on one clock, leaving out the pauses I approved. Draft one reversible change to the slowest measured wait.
  ```

- **loop-agency**: show that a different choice leads somewhere different and that a tester can stop when they want.

  ```
  Use the loop-agency skill on <starting state or save> in build <build id>. Record choice rows {caseId, expected, actual} and exit rows {caseId, honored}. If a stop request was ignored, draft a P0 ticket candidate with its capture and stop.
  ```

- **voluntary-replay**: separate the stated reason to play again from whether testers came back.

  ```
  Use the voluntary-replay skill on <cohort> for window <window>. Only after the window closes, record reason rows {caseId, intrinsic} and return rows {caseId, offerRef, cohort, window, windowClosed, returned}, one per invitation, declines included.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-05-game-loop-alchemist. Pick the slowest measured beat or the lowest measured line. Draft one reversible change with its expected effect, a stop condition, the cohort and the before and after capture. Do not change budgets or bands. After the change ships, regrade a fresh cohort under the same profile and label each difference as evidence, design or scope.
```

## 5. Independent judge prompt (optional)

```
For human delivery only. Draft a local brief for a human reviewer with the profile, raw case references, expected outcomes and the frozen rubric hash. Ask them to reproduce one passing and one failing case and to describe any unsupported inference. Leave the computed levels in the engine record.
```
