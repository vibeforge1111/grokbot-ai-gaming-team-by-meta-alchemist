// Not-applicable rubric profiles: the weight rule, combining profiles, and blockers that stop applying.
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ruleWeights, profileWeights } from "../shared/lens-kit/lens-kit.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = async (slug) => {
  const dir = path.join(ROOT, "templates", slug);
  const { LENS } = await import(pathToFileURL(path.join(dir, "engine", "lens.mjs")).href);
  const kit = await import(pathToFileURL(path.join(dir, "engine", "lens-kit.mjs")).href);
  return { LENS, kit, good: JSON.parse(fs.readFileSync(path.join(dir, "fixtures", "good-pack.json"), "utf8")) };
};
const withProfile = (pack, rubricProfile) => ({ ...pack, profile: { ...pack.profile, rubricProfile } });
const R = { pillars: [{ name: "A" }, { name: "B" }, { name: "C" }],
  lines: [["a1", "A", 10], ["a2", "A", 10], ["b1", "B", 10], ["b2", "B", 10], ["c1", "C", 30], ["c2", "C", 30]].map(([id, pillar, weight]) => ({ id, pillar, weight })) };

test("the rule: a partner takes its pillar, a whole missing pillar is shared out by weight", () => {
  assert.deepEqual(ruleWeights(R, new Set(["a2"])), { a1: 20, a2: 0, b1: 10, b2: 10, c1: 30, c2: 30 });
  const w = ruleWeights(R, new Set(["a1", "a2"]));
  assert.equal(w.a1 + w.a2, 0);
  assert.ok(Math.abs(w.b1 - 12.5) < 1e-9 && Math.abs(w.c1 - 37.5) < 1e-9);
  assert.ok(Math.abs(Object.values(w).reduce((x, y) => x + y, 0) - 100) < 1e-9);
  assert.equal(ruleWeights(R, new Set(R.lines.map((l) => l.id))), null);
});

test("profiles combine, and unknown or empty combinations are refused", async () => {
  const { LENS, kit, good } = await load("01-game-feel");
  const combo = ["no-aiming", "no-hazards", "offline-only"];
  const r = kit.grade(LENS, withProfile(good, combo));
  assert.equal(r.verdict, "PASS");
  assert.equal(r.coverage, 1);
  for (const id of ["control-intent:2", "camera-comfort:1", "parity:1"]) assert.equal(r.lines.find((l) => l.id === id).level, "NA");
  assert.match(r.lines.find((l) => l.id === "parity:1").reason, /no-aiming, no-hazards, offline-only/);
  assert.equal(kit.grade(LENS, withProfile(good, ["no-aiming", "no-such-profile"])).verdict, "INVALID");
  assert.ok(profileWeights(LENS.rubric, combo).weights);
});

test("a release blocker on a line a profile marks not applicable stops blocking; others still block", async () => {
  const { LENS, kit, good } = await load("22-live-service-trust");
  const paidLoss = LENS.rubric.releaseBlockers.find((b) => b.id === "paid-loss");
  const lost = kit.applyCase(good, { set: paidLoss.fixture });
  assert.equal(kit.grade(LENS, lost).verdict, "BLOCKED");
  const noStore = kit.grade(LENS, withProfile(lost, "no-store"));
  assert.notEqual(noStore.verdict, "BLOCKED");
  assert.ok(!noStore.blocking.some((b) => b.id === "paid-loss"));
  const replay = LENS.rubric.releaseBlockers.find((b) => b.id === "accepted-replay");
  assert.equal(kit.grade(LENS, withProfile(kit.applyCase(good, { set: replay.fixture }), "no-store")).verdict, "BLOCKED");
});

test("a profile can switch off named blockers that sit outside the rubric lines", async () => {
  const { LENS, kit, good } = await load("20-streamer-hype");
  const delay = LENS.rubric.releaseBlockers.find((b) => b.id === "stream-delay");
  const late = kit.applyCase(good, { set: delay.fixture });
  assert.equal(kit.grade(LENS, late).verdict, "BLOCKED");
  assert.notEqual(kit.grade(LENS, withProfile(late, "no-spectator-mode")).verdict, "BLOCKED");
  assert.equal(kit.grade(LENS, withProfile(late, "no-share-links")).verdict, "BLOCKED");
});
