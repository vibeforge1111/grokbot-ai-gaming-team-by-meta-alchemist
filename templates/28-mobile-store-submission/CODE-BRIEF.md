# Mobile App Store Submission: adapter brief

Created by @meta_alchemist (https://x.com/meta_alchemist).

What this file is for: hand it to a coding agent that will write a local adapter, a small script that turns your own exports into input for this template. It states the target and the rules only; the input format is in HOW-TO-USE.md (Local input and review output) and the field list comes from `node engine/lens.mjs --meta`.

- Target: a `checks.json` for `node mobile/run.mjs checks.json`, for any engine or storefront.
- One row per required check and build: `{ group, id, build, source, passed }`, where `source` points at sanitized evidence (a file and line, a screenshot id) and `build` equals the pack's liveSha.
- Never include signing material, keystore passwords or account credentials; record only whether they are held by the owner.
- Record build identity (packId, gitSha, liveSha), source references and observed populations. Print only redacted evidence or review drafts.
- Verify the adapter with a measured fixture, a failing fixture and an empty capture. The empty capture must grade U, never a pass.
- Preview gap: the vendored lens kit 1.1.0 has no producer receipt or artifact digests. Keep the exported files beside the pack so a later engine can hash them.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
