#!/usr/bin/env node
// Negative and missing-input fixtures for the lens engine. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Usage: node tests/lens-negative-fixtures.mjs [--line <lineId>]
import fs from "node:fs";
import { LENS } from "../engine/lens.mjs";
import { runFixtures } from "../engine/lens-kit.mjs";
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--line" || !args[1].trim() || args[1].startsWith("-"))) {
  console.error("usage: node tests/lens-negative-fixtures.mjs [--line <lineId>]");
  process.exit(2);
}
const line = args[1] ?? null;
const good = JSON.parse(fs.readFileSync(new URL("../fixtures/good-pack.json", import.meta.url), "utf8"));
const r = runFixtures(LENS, good, { line });
console.log(JSON.stringify({ status: r.status, template: LENS.rubric.id, line, cases: r.cases, fails: r.fails }));
process.exit(r.status === "PASS" ? 0 : 1);
