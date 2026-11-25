// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { LENS } from "../engine/lens.mjs";
import { grade, applyCase } from "../engine/lens-kit.mjs";

const good = JSON.parse(readFileSync(new URL("../fixtures/good-pack.json", import.meta.url)));
const run = (file, args) => spawnSync(process.execPath, [file, ...args], {cwd: new URL("../", import.meta.url), encoding: "utf8"});
const fresh = () => structuredClone(good);

test("empty samples, absent rows and zero measured cases earn zero points on each line", () => {
  for (const [group, metric] of Object.entries(good.metrics)) {
    const id = good.artifacts.find(receipt => receipt.id === metric.artifact).lineId;
    for (const patch of [{samples: []}, {samples: [{}]}, {measuredCases: 0}, {status: "NOT_RUN"},
      {samples: metric.samples.map(row => ({...row, status: "NOT_RUN"}))}]) {
      const pack = fresh();
      Object.assign(pack.metrics[group], patch);
      const result = grade(LENS, pack);
      assert.equal(result.lines.find(line => line.id === id).level, "U");
      assert.equal(result.supportedPoints, 90);
      assert.equal(result.coverage, 0.9);
      assert.equal(result.verdict, "CONDITIONAL");
      assert.deepEqual(result.tickets, []);
    }
  }
  const empty = grade(LENS, {...good, metrics: {}});
  assert.equal(empty.grade, 0);
  assert.equal(empty.coverage, 0);
  assert.equal(empty.verdict, "CONDITIONAL");
});

test("build, scope, line and artifact kind must match", () => {
  for (const field of ["gitSha", "liveSha", "scope", "lineId", "kind", "id"]) {
    const pack = fresh();
    pack.artifacts[0][field] = "unrelated";
    assert.equal(grade(LENS, pack).lines[0].level, "U");
  }
  for (const field of ["gitSha", "liveSha", "packId"]) {
    const result = grade(LENS, {...good, [field]: ""});
    assert.equal(result.verdict, "INVALID");
    assert.equal(result.grade, null);
  }
});

test("measured blockers and open P0s zero the grade while preserving supported points", () => {
  for (const rule of LENS.rubric.releaseBlockers) {
    const pack = applyCase(good, {set: rule.fixture});
    delete pack.profile.bands;
    const result = grade(LENS, pack);
    assert.equal(result.verdict, "BLOCKED");
    assert.equal(result.grade, 0);
    assert.ok(result.blocking.some(hit => hit.id === rule.id));
  }
  const result = grade(LENS, {...good, openP0: 1});
  assert.equal(result.verdict, "BLOCKED");
  assert.ok(result.blocking.some(rule => rule.id === "open-p0"));
  assert.equal(result.supportedPoints, 100);
  assert.equal(result.grade, 0);
});

test("fixture selectors execute known names and reject unknown or malformed names", () => {
  const fixture = LENS.rubric.releaseBlockers[0].id;
  const known = run("tests/lens-negative-fixtures.mjs", ["--case", fixture]);
  assert.equal(known.status, 0, known.stderr);
  assert.equal(JSON.parse(known.stdout).cases, 1);
  for (const args of [["--case", "unknown"], ["--line", "unknown"], ["--line"], ["--case", ""], ["unknown"]]) {
    assert.ok(run("tests/lens-negative-fixtures.mjs", args).status > 0);
  }
  assert.ok(run("engine/lens.mjs", ["--fixtures", "fixtures/good-pack.json", "unknown"]).status > 0);
});

test("profile bands govern every graded level and malformed bands are refused", () => {
  const pack = fresh();
  const bad = grade(LENS, {...pack, profile: {...pack.profile, bands: {floor: 1, pass: 0.8, target: 0.9}}});
  assert.equal(bad.verdict, "INVALID");
  const [id, spec] = Object.entries(LENS.lines)[0];
  const [where, negative] = Object.entries(spec.neg[0])[0];
  const group = where.split(".")[1];
  const positive = pack.metrics[group].samples[0];
  for (const [successes, level] of [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]]) {
    pack.metrics[group].samples = Array.from({length: 4}, (_, i) => ({...(i < successes ? positive : negative[0]), caseId: "case-" + i}));
    assert.equal(grade(LENS, pack).lines.find(line => line.id === id).level, level);
  }
});

test("offline producer receipt binds profile, observations and artifact bytes", () => {
  // Exercise the real-pack intake format with test data; nothing here is a live game capture.
  // A temporary folder outside the template, removed afterwards.
  const dir = mkdtempSync(join(tmpdir(), "receipt-test-"));
  try {
    const canonical = value => {
      if (Array.isArray(value)) return value.map(canonical);
      if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
      return value;
    };
    const sha = bytes => createHash("sha256").update(bytes).digest("hex");
    const digest = value => sha(JSON.stringify(canonical(value)));
    const pack = {...fresh(), synthetic: false};
    const raw = "Integration test receipt bytes";
    writeFileSync(join(dir, "receipt.txt"), raw);
    pack.artifacts = pack.artifacts.map(a => ({...a, path: "receipt.txt", sha256: sha(raw)}));
    pack.producerReceipt = {schema: "game-evidence-v1", producer: "fixture producer", profileId: pack.profile.scope,
      device: "test harness", hook: "integration fixture", gameplayArtifact: pack.artifacts.find(a => a.kind === "trace").id,
      gitSha: pack.gitSha, liveSha: pack.liveSha, packId: pack.packId, profileSha256: digest(pack.profile),
      artifactsSha256: digest(pack.artifacts), observationsSha256: digest([pack.metrics, {}, {}, {}, 0])};
    const path = join(dir, "pack.json");
    writeFileSync(path, JSON.stringify(pack));
    const record = () => JSON.parse(run("engine/lens.mjs", [path]).stdout);
    assert.equal(record().grade, 100);
    writeFileSync(join(dir, "receipt.txt"), "changed bytes");
    assert.equal(record().verdict, "INVALID");
    writeFileSync(join(dir, "receipt.txt"), raw);
    pack.profile.scope = "changed scope";
    writeFileSync(path, JSON.stringify(pack));
    assert.equal(record().grade, null);
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});
