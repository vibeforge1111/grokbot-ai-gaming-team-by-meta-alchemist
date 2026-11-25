# Versions and compatibility

Created by @meta_alchemist (https://x.com/meta_alchemist).

Four things carry versions. They move independently, so a wording fix never forces a rubric change and a rubric change never hides inside a typo fix.

| What | Where | Bumped when |
|---|---|---|
| Template | `version` in `template.json`, newest entry in the template's `CHANGELOG.md` | anything in the template changes (see the table below) |
| Team spec | `teamSpec` in `template.json` | the shared rules change: the artifact folder layout, the memory format, the meaning of produces and consumes |
| Artifact | `x-version` in `spec/artifacts/<artifact>.schema.json`, `version` in a producer's `produces` entry | the file a template hands to another changes shape |
| Rubric | `version` and `hash` in `RUBRIC.json` | a line, weight or anchor changes ([RUBRIC_GUIDE.md](RUBRIC_GUIDE.md)) |

All four follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). A preview template starts at `0.x`; while it is `0.x`, a breaking change bumps the minor number.

## Template versions

| Change | Bump |
|---|---|
| Wording, examples, a clearer onboarding question | patch |
| A new skill, routine or optional input; a new optional field in an output | minor |
| A rubric change (new rubric version) | minor, or major when old grades can no longer be compared |
| A removed or renamed skill, a removed output, a changed output shape, a new required input, a new major artifact version | major |

Each template keeps a `CHANGELOG.md` in the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format, newest first, starting with `## [Unreleased]`. Sections are `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` and `Security`, plus `Breaking` for anything that breaks a user or another template. A release with a `Breaking` or `Removed` section, or a bullet starting with `BREAKING`, must be a new major version. `npm test` enforces this, and the newest released version must equal `version` in `template.json`.

## The compat field

```json
"version": "1.0.0",
"teamSpec": "1.0.0",
"compat": {
  "teamSpec": "^1.0.0",
  "consumes": { "feel-findings": "^1.0.0", "evidence-pack": "^1.0.0" }
}
```

`compat.consumes` gives the artifact versions a template can read. Ranges are `^1.2.0` (same major, at least 1.2.0), `~1.2.0` (same minor), `1.2.0` (exact), `>=1.2.0` or `*`.

## compat-check

```bash
npm run compat            # every pair of templates that exchanges artifacts
npm run compat -- --json  # the same report as JSON
```

For each producer and consumer pair it prints one of:

- **OK**: the producer writes a version the consumer accepts.
- **WARN**: it works, with a caveat. The consumer asks for a newer minor version than the producer writes (the newer optional fields will be missing), the producer is a preview template, or the two templates sit on different team spec minor versions.
- **BREAK**: it will not work. The producer writes a different major version than the consumer accepts, a schema is missing, the producer claims a version its schema does not have, or the team spec major versions differ.

Every line comes with the reason and the fix. The command exits 1 on any BREAK, so CI fails before a broken pair ships. `tests/compat.test.mjs` runs it on the kit (no BREAK allowed) and on a deliberate BREAK fixture in `tests/fixtures/compat-break/`.

## Changing an artifact

1. Additive change (a new optional field): bump the schema's `x-version` minor, bump the producer's `produces[].version` and the producer's template minor version. Consumers keep working.
2. Breaking change (a field renamed, removed or retyped): bump the schema's major version, the producer's `produces[].version` and the producer's template major version with a `Breaking` changelog entry. `npm run compat` then shows BREAK for every consumer until each one is updated, given a new `compat.consumes` range and its own new major version.
