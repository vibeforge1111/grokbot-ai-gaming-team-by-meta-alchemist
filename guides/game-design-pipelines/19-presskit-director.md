# Store Page & Presskit Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Prepare store copy, screenshots and press assets that show what players actually do in your game, then check each destination's requirements.

Template folder: [templates/19-presskit-director](../../templates/19-presskit-director/). Install and prompts: [HOW-TO-USE.md](../../templates/19-presskit-director/HOW-TO-USE.md), [PROMPTS.md](../../templates/19-presskit-director/PROMPTS.md).

## When to use it

- **Stage:** Ship
- **Trigger:** Before a store page goes up and before each big update.

## Inputs and outputs

- **Inputs:** The list of destinations (for example a PC store such as Steam, itch.io, a console store, a mobile app store or the game's own website), the store art each one asks for, store copy, the trailer and screenshots.
- **Outputs:** A store art format audit per destination, a hook and claims check, page metadata and share preview checks, and a presskit archive with a leak check.

## Handoffs

- **Takes from:** Stream-to-Devlog & Trailer Cut Director, template 10 (final cuts and stills), and HUD, template 09 (screenshots).
- **Hands to:** Streamer Scout and Patch Notes, template 20 (the press kit link for creator outreach drafts). Every upload and submission stays a local draft for the human.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `store-presskit-getting-started` (it covers every destination, not only Steam); answer its questions one at a time (destinations, spec versions, viewports, pages you control); write the values into your game profile. A game with no web page you control selects the `no-own-web-page` profile, approved before scoring and set as `rubricProfile` in the game profile.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest QA (template 02) is coming later.
3. **store-copy-and-metadata-checker:** put the hook on the first screen, back every advertised feature with the build, and check page metadata and share previews on pages you control.
4. **store-art-format-auditor:** check every required image for each destination against its current spec: a Steam capsule set, an itch.io cover, console key art and tiles, mobile app icons and screenshots, or a website hero image.
5. **presskit-zip-zero-leak-compiler:** assemble the press page, factsheet, logo pack and current-build media, then scan the final archive for anything private.
6. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage, and name the rubric profile if one was used.
7. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, and keep passing lines at level 3 or above.

## Rubric pillars

- **First screen and copy** (20): Store page first screen; Storefront hook copy
- **Share metadata** (20): Page metadata on pages you control; Link preview cards
- **Icons and install** (20): Required icons load and decode; Contrast and legibility
- **Media** (20): Screenshot and GIF readiness; Store art and logo formats
- **Presskit and obligations** (20): Presskit completeness; Rights, age, privacy and support links

Some line names come from web pages or one store (meta tags, share cards, favicon, capsules). They apply only where your destinations have that thing. With no web page you control, the approved `no-own-web-page` profile marks both share-metadata lines N/A and shares their 20 points over the other lines, so the verdict can reach PASS. Any other line that does not apply has no profile: it stays U (unmeasured), which lowers coverage but is never a defect.

See [README.md](README.md) for end to end pipelines that combine templates.
