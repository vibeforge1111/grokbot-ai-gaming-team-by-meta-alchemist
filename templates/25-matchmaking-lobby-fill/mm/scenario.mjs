#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Synthetic five-region, two-day sample of anonymous seat events with planted personal rows. Prints a VALID pack, or the
// report with --report. With a file argument it reads your own de-identified input instead (see HOW-TO-USE.md).
// The two input groups are neutral sample codes (input-a, input-b); set your own codes in the profile.
import fs from "node:fs";
import { checkSchema, aggregate, regionSummary, propose, report, packMetrics, probeAuthority } from "./fill.mjs";
export const PROFILE = { minHumansPerHour: 4, pingCapMs: 120, maxBotShare: 0.6, maxWaitS: 45, maxWaitP90S: 90, primaryInput: "input-a", comparisonInput: "input-b", maxInputWaitGapS: 15, inputQueueMinShare: 0.6, minRegionHours: 24, minProbeAttempts: 12 };
export const RTT = { west: { east: 38, central: 118, south: 210, north: 185 }, east: { west: 38, central: 88, south: 230, north: 220 }, central: { west: 118, east: 88, south: 165, north: 290 }, south: { west: 210, east: 230, central: 165, north: 95 }, north: { west: 185, east: 220, central: 290, south: 95 } };
let seed = 7; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const seat = (n) => "sub_" + n.toString(16).padStart(32, "0");
export function build() {
  const rate = { west: 12, east: 8, central: 5, south: 2, north: 1.5 }, primaryShare = { west: 0.3, east: 0.25, central: 0.35, south: 0.75, north: 0.5 };
  const ev = []; let id = 1;
  for (const [region, r] of Object.entries(rate)) for (let hour = 0; hour < 48; hour++) {
    const n = Math.max(0, Math.round(r + (rnd() - 0.5) * r));
    for (let i = 0; i < n; i++) { const dev = rnd() < primaryShare[region] ? "input-a" : "input-b"; ev.push({ seat: seat(id++), bot: false, region, hour, device: dev, waitS: Math.round((dev === "input-a" ? 14 : 8) + rnd() * (60 / r) * 4) }); }
    const bots = Math.max(0, 8 - n); for (let i = 0; i < bots; i++) ev.push({ seat: seat(900000 + id++), bot: true, region, hour, device: "unknown" });
  }
  const planted = [{ seat: seat(1), bot: false, region: "west", hour: 1, handle: "redacted" }, { seat: "player-42", bot: false, region: "east", hour: 2 }, { seat: seat(3), bot: false, region: "central", hour: 3, wallet: "masked" }, { seat: seat(4), region: "south", hour: 4 }];
  return { events: [...ev, ...planted], planted: planted.length };
}
export function run(input) {
  const {events, planted = 0, profile = PROFILE, rtt = RTT, config} = input ?? {...build(), config:{botLabelShown:true,botsCountedInPlayerCount:false}};
  if (input && (!input.profile || !input.rtt || !Array.isArray(input.regions))) throw new Error("Supply the region codes, directional RTT and thresholds");
  const {rows, rejected} = checkSchema(events,input?.regions);
  const summary = regionSummary(aggregate(rows,profile)), plan = propose(summary,rtt,profile), rep = report(summary,plan,profile);
  const probe = probeAuthority(fs.readFileSync(new URL("./fill.mjs", import.meta.url), "utf8"));
  const metrics = packMetrics({ rows, rejected, plan, summary, rtt, P: profile, config, outputs: [rep, JSON.stringify(plan)], probe: { forbiddenAttempted: probe.forbiddenAttempted, forbiddenSucceeded: probe.forbiddenSucceeded, liveChanges: probe.liveChanges }, planted });
  const pack = { packId: input ? input.packId : "synthetic-lobby-fill-001", status:"VALID", synthetic:input ? input.synthetic === true : true, gitSha:input ? input.gitSha : "synthetic",liveSha:input ? input.liveSha : "synthetic",profile,
    artifacts: [{ id: "seat-events", kind: "trace" }, { id: "rtt-matrix", kind: "trace" }, { id: "lobby-config", kind: "static" }, { id: "authority-probe", kind: "trace" }, { id: "privacy-probe", kind: "trace" }, { id: "proposal-report", kind: "static" }], metrics };
  return { pack, rep, plan, summary, rejected };
}
if (import.meta.url === `file://${process.argv[1]}`) { const file = process.argv.slice(2).find(a => !a.startsWith("--")); const r = run(file ? JSON.parse(fs.readFileSync(file,"utf8")) : undefined); console.log(process.argv.includes("--report") ? r.rep : JSON.stringify(r.pack, null, 1)); }
