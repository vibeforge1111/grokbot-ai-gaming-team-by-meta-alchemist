// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { LENS } from "../engine/lens.mjs";
import { grade } from "../engine/lens-kit.mjs";
const pack = name => JSON.parse(readFileSync(new URL("../fixtures/" + name, import.meta.url)));
const line = (p, id) => grade(LENS, p).lines.find(row => row.id === id).level;

test("two independent game profiles reproduce different closed-window replay shares", () => {
  const puzzle = grade(LENS, pack("good-pack.json")), rhythm = grade(LENS, pack("rhythm-pack.json"));
  assert.notEqual(puzzle.liveSha, rhythm.liveSha);
  assert.equal(puzzle.grade, 100);
  assert.equal(rhythm.verdict, "PASS");
  assert.equal(rhythm.grade, 97.5);
  assert.equal(rhythm.coverage, 1);
  assert.equal(rhythm.lines.at(-1).level, 3);
});

test("unclosed windows, another cohort and missing timestamps are unmeasured", () => {
  const p = pack("rhythm-pack.json");
  p.metrics.return.samples[0].windowClosed = false;
  assert.equal(line(p, "replay:2"), "U");
  p.metrics.return.samples[0].windowClosed = true;
  p.metrics.return.samples[0].cohort = "different cohort";
  assert.equal(line(p, "replay:2"), "U");
  delete p.metrics.action.samples[0].actionS;
  assert.equal(line(p, "opening:2"), "U");
  p.metrics.action.samples[0].actionS = 0;
  assert.equal(line(p, "opening:2"), "U");
});
