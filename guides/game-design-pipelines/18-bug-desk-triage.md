# Playtest Bug Desk & Repro Triage Director in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Turn playtest observations into reproducible local issue drafts, group duplicate reports and verify fixes against the affected build.

Template folder: [templates/18-bug-desk-triage](../../templates/18-bug-desk-triage/). Install and prompts: [HOW-TO-USE.md](../../templates/18-bug-desk-triage/HOW-TO-USE.md), [PROMPTS.md](../../templates/18-bug-desk-triage/PROMPTS.md).

## When to use it

- **Stage:** Playtest, Live
- **Trigger:** From the first outside playtest onward, every day.

## Inputs and outputs

- **Inputs:** Player reports, crash logs, reproduction evidence from playtests or CI, your tracker export (from any tracker: GitHub, GitLab, Jira, a spreadsheet), and local finding drafts from the other templates.
- **Outputs:** Local ticket drafts with severity and confidence, minimal repros, candidate duplicate groups and closure checks. Nothing is filed until the human files it.

## Handoffs

- **Takes from:** Manual or CI playtests, accessibility reviews and service logs where applicable. Every other template in the kit drafts its findings for Bug Desk, so one bug reported by several templates becomes one ticket.
- **Hands to:** The owner, who reviews local drafts, sets priority and updates the tracker.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.

## Recommended process

1. **Set up once:** run `bug-desk-triage-getting-started`; answer its questions about P0 scopes, the flaky run count and share links; write the answers into your game profile.
2. **Get a pack:** Use your CI run or a manual capture for this build. Playtest QA (template 02) is coming later.
3. **duplicate-report-grouping:** propose candidate duplicate groups from crash reports, error logs, player reports and other templates' findings. The human confirms every merge.
4. **minimal-repro-builder:** turn a crash, desync or report into a replay that fails on the affected build, shrink it to the smallest input, and keep flaky bugs flaky until they pass the profile's run count.
5. **severity-and-regression-bisect:** record severity and confidence separately, keep P0 to the profile's scopes, send grading mistakes to the audit fix list, and bisect to the change that caused a regression.
6. **issue-draft-and-fix-verification:** write the local issue draft for your tracker, record which build players run, and check that someone other than the fixer verified the fix on the right build.
7. **Grade:** `node engine/lens.mjs <pack.json>`. Lead with verdict, grade and coverage.
8. **Polish loop:** fix the two lowest measured lines with before and after proof, regrade, keep passing lines at level 3 or above.

## Examples by genre (illustrative)

- **2D platformer:** "the jump is broken" from three players turns out to be two bugs (a late jump after a ledge, a collision seam). Two tickets, each with a controller input trace.
- **Mobile puzzle game:** a frozen board on two phone models with one signature. One ticket, confirmed with a board state and tap sequence on each phone.
- **Turn-based strategy game:** a crash on end turn since a recent build. The save from the turn before replays it; a bisect finds the commit.
- **Racing game:** a ghost car desync seen once. Kept as flaky with low confidence until the repeated-run count is met.
- **Narrative adventure:** a forgotten choice after loading. P0 only if lost saves are a P0 scope in the profile.

## Rubric pillars

- **Reproducibility** (20): High-priority reports replay; Flaky status kept
- **Evidence completeness** (20): Captures show real play (findings about play have a capture of real play, in any kind of play session); Build lag recorded and applied (record whether the build players run is older than the source, and cap scores read from its logs when it is)
- **Correct dedup** (20): Dedup key and owner confirmation; Similarity cutoff is a candidate generator (similarity only suggests; a person merges)
- **Severity** (20): Severity vs confidence; Review mistakes kept off the game bug list (review mistakes go to an audit fix list, not the bug list)
- **Closure quality** (20): Verifier is not the fixer; Artifact mismatch blocks closure

See [README.md](README.md) for end to end pipelines that combine templates.
