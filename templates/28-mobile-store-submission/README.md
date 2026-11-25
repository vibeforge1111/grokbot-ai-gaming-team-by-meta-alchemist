# Mobile App Store Submission

Created by @meta_alchemist (https://x.com/meta_alchemist).

**Status: preview, not shipping.** This template works and its tests pass, but it is not yet held to the kit's release standard.

Before it can ship:

- Move to the kit's shared lens engine. This template still carries its own lens kit 1.1.0, which trusts the metrics a pack declares and never checks artifact bytes or a producer receipt.
- A pack producer with receipts: `mobile/run.mjs` prints a pack but writes no artifact files, digests or producer receipt.
- A second, non-Capacitor example (a plain checks.json for another engine or storefront) beside the optional Capacitor adapter.
- Earn points from the game: submission:1 probes this template's own code, not the release pipeline.

Review target-specific evidence and draft a store readiness checklist for a human release owner. Start with [HOW-TO-USE.md](HOW-TO-USE.md).

## Domain tools

Two ways in, both through `mobile/run.mjs`:

- Any target: a normalized `checks.json` with `packId`, `gitSha`, `liveSha`, `profile.requirements` (required check ids per group) and `checks` rows of `{ group, id, build, source, passed }`. `mobile/review.mjs` binds each required check to one observation on the same build; a missing, stale or duplicate row stays UNMEASURED.
- The optional Capacitor adapter (`mobile/check.mjs`): point `run.mjs` at a folder with the app's store config files (capacitor.config.ts, AndroidManifest.xml, app-build.gradle, variables.gradle, Info.plist, PrivacyInfo.xcprivacy, project.pbxproj), `answers.json` (the owner's answers), `tree.json` (the repo's file list) and `profile.json` (SDK targets and allowed permissions). `mobile/fixture` is the synthetic example.

```sh
node mobile/run.mjs checks.json --report
node mobile/run.mjs <adapter-folder> --report --pack-id <id> --git-sha <sha> --live-sha <sha>
node mobile/run.mjs <adapter-folder> --findings
```

For example, a console catalog can require a controller screenshot and a web storefront a browser compatibility capture: list them as check ids in `profile.requirements`. Fixture thresholds are illustrative.

## Evidence and grading

A grade describes the evidence supplied by the pack writer. For each group provide a cited artifact and the positive count or nonempty sample listed in `node engine/lens.mjs --meta`. Treat measured zero defects separately from zero cases examined. Missing build identity invalidates the pack. The worked example is synthetic.

| Rubric line | Observations |
|---|---|
| build-config:1 | config.complete, config.failures |
| build-config:2 | hard.complete, hard.failures |
| privacy:1 | perm.complete, perm.failures |
| privacy:2 | privacy.complete, privacy.failures |
| store-policy:1 | billing.complete, billing.failures |
| store-policy:2 | accounts.complete, accounts.failures |
| signing:1 | secrets.complete, secrets.failures |
| signing:2 | signing.complete, signing.failures |
| submission:1 | authority.forbiddenAttempted, authority.forbiddenSucceeded, authority.toolCalls |
| submission:2 | listing.complete, listing.failures |

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
