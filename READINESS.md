# Template readiness

Created by @meta_alchemist (https://x.com/meta_alchemist).

A short, honest list of what you can use today, what still carries ship blockers, and what is not in this repo. Shipping means the template is held to the kit's release standard: a full prompt, skills, starter tasks, a pipeline page, a worked example, and a passing validator. Preview means it works and its tests pass, but it is not yet held to that standard. Missing means there is no template folder in this release.

This page is the scorecard. The [catalog](TEMPLATES.md) is the index of folders that exist.

## Counts

| State | Count |
|---|---|
| Ready (shipping) | 23 |
| Preview | 1 |
| Missing | 6 |

The starter template (`starter/00-starter-template`) is a scaffold for a new bot, not a game-dev helper, so it is not in these counts.

## Ready

These are held to the release standard. Start with Game Feel, Game Loop, HUD, Bug Desk, and Producer, in that order. See [GETTING-STARTED.md](GETTING-STARTED.md).

| # | Template | Status line |
|---|---|---|
| 01 | [Game Feel](templates/01-game-feel/) | Ready. Starter team, first bot. |
| 03 | [Prop and Rig](templates/03-prop-rig/) | Ready. Use for 3D props and rigs. |
| 05 | [Game Loop](templates/05-game-loop-alchemist/) | Ready. Set `profile.bands.minCases` so a thin sample reads U. Starter team, second bot. |
| 06 | [Economy](templates/06-economy-director/) | Ready. Rewards, currencies, and progression. |
| 09 | [HUD](templates/09-hud-designer/) | Ready. Starter team, third bot. |
| 10 | [Trailer](templates/10-trailer-director/) | Ready. Clip selection and cuts from your own captures. |
| 11 | [Environment Design](templates/11-environment-design/) | Ready. Spaces, routes, and readable staging. |
| 12 | [Producer](templates/12-parallel-game-producer/) | Ready. Starter team, fifth bot. Plans and go or hold calls. |
| 13 | [Audio](templates/13-audio-director/) | Ready. Sound cues and adaptive music. |
| 14 | [Living NPC and Lore](templates/14-living-npc-lore/) | Ready. Set `profile.bands.minCases`. For generated dialogue, run each probe at least that many times. |
| 15 | [Server Fairness](templates/15-mcp-anticheat/) | Ready. Wait until you have a multiplayer build to grade. |
| 17 | [Sprite and Hitbox](templates/17-sprite-hitbox-packer/) | Ready. 2D art, atlases, and hitboxes. |
| 18 | [Bug Desk](templates/18-bug-desk-triage/) | Ready. Starter team, fourth bot. Local ticket drafts only. |
| 19 | [Store Page and Presskit](templates/19-presskit-director/) | Ready. Use when you are preparing store art and a press kit. |
| 20 | [Streamer and Patch Notes](templates/20-streamer-hype/) | Ready. Local outreach and notes drafts. You send them. |
| 21 | [Access, Input and Localization](templates/21-access-input-localization/) | Ready. Journeys, captions, motion, and locale checks. |
| 22 | [Live Service and Trust](templates/22-live-service-trust/) | Ready. Use when the game has accounts, purchases, or recovery flows. |
| 23 | [Support Desk](templates/23-support-moderation-desk/) | Ready. Drafts from redacted local intake, with a pack producer and receipts. |
| 24 | [Ledger](templates/24-prize-refund-ledger/) | Ready. Claim and wallet checks from an owner journal, with receipts. |
| 25 | [Matchmaking](templates/25-matchmaking-lobby-fill/) | Ready. Lobby fill proposals from observed seats. Silent hours count as zero. |
| 26 | [Balance Patch](templates/26-balance-patch-director/) | Ready. Parameter proposals checked against the next build's outcomes. |
| 27 | [Retention](templates/27-retention-cohort-analytics/) | Ready. Cohort rates from session events, with segments assigned at first play. |
| 28 | [App Store](templates/28-mobile-store-submission/) | Ready. Store checks from a pipeline export or a plain checks file. |

## Preview

These work, and their tests pass, but they are not held to the release standard. Use them to try an idea. Do not treat the grade as a release gate. Each README lists the remaining ship blockers in full.

| # | Template | Status line |
|---|---|---|
| 02 | [Playtest and Performance](templates/02-playtest-performance/) | Preview. Shared lens-kit and a pack producer are in place. Still needs worked examples from at least two real games, a live capture grade, and you bring your own capture tools (no bundled Playwright or GPU sampler). |

## Missing

There is no folder for these in this release. Template numbers that already exist stay stable. Studio Director and Game Clipmaker have no number here (this repo's 26 is Balance Patch).

| Name | Status line |
|---|---|
| 04 Multiplayer Netcode and Bot-Swarm | Missing. Held back after outside review. |
| 07 TSL and WebGPU Shader | Missing. Held back after outside review. |
| 08 Procedural World and Biome | Missing. Held back after outside review. |
| 16 Gaussian Splat Cleaner | Missing. Held back pending evidence from a working build. |
| Studio Director | Missing. Not in this repo. |
| Game Clipmaker | Missing. Trailer Director (10) covers clip selection in this release. |

Why the numbered ones were held back is also noted in [CHANGELOG.md](CHANGELOG.md).
