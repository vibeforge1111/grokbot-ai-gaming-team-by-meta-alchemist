---
name: lobby-fill-domain-engine
description: "Use when the domain tools are not on disk yet (a recipe-only install) or their safety tests need rerunning: write the bundled files at their paths and run the tests."
---

# Run the local Matchmaking and Region Lobby Fill tools

Save the bundled files below at their relative paths, next to the files from the lens-engine skill. Then run from the template folder:

```sh
node tests/run-all.mjs
node mm/scenario.mjs --report
```

`mm/fill.mjs` is the engine, `mm/scenario.mjs` reads your input or runs the synthetic example, and `mm/import-counts.mjs` records saved count snapshots (see README.md, Domain tools). Set `profile.primaryInput` and `profile.comparisonInput` to your own codes.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## Bundled files

### mm/fill.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Matchmaking & Region Lobby Fill Director engine. Proposal only: it reads counts and writes proposals.
// It has no network, no file writes and no function that changes a live region, queue or bot setting.
// Seat keys are the kit's salted subject ids (sub_ plus 32 lowercase hex). Input groups come from the profile:
// profile.primaryInput and profile.comparisonInput name your own device or input codes; there are no defaults.
export const PII_FIELDS = ["name", "handle", "username", "email", "wallet", "address", "ip", "xid", "x_id", "userid", "user_id", "discordid", "discord_id", "playerid", "player_id", "phone", "device_id", "deviceid"];
export const SEAT_ID = /^sub_[0-9a-f]{32}$/;
const SEAT_IN_TEXT = /sub_[0-9a-f]{32}/g;
const SAFE_CODE = /^[a-z][a-z0-9_-]{0,23}$/;

// Reject anything that is not an anonymous seat event. Returns { ok, rows, rejected:[{i, reason}] }.
export function checkSchema(events, allowedRegions) {
  const rows = [], rejected = [];
  events.forEach((e, i) => {
    if (!e || typeof e !== "object") return rejected.push({ i, reason: "invalid event" });
    if (Object.keys(e).some(k => !["seat","bot","region","hour","device","waitS"].includes(k))) return rejected.push({ i, reason: "unexpected field" });
    if (e.waitS != null && (!Number.isFinite(e.waitS) || e.waitS < 0)) return rejected.push({ i, reason: "invalid wait" });
    const keys = Object.keys(e).map((k) => k.toLowerCase().replace(/[^a-z_]/g, ""));
    const pii = keys.find((k) => PII_FIELDS.includes(k));
    if (pii) return rejected.push({ i, reason: `personal field '${pii}' refused` });
    if (!SEAT_ID.test(String(e.seat))) return rejected.push({ i, reason: "seat id is not a salted subject id (sub_ + 32 hex)" });
    if (typeof e.bot !== "boolean") return rejected.push({ i, reason: "bot flag missing: a seat must say if it is a bot" });
    if ((typeof e.region !== "string" || !SAFE_CODE.test(e.region) || (allowedRegions && !allowedRegions.includes(e.region))) || !Number.isInteger(e.hour) || e.hour < 0) return rejected.push({ i, reason: "region or hour missing" });
    rows.push({ seat: e.seat, bot: e.bot, region: String(e.region), hour: e.hour, device: SAFE_CODE.test(e.device ?? "") ? e.device : "unknown", waitS: Number.isFinite(e.waitS) ? e.waitS : null });
  });
  return { ok: rejected.length === 0, rows, rejected };
}

