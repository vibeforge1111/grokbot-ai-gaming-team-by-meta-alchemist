# Grok Bot AI Gaming Team by Meta Alchemist

Created by [@meta_alchemist](https://x.com/meta_alchemist). MIT licensed.

A pack of AI game-dev bots you add to Grok Bot. Each bot looks at one part of your game, grades what you captured, and drafts fixes for you to approve. You stay in charge. Nothing is posted, filed, or sent until you do it.

It is for solo developers and small teams, in any genre, on any engine. A platformer, a mobile puzzle, a farming sim, a story game, a racing game, or an online arena all fit.

## Five minute quickstart

You do not need all 23 bots. Start with four, in this order: **Game Feel**, **HUD**, **Bug Desk**, **Producer**. The reasons, the paste steps, and a first prompt for each one are in [Get started with your AI gaming team](GETTING-STARTED.md).

1. Download this repo.
2. If you have Node 18 or newer, grade the sample. It is synthetic, not your game. From this folder:

```bash
node templates/01-game-feel/engine/lens.mjs templates/01-game-feel/fixtures/good-pack.json
```

You should see `"verdict": "PASS"` and `"grade": 100`.

3. Add Game Feel next, from `templates/01-game-feel`. Share links are not live yet, so paste each skill file into a Grok Bot chat. The guide has the exact words, including this first prompt: `Run the game-vibes-getting-started skill.`

Stuck? Read the [FAQ](FAQ.md). The full list of bots is the [catalog](TEMPLATES.md).

## The four bots to start with

| Order | Bot | Add it when | Folder |
|---|---|---|---|
| 1 | Game Feel | The game responds to a button, a key, or a tap | [01 Game Feel](templates/01-game-feel/) |
| 2 | HUD | Players have to read the screen | [09 HUD](templates/09-hud-designer/) |
| 3 | Bug Desk | You have notes, or something broke | [18 Bug Desk](templates/18-bug-desk-triage/) |
| 4 | Producer | The task list is bigger than the week | [12 Producer](templates/12-parallel-game-producer/) |

Each bot also has a longer official name inside its folder. Game Feel is "Game Vibes Director". Use the short name when you talk about it. The [catalog](TEMPLATES.md) lists both names, when to use the bot, and the links.

## How a bot works

1. It asks about your game, one question at a time.
2. You capture evidence from a real build. That can be a screenshot, a trace, a clip, or a JSON file called an evidence pack.
3. A small local program turns that pack into a grade out of 100. Anything you did not measure is marked unmeasured and scores zero. It is never guessed.
4. Findings become local drafts. You decide what to file or ship.

Several bots on one game can share files under `.grokbot-team/` in the game project. Ignore that until the first bot is grading. The map is [docs/TEAM-MAP.md](docs/TEAM-MAP.md).

## Install paths

Grok Bot does not import this repo from GitHub. Details are in [INSTALL.md](INSTALL.md).

- **Manual, works today.** Paste each `SKILL.md` into a Grok Bot chat and ask it to save the skill. Then run the getting-started skill named in that bot's guide.
- **Share link, not ready.** Each bot will get a `grokbot://` link after review. Every link still says pending review.
- **Other agents.** The same `SKILL.md` files work in Claude Code, Codex, Cursor, or Gemini CLI.

Already running a project and want the longer rollout? Read [ADOPTING.md](ADOPTING.md). Making your own bot template? Start at [starter/](starter/).

## What is in the box

| Path | What it is |
|---|---|
| [GETTING-STARTED.md](GETTING-STARTED.md) | The starter team, in order, with copy-paste prompts. |
| [TEMPLATES.md](TEMPLATES.md) | Every bot: purpose, when to use it, and links. |
| [FAQ.md](FAQ.md) | What to try when you get stuck. |
| [templates/](templates/) | 15 shipping bots and 8 previews. Each README opens with what it does, setup, a first prompt, and a sample grade. |
| [docs/](docs/) | How bots share files, shared memory, versions, the skill format, and rubrics. |
| [guides/](guides/) | Pipelines, using other AI tools, rubrics, and polish. |
| [examples/pixel-pantry/](examples/pixel-pantry/) | A fictional cooking game, graded before and after fixes. Synthetic. |
| [starter/](starter/) | A small template to copy when you want to write your own. |

Checks: `npm run check` (Node 18 or newer, no install). The last recorded run is in [TEST-RESULTS.md](TEST-RESULTS.md).

## House rules

- Drafts stay local until a person sends, publishes, uploads, or files them.
- Work on a branch. Push only when a person asks, and never to main. A person merges.
- Missing evidence scores zero. It is not a made-up bug, and it is not a made-up pass.
- Thresholds live in your game profile, not in the grader. Examples are labeled synthetic.

## Credits and license

Created by [@meta_alchemist](https://x.com/meta_alchemist). Please keep that credit if you fork a template or a skill.

Released under the [MIT License](LICENSE).
