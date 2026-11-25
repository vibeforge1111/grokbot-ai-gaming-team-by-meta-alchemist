// Scaffolding a new template produces a folder that validates. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("npm run new output passes the validator", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "template-scaffold-"));
  const dir = path.join(tmp, "23-onboarding-flow");
  try {
    let r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "new-template.mjs"), "--id", "acme-23-onboarding-flow", "--name", "Onboarding Flow Director", "--dir", dir], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "validate.mjs"), dir], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
