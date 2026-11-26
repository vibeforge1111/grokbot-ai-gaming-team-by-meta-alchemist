# Install

Created by @meta_alchemist (https://x.com/meta_alchemist).

New here? Read [Get started with your AI gaming team](GETTING-STARTED.md) first. This page is the install reference those steps come from. If you get stuck, see [FAQ.md](FAQ.md).

Grok Bot cannot import a template straight from GitHub. Use one of the three paths below. Each template's `HOW-TO-USE.md` repeats the steps with its own skill names.

## Option A: Add to Grok Bot (one click)

A full bot template installs from a Grok Bot template share link:

```
grokbot://app/v1/bot-template?id=<share id>
```

Share links are created per template after review. Until a real `grokbot://` id exists, each link in [TEMPLATES.md](TEMPLATES.md) reads **Share link coming soon**. There is no link to open yet.

1. While the share link is coming soon, use Option B, or import `recipe.json` if your editor has that action. Once a live link exists, open it on a device with Grok Bot and add the bot.
2. The bot starts its getting-started skill and asks you one question at a time: your game, the build, where evidence packs come from, and a few owner decisions. Answer them.
3. Use the prompts in the template's `PROMPTS.md`: setup, routine, audit, polish loop and outside judge prompts.

## Option B: Manual setup in Grok Bot

Works today, no link needed.

1. **Skills.** Open the template's `skills/` folder. For each skill, paste the whole `SKILL.md` into a Grok Bot chat and say:
   > Save this as a skill.

   Save the `*-lens-engine` skill first (it carries the engine code), then the `*-getting-started` skill, then the rest.
2. **Memory.** Open `MEMORY.md`. Paste each fact and say:
   > Remember this for this project.
3. **Routines.** Open `PROMPTS.md`, section 2. For each routine prompt say:
   > Create a weekly routine with this prompt: <paste>
4. **Start.** Say:
   > Run the <template>-getting-started skill.

## Option C: Other agents (Cursor, Claude Code, Codex, Gemini CLI)

The skills are plain markdown files with YAML frontmatter, so most agent tools can load them.

| Tool | Where skills go |
|---|---|
| Cursor | `.cursor/skills/<name>/SKILL.md` in your repo |
| Claude Code | `.claude/skills/<name>/SKILL.md` in your repo or your user skills folder |
| Codex | the skills or instructions folder your Codex setup reads, or reference the file from `AGENTS.md` |
| Gemini CLI | reference the file from `GEMINI.md`, or paste it as context |

Then copy the template's `engine/` and `fixtures/` folders into your repo so the agent can run:

```bash
node engine/lens.mjs fixtures/good-pack.json   # synthetic worked example
node engine/lens.mjs your-pack.json            # your build
```

Routines are a Grok Bot feature. In other tools, run the routine prompt on a schedule with your CI or a cron job, or just paste it when you want a grade. The README also has a one-line how-to for Claude Projects, ChatGPT Custom GPTs or Projects, and Gemini Gems: paste or upload the same `SKILL.md` files, then use the first prompt.

## More than one template on the same game

Install each template as its own bot (or its own skills folder). They do not talk to each other directly: they exchange files in your game project under `.grokbot-team/artifacts/` and share an append-only memory under `.grokbot-team/memory/`. Each template's `HOW-TO-USE.md` has a "Works with other templates" section listing what it reads and writes. The `engine/` folder you copy in Option C includes `team-memory.mjs`, the helper that reads, writes and lints that memory. Set `GROKBOT_TEAM_SALT` in your environment before any template records anything about a player or account. See the [team map](docs/TEAM-MAP.md).

## Check an install

```bash
cd templates/<slug>
node tests/test-lens-contract.mjs
node tests/lens-negative-fixtures.mjs
```

Both print `"status":"PASS"` when the engine, rubric and recipe agree.
