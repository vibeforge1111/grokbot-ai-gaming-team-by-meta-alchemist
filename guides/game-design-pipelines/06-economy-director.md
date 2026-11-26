# Game Economy Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Model sources and sinks for a currency or reward, compare progression paths, and simulate how balance changes affect player choices.

It fits any game where players earn and spend something: a farming or life sim, a city builder, a card game, a mobile puzzle game with boosters, a turn-based strategy game, a free game with no store, and games with combat. Combat timing and payment checks are optional modules. A game without combat or without a store selects the `no-combat` or `no-store` rubric profile, approved by the owner before scoring; those lines then read N/A, the points move to the other lines, and the verdict can reach PASS.

Template folder: [templates/06-economy-director](../../templates/06-economy-director/). Install and prompts: [HOW-TO-USE.md](../../templates/06-economy-director/HOW-TO-USE.md), [PROMPTS.md](../../templates/06-economy-director/PROMPTS.md).

## When to use it

- **Stage:** Production, Live
- **Trigger:** Before a balance patch, when players say one choice is too strong or a goal takes too long, and before any change to rewards, prices or progression.

## Inputs and outputs

- **Inputs:** Resource and item definitions, session logs, and progression or exchange rules. Combat definitions only if the game has combat; store sandbox results only if it sells something.
- **Outputs:** A map of sources and sinks, progression time estimates, reward counting checks, simulated outcomes for proposed changes, and a local draft change list (`economy-change-list`) for the owner.

## Handoffs

- **Takes from:** the approved `game-profile` and an `evidence-pack` for the build (playtest evidence and session telemetry).
- **Hands to:** Streamer and Patch Notes (20) for patch notes, and Live Service, Payments and Trust (22) for anything touching payments, through the owner-approved `economy-change-list`.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `economy-director-getting-started`. It asks what players earn and spend, where progress is saved, and whether the game has random rewards, combat or anything for sale, then the targets for the systems it has. No combat means `no-combat` and nothing for sale means `no-store`; you approve them before scoring and they go in `rubricProfile` in the game profile.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
3. **resource-sources-and-sinks-model (every game):** list where each resource comes from and where it goes, model balances over time, and find stuck players, unreachable goals and double-counted rewards.
4. **monte-carlo-meta-balancer:** run many seeded simulations of player choices to measure progression time, whether one choice dominates (the meta) and what a proposed change would do.
5. **combat-timing-auditor (only if the game has combat):** compare simulated and recorded time to defeat a target with the build's real rules. Skip it otherwise.
6. **Payment drills (only if the game sells something):** the owner runs failed, duplicate and interrupted purchases in the store sandbox; the bot reviews the results and never makes a charge, refund or grant.
7. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profiles used. Random rewards and a second save path have no profile: a game without them leaves those lines U, marks them "does not apply", and the verdict stays CONDITIONAL.
8. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines at level 3 or above.

## Rubric pillars

The pillar names come from the frozen rubric. What each one means for any game:

- **Combat balance** (20, only with combat): Time to defeat a target (only with combat); Multi-attacker damage follows the build's rules. How long fights take and what happens when several attackers hit one target.
- **Rewards and goal access** (20): Random reward rates reported with intervals (random reward rates with a 95 percent range, only with random rewards); No unreachable required path (every goal a player must reach stays reachable).
- **Progression** (20): Time to the next progression step states its assumptions (how long the next step takes, with its assumptions); Progress consistency across save paths (each save path counts progress the same way).
- **Reward fairness** (20): Idempotent reward counting (a retried claim grants once); Free and paid paths compared (only if the game sells something) (only if the game sells something).
- **Entitlement consistency** (20): Payment safety fails closed (only if the game sells something, sandbox only); Displayed vs authoritative balance (the number on screen matches the save or server).

See [README.md](README.md) for end to end pipelines that combine templates.
