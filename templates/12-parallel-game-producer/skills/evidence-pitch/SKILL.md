---
name: evidence-pitch
description: "Use when the team needs a local pitch deck for a named audience and decision, built only from owner-approved facts and reviewed slide by slide."
---

> Created by @meta_alchemist (https://x.com/meta_alchemist).
> Audit contract v1 (overrides everything below). Grade only with the installed lens. Use the owner's approved game profile for game facts, scope and budgets. Synthetic numbers illustrate one profile. Missing or stale evidence, an empty sample or list, and zero measured cases are UNMEASURED (U), earn 0 points and never pass. Record an unavailable run as NOT_RUN. A confirmed release blocker or unresolved P0 gives BLOCKED and grade 0. An unknown fixture selector must fail. Keep each ticket as a local draft. Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Draft a pitch from evidence

Draft a local pitch deck for a named audience and decision, using only owner-approved facts. Every slide claim must equal an approved fact word for word, future work is labelled as a proposal, and a reviewer signs off on the exact slide version.

Rubric lines this feeds: `pitch:1` (Pitch claims trace to approved facts) and `pitch:2` (Deck covers the reviewed decision).

## Steps

1. **List the topics.** Take them from `profile.requiredTopics`. The example uses promise, playable proof, remaining scope, production dependencies, risk and the ask.
2. **Collect approved facts.** For each topic add a row to `snapshot.facts` with `id`, `text`, `kind` (`observed` for what exists today, `proposal` for future work), `source` and `approved` (true only when the owner approved it).
3. **Write one slide per topic.** In `snapshot.slides`, each row has `id` (the topic), `headline`, `claim` (exactly the fact's text), `fact` (the fact id) and `note` (a speaker note for this audience). For the ask, state the decision, the resources sought, the next demonstrable milestone and the cut if declined.
4. **Render the deck.** From the template folder run `node engine/plan.mjs <project.json> --deck`. A slide whose claim does not match an approved fact prints `[Evidence gap]` and `capture needed`; assign a proof task instead of rewording the claim.
5. **Get the review.** Run `--plan` and read `deckDigest`. Ask the human reviewer to review that exact version, then record `snapshot.deckReview` with `gitSha`, `liveSha`, `scope`, `source`, `role`, `digest` and `topics` (one true or false per topic). Editing any slide, the audience or the ask changes the digest and voids the review.
6. **Build and grade.** `node engine/plan.mjs <project.json> --pack > <pack.json>`, then `node engine/lens.mjs <pack.json>`. The pack holds `claims` rows `{caseId, grounded}` and `review` rows `{caseId, reviewed}`, one per topic.
7. **When you cannot measure.** A fact with no source, or a review on an older digest, leaves the line U. Keep the deck and any cover message as local drafts; the owner sends them.

## Output

- A Markdown deck in the shape of `fixtures/pitch-draft.md` for local review, with status and source per slide.
- `claims` and `review` rows in the pack the planner builds.
- A list of evidence gaps with a proof task for each.

## Examples by genre (illustrative)

- **2D platformer, publisher pitch:** proof slide "World 1 is playable from start to boss" (observed, source: the playthrough capture); ask slide "Fund worlds 2 and 3" (proposal).
- **Farming or life sim, internal review:** promise slide from the design brief; risk slide "Crop growth may feel slow in winter" (proposal, source: the pacing diagnosis from Game Loop Alchemist (05)).
- **Turn-based strategy game, funding panel:** dependencies slide "AI opponent work waits on the rules freeze" (observed, source: the task graph).

## Pitfalls

- Rewording a fact on the slide. The claim must equal the approved text.
- Presenting a forecast as observed.
- Reusing an old review after editing a slide.
