# Adopting the kit

Created by @meta_alchemist (https://x.com/meta_alchemist).

This guide is for a team or a solo developer bringing these templates into a real project. It covers picking templates, setting up bots and skills, routines, the rubric loop, and outside judges. A full worked example lives in [examples/pixel-pantry/](examples/pixel-pantry/).

For a first game, use the five bot starter team in [Get started with your AI gaming team](GETTING-STARTED.md#the-starter-team). Come back here when that team is running and you are fitting the kit to a real build.

## 1. Pick templates

Start small. Pick one template for a question you want to answer about the next build.

1. **Collect evidence for one build.** Use a manual capture or CI run. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
2. **Add Bug Desk** ([18](templates/18-bug-desk-triage/)) once anyone outside the team plays. It groups local finding drafts for human review and filing.
3. **Add one lens for your biggest risk.** Ask: what do players complain about most, or what blocks the next milestone?

| Your biggest risk | Add |
|---|---|
| "It feels floaty or unresponsive" | Game Feel (01) |
| "I cannot read the screen" or onboarding drop off | HUD Designer (09), then Access, Input and Localization (21) |
| Intermittent faults during a playtest | Bug Desk (18) |
| One strategy, item or unit dominates, or rewards feel off | Economy Director (06) |
| Cheating reports in an online game | Server Fairness and Anti-Cheat Guard (15) |
| Taking money or storing progress | Live Service Trust (22) |
| Store page or trailer due | Trailer Director (10), Presskit Director (19) |
| Patch notes and creators | Streamer and Patch Notes (20) |
| Too much parallel work to track, or a go or hold call before a release | Parallel Game Producer (12) |

The full map of who hands what to whom is in the [team map](docs/TEAM-MAP.md) and [guides/game-design-pipelines/](guides/game-design-pipelines/). If a rubric line does not fit your game (no aiming, no store, one language, no spectator mode), approve the matching not-applicable profile in step 2 instead of leaving the line unmeasured ([docs/RUBRIC_GUIDE.md](docs/RUBRIC_GUIDE.md#applicability)).

## 2. Write your game profile

The pack fields table in each template README distinguishes fixed checks from game-specific thresholds. Supply each required profile threshold in `pack.profile`. A missing threshold leaves its line unmeasured. A missing or invalid pack produces INVALID with no grade. Start from the `profile` block in each template's `fixtures/good-pack.json`, confirm or replace each value, and keep one profile per game in your repo (for example `profile/my-game.v1.json`). Version it. When a value changes, bump the version and note why.

## 3. Set up bots and skills

One bot per template keeps memory and routines focused. While share links are coming soon, install each with Option B from [INSTALL.md](INSTALL.md). Then:

- **Answer the getting-started questions honestly.** The owner calls it asks (for example the P0 scope list in Bug Desk) are real decisions. Write them down in the profile.
- **Share one bug ledger.** Give each bot a read-only tracker export and a local folder for draft changes. Bug Desk owns dedup. The ledger format is in [shared/ledger/LEDGER_SPEC.md](shared/ledger/LEDGER_SPEC.md).
- **Keep humans in the loop.** Bots draft posts, DMs, patch notes and store copy. A person presses publish.

If your team also uses Cursor, Claude Code, Codex or Gemini CLI, install the same skills there (Option C) and read [guides/pairing-other-llms.md](guides/pairing-other-llms.md).

## 4. Run templates as a team

Bots that work on the same game hand work to each other through files in the game project, not through chat:

- `.grokbot-team/artifacts/<artifact>/` holds the files each template produces (feel findings, HUD captures, clip lists, ticket drafts and so on). Each getting-started skill and `HOW-TO-USE.md` has a "Team inputs and outputs" section that says what it reads, where it looks and what it does when an input is missing: it continues with a marked assumption and never invents the data. See the [team map](docs/TEAM-MAP.md).
- `.grokbot-team/memory/` is the shared, append-only memory: decisions, incidents, entitlements, balance, regions and releases. Each template reads the topics it needs before acting and appends only to its own. Set `GROKBOT_TEAM_SALT` once so people and accounts are only ever stored as hashed ids, and run `node engine/team-memory.mjs lint` in CI. See [docs/SHARED-MEMORY.md](docs/SHARED-MEMORY.md).
- Before you upgrade one template, run `npm run compat` in the kit. It tells you whether the templates you use still read each other's files (OK, WARN or BREAK) and what to change. See [docs/VERSIONING.md](docs/VERSIONING.md).

## 5. Routines

Each template ships a weekly grade routine (see its `PROMPTS.md`, section 2). A sensible cadence:

| When | What runs |
|---|---|
| Each selected build | Collect a pack from CI or a manual playtest and run the relevant templates |
| Daily during a playtest week | Bug Desk intake and a three line grade summary |
| Weekly | Full grade per template, compared with last week |
| Before a release | All adopted templates, plus outside judges on the two lowest |
| After any severe fix | Rerun on the known bad build, the candidate build and nearby areas |

## 6. The rubric loop

Every template grades on a frozen 100-point rubric: 5 pillars of 20 points, 2 lines each, levels 0 to 4, contribution = weight x level / 4, pass at level 3. U (unmeasured) earns 0 and is never a defect. Details in [docs/RUBRIC_GUIDE.md](docs/RUBRIC_GUIDE.md) and [guides/rubrics-and-polish.md](guides/rubrics-and-polish.md).

The loop:

1. **Measure.** Capture a valid evidence pack for build N. Include the producer receipt, approved profile and local artifact bytes described in the [live evidence contract](spec/TEMPLATE_SPEC.md#live-evidence).
2. **Grade.** `node engine/lens.mjs pack.json`. Read verdict, grade and coverage first.
3. **Pick two.** The two lowest measured lines. Ignore U lines until you can measure them; then add the capture.
4. **Fix with proof.** Write down the before evidence, ship the smallest fix, capture the after evidence.
5. **Regrade.** Build N+1. Report the delta per line and the cause (behavior change, better evidence, scope change).
6. **Gate.** A line that passed may not drop below pass without a written reason. That is your regression gate.

Never edit thresholds to make a grade go up. Never change a rubric line in place: a change is a new version with a migration note, and the hash changes (see [spec/RUBRIC_HASH.md](spec/RUBRIC_HASH.md)).

## 7. Outside judges (multi LLM)

The engine computes what a script can measure. For judged lines (perception calls) and for a sanity check before release, use two outside judges from different model families:

1. The human reviews the sanitized local draft and gives each judge the same brief: the `RUBRIC.json`, the evidence pack and its artifacts, and the judge prompt from `PROMPTS.md`, section 5.
2. Each judge retains computed levels and returns JSON for each judged line: lineId, level, judge, evidenceIds, note. A level without an evidence id that exists in the pack is thrown out (the engine already does this for `pack.judgements`).
3. Take the lower of the two levels per line when they disagree by one; flag a disagreement of two or more in the local review draft.
4. Record which judge and model scored what. Do not average a judge grade into a computed grade from a different rubric version.

A practical setup: your Grok Bot drafts the brief, Claude Code and Codex (or Gemini CLI) each judge independently on your machine, and the bot merges the results. See [guides/pairing-other-llms.md](guides/pairing-other-llms.md) and [guides/bridging-pc-mac.md](guides/bridging-pc-mac.md).

## 8. Make your own template

```bash
npm run new -- --id myteam-01-onboarding-flow --name "Onboarding Flow Director"
# edit starter files, then
npm run build-recipe -- templates/01-onboarding-flow
npm run validate
```

Follow [spec/TEMPLATE_SPEC.md](spec/TEMPLATE_SPEC.md), [docs/SKILL_FORMAT.md](docs/SKILL_FORMAT.md) and [docs/RUBRIC_GUIDE.md](docs/RUBRIC_GUIDE.md). Run `npm run scrub` before you publish anything.
