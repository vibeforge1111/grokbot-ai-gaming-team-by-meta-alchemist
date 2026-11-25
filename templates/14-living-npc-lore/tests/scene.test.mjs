// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { LENS } from "../engine/lens.mjs";
import { grade } from "../engine/lens-kit.mjs";
const fresh = () => JSON.parse(readFileSync(new URL("../fixtures/good-pack.json", import.meta.url)));
const line = (p, id) => grade(LENS, p).lines.find(row => row.id === id).level;

test("two distinct run locators and the approved seed are required", () => {
  const p = fresh();
  const row = p.metrics.replay.samples[0];
  row.firstRef = row.secondRef;
  assert.equal(line(p, "review:1"), "U");
  row.firstRef = "independent reset";
  row.seed = "different seed";
  assert.equal(line(p, "review:1"), "U");
});

test("an unrelated scene or absent panel cannot support a held-out readback", () => {
  for (const patch of [{reviewRole:""}, {reason:""}, {turnRef:""}, {channel:"different channel"}, {scenario:"known case"}]) {
    const p = fresh();
    Object.assign(p.metrics.heldout.samples[0], patch);
    assert.equal(line(p, "review:2"), "U");
    assert.equal(line(p, "review:1"), 4);
  }
  const p = fresh();
  p.profile.canonRevision = "unapproved revision";
  assert.equal(grade(LENS, p).coverage, 0);
});
