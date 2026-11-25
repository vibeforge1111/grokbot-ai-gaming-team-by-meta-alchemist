# Get started with your AI gaming team

Created by [@meta_alchemist](https://x.com/meta_alchemist).

This is the page to read if you just found the kit and want an AI game-dev team in Grok Bot. You do not need every bot. You do not need to understand the rubric yet.

Add four shipping bots, in order. Each one is a folder of skill files. Shipping means it is held to the release standard. A preview bot works, and its tests pass, but it is not held to that standard yet. Leave previews until you want them.

## The starter team

| Order | Short name | Full name | Add it when | Folder |
|---|---|---|---|---|
| 1 | Game Feel | Game Vibes Director | The game responds to a button, a key, or a tap | [01-game-feel](templates/01-game-feel/) |
| 2 | HUD | HUD and Game UI Designer | Players have to read a score, a timer, a button, or a line of dialogue | [09-hud-designer](templates/09-hud-designer/) |
| 3 | Bug Desk | Playtest Bug Desk & Repro Triage Director | You have notes from a play session, or something broke | [18-bug-desk-triage](templates/18-bug-desk-triage/) |
| 4 | Producer | Parallel Game Producer and Pitch Architect | The task list is bigger than the week, or you need a go or hold call | [12-parallel-game-producer](templates/12-parallel-game-producer/) |

These four are the starter team because a first game usually needs them in that order, and they already know how to hand work to each other:

- Game Feel writes what it noticed about feedback. HUD and Audio can read that later.
- HUD writes screen captures the other bots can use.
- Every bot can write a local ticket draft. Bug Desk and Producer read those drafts. They do not file them. You do.
- Producer reads the grades when you want a plan.

Finish bot 1 before you paste bot 2. A working grade teaches you the pattern. The next three are the same pattern with different files.

### A fifth bot, only if you need it

Pick at most one.

| Your game | Add | Folder |
|---|---|---|
| 2D art, sprites, or hitboxes | Sprites | [17-sprite-hitbox-packer](templates/17-sprite-hitbox-packer/) |
| Rewards, currencies, or progression | Economy | [06-economy-director](templates/06-economy-director/) |
| Sound is how the player knows an action worked | Audio | [13-audio-director](templates/13-audio-director/) |
| The open question is "why take another turn?" | Game Loop (preview) | [05-game-loop-alchemist](templates/05-game-loop-alchemist/) |

Game Loop is a preview. Use it to try the question. Do not treat its grade as a release gate.

Wait on Server Fairness, store pages, trailers, matchmaking, retention, and app store submission. They are in the [catalog](TEMPLATES.md) for later.

## What you need

- Grok Bot, and a chat where you can paste a long file.
- This repo on your computer (a download or a git clone).
- One game, even a rough one. A title, a genre, and one action the player repeats are enough.
- Node 18 or newer, only if you want to print a sample grade yourself. The bots do not require it for the first conversation.

<!-- TODO: founder: Grok Bot steps below are the chat phrases from INSTALL.md ("Save this as a skill.", "Remember this for this project.", "Create a weekly routine with this prompt:"). If the app has a skills screen or an import button, replace these phrases with the verified labels. Do not invent menu names in this guide. -->

Share links are not ready. A finished bot would install from a link shaped like `grokbot://app/v1/bot-template?id=...`. Every bot in this release still says **pending review**. There is no link to open. Use the paste steps.

## 1. Game Feel

Folder: `templates/01-game-feel`.

The getting-started skill is named `game-vibes-getting-started`. It is not named after the folder. Typing `game-feel-getting-started` will not find it.

### Paste the skills

Open `templates/01-game-feel/skills/`. For each skill, copy the whole `SKILL.md` into a Grok Bot chat and say:

> Save this as a skill.

Save them in this order:

1. `game-vibes-lens-engine` (this one carries the grader)
2. `game-vibes-getting-started`
3. `game-feel-audit`
4. `ship-juice-module`
5. `before-after-feel-proof`
6. `assist-and-forgiveness-check` (only matters if your game has aim help, snap, or similar forgiveness)

### Remember the project

Open `templates/01-game-feel/MEMORY.md`. Paste each fact and say:

> Remember this for this project.

Skip weekly routines for now. They are in `PROMPTS.md` when you want a grade on a schedule.

### First prompt

```
Run the game-vibes-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run, test harness or manual capture>. Ask me which rubric profiles apply (`no-aiming`, `no-hazards`, `offline-only`) and tell me which other lines do not apply and will stay unmeasured.
```

Replace the angle brackets, or leave them and answer when the bot asks.

A rubric profile is a switch for a line that does not fit your game. Game Feel can set aside aiming, off-screen hazards, or online prediction. It asks you before it turns one on. If you do not have a number yet, say so. A missing measurement is marked unmeasured. It is not filled in with a guess.

### Sample grade

From `templates/01-game-feel`:

```bash
node engine/lens.mjs fixtures/good-pack.json
```

The synthetic file prints verdict **PASS** and grade **100/100**, with every line measured. That is not your game. It only shows what a finished grade looks like.

More prompts (a weekly grade, an audit, a fix loop) are in [PROMPTS.md](templates/01-game-feel/PROMPTS.md).

## 2. HUD

Folder: `templates/09-hud-designer`.

Add this when someone has to read the screen. Same paste pattern. Say "Save this as a skill." for each file, in this order:

1. `hud-designer-lens-engine`
2. `hud-designer-getting-started`
3. `live-hud-updates-and-cost`
4. `event-cues-and-recaps`
5. `wcag-luminance-and-ui-frame-gate`
6. `first-30s-onboarding-and-friction-killer`

Paste each fact from `MEMORY.md` and say "Remember this for this project."

### First prompt

```
Run the hud-designer-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run, test harness or manual capture>. Ask me which rubric profiles apply (`no-touch` or `touch-only`, `fixed-orientation`, `single-language`) and tell me which other lines do not apply and will stay unmeasured.
```

Those profiles cover no touch, touch only, one screen orientation, and one language.

Sample grade, from this folder: `node engine/lens.mjs fixtures/good-pack.json` prints verdict **PASS** and grade **100/100** on the synthetic example.

## 3. Bug Desk

Folder: `templates/18-bug-desk-triage`.

Add this when you have notes or a broken moment. It writes local issue drafts and groups duplicates. It does not file them in your tracker.

Save skills in this order:

1. `bug-desk-triage-lens-engine`
2. `bug-desk-triage-getting-started`
3. `duplicate-report-grouping`
4. `minimal-repro-builder`
5. `severity-and-regression-bisect`
6. `issue-draft-and-fix-verification`

Paste `MEMORY.md` the same way as before.

### First prompt

```
Run the bug-desk-triage-getting-started skill. Ask me one question at a time. My game is <name, genre, engine, platforms>. The build to grade is <URL or path>, and evidence packs come from <CI run or manual playtest capture>.
```

The bot will also ask which bugs may block a release, and how many clean runs a flaky bug needs. Those are your decisions.

Sample grade: verdict **PASS**, grade **100/100**, on `fixtures/good-pack.json`. Synthetic.

## 4. Producer

Folder: `templates/12-parallel-game-producer`.

Add this when you want a plan, not another grade of the game itself. It reads tasks, ticket drafts, and grades, then drafts a work plan and a go or hold recommendation. Nothing is sent.

Save skills in this order. The lens skill is first. `parallel-handoffs` carries the planner.

1. `parallel-game-producer-lens-engine`
2. `parallel-game-producer-getting-started`
3. `decision-gates`
4. `evidence-pitch`
5. `ledger-reconciliation`
6. `milestone-scope`
7. `parallel-handoffs`

Paste `MEMORY.md` the same way.

### First prompt

```
Run the parallel-game-producer-getting-started skill. Ask me one question at a time. My game is <name or code name, genre, engine, platforms>. The milestone is <milestone>, the audience is <who decides> and the decision I need is <the ask>. The build to check is <commit and build id>. Tickets come from <tracker export file>.
```

If you have no tracker export yet, say so. The bot should keep going with a marked assumption, not a made-up ticket list.

Its routine is not weekly by default. When you want one, open section 2 of [PROMPTS.md](templates/12-parallel-game-producer/PROMPTS.md), pick a cadence, and say: "Create a routine with this prompt:" followed by the pasted text.

Sample grade: verdict **PASS**, grade **100/100**, on `fixtures/good-pack.json`. Synthetic. The folder can also print a sample plan with `node engine/plan.mjs fixtures/project.json --plan`.

## After the four are running

Each bot works alone. When you want them to share notes, the files live in the game project:

```
your-game/.grokbot-team/artifacts/<name>/
your-game/.grokbot-team/memory/
```

You do not have to create that folder on day one. When a file is missing, the reader continues and says so. It does not invent the missing data. The full map is [docs/TEAM-MAP.md](docs/TEAM-MAP.md).

A worked example of HUD and Bug Desk on a fictional cooking game is [examples/pixel-pantry/](examples/pixel-pantry/). The grades there are synthetic. They show a before and after, not a promise about your game.

## Words this kit uses

| Word | Plain meaning |
|---|---|
| Template, bot | The same thing: one folder you add to Grok Bot. |
| Skill | One `SKILL.md` file. You paste it and ask the bot to save it. |
| Short name | What the rest of the kit calls the bot (Game Feel, HUD, Bug Desk, Producer). |
| Full name | The title at the top of the folder (for example Game Vibes Director). |
| Evidence pack | One JSON file of measurements for one build. |
| Grade | A score out of 100. |
| Verdict | PASS, CONDITIONAL, BLOCKED, or INVALID. See the [FAQ](FAQ.md). |
| Unmeasured (U) | You did not capture that line. It scores 0. It is not a defect you failed to notice. |
| Coverage | How much of the rubric was measured. `1` means every line. |
| Lens, engine | The program `engine/lens.mjs` that computes the grade. |
| Preview | Works, tests pass, not held to the release standard. |
| Shipping | Held to the release standard. The starter team is all shipping. |

## Where to go next

- Every bot, with when to use it: [TEMPLATES.md](TEMPLATES.md)
- Paste steps written once, for any bot: [INSTALL.md](INSTALL.md)
- Stuck on a grade or a name: [FAQ.md](FAQ.md)
- Rolling the kit into a project that already has builds and a tracker: [ADOPTING.md](ADOPTING.md)
- Which bots hand which files: [docs/TEAM-MAP.md](docs/TEAM-MAP.md)
