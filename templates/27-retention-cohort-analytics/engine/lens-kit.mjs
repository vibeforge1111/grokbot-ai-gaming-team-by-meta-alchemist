// lens-kit v1.1.0: turns an evidence pack into contract v1 line levels. Zero dependencies, Node 18+.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Vendored byte for byte into each template as engine/lens-kit.mjs.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const KIT_VERSION = "1.1.0";
const LEVEL_FOR_FAIL = { h: 1, d: 2, 4: 3 };

// ---------- numeric and perceptual helpers (all pure) ----------
const num = (a) => (Array.isArray(a) ? a.map(Number) : []);
const sorted = (a) => num(a).slice().sort((x, y) => x - y);
export function pct(a, p) { const s = sorted(a); if (!s.length) return undefined; const i = Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1)); return s[i]; }
export function slope(a) { const y = num(a), n = y.length; if (n < 2) return undefined; const mx = (n - 1) / 2, my = y.reduce((s, v) => s + v, 0) / n; let nu = 0, de = 0; y.forEach((v, i) => { nu += (i - mx) * (v - my); de += (i - mx) ** 2; }); return nu / de; }
export function wilson(k, n, z = 1.96) { if (!(n > 0)) return undefined; const p = k / n, d = 1 + (z * z) / n, c = p + (z * z) / (2 * n), m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n)); return [(c - m) / d, (c + m) / d]; }
const hex = (h) => { const s = String(h).replace("#", ""); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255); };
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export function relLum(h) { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
export function contrast(a, b) { const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
function toLab(rgbLin) { const [r, g, b] = rgbLin; let X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883; const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116); [X, Y, Z] = [f(X), f(Y), f(Z)]; return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)]; }
const dE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
// Machado et al. 2009 full-severity matrices, applied in linear RGB.
const CVD = { protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]], deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]], tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]] };
const mul = (m, v) => m.map((r) => Math.min(1, Math.max(0, r[0] * v[0] + r[1] * v[1] + r[2] * v[2])));
export function cvdMinDeltaE(palette) { const P = (palette || []).map((h) => hex(h).map(lin)); if (P.length < 2) return undefined; let min = Infinity; for (const m of Object.values(CVD)) for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) min = Math.min(min, dE(toLab(mul(m, P[i])), toLab(mul(m, P[j])))); return min; }
export function deltaE(a, b) { return dE(toLab(hex(a).map(lin)), toLab(hex(b).map(lin))); }
export function flashesPerSecondMax(lum, fps) { const L = num(lum); if (!L.length || !(fps > 0)) return undefined; const ev = []; for (let i = 1; i < L.length; i++) { const hi = Math.max(L[i], L[i - 1]), lo = Math.min(L[i], L[i - 1]); if (hi - lo >= 0.1 && lo < 0.8) ev.push(i); } let best = 0; for (let i = 0; i < ev.length; i++) { let j = i; while (j < ev.length && ev[j] - ev[i] < fps) j++; best = Math.max(best, Math.floor((j - i) / 2)); } return best; }
export function knnOutliers(points, k = 4, mult = 2) { const P = points || []; if (P.length <= k) return undefined; const d = P.map((p, i) => { const ds = P.map((q, j) => (i === j ? Infinity : Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]))).sort((x, y) => x - y); return ds.slice(0, k).reduce((s, v) => s + v, 0) / k; }); const mu = d.reduce((s, v) => s + v, 0) / d.length, sd = Math.sqrt(d.reduce((s, v) => s + (v - mu) ** 2, 0) / d.length); return d.map((v, i) => (v > mu + mult * sd ? i : -1)).filter((i) => i >= 0); }
export function focusFireMaxErr(ex) { if (!Array.isArray(ex) || !ex.length) return undefined; return Math.max(...ex.map((e) => { const shots = Math.ceil(e.hp / (e.damage * e.attackers)); return Math.abs((shots - 1) * e.intervalS - e.reportedTtkS); })); }
export function shingles(s, n = 3) { const t = String(s).toLowerCase().replace(/\d+/g, "#"); const out = new Set(); for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n)); return out; }
export function jaccard(a, b) { const A = shingles(a), B = shingles(b); let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i || 1); }

