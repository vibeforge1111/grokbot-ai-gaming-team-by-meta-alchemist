# Contributing

Created by @meta_alchemist (https://x.com/meta_alchemist).

1. Fork, branch, change.
2. Run `npm run check` (validator, scrub, links, team map, compat check and tests). CI runs the same on Node 18, 20 and 22.
3. Changing a rubric line, weight or anchor is a new rubric version with a `migration` note. Never edit thresholds to raise a grade.
4. Bump the template's `version` and add a `CHANGELOG.md` entry for every change ([docs/VERSIONING.md](docs/VERSIONING.md)). A breaking change (a removed or renamed skill, a changed output, a new required input) is a new major version; the tests reject anything less. If you change what a template produces or consumes, run `npm run team` and `npm run compat`.
5. Every new automated gate needs a negative fixture that fails.
6. Keep the credit line. Add yours beside it if you changed a template.
7. No secrets, private hostnames, ids, personal handles or launch dates. No em or en dashes.
