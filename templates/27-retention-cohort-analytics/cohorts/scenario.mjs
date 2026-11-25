#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Synthetic 70 days of anonymous sessions (2,400 players, two neutral segments) with planted personal rows.
// Prints a VALID pack, or the report with --report. With a file argument it reads your own input (see HOW-TO-USE.md).
import fs from "node:fs";
import { checkSchema, cohorts, pooled, bySegment, oracle, report, packMetrics, probeAuthority } from "./cohorts.mjs";
export const PROFILE = { minCellSize: 20, allowedSegments: ["segment-a","segment-b"], minCohorts: 4, minPlayers: 500, minDays: 35, targetD1: 0.3, targetD7: 0.12, targetD30: 0.05, minProbeAttempts: 12 };
const S = (n) => "sub_" + n.toString(16).padStart(32, "0"); // synthetic salted subject ids
let seed = 11; const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export function build() {
  const ev = [], today = 70;
  for (let i = 1; i <= 2400; i++) {
    const id = S(i), first = Math.floor(rnd() * 66), seg = rnd() < 0.4 ? "segment-a" : "segment-b", keep = seg === "segment-a" ? 0.9 : 1.1;
    ev.push({ player: id, day: first, segment: seg });
    for (let d = 1; first + d < today; d++) if (rnd() < keep * (d === 1 ? 0.36 : 0.09 + 0.25 / d)) ev.push({ player: id, day: first + d, segment: seg });
  }
  const planted = [{ player: S(1), day: 3, handle: "invalid reference" }, { player: "raw-key", day: 4 }, { player: S(2), day: 5, wallet: "masked" }, { player: S(3), day: new Date(0).toISOString() }, { player: S(4), day: 6, country: "fixture" }];
  return { events: [...ev, ...planted], planted: planted.length, today };
}
export function run(input) {
  const { events, planted = 0, today } = input || build();
  const profile = input ? input.profile : PROFILE;
  if (!profile || !Number.isSafeInteger(profile.minCellSize) || profile.minCellSize < 1) throw new Error("Specify a positive suppression floor"); const { rows, rejected } = checkSchema(events,profile.allowedSegments);
  const cs = cohorts(rows, today), pool = pooled(cs), segs = bySegment(rows, today), orc = oracle(rows, today), rep = report(cs, pool, segs, profile);
  const probe = probeAuthority(fs.readFileSync(new URL("./cohorts.mjs", import.meta.url), "utf8"));
  const metrics = packMetrics({ rows, rejected, planted, cs, pool, segs, orc, rep, P: profile, probe, today });
  return { rows, rejected, cs, pool, segs, orc, rep, probe, metrics };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const f = process.argv.slice(2).find(a => !a.startsWith("--"));
  const input = f ? JSON.parse(fs.readFileSync(f,"utf8")) : undefined;
  const r = run(input);
  const pack = { packId: input ? input.packId : "synthetic-cohorts-001",status:"VALID",synthetic:input ? input.synthetic === true : true,gitSha:input ? input.gitSha : "synthetic",liveSha:input ? input.liveSha : "synthetic",profile:input ? input.profile : PROFILE,
    artifacts: [{ id: "events", kind: "trace" }, { id: "schema-check", kind: "trace" }, { id: "cohort-table", kind: "trace" }, { id: "interval-table", kind: "static" }, { id: "report", kind: "trace" }, { id: "probe", kind: "trace" }], metrics: r.metrics };
  console.log(process.argv.includes("--report") ? r.rep : JSON.stringify(pack, null, 1));
}
