# Starter

Created by @meta_alchemist (https://x.com/meta_alchemist).

`00-starter-template/` is a complete, small template that passes the validator: a first session rubric with ten computed lines, a getting-started skill, one evidence skill, a weekly routine and a synthetic worked example. Fork the repo, copy this folder or scaffold a fresh one:

```bash
npm run new -- --id myteam-01-first-session --name "First Session Director"
# edit RUBRIC.json, engine/lens.spec.json, skills/, profile.json, memory.json, routines.json, fixtures/good-pack.json
npm run build-recipe -- templates/01-first-session
npm run validate
npm run scrub
```

`build-recipe` writes the hash, `RUBRIC.md`, `engine/lens.mjs`, the `-lens-engine` skill and `recipe.json` for you, so the folder always agrees with itself.

A new template starts as a preview at version 0.1.0 with its own `CHANGELOG.md`. Fill in what it produces and consumes in `template.json`, run `npm run team` and `npm run compat`, and move it to `shipping` at 1.0.0 once it meets the release standard ([../docs/VERSIONING.md](../docs/VERSIONING.md)).
