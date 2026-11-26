# FAQ

Created by [@meta_alchemist](https://x.com/meta_alchemist).

Short answers for the first afternoon. The starter path is [Get started with your AI gaming team](GETTING-STARTED.md).

## Which bots should I add first?

Four, in this order: Game Feel (01), HUD (09), Bug Desk (18), Producer (12). They are all shipping bots. Reasons and first prompts are in the getting started guide.

Do not install all 23 on day one.

## The catalog says Share link coming soon. Did I miss a button?

No. Grok Bot cannot import this repo from GitHub. A live install link looks like `grokbot://app/v1/bot-template?id=...`. In this release every bot says **Share link coming soon**, and there is no link to open yet. Paste the skill files, or if you see an import action for `recipe.json`, you can use that file. Paste steps are Option B in [INSTALL.md](INSTALL.md).

## Which file do I paste?

Inside the bot's `skills/` folder, each subfolder has one `SKILL.md`. Paste the whole file, including the top `---` block. Save the skill whose name ends in `-lens-engine` first, then the one that ends in `-getting-started`, then the others.

Then paste the facts in `MEMORY.md`.

## I told it to run a skill and nothing happened

The skill name is not always the folder name. Game Feel's folder is `01-game-feel`, and its getting-started skill is `game-vibes-getting-started`.

Other names that do not match the folder:

| Folder | Getting-started skill |
|---|---|
| `01-game-feel` | `game-vibes-getting-started` |
| `15-mcp-anticheat` | `mcp-anticheat-getting-started` |
| `19-presskit-director` | `store-presskit-getting-started` |
| `23-support-moderation-desk` | `support-desk-getting-started` |
| `24-prize-refund-ledger` | `prize-ledger-getting-started` |
| `25-matchmaking-lobby-fill` | `lobby-fill-getting-started` |
| `26-balance-patch-director` | `balance-director-getting-started` |
| `27-retention-cohort-analytics` | `retention-cohorts-getting-started` |
| `28-mobile-store-submission` | `store-submission-getting-started` |

Copy the first prompt from that bot's README. Each README has a Start here section with the real name.

A grade record also prints a `templateId` such as `gbf-03-procedural-rig-crafter`. That is an internal id. The bot to open is still Prop and Rig, folder `03-prop-rig`.

## What do the verdicts mean?

| Verdict | Meaning |
|---|---|
| PASS | No measured line is below its pass level, coverage is 1, and the pack has no open P0. |
| CONDITIONAL | A measured line is below its pass level, or coverage is below 1. |
| BLOCKED | The pack has an open P0. The grade is 0. Template prompts also treat a confirmed release blocker this way. |
| INVALID | The pack itself is missing or not usable. There is no grade. Fix the pack. Do not treat this as a bad game. |
| U, unmeasured | That line was not captured. It scores 0. It is not a bug the bot invented. |
| NOT_RUN | The check did not run. It is not a pass. |

The synthetic sample for Game Feel is PASS, 100/100. Your game will not look like that until you have real captures. A low first grade usually means missing captures, not a ruined game.

## The grade is INVALID, or almost everything is U

INVALID means the pack has no usable build id (`gitSha` or `liveSha`) or is not a valid pack. The engine refuses it on purpose.

U means a line had no evidence. Copy `fixtures/good-pack.json`, keep the shape, and replace the values with numbers from your build. Do not type in a guess to raise the score. Thresholds belong in the game profile (`pack.profile`), not in the engine.

If you have no pack yet, that is normal. Answer the getting-started questions first. The first real grade can wait until you have one capture.

## Will the bot post, email, file tickets, or submit a build?

No. It writes local drafts. You review them and you send them. The same rule is in every template: work on a branch, push only when you ask, never push to main.

## Can I use this outside Grok Bot?

Yes. The skills are plain markdown. [INSTALL.md](INSTALL.md) Option C lists where they go in Cursor, Claude Code, Codex, and Gemini CLI. Copy `engine/` and `fixtures/` into the game repo if you want to run the grader there.

Routines (a weekly prompt on a schedule) are described as a Grok Bot feature. Elsewhere, run the same prompt when you want a grade, or from your own scheduled job.

## `node` is not found, or the sample command fails

Install Node 18 or newer, then run the command from the bot's folder, or pass paths from the repo root the way the [README](README.md) quickstart does.

From the bot folder, these two checks should print `"status":"PASS"`:

```bash
node tests/test-lens-contract.mjs
node tests/lens-negative-fixtures.mjs
```

The sample grade does not need `npm install`. This repo has no dependencies.

## Why are some numbers missing?

02, 04, 07, 08, and 16 are not in this release. The reasons are in [CHANGELOG.md](CHANGELOG.md). The numbers that are here stay stable, so 03 stays 03 even though 02 is absent.

Playtest QA (template 02) is the one people ask about. Until it exists, capture evidence yourself, from a playtest or from CI, and hand it to Bug Desk.

## What does preview mean?

The bot runs and its tests pass. It is not held to the release standard yet. Its README lists what it still needs. Use a preview to try an idea. Do not use it as the grade that decides a release. The starter team does not include a preview.

Templates 23 through 28 also have no pipeline page yet. Use their HOW-TO-USE file. Their install notes mention importing `recipe.json`. If you do not see that action, paste skills the same way as the starter team.

## The bot says connectors, a bot editor, or a share link

Those words appear in the preview install notes and in INSTALL.md. This repo does not describe a button for them.

<!-- TODO: founder: confirm the Grok Bot labels for saving a skill, saving a memory fact, creating a routine, importing recipe.json, and "connectors". The public docs only repeat the chat phrases already in INSTALL.md. -->

Until those labels are confirmed, use the chat phrases:

> Save this as a skill.

> Remember this for this project.

> Create a weekly routine with this prompt:

Producer is the exception. Its routine prompt is not weekly until you choose a cadence. The getting started guide says how.

## Where is the example game?

[examples/pixel-pantry/](examples/pixel-pantry/) is a fictional cooking game. HUD and Bug Desk grade two synthetic builds. It is a demo of the before and after, not a template you add to Grok Bot.

## Open questions

These stay generic until a maintainer confirms them. The pages do not invent Grok Bot menus.

1. The exact app labels for saving a skill, saving memory, and creating a routine. The docs use the chat phrases from [INSTALL.md](INSTALL.md).
2. Whether preview bots can import `recipe.json` in a bot editor, and what "leave connectors off" refers to. Newcomers are told to paste skills if they do not see an import action.
3. Live `grokbot://` share links. All 23 bots still say Share link coming soon.
4. Whether Game Loop (05, a preview) should replace Producer in the starter four. This pass keeps Producer, because it is shipping and it reads the other three. Game Loop is the optional fifth when the question is the core loop.
5. Pipeline pages for bots 23 through 28. They are not written here, because the repo does not have them yet.
