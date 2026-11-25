#!/usr/bin/env node
// Compatibility check for every pair of templates that exchanges artifacts.
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Prints OK, WARN or BREAK per pair with the reason and the fix. Exit 1 on any BREAK (and on WARN with --strict).
// Usage: node scripts/compat-check.mjs [--json] [--strict] [--root <kit-or-fixture-dir>]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compatReport } from "./lib/team.mjs";

const args = process.argv.slice(2);
const rootIdx = args.indexOf("--root");
const ROOT = path.resolve(rootIdx >= 0 ? args[rootIdx + 1] : path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const report = compatReport(ROOT);

if (args.includes("--json")) console.log(JSON.stringify(report, null, 1));
else {
  for (const p of report.pairs) {
    console.log(`${p.status.padEnd(5)} ${p.producer} ${p.producerVersion} -> ${p.consumer} ${p.consumerVersion}`);
    for (const a of p.artifacts) {
      console.log(`        ${a.artifact}: ${a.status === "OK" ? "" : a.status + ": "}${a.reason}`);
      if (a.fix) console.log(`        fix: ${a.fix}`);
    }
  }
  for (const u of report.unproduced) console.log(`NOTE  ${u.consumer} reads ${u.artifact}, which no template in this folder produces; it runs with its missing-artifact assumption.`);
  const c = report.counts;
  console.log(`\ncompat-check: ${report.pairs.length} pair(s), ${c.OK} OK, ${c.WARN} WARN, ${c.BREAK} BREAK -> ${c.BREAK ? "BREAK" : c.WARN ? "WARN" : "OK"}`);
}
process.exit(report.counts.BREAK || (args.includes("--strict") && report.counts.WARN) ? 1 : 0);
