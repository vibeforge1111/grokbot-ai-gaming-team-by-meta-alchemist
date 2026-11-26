# Rubrics and polish loops in a game pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

A rubric turns "is it good yet?" into numbers you can move on purpose. A polish loop is how you move them without fooling yourself.

## Two scales, one truth

- **100-point scale (the source of truth).** 5 pillars x 20 points, 2 lines each, levels 0 to 4 or U, contribution = weight x level / 4, pass at level 3. See [../docs/RUBRIC_GUIDE.md](../docs/RUBRIC_GUIDE.md).
- **Out of 10 (for humans).** Divide the 100-point grade by 10 at the end and keep one decimal: 87.5 becomes 8.8. Always say the coverage: "8.8 out of 10 at 80% coverage".
- **Area scorecards out of 10.** For a whole game audit (feel, netcode, store readiness, support and so on), score each area out of 10 from its template grade where one exists, and mark areas without a template grade as estimates. Do not mix estimates into the same average as measured grades without saying so.
- **Targets.** Choose a grade and coverage target for each milestone. For example, a team might require 95/100 at full coverage on a release blocker. Prioritize failed critical checks even when the overall grade is high.

## Dual external judges

For judged lines and release decisions, prepare a sanitized local draft for the human to review and share with two outside judges from different model families (see [pairing-other-llms.md](pairing-other-llms.md)):

1. Same brief to both: rubric, pack, artifacts, judge prompt.
2. Independent sessions; neither sees the other.
3. Levels without valid evidence ids are dropped.
4. Lower level wins on a gap of one; a gap of two or more goes to a person.
5. Ship bar for a template or a release: our computed grade at or above the bar **and** the lower judge at or above the bar. One optimistic score is not enough.

## Before and after proof

Every polish change carries proof:

| Before | After |
|---|---|
| Pack id and build sha | New pack id and build sha |
| Line levels and findings | Line levels and findings |
| The capture (clip, trace, screenshot) that shows the problem | The same capture after the change, same settings |

Rules:

- Same device profile, same seed or scenario, same capture settings before and after.
- A forced high resolution screenshot is not a performance test. Software rendering does not stand in for a real device.
- Label each delta with its cause: behavior change, better evidence, scope change, rubric migration, corrected audit error. Only behavior change counts as polish.

## Regression gates

- **Line gate:** a line that passed may not drop below level 3 without a written reason.
- **Template gate:** the verdict may not go from PASS to BLOCKED on a candidate build.
- **Rerun after severe fixes:** the known bad build, the candidate build and nearby areas.
- **Negative fixtures:** every automated gate has a case that must fail. Run them in CI (`node tests/lens-negative-fixtures.mjs`). A gate that cannot fail is removed.

## The recursive improvement loop

```
measure ──> grade ──> pick two lowest measured lines ──> brief ──> fix on a branch
   ^                                                                     │
   └──────── regrade + regression gate <── before/after proof <──────────┘
```

1. **Measure:** Collect a valid pack from CI or a manual capture. Playtest and Performance (template 02) is a preview if you want a first pass on journeys and frame time. It is not required.
2. **Grade:** each adopted template grades it. Lead with verdict, grade, coverage.
3. **Pick:** the two lowest measured lines across templates, weighted by player impact. U lines become capture tasks, not fixes.
4. **Brief:** Grok Bot writes the brief with done criteria.
5. **Fix:** a coding agent or a person, on a branch.
6. **Prove:** before and after captures.
7. **Gate:** regrade; no passing line drops.
8. **Learn:** if the same kind of defect returns, encode the lesson in the template: a new negative fixture, a clearer anchor, or a getting-started question. That is how the templates themselves get better.

Stop polishing a template when it holds the bar at full coverage for two builds in a row, and move effort to the next lowest area.

## Where rubrics sit in the pipeline

| Stage | Rubrics that matter most |
|---|---|
| Prototype | Game Feel, Sprite and Hitbox (2D) or Prop and Rig (3D) |
| First playtest | Manual or CI capture, Bug Desk, HUD |
| Production | Economy, Props and Rigs, Environment, server fairness for networked games |
| Polish | HUD, Audio, Access, Input and Localization, Game Feel again |
| Ship | Presskit, Trailer, Live Service Trust |
| Live | Bug Desk daily, Economy per patch, Streamer and Patch Notes per patch |
