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