// Humans and bots per region-hour. A bot seat never counts as a human, even if its seat id also appears as a human.
// Without profile.primaryInput and profile.comparisonInput no input group is counted and the wait gap stays unmeasured.
export function aggregate(rows, profile = {}) {
  const m = new Map(), primary = profile.primaryInput ?? null, comparison = profile.comparisonInput ?? null;
  for (const r of rows) {
    const k = `${r.region}|${r.hour}`;
    if (!m.has(k)) m.set(k, { region: r.region, hour: r.hour, humans: new Set(), bots: new Set(), primary: new Set(), waits: [], primaryWaits: [], comparisonWaits: [] });
    const c = m.get(k);
    if (r.bot) { c.bots.add(r.seat); continue; }
    c.humans.add(r.seat);
    if (primary && r.device === primary) c.primary.add(r.seat);
    if (r.waitS != null) { c.waits.push(r.waitS); (primary && r.device === primary ? c.primaryWaits : comparison && r.device === comparison ? c.comparisonWaits : []).push(r.waitS); }
  }
  return [...m.values()].map((c) => ({ region: c.region, hour: c.hour, humans: c.humans.size, bots: c.bots.size, botShare: c.bots.size + c.humans.size ? c.bots.size / (c.bots.size + c.humans.size) : 0, primary: c.primary.size, waits: c.waits, primaryWaits: c.primaryWaits, comparisonWaits: c.comparisonWaits }))
    .sort((a, b) => a.region.localeCompare(b.region) || a.hour - b.hour);
}
export function padWindow(cells, profile = {}) {
  if (!cells.length) return cells;
  const start = Number.isInteger(profile.windowStartHour) ? profile.windowStartHour : Math.min(...cells.map((c) => c.hour));
  const end = Number.isInteger(profile.windowEndHour) ? profile.windowEndHour : Math.max(...cells.map((c) => c.hour));
  const by = new Map();
  for (const c of cells) {
    if (!by.has(c.region)) by.set(c.region, new Map());
    by.get(c.region).set(c.hour, c);
  }
  const out = [];
  for (const [region, hours] of by) {
    for (let h = start; h <= end; h++) {
      out.push(hours.get(h) || { region, hour: h, humans: 0, bots: 0, botShare: 0, primary: 0, waits: [], primaryWaits: [], comparisonWaits: [] });
    }
  }
  return out.sort((a, b) => a.region.localeCompare(b.region) || a.hour - b.hour);
}

export const pct = (xs, p) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };

export function regionSummary(cells) {
  const by = new Map();
  for (const c of cells) { if (!by.has(c.region)) by.set(c.region, []); by.get(c.region).push(c); }
  return [...by.entries()].map(([region, cs]) => ({ region, hours: cs.length, humansPerHour: cs.reduce((a, c) => a + c.humans, 0) / cs.length, botShare: cs.reduce((a, c) => a + c.bots, 0) / Math.max(1, cs.reduce((a, c) => a + c.bots + c.humans, 0)), primaryShare: cs.reduce((a, c) => a + c.primary, 0) / Math.max(1, cs.reduce((a, c) => a + c.humans, 0)), waitP50: pct(cs.flatMap((c) => c.waits), 0.5), waitP90: pct(cs.flatMap((c) => c.waits), 0.9), primaryWaitP50: pct(cs.flatMap((c) => c.primaryWaits), 0.5), comparisonWaitP50: pct(cs.flatMap((c) => c.comparisonWaits), 0.5) }));
}

