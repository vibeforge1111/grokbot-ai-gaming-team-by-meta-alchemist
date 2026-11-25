# Skill format

Created by @meta_alchemist (https://x.com/meta_alchemist).

A skill is one markdown file, `skills/<name>/SKILL.md`, that teaches an agent one job. The same file works in Grok Bot, Cursor, Claude Code and Codex.

## Shape

```markdown
---
name: bug-desk-triage-getting-started
description: "Use on first run with a new owner: onboard them one question at a time, list what they provide, and run the first grade."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs`. This skill gathers evidence; it never adds points.
> - Missing evidence is UNMEASURED (0 points, not a defect). Never invent a measurement.

# Title

What the skill does, in two sentences.

## Steps
1. ...

## Output
...
```

## Rules

| Rule | Why |
|---|---|
| `name` is lowercase words joined by hyphens and equals the folder name | Agents load skills by name; a mismatch silently breaks loading |
| `description` starts with "Use when..." or "Use on..." and says when, not what | Agents pick skills from the description alone |
| One job per skill | Small skills compose; big ones get skipped or half followed |
| A contract block at the top when the skill touches grading | It overrides older or looser text below it |
| Numbers are starting points read from the game profile | A skill must not hard code one game's budgets |
| Label worked examples synthetic | Nobody mistakes an example for a measurement |
| Credit line | Keeps attribution when skills are copied around |
| Plain words, no em or en dashes | House style; the validator enforces it |

## Kinds of skill in a template

- **Getting started** (`*-getting-started`, required): onboards the owner one question at a time, lists what they provide, runs the first grade, and reports in plain English. Every template has exactly one and the recipe points `gettingStarted` at it.
- **Lens engine** (`*-lens-engine`): carries `engine/lens-kit.mjs`, `engine/lens.mjs` and `fixtures/good-pack.json` byte for byte so a bot can write them to disk.
- **Evidence skills**: each gathers evidence for one or two rubric lines (a capture, a trace, a static check) and ends with what it moved and what is still unmeasured.

## Good getting-started skills

1. Ask one question at a time. Never stack questions.
2. Ask for the game, the build, and who produces the evidence pack.
3. Walk the profile values one by one, starting from the worked example.
4. Ask the owner calls (decisions only the owner makes).
5. Ask where findings go.
6. Run the first grade on the synthetic example, then on the real pack.
7. Report: verdict, grade and coverage first; U lines as "not measured yet" with the capture that would measure them.

## Testing a skill

- `npm run validate` checks frontmatter, credit, that the file matches `recipe.json`, and the text rules.
- Give the skill to a fresh agent with only the template folder and see whether it can run the first grade without help. If it asks a question the skill should have answered, fix the skill.

The offline validator and recipe builder use Node 18+ with no external parser. Skill headers use a flat YAML mapping with plain, quoted, literal or folded string values.
