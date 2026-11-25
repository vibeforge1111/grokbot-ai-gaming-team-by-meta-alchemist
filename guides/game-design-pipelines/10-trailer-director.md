# Stream-to-Devlog & Trailer Cut Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Turn recorded gameplay into a devlog or trailer. Choose moments that show the player experience, frame them for each destination and check the cut for sensitive information.

Template folder: [templates/10-trailer-director](../../templates/10-trailer-director/). Install and prompts: [HOW-TO-USE.md](../../templates/10-trailer-director/HOW-TO-USE.md), [PROMPTS.md](../../templates/10-trailer-director/PROMPTS.md).

## When to use it

- **Stage:** Ship, Live
- **Trigger:** For every trailer, devlog, highlight reel or short.

## Inputs and outputs

- **Inputs:** Gameplay recordings or streams of the build, brand rules, and the delivery formats you need (for example wide 16:9 and vertical 9:16; add square 1:1 or portrait 4:5 only if you post to a feed that uses them).
- **Outputs:** Ranked moments, an edit list, one export per approved format, and a final review report (redaction, captions, loudness).

## Handoffs

- **Takes from:** playtest captures and live streams of the build.
- **Hands to:** Store Page & Presskit Director, template 19 (local store media drafts), and Streamer Scout and Patch Notes, template 20 (local post drafts). Every post, upload and submission stays a local draft for the human.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `trailer-director-getting-started`; answer its questions one at a time (formats, loudness, length, reviewers); write the values into your game profile.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest QA (template 02) is coming later.
3. **gameplay-moment-finder:** pick moments from the game's own events and the footage, or by hand when the game logs none. A platformer might pick a hard jump landed, a puzzle game a board cleared, a strategy game a turning-point move, a racing game a last-corner overtake, a narrative game a choice and its result, a farming sim the first harvest.
4. **multi-aspect-smart-framing-exporter:** reframe each approved cut so the subject, essential UI and captions stay visible, then export and decode every cut, including one interrupted render.
5. **beat-sync-and-secret-redaction-gate:** time the cut, then review every final export for private or unlicensed material, captions and loudness.
6. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage.
7. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, and keep passing lines at level 3 or above.

## Rubric pillars

- **Authentic gameplay** (20): Build-bound shots; No unavailable features implied
- **Readable story** (20): Edit decisions recorded; Action readable in the main wide cut
- **Composition** (20): Action and essential UI kept in the approved crop; Sensitive information redacted
- **Technical export** (20): Approved delivery cuts exported and decoded; Recovery after interruption
- **Accessible delivery** (20): Captions; Sound check

See [README.md](README.md) for end to end pipelines that combine templates.
