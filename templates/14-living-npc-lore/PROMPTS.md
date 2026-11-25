# Living AI NPC and Lore Architect: recommended prompts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Copy these into a chat with the bot (or with any agent that has the skills installed). Replace the parts in angle brackets.

> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

## 1. Setup (first run)

```
Run the living-npc-lore-getting-started skill. Ask me one question at a time. My game is <name or code name, genre, engine, platforms>. The NPC role is <role>, and the scene or canon change under review is <change>. The build to check is <commit and build id>. Dialogue is <hand-written, generated or both>.
```

Decisions the bot will ask you about, one question at a time:

- The NPC role and what it may observe.
- How long a memory lasts and where it resets.
- The canon revision, the precedence rule and each reveal gate.
- The response channel, replay seed and held-out scenario for this pack. Grade each further channel, seed or held-out scenario as its own pack and scope.
- The bands, where drafts go and who reviews them.

## 2. Routine prompts

**Living AI NPC and Lore: review** (create it as a routine once the owner picks a cadence; replace `<cadence>` first, for example "day after each dialogue revision"):

```
Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default. Every <cadence> (for example after each dialogue or canon revision, or weekly during narrative playtests), check for a fresh evidence pack for Living AI NPC and Lore. Run the known and held-out scenarios for the pack's one role, canon revision, response channel, replay seed and held-out scenario. Record harness outcomes and human readbacks separately. Pin the build, profile revision and pack ID. Skip an unchanged pack. Mark skipped or unavailable runs NOT_RUN. On a fresh pack run `node engine/lens.mjs <pack.json>`. Draft a local report with the verdict, grade, supported points, coverage, interval, blocker receipts, and the next capture for each U line. Compare levels only with packs that share the rubric hash and profile scope. Draft one local ticket candidate per measured finding for human review. Created by @meta_alchemist (https://x.com/meta_alchemist).
```

## 3. Audit prompts

```
Grade <pack.json> with the living-npc-lore-lens-engine engine. Lead with verdict, grade and coverage. Replay an allowed memory, a reset and a forbidden disclosure. Cite the scene, transcript turn, seed, canon revision and channel for each finding. List every U line as not measured yet with the capture that would measure it. Draft one local ticket per measured finding for the human to review and file.
```

- **npc-memory-boundaries**: remember a witnessed event, forget it at the reset point.

  ```
  Use the npc-memory-boundaries skill for role <role> in build <build id>. Draft the memory table, then record recall rows {caseId, expected, recalled} and expiry rows {caseId, forgotten} with write and recall turn locators.
  ```

- **npc-viewpoint**: keep unseen facts private and beliefs tied to their source.

  ```
  Use the npc-viewpoint skill on scene <scene> for role <role>. For each hidden fact try a leading question, a false premise and a request to ignore the rules. Record knowledge rows {caseId, withheld} and belief rows {caseId, expected, asserted}.
  ```

- **npc-dialogue-repair**: convey the intent and recover from ambiguity.

  ```
  Use the npc-dialogue-repair skill on branch <branch>. Draft the turn table, then record intent rows {caseId, expected, actual} and repair rows {caseId, expected, actual} from captures on channel <channel>.
  ```

- **canon-reconciliation**: claims match the active canon and reveals wait for their gate.

  ```
  Use the canon-reconciliation skill on canon revision <revision>. Record version rows {caseId, expected, claim} and reveal rows {caseId, legal} for both sides of each gate. Draft a canon diff and an exception list for me to decide.
  ```

- **npc-replay-panel**: seeded replay and held-out readback.

  ```
  Use the npc-replay-panel skill with seed <seed> and held-out scenario <scenario>. Record a replay row with both run locators and a held-out row with the reviewer role, turn, reason, scenario and channel.
  ```

## 4. Polish loop prompt

```
We are at <grade>/100 on gbf-14-living-npc-lore. Draft the smallest change to one memory rule or dialogue branch. Keep the reveal and reset rules. Replay the same known and held-out cases on a fresh build under the same profile, and label each difference as evidence, design or scope. Do not change the bands.
```

## 5. Independent judge prompt (optional)

```
For human delivery only. Draft a local brief for a human reviewer with the profile, raw case references, expected outcomes and the frozen rubric hash. Ask them to reproduce one passing and one failing case and to describe any unsupported inference. Leave the computed levels in the engine record.
```