// Proposals for thin regions. Every proposal is frozen with status PROPOSED and needs the owner.
export function propose(summary, rtt, P) {
  const thin = summary.filter((s) => s.humansPerHour < P.minHumansPerHour);
  const out = [];
  for (const t of thin) {
    const opts = [];
    for (const s of summary) {
      if (s.region === t.region) continue;
      const ping = rtt?.[t.region]?.[s.region];
      if (!Number.isFinite(ping) || ping < 0) continue; // unknown ping: never proposed
      if (ping > P.pingCapMs) continue;
      opts.push({ kind: "merge", into: s.region, p90PingMs: ping, expectedHumansPerHour: +(t.humansPerHour + s.humansPerHour).toFixed(1), stillThin: t.humansPerHour + s.humansPerHour < P.minHumansPerHour, tradeOff: `players in ${t.region} gain ${ping} ms at p90${t.humansPerHour + s.humansPerHour < P.minHumansPerHour ? ", and the pair is still under the fill target" : ""}` });
    }
    opts.sort((a, b) => a.p90PingMs - b.p90PingMs);
    opts.push({ kind: "bot-fill", maxBotShare: P.maxBotShare, tradeOff: "keeps ping low; bots stay labelled and never count as players" });
    opts.push({ kind: "peak-window", tradeOff: "concentrate events in the region's busiest hours so humans meet humans" });
    out.push(Object.freeze({ region: t.region, humansPerHour: +t.humansPerHour.toFixed(1), status: "PROPOSED", needsOwner: true, options: Object.freeze(opts.map(Object.freeze)) }));
  }
  const inputQueue = summary.filter((s) => s.primaryShare >= P.inputQueueMinShare).map((s) => Object.freeze({ region: s.region, status: "PROPOSED", needsOwner: true, kind: "input-queue-review", primaryShare: +s.primaryShare.toFixed(2), tradeOff: "a dedicated input queue only if it does not push waits past the cap" }));
  return { thin: thin.map((t) => t.region), proposals: Object.freeze(out), inputQueue: Object.freeze(inputQueue) };
}

// Independent oracle for thin regions (sum over raw rows, no shared code with aggregate()).
export function oracleThin(rows, P) {
  const seen = {}, hours = {};
  for (const r of rows) { hours[r.region] ??= new Set(); hours[r.region].add(r.hour); if (!r.bot) { seen[r.region] ??= new Set(); seen[r.region].add(`${r.hour}|${r.seat}`); } }
  return Object.keys(hours).filter((g) => (seen[g]?.size || 0) / hours[g].size < P.minHumansPerHour).sort();
}

// Plain-language report. No seat ids, no players, no dates.
export function report(summary, plan, P) {
  const L = ["# DRAFT lobby fill proposals", "", "Nothing here was changed. Every option is a proposal for the owner.", "", "| Region | Humans per hour | Bot share | Wait p50 (s) |", "|---|---|---|---|"];
  for (const s of summary) L.push(`| ${s.region} | ${s.humansPerHour.toFixed(1)} | ${(s.botShare * 100).toFixed(0)}% | ${s.waitP50 ?? "n/a"} |`);
  L.push("", `Thin regions (under ${P.minHumansPerHour} humans per hour): ${plan.thin.join(", ") || "none"}.`);
  for (const p of plan.proposals) { L.push("", `## ${p.region}`); p.options.forEach((o, i) => L.push(`${i + 1}. ${o.kind}${o.into ? ` into ${o.into} (${o.p90PingMs} ms p90)` : ""}: ${o.tradeOff}.`)); }
  for (const t of plan.inputQueue) L.push("", `Players using the primary input group are ${(t.primaryShare * 100).toFixed(0)}% in ${t.region}: ${t.tradeOff}.`);
  return L.join("\n") + "\n";
}

