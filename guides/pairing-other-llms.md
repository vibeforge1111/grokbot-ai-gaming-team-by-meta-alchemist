# Pairing Grok Bot with the LLM tools you already use

Created by @meta_alchemist (https://x.com/meta_alchemist).

Most teams already have a coding agent: Claude Code, Codex, Cursor or Gemini CLI. Keep it. Grok Bot is the producer that remembers the project, runs routines, prepares local drafts for your review and keeps score. The coding agents are the hands that change the repo. The templates work in both, because skills are plain `SKILL.md` files.

## Division of labor

| Job | Who does it best | Why |
|---|---|---|
| Owner onboarding, memory, project facts | Grok Bot | It keeps memory across weeks and asks one question at a time |
| Routines (weekly grades, daily triage, feedback sweeps) | Grok Bot | Routines are built in; reports stay in the local draft folder |
| Research, drafts of posts, patch notes, store copy | Grok Bot | It drafts; you approve and publish |
| Writing and refactoring code on a branch | Claude Code, Codex, Cursor | They live in the repo with your tests and tooling |
| Large multi file changes, long refactors | Claude Code or Codex | Long running sessions on your machine |
| Interactive editing while you watch | Cursor | You see every diff in the editor |
| Fast second opinion, long context reading | Gemini CLI | Cheap broad reads of logs or big files |
| Outside judging of a rubric | Two of the above, from different model families | Independent reads catch each other's blind spots |

## The handoff: briefs and branches

Work moves between tools as **files**, not chat history.

1. **Brief.** Grok Bot writes a brief: goal, the rubric lines to move, the evidence pack id, constraints, done criteria, and what not to touch. Save it in the repo, for example `briefs/hud-contrast.md`.
2. **Branch.** The coding agent works on its own branch with a clear prefix (for example `agent/hud-contrast`). Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
3. **Proof.** The agent saves before and after evidence with the local draft: the old pack, the new pack, and the grade delta per line.
4. **Review.** Grok Bot regrades the new pack, checks the delta matches the claim, and reports to you in plain English.

A brief template:

```markdown
# Brief: <short title>
Template and rubric: gbf-09-hud-ui-designer v1.2.0
Pack: <packId> on build <gitSha>
Goal: move readable-combat-states:1 from level 2 to level 3 or better
Do: <the smallest change>
Do not: change thresholds, touch payments, push to main, deploy
Done when: a new VALID pack grades readable-combat-states:1 at 3+, no passing line drops
Return: branch name, new pack path, grade delta per line
```

## Installing skills in each tool

| Tool | Skills | Project instructions |
|---|---|---|
| Claude Code | `.claude/skills/<name>/SKILL.md` | `CLAUDE.md` |
| Codex | the skills folder your setup reads, or link from `AGENTS.md` | `AGENTS.md` |
| Cursor | `.cursor/skills/<name>/SKILL.md` | `.cursor/rules/` or `AGENTS.md` |
| Gemini CLI | link from `GEMINI.md` or paste as context | `GEMINI.md` |

Copy the template's `engine/` and `fixtures/` folders too, so any agent can run `node engine/lens.mjs pack.json` and get the same grade Grok Bot gets.

## External judges for rubrics

The engine computes what can be measured. For judged lines and release checks, run two outside judges:

1. Grok Bot prepares one sanitized local judge brief per template: `RUBRIC.json`, the pack, its artifacts, and the judge prompt from `PROMPTS.md` section 5.
2. The human reviews the draft and runs it in two tools from different model families, for example Claude Code and Codex, each in a fresh session with no access to the other's answer.
3. Each returns JSON per judged line: `lineId`, `level`, `judge`, `evidenceIds`, `note`. Comments on computed lines leave the engine level intact.
4. Grok Bot merges: drop any level whose evidence ids are not in the pack; take the lower level when judges differ by one; flag a gap of two or more in your local review draft.
5. Record the judge, the model and the rubric version beside every judged level.

Rules that keep judges honest:

- Judges see evidence, not the team's hopes. Do not paste the previous grade into the brief.
- Judges never change thresholds or rubric text.
- A judge grade and a computed grade from different rubric versions are never averaged.
- A judge that cannot cite evidence returns U.

## When to use which

- **Small fix, you want to watch:** Cursor.
- **A day long task with tests:** Claude Code or Codex in a session you can watch live (see [bridging-pc-mac.md](bridging-pc-mac.md)).
- **Read a huge log or a whole folder for patterns:** Gemini CLI.
- **Decide, remember, schedule, report:** Grok Bot.
