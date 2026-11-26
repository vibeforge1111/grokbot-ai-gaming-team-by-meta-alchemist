#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Silent hours inside a declared window count as zero, not as missing, so averages are not inflated.
import assert from "node:assert/strict";
import { padWindow, regionSummary } from "../mm/fill.mjs";

const cells = [
  { region: "east", hour: 1, humans: 10, bots: 2, botShare: 2 / 12, primary: 10, waits: [4], primaryWaits: [4], comparisonWaits: [] },
  { region: "east", hour: 3, humans: 10, bots: 2, botShare: 2 / 12, primary: 10, waits: [4], primaryWaits: [4], comparisonWaits: [] },
];
const padded = padWindow(cells, { windowStartHour: 0, windowEndHour: 5 });
assert.equal(padded.length, 6);
assert.deepEqual(padded.map((c) => c.hour), [0, 1, 2, 3, 4, 5]);
assert.equal(padded[0].humans, 0);
assert.equal(padded[2].humans, 0);
assert.equal(padded[4].humans, 0);
assert.equal(padded[5].humans, 0);
assert.equal(padded[1].humans, 10);
assert.equal(padded[3].humans, 10);
const summary = regionSummary(padded);
assert.equal(summary.length, 1);
assert.ok(Math.abs(summary[0].humansPerHour - 20 / 6) < 1e-9, "silent hours must pull the average down");
assert.equal(padWindow([], { windowStartHour: 0, windowEndHour: 5 }).length, 0);
console.log(JSON.stringify({ status: "PASS", paddedHours: padded.length, humansPerHour: summary[0].humansPerHour }));