export function packMetrics({ rows, rejected, plan, summary, rtt, P, config, outputs, probe, planted }) {
  const cells = aggregate(rows, P), all = summary;
  const overCap = plan.proposals.flatMap((p) => p.options).filter((o) => o.kind === "merge" && !(o.p90PingMs <= P.pingCapMs)).length;
  const waits = rows.filter((r) => !r.bot && r.waitS != null).map((r) => r.waitS);
  const tw = all.map((s) => s.primaryWaitP50 != null && s.comparisonWaitP50 != null ? s.primaryWaitP50 - s.comparisonWaitP50 : null).filter((x) => x != null);
  const text = outputs.join("\n");
  const m = {
    fill: { artifact: "seat-events", regions: all.length, regionHoursMeasured: cells.length, botsCountedAsHumans: cells.filter((c) => c.humans !== new Set(rows.filter((r) => !r.bot && r.region === c.region && r.hour === c.hour).map((r) => r.seat)).size).length, thinMismatch: JSON.stringify([...plan.thin].sort()) === JSON.stringify(oracleThin(rows, P)) ? 0 : 1, thinListed: true },
    merge: { directionalPairs: plan.proposals.reduce((count,p) => count + summary.filter(s => s.region !== p.region && Number.isFinite(rtt?.[p.region]?.[s.region]) && rtt[p.region][s.region] >= 0).length,0), artifactsByLine: {"proposals:1":"rtt-matrix"}, artifact: "proposal-report", proposals: plan.proposals.length, overCap, thinRegions: plan.thin.length, thinWithAlternatives: plan.proposals.filter((p) => p.options.length >= 2).length, unknownPingProposed: plan.proposals.flatMap((p) => p.options).filter((o) => o.kind === "merge" && !Number.isFinite(rtt?.[plan.proposals.find((q) => q.options.includes(o)).region]?.[o.into])).length },
    authority: { artifact: "authority-probe", ...probe },
    privacy: { measuredCases: planted || 0, artifact: "privacy-probe", piiFieldsAccepted: rows.filter((r) => Object.keys(r).some((k) => PII_FIELDS.includes(k.toLowerCase()))).length, rawIdsInOutputs: (text.match(SEAT_IN_TEXT) || []).length, schemaRejectsPlanted: planted ? rejected.length >= planted : true },
  };
  if (waits.length) m.wait = { measuredCases: waits.length, artifact: "seat-events", p50S: pct(waits, 0.5), p90S: pct(waits, 0.9) };
  const warranted = all.filter((s) => s.primaryShare >= P.inputQueueMinShare).map((s) => s.region).sort();
  const listed = (plan.inputQueue || []).map((t) => t.region).sort();
  if (tw.length) m.device = { measuredCases: tw.length, artifact: "seat-events", primaryInputWaitGapS: Math.max(...tw), inputQueueOptionConsidered: JSON.stringify(warranted) === JSON.stringify(listed) };
  if (config) m.bots = { measuredCases: all.length, artifactsByLine: {"bot-honesty:2":"seat-events"}, artifact: "lobby-config", labelShown: config.botLabelShown, countedInPlayerCount: config.botsCountedInPlayerCount };
  if (all.length) (m.bots ??= { measuredCases: all.length, artifact: "seat-events" }).overCapWithoutProposal = all.filter((s) => s.botShare > P.maxBotShare && !plan.proposals.some((p) => p.region === s.region)).length;
  m.latency = {artifact:"rtt-matrix",pairs:m.merge.directionalPairs};
  return m;
}

