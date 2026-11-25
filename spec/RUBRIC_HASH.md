# Rubric hash

Created by @meta_alchemist (https://x.com/meta_alchemist).

Rubrics are frozen by version and hash. The hash lets anyone confirm that a grade was produced against exactly this rubric.

**Algorithm:** take `RUBRIC.json`, drop the top level `hash` field, serialize as canonical JSON (object keys sorted at every level, no whitespace, UTF-8, numbers and strings as `JSON.stringify` writes them), and hash with SHA-256. Write it as `sha256:<64 hex chars>`.

Reference implementation: [`scripts/lib/hash.mjs`](../scripts/lib/hash.mjs).

```js
import { rubricHash } from "./scripts/lib/hash.mjs";
rubricHash(JSON.parse(fs.readFileSync("RUBRIC.json", "utf8"))); // "sha256:..."
```

The same hash appears in `RUBRIC.json`, `RUBRIC.md`, `template.json` and `LENS.rubric.hash` inside `engine/lens.mjs`. The validator fails if any of them disagree or the hash does not recompute.

Version 1.1.1 introduced the general game profile. The 14 catalog rubrics now use version 1.1.5. Each rubric records its scoring and evidence changes in its migration note. Compare builds using the same version and hash.
