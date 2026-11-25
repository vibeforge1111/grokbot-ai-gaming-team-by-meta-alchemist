// Runs each template's own extra test suites (rewritten and preview templates ship more than the contract
// and fixture tests). Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { templateDirs } from "../scripts/lib/team.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const dir of templateDirs(ROOT)) {
  const tests = path.join(dir, "tests");
  const files = fs.existsSync(path.join(tests, "run-all.mjs")) ? ["run-all.mjs"]
    : fs.readdirSync(tests).filter((f) => f.endsWith(".test.mjs")).sort();
  for (const f of files) {
    test(`${path.relative(ROOT, dir)}: tests/${f}`, () => {
      const r = spawnSync(process.execPath, [f.endsWith(".test.mjs") ? "--test" : "", `tests/${f}`].filter(Boolean), { cwd: dir, encoding: "utf8" });
      assert.equal(r.status, 0, (r.stdout + r.stderr).slice(-2000));
    });
  }
}
