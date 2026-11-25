---
name: retention-cohorts-domain-engine
description: "Use when the domain tools are not on disk yet (a recipe-only install) or their safety tests need rerunning: write the bundled files at their paths and run the tests."
---

# Run the local Retention and Cohort Analytics tools

Save the bundled files below at their relative paths, next to the files from the lens-engine skill. Then run from the template folder:

```sh
node tests/run-all.mjs
node cohorts/scenario.mjs --report
```

`cohorts/cohorts.mjs` is the engine, `cohorts/scenario.mjs` reads your input or runs the synthetic example, and `cohorts/probe-only.mjs` records the privacy checks before an export exists (see README.md, Domain tools). Player keys are sub_ ids.

Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it.

Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## Bundled files

### cohorts/cohorts.mjs

```
// Retention & Cohort Analytics engine: D1, D7 and D30 by first-play cohort, with Wilson intervals, small-cell
// suppression and no personal data in or out. Pure functions, no imports, no network, no writes.
// Created by @meta_alchemist (https://x.com/meta_alchemist).
export const PII_FIELDS = ["name", "handle", "username", "email", "wallet", "address", "ip", "xid", "x_id", "userid", "user_id", "discordid", "discord_id", "playerid", "player_id", "phone", "device_id", "deviceid", "country", "city", "lat", "lon", "birthday", "age"];
// Player keys are the kit's salted subject ids (sub_ plus 32 lowercase hex, an HMAC made before export).
export const PLAYER_ID = /^sub_[0-9a-f]{32}$/;
const ID_IN_TEXT = /sub_[0-9a-f]{32}/g;
export const DAYS = [1, 7, 30];

// Accepts only { player: salted subject id, day: integer day number, kind: "session", segment }. Anything else is refused, not cleaned.
export function checkSchema(events, allowedSegments = []) {
  const rows = [], rejected = [];
  events.forEach((e, i) => {
    if (!e || typeof e !== "object" || (e.kind != null && e.kind !== "session")) return rejected.push({i,reason:"invalid session"});
    const pii = Object.keys(e).map((k) => k.toLowerCase().replace(/[^a-z_]/g, "")).find((k) => PII_FIELDS.includes(k));
    if (pii) return rejected.push({ i, reason: `personal field '${pii}' refused` });
    if (!PLAYER_ID.test(String(e.player))) return rejected.push({ i, reason: "player id is not a salted subject id (sub_ + 32 hex)" });
    if (!Number.isInteger(e.day) || e.day < 0) return rejected.push({ i, reason: "day must be a whole day number (no timestamps)" });
    const extra = Object.keys(e).filter((k) => !["player", "day", "kind", "segment"].includes(k));
    if (extra.length) return rejected.push({ i, reason: `unexpected field(s) ${extra.join(", ")} refused` });
    rows.push({ player: e.player, day: e.day, segment: allowedSegments.includes(e.segment) && typeof e.segment === "string" && /^[a-z0-9_-]{1,24}$/.test(e.segment) ? e.segment : "all" });
  });
  return { ok: !rejected.length, rows, rejected };
}

export function wilson(k, n, z = 1.96) {
  if (!n) return { rate: null, lo: null, hi: null };
  const p = k / n, d = 1 + (z * z) / n, c = p + (z * z) / (2 * n), m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return { rate: +p.toFixed(4), lo: +((c - m) / d).toFixed(4), hi: +((c + m) / d).toFixed(4) };
}

// Cohorts by first-play week (or day with width 1). A D-N rate counts only players whose day N has fully passed.
export function cohorts(rows, today, width = 7) {
  const first = new Map(), seen = new Map(), seg = new Map();
  for (const r of rows) { if (!first.has(r.player) || r.day < first.get(r.player)) first.set(r.player, r.day); if (!seen.has(r.player)) seen.set(r.player, new Set()); seen.get(r.player).add(r.day); if (r.segment !== "all") seg.set(r.player, r.segment); }
  const by = new Map();
  for (const [p, f] of first) { const c = Math.floor(f / width) * width; if (!by.has(c)) by.set(c, []); by.get(c).push(p); }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([start, players]) => {
    const out = { start, size: players.length };
    for (const d of DAYS) {
      const eligible = players.filter((p) => first.get(p) + d < today);
      const k = eligible.filter((p) => seen.get(p).has(first.get(p) + d)).length;
      out[`d${d}`] = { n: eligible.length, k, ...wilson(k, eligible.length) };
    }
    out.segments = {}; for (const p of players) { const s = seg.get(p) || "all"; out.segments[s] = (out.segments[s] || 0) + 1; }
    return out;
  });
}

// Pooled rate over all mature players, per day, with an interval.
export function pooled(cs) { const o = {}; for (const d of DAYS) { const n = cs.reduce((a, c) => a + c[`d${d}`].n, 0), k = cs.reduce((a, c) => a + c[`d${d}`].k, 0); o[`d${d}`] = { n, k, ...wilson(k, n) }; } return o; }

export function bySegment(rows, today) {
  const segs = [...new Set(rows.map((r) => r.segment))].filter((s) => s !== "all");
  const players = new Map(); for (const r of rows) if (r.segment !== "all") players.set(r.player, r.segment);
  return Object.fromEntries(segs.map((s) => [s, pooled(cohorts(rows.filter((r) => players.get(r.player) === s), today))]));
}

// Independent recount: walks players one by one, no code shared with cohorts().
export function oracle(rows, today) {
  const days = {}; for (const r of rows) (days[r.player] ??= []).push(r.day);
  const tot = { 1: [0, 0], 7: [0, 0], 30: [0, 0] };
  for (const ds of Object.values(days)) { const f = Math.min(...ds); for (const d of DAYS) if (f + d < today) { tot[d][1]++; if (ds.includes(f + d)) tot[d][0]++; } }
  return Object.fromEntries(DAYS.map((d) => [`d${d}`, { k: tot[d][0], n: tot[d][1] }]));
}

const pct = (x) => (x == null ? "n/a" : (x * 100).toFixed(1) + "%");
export function report(cs, pool, segs, P) {
  const L = ["# DRAFT retention by first-play week", "", `Cohorts under ${P.minCellSize} players are hidden. Each rate has a 95% range. Only days that have fully passed are counted.`, "", "| Week start (day) | Players | D1 | D7 | D30 |", "|---|---|---|---|---|"];
  const cell = (c) => (c.n < P.minCellSize ? `under ${P.minCellSize}` : `${pct(c.rate)} (${pct(c.lo)} to ${pct(c.hi)})`);
  for (const c of cs) L.push(c.size < P.minCellSize ? `| ${c.start} | under ${P.minCellSize} | hidden | hidden | hidden |` : `| ${c.start} | ${c.size} | ${cell(c.d1)} | ${cell(c.d7)} | ${cell(c.d30)} |`);
  L.push("", `All mature players: D1 ${cell(pool.d1)}, D7 ${cell(pool.d7)}, D30 ${cell(pool.d30)}.`);
  for (const [s, p] of Object.entries(segs).filter(([,p]) => p.d1.n >= P.minCellSize || p.d7.n >= P.minCellSize)) L.push(`Segment ${s}: D1 ${cell(p.d1)}, D7 ${cell(p.d7)}.`);
  return L.join("\n") + "\n";
}

export function packMetrics({ rows, rejected, planted, cs, pool, segs, orc, rep, P, probe, today }) {
  const rates = cs.flatMap((c) => DAYS.map((d) => c[`d${d}`])).filter((r) => r.n > 0);
  const mism = DAYS.filter((d) => pool[`d${d}`].k !== orc[`d${d}`].k || pool[`d${d}`].n !== orc[`d${d}`].n).length;
  const firstDay = {}; for (const r of rows) firstDay[r.player] = Math.min(firstDay[r.player] ?? Infinity, r.day);
  const immature = DAYS.reduce((a, d) => a + Math.max(0, pool[`d${d}`].n - Object.values(firstDay).filter((f) => f + d < today).length), 0);
  const small = [...rep.matchAll(/^\| (\d+) \| (\d+) \|/gm)].filter((m) => Number(m[2]) < P.minCellSize).length;
  const m = {
    privacy: { measuredCases: planted || 0, artifact: "schema-check", piiAccepted: rows.filter((r) => Object.keys(r).some((k) => PII_FIELDS.includes(k))).length, rawIdsAccepted: rows.filter((r) => !PLAYER_ID.test(r.player)).length, plantedRejected: planted ? rejected.length >= planted : null },
    output: { measuredCases: cs.length, artifact: "report", idsInOutputs: (rep.match(ID_IN_TEXT) || []).length, smallCellsShown: small, individualExports: probe.individualExports, dashes: (rep.match(/[\u2013\u2014]/g) || []).length },
    authority: { artifact: "probe", forbiddenAttempted: probe.forbiddenAttempted, forbiddenSucceeded: probe.forbiddenSucceeded, writes: probe.writes },
  };
  if (rows.length) {
    m.math = { artifact: "cohort-table", oracleMismatches: mism, cohorts: cs.length, immatureCounted: immature };
    m.conf = { artifact: "interval-table", rates: rates.length, ratesWithInterval: rates.filter((r) => r.lo != null && r.hi != null && r.lo <= r.rate && r.rate <= r.hi).length };
    m.data = { artifact: "events", players: new Set(rows.map((r) => r.player)).size, daysCovered: new Set(rows.map((r) => r.day)).size };
    m.ret = { measuredCases: pool.d1.n, artifact: "cohort-table", d1: pool.d1.n >= P.minCellSize ? pool.d1.rate : null, d7: pool.d7.n >= P.minCellSize ? pool.d7.rate : null };
    m.ret30 = {artifact:"cohort-table", measuredCases:pool.d30.n, d30:pool.d30.n >= P.minCellSize ? pool.d30.rate : null};
    m.segments = { artifact: "interval-table", compared: Object.values(segs).filter(s => s.d1.n >= P.minCellSize && s.d7.n >= P.minCellSize).length };
  }
  return m;
}

// Tries to pull individuals or write anything through the engine. Every attempt must fail.
export function probeAuthority(src) {
  const attempts = []; const tryIt = (name, f) => { let ok = false; try { const r = f(); ok = r !== undefined && r !== null && r !== false; } catch { ok = false; } attempts.push({ name, succeeded: ok }); };
  for (const fn of ["listChurned", "exportPlayers", "playerList", "lookupPlayer", "unhash", "dmPlayers", "postReport", "writeWarehouse", "sendEmail", "deanonymize", "joinWithWallets", "trackDevice"]) tryIt(`call ${fn}`, () => (typeof API[fn] === "function" ? API[fn]() : undefined));
  const probeId = "sub_" + "0".repeat(31) + "1";
  const rep = report(cohorts(checkSchema([{ player: probeId, day: 0 }, { player: probeId, day: 1 }]).rows, 40), { d1: { n: 1, k: 1 }, d7: { n: 0 }, d30: { n: 0 } }, {}, { minCellSize: 10 });
  const indiv = new RegExp(ID_IN_TEXT.source).test(rep) ? 1 : 0;
  const body = src.slice(0, src.indexOf("export function probeAuthority")).replaceAll("https://x.com/meta_alchemist", "");
  return { forbiddenAttempted: attempts.length, forbiddenSucceeded: attempts.filter((a) => a.succeeded).length, individualExports: indiv, writes: (body.match(/\bfetch\(|writeFile|appendFile|child_process|\bexec\(|https?:\/\//g) || []).length, attempts };
}
const API = { checkSchema, wilson, cohorts, pooled, bySegment, oracle, report, packMetrics };
```

