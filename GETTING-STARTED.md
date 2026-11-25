# Getting started with grokbot-ai-gaming-team-by-meta-alchemist

Created by @meta_alchemist (https://x.com/meta_alchemist).

`grokbot-ai-gaming-team-by-meta-alchemist` is an AI gaming team you run in Grok Bot: game-dev bots for game feel, economy, HUD, audio, environments, trailers, bug triage, live ops and more. It works for any game, in any genre, on any engine or platform, from a 2D platformer or a mobile puzzle game to a 3D multiplayer arena or a game jam prototype.

This guide walks you from the kit folder to your first working bot. Pick one team member, get it running, then add more.

## 1. Pick a template

1. Open the kit folder.
2. Open the [template catalog](TEMPLATES.md). Each row says what the template does, which stage of game development it fits (Prototype, Production, Playtest, Polish, Ship, Live), and links its guide.
3. If you aren't sure where to start, take **01 Game Vibes Director** for game feel, or **18 Playtest Bug Desk** if you already have players reporting bugs. Templates marked preview work, but are not yet held to the release standard.

Playtest QA (template 02) is coming later. For now, collect evidence from your own playtests or CI.

Each template folder has the same files:

- `HOW-TO-USE.md`: install steps with this template's own skill names
- `PROMPTS.md`: setup, routine, audit, polish loop and outside judge prompts
- `MEMORY.md`: facts the bot should remember about your project
- `CHANGELOG.md`: what changed in each version
- `skills/`: one folder per skill, each with a `SKILL.md`
- `RUBRIC.md` and `RUBRIC.json`: how the work is graded
- `engine/`, `fixtures/` and `tests/`: the grading engine, a synthetic worked example and its checks

## 2. Route A: add it to Grok Bot with a share link (easiest)

Grok Bot can't import straight from GitHub. A finished template installs from a share link that looks like `grokbot://app/v1/bot-template?id=<share id>`.

1. Find the template's link in `TEMPLATES.md`. If it says **pending review**, the link isn't out yet, so use Route B for now.
2. Open the link on a computer or phone with Grok Bot and add the bot.
3. The new bot starts its getting-started skill and asks you one question at a time (see section 6). Answer them.
4. Then use the prompts in the template's `PROMPTS.md`.

## 3. Route B: paste the skills into Grok Bot by hand (works today)

1. **Skills.** Open the template's `skills/` folder. For each skill, copy the whole `SKILL.md` into a Grok Bot chat and say:
   > Save this as a skill.

   Save the `*-lens-engine` skill first, because it carries the engine code. Then save the `*-getting-started` skill, then the rest.
2. **Memory.** Open `MEMORY.md`, paste each fact and say:
   > Remember this for this project.
3. **Routines.** Open `PROMPTS.md`, section 2. For each routine prompt say:
   > Create a weekly routine with this prompt: <paste>
4. **Start.** Say:
   > Run the <template>-getting-started skill.

## 4. Route C: Claude Code, Codex, Cursor or Gemini CLI

The skills are plain markdown with YAML frontmatter, so most coding agents can load them.

| Tool | Where the skills go |
|---|---|
| Claude Code | `.claude/skills/<name>/SKILL.md` in your repo, or your user skills folder |
| Codex | the skills or instructions folder your Codex setup reads, or reference each file from `AGENTS.md` |
| Cursor | `.cursor/skills/<name>/SKILL.md` in your repo |
| Gemini CLI | reference each file from `GEMINI.md`, or paste it as context |

Then copy the template's `engine/` and `fixtures/` folders into your repo and run:

```bash
node engine/lens.mjs fixtures/good-pack.json   # synthetic worked example
node engine/lens.mjs your-pack.json            # your build
```

Routines are a Grok Bot feature. In other tools, run the routine prompt from CI or a cron job, or paste it whenever you want a grade. `guides/` has a full guide on pairing Grok Bot with these tools.

## 5. Check that it works

```bash
cd templates/<slug>
node tests/test-lens-contract.mjs
node tests/lens-negative-fixtures.mjs
```

Both should print `"status":"PASS"`. Then ask your bot to grade the worked example:

> Grade fixtures/good-pack.json with the lens engine and explain each line in plain words.

## 6. Recommended first prompts

Use these in order with any template:

1. **Onboard:**
   > Run the <template>-getting-started skill and ask me one question at a time.
2. **First grade on the sample:**
   > Grade the synthetic worked example and tell me what each score means.
3. **First grade on your game:**
   > Here is my build or evidence pack: <link or file>. Check the intended build and profile first. A missing or invalid pack gets INVALID with no grade. In a valid pack, mark missing line evidence UNMEASURED, and list the top three fixes.
4. **Fix loop:**
   > Take the top fix, make the change on a branch, and show me before and after proof.
5. **Weekly routine:**
   > Create a weekly routine that regrades my latest build and tells me only what changed.

Each template's `PROMPTS.md` has more, including an outside judge prompt that asks a second model to check the grade.

## 7. What each template asks when you first start

Every getting-started skill asks one question at a time. In general it asks about your game and build, where the evidence comes from, the numbers that go in your game profile, which rubric lines apply to your game, a few decisions only you can make, and where findings should go. Each template lists its own questions in its getting-started skill.

| # | Template | Getting-started skill |
|---|---|---|
| 01 | [Game Vibes Director](templates/01-game-feel/HOW-TO-USE.md) | [`game-vibes-getting-started`](templates/01-game-feel/skills/game-vibes-getting-started/SKILL.md) |
| 03 | [Prop & Rig Director](templates/03-prop-rig/HOW-TO-USE.md) | [`prop-rig-getting-started`](templates/03-prop-rig/skills/prop-rig-getting-started/SKILL.md) |
| 05 | [Game Loop Alchemist](templates/05-game-loop-alchemist/HOW-TO-USE.md) (preview) | [`game-loop-alchemist-getting-started`](templates/05-game-loop-alchemist/skills/game-loop-alchemist-getting-started/SKILL.md) |
| 06 | [Game Economy Director](templates/06-economy-director/HOW-TO-USE.md) | [`economy-director-getting-started`](templates/06-economy-director/skills/economy-director-getting-started/SKILL.md) |
| 09 | [HUD and Game UI Designer](templates/09-hud-designer/HOW-TO-USE.md) | [`hud-designer-getting-started`](templates/09-hud-designer/skills/hud-designer-getting-started/SKILL.md) |
| 10 | [Stream-to-Devlog & Trailer Cut Director](templates/10-trailer-director/HOW-TO-USE.md) | [`trailer-director-getting-started`](templates/10-trailer-director/skills/trailer-director-getting-started/SKILL.md) |
| 11 | [Environment Design Director](templates/11-environment-design/HOW-TO-USE.md) | [`environment-design-getting-started`](templates/11-environment-design/skills/environment-design-getting-started/SKILL.md) |
| 12 | [Parallel Game Producer and Pitch Architect](templates/12-parallel-game-producer/HOW-TO-USE.md) | [`parallel-game-producer-getting-started`](templates/12-parallel-game-producer/skills/parallel-game-producer-getting-started/SKILL.md) |
| 13 | [Sound Effects & Adaptive Music Director](templates/13-audio-director/HOW-TO-USE.md) | [`audio-director-getting-started`](templates/13-audio-director/skills/audio-director-getting-started/SKILL.md) |
| 14 | [Living AI NPC and Lore Architect](templates/14-living-npc-lore/HOW-TO-USE.md) (preview) | [`living-npc-lore-getting-started`](templates/14-living-npc-lore/skills/living-npc-lore-getting-started/SKILL.md) |
| 15 | [Server Fairness & Anti-Cheat Guard](templates/15-mcp-anticheat/HOW-TO-USE.md) | [`mcp-anticheat-getting-started`](templates/15-mcp-anticheat/skills/mcp-anticheat-getting-started/SKILL.md) |
| 17 | [2D Sprite Atlas & Hitbox Packer](templates/17-sprite-hitbox-packer/HOW-TO-USE.md) | [`sprite-hitbox-packer-getting-started`](templates/17-sprite-hitbox-packer/skills/sprite-hitbox-packer-getting-started/SKILL.md) |
| 18 | [Playtest Bug Desk & Repro Triage Director](templates/18-bug-desk-triage/HOW-TO-USE.md) | [`bug-desk-triage-getting-started`](templates/18-bug-desk-triage/skills/bug-desk-triage-getting-started/SKILL.md) |
| 19 | [Store Page & Presskit Director](templates/19-presskit-director/HOW-TO-USE.md) | [`store-presskit-getting-started`](templates/19-presskit-director/skills/store-presskit-getting-started/SKILL.md) |
| 20 | [Streamer Scout, Patch Notes & Update Hype Director](templates/20-streamer-hype/HOW-TO-USE.md) | [`streamer-hype-getting-started`](templates/20-streamer-hype/skills/streamer-hype-getting-started/SKILL.md) |
| 21 | [Access, Input and Localization QA](templates/21-access-input-localization/HOW-TO-USE.md) | [`access-input-localization-getting-started`](templates/21-access-input-localization/skills/access-input-localization-getting-started/SKILL.md) |
| 22 | [Live Service, Payments and Trust](templates/22-live-service-trust/HOW-TO-USE.md) | [`live-service-trust-getting-started`](templates/22-live-service-trust/skills/live-service-trust-getting-started/SKILL.md) |
| 23 | [Community Support and Moderation Desk](templates/23-support-moderation-desk/HOW-TO-USE.md) (preview) | [`support-desk-getting-started`](templates/23-support-moderation-desk/skills/support-desk-getting-started/SKILL.md) |
| 24 | [Prize, Refund and Entitlement Ledger](templates/24-prize-refund-ledger/HOW-TO-USE.md) (preview) | [`prize-ledger-getting-started`](templates/24-prize-refund-ledger/skills/prize-ledger-getting-started/SKILL.md) |
| 25 | [Matchmaking and Region Lobby Fill](templates/25-matchmaking-lobby-fill/HOW-TO-USE.md) (preview) | [`lobby-fill-getting-started`](templates/25-matchmaking-lobby-fill/skills/lobby-fill-getting-started/SKILL.md) |
| 26 | [Live-Ops Balance Patch Director](templates/26-balance-patch-director/HOW-TO-USE.md) (preview) | [`balance-director-getting-started`](templates/26-balance-patch-director/skills/balance-director-getting-started/SKILL.md) |
| 27 | [Retention and Cohort Analytics](templates/27-retention-cohort-analytics/HOW-TO-USE.md) (preview) | [`retention-cohorts-getting-started`](templates/27-retention-cohort-analytics/skills/retention-cohorts-getting-started/SKILL.md) |
| 28 | [Mobile App Store Submission](templates/28-mobile-store-submission/HOW-TO-USE.md) (preview) | [`store-submission-getting-started`](templates/28-mobile-store-submission/skills/store-submission-getting-started/SKILL.md) |

## 8. Tips

- Start with one template and one build. Add more templates once the first one grades your game.
- Anything you can't measure yet is marked UNMEASURED. An unmeasured line earns zero points. Record the capture you need to measure it.
- A test that didn't run is NOT_RUN, never PASS.
- `guides/` covers the game design pipelines, pairing with other coding agents, a PC and Mac bridge, and rubrics and polish.
- Running more than one template on the same game? They share findings through `.grokbot-team/` in your project. See the [team map](docs/TEAM-MAP.md) and [shared memory](docs/SHARED-MEMORY.md).
- A line that does not fit your game (no aiming, no store, one language) is not a failure. Ask the getting-started skill to mark it not applicable in an approved profile.
