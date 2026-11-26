# Streamer Scout, Patch Notes & Update Hype Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Match creators to your intended audience and turn verified build changes into patch notes and updates for players. Spectator, streamer-mode and season features apply only if your game has them.

Template folder: [templates/20-streamer-hype](../../templates/20-streamer-hype/). Install and prompts: [HOW-TO-USE.md](../../templates/20-streamer-hype/HOW-TO-USE.md), [PROMPTS.md](../../templates/20-streamer-hype/PROMPTS.md).

## When to use it

- **Stage:** Ship, Live
- **Trigger:** Every patch, and when planning creator outreach.

## Inputs and outputs

- **Inputs:** A change list, intended audience and update schedule.
- **Outputs:** Patch notes drafts, a creator shortlist with outreach drafts, and a review of your stream, replay and (if your game has one) spectator features.

## Handoffs

- **Takes from:** a verified change list from your repo or Bug Desk (template 18), Economy Director (template 06), Stream-to-Devlog & Trailer Cut Director (template 10) and Store Page & Presskit Director (template 19).
- **Hands to:** The owner (every post and DM stays a draft).
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `streamer-hype-getting-started`; answer its questions one at a time (how you update, which stream features your game has, the capture budget); write the values into your game profile. It also asks which rubric profiles apply (`no-spectator-mode`, `no-share-links`); you approve them before scoring and they go in `rubricProfile`.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
3. **git-diff-patch-notes-hype-compiler:** write patch notes where every line maps to a commit and every claim matches the shipped build. A single-player game writes a short note per version; a game with seasons writes a headline note per season.
4. **stream-and-replay-features-review:** check recording, capture cost, streamer mode, share links and fairness, plus the spectator view and stream delay only if your game has a spectator or streaming mode.
5. **creator-shortlist-scout:** shortlist creators who already play games like yours (story games for a narrative game, relaxed long sessions for a farming sim, campaign series for a strategy game) and draft outreach for the owner to send.
6. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profiles used.
7. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, and keep passing lines at level 3 or above.

## Rubric pillars

- **Capture reliability** (20): Recording replays and exports; Capture performance budget
- **Spectator comprehension** (20): Spectator view shows only allowed information; Spectator view readable at stream resolutions
- **Creator controls** (20): Streamer mode and redaction; Share links
- **Truthful claims** (20): Patch notes checked against commits; Technical claims match the code
- **Player safety** (20): Creator and viewer features cannot change results; Test results carry measured values

The spectator lines apply only to games with a spectator or streaming mode. Without one, the owner approves the `no-spectator-mode` profile before scoring: both spectator lines read N/A, their 20 points are shared over the other eight lines, the spectator blockers no longer apply, and the verdict can reach PASS. A game without share links selects `no-share-links` the same way. For games with a spectator mode, the stream delay blocker must be measured before release. A game with no streamer mode or on-screen names selects `no-streamer-mode`: `creator-controls:1` reads N/A and its redaction blockers no longer apply.

See [README.md](README.md) for end to end pipelines that combine templates.