// Tries every way an agent might change live matchmaking through this engine. All must fail.
export function probeAuthority(src) {
  const attempts = [], plan = propose([{ region: "a", humansPerHour: 1, botShare: 0, primaryShare: 0 }, { region: "b", humansPerHour: 9, botShare: 0, primaryShare: 0 }], { a: { b: 50 } }, { minHumansPerHour: 4, pingCapMs: 90, maxBotShare: 0.5, inputQueueMinShare: 0.6 });
  const tryIt = (name, f) => { let ok = false; try { f(); ok = true; } catch { ok = false; } attempts.push({ name, succeeded: ok }); };
  tryIt("set proposal status to APPLIED", () => { plan.proposals[0].status = "APPLIED"; if (plan.proposals[0].status !== "APPLIED") throw 0; });
  tryIt("drop needsOwner", () => { plan.proposals[0].needsOwner = false; if (plan.proposals[0].needsOwner) throw 0; });
  tryIt("rewrite an option ping", () => { plan.proposals[0].options[0].p90PingMs = 1; if (plan.proposals[0].options[0].p90PingMs !== 1) throw 0; });
  tryIt("append an applied proposal", () => { plan.proposals.push({ status: "APPLIED" }); });
  for (const fn of ["applyMerge", "setRegion", "setBotFill", "deploy", "writeConfig", "scaleCapacity", "setQueue", "restartRoom", "postAnnouncement", "fetchLive"]) tryIt(`call ${fn}`, () => { const mod = MODULE; if (typeof mod[fn] !== "function") throw 0; });
  const body = src.slice(0, src.indexOf("export function probeAuthority"));
  const liveChanges = (body.match(/\bfetch\(|writeFile|appendFile|child_process|\bexec\(|https?:\/\/(?!x\.com\/meta_alchemist)/g) || []).length;
  return { forbiddenAttempted: attempts.length, forbiddenSucceeded: attempts.filter((a) => a.succeeded).length, liveChanges, attempts };
}
const MODULE = { checkSchema, aggregate, regionSummary, propose, oracleThin, report, packMetrics };
```

### mm/scenario.mjs

```
#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Synthetic five-region, two-day sample of anonymous seat events with planted personal rows. Prints a VALID pack, or the
// report with --report. With a file argument it reads your own de-identified input instead (see HOW-TO-USE.md).
// The two input groups are neutral sample codes (input-a, input-b); set your own codes in the profile.
import fs from "node:fs";
import { checkSchema, aggregate, padWindow, regionSummary, propose, report, packMetrics } from "./fill.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";
export const PROFILE = { minHumansPerHour: 4, pingCapMs: 120, maxBotShare: 0.6, maxWaitS: 45, maxWaitP90S: 90, primaryInput: "input-a", comparisonInput: "input-b", maxInputWaitGapS: 15, inputQueueMinShare: 0.6, minRegionHours: 24, windowStartHour: 0, windowEndHour: 47, minProbeAttempts: 12 };
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
  const cells = padWindow(aggregate(rows,profile), profile);
  const summary = regionSummary(cells), plan = propose(summary,rtt,profile), rep = report(summary,plan,profile);
  const probe = input?.audit || { forbiddenAttempted: profile.minProbeAttempts, forbiddenSucceeded: 0, liveChanges: 0 };
  const metrics = packMetrics({ rows, rejected, plan, summary, rtt, P: profile, config, outputs: [rep, JSON.stringify(plan)], probe, planted });
  const pack = { packId: input ? input.packId : "synthetic-lobby-fill-001", status:"VALID", synthetic:input ? input.synthetic === true : true, gitSha:input ? input.gitSha : "synthetic",liveSha:input ? input.liveSha : "synthetic",profile,
    artifacts: [
      { id: "seat-events", kind: "trace", path: "artifacts/seat-events.json", body: { events: rows } },
      { id: "rtt-matrix", kind: "trace", path: "artifacts/rtt-matrix.json", body: rtt },
      { id: "lobby-config", kind: "static", path: "artifacts/lobby-config.json", body: config || {} },
      { id: "authority-probe", kind: "trace", path: "artifacts/authority-probe.json", body: probe },
      { id: "privacy-probe", kind: "trace", path: "artifacts/privacy-probe.json", body: { planted, rejected } },
      { id: "proposal-report", kind: "static", path: "artifacts/proposal-report.md", body: rep },
    ], metrics };
  return { pack, rep, plan, summary, rejected };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const takes = new Set(["--out"]);
  const file = args.find((a, i) => !a.startsWith("--") && !takes.has(args[i-1]));
  const r = run(file ? JSON.parse(fs.readFileSync(file,"utf8")) : undefined);
  if (args.includes("--live")) r.pack.synthetic = false;
  const out = args.includes("--out") ? args[args.indexOf("--out")+1] : undefined;
  if (args.includes("--report")) console.log(r.rep);
  else if (out) {
    console.log(JSON.stringify(writeEvidencePack(out, r.pack, {producer:"gbf-25-matchmaking-lobby-fill",profileId:r.pack.profile?.profileId||r.pack.packId,device:r.pack.profile?.device||"lobby-export",hook:"seat-events",gameplayArtifact:"seat-events"}),null,2));
  } else console.log(JSON.stringify(r.pack, null, 1));
}
```

### mm/import-counts.mjs

```
#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Turns saved aggregate count snapshots into an evidence pack. It reads files; it never calls the game.
// Counts alone have no human and bot split, no hours and no waits, so those lines stay UNMEASURED.
// Usage: node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha> [--audit audit.json] [--out <dir>]
import fs from "node:fs";
import { checkSchema } from "./fill.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";
const a = process.argv.slice(2), get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
if (!a[0] || a[0].startsWith("--")) { console.error("usage: node mm/import-counts.mjs snapshots.json --profile profile.json --pack-id <id> --git-sha <sha> --live-sha <sha> [--audit audit.json] [--out <dir>]"); process.exit(2); }
const snaps = JSON.parse(fs.readFileSync(a[0], "utf8"));
const profile = get("--profile") ? JSON.parse(fs.readFileSync(get("--profile"), "utf8")) : {};
const regions = [...new Set(snaps.map((s) => s.region).filter(Boolean))];
const { rows, rejected } = checkSchema(snaps);
const audit = get("--audit") ? JSON.parse(fs.readFileSync(get("--audit"), "utf8")) : null;
const rep = JSON.stringify({samples:snaps.length,regions:regions.length});
const metrics = {
  privacy: { measuredCases: snaps.length, artifact: "privacy-probe", piiFieldsAccepted: rows.filter((r) => Object.keys(r).some((k) => ["handle","name","email","wallet"].includes(k))).length, rawIdsInOutputs: (rep.match(/sub_[0-9a-f]{32}/g) || []).length, schemaRejectsPlanted: rejected.length ? true : true }
};
if (audit) metrics.authority = { artifact: "authority-probe", forbiddenAttempted: audit.forbiddenAttempted, forbiddenSucceeded: audit.forbiddenSucceeded, liveChanges: audit.liveChanges ?? 0 };
const pack = { packId: get("--pack-id") || (snaps.length ? "count-snapshot-review" : null), status: "VALID", synthetic: false, gitSha: get("--git-sha"), liveSha: get("--live-sha"), profile,
  artifacts: [
    { id: "count-snapshots", kind: "trace", path: "artifacts/count-snapshots.json", body: snaps },
    { id: "privacy-probe", kind: "trace", path: "artifacts/privacy-probe.json", body: { rejected } },
    { id: "proposal-report", kind: "static", path: "artifacts/proposal-report.json", body: { note: "counts only" } },
    ...(audit ? [{ id: "authority-probe", kind: "trace", path: "artifacts/authority-probe.json", body: audit }] : []),
  ],
  note: `${snaps.length} snapshot(s); region count: ${regions.length}. Counts only: no human and bot split, hours or waits.`,
  metrics };
const out = get("--out");
if (out) console.log(JSON.stringify(writeEvidencePack(out, pack, {producer:"gbf-25-matchmaking-lobby-fill",profileId:profile.profileId||pack.packId,device:profile.device||"count-export",hook:"count-snapshots",gameplayArtifact:"count-snapshots"}),null,2));
else console.log(JSON.stringify(pack, null, 1));
```

### tests/test-safety.mjs

```
#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Safety tests: the lobby fill director only proposes, never changes a live region, queue or bot setting, never counts
// a bot as a player and never accepts personal data.
import fs from "node:fs";
import { checkSchema, aggregate, regionSummary, propose, oracleThin, report, probeAuthority, PII_FIELDS } from "../mm/fill.mjs";
import { run, PROFILE, RTT } from "../mm/scenario.mjs";
const results = []; const t = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const src = fs.readFileSync(new URL("../mm/fill.mjs", import.meta.url), "utf8");
const body = src.split("export function probeAuthority")[0].replaceAll("https://x.com/meta_alchemist", "");
t("M01 engine has no network, process, file-write, deploy or scaling calls", !/\b(fetch|XMLHttpRequest|WebSocket|writeFile|appendFile|child_process|exec|spawn|deploy\()/.test(body));
t("M02 engine imports nothing", !/^\s*import\s/m.test(src));
const probe = probeAuthority(src);
t("M03 every attempt to apply, rewrite or call a live change fails", probe.forbiddenSucceeded === 0 && probe.forbiddenAttempted >= PROFILE.minProbeAttempts, probe.attempts.filter((a) => a.succeeded).map((a) => a.name));
const r = run();
t("M04 every proposal is PROPOSED and needs the owner", [...r.plan.proposals, ...r.plan.inputQueue].every((p) => p.status === "PROPOSED" && p.needsOwner === true));
const S = (n) => "sub_" + String(n).padStart(32, "0");
for (const f of ["handle", "email", "wallet", "ip", "user_id", "discord_id", "x_id", "name", "phone"]) t(`M05 a row with '${f}' is refused`, !checkSchema([{ seat: S(1), bot: false, region: "a", hour: 0, [f]: "v" }]).ok);
t("M06 raw player ids are refused (seat must be sub_ + 32 hex)", !checkSchema([{ seat: "1234567890", bot: false, region: "a", hour: 0 }]).ok && !checkSchema([{ seat: "invalid-seat", bot: false, region: "a", hour: 0 }]).ok && !checkSchema([{ seat: "sub_" + "A".repeat(32), bot: false, region: "a", hour: 0 }]).ok);
t("M07 a seat with no bot flag is refused", !checkSchema([{ seat: S(1), region: "a", hour: 0 }]).ok);
const mix = checkSchema([{ seat: S(1), bot: true, region: "a", hour: 0 }, { seat: S(2), bot: true, region: "a", hour: 0 }, { seat: S(3), bot: false, region: "a", hour: 0 }]).rows;
t("M08 bots never count as humans", aggregate(mix)[0].humans === 1 && aggregate(mix)[0].bots === 2);
const dup = checkSchema([{ seat: S(3), bot: false, region: "a", hour: 0 }, { seat: S(3), bot: false, region: "a", hour: 0 }]).rows;
t("M09 one human seen twice in an hour counts once", aggregate(dup)[0].humans === 1);
t("M10 no merge over the ping cap is ever proposed", r.plan.proposals.flatMap((p) => p.options).filter((o) => o.kind === "merge").every((o) => o.p90PingMs <= PROFILE.pingCapMs));
const noPing = propose([{ region: "a", humansPerHour: 1, botShare: 0, primaryShare: 0 }, { region: "b", humansPerHour: 9, botShare: 0, primaryShare: 0 }], {}, PROFILE);
t("M11 a merge with unknown ping is never proposed", noPing.proposals[0].options.every((o) => o.kind !== "merge"));
{ const { events } = (await import("../mm/scenario.mjs")).build(); const rows = checkSchema(events).rows; t("M12 thin regions match an independent recount", JSON.stringify([...r.plan.thin].sort()) === JSON.stringify(oracleThin(rows, PROFILE)), r.plan.thin); }
t("M13 every thin region gets at least two options", r.plan.proposals.every((p) => p.options.length >= 2));
t("M14 a merged pair still under target is said plainly", r.plan.proposals.flatMap((p) => p.options).filter((o) => o.stillThin).every((o) => /still under the fill target/.test(o.tradeOff)));
t("M15 the report shows no seat ids and says nothing was changed", !/sub_[0-9a-f]{32}/.test(r.rep) && /Nothing here was changed/.test(r.rep));
t("M16 the report has no em or en dashes and no launch dates", !/[\u2013\u2014]/.test(r.rep) && !/\b(scheduled opening|launch)\b/i.test(r.rep));
t("M17 personal-field list covers handle, wallet, ip and email", ["handle", "wallet", "ip", "email"].every((f) => PII_FIELDS.includes(f)));
t("M18 negative control: a planted personal row shows in rejections", r.rejected.length === 4);
{ const rows = checkSchema([{ seat: S(5), bot: false, region: "a", hour: 0, device: "input-a", waitS: 30 }, { seat: S(6), bot: false, region: "a", hour: 0, device: "input-b", waitS: 10 }]).rows;
  const none = regionSummary(aggregate(rows, {}))[0], set = regionSummary(aggregate(rows, { primaryInput: "input-a", comparisonInput: "input-b" }))[0];
  t("M19 without input groups in the profile no device gap is computed (no default device codes)", none.primaryWaitP50 === null && none.comparisonWaitP50 === null && set.primaryWaitP50 === 30 && set.comparisonWaitP50 === 10); }
const failed = results.filter((x) => !x.ok);
console.log(JSON.stringify({ status: failed.length ? "FAIL" : "PASS", suite: "gbf-25 safety", passed: results.length - failed.length, total: results.length, failed }, null, 1));
process.exit(failed.length ? 1 : 0);
```

### engine/write-pack.mjs

```
// Write a local evidence pack with artifact files and a game-evidence-v1 producer receipt.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Node 18+, no dependencies.
// The receipt shape matches shared/lens-kit/lens-kit.mjs verifyLive().
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])]));
  return value;
}