export const FNS = {
  p50: (a) => pct(a, 50), p95: (a) => pct(a, 95), p99: (a) => pct(a, 99), max: (a) => (num(a).length ? Math.max(...num(a)) : undefined), min: (a) => (num(a).length ? Math.min(...num(a)) : undefined),
  mean: (a) => (num(a).length ? num(a).reduce((s, v) => s + v, 0) / num(a).length : undefined), sum: (a) => num(a).reduce((s, v) => s + v, 0), len: (a) => (Array.isArray(a) ? a.length : a && typeof a === "object" ? Object.keys(a).length : undefined),
  countTrue: (a) => (Array.isArray(a) ? a.filter(Boolean).length : undefined), countFalse: (a) => (Array.isArray(a) ? a.filter((x) => !x).length : undefined),
  countEq: (a, v) => (Array.isArray(a) ? a.filter((x) => x === v).length : undefined), countGt: (a, v) => (Array.isArray(a) ? num(a).filter((x) => x > v).length : undefined), countLt: (a, v) => (Array.isArray(a) ? num(a).filter((x) => x < v).length : undefined),
  absdiff: (a, b) => Math.abs(a - b), diff: (a, b) => a - b, ratio: (a, b) => (b ? a / b : undefined), slope, wilsonLow: (k, n) => wilson(k, n)?.[0], wilsonWidth: (k, n) => { const w = wilson(k, n); return w && w[1] - w[0]; },
  contrastMin: (pairs) => (Array.isArray(pairs) && pairs.length ? Math.min(...pairs.map(([f, b]) => contrast(f, b))) : undefined), cvdMinDeltaE, deltaEMax: (pairs) => (Array.isArray(pairs) && pairs.length ? Math.max(...pairs.map(([a, b]) => deltaE(a, b))) : undefined),
  flashesPerSecondMax, outlierCount: (pts, k, m) => knnOutliers(pts, k, m)?.length, injectedCaught: (pts, idx) => { const o = knnOutliers(pts); return o && (idx || []).every((i) => o.includes(i)); },
  focusFireMaxErr, missing: (have, need) => (Array.isArray(have) && Array.isArray(need) ? need.filter((x) => !have.includes(x)).length : undefined),
  extra: (have, allowed) => (Array.isArray(have) && Array.isArray(allowed) ? have.filter((x) => !allowed.includes(x)).length : undefined),
  dupCount: (a) => (Array.isArray(a) ? a.length - new Set(a.map((x) => JSON.stringify(x))).size : undefined),
  allEq: (a) => (Array.isArray(a) && a.length ? a.length >= 2 && a.every((x) => JSON.stringify(x) === JSON.stringify(a[0])) : undefined),
  countWhere: (a, key) => (Array.isArray(a) ? a.filter((x) => x && x[key]).length : undefined), countWhereNot: (a, key) => (Array.isArray(a) ? a.filter((x) => !(x && x[key])).length : undefined),
  maxOf: (a, key) => (Array.isArray(a) && a.length ? Math.max(...a.map((x) => Number(x?.[key]))) : undefined), minOf: (a, key) => (Array.isArray(a) && a.length ? Math.min(...a.map((x) => Number(x?.[key]))) : undefined),
  countFieldsEq: (a, k1, k2) => (Array.isArray(a) ? a.filter((x) => x && x[k1] === x[k2]).length : undefined),
  maxSimilarDistinct: (pairs) => (Array.isArray(pairs) ? pairs.filter((p) => !p.sameRoot && p.autoMerged).length : undefined),
  coversTasks: (rows, devices, tasks) => devices.every(device =>
    tasks.every(task => rows.some(row => row.device === device && row.task === task))),
  taggedLinks: (links, tag) => links.filter(link => {
    try {
      const url = new URL(link);
      return ["http:", "https:"].includes(url.protocol) && url.searchParams.getAll(tag.replace(/=$/, "")).some(Boolean);
    } catch { return false; }
  }).length,
  matchCount: (a, re) => (Array.isArray(a) ? a.filter((s) => new RegExp(re, "i").test(String(s))).length : undefined),
};

