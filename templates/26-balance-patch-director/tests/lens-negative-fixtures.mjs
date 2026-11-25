#!/usr/bin/env node
// Negative and missing-input fixtures for the lens engine. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Usage: node tests/lens-negative-fixtures.mjs [--line <lineId>]
import fs from "node:fs";
import { LENS } from "../engine/lens.mjs";
import { runFixtures } from "../engine/lens-kit.mjs";
const args = process.argv.slice(2), known = [...Object.keys(LENS.lines), ...Object.keys(LENS.checks || {})];
const usage = (why) => { console.error(`${why}\nusage: node tests/lens-negative-fixtures.mjs [--line <lineId>]\nline ids: ${known.join(", ")}`); process.exit(2); };
if (args.length && (args.length !== 2 || args[0] !== "--line" || !args[1].trim() || args[1].startsWith("-"))) usage("expected no arguments or --line <lineId>");
const line = args[1] ?? null;
if (line !== null && !known.includes(line)) usage(`unknown line id: ${line}`);
const good = JSON.parse(fs.readFileSync(new URL("../fixtures/good-pack.json", import.meta.url), "utf8"));
const r = runFixtures(LENS, good, { line });
console.log(JSON.stringify({ status: r.status, template: LENS.rubric.id, line, cases: r.cases, fails: r.fails }));
process.exit(r.status === "PASS" ? 0 : 1);
