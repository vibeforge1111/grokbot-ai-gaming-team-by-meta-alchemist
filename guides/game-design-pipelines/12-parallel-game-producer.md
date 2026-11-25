# Parallel Game Producer and Pitch Architect in your pipeline

Created by @meta_alchemist (https://x.com/meta_alchemist).

Plan parallel work against actual capacity, reconcile ticket rows and turn verified project evidence into a local pitch deck draft.

The short name is Producer (12). It sits above the other templates: it reads their grade records as gates, reconciles the bug ledger, plans the next milestone in waves and drafts the pitch for the go or hold decision. It works for a solo developer or a team, in any genre, engine or platform.

Template folder: [templates/12-parallel-game-producer](../../templates/12-parallel-game-producer/). Install and prompts: [HOW-TO-USE.md](../../templates/12-parallel-game-producer/HOW-TO-USE.md), [PROMPTS.md](../../templates/12-parallel-game-producer/PROMPTS.md).

## When to use it

- **Stage:** Milestone planning and pitch review, at every step of the backbone pipeline.
- **Trigger:** At each milestone cut, before a go or hold decision, and before a pitch review.

## Inputs and outputs

- **Inputs:** One project file with an owner-approved ledger export, the task graph, time and capacity estimates, gate receipts, approved pitch facts and a reviewed local deck; your game profile (`game-profile`).
- **Outputs:** A local wave plan, dependency exceptions, a ledger rollup and a go or hold recommendation (`work-plan`), a slide-by-slide pitch draft in Markdown (`pitch-draft`), and a 100-point grade (`grade-record`).

## Handoffs

- **Takes from:** A read-only tracker export (`tracker-export`) and ticket drafts from Bug Desk (18); grade records (`grade-record`) from any other template, used as gates; P0 ticket drafts from Bug Desk (18), Streamer and Patch Notes (20), Access, Input and Localization (21) and Live Service Trust (22); the owner's approved pitch facts.
- **Hands to:** The owner: the work plan (`work-plan`, which Streamer and Patch Notes (20) can also read) and the Markdown pitch draft (`pitch-draft`). After human review, approved claims can feed Store Page and Presskit Director (19) and Trailer Director (10). Its own grade record.
- **Findings:** one local ticket draft per finding for the human to review and file. Bug Desk (18) prepares the draft.
- **Exchange folder:** `.grokbot-team/artifacts/<artifact-id>/` in your game project. Other templates' grade records live in `.grokbot-team/artifacts/grade-record/`. Nothing is sent anywhere.

## Recommended process

1. **Set up once:** run `parallel-game-producer-getting-started`; answer its questions one at a time (the milestone, audience and ask, the roles and their hours, the locks, the required gates, the approved facts and the bands); write the answers into your project file.
2. **milestone-scope:** one task per deliverable with a role, a done condition, a named proof and hours; deferrable work goes under an explicit cut.
3. **parallel-handoffs:** run `node engine/plan.mjs <project.json> --plan` for the waves; record what actually ran; hold any handoff with a stale, expired, failed or missing predecessor receipt.
4. **ledger-reconciliation:** derive backlog counts from ticket rows (mapping Bug Desk fields where needed) and check each closure for a source fix, a verification by a different role on this build and its config state.
5. **decision-gates:** read each required gate, including other templates' grade records (PASS on this build only), and draft owned risk rows.
6. **evidence-pitch:** one slide per required topic from approved facts only; render with `--deck`; get a review on the current digest.
7. **Grade:** `node engine/plan.mjs <project.json> --pack > <pack.json>`, then `node engine/lens.mjs <pack.json>` from the template folder. Lead with go or hold, verdict, grade and coverage.
8. **Polish loop:** fix one resource clash or one unsupported slide, keep task and claim keys stable, regrade, keep passing lines at level 3 or above.

## Examples by genre (illustrative)

- **Mobile puzzle game:** milestone "first 30 levels playable"; gates are the Game Loop Alchemist (05) and HUD Designer (09) grade records; a level designer and a UI artist share no lock, so their tasks run in one wave.
- **2D platformer:** milestone "world 1 vertical slice"; the Game Feel (01) record is CONDITIONAL, so that gate stays unmeasured and the decision holds until the missing capture is in.
- **Turn-based strategy game:** the brief says two P2 bugs are open but the export has three; the ledger line shows the mismatch before the pitch claims "no known issues".
- **Racing game:** two tasks need the only console devkit, so they share the lock `devkit` and go in separate waves.
- **Narrative adventure:** the voice session waits for a passing script receipt on this build; the pitch's ask slide is a proposal to fund chapter two.
- **Solo developer, farming sim:** roles `code` and `art` with real weekly hours; the plan shows the art role over its hours in wave two.

## Rubric pillars

- **Milestone** (20): Milestone work has acceptance evidence (each task's named proof matches a current run receipt); Role load fits wave capacity
- **Workstreams** (20): Predecessor receipts precede handoff; Parallel tasks respect exclusive locks (both carry release blockers)
- **Ledger** (20): Backlog counts reconcile to ticket rows; Closure has independent live verification
- **Release decision** (20): Required discipline gates pass (a failed gate blocks); Risks have owned decision paths
- **Pitch** (20): Pitch claims trace to approved facts; Deck covers the reviewed decision

See [README.md](README.md) for end to end pipelines that combine templates.
