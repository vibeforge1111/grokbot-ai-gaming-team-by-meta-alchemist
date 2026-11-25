// The Pixel Pantry example grades reproduce, and the story holds. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { grade } from "../shared/lens-kit/lens-kit.mjs";
import { LENS as hud } from "../templates/09-hud-designer/engine/lens.mjs";

const EX = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "examples", "pixel-pantry");

test("saved packs reproduce from the evidence and saved grades reproduce from the packs", () => {
  for (const script of ["make-packs.mjs", "run.mjs"]) {
    const r = spawnSync(process.execPath, [script, "--check"], { cwd: EX, encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
  }
});

test("both templates improve on the expected lines without a regression", () => {
  const read = (name) => JSON.parse(fs.readFileSync(path.join(EX, "grades", name), "utf8"));
  const summary = read("SUMMARY.json");
  const cases = [
    { slug: "09-hud-designer", before: 90, findings: ["readable-combat-states:1=2", "operability:2=2"] },
    { slug: "18-bug-desk-triage", before: 92.5, findings: ["closure-quality:1=1"] },
  ];
  const expectedPacks = cases.flatMap(({ slug }) => ["0.3.0", "0.3.1"].map((build) => `${slug}.${build}.json`));
  assert.deepEqual(summary.map((entry) => entry.pack).sort(), expectedPacks.sort());
  for (const { slug, before, findings } of cases) {
    const first = summary.find((entry) => entry.pack === `${slug}.0.3.0.json`);
    const second = summary.find((entry) => entry.pack === `${slug}.0.3.1.json`);
    assert.equal(first.verdict, "CONDITIONAL");
    assert.equal(first.grade, before);
    assert.deepEqual(first.belowPass, findings);
    assert.equal(second.verdict, "PASS");
    assert.equal(second.grade, 100);
    assert.deepEqual(second.belowPass, []);
    assert.equal(first.coverage, 1);
    assert.equal(second.coverage, 1);
    const earlier = read(`${slug}.0.3.0.grade.json`);
    const later = read(`${slug}.0.3.1.grade.json`);
    assert.equal(earlier.rubricHash, later.rubricHash);
    for (const line of earlier.lines) {
      const after = later.lines.find((candidate) => candidate.id === line.id);
      assert.ok(after && after.level >= line.level, `${slug} ${line.id} regressed`);
    }
  }
});

test("a missing touch measurement stays unmeasured", () => {
  const pack = JSON.parse(fs.readFileSync(path.join(EX, "packs", "09-hud-designer.0.3.0.json"), "utf8"));
  delete pack.metrics.touch;
  const result = grade(hud, pack);
  const line = result.lines.find(({ id }) => id === "operability:2");
  assert.equal(line.level, "U");
  assert.deepEqual(line.findings, []);
  assert.ok(result.coverage < 1);
});