// ---------- pack access ----------
export function getPath(o, p) { return String(p).split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
export function setPath(o, p, v) { const ks = String(p).split("."); let c = o; for (const k of ks.slice(0, -1)) { if (c[k] == null || typeof c[k] !== "object") c[k] = {}; c = c[k]; } if (v === "__DELETE__") delete c[ks.at(-1)]; else c[ks.at(-1)] = v; }
export function validatePack(pack) {
  if (!pack || typeof pack !== "object") return "evidence pack missing";
  if (pack.status !== "VALID") return `evidence pack status is ${pack.status ?? "absent"}, not VALID`;
  if (typeof pack.liveSha !== "string" || !pack.liveSha.trim()) return "no liveSha in the pack: no grade without live build identity";
  if (typeof pack.gitSha !== "string" || !pack.gitSha.trim()) return "no gitSha in the pack";
  if (typeof pack.packId !== "string" || !pack.packId.trim()) return "no packId in the pack";
  if (!Array.isArray(pack.artifacts) || pack.artifacts.some(a => !a || typeof a.id !== "string" || !a.id.trim())) return "invalid artifacts list";
  if (new Set(pack.artifacts.map(a => a.id)).size !== pack.artifacts.length) return "duplicate artifact id";
  return null;
}
const artifactIds = (pack) => new Set((pack.artifacts || []).map((a) => a.id));

function observed(value) {
  if (value == null || (typeof value === "number" && !Number.isFinite(value))) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0 && value.every(observed);
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function resolveArg(tok, pack, profile, used) {
  const t = tok.trim();
  if (/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(t)) return Number(t);
  if (/^".*"$/.test(t) || /^'.*'$/.test(t)) return t.slice(1, -1);
  if (/^\[.*\]$/.test(t)) return JSON.parse(t);
  if (t === "true" || t === "false") return t === "true";
  if (t.startsWith("P.")) { const v = getPath(profile, t.slice(2)); used.profile.push(t); return observed(v) ? v : undefined; }
  used.groups.add(t.split(".")[0]); used.paths.push(t);
  const value = getPath(pack.metrics || {}, t);
  return observed(value) ? value : undefined;
}
function evalExpr(e, pack, profile, used) {
  if (typeof e !== "string") return e;
  const m = e.match(/^(\w+)\((.*)\)$/);
  if (!m) return resolveArg(e, pack, profile, used);
  const fn = FNS[m[1]]; if (!fn) throw new Error(`unknown lens function ${m[1]}`);
  const parts = []; let depth = 0, cur = "";
  for (const ch of m[2]) { if ((ch === "(" || ch === "[") && ++depth) cur += ch; else if ((ch === ")" || ch === "]") && depth--) cur += ch; else if (ch === "," && depth === 0) { parts.push(cur); cur = ""; } else cur += ch; }
  parts.push(cur);
  const args = parts.map((a) => (/^\s*\w+\(.*\)\s*$/.test(a) ? evalExpr(a.trim(), pack, profile, used) : resolveArg(a, pack, profile, used)));
  if (args.some((a) => a === undefined)) return undefined;
  const value = fn(...args);
  return observed(value) ? value : undefined;
}
const OPS = {
  "<=": (a, b) => a <= b, "<": (a, b) => a < b, ">=": (a, b) => a >= b, ">": (a, b) => a > b, "==": (a, b) => JSON.stringify(a) === JSON.stringify(b), "!=": (a, b) => JSON.stringify(a) !== JSON.stringify(b),
  in: (a, b) => Array.isArray(b) && b.includes(a), covers: (a, b) => Array.isArray(a) && Array.isArray(b) && b.every((x) => a.includes(x)),
  all: (a) => Array.isArray(a) ? a.length > 0 && a.every(Boolean) : a && typeof a === "object" ? Object.values(a).length > 0 && Object.values(a).every(Boolean) : false,
  none: (a) => Array.isArray(a) ? a.every((x) => !x) : a && typeof a === "object" ? Object.values(a).every((x) => !x) : false,
  true: (a) => a === true, false: (a) => a === false, nonEmpty: (a) => (Array.isArray(a) ? a.length > 0 : typeof a === "string" ? a.length > 0 : a && typeof a === "object" ? Object.keys(a).length > 0 : false),
};
const UNARY = new Set(["all", "none", "true", "false", "nonEmpty"]);

// Evaluates one computed spec (rubric line or growth check). Missing data gives U; never a defect.
export function evalComputed(spec, pack, profile, sampleFields = {}, line, evidenceType) {
  const used = { groups: new Set(), paths: [], profile: [] }, findings = [];
  let level = 4, missing = spec.conds.length ? null : "no measured conditions";
  for (const c of spec.conds) {
    const [lhs, op, rhs, tier = "d"] = c;
    const a = evalExpr(lhs, pack, profile, used), b = UNARY.has(op) ? undefined : evalExpr(rhs, pack, profile, used);
    if (a === undefined || (!UNARY.has(op) && b === undefined)) { missing = missing || `${lhs}${UNARY.has(op) ? "" : ` or ${rhs}`} not in pack`; continue; }
    if (!OPS[op](a, b)) { findings.push(`${lhs} = ${JSON.stringify(a)} fails ${op}${UNARY.has(op) ? "" : ` ${rhs} (${JSON.stringify(b)})`}${c[4] ? `: ${c[4]}` : ""}`); level = Math.min(level, LEVEL_FOR_FAIL[tier] ?? 2); }
  }
  const ids = artifactIds(pack), ev = [];
  for (const g of used.groups) {
    const group = pack.metrics?.[g];
    const fields = new Set(sampleFields[g] || ["measuredCases"]);
    if (group && "measuredCases" in Object(group)) fields.add("measuredCases");
    for (const field of fields) {
      const value = group?.[field];
      const count = Array.isArray(value) && observed(value) ? value.length : value;
      if (!Number.isSafeInteger(count) || count <= 0) missing ||= `metrics.${g}.${field} needs a nonempty sample or positive case count`;
    }
    const artifact = group?.artifactsByLine?.[line] ?? group?.artifact;
    if (ids.has(artifact)) ev.push(artifact);
    else missing ||= `metrics.${g} has no artifact id present in pack.artifacts`;
  }
  if (evidenceType && !pack.artifacts.some(a => ev.includes(a.id) && a.kind === evidenceType)) missing ||= `line needs ${evidenceType} evidence`;
  if (missing) return { level: "U", evidenceIds: [], findings: [], reason: `UNMEASURED: ${missing}`, evidenceMode: "pack-declared" };
  return { level, evidenceIds: [...new Set(ev)], findings, evidenceMode: "pack-declared" };
}
// Judged lines: a human or model judgement is accepted only with evidence that exists in this pack and matches the line's evidence type.
export function evalJudged(id, evidenceType, pack) {
  const j = pack.judgements?.[id];
  if (!j) return { level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: no judgement recorded" };
  const ids = artifactIds(pack), kinds = Object.fromEntries((pack.artifacts || []).map((a) => [a.id, a.kind]));
  if (![0, 1, 2, 3, 4].includes(j.level)) return { level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: judgement level not 0 to 4" };
  if (typeof j.judge !== "string" || !j.judge.trim()) return { level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: judgement has no named judge" };
  if (!Array.isArray(j.evidenceIds) || !j.evidenceIds.length || !j.evidenceIds.every((e) => ids.has(e))) return { level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: judgement cites evidence that is not in this pack" };
  if (evidenceType && !j.evidenceIds.some((e) => kinds[e] === evidenceType)) return { level: "U", evidenceIds: [], findings: [], reason: `UNMEASURED: line needs ${evidenceType} evidence` };
  return { level: j.level, evidenceIds: j.evidenceIds, findings: j.level < 3 ? [j.note || "judged below pass"] : [], judge: j.judge };
}

// Contribution = weight * level / 4.
export function scoreLevels(rubric, levels, applicable = true, openP0 = 0) {
  let supported = 0, evaluated = 0, belowPass = 0;
  for (const l of rubric.lines) { const lv = levels[l.id]; if (lv !== undefined && lv !== "U" && lv !== "NA") { supported += (l.weight * lv) / 4; evaluated += l.weight; if (lv < l.passAt) belowPass++; } }
  const coverage = evaluated / 100;
  return { supportedPoints: +supported.toFixed(2), coverage: +coverage.toFixed(2), grade: +supported.toFixed(2), verdict: openP0 > 0 ? "BLOCKED" : belowPass > 0 || coverage < 1 ? "CONDITIONAL" : "PASS",
    interval: { low: +supported.toFixed(2), high: +(supported + (100 - evaluated)).toFixed(2), note: "low treats UNMEASURED as 0, high as full credit" } };
}
const key = (...p) => crypto.createHash("sha256").update(p.join("|")).digest("hex").slice(0, 16);

// A case inventory belongs to the approved profile. Each observation cites the live build
// and an artifact of the line's declared kind. Incomplete coverage earns U.
const nonblank = value => typeof value === "string" && value.trim().length > 0;
const receiptTypes = {
  text: nonblank, count: value => Number.isSafeInteger(value) && value >= 0,
  positive: value => Number.isSafeInteger(value) && value > 0,
  number: Number.isFinite, bool: value => typeof value === "boolean",
  sha256: value => typeof value === "string" && /^[a-f0-9]{64}$/i.test(value),
  color: value => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
};
function receiptLevel(rule, line, pack, profile, previous) {
  const inventory = profile.cases?.[rule.name], rows = pack.receipts?.[rule.name];
  const missing = reason => ({ level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: " + rule.name + " " + reason });
  const keyed = entries => Array.isArray(entries) && entries.length > 0 &&
    entries.every(e => nonblank(e?.id)) && new Set(entries.map(e => e.id)).size === entries.length;
  if (!keyed(inventory) || !keyed(rows) || rows.length !== inventory.length) return missing("needs one row for each approved case");
  const cases = new Map(inventory.map(e => [e.id, e]));
  const artifacts = new Map(pack.artifacts.map(a => [a.id, a.kind]));
  const evidenceIds = new Set(previous.evidenceIds);
  const findings = [...previous.findings];
  let level = previous.level;
  for (const row of rows) {
    const target = cases.get(row.id);
    if (!target || row.liveSha !== pack.liveSha || row.status === "NOT_RUN" || artifacts.get(row.artifact) !== line.evidence) return missing("needs a current " + line.evidence + " for " + row.id);
    evidenceIds.add(row.artifact);
    for (const [field, type] of Object.entries(rule.fields)) {
      const valid = type.startsWith("artifact:") ? artifacts.get(row[field]) === type.slice(9) : receiptTypes[type](row[field]);
      if (!valid) return missing(row.id + " needs " + field + " (" + type + ")");
      if (type.startsWith("artifact:")) evidenceIds.add(row[field]);
    }
    for (const [field, op, targetValue, cap] of rule.tests) {
      const match = typeof targetValue === "string" && /^(case|row|profile|pack)\.(.+)$/.exec(targetValue);
      const expected = match ? getPath({case: target, row, profile, pack}, targetValue) : targetValue;
      const actual = row[field];
      if (typeof actual !== typeof expected || !observed(expected)) return missing(row.id + " needs a comparable " + targetValue);
      if (!OPS[op](actual, expected)) {
        findings.push(rule.name + "/" + row.id + ": " + field + " fails " + op + " " + targetValue);
        level = Math.min(level, cap);
      }
    }
  }
  return { ...previous, level, findings, evidenceIds: [...evidenceIds] };
}


export function grade(LENS, pack, profileOverride) {
  const R = LENS.rubric, bad = validatePack(pack);
  const head = { templateId: R.id, rubricVersion: R.version, rubricHash: R.hash, engine: { kit: KIT_VERSION, lens: LENS.lensVersion }, evidenceNote: "Computed lines trust pack.metrics as declared by the pack writer; artifact ids must exist in pack.artifacts, but metric values are not re-hashed or re-measured by the engine." };
  if (bad) return { ...head, packId: pack?.packId ?? null, gitSha: pack?.gitSha ?? null, liveSha: pack?.liveSha ?? null, applicable: true, lines: [], supportedPoints: 0, coverage: 0, grade: null, verdict: "INVALID", reason: bad };
  const profile = { ...(pack.profile || {}), ...(profileOverride || {}) };
  const base = { ...head, packId: pack.packId, gitSha: pack.gitSha, liveSha: pack.liveSha, synthetic: !!pack.synthetic };
  if (LENS.applicability) { const v = getPath(pack.metrics || {}, LENS.applicability.path); if (v === false || v === undefined || v === null) return { ...base, applicable: false, lines: [], supportedPoints: 0, coverage: 0, grade: null, verdict: "PASS", reason: `N/A: ${LENS.applicability.gate}` }; }
  const levels = {}, lines = [], tickets = [];
  // Approved rubric profile (for example single-language): reweights lines; a weight-0 line is N/A by profile and never a defect.
  const pname = profile.rubricProfile, pw = pname && R.profiles?.[pname]?.weights;
  if (pname && !pw) return { ...base, applicable: true, lines: [], supportedPoints: 0, coverage: 0, grade: null, verdict: "INVALID", reason: `unknown rubric profile ${pname}` };
  const RL = R.lines.map((l) => (pw && l.id in pw ? { ...l, weight: pw[l.id] } : l)), RW = { ...R, lines: RL };
  for (const rl of RL) {
    if (rl.weight === 0) { levels[rl.id] = "NA"; lines.push({ id: rl.id, kind: "profile", level: "NA", evidenceIds: [], findings: [], reason: `N/A by approved rubric profile ${pname}` }); continue; }
    const spec = LENS.lines[rl.id];
    let r = !spec ? { level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: no lens for this line" } : spec.kind === "judged" ? evalJudged(rl.id, rl.evidence, pack) : evalComputed(spec, pack, profile, R.sampleFields, rl.id, rl.evidence);
    for (const rule of rl.receipts || []) {
      if (r.level === "U") break;
      r = receiptLevel(rule, rl, pack, profile, r);
    }
    levels[rl.id] = r.level; lines.push({ id: rl.id, kind: spec?.kind ?? "none", ...r });
    if (typeof r.level === "number" && r.level < rl.passAt) tickets.push({ key: key(R.id, rl.id, r.findings[0] || ""), lineId: rl.id, level: r.level, finding: r.findings[0] || "", evidenceIds: r.evidenceIds, state: "candidate" });
  }
  const checks = Object.entries(LENS.checks || {}).map(([id, spec]) => { const r = evalComputed(spec, pack, profile, R.sampleFields); if (typeof r.level === "number" && r.level < 3) tickets.push({ key: key(R.id, id, r.findings[0] || ""), checkId: id, level: r.level, finding: r.findings[0] || "", evidenceIds: r.evidenceIds, state: "candidate" }); return { id, areas: spec.areas || [], pass: typeof r.level === "number" ? r.level >= 3 : null, ...r }; });
  const blocking = [], unmeasuredBlockers = [];
  for (const rule of R.releaseBlockers || []) {
    // Evaluate the safety evidence independently. A missing sibling metric cannot hide measured loss.
    const result = evalComputed({ conds: [rule.condition] }, pack, profile, R.sampleFields, rule.line, rule.evidence);
    if (result.level === "U") unmeasuredBlockers.push(rule.id);
    else if (result.findings.length) blocking.push({ id: rule.id, reason: rule.reason, evidenceIds: result.evidenceIds });
  }
  const score = scoreLevels(RW, levels, true, pack.openP0 || 0);
  if (blocking.length) { score.verdict = "BLOCKED"; score.grade = 0; }
  else if (unmeasuredBlockers.length && score.verdict === "PASS") score.verdict = "CONDITIONAL";
  return { ...base, applicable: true, lines, ...(pname ? { rubricProfile: pname } : {}), ...score, ...(R.releaseBlockers?.length ? { blocking, unmeasuredBlockers } : {}), checks, tickets };
}

// ---------- fixtures ----------
export function mutations(LENS, good) {
  const cases = [];
  const all = [...Object.entries(LENS.lines).map(([id, s]) => [id, s]), ...Object.entries(LENS.checks || {}).map(([id, s]) => [id, s])];
  for (const [id, s] of all) {
    if (s.kind === "judged") {
      cases.push({ id: `${id}#empty`, line: id, expect: "U", set: { [`judgements.${id}.evidenceIds`]: [] } });
      continue;
    }
    const { groups, paths } = inputs(s);
    const empty = new Map();
    for (const path of paths) if (Array.isArray(getPath(good.metrics, path))) empty.set(path, []);
    for (const group of groups) for (const field of LENS.rubric.sampleFields?.[group] || ["measuredCases"]) {
      const path = `${group}.${field}`;
      empty.set(path, Array.isArray(getPath(good.metrics, path)) ? [] : 0);
    }
    for (const [path, value] of empty) cases.push({ id: `${id}#empty-${path}`, line: id, expect: "U", set: { [`metrics.${path}`]: value } });
    for (const [i, n] of (s.neg || []).entries()) cases.push({ id: `${id}#neg${i + 1}`, line: id, expect: "fail", areas: s.areas || [], set: n });
    const first = s.miss || s.conds.map((c) => String(c[0]).match(/(?<![\w.])(?!P\.)[a-zA-Z]\w*\.[\w.]+/)?.[0]).find(Boolean);
    if (first) cases.push({ id: `${id}#missing`, line: id, expect: "U", areas: [], del: [`metrics.${first}`] });
  }
  for (const line of LENS.rubric.lines) for (const rule of line.receipts || []) {
    const path = "receipts." + rule.name;
    const common = { line: line.id, expect: "U" };
    cases.push({ ...common, id: rule.name + "#missing-row", set: { [path]: good.receipts[rule.name].slice(1) } });
    cases.push({ ...common, id: rule.name + "#stale", set: { [path + ".0.liveSha"]: "other-build" } });
    cases.push({ ...common, id: rule.name + "#artifact", set: { [path + ".0.artifact"]: "unknown-artifact" } });
  }
  for (const line of Object.keys(LENS.lines)) for (const fixture of LENS.lines[line].cases || []) cases.push({ ...fixture, line });
  for (const rule of LENS.rubric.releaseBlockers || []) {
    cases.push({ id: rule.id, line: rule.line, expect: "BLOCKED", set: rule.fixture });
  }
  return { note: "Generated from the lens spec. Measured failures drop below pass. Empty or missing samples give U. Release-blocker cases require BLOCKED and grade 0.", cases };
}
export function applyCase(good, c) { const p = JSON.parse(JSON.stringify(good)); for (const [k, v] of Object.entries(c.set || {})) setPath(p, k, v); for (const k of c.del || []) setPath(p, k, "__DELETE__"); return p; }
export function runFixtures(LENS, good, { line = null } = {}) {
  const fails = [], lv = (rec, id) => (rec.lines.find((l) => l.id === id) || rec.checks?.find((c) => c.id === id))?.level;
  const base = grade(LENS, good);
  if (base.verdict !== "PASS") fails.push(`good pack refused: ${base.reason}`);
  for (const [id, s] of Object.entries(LENS.lines)) if (line === null || line === id) { const v = lv(base, id); if (s.kind !== "judged" && v !== "NA" && !(typeof v === "number" && v >= 3)) fails.push(`good pack should pass ${id}, got ${v}`); }
  const cases = mutations(LENS, good).cases.filter((c) => line === null || c.line === line);
  if (!cases.length) fails.push(`no fixtures for ${line ?? "suite"}`);
  for (const c of cases) {
    const result = grade(LENS, applyCase(good, c));
    if (c.expect === "BLOCKED") {
      if (result.verdict !== "BLOCKED" || result.grade !== 0 || !result.blocking?.some(b => b.id === c.id)) {
        fails.push(`${c.id}: measured safety failure must block with grade 0`);
      }
      continue;
    }
    const got = lv(result, c.line);
    const ok = c.expect === "fail" ? typeof got === "number" && got < 3 : got === c.expect;
    if (!ok) fails.push(`${c.id}: expected ${c.expect}, got ${got}`);
  }
  for (const [label, mut] of [["INVALID status", { status: "INVALID" }], ["no liveSha", { liveSha: null }], ["no pack id", { packId: null }]]) { const r = grade(LENS, { ...good, ...mut }); if (r.verdict !== "INVALID" || r.grade !== null) fails.push(`NEGATIVE: ${label} must be refused`); }
  for (const [id, s] of Object.entries(LENS.lines)) if (s.kind === "judged" && (!line || line === id)) { const p = JSON.parse(JSON.stringify(good)); p.judgements = p.judgements || {}; p.judgements[id] = { level: 4, judge: "fixture", evidenceIds: ["made-up-artifact-id"] }; if (lv(grade(LENS, p), id) !== "U") fails.push(`NEGATIVE: judged ${id} accepted an evidence id not in the pack`); }
  for (const [pn, pd] of Object.entries(LENS.rubric.profiles || {})) if (!line) { const r = grade(LENS, { ...good, profile: { ...(good.profile || {}), rubricProfile: pn } }); const zero = Object.entries(pd.weights).filter(([, w]) => w === 0).map(([k]) => k); if (r.verdict === "INVALID" || !zero.every((z) => r.lines.find((l) => l.id === z)?.level === "NA")) fails.push(`NEGATIVE: rubric profile ${pn} must mark ${zero.join(", ")} N/A`); }
  if (LENS.applicability && !line) { const p = JSON.parse(JSON.stringify(good)); setPath(p.metrics, LENS.applicability.path, "__DELETE__"); const r = grade(LENS, p); if (r.applicable !== false || r.grade !== null) fails.push("NEGATIVE: absent applicability input must give N/A with grade null"); }
  return { status: fails.length ? "FAIL" : "PASS", cases: cases.length, fails };
}


function inputs(spec) {
  const used = { groups: new Set(), paths: [], profile: [] };
  for (const [lhs, op, rhs] of spec.conds || []) {
    evalExpr(lhs, {}, {}, used);
    if (!UNARY.has(op)) evalExpr(rhs, {}, {}, used);
  }
  return used;
}

// ---------- CLI ----------
export function cli(LENS, metaUrl) {
  // Resolve both sides so spaces, Windows drive letters, and symlinks compare equal.
  if (path.resolve(process.argv[1] || "") !== fileURLToPath(metaUrl)) return;
  const a = process.argv.slice(2), get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
  if (a[0] === "--meta") {
    const lines = Object.fromEntries(Object.entries(LENS.lines).map(([k, v]) => {
      const rl = (LENS.rubric.lines || []).find((l) => l.id === k) || {};
      const { groups, paths, profile } = inputs(v);
      const populations = [...groups].flatMap(g => (LENS.rubric.sampleFields?.[g] || ["measuredCases"]).map(f => g + "." + f));
      return [k, { ...(rl.receipts ? { receipts: rl.receipts } : {}), weight: rl.weight, fields: [...new Set([...paths, ...populations])], profile: [...new Set(profile)], kind: v.kind, areas: v.areas || [], why: v.why || "", name: rl.name || "", level4: rl.level4 || "", level0: rl.level0 || "" }];
    }));
    console.log(JSON.stringify({ templateId: LENS.rubric.id, lensVersion: LENS.lensVersion, lines, checks: Object.fromEntries(Object.entries(LENS.checks || {}).map(([k, v]) => [k, { areas: v.areas || [], why: v.why || "" }])) }, null, 1));
    return;
  }
  if (a[0] === "--mutations") { console.log(JSON.stringify(mutations(LENS, JSON.parse(fs.readFileSync(a[1], "utf8"))), null, 1)); return; }
  if (a[0] === "--fixtures" || a[0] === "--selftest") {
    if (!a[1]) { console.error("usage: node engine/lens.mjs --fixtures <good-pack.json>"); process.exit(2); }
    const r = runFixtures(LENS, JSON.parse(fs.readFileSync(a[1], "utf8")));
    console.log(JSON.stringify(r, null, 1));
    if (r.status !== "PASS") process.exit(1);
    return;
  }
  if (!a[0]) { console.error("usage: node engine/lens.mjs <pack.json> [--profile profile.json] | --meta | --mutations <good-pack.json> | --fixtures <good-pack.json>"); process.exit(2); }
  try {
    const pack = JSON.parse(fs.readFileSync(a[0], "utf8"));
    const prof = get("--profile") ? JSON.parse(fs.readFileSync(get("--profile"), "utf8")) : null;
    console.log(JSON.stringify(grade(LENS, pack, prof), null, 1));
  } catch (error) {
    console.log(JSON.stringify({ ...grade(LENS, null), reason: error.message }, null, 1));
    process.exitCode = 1;
  }
}
