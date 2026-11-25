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