### cohorts/scenario.mjs

```
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
```

### cohorts/probe-only.mjs

```
#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Evidence pack for a game with no anonymous session export yet: the privacy and authority checks run on the engine
// itself; every retention line stays UNMEASURED until real events arrive.
// Usage: node cohorts/probe-only.mjs --profile profile.json --git-sha <sha> --live-sha <sha> [--date <label>]
// profile.json holds your own approved values (minCellSize and minProbeAttempts at least), never the synthetic example's.
import fs from "node:fs";
import { checkSchema, cohorts, pooled, oracle, report, packMetrics, probeAuthority } from "./cohorts.mjs";
const a = process.argv.slice(2), get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
if (!get("--profile")) { console.error("usage: node cohorts/probe-only.mjs --profile profile.json --git-sha <sha> --live-sha <sha> [--date <label>]"); process.exit(2); }
const PROFILE = JSON.parse(fs.readFileSync(get("--profile"), "utf8"));
if (!Number.isSafeInteger(PROFILE.minCellSize) || PROFILE.minCellSize < 1) { console.error("profile.json needs a positive minCellSize"); process.exit(2); }
const S = (n) => "sub_" + String(n).padStart(32, "0");
const planted = [{ player: S(1), day: 3, handle: "redacted" }, { player: "raw-key", day: 4 }, { player: S(2), day: 5, wallet: "masked" }, { player: S(3), day: new Date(0).toISOString() }, { player: S(4), day: 6, country: "fixture" }];
const { rejected } = checkSchema(planted), cs = cohorts([], 0), pool = pooled(cs), rep = report(cs, pool, {}, PROFILE);
const probe = probeAuthority(fs.readFileSync(new URL("./cohorts.mjs", import.meta.url), "utf8"));
const metrics = packMetrics({ rows: [], rejected, planted: planted.length, cs, pool, segs: {}, rep, P: PROFILE, probe, today: 0, orc: oracle([], 0) });
console.log(JSON.stringify({ packId: "real-no-export-" + (get("--date") || "today"), status: "VALID", synthetic: false, gitSha: get("--git-sha"), liveSha: get("--live-sha"), profile: PROFILE,
  artifacts: [{ id: "schema-check", kind: "trace" }, { id: "report", kind: "trace" }, { id: "probe", kind: "trace" }], note: "No anonymous session export exists yet; retention lines are UNMEASURED.", metrics }, null, 1));
```

