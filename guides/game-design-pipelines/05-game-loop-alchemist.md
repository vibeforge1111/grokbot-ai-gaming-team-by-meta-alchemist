# Game Loop Alchemist in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Map what the player chooses, what changes, and why the next turn is worth taking. Measure the core loop, its pace and the freedom to stop.

**Status: preview, not shipping.** The template works and its tests pass, but one observed case can still earn level 4 on a line until the engine gains a minimum case count. Read thin lines as provisional.

A *core loop* is the short cycle a player repeats: act, see what changed, choose again. It fits any genre: placing a tile in a puzzle game, a jump and a respawn in a 2D platformer, a turn in a strategy game, a race and its rematch, a day in a farming sim, a choice in a narrative adventure.

Template folder: [templates/05-game-loop-alchemist](../../templates/05-game-loop-alchemist/). Install and prompts: [HOW-TO-USE.md](../../templates/05-game-loop-alchemist/HOW-TO-USE.md), [PROMPTS.md](../../templates/05-game-loop-alchemist/PROMPTS.md).

## When to use it

- **Stage:** Prototype and playtest.
- **Trigger:** After a change to the opening, a repeating decision, a retry or setback, or the invitation to play again. Grade a fresh cohort of testers each time.

## Inputs and outputs

- **Inputs:** Timestamped first-session traces, anonymous playtest observations, return opportunities from an observation window that has closed, your game profile (`game-profile`) and an evidence pack (`evidence-pack`).
- **Outputs:** A 100-point loop grade (`grade-record`), a local loop map, a pacing diagnosis and an experiment card for the designer and the playtest lead (together, a `loop-report`), and local ticket drafts (`ticket-draft`).

## Handoffs

- **Takes from:** Playtest traces and captures (the evidence pack) from your playtest team, a CI run or a manual capture; the owner's game profile.
- **Hands to:** Producer (12), which can use the grade record as a milestone gate; Bug Desk (18) for ticket drafts, where a tester forced into another cycle after asking to stop is a P0 candidate; the designer and playtest lead for the loop map, pacing diagnosis and experiment card; through a local `loop-report`, Game Feel (01) and HUD Designer (09) for cue changes and Economy Director (06) for reward or replay changes; Audio Director (13) for sound cue changes, as a ticket draft.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `game-loop-alchemist-getting-started`; answer its questions one at a time (the first meaningful action, the decision beat, the setback, the stop point, the cohort and window, the coding keys, the budgets and the bands); write the answers into your game profile.
2. **Get a pack:** run a playtest with a fresh cohort, or use a CI run or manual capture of this build. Playtest QA (template 02) is coming later.
3. **opening-playtest:** before any hint, ask testers what they are trying to do, and time the first meaningful action.
4. **loop-consequence:** check that the core action makes the intended change and that testers can say what changed.
5. **decision-pacing:** time the gap between decisions and the time to act again after a setback, leaving out only the pauses you approved.
6. **loop-agency:** check that a different choice leads somewhere different and that a stop request at the agreed stop point is honored.
7. **voluntary-replay:** after the observation window closes, count who came back when invited, declines included, and code the stated reason separately.
8. **Grade:** `node engine/lens.mjs <pack.json>` from the template folder. Lead with verdict, grade and coverage, and say how many cases each line rests on.
9. **Polish loop:** draft one reversible change to the slowest measured beat or the lowest measured line, regrade a fresh cohort under the same profile, keep passing lines at level 3 or above.

## Examples by genre (illustrative)

- **Mobile puzzle game:** testers read the goal as "connect the exits" before any hint, and place a first tile within the budget. The next optional board is the replay offer.
- **2D platformer:** respawn after a fall gives control back within the recovery budget; declining "retry for a better time" returns to the level map.
- **Turn-based strategy game:** the gap from the end of the enemy turn to the next available order, with the enemy animation as an approved pause, sets the decision beat.
- **Racing game:** a different pit choice changes the race order; declining the rematch never starts a countdown.
- **Farming or life sim:** "I have to water the crops or they die" is coded as obligation, not an intrinsic reason to play another day.
- **Narrative adventure:** a different reply leads to a different scene; replaying a chapter for another branch is the replay offer.

## Rubric pillars

- **Opening** (20): Opening goal understood; Time to meaningful action
- **Consequence** (20): Action produces its intended state; Feedback explains the consequence
- **Pacing** (20): Time between decisions; Time to regain agency (time to act usefully again after a setback)
- **Agency** (20): A choice changes the next beat; An explicit stop is honored (a forced continuation is a release blocker)
- **Replay** (20): Reason to replay is intrinsic (the reason comes from the game itself, not obligation or an outside reward); Voluntary replay after an opportunity

A game without a part of the loop a line needs (for example no setback to recover from) leaves that line unmeasured (U). The report says it does not apply, and the verdict stays CONDITIONAL.

See [README.md](README.md) for end to end pipelines that combine templates.
