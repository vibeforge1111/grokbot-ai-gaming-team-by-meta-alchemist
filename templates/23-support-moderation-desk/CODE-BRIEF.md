# Community Support and Moderation Desk: adapter brief

Created by @meta_alchemist (https://x.com/meta_alchemist).

What this file is for: hand it to a coding agent that will write a local adapter, a small script that turns your own exports into input for this template. It states the target and the rules only; the input format is in HOW-TO-USE.md (Local input and review output) and the field list comes from `node engine/lens.mjs --meta`.

- Target: an evidence pack for this template. No bundled tool writes one, so the adapter is the pack producer. `fixtures/good-pack.json` shows the shape.
- Sources: your help desk or ticket export (cases, drafts and draft turnaround), your knowledge base file with the reviewer's approved revisions, the agent's tool inventory and an owner-approved red-team case file.
- Count people and messages; never copy message bodies, names, handles, emails or account ids into the pack.
- Record build identity (packId, gitSha, liveSha), source references and observed populations. Print only redacted evidence or review drafts.
- Verify the adapter with a measured fixture, a failing fixture and an empty capture. The empty capture must grade U, never a pass.
- Packs are written with `engine/write-pack.mjs` (lens-kit 1.3.1 receipts). Grade a pack from its folder so artifact bytes and the producer receipt are checked.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.
