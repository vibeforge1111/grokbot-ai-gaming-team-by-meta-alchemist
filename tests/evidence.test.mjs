// Synthetic regression cases for installed skill examples and evidence intake. Created by @meta_alchemist.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { grade } from "../shared/lens-kit/lens-kit.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
function template(number) {
  return path.join(root, "templates", fs.readdirSync(path.join(root, "templates")).find(name => name.startsWith(number + "-")));
}
function skillExample(number, prefix, name) {
  const skills = path.join(template(number), "skills");
  const slug = fs.readdirSync(skills).find(s => s.startsWith(prefix));
  const markdown = fs.readFileSync(path.join(skills, slug, "SKILL.md"), "utf8");
  const sample = [...markdown.matchAll(/```js\n([\s\S]*?)\n```/g)].find(match => match[1].includes("function " + name + "("));
  assert.ok(sample, name);
  return vm.runInNewContext(sample[1] + "\n" + name);
}
test("installed audio bus maintains its cap, cleans up and unlocks only on request", () => {
  const created = [];
  const context = {
    state: "suspended",
    resume() { this.state = "running"; },
    createBufferSource() {
      const source = { connect() {}, start() {}, stop() { this.stopped = true; }, disconnect() { this.disconnected = true; } };
      created.push(source);
      return source;
    },
    createGain: () => ({ gain: {}, connect() {}, disconnect() {} })
  };
  const bus = skillExample("13", "sound-effect-bus", "createVoiceBus")(context, {}, 2);
  assert.equal(bus.play({}, 1), false);
  bus.unlock();
  for (let i = 0; i < 3; i++) assert.equal(bus.play({}, 1), true);
  assert.equal(bus.active, 2);
  assert.ok(created[0].stopped && created[0].disconnected);
  created[1].onended();
  assert.equal(bus.active, 1);
  bus.stop();
  bus.stop();
  assert.equal(bus.active, 0);
  assert.ok(created[2].stopped && created[2].disconnected);
});
test("interrupted synthetic stem ramp starts at the prior gain angle on the scheduled beat", () => {
  const schedule = skillExample("13", "adaptive", "scheduleFade");
  const first = schedule(0.1, 0, 0.5, 4, 0, Math.PI / 2);
  assert.equal(first.start, 0.5);
  const next = schedule(0.8, 0, 0.5, 2, first.angleAt(1), 0);
  assert.equal(next.start, 1);
  assert.equal(next.angleAt(1), first.angleAt(1));
  assert.equal(next.angleAt(2), 0);
  // In-phase unit-amplitude stems exceed unity at the midpoint of an equal-power fade.
  const angle = first.angleAt(1.5);
  assert.ok(Math.cos(angle) + Math.sin(angle) > 1);
});
test("unnamed surface samples, a curb crossing and an incomplete footprint have distinct outcomes", () => {
  const assess = skillExample("11", "placement-and-support", "assessFootprint");
  const cells = [{ cell: 0, material: "floor", gap: 0 }, { cell: 1, material: "floor", gap: 0 }];
  assert.equal(assess(cells, 2, ["floor"], 0.1).status, "PASS");
  cells[1].material = "curb";
  assert.equal(assess(cells, 2, ["floor"], 0.1).rejected[0].cell, 1);
  assert.equal(assess(cells.slice(1), 2, ["floor"], 0.1).status, "NOT_RUN");
});
test("presentation switches require explicit opt-in and entry movement respects reduced motion", () => {
  const effect = skillExample("01", "ship-juice", "effectEnabled");
  for (const value of [undefined, false, "true", 1]) {
    assert.equal(effect(true, value), false);
    assert.equal(effect(value, true), false);
  }
  assert.equal(effect(true, true), true);
  for (const number of ["03", "11"]) {
    const motion = skillExample(number, "entry-scene", "entranceMotion");
    assert.equal(motion(true, true, false), true);
    for (const value of [undefined, false, "on"]) assert.equal(motion(true, value, false), false);
    assert.equal(motion(true, true, true), false);
  }
});
test("HUD event recap handles a zero amount, absent direction, skipped events and disabled settings", () => {
  const recap = skillExample("09", "event-cues", "recapState");
  assert.equal(recap(true, { type: "score", amount: 0 }).amount, 0);
  assert.equal(recap(true, { type: "fail", amount: 1 }).direction, null);
  assert.equal(recap(true, { type: "hit", amount: 3, direction: 90 }).direction, 90);
  assert.equal(recap(true, undefined), null);
  assert.equal(recap(true, { type: "hit", amount: -1 }), null);
  assert.equal(recap(false, { type: "hit", amount: 1 }), null);
});
test("one confirmed receipt-level safety failure survives a skipped sibling or case", async () => {
  for (const [number, name, field, value] of [["20", "partnerFeeds", "delayMs", 0], ["22", "transactionOutcomes", "lostPaid", 1]]) {
    const dir = template(number);
    const { LENS } = await import(path.join(dir, "engine/lens.mjs"));
    const pack = JSON.parse(fs.readFileSync(path.join(dir, "fixtures/good-pack.json")));
    const row = pack.receipts[name][0];
    row[field] = value;
    delete row[Object.keys(row).find(k => k === "feed" || k === "before")];
    pack.receipts[name].pop();
    const record = grade(LENS, pack);
    assert.equal(record.verdict, "BLOCKED");
    assert.equal(record.grade, 0);
    assert.ok(record.blocking.some(b => b.id.endsWith("/" + field)));
  }
});
test("normal grading CLI verifies the producer receipt, local artifacts and profile on synthetic test bytes", () => {
  const dir = template("13");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evidence-"));
  const hash = value => crypto.createHash("sha256").update(value).digest("hex");
  const sort = obj => Array.isArray(obj) ? obj.map(sort) : obj && typeof obj === "object" ?
    Object.fromEntries(Object.keys(obj).sort().map(key => [key, sort(obj[key])])) : obj;
  const digest = value => hash(JSON.stringify(sort(value)));
  try {
    const pack = JSON.parse(fs.readFileSync(path.join(dir, "fixtures/good-pack.json")));
    pack.synthetic = false;
    const bytes = "synthetic test capture bytes";
    fs.writeFileSync(path.join(tmp, "sample"), bytes);
    for (const a of pack.artifacts) Object.assign(a, { path: "sample", sha256: hash(bytes) });
    const run = () => {
      fs.writeFileSync(path.join(tmp, "pack.json"), JSON.stringify(pack));
      const result = spawnSync(process.execPath, [path.join(dir, "engine/lens.mjs"), path.join(tmp, "pack.json")], { encoding: "utf8" });
      return JSON.parse(result.stdout);
    };
    assert.equal(run().verdict, "INVALID");
    pack.producerReceipt = { schema: "game-evidence-v1", profileId: "sample-profile-v1", producer: "test-harness",
      packId: pack.packId, liveSha: pack.liveSha, gitSha: pack.gitSha, device: "test-device", hook: "sample-event",
      gameplayArtifact: pack.artifacts[0].id, artifactsSha256: digest(pack.artifacts), profileSha256: digest(pack.profile),
      observationsSha256: digest([pack.metrics, pack.receipts, {}, {}, 0]) };
    assert.equal(run().verdict, "PASS");
    pack.profile.voiceCap++;
    assert.equal(run().verdict, "INVALID");
    pack.profile.voiceCap--;
    pack.receipts.voiceStress[0].stolen++;
    assert.equal(run().verdict, "INVALID");
    pack.receipts.voiceStress[0].stolen--;
    fs.writeFileSync(path.join(tmp, "sample"), "changed synthetic bytes");
    assert.equal(run().verdict, "INVALID");
    fs.unlinkSync(path.join(tmp, "sample"));
    assert.equal(run().verdict, "INVALID");
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});


test("verified empty tracker export and skipped intake both earn U with distinct reasons", async () => {
  const dir = template("18");
  const { LENS } = await import(path.join(dir, "engine/lens.mjs"));
  const pack = JSON.parse(fs.readFileSync(path.join(dir, "fixtures/good-pack.json")));
  pack.metrics.repro.highPriority = [];
  pack.profile.cases.intakeReplay = [];
  pack.receipts.intakeReplay = [];
  pack.populations.intakeReplay.count = 0;
  const result = () => grade(LENS, pack).lines.find(line => line.id === "reproducibility:1");
  assert.equal(result().level, "U");
  assert.match(result().reason, /verified empty intake/);
  delete pack.populations.intakeReplay;
  assert.equal(result().level, "U");
  assert.match(result().reason, /needs the reviewed intake export/);
});
