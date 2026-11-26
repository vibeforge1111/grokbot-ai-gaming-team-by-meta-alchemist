# Local verification

Created by @meta_alchemist (https://x.com/meta_alchemist).

The release suite covers 15 shipping templates, 8 preview templates and the starter. Run `npm run check` on Node 18 or newer to repeat everything below; the package has no external dependencies.

| Check | Command | Coverage | Last local result |
|---|---|---|---|
| Validator | `npm run validate` | Manifests (including version, status and team fields), changelogs, recipes, rubrics and their not-applicable profiles, embedded engines and memory helper, skill bodies, artifact schemas, house text rules | 24 folders, 1,875 checks, 0 failed |
| Public scrub | `npm run scrub` | Credential, identifier and disclosure patterns | 773 files, 25 rules, 0 hits |
| Links | `npm run links` | Every local Markdown link and anchor | 748 links, 0 broken |
| Team map | `npm run team:check` | TEAM-MAP.md, each template's team section and TEAM memory fact match the manifests | 0 stale files |
| Compatibility | `npm run compat` | Every pair of templates that exchanges artifacts | 107 pairs: 72 OK, 35 WARN (each from a preview producer), 0 BREAK |
| Tests | `npm test` | Release contents, engine contracts and fixtures, empty evidence, release blockers, profiles, shared memory and its lint, compat (with a deliberate BREAK fixture), team map, changelog rule, artifact check, scaffolder, scrub rules, newcomer docs, each template's own suites | 147 tests, 147 passed |
| Per-template engine tests | the loop in `.github/workflows/ci.yml` | Contract test and negative fixtures in every template folder | 24 of 24 passed |
| Catalog | `npm run catalog` | Rebuilds TEMPLATES.md and the Start here block on each template README | No drift |
| Worked example | `node examples/pixel-pantry/run.mjs --check` | Recomputes four grades for two builds | Reproduced |

The 1.0.1 release run used Node 22 on macOS. `npm run check` for the usability pass used Node 22 on Linux: validator 1,875 checks, team map clean, compatibility with no BREAK, and the scrub, link, and test counts in the table. A later newcomer pass on the same branch repeated `npm run check` (still 1,875 checks, 147 tests, 0 failed) and refreshed the link count in this table; a second `npm run catalog` made no further diff. The CI workflow runs the same checks on Node 18, 20 and 22 on Linux; a scan of the code found no API newer than Node 18.

Pixel Pantry models CI screenshot samples and manual playtest observations. The [example](examples/pixel-pantry/README.md) documents the inputs and the before-and-after grades.