### tests/test-safety.mjs

```
#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Safety tests: retention analytics takes no personal data in, lets none out, never lists or exports individuals,
// and counts only days that have passed.
import fs from "node:fs";
import { checkSchema, cohorts, pooled, oracle, wilson, report, probeAuthority, PII_FIELDS } from "../cohorts/cohorts.mjs";
import { run, PROFILE } from "../cohorts/scenario.mjs";
const S = (n) => "sub_" + n.toString(16).padStart(32, "0");
const results = []; const t = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const src = fs.readFileSync(new URL("../cohorts/cohorts.mjs", import.meta.url), "utf8"), body = src.split("export function probeAuthority")[0].replaceAll("https://x.com/meta_alchemist", "");
t("R01 engine has no network, process or file-write calls", !/\b(fetch\(|XMLHttpRequest|WebSocket|writeFile|appendFile|child_process|spawn\(|exec\()/.test(body));
t("R02 engine imports nothing", !/^\s*import\s/m.test(src));
for (const f of ["handle", "email", "wallet", "ip", "user_id", "discord_id", "x_id", "name", "phone", "country", "device_id"]) t(`R03 a row with '${f}' is refused`, !checkSchema([{ player: S(1), day: 0, [f]: "v" }]).ok);
t("R04 raw player ids are refused (player must be sub_ + 32 hex)", !checkSchema([{ player: "raw-key", day: 0 }]).ok && !checkSchema([{ player: "invalid reference", day: 0 }]).ok && !checkSchema([{ player: "h_000000000001", day: 0 }]).ok);
t("R05 timestamps are refused (whole days only)", !checkSchema([{ player: S(1), day: new Date(0).toISOString() }]).ok && !checkSchema([{ player: S(1), day: 1.5 }]).ok);
t("R06 unknown extra fields are refused, not passed through", !checkSchema([{ player: S(1), day: 0, note: "x" }]).ok);
t("R07 a segment that looks personal is dropped to 'all'", checkSchema([{ player: S(1), day: 0, segment: "sample@example.org" }]).rows[0].segment === "all");
const r = run();
t("R08 the report holds no player ids", !/sub_[0-9a-f]{32}/.test(r.rep));
const tiny = checkSchema(Array.from({ length: 5 }, (_, i) => ({ player: S(i + 1), day: 0 }))).rows, cs = cohorts(tiny, 40);
t("R09 a cohort under the cell size is hidden", /under 20 \| hidden/.test(report(cs, pooled(cs), {}, PROFILE)));
const probe = probeAuthority(src);
t("R10 no function lists, unhashes, exports or contacts players", probe.forbiddenSucceeded === 0 && probe.forbiddenAttempted >= PROFILE.minProbeAttempts && probe.individualExports === 0);
t("R11 pooled rates match the independent recount", ["d1", "d7", "d30"].every((d) => r.pool[d].k === r.orc[d].k && r.pool[d].n === r.orc[d].n));
const young = checkSchema([{ player: S(10), day: 37 }, { player: S(10), day: 38 }]).rows;
t("R12 a player whose day 7 has not passed is not in D7", cohorts(young, 40)[0].d7.n === 0 && cohorts(young, 40)[0].d1.n === 1);
const w = wilson(50, 100);
t("R13 Wilson interval matches the textbook value", Math.abs(w.lo - 0.4038) < 0.001 && Math.abs(w.hi - 0.5962) < 0.001 && wilson(0, 0).rate === null);
t("R14 every shown rate carries a range that contains it", r.metrics.conf.ratesWithInterval === r.metrics.conf.rates);
t("R15 report has no em or en dashes", !/[\u2013\u2014]/.test(r.rep));
t("R16 negative control: planted personal rows are all rejected", r.rejected.length === 5);
t("R17 personal-field list covers handle, wallet, ip, email and country", ["handle", "wallet", "ip", "email", "country"].every((f) => PII_FIELDS.includes(f)));
const failed = results.filter((x) => !x.ok);
console.log(JSON.stringify({ status: failed.length ? "FAIL" : "PASS", suite: "gbf-27 safety", passed: results.length - failed.length, total: results.length, failed }, null, 1));
process.exit(failed.length ? 1 : 0);
```
