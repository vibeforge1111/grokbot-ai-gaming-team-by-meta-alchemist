// Every template's own engine tests pass, and each worked example grades. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { rubricHash } from "../scripts/lib/hash.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const templates = fs.readdirSync(path.join(ROOT, "templates"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const starters = fs.readdirSync(path.join(ROOT, "starter"))
  .filter((name) => fs.existsSync(path.join(ROOT, "starter", name, "template.json")))
  .sort();
const dirs = [
  ...templates.map((name) => path.join(ROOT, "templates", name)),
  ...starters.map((name) => path.join(ROOT, "starter", name)),
];

test("release contains exactly the 23 shipping and 7 preview template IDs and the starter", () => {
  const shipping = ["01", "03", "05", "06", "09", "10", "11", "12", "13", "14", "15", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
  const preview = ["02", "04", "07", "08", "16", "29", "30"];
  const byStatus = { shipping: [], preview: [] };
  for (const name of templates) {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "templates", name, "template.json"), "utf8"));
    assert.equal(manifest.slug, name);
    const id = name.split("-")[0];
    assert.equal(manifest.id.split("-")[1], id);
    byStatus[manifest.status].push(id);
  }
  assert.deepEqual(byStatus.shipping, shipping);
  assert.deepEqual(byStatus.preview, preview);
  assert.deepEqual(starters, ["00-starter-template"]);
  const starter = JSON.parse(fs.readFileSync(path.join(ROOT, "starter", starters[0], "template.json"), "utf8"));
  assert.equal(starter.slug, starters[0]);
  assert.equal(starter.id.split("-")[1], "00");
});

for (const d of dirs) {
  const name = path.relative(ROOT, d);
  test(`${name}: contract test, negative fixtures, worked example, hash`, () => {
    for (const t of ["tests/test-lens-contract.mjs", "tests/lens-negative-fixtures.mjs"]) {
      const r = spawnSync(process.execPath, [t], { cwd: d, encoding: "utf8" });
      assert.equal(r.status, 0, `${t}: ${r.stdout}${r.stderr}`);
      assert.equal(JSON.parse(r.stdout.trim().split("\n").pop()).status, "PASS");
    }
    const g = spawnSync(process.execPath, ["engine/lens.mjs", "fixtures/good-pack.json"], { cwd: d, encoding: "utf8" });
    const rec = JSON.parse(g.stdout);
    assert.equal(rec.verdict, "PASS");
    assert.equal(rec.coverage, 1);
    assert.ok(rec.grade >= 90, `worked example grade ${rec.grade}`);
    const rub = JSON.parse(fs.readFileSync(path.join(d, "RUBRIC.json"), "utf8"));
    assert.equal(rubricHash(rub), rub.hash);
  });
}

const emptyCases = {
  "00": ["time-to-fun:1", "firstAction.measuredCases", 0],
  "01": ["readable-feedback:2", "readyCue.emitCounts", []],
  "03": ["collider-agreement:1", "colliders.iou", []],
  "06": ["progression:2", "storage.pathACounts", []],
  "09": ["operability:1", "focus.hudActions", 0],
  "10": ["authentic-gameplay:1", "shots.total", 0],
  "11": ["camera-occlusion:1", "occlusionProbe.probesRun", 0],
  "13": ["voice-and-lifecycle:1", "captions.spokenLines", 0],
  "15": ["server-authority:1", "authority.impossibleActions", 0],
  "17": ["icons:2", "atlas.combosChecked", 0],
  "18": ["closure-quality:1", "closure.closures", []],
  "19": ["media:2", "storeArtFormats.formatsChecked", 0],
  "20": ["creator-controls:2", "links.links", []],
  "21": ["captions-and-assistive-info:1", "captions.requiredCues", 0],
  "22": ["transactions-and-entitlements:2", "restore.expected", 0],
};