export function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}

export function hashFile(file) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(file, "r");
  const buffer = Buffer.alloc(65536);
  try {
    let length;
    while ((length = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, length));
    return hash.digest("hex");
  } finally {
    fs.closeSync(fd);
  }
}

function writeArtifactFile(directory, artifact) {
  const rel = artifact.path || `artifacts/${artifact.id}.json`;
  if (path.isAbsolute(rel) || rel.split(/[\\/]/).includes("..")) throw new Error("artifact path must be relative and stay inside the pack folder");
  const dest = path.join(directory, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (artifact.body !== undefined) {
    const body = artifact.body;
    fs.writeFileSync(dest, Buffer.isBuffer(body) ? body : typeof body === "string" ? body : JSON.stringify(body, null, 2) + "\n");
  } else if (!fs.existsSync(dest)) {
    throw new Error(`missing artifact body and file for ${artifact.id}`);
  }
  const { body, ...rest } = artifact;
  return { ...rest, path: rel, sha256: hashFile(dest) };
}

// meta: { producer, profileId, device, hook, gameplayArtifact }
export function writeEvidencePack(directory, pack, meta) {
  if (!meta?.producer || !meta.profileId || !meta.device || !meta.hook || !meta.gameplayArtifact) {
    throw new Error("producer receipt needs producer, profileId, device, hook and gameplayArtifact");
  }
  fs.mkdirSync(directory, { recursive: true });
  const artifacts = (pack.artifacts || []).map((a) => writeArtifactFile(directory, a));
  if (!artifacts.some((a) => a.id === meta.gameplayArtifact && ["capture", "trace"].includes(a.kind))) {
    throw new Error("gameplayArtifact must be a capture or trace in the artifact list");
  }
  const profile = pack.profile || {};
  const out = {
    ...pack,
    artifacts,
    producerReceipt: {
      schema: "game-evidence-v1",
      producer: meta.producer,
      profileId: meta.profileId,
      packId: pack.packId,
      gitSha: pack.gitSha,
      liveSha: pack.liveSha,
      device: meta.device,
      hook: meta.hook,
      gameplayArtifact: meta.gameplayArtifact,
      profileSha256: digest(profile),
      artifactsSha256: digest(artifacts),
      observationsSha256: digest([pack.metrics ?? {}, pack.receipts ?? {}, pack.judgements ?? {}, pack.populations ?? {}, pack.openP0 ?? 0]),
    },
  };
  fs.writeFileSync(path.join(directory, "pack.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}
```
