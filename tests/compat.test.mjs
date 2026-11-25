// compat-check: OK, WARN and BREAK, including a deliberate BREAK fixture. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { compatReport } from "../scripts/lib/team.mjs";
import { satisfies, compare, validRange } from "../scripts/lib/semver.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BREAK = path.join(ROOT, "tests", "fixtures", "compat-break");
const cli = (root) => spawnSync(process.execPath, [path.join(ROOT, "scripts", "compat-check.mjs"), "--root", root], { encoding: "utf8" });

test("semver ranges", () => {
  assert.ok(satisfies("1.4.2", "^1.0.0"));
  assert.ok(!satisfies("2.0.0", "^1.0.0"));
  assert.ok(!satisfies("1.1.0", "^1.2.0"));
  assert.ok(satisfies("1.2.9", "~1.2.0") && !satisfies("1.3.0", "~1.2.0"));
  assert.ok(satisfies("0.2.5", "^0.2.0") && !satisfies("0.3.0", "^0.2.0"));
  assert.ok(satisfies("9.9.9", "*") && satisfies("1.0.0", ">=1.0.0") && satisfies("1.0.0", "1.0.0"));
  assert.ok(compare("1.0.0-rc.1", "1.0.0") < 0 && compare("1.10.0", "1.9.0") > 0);
  assert.ok(!validRange("one") && validRange("^1.0.0"));
});

test("the deliberate BREAK fixture reports BREAK with a reason and a fix, and exits 1", () => {
  const r = compatReport(BREAK);
  const broken = r.pairs.find((p) => p.producer === "90-widget-maker" && p.consumer === "91-widget-reader");
  const fine = r.pairs.find((p) => p.producer === "90-widget-maker" && p.consumer === "92-widget-viewer");
  assert.equal(broken.status, "BREAK");
  assert.match(broken.artifacts[0].reason, /writes widget-list 2\.0\.0; 91-widget-reader accepts \^1\.0\.0/);
  assert.match(broken.artifacts[0].fix, /compat\.consumes\.widget-list/);
  assert.equal(fine.status, "OK");
  const run = cli(BREAK);
  assert.equal(run.status, 1);
  assert.match(run.stdout, /^BREAK 90-widget-maker 2\.0\.0 -> 91-widget-reader 1\.0\.0/m);
  assert.match(run.stdout, /1 OK, 0 WARN, 1 BREAK -> BREAK/);
});

function fixtureKit(templates, schemas) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "compat-"));
  for (const [id, v] of Object.entries(schemas)) {
    fs.mkdirSync(path.join(dir, "spec", "artifacts"), { recursive: true });
    fs.writeFileSync(path.join(dir, "spec", "artifacts", `${id}.schema.json`), JSON.stringify({ "x-version": v }));
  }
  for (const t of templates) {
    fs.mkdirSync(path.join(dir, "templates", t.slug), { recursive: true });
    fs.writeFileSync(path.join(dir, "templates", t.slug, "template.json"), JSON.stringify({ teamSpec: "1.0.0", status: "shipping", memory: { reads: [], writes: [] }, ...t }));
  }
  return dir;
}
const maker = (over = {}) => ({ id: "fix-80-maker", slug: "80-maker", version: "1.1.0", compat: { teamSpec: "^1.0.0", consumes: {} }, consumes: [],
  produces: [{ artifact: "thing", version: "1.1.0", format: "JSON", schema: "spec/artifacts/thing.schema.json" }], ...over });
const reader = (range, over = {}) => ({ id: "fix-81-reader", slug: "81-reader", version: "1.0.0", produces: [],
  compat: { teamSpec: "^1.0.0", consumes: { thing: range } }, consumes: [{ artifact: "thing", required: false, schema: "spec/artifacts/thing.schema.json" }], ...over });

test("WARN: the consumer wants a newer minor version than the producer writes", () => {
  const r = compatReport(fixtureKit([maker(), reader("^1.2.0")], { thing: "1.2.0" }));
  assert.equal(r.pairs[0].status, "WARN");
  assert.match(r.pairs[0].artifacts[0].reason, /lacks newer optional fields/);
});

test("WARN: the producer is a preview template", () => {
  const r = compatReport(fixtureKit([maker({ status: "preview" }), reader("^1.0.0")], { thing: "1.1.0" }));
  assert.equal(r.pairs[0].status, "WARN");
  assert.match(r.pairs[0].artifacts[0].reason, /preview/);
});

test("BREAK: missing schema, producer ahead of its schema, team spec major mismatch, no range", () => {
  assert.equal(compatReport(fixtureKit([maker(), reader("^1.0.0")], {})).pairs[0].status, "BREAK");
  assert.match(compatReport(fixtureKit([maker(), reader("^1.0.0")], { thing: "1.0.0" })).pairs[0].artifacts[0].reason, /schema is at 1\.0\.0/);
  assert.match(compatReport(fixtureKit([maker({ teamSpec: "2.0.0" }), reader("^1.0.0")], { thing: "1.1.0" })).pairs[0].artifacts[0].reason, /team spec/);
  assert.match(compatReport(fixtureKit([maker(), reader(undefined)], { thing: "1.1.0" })).pairs[0].artifacts[0].reason, /without a version range/);
});

test("the kit itself has no BREAK", () => {
  const r = compatReport(ROOT);
  const broken = r.pairs.filter((p) => p.status === "BREAK");
  assert.deepEqual(broken, []);
  assert.ok(r.pairs.length >= 10, `only ${r.pairs.length} exchanging pairs`);
  const run = cli(ROOT);
  assert.equal(run.status, 0, run.stdout);
});

test("artifact files are checked against their schema", async () => {
  const { checkArtifact } = await import("../scripts/check-artifact.mjs");
  const good = { artifact: "feel-findings", version: "1.0.0", producer: { id: "gbf-01-game-feel", version: "1.0.0" }, createdAt: "2030-01-01T10:00:00Z", synthetic: true,
    items: [{ action: "jump", device: "gamepad", finding: "Landing cue is one frame late", packId: "pk-1" }] };
  assert.deepEqual(checkArtifact(good), []);
  assert.ok(checkArtifact({ ...good, items: [{ action: "jump" }] }).some((p) => p.includes("missing device")));
  assert.ok(checkArtifact({ ...good, version: "2.0.0" }).some((p) => p.includes("not covered")));
  assert.ok(checkArtifact({ ...good, artifact: "no-such-thing" }).some((p) => p.includes("no schema")));
  assert.ok(checkArtifact({ ...good, createdAt: "2030-01-01T10:00:00+04:00" }).some((p) => p.includes("UTC")));
});