// Templates added after the table use the first generated empty-sample case from their own fixtures.
function derivedEmptyCase(d) {
  const { cases } = JSON.parse(fs.readFileSync(path.join(d, "fixtures/mutations.json"), "utf8"));
  const c = cases.find((x) => x.expect === "U" && /#empty-/.test(x.id) && Object.keys(x.set || {}).length === 1 && Object.keys(x.set)[0].startsWith("metrics."));
  assert.ok(c, `${path.basename(d)} has no generated empty-sample case`);
  const [key, value] = Object.entries(c.set)[0];
  return [c.line, key.slice("metrics.".length), value];
}

for (const d of dirs) {
  const slug = path.basename(d);
  test(`${slug}: empty evidence earns zero points`, async () => {
    const { LENS } = await import(path.join(d, "engine/lens.mjs"));
    const { grade, setPath } = await import(path.join(d, "engine/lens-kit.mjs"));
    const good = JSON.parse(fs.readFileSync(path.join(d, "fixtures/good-pack.json")));
    const [line, field, empty] = emptyCases[slug.slice(0, 2)] ?? derivedEmptyCase(d);
    const before = grade(LENS, good);
    assert.equal(before.verdict, "PASS");
    setPath(good.metrics, field, empty);
    const after = grade(LENS, good);
    assert.equal(after.lines.find(l => l.id === line).level, "U");
    assert.ok(after.supportedPoints <= before.supportedPoints - LENS.rubric.lines.find(l => l.id === line).weight);
    assert.ok(after.coverage < 1);
    assert.equal(after.verdict, "CONDITIONAL");
    assert.ok(!after.tickets.some(t => t.lineId === line));
  });
}

test("portable fixture CLIs reject missing and unknown selectors", () => {
  for (const d of dirs) for (const args of [["--line"], ["--line", ""], ["--line", "absent"], ["absent"]]) {
    const r = spawnSync(process.execPath, ["tests/lens-negative-fixtures.mjs", ...args], { cwd: d, encoding: "utf8" });
    assert.ok(r.status > 0, `${d} accepted ${JSON.stringify(args)}`);
  }
});

test("a measured release blocker survives missing sibling evidence", async () => {
  for (const [num, field, value, sibling] of [
    ["20", "spectatorLinks.respectsDelay", false, "spectatorLinks.openedIntendedView"],
    ["21", "flash.maxFlashesPerSecond", 8, "flash.holdToggleAlternatives"],
    ["22", "tx.lostPaid", 1, "tx.duplicatedPaid"],
  ]) {
    const d = dirs.find(d => path.basename(d).startsWith(num));
    const { LENS } = await import(path.join(d, "engine/lens.mjs"));
    const { grade, setPath } = await import(path.join(d, "engine/lens-kit.mjs"));
    const pack = JSON.parse(fs.readFileSync(path.join(d, "fixtures/good-pack.json")));
    setPath(pack.metrics, field, value);
    setPath(pack.metrics, sibling, "__DELETE__");
    const result = grade(LENS, pack);
    assert.equal(result.verdict, "BLOCKED");
    assert.equal(result.grade, 0);
    assert.ok(result.supportedPoints >= 80);
    setPath(pack.metrics, field, "__DELETE__");
    assert.equal(grade(LENS, pack).verdict, "CONDITIONAL");
  }
});

test("CLI metadata names the required inputs and unreadable pack files return INVALID", () => {
  for (const d of dirs) {
    const result = spawnSync(process.execPath, ["engine/lens.mjs", "--meta"], { cwd: d, encoding: "utf8" });
    assert.equal(result.status, 0);
    for (const line of Object.values(JSON.parse(result.stdout).lines)) {
      assert.equal(line.weight, 10);
      if (line.kind === "computed") assert.ok(line.fields.length > 0);
    }
  }
  const d = dirs[0];
  for (const input of ["no-such-pack.json", "README.md"]) {
    const result = spawnSync(process.execPath, ["engine/lens.mjs", input], { cwd: d, encoding: "utf8" });
    assert.ok(result.status > 0);
    const record = JSON.parse(result.stdout);
    assert.equal(record.verdict, "INVALID");
    assert.equal(record.grade, null);
  }
});

test("HUD contrast requires capture evidence and the localization guard distinguishes level 3 from 4", async () => {
  for (const [num, id, expected] of [["09", "readable-combat-states:1", "U"], ["21", "localization-readiness:1", 3]]) {
    const d = dirs.find(dir => path.basename(dir).startsWith(num));
    const { LENS } = await import(path.join(d, "engine/lens.mjs"));
    const { grade } = await import(path.join(d, "engine/lens-kit.mjs"));
    const pack = JSON.parse(fs.readFileSync(path.join(d, "fixtures/good-pack.json")));
    if (num === "09") pack.artifacts.find(a => a.id === pack.metrics.contrast.artifact).kind = "trace";
    else pack.metrics.strings.newHardcodedStringRejected = false;
    assert.equal(grade(LENS, pack).lines.find(line => line.id === id).level, expected);
  }
});
