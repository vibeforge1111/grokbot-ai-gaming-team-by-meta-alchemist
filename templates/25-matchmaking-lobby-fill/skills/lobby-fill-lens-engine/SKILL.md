---
name: lobby-fill-lens-engine
description: "Use when you need to grade an evidence pack with this template's engine, list the fields, populations and profile keys it reads, or run the empty and negative controls."
---

> **Audit contract v1 (overrides everything below).** Created by @meta_alchemist (https://x.com/meta_alchemist).
> - Score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-25-matchmaking-lobby-fill v1.2.0). `node engine/lens.mjs <pack.json>` computes the grade; this skill only gathers evidence for it and never adds points of its own.
> - Missing evidence is UNMEASURED (0 points, not a defect). A step that did not run is NOT_RUN, never PASS. Never invent a measurement; label every worked example synthetic.
> - Thresholds and codes come from the owner's profile (`pack.profile`). Treat sample numbers as illustrative.
> - Grade a pack from its folder so lens-kit 1.3.1 can check artifact bytes and the producer receipt.
> Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

# Grade a local evidence pack

Save the bundled files below at their relative paths (Node 18+, no dependencies), then run from the template folder:

```sh
node engine/lens.mjs --meta                              # lines, fields, populations and profile keys
node engine/lens.mjs fixtures/good-pack.json             # worked example, synthetic, not a measurement
node engine/lens.mjs <pack.json>                         # a measured local pack
node tests/lens-negative-fixtures.mjs [--line <lineId>]  # negative and missing-input fixtures
node tests/run-all.mjs                                   # every test
```

Read the record in this order: `verdict` (PASS, CONDITIONAL, BLOCKED or INVALID), `grade` and `coverage`, then each line's `level` and `findings`. A pack that is not VALID or lacks `gitSha`, `liveSha` or `packId` is INVALID with no grade. The fixture runner exits 2 on a bare `--line`, an unknown line id or any other argument.

AUDIT CONTRACT V1. Grade only a pack with build identity, cited artifacts and measured populations. Empty or missing samples are UNMEASURED and earn 0 points. Keep the synthetic example labelled.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## Bundled files

### engine/lens-kit.mjs

```
// lens-kit v1.3.1: turns an evidence pack into contract v1 line levels. Zero dependencies, Node 18+.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Vendored byte for byte into each template as engine/lens-kit.mjs.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const KIT_VERSION = "1.3.1";
const LEVEL_FOR_FAIL = { zero: 0, h: 1, d: 2, 4: 3 };

// ---------- numeric and perceptual helpers (all pure) ----------
const num = (a) => (Array.isArray(a) && a.every(Number.isFinite) ? a : []);
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
export function multiAttackerMaxErr(examples, model = "simultaneous") {
  if (!Array.isArray(examples) || !examples.length) return undefined;
  let worst = 0;
  for (const e of examples) {
    if (!e || (e.model ?? "simultaneous") !== model || !Number.isFinite(e.hp) || e.hp <= 0 || !Number.isFinite(e.reportedTtkS) || e.reportedTtkS < 0) return undefined;
    let predicted;
    if (model === "simultaneous") {
      if (!Number.isFinite(e.damage) || e.damage <= 0 || !Number.isSafeInteger(e.attackers) || e.attackers <= 0 || !Number.isFinite(e.intervalS) || e.intervalS <= 0) return undefined;
      predicted = (Math.ceil(e.hp / (e.damage * e.attackers)) - 1) * e.intervalS;
    } else if (model === "event-ledger" && Array.isArray(e.events)) {
      let remaining = e.hp, previous = 0;
      for (const event of e.events) {
        if (!event || !Number.isFinite(event.timeS) || event.timeS < previous || !Number.isFinite(event.applied) || event.applied < 0) return undefined;
        previous = event.timeS;
        remaining -= event.applied;
        if (remaining <= 0 && predicted === undefined) predicted = event.timeS;
      }
    }
    if (!Number.isFinite(predicted)) return undefined;
    worst = Math.max(worst, Math.abs(predicted - e.reportedTtkS));
  }
  return worst;
}
export function shingles(s, n = 3) { const t = String(s).toLowerCase().replace(/\d+/g, "#"); const out = new Set(); for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n)); return out; }
export function jaccard(a, b) { const A = shingles(a), B = shingles(b); let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i || 1); }

// ---------- case rows (used by rubrics with rowBinding or receiptPolicy) ----------
const scalar = value => typeof value === "boolean" || Number.isFinite(value)
  || (typeof value === "string" && value.trim().length > 0);
const nonnegative = value => Number.isFinite(value) && value >= 0;
function validRows(rows) {
  return Array.isArray(rows) && rows.length > 0
    && rows.every(row => typeof row?.caseId === "string" && row.caseId.trim() && row.status !== "NOT_RUN")
    && new Set(rows.map(row => row.caseId)).size === rows.length;
}
function boundRow(row, binding, profile) {
  if (!row || !binding.fields.every(field => typeof row[field] === "string" && row[field].trim())) return false;
  for (const [field, key] of Object.entries(binding.profile ?? {})) {
    if (!scalar(profile[key]) || row[field] !== profile[key]) return false;
  }
  for (const [field, expected] of Object.entries(binding.values ?? {})) {
    if (row[field] !== expected) return false;
  }
  return (binding.distinct ?? []).every(([a, b]) => row[a] !== row[b]);
}
function share(rows, predicate) {
  if (!validRows(rows)) return undefined;
  const results = rows.map(predicate);
  if (results.includes(undefined)) return undefined;
  return results.filter(result => result === true).length / rows.length;
}
function equalValue(a, b) {
  if (scalar(a) && scalar(b) && typeof a === typeof b) return a === b;
}
// A witnessed failure remains blocking even if a separate outcome is unknown.
function observedFailure(rows, key, value) {
  if (!Array.isArray(rows) || !rows.length) return undefined;
  if (rows.some(row => typeof row?.caseId === "string" && row.caseId.trim() && row.status !== "NOT_RUN" && row[key] === value)) return true;
  if (validRows(rows) && rows.every(row => equalValue(row[key], value) !== undefined)) return false;
}

export const FNS = {
  equalShare: (rows, expected, actual) => share(rows, row => equalValue(row[expected], row[actual])),
  valueShare: (rows, field, value) => share(rows, row => equalValue(row[field], value)),
  elapsedShare: (rows, start, end, budget) => share(rows, row => {
    if (nonnegative(budget) && nonnegative(row[start]) && nonnegative(row[end]) && row[end] >= row[start]) {
      return row[end] - row[start] <= budget;
    }
  }),
  withinShare: (rows, field, limits, roleField) => share(rows, row => {
    const limit = roleField ? limits?.[row[roleField]] : limits;
    if (nonnegative(row[field]) && nonnegative(limit)) return row[field] <= limit;
  }),
  observedFailure,
  p50: (a) => pct(a, 50), p95: (a) => pct(a, 95), p99: (a) => pct(a, 99), max: (a) => (num(a).length ? Math.max(...num(a)) : undefined), min: (a) => (num(a).length ? Math.min(...num(a)) : undefined),
  mean: (a) => (num(a).length ? num(a).reduce((s, v) => s + v, 0) / num(a).length : undefined), sum: (a) => num(a).reduce((s, v) => s + v, 0), len: (a) => (Array.isArray(a) ? a.length : a && typeof a === "object" ? Object.keys(a).length : undefined),
  countTrue: (a) => (Array.isArray(a) ? a.filter(Boolean).length : undefined), countFalse: (a) => (Array.isArray(a) ? a.filter((x) => !x).length : undefined),
  countEq: (a, v) => (Array.isArray(a) ? a.filter((x) => x === v).length : undefined), countGt: (a, v) => (Array.isArray(a) ? num(a).filter((x) => x > v).length : undefined), countLt: (a, v) => (Array.isArray(a) ? num(a).filter((x) => x < v).length : undefined),
  absdiff: (a, b) => Math.abs(a - b), diff: (a, b) => a - b, ratio: (a, b) => (b ? a / b : undefined), slope, wilsonLow: (k, n) => wilson(k, n)?.[0], wilsonWidth: (k, n) => { const w = wilson(k, n); return w && w[1] - w[0]; },
  contrastMin: (pairs) => (Array.isArray(pairs) && pairs.length ? Math.min(...pairs.map(([f, b]) => contrast(f, b))) : undefined), cvdMinDeltaE, deltaEMax: (pairs) => (Array.isArray(pairs) && pairs.length ? Math.max(...pairs.map(([a, b]) => deltaE(a, b))) : undefined),
  flashesPerSecondMax, outlierCount: (pts, k, m) => knnOutliers(pts, k, m)?.length, injectedCaught: (pts, idx) => { const o = knnOutliers(pts); return o && (idx || []).every((i) => o.includes(i)); },
  multiAttackerMaxErr, missing: (have, need) => (Array.isArray(have) && Array.isArray(need) ? need.filter((x) => !have.includes(x)).length : undefined),
  extra: (have, allowed) => (Array.isArray(have) && Array.isArray(allowed) ? have.filter((x) => !allowed.includes(x)).length : undefined),
  dupCount: (a) => (Array.isArray(a) ? a.length - new Set(a.map((x) => JSON.stringify(x))).size : undefined),
  allEq: (a) => (Array.isArray(a) && a.length ? a.length >= 2 && a.every((x) => JSON.stringify(x) === JSON.stringify(a[0])) : undefined),
  countWhere: (a, key) => (Array.isArray(a) ? a.filter((x) => x && x[key]).length : undefined), countWhereNot: (a, key) => (Array.isArray(a) ? a.filter((x) => !(x && x[key])).length : undefined),
  maxOf: (a, key) => (Array.isArray(a) && a.length ? Math.max(...a.map((x) => Number(x?.[key]))) : undefined), minOf: (a, key) => (Array.isArray(a) && a.length ? Math.min(...a.map((x) => Number(x?.[key]))) : undefined),
  countFieldsEq: (a, k1, k2) => (Array.isArray(a) ? a.filter((x) => x && x[k1] === x[k2]).length : undefined),
  maxSimilarDistinct: (pairs) => (Array.isArray(pairs) ? pairs.filter((p) => !p.sameRoot && p.autoMerged).length : undefined),
  coversTasks: (rows, devices, tasks) => devices.every(device =>
    tasks.every(task => rows.some(row => row.device === device && row.task === task))),
  creatorLogComplete: rows => {
    if (!Array.isArray(rows) || rows.some(row => !row || !nonblank(row.observedOn) || !nonblank(row.sourceRef) || !nonblank(row.reason))) return undefined;
    if (rows.some(row => row.sourceOpened !== true)) return undefined;
    return rows.every(row => row.reviewed === true);
  },
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
  if (pack.openP0 != null && (!Number.isSafeInteger(pack.openP0) || pack.openP0 < 0)) return "invalid open P0 population";
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
  try {
    const value = fn(...args);
    return observed(value) ? value : undefined;
  } catch (error) {
    if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
    return undefined;
  }
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
export function evalComputed(spec, pack, profile, sampleFields = {}, line, evidenceType, receiptPolicy, receiptFields = []) {
  const used = { groups: new Set(), paths: [], profile: [] }, findings = [];
  let level = 4, missing = spec.conds.length ? null : "no measured conditions";
  if (spec.rowBinding) {
    const binding = spec.rowBinding;
    const rows = pack.metrics?.[binding.group]?.samples;
    if (!validRows(rows) || !rows.every(row => boundRow(row, binding, profile))) {
      missing = `metrics.${binding.group} needs the declared case provenance`;
    }
  }
  for (const c of spec.conds) {
    const [lhs, op, rhs, tier = "d"] = c;
    const a = evalExpr(lhs, pack, profile, used), b = UNARY.has(op) ? undefined : evalExpr(rhs, pack, profile, used);
    if (a === undefined || (!UNARY.has(op) && b === undefined)) { missing = missing || `${lhs}${UNARY.has(op) ? "" : ` or ${rhs}`} not in pack`; continue; }
    if ((["<", "<=", ">", ">="].includes(op) && (!Number.isFinite(a) || !Number.isFinite(b))) ||
        (["true", "false"].includes(op) && typeof a !== "boolean")) {
      missing ||= `invalid measured type for ${lhs}`;
      continue;
    }
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
      const minCases = profile?.bands?.minCases;
      if (Number.isSafeInteger(minCases) && minCases >= 1) {
        const observedCount = Array.isArray(value)
          ? value.filter(row => typeof row?.caseId === "string" && row.caseId.trim() && row.status !== "NOT_RUN").length
          : (Number.isSafeInteger(count) ? count : 0);
        if (observedCount < minCases) {
          missing ||= `metrics.${g}.${field} has ${observedCount} observed case(s); profile.bands.minCases requires ${minCases}`;
        }
      }
    }
    const artifact = group?.artifactsByLine?.[line] ?? group?.artifact;
    if (ids.has(artifact)) ev.push(artifact);
    else missing ||= `metrics.${g} has no artifact id present in pack.artifacts`;
    if (receiptPolicy === "build-scope-line-v1") {
      const receipt = pack.artifacts.find(item => item.id === artifact);
      const boundContext = receiptFields.every(field => scalar(profile[field])
        && receipt?.context?.[field] === profile[field]);
      if (!receipt || group?.status === "NOT_RUN" || receipt.status === "NOT_RUN" || !boundContext || typeof receipt.source !== "string" || !receipt.source.trim()
          || receipt.gitSha !== pack.gitSha || receipt.liveSha !== pack.liveSha
          || typeof profile.scope !== "string" || !profile.scope.trim()
          || receipt.scope !== profile.scope || receipt.lineId !== line) {
        missing ||= `metrics.${g} needs a receipt for this build, scope and line`;
      }
    }
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
  ids: value => Array.isArray(value) && value.length > 0 && value.every(nonblank) && new Set(value).size === value.length,
  samples: value => Array.isArray(value) && value.length > 0 && value.every(x => Number.isFinite(x) && x >= 0),
  text: nonblank, count: value => Number.isSafeInteger(value) && value >= 0,
  positive: value => Number.isSafeInteger(value) && value > 0,
  number: Number.isFinite, bool: value => typeof value === "boolean",
  sha256: value => typeof value === "string" && /^[a-f0-9]{64}$/i.test(value),
  color: value => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
};
function receiptLevel(rule, line, pack, profile, previous) {
  const inventory = profile.cases?.[rule.name], rows = pack.receipts?.[rule.name];
  const missing = reason => ({ level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: " + rule.name + " " + reason });
  if (rule.inventorySource) {
    const exportRecord = pack.populations?.[rule.name];
    if (exportRecord?.source !== "read-only-export" || exportRecord.liveSha !== pack.liveSha ||
        !pack.artifacts.some(a => a.id === exportRecord.artifact && a.kind === rule.inventorySource) ||
        !Number.isSafeInteger(exportRecord.count) || exportRecord.count < 0) return missing("needs the reviewed intake export");
    if (!Array.isArray(inventory) || exportRecord.count !== inventory.length) return missing("case list disagrees with intake export");
    const memberRows = getPath({ metrics: pack.metrics }, rule.members.path);
    if (!exportRecord.count && Array.isArray(rows) && rows.length === 0 && Array.isArray(memberRows) && memberRows.length === 0) {
      return missing("has a verified empty intake export; zero executed cases");
    }
  }
  const keyed = entries => Array.isArray(entries) && entries.length > 0 &&
    entries.every(e => nonblank(e?.id)) && new Set(entries.map(e => e.id)).size === entries.length;
  if (!keyed(inventory) || !keyed(rows) || rows.length !== inventory.length) return missing("needs one row for each approved case");
  const context = { profile, metrics: pack.metrics };
  if (rule.population) {
    const source = getPath(context, rule.population);
    if (rows.length !== (Array.isArray(source) ? source.length : source)) return missing("does not match the measured population");
  }
  if (rule.members) {
    const { path, field, caseField } = rule.members;
    const source = getPath(context, path);
    const keys = inventory.map(c => c[caseField]);
    if (!Array.isArray(source) || source.length !== keys.length || new Set(keys).size !== keys.length ||
        !keys.every(k => source.some(record => record?.[field] === k))) return missing("does not match the source case IDs");
  }
  if (rule.axes) {
    const axes = Object.entries(rule.axes);
    let size = 1;
    for (const [field, source] of axes) {
      const axis = getPath(context, source);
      if (!Array.isArray(axis) || !axis.length || new Set(axis).size !== axis.length ||
          !rows.every(row => axis.includes(row[field]))) return missing("needs the approved " + field + " axis");
      size *= axis.length;
    }
    const combinations = rows.map(row => JSON.stringify(axes.map(([field]) => row[field])));
    if (rows.length !== size || new Set(combinations).size !== size) return missing("needs the complete case matrix");
  }
  if (previous.level === "U") return previous;
  const cases = new Map(inventory.map(e => [e.id, e]));
  const artifacts = new Map(pack.artifacts.map(a => [a.id, a.kind]));
  const evidenceIds = new Set(previous.evidenceIds);
  if (rule.inventorySource) evidenceIds.add(pack.populations[rule.name].artifact);
  const findings = [...previous.findings];
  let level = previous.level;
  const mismatched = new Set();
  let mismatchCap = 3;
  for (const entry of rows) {
    const row = { ...entry };
    const target = cases.get(row.id);
    if (!target || row.liveSha !== pack.liveSha || (row.status !== undefined && row.status !== "RUN") || artifacts.get(row.artifact) !== line.evidence) return missing("needs a current " + line.evidence + " for " + row.id);
    evidenceIds.add(row.artifact);
    for (const [field, type] of Object.entries(rule.fields)) {
      const valid = type.startsWith("artifact:") ? artifacts.get(row[field]) === type.slice(9) : receiptTypes[type](row[field]);
      if (!valid) return missing(row.id + " needs " + field + " (" + type + ")");
      if (type.startsWith("artifact:")) evidenceIds.add(row[field]);
    }
    for (const [field, [fn, left, right]] of Object.entries(rule.derive || {})) {
      const operations = { last: list => list.at(-1), ancestorBehind: (chain, live) => chain.includes(live) ? live !== chain.at(-1) : undefined, p95: FNS.p95, length: a => a.length, contrast, deltaE, diff: FNS.diff, ratio: FNS.ratio, absdiff: FNS.absdiff, different: (a, b) => a !== b };
      row[field] = operations[fn](row[left], row[right]);
    }
    for (const [field, op, targetValue, cap] of rule.tests) {
      const match = typeof targetValue === "string" && /^(case|row|profile|pack)\.(.+)$/.exec(targetValue);
      const expected = match ? getPath({case: target, row, profile, pack}, targetValue) : targetValue;
      const actual = row[field];
      if (typeof actual !== typeof expected || !observed(expected)) return missing(row.id + " needs a comparable " + targetValue);
      if (!OPS[op](actual, expected)) {
        findings.push(rule.name + "/" + row.id + ": " + field + " fails " + op + " " + targetValue);
        if (rule.matchRate?.fields.includes(field)) {
          mismatched.add(row.id);
          mismatchCap = Math.min(mismatchCap, cap);
        } else level = Math.min(level, cap);
      }
    }
  }
  if (rule.matchRate) {
    const minimum = getPath(context, rule.matchRate.minimum), matched = rows.length - mismatched.size;
    if (!Number.isFinite(minimum) || minimum < 0 || minimum > 1) return missing("needs a match rate between zero and one");
    if (getPath(context, rule.matchRate.matched) !== matched) {
      findings.push(rule.name + ": reported matches disagree with decoded events");
      level = Math.min(level, 1);
    } else if (mismatched.size) level = Math.min(level, matched / rows.length >= minimum ? 3 : mismatchCap);
  }
  if (rule.spread) {
    const maximum = getPath(context, rule.spread.maximum);
    if (rows.length < 2 || !Number.isFinite(maximum)) return missing("needs two devices and an approved spread");
    const values = rows.map(row => row[rule.spread.field]);
    if (Math.max(...values) - Math.min(...values) > maximum) {
      findings.push(rule.name + ": measured device spread exceeds the approved maximum");
      level = Math.min(level, 1);
    }
  }
  return { ...previous, level, findings, evidenceIds: [...evidenceIds] };
}


// Non-synthetic packs identify a producer's reviewed profile and the local artifact bytes.
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
function hashFile(file) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(file, "r"), buffer = Buffer.alloc(65536);
  try {
    let length;
    while ((length = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, length));
    return hash.digest("hex");
  } finally { fs.closeSync(fd); }
}
function verifyLive(pack, profile, directory) {
  if (pack.synthetic === true) return null;
  const r = pack.producerReceipt;
  if (!r || r.schema !== "game-evidence-v1" || !nonblank(r.producer) || !nonblank(r.profileId) ||
      r.packId !== pack.packId || r.gitSha !== pack.gitSha || r.liveSha !== pack.liveSha) return "missing or incompatible producer receipt";
  if (!directory) return "local evidence directory required to verify artifact bytes";
  const digest = value => crypto.createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
  if (r.artifactsSha256 !== digest(pack.artifacts)) return "artifact manifest differs from producer receipt";
  if (r.profileSha256 !== digest(profile)) return "profile differs from producer receipt";
  if (r.observationsSha256 !== digest([pack.metrics ?? {}, pack.receipts ?? {}, pack.judgements ?? {}, pack.populations ?? {}, pack.openP0 ?? 0])) return "observations differ from producer receipt";
  if (!nonblank(r.device) || !nonblank(r.hook) || !pack.artifacts.some(a => a.id === r.gameplayArtifact && ["capture", "trace"].includes(a.kind))) return "missing gameplay sample, hook or device";
  try {
    const root = fs.realpathSync(directory);
    for (const a of pack.artifacts) {
      if (!nonblank(a.path) || path.isAbsolute(a.path) || !/^[a-f0-9]{64}$/i.test(a.sha256 || "")) return "missing artifact path or SHA-256";
      const file = fs.realpathSync(path.resolve(root, a.path));
      const rel = path.relative(root, file);
      if (!rel || rel.startsWith(".." + path.sep) || rel === ".." || path.isAbsolute(rel) || !fs.statSync(file).isFile()) return "artifact outside local evidence files";
      if (hashFile(file) !== a.sha256.toLowerCase()) return "artifact bytes differ from producer receipt";
    }
  } catch { return "artifact file unavailable"; }
  return null;
}


// Approved rubric profiles mark lines (and, optionally, release blockers) not applicable before scoring.
// Rule: inside a pillar, the applicable line takes the pillar's points; when a whole pillar is not applicable,
// its points are shared out over the remaining lines in proportion to their weights. A single profile keeps
// the weights written in the rubric (the validator checks they follow this rule).
export function ruleWeights(R, notApplicable) {
  const w = Object.fromEntries(R.lines.map((l) => [l.id, l.weight]));
  let freed = 0;
  // Group by pillar; the engine's embedded rubric has no pillar names, and line ids are always "<pillar-slug>:<n>".
  const pillars = new Map();
  for (const l of R.lines) { const k = l.pillar ?? String(l.id).split(":")[0]; if (!pillars.has(k)) pillars.set(k, []); pillars.get(k).push(l); }
  for (const lines of pillars.values()) {
    const open = lines.filter((l) => !notApplicable.has(l.id));
    const total = lines.reduce((t, l) => t + l.weight, 0), current = open.reduce((t, l) => t + l.weight, 0);
    for (const l of lines) w[l.id] = notApplicable.has(l.id) ? 0 : current ? (l.weight * total) / current : 0;
    if (!open.length) freed += total;
  }
  const open = R.lines.filter((l) => w[l.id] > 0), current = open.reduce((t, l) => t + w[l.id], 0);
  if (!open.length) return null;
  if (freed) for (const l of open) w[l.id] = (w[l.id] * (current + freed)) / current;
  return w;
}
export function profileWeights(R, pname) {
  if (pname == null || pname === "" || (Array.isArray(pname) && !pname.length)) return { weights: null, names: [], offBlockers: new Set() };
  const names = [].concat(pname);
  const unknown = names.find((n) => typeof n !== "string" || !R.profiles?.[n]);
  if (unknown !== undefined) return { error: `unknown rubric profile ${unknown}` };
  const offBlockers = new Set(names.flatMap((n) => R.profiles[n].blockersNotApplicable || []));
  if (names.length === 1) return { weights: R.profiles[names[0]].weights, names, offBlockers };
  const na = new Set(names.flatMap((n) => Object.entries(R.profiles[n].weights).filter(([, w]) => w === 0).map(([id]) => id)));
  const weights = ruleWeights(R, na);
  return weights ? { weights, names, offBlockers } : { error: `rubric profiles ${names.join(", ")} leave no line to score` };
}

export function grade(LENS, pack, profileOverride, directory) {
  const profile = { ...(pack?.profile || {}), ...(profileOverride || {}) };
  const R = LENS.rubric, bad = validatePack(pack) || verifyLive(pack, profile, directory);
  const head = { templateId: R.id, rubricVersion: R.version, rubricHash: R.hash, engine: { kit: KIT_VERSION, lens: LENS.lensVersion }, evidenceNote: "Synthetic examples use declared artifacts. For a real pack the engine checks local artifact bytes and the producer receipt. Measurements and producer identity still require owner review." };
  if (bad) return { ...head, packId: pack?.packId ?? null, gitSha: pack?.gitSha ?? null, liveSha: pack?.liveSha ?? null, applicable: true, lines: [], supportedPoints: 0, coverage: 0, grade: null, verdict: "INVALID", reason: bad };
  const base = { ...head, packId: pack.packId, gitSha: pack.gitSha, liveSha: pack.liveSha, synthetic: !!pack.synthetic };
  if (LENS.applicability) { const v = getPath(pack.metrics || {}, LENS.applicability.path); if (v === false || v === undefined || v === null) return { ...base, applicable: false, lines: [], supportedPoints: 0, coverage: 0, grade: null, verdict: "PASS", reason: `N/A: ${LENS.applicability.gate}` }; }
  if (R.receiptPolicy === "build-scope-line-v1" && profile.bands != null) {
    const { floor, pass, target } = profile.bands;
    if ([floor, pass, target].some(value => !Number.isFinite(value)) || !(0 < floor && floor < pass && pass < target && target <= 1)) {
      return { ...base, applicable: true, lines: [], supportedPoints: 0, coverage: 0, grade: null,
        verdict: "INVALID", reason: "profile.bands requires 0 < floor < pass < target <= 1" };
    }
  }
  // Optional. When set, a line with fewer observed cases than minCases reads U.
  if (profile.bands != null && profile.bands.minCases != null) {
    const minCases = profile.bands.minCases;
    if (!Number.isSafeInteger(minCases) || minCases < 1) {
      return { ...base, applicable: true, lines: [], supportedPoints: 0, coverage: 0, grade: null,
        verdict: "INVALID", reason: "profile.bands.minCases must be a positive integer when set" };
    }
  }
  const levels = {}, lines = [], tickets = [];
  // Approved rubric profile (for example single-language): reweights lines; a weight-0 line is N/A by profile and never a defect.
  // Several profiles may be combined (for example ["no-aiming", "offline-only"]); see profileWeights.
  const pname = profile.rubricProfile, applied = profileWeights(R, pname), pw = applied.weights;
  if (applied.error) return { ...base, applicable: true, lines: [], supportedPoints: 0, coverage: 0, grade: null, verdict: "INVALID", reason: applied.error };
  const RL = R.lines.map((l) => (pw && l.id in pw ? { ...l, weight: pw[l.id] } : l)), RW = { ...R, lines: RL };
  for (const rl of RL) {
    if (rl.weight === 0) { levels[rl.id] = "NA"; lines.push({ id: rl.id, kind: "profile", level: "NA", evidenceIds: [], findings: [], reason: `N/A by approved rubric profile ${applied.names.join(", ")}` }); continue; }
    const spec = LENS.lines[rl.id];
    let r = !spec ? { level: "U", evidenceIds: [], findings: [], reason: "UNMEASURED: no lens for this line" } : spec.kind === "judged" ? evalJudged(rl.id, rl.evidence, pack) : evalComputed(spec, pack, profile, R.sampleFields, rl.id, rl.evidence, R.receiptPolicy, R.receiptFields);
    for (const rule of rl.receipts || []) {
      if (r.level === "U" && !rule.inventorySource) break;
      r = receiptLevel(rule, rl, pack, profile, r);
    }
    levels[rl.id] = r.level; lines.push({ id: rl.id, kind: spec?.kind ?? "none", ...r });
    if (typeof r.level === "number" && r.level < rl.passAt) tickets.push({ key: key(R.id, rl.id, r.findings[0] || ""), lineId: rl.id, level: r.level, finding: r.findings[0] || "", evidenceIds: r.evidenceIds, state: "candidate" });
  }
  const checks = Object.entries(LENS.checks || {}).map(([id, spec]) => { const r = evalComputed(spec, pack, profile, R.sampleFields); if (typeof r.level === "number" && r.level < 3) tickets.push({ key: key(R.id, id, r.findings[0] || ""), checkId: id, level: r.level, finding: r.findings[0] || "", evidenceIds: r.evidenceIds, state: "candidate" }); return { id, areas: spec.areas || [], pass: typeof r.level === "number" ? r.level >= 3 : null, ...r }; });
  const blocking = [], unmeasuredBlockers = [];
  // A blocker on a line that the approved rubric profile marks not applicable (weight 0) does not apply.
  for (const rule of (R.releaseBlockers || []).filter((b) => RL.find((l) => l.id === b.line)?.weight !== 0 && !applied.offBlockers.has(b.id))) {
    // Evaluate the safety evidence independently. A missing sibling metric cannot hide measured loss.
    const result = evalComputed({ conds: [rule.condition] }, pack, profile, R.sampleFields, rule.line, rule.evidence, R.receiptPolicy, R.receiptFields);
    if (result.level === "U") unmeasuredBlockers.push(rule.id);
    else if (result.findings.length) blocking.push({ id: rule.id, reason: rule.reason, evidenceIds: result.evidenceIds });
  }
  for (const line of RL) for (const rule of line.receipts || []) {
    if (!rule.blockOn || line.weight === 0) continue;
    const rows = pack.receipts?.[rule.name], cases = profile.cases?.[rule.name];
    if (!Array.isArray(rows) || !Array.isArray(cases)) continue;
    for (const row of rows) {
      if (!row || (row.status !== undefined && row.status !== "RUN") || row.liveSha !== pack.liveSha || !cases.some(c => c?.id === row.id) ||
          !pack.artifacts.some(a => a.id === row.artifact && a.kind === line.evidence)) continue;
      for (const [field, op, target] of rule.tests.filter(([field]) => rule.blockOn.includes(field))) {
        const expected = typeof target === "string" && target.startsWith("profile.") ? getPath(profile, target.slice(8)) : target;
        if (receiptTypes[rule.fields[field]](row[field]) && typeof row[field] === typeof expected && !OPS[op](row[field], expected)) {
          blocking.push({ id: rule.name + "/" + row.id + "/" + field, reason: rule.description, evidenceIds: [row.artifact] });
        }
      }
    }
  }
  if (R.receiptPolicy === "build-scope-line-v1" && pack.openP0 > 0) {
    blocking.push({ id: "open-p0", reason: "The pack reports an unresolved P0.", evidenceIds: [] });
  }
  const score = scoreLevels(RW, levels, true, pack.openP0 || 0);
  if (blocking.length) { score.verdict = "BLOCKED"; score.grade = 0; }
  else if (unmeasuredBlockers.length && score.verdict === "PASS") score.verdict = "CONDITIONAL";
  return { ...base, applicable: true, lines, ...(pname ? { rubricProfile: pname } : {}), ...score, ...(blocking.length || R.releaseBlockers?.length ? { blocking, unmeasuredBlockers } : {}), checks, tickets };
}

// ---------- fixtures ----------
// When a pack sets minCases, a one-row failure would read U. Repeat the provided rows so the fixture stays a measured miss.
function padMutationSet(set, minCases) {
  if (!(minCases >= 1) || !set) return set;
  const out = { ...set };
  for (const [key, value] of Object.entries(out)) {
    if (!Array.isArray(value) || value.length === 0 || value.length >= minCases) continue;
    if (!value.every(row => row && typeof row.caseId === "string" && row.caseId.trim())) continue;
    const padded = [...value];
    let i = 0;
    while (padded.length < minCases) {
      const src = value[i % value.length];
      i += 1;
      const row = { ...src, caseId: `${src.caseId}-x${padded.length + 1}` };
      if (typeof src.offerRef === "string" && src.offerRef) row.offerRef = `${src.offerRef}-x${padded.length + 1}`;
      padded.push(row);
    }
    out[key] = padded;
  }
  return out;
}

export function mutations(LENS, good) {
  const cases = [];
  const minCases = good?.profile?.bands?.minCases;
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
    for (const [i, n] of (s.neg || []).entries()) cases.push({ id: `${id}#neg${i + 1}`, line: id, expect: "fail", areas: s.areas || [], set: padMutationSet(n, minCases) });
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
    cases.push({ id: rule.id, line: rule.line, expect: "BLOCKED", set: padMutationSet(rule.fixture, minCases) });
  }
  if (LENS.rubric.receiptPolicy === "build-scope-line-v1") {
    cases.push({ id: "open-p0", line: null, expect: "BLOCKED", set: { openP0: 1 } });
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
  for (const [pn, pd] of Object.entries(LENS.rubric.profiles || {})) if (!line) {
    const r = grade(LENS, { ...good, profile: { ...(good.profile || {}), rubricProfile: pn } }); const zero = Object.entries(pd.weights).filter(([, w]) => w === 0).map(([k]) => k);
    if (r.verdict === "INVALID" || !zero.every((z) => r.lines.find((l) => l.id === z)?.level === "NA")) fails.push(`NEGATIVE: rubric profile ${pn} must mark ${zero.join(", ")} N/A`);
    for (const rule of LENS.rubric.releaseBlockers || []) {
      if (!zero.includes(rule.line) && !(pd.blockersNotApplicable || []).includes(rule.id)) continue;
      const mutated = applyCase(good, { set: rule.fixture });
      const blocked = grade(LENS, { ...mutated, profile: { ...(mutated.profile || {}), rubricProfile: pn } });
      if (blocked.blocking?.some((b) => b.id === rule.id)) fails.push(`NEGATIVE: release blocker ${rule.id} must not apply under rubric profile ${pn}`);
    }
  }
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
      return [k, { ...(rl.receipts ? { receipts: rl.receipts } : {}), weight: rl.weight, fields: [...new Set([...paths, ...populations])], profile: [...new Set(profile)], kind: v.kind, ...(v.rowBinding ? { rowBinding: v.rowBinding } : {}), areas: v.areas || [], why: v.why || "", name: rl.name || "", level4: rl.level4 || "", level0: rl.level0 || "" }];
    }));
    console.log(JSON.stringify({ templateId: LENS.rubric.id, lensVersion: LENS.lensVersion, ...(LENS.rubric.receiptFields ? { receiptFields: LENS.rubric.receiptFields } : {}), lines, checks: Object.fromEntries(Object.entries(LENS.checks || {}).map(([k, v]) => {
      const { groups, paths, profile } = inputs(v);
      const populations = [...groups].flatMap(g => (LENS.rubric.sampleFields?.[g] || ["measuredCases"]).map(f => g + "." + f));
      return [k, { areas: v.areas || [], why: v.why || "", fields: [...new Set([...paths, ...populations])], profile: [...new Set(profile)] }];
    })) }, null, 1));
    return;
  }
  if (a[0] === "--mutations") { console.log(JSON.stringify(mutations(LENS, JSON.parse(fs.readFileSync(a[1], "utf8"))), null, 1)); return; }
  if (a[0] === "--fixtures" || a[0] === "--selftest") {
    if (a.length !== 2 || !a[1]) { console.error("usage: node engine/lens.mjs --fixtures <good-pack.json>"); process.exit(2); }
    const r = runFixtures(LENS, JSON.parse(fs.readFileSync(a[1], "utf8")));
    console.log(JSON.stringify(r, null, 1));
    if (r.status !== "PASS") process.exit(1);
    return;
  }
  if (!a[0]) { console.error("usage: node engine/lens.mjs <pack.json> [--profile profile.json] | --meta | --mutations <good-pack.json> | --fixtures <good-pack.json>"); process.exit(2); }
  try {
    const pack = JSON.parse(fs.readFileSync(a[0], "utf8"));
    const prof = get("--profile") ? JSON.parse(fs.readFileSync(get("--profile"), "utf8")) : null;
    console.log(JSON.stringify(grade(LENS, pack, prof, path.dirname(path.resolve(a[0]))), null, 1));
  } catch (error) {
    console.log(JSON.stringify({ ...grade(LENS, null), reason: error.message }, null, 1));
    process.exitCode = 1;
  }
}
```

### engine/lens.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Data-only lens. Thresholds and populations are declared in the rubric and pack profile.
import { cli } from "./lens-kit.mjs";
export const LENS = {
  "lensVersion": "1.1.0",
  "rubric": {
    "id": "gbf-25-matchmaking-lobby-fill",
    "version": "1.2.0",
    "hash": "sha256:f79e06c8a8fb224341b91dd02f0be638e81dc4f8ddd485df58acb8b992bc0d78",
    "sampleFields": {
      "fill": [
        "regions",
        "regionHoursMeasured"
      ],
      "merge": [
        "proposals",
        "thinRegions"
      ],
      "bots": [
        "measuredCases"
      ],
      "wait": [
        "measuredCases"
      ],
      "device": [
        "measuredCases"
      ],
      "authority": [
        "forbiddenAttempted"
      ],
      "privacy": [
        "measuredCases"
      ],
      "latency": [
        "pairs"
      ]
    },
    "releaseBlockers": [],
    "lines": [
      {
        "id": "fill-measurement:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Humans and bots counted apart",
        "level4": "A full day of region-hours is measured from seat events, and no bot is ever counted as a human",
        "level0": "Bots counted as players, or no per-hour data"
      },
      {
        "id": "fill-measurement:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Thin regions found correctly",
        "level4": "The thin-region list matches an independent recount from the raw rows",
        "level0": "Thin regions missed or invented"
      },
      {
        "id": "proposals:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Merges respect the ping cap",
        "level4": "No merge over the ping cap or with unknown ping is proposed",
        "level0": "A merge over the cap was proposed"
      },
      {
        "id": "proposals:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Options with trade-offs",
        "level4": "Every thin region has two or more options, each with its cost in ping, bots or timing",
        "level0": "One option or none"
      },
      {
        "id": "bot-honesty:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Bots labelled, never counted as players",
        "level4": "Bots carry a label in the lobby and are never in the public player count",
        "level0": "Bots shown as players"
      },
      {
        "id": "bot-honesty:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Bot-heavy regions have a plan",
        "level4": "Every region over the bot share cap has a proposal in front of the owner",
        "level0": "Bot-heavy regions with no plan"
      },
      {
        "id": "wait-and-devices:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Queue wait",
        "level4": "Human queue wait p50 and p90 are inside the owner's limits",
        "level0": "Players wait past the limits"
      },
      {
        "id": "wait-and-devices:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Input group wait gap",
        "level4": "The configured input groups meet the wait-gap target and a dedicated queue has been considered.",
        "level0": "The primary group waits longer than the configured limit."
      },
      {
        "id": "safety-and-privacy:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Proposals only",
        "level4": "Every attempt to apply, rewrite or call a live change through the engine fails, and the engine has no network or write calls",
        "level0": "The director changed a live setting"
      },
      {
        "id": "safety-and-privacy:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "No personal data",
        "level4": "Personal rows are refused, no seat id reaches an output, and planted personal rows are caught",
        "level0": "Personal data in the data or the report"
      }
    ]
  },
  "lines": {
    "fill-measurement:1": {
      "kind": "computed",
      "areas": [],
      "why": "human and bot seats counted apart over enough region-hours",
      "conds": [
        [
          "fill.botsCountedAsHumans",
          "==",
          0,
          "h"
        ],
        [
          "fill.regionHoursMeasured",
          ">=",
          "P.minRegionHours"
        ],
        [
          "fill.regions",
          ">=",
          1
        ]
      ],
      "neg": [
        {
          "metrics.fill.botsCountedAsHumans": 3
        },
        {
          "metrics.fill.regionHoursMeasured": 4
        }
      ]
    },
    "fill-measurement:2": {
      "kind": "computed",
      "areas": [],
      "why": "thin list matches the oracle",
      "conds": [
        [
          "fill.thinMismatch",
          "==",
          0,
          "h"
        ],
        [
          "fill.thinListed",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.fill.thinMismatch": 1
        }
      ]
    },
    "proposals:1": {
      "kind": "computed",
      "areas": [],
      "why": "every merge under the cap",
      "conds": [
        [
          "merge.overCap",
          "==",
          0,
          "h"
        ],
        [
          "merge.unknownPingProposed",
          "==",
          0,
          "h"
        ],
        [
          "latency.pairs",
          ">=",
          1
        ]
      ],
      "neg": [
        {
          "metrics.merge.overCap": 1
        },
        {
          "metrics.merge.unknownPingProposed": 1
        }
      ]
    },
    "proposals:2": {
      "kind": "computed",
      "areas": [],
      "why": "each thin region has alternatives",
      "conds": [
        [
          "merge.thinWithAlternatives",
          "==",
          "merge.thinRegions"
        ],
        [
          "merge.proposals",
          "==",
          "merge.thinRegions"
        ]
      ],
      "neg": [
        {
          "metrics.merge.thinWithAlternatives": 0
        }
      ]
    },
    "bot-honesty:1": {
      "kind": "computed",
      "areas": [],
      "why": "lobby config labels bots",
      "conds": [
        [
          "bots.labelShown",
          "true",
          null,
          "h"
        ],
        [
          "bots.countedInPlayerCount",
          "false",
          null,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.bots.labelShown": false
        },
        {
          "metrics.bots.countedInPlayerCount": true
        }
      ]
    },
    "bot-honesty:2": {
      "kind": "computed",
      "areas": [],
      "why": "no bot-heavy region without a proposal",
      "conds": [
        [
          "bots.overCapWithoutProposal",
          "==",
          0
        ]
      ],
      "neg": [
        {
          "metrics.bots.overCapWithoutProposal": 2
        }
      ]
    },
    "wait-and-devices:1": {
      "kind": "computed",
      "areas": [],
      "why": "waits inside limits",
      "conds": [
        [
          "wait.p50S",
          "<=",
          "P.maxWaitS"
        ],
        [
          "wait.p90S",
          "<=",
          "P.maxWaitP90S"
        ]
      ],
      "neg": [
        {
          "metrics.wait.p50S": 120
        },
        {
          "metrics.wait.p90S": 300
        }
      ]
    },
    "wait-and-devices:2": {
      "kind": "computed",
      "areas": [],
      "why": "Wait gap for the configured input groups",
      "conds": [
        [
          "device.primaryInputWaitGapS",
          "<=",
          "P.maxInputWaitGapS"
        ],
        [
          "device.inputQueueOptionConsidered",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.device.primaryInputWaitGapS": 60
        }
      ]
    },
    "safety-and-privacy:1": {
      "kind": "computed",
      "areas": [],
      "why": "authority probe clean",
      "conds": [
        [
          "authority.forbiddenAttempted",
          ">=",
          "P.minProbeAttempts"
        ],
        [
          "authority.forbiddenSucceeded",
          "==",
          0,
          "h"
        ],
        [
          "authority.liveChanges",
          "==",
          0,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.authority.forbiddenSucceeded": 1
        },
        {
          "metrics.authority.liveChanges": 2
        }
      ]
    },
    "safety-and-privacy:2": {
      "kind": "computed",
      "areas": [],
      "why": "schema and outputs clean",
      "conds": [
        [
          "privacy.piiFieldsAccepted",
          "==",
          0,
          "h"
        ],
        [
          "privacy.rawIdsInOutputs",
          "==",
          0,
          "h"
        ],
        [
          "privacy.schemaRejectsPlanted",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.privacy.piiFieldsAccepted": 1
        },
        {
          "metrics.privacy.rawIdsInOutputs": 5
        }
      ]
    }
  },
  "checks": {}
};
cli(LENS, import.meta.url);
```

### engine/team-memory.mjs

```
// team-memory v1.0.0: a small append-only memory the templates share inside one game project.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Zero dependencies, Node 18+.
// Vendored byte for byte into each template as engine/team-memory.mjs.
//
// Records live in <game project>/.grokbot-team/memory/<topic>.jsonl, one JSON object per line.
// A template reads every topic it needs before acting and appends only to the topics it owns.
// Records never hold secrets, names, handles, wallets, emails or raw user ids. A person or account
// is referred to by hashSubject(), an HMAC with a salt that lives only in the environment.
//
// CLI (run from the game project root):
//   node engine/team-memory.mjs read <topic> [--all]           active records as JSON lines
//   node engine/team-memory.mjs lint [<memory-dir>]            schema and personal-data lint, exit 1 on problems
//   node engine/team-memory.mjs append <topic> <record.json> --writer <template-id>@<version> --writes <t1,t2>
//   node engine/team-memory.mjs hash <raw-id>                  prints sub_... using GROKBOT_TEAM_SALT
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const MEMORY_VERSION = "1.0.0";
export const TOPICS = ["decisions", "incidents", "entitlements", "balance", "regions", "releases"];
export const CONFIDENCE = ["measured", "reported", "assumed"];
export const FIELDS = ["id", "time", "writer", "topic", "kind", "summary", "data", "source", "confidence", "expires_at", "supersedes"];
export const SALT_ENV = "GROKBOT_TEAM_SALT";
export const LIMITS = { summary: 280, dataBytes: 4096, depth: 5 };

const ID = /^mem_[0-9a-z]{8,12}_[0-9a-f]{8}$/;
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
const TEMPLATE_ID = /^[a-z0-9]+-[0-9]{2}-[a-z0-9-]+$/;
const KIND = /^[a-z][a-z0-9-]{1,47}$/;
export const SUBJECT = /^sub_[0-9a-f]{32}$/;

// Keys that carry personal data. Compared after lowercasing and removing "_", "-" and spaces.
const PERSONAL_KEYS = new Set([
  "name", "firstname", "lastname", "fullname", "displayname", "playername", "username", "nickname", "realname",
  "handle", "email", "mail", "emailaddress", "phone", "phonenumber", "mobile", "address", "streetaddress",
  "wallet", "walletaddress", "ip", "ipaddress", "userid", "playerid", "accountid", "customerid", "memberid",
  "deviceid", "advertisingid", "discordid", "twitterid", "xid", "steamid", "psnid", "xboxid", "socialid",
  "password", "passcode", "secret", "token", "apikey", "accesstoken", "refreshtoken", "sessiontoken",
  "privatekey", "seedphrase", "mnemonic", "cardnumber", "creditcard", "iban", "ssn", "dob", "birthdate", "birthday",
]);
const SUBJECT_KEY = /^(subject|subjects|subjectid|subjectids)$/;
const PATTERNS = [
  ["email", /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
  ["handle", /(^|[^\w.@/])@[A-Za-z0-9_]{2,30}\b/],
  ["url", /\bhttps?:\/\/\S+/i],
  ["evm-wallet", /\b0x[0-9a-fA-F]{40}\b/],
  ["btc-wallet", /\bbc1[02-9ac-hj-np-z]{25,62}\b/],
  ["ipv4", /\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/],
  ["ipv6", /\b(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}\b/i],
  ["phone", /\+\d[\d\s().-]{7,}\d/],
  ["long-number-id", /(?<![\w.])\d{9,20}(?![\w.])/],
  ["private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["api-key", /\b(?:sk|pk|rk)[-_](?:live|test|proj|ant)?[-_]?[A-Za-z0-9_-]{16,}|\b(?:ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}|\bxox[abprs]-[A-Za-z0-9-]{10,}|\bAKIA[0-9A-Z]{16}\b|\bAIza[0-9A-Za-z_-]{30,}|\bxai-[A-Za-z0-9]{20,}/],
  ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["assigned-secret", /\b(?:api[_-]?key|secret|token|passw(?:or)?d|bearer)\b\s*[:=]\s*\S{8,}/i],
];
// A base58 run that mixes digits, upper and lower case (typical wallet or account address).
function base58Address(s) {
  for (const m of s.matchAll(/[1-9A-HJ-NP-Za-km-z]{32,44}/g)) {
    const t = m[0];
    if (/^[0-9a-f]+$/.test(t)) continue;
    if (/\d/.test(t) && /[A-Z]/.test(t) && /[a-z]/.test(t)) return true;
  }
  return false;
}

// ---------- subject ids ----------
export function hashSubject(rawId, salt = process.env[SALT_ENV]) {
  if (typeof salt !== "string" || salt.length < 16) {
    throw new Error(`hashSubject needs ${SALT_ENV} (16 or more characters) in the environment; refusing to hash without it`);
  }
  if (rawId == null || String(rawId).length === 0) throw new Error("hashSubject needs a non-empty id");
  return "sub_" + crypto.createHmac("sha256", salt).update(String(rawId)).digest("hex").slice(0, 32);
}

// ---------- lint ----------
function walk(value, at, depth, out) {
  if (depth > LIMITS.depth) { out.push(`${at}: nested deeper than ${LIMITS.depth} levels`); return; }
  if (typeof value === "string") {
    for (const [rule, re] of PATTERNS) if (re.test(value)) out.push(`${at}: looks like personal data or a secret (${rule})`);
    if (base58Address(value)) out.push(`${at}: looks like personal data or a secret (base58-address)`);
    return;
  }
  if (Array.isArray(value)) { value.forEach((v, i) => walk(v, `${at}[${i}]`, depth + 1, out)); return; }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const norm = k.toLowerCase().replace(/[\s_-]/g, "");
      if (PERSONAL_KEYS.has(norm)) out.push(`${at}.${k}: key "${k}" is not allowed in team memory (personal data)`);
      if (SUBJECT_KEY.test(norm)) {
        const ok = [].concat(v).every((x) => typeof x === "string" && SUBJECT.test(x));
        if (!ok) out.push(`${at}.${k}: subject ids must be hashed with hashSubject() (sub_ plus 32 hex)`);
        continue;
      }
      walk(v, `${at}.${k}`, depth + 1, out);
    }
  }
}

// Returns a list of problems. An empty list means the record is valid.
export function lintRecord(r, { writes } = {}) {
  const p = [];
  if (!r || typeof r !== "object" || Array.isArray(r)) return ["record must be a JSON object"];
  for (const k of FIELDS) if (!(k in r)) p.push(`missing field ${k}`);
  for (const k of Object.keys(r)) if (!FIELDS.includes(k)) p.push(`unknown field ${k}`);
  if (typeof r.id !== "string" || !ID.test(r.id)) p.push("id must look like mem_<time36>_<8 hex>");
  if (typeof r.time !== "string" || !UTC.test(r.time) || Number.isNaN(Date.parse(r.time))) p.push("time must be an ISO 8601 UTC time ending in Z");
  if (!r.writer || typeof r.writer !== "object" || !TEMPLATE_ID.test(r.writer.id ?? "") || !SEMVER.test(r.writer.version ?? "") || Object.keys(r.writer).length !== 2) {
    p.push("writer must be { id: <template id>, version: <semver> }");
  }
  if (!TOPICS.includes(r.topic)) p.push(`topic must be one of ${TOPICS.join(", ")}`);
  if (writes && !writes.includes(r.topic)) p.push(`writer may not write topic ${r.topic} (owns: ${writes.join(", ") || "none"})`);
  if (typeof r.kind !== "string" || !KIND.test(r.kind)) p.push("kind must be a short kebab-case word");
  if (typeof r.summary !== "string" || !r.summary.trim() || r.summary.length > LIMITS.summary) p.push(`summary must be 1 to ${LIMITS.summary} characters`);
  if (!r.data || typeof r.data !== "object" || Array.isArray(r.data)) p.push("data must be an object (use {} when empty)");
  else if (Buffer.byteLength(JSON.stringify(r.data)) > LIMITS.dataBytes) p.push(`data is larger than ${LIMITS.dataBytes} bytes; store a file under .grokbot-team/artifacts and cite it in source`);
  if (!r.source || typeof r.source !== "object" || Array.isArray(r.source) || !Object.keys(r.source).length) p.push("source must name at least one of pack, artifact, path, gitSha, liveSha or note");
  if (!CONFIDENCE.includes(r.confidence)) p.push(`confidence must be one of ${CONFIDENCE.join(", ")}`);
  if (r.expires_at !== null && (typeof r.expires_at !== "string" || !UTC.test(r.expires_at) || Date.parse(r.expires_at) <= Date.parse(r.time))) {
    p.push("expires_at must be null or a UTC time after time");
  }
  if (r.supersedes !== null && (typeof r.supersedes !== "string" || !ID.test(r.supersedes))) p.push("supersedes must be null or a record id");
  if (r.supersedes && r.supersedes === r.id) p.push("a record cannot supersede itself");
  const personal = [];
  walk({ summary: r.summary, kind: r.kind, data: r.data, source: r.source }, "record", 0, personal);
  return p.concat(personal);
}

// Lints one topic file's text. Checks every line, unique ids, and that supersedes points to an earlier record.
export function lintText(text, topic, opts = {}) {
  const problems = [], seen = new Set();
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (!line.trim()) { if (i !== lines.length - 1) problems.push(`line ${i + 1}: blank line`); return; }
    let r;
    try { r = JSON.parse(line); } catch { problems.push(`line ${i + 1}: not valid JSON`); return; }
    for (const m of lintRecord(r, { writes: opts.owners?.[r.writer?.id] })) problems.push(`line ${i + 1}: ${m}`);
    if (topic && r.topic !== topic) problems.push(`line ${i + 1}: topic ${r.topic} in ${topic}.jsonl`);
    if (seen.has(r.id)) problems.push(`line ${i + 1}: duplicate id ${r.id}`);
    if (r.supersedes && !seen.has(r.supersedes)) problems.push(`line ${i + 1}: supersedes ${r.supersedes}, which is not an earlier record in this topic`);
    seen.add(r.id);
  });
  return problems;
}

export function lintDir(dir, opts = {}) {
  const problems = [];
  if (!fs.existsSync(dir)) return problems;
  for (const f of fs.readdirSync(dir).sort()) {
    const topic = f.replace(/\.jsonl$/, "");
    if (!f.endsWith(".jsonl") || !TOPICS.includes(topic)) { problems.push(`${f}: unexpected file (one <topic>.jsonl per topic)`); continue; }
    for (const m of lintText(fs.readFileSync(path.join(dir, f), "utf8"), topic, opts)) problems.push(`${f} ${m}`);
  }
  return problems;
}

// True when `after` only adds lines to `before` (the append-only rule). Use it against a backup or the last commit.
export function isAppendOnly(before, after) {
  return after.startsWith(before) && (before === "" || before.endsWith("\n"));
}

// ---------- read and write ----------
export const memoryDir = (root = process.cwd()) => path.join(root, ".grokbot-team", "memory");

export function newId(now = Date.now()) {
  return `mem_${now.toString(36)}_${crypto.randomBytes(4).toString("hex")}`;
}

export function makeRecord({ writer, topic, kind, summary, data = {}, source, confidence, expiresAt = null, supersedes = null, now = new Date() }) {
  return { id: newId(now.getTime()), time: now.toISOString(), writer, topic, kind, summary, data, source, confidence, expires_at: expiresAt, supersedes };
}

export function readTopic(root, topic, { now = new Date(), all = false } = {}) {
  if (!TOPICS.includes(topic)) throw new Error(`unknown topic ${topic}`);
  const file = path.join(memoryDir(root), `${topic}.jsonl`);
  if (!fs.existsSync(file)) return [];
  const records = fs.readFileSync(file, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  if (all) return records;
  const superseded = new Set(records.map((r) => r.supersedes).filter(Boolean));
  return records.filter((r) => !superseded.has(r.id) && (r.expires_at === null || Date.parse(r.expires_at) > now.getTime()));
}

// Appends one record after linting it. `writes` is the list of topics the writing template owns.
export function append(root, record, { writes }) {
  if (!Array.isArray(writes)) throw new Error("append needs { writes: [...topics this template owns] }");
  const problems = lintRecord(record, { writes });
  if (record?.supersedes && !readTopic(root, record.topic, { all: true }).some((r) => r.id === record.supersedes)) {
    problems.push(`supersedes ${record.supersedes}, which is not in ${record.topic}`);
  }
  if (problems.length) throw new Error("team memory refused the record:\n- " + problems.join("\n- "));
  const dir = memoryDir(root);
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, `${record.topic}.jsonl`), JSON.stringify(record) + "\n", { flag: "a" });
  return record;
}

// ---------- CLI ----------
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const flag = (k) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : undefined);
  try {
    if (cmd === "read") {
      for (const r of readTopic(process.cwd(), rest[0], { all: rest.includes("--all") })) console.log(JSON.stringify(r));
    } else if (cmd === "lint") {
      const dir = rest[0] ? path.resolve(rest[0]) : memoryDir();
      const problems = lintDir(dir);
      for (const m of problems) console.log(`PROBLEM ${m}`);
      console.log(`team-memory lint: ${problems.length} problem(s) -> ${problems.length ? "FAIL" : "CLEAN"}`);
      process.exit(problems.length ? 1 : 0);
    } else if (cmd === "append") {
      const [topic, file] = rest;
      const [id, version] = String(flag("--writer") || "").split("@");
      const body = JSON.parse(fs.readFileSync(file, "utf8"));
      const record = makeRecord({ ...body, topic, writer: { id, version } });
      append(process.cwd(), record, { writes: String(flag("--writes") || "").split(",").filter(Boolean) });
      console.log(JSON.stringify(record));
    } else if (cmd === "hash") {
      console.log(hashSubject(rest[0]));
    } else {
      console.error("usage: team-memory.mjs read <topic> [--all] | lint [dir] | append <topic> <record.json> --writer <id>@<version> --writes <topics> | hash <raw-id>");
      process.exit(2);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
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

### engine/ENGINE.json

```
{
  "cmd": [
    "node",
    "engine/lens.mjs"
  ],
  "meta": [
    "node",
    "engine/lens.mjs",
    "--meta"
  ],
  "embed": [
    "engine/lens-kit.mjs",
    "engine/lens.mjs",
    "engine/team-memory.mjs",
    "engine/write-pack.mjs"
  ],
  "domain": [
    "mm/fill.mjs",
    "mm/scenario.mjs",
    "mm/import-counts.mjs",
    "tests/test-safety.mjs",
    "engine/write-pack.mjs"
  ],
  "contract": [
    "engine/ENGINE.json",
    "RUBRIC.json",
    "fixtures/good-pack.json",
    "fixtures/mutations.json",
    "tests/test-lens-contract.mjs",
    "tests/lens-negative-fixtures.mjs",
    "tests/test-empty-sample.mjs",
    "tests/run-all.mjs",
    "tests/test-window.mjs"
  ]
}
```

### RUBRIC.json

```
{
  "id": "gbf-25-matchmaking-lobby-fill",
  "version": "1.2.0",
  "migration": "1.2.0 replaces input names taken from one game with neutral ones. Metrics device.touchWaitGapS and device.touchQueueOptionConsidered are now device.primaryInputWaitGapS and device.inputQueueOptionConsidered; profile maxTouchGapS and touchQueueMinShare are now maxInputWaitGapS and inputQueueMinShare. The input groups come only from profile.primaryInput and profile.comparisonInput, with no default device codes, and seat keys are the kit's salted subject ids (sub_ plus 32 hex). Line ids, weights and anchors are unchanged. Rename the fields in existing packs and profiles and regrade.",
  "credit": "@meta_alchemist",
  "creditUrl": "https://x.com/meta_alchemist",
  "scale": 100,
  "gameProfile": "owner-configured",
  "contribution": "weight * level / 4",
  "levels": "0 to 4, or U (UNMEASURED, 0 points, not a defect). A test that did not run is NOT_RUN and never reads as PASS.",
  "pillars": [
    {
      "id": "fill-measurement",
      "name": "Fill measurement",
      "points": 20
    },
    {
      "id": "proposals",
      "name": "Proposals",
      "points": 20
    },
    {
      "id": "bot-honesty",
      "name": "Bot honesty",
      "points": 20
    },
    {
      "id": "wait-and-devices",
      "name": "Wait and devices",
      "points": 20
    },
    {
      "id": "safety-and-privacy",
      "name": "Safety and privacy",
      "points": 20
    }
  ],
  "lines": [
    {
      "id": "fill-measurement:1",
      "pillar": "Fill measurement",
      "name": "Humans and bots counted apart",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "Bots counted as players, or no per-hour data",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "A full day of region-hours is measured from seat events, and no bot is ever counted as a human",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line fill-measurement:1",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "fill-measurement:2",
      "pillar": "Fill measurement",
      "name": "Thin regions found correctly",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "Thin regions missed or invented",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "The thin-region list matches an independent recount from the raw rows",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line fill-measurement:2",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "proposals:1",
      "pillar": "Proposals",
      "name": "Merges respect the ping cap",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "A merge over the cap was proposed",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "No merge over the ping cap or with unknown ping is proposed",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line proposals:1",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "proposals:2",
      "pillar": "Proposals",
      "name": "Options with trade-offs",
      "weight": 10,
      "passAt": 3,
      "evidence": "static",
      "anchors": {
        "0": "One option or none",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "Every thin region has two or more options, each with its cost in ping, bots or timing",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line proposals:2",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "bot-honesty:1",
      "pillar": "Bot honesty",
      "name": "Bots labelled, never counted as players",
      "weight": 10,
      "passAt": 3,
      "evidence": "static",
      "anchors": {
        "0": "Bots shown as players",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "Bots carry a label in the lobby and are never in the public player count",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line bot-honesty:1",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "bot-honesty:2",
      "pillar": "Bot honesty",
      "name": "Bot-heavy regions have a plan",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "Bot-heavy regions with no plan",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "Every region over the bot share cap has a proposal in front of the owner",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line bot-honesty:2",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "wait-and-devices:1",
      "pillar": "Wait and devices",
      "name": "Queue wait",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "Players wait past the limits",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "Human queue wait p50 and p90 are inside the owner's limits",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line wait-and-devices:1",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "wait-and-devices:2",
      "pillar": "Wait and devices",
      "name": "Input group wait gap",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "The primary group waits longer than the configured limit.",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "The configured input groups meet the wait-gap target and a dedicated queue has been considered.",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line wait-and-devices:2",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "safety-and-privacy:1",
      "pillar": "Safety and privacy",
      "name": "Proposals only",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "The director changed a live setting",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "Every attempt to apply, rewrite or call a live change through the engine fails, and the engine has no network or write calls",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line safety-and-privacy:1",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    },
    {
      "id": "safety-and-privacy:2",
      "pillar": "Safety and privacy",
      "name": "No personal data",
      "weight": 10,
      "passAt": 3,
      "evidence": "trace",
      "anchors": {
        "0": "Personal data in the data or the report",
        "1": "Nominal success is unreliable or major supported cases fail.",
        "2": "Common path works; material supported edge cases remain.",
        "3": "All required cases and budgets pass; only minor defects remain.",
        "4": "Personal rows are refused, no seat id reaches an output, and planted personal rows are caught",
        "U": "UNMEASURED: required evidence missing, stale or wrong build. Earns 0 points, never filed as a defect."
      },
      "automatedGate": true,
      "negativeFixture": {
        "cmd": "node tests/lens-negative-fixtures.mjs --line safety-and-privacy:2",
        "note": "Measured failures fall below pass. Missing or empty evidence earns zero points."
      }
    }
  ],
  "verdict": "PASS, CONDITIONAL or BLOCKED is reported separately from the grade and coverage. An unresolved P0 blocks.",
  "hashAlgo": "gbf-sorted-json-v2",
  "sampleFields": {
    "fill": [
      "regions",
      "regionHoursMeasured"
    ],
    "merge": [
      "proposals",
      "thinRegions"
    ],
    "bots": [
      "measuredCases"
    ],
    "wait": [
      "measuredCases"
    ],
    "device": [
      "measuredCases"
    ],
    "authority": [
      "forbiddenAttempted"
    ],
    "privacy": [
      "measuredCases"
    ],
    "latency": [
      "pairs"
    ]
  },
  "releaseBlockers": [],
  "hash": "sha256:f79e06c8a8fb224341b91dd02f0be638e81dc4f8ddd485df58acb8b992bc0d78"
}
```

### fixtures/good-pack.json

```
{
  "packId": "synthetic-lobby-fill-001",
  "status": "VALID",
  "synthetic": true,
  "gitSha": "synthetic",
  "liveSha": "synthetic",
  "profile": {
    "minHumansPerHour": 4,
    "pingCapMs": 120,
    "maxBotShare": 0.6,
    "maxWaitS": 45,
    "maxWaitP90S": 90,
    "primaryInput": "input-a",
    "comparisonInput": "input-b",
    "maxInputWaitGapS": 15,
    "inputQueueMinShare": 0.6,
    "minRegionHours": 24,
    "minProbeAttempts": 12
  },
  "artifacts": [
    {
      "id": "seat-events",
      "kind": "trace"
    },
    {
      "id": "rtt-matrix",
      "kind": "trace"
    },
    {
      "id": "lobby-config",
      "kind": "static"
    },
    {
      "id": "authority-probe",
      "kind": "trace"
    },
    {
      "id": "privacy-probe",
      "kind": "trace"
    },
    {
      "id": "proposal-report",
      "kind": "static"
    }
  ],
  "metrics": {
    "fill": {
      "artifact": "seat-events",
      "regions": 5,
      "regionHoursMeasured": 240,
      "botsCountedAsHumans": 0,
      "thinMismatch": 0,
      "thinListed": true
    },
    "merge": {
      "directionalPairs": 8,
      "artifactsByLine": {
        "proposals:1": "rtt-matrix"
      },
      "artifact": "proposal-report",
      "proposals": 2,
      "overCap": 0,
      "thinRegions": 2,
      "thinWithAlternatives": 2,
      "unknownPingProposed": 0
    },
    "authority": {
      "artifact": "authority-probe",
      "forbiddenAttempted": 14,
      "forbiddenSucceeded": 0,
      "liveChanges": 0
    },
    "privacy": {
      "measuredCases": 4,
      "artifact": "privacy-probe",
      "piiFieldsAccepted": 0,
      "rawIdsInOutputs": 0,
      "schemaRejectsPlanted": true
    },
    "wait": {
      "measuredCases": 1404,
      "artifact": "seat-events",
      "p50S": 24,
      "p90S": 53
    },
    "device": {
      "measuredCases": 5,
      "artifact": "seat-events",
      "primaryInputWaitGapS": 7,
      "inputQueueOptionConsidered": true
    },
    "bots": {
      "measuredCases": 5,
      "artifactsByLine": {
        "bot-honesty:2": "seat-events"
      },
      "artifact": "lobby-config",
      "labelShown": true,
      "countedInPlayerCount": false,
      "overCapWithoutProposal": 0
    },
    "latency": {
      "artifact": "rtt-matrix",
      "pairs": 8
    }
  }
}
```

### fixtures/mutations.json

```
{
 "note": "Generated from the lens spec. Measured failures drop below pass. Empty or missing samples give U. Release-blocker cases require BLOCKED and grade 0.",
 "cases": [
  {
   "id": "fill-measurement:1#empty-fill.regions",
   "line": "fill-measurement:1",
   "expect": "U",
   "set": {
    "metrics.fill.regions": 0
   }
  },
  {
   "id": "fill-measurement:1#empty-fill.regionHoursMeasured",
   "line": "fill-measurement:1",
   "expect": "U",
   "set": {
    "metrics.fill.regionHoursMeasured": 0
   }
  },
  {
   "id": "fill-measurement:1#neg1",
   "line": "fill-measurement:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.fill.botsCountedAsHumans": 3
   }
  },
  {
   "id": "fill-measurement:1#neg2",
   "line": "fill-measurement:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.fill.regionHoursMeasured": 4
   }
  },
  {
   "id": "fill-measurement:1#missing",
   "line": "fill-measurement:1",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.fill.botsCountedAsHumans"
   ]
  },
  {
   "id": "fill-measurement:2#empty-fill.regions",
   "line": "fill-measurement:2",
   "expect": "U",
   "set": {
    "metrics.fill.regions": 0
   }
  },
  {
   "id": "fill-measurement:2#empty-fill.regionHoursMeasured",
   "line": "fill-measurement:2",
   "expect": "U",
   "set": {
    "metrics.fill.regionHoursMeasured": 0
   }
  },
  {
   "id": "fill-measurement:2#neg1",
   "line": "fill-measurement:2",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.fill.thinMismatch": 1
   }
  },
  {
   "id": "fill-measurement:2#missing",
   "line": "fill-measurement:2",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.fill.thinMismatch"
   ]
  },
  {
   "id": "proposals:1#empty-merge.proposals",
   "line": "proposals:1",
   "expect": "U",
   "set": {
    "metrics.merge.proposals": 0
   }
  },
  {
   "id": "proposals:1#empty-merge.thinRegions",
   "line": "proposals:1",
   "expect": "U",
   "set": {
    "metrics.merge.thinRegions": 0
   }
  },
  {
   "id": "proposals:1#empty-latency.pairs",
   "line": "proposals:1",
   "expect": "U",
   "set": {
    "metrics.latency.pairs": 0
   }
  },
  {
   "id": "proposals:1#neg1",
   "line": "proposals:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.merge.overCap": 1
   }
  },
  {
   "id": "proposals:1#neg2",
   "line": "proposals:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.merge.unknownPingProposed": 1
   }
  },
  {
   "id": "proposals:1#missing",
   "line": "proposals:1",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.merge.overCap"
   ]
  },
  {
   "id": "proposals:2#empty-merge.proposals",
   "line": "proposals:2",
   "expect": "U",
   "set": {
    "metrics.merge.proposals": 0
   }
  },
  {
   "id": "proposals:2#empty-merge.thinRegions",
   "line": "proposals:2",
   "expect": "U",
   "set": {
    "metrics.merge.thinRegions": 0
   }
  },
  {
   "id": "proposals:2#neg1",
   "line": "proposals:2",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.merge.thinWithAlternatives": 0
   }
  },
  {
   "id": "proposals:2#missing",
   "line": "proposals:2",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.merge.thinWithAlternatives"
   ]
  },
  {
   "id": "bot-honesty:1#empty-bots.measuredCases",
   "line": "bot-honesty:1",
   "expect": "U",
   "set": {
    "metrics.bots.measuredCases": 0
   }
  },
  {
   "id": "bot-honesty:1#neg1",
   "line": "bot-honesty:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.bots.labelShown": false
   }
  },
  {
   "id": "bot-honesty:1#neg2",
   "line": "bot-honesty:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.bots.countedInPlayerCount": true
   }
  },
  {
   "id": "bot-honesty:1#missing",
   "line": "bot-honesty:1",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.bots.labelShown"
   ]
  },
  {
   "id": "bot-honesty:2#empty-bots.measuredCases",
   "line": "bot-honesty:2",
   "expect": "U",
   "set": {
    "metrics.bots.measuredCases": 0
   }
  },
  {
   "id": "bot-honesty:2#neg1",
   "line": "bot-honesty:2",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.bots.overCapWithoutProposal": 2
   }
  },
  {
   "id": "bot-honesty:2#missing",
   "line": "bot-honesty:2",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.bots.overCapWithoutProposal"
   ]
  },
  {
   "id": "wait-and-devices:1#empty-wait.measuredCases",
   "line": "wait-and-devices:1",
   "expect": "U",
   "set": {
    "metrics.wait.measuredCases": 0
   }
  },
  {
   "id": "wait-and-devices:1#neg1",
   "line": "wait-and-devices:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.wait.p50S": 120
   }
  },
  {
   "id": "wait-and-devices:1#neg2",
   "line": "wait-and-devices:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.wait.p90S": 300
   }
  },
  {
   "id": "wait-and-devices:1#missing",
   "line": "wait-and-devices:1",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.wait.p50S"
   ]
  },
  {
   "id": "wait-and-devices:2#empty-device.measuredCases",
   "line": "wait-and-devices:2",
   "expect": "U",
   "set": {
    "metrics.device.measuredCases": 0
   }
  },
  {
   "id": "wait-and-devices:2#neg1",
   "line": "wait-and-devices:2",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.device.primaryInputWaitGapS": 60
   }
  },
  {
   "id": "wait-and-devices:2#missing",
   "line": "wait-and-devices:2",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.device.primaryInputWaitGapS"
   ]
  },
  {
   "id": "safety-and-privacy:1#empty-authority.forbiddenAttempted",
   "line": "safety-and-privacy:1",
   "expect": "U",
   "set": {
    "metrics.authority.forbiddenAttempted": 0
   }
  },
  {
   "id": "safety-and-privacy:1#neg1",
   "line": "safety-and-privacy:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.authority.forbiddenSucceeded": 1
   }
  },
  {
   "id": "safety-and-privacy:1#neg2",
   "line": "safety-and-privacy:1",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.authority.liveChanges": 2
   }
  },
  {
   "id": "safety-and-privacy:1#missing",
   "line": "safety-and-privacy:1",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.authority.forbiddenAttempted"
   ]
  },
  {
   "id": "safety-and-privacy:2#empty-privacy.measuredCases",
   "line": "safety-and-privacy:2",
   "expect": "U",
   "set": {
    "metrics.privacy.measuredCases": 0
   }
  },
  {
   "id": "safety-and-privacy:2#neg1",
   "line": "safety-and-privacy:2",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.privacy.piiFieldsAccepted": 1
   }
  },
  {
   "id": "safety-and-privacy:2#neg2",
   "line": "safety-and-privacy:2",
   "expect": "fail",
   "areas": [],
   "set": {
    "metrics.privacy.rawIdsInOutputs": 5
   }
  },
  {
   "id": "safety-and-privacy:2#missing",
   "line": "safety-and-privacy:2",
   "expect": "U",
   "areas": [],
   "del": [
    "metrics.privacy.piiFieldsAccepted"
   ]
  }
 ]
}
```

### tests/test-lens-contract.mjs

```
#!/usr/bin/env node
// Engine contract test: rubric match and hash, recipe embed, record fields, house text rules. Created by @meta_alchemist (https://x.com/meta_alchemist).
import fs from "node:fs";
import crypto from "node:crypto";
import { LENS } from "../engine/lens.mjs";
import { grade, runFixtures, scoreLevels } from "../engine/lens-kit.mjs";
const u = (p) => new URL(p, import.meta.url), read = (p) => fs.readFileSync(u(p), "utf8"), fails = [], notes = [];
const ok = (c, m) => { if (!c) fails.push(m); };
const sortK = (v) => Array.isArray(v) ? v.map(sortK) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortK(v[k])])) : v;
const rub = JSON.parse(read("../RUBRIC.json"));
{ const { hash, ...rest } = rub; ok("sha256:" + crypto.createHash("sha256").update(JSON.stringify(sortK(rest))).digest("hex") === hash, "rubric hash recomputes (gbf-sorted-json-v2)"); }
ok(rub.id === LENS.rubric.id && rub.version === LENS.rubric.version && rub.hash === LENS.rubric.hash, "engine rubric id, version and hash match RUBRIC.json");
ok(JSON.stringify(rub.lines.map((l) => [l.id, l.weight, l.passAt, l.evidence])) === JSON.stringify(LENS.rubric.lines.map((l) => [l.id, l.weight, l.passAt, l.evidence])), "engine line ids, weights and passAt match RUBRIC.json");
ok(rub.pillars.length === 5 && rub.pillars.every((p) => p.points === 20) && rub.lines.length === 10 && rub.lines.reduce((a, l) => a + l.weight, 0) === 100, "5 pillars x 20, 10 lines, weights sum 100");
ok(rub.lines.every((l) => LENS.lines[l.id]), "every rubric line has a lens");
if (fs.existsSync(u("../recipe.json"))) {
const recipe = JSON.parse(read("../recipe.json")), skills = recipe.skills.map((s) => s.content).join("\n");
for (const f of ["../engine/lens-kit.mjs", "../engine/lens.mjs", ...JSON.parse(read("../engine/ENGINE.json")).domain.map((d) => "../" + d)]) ok(skills.includes(read(f).trim()), `recipe embeds ${f.slice(3)} byte for byte`);
ok(recipe.version === 1 && recipe.visibility === "public" && recipe.gettingStarted?.skill && recipe.skills.some((k) => k.name === recipe.gettingStarted.skill), "recipe format and getting-started skill");
ok(recipe.memory.length >= 6 && recipe.memory.length <= 10 && recipe.memory.some((m) => /AUDIT CONTRACT V1/.test(m.content)), "recipe memory 6 to 10 entries with contract v1");
ok(recipe.skills.every((k) => k.content.includes("@meta_alchemist")), "every embedded skill carries credit");
ok(/100-point rubric/.test(recipe.profile.description) && recipe.profile.description.includes("https://x.com/meta_alchemist"), "description states the 100-point rubric and credit");
}
const good = JSON.parse(read("../fixtures/good-pack.json")), rec = grade(LENS, good);
for (const k of ["templateId", "rubricVersion", "rubricHash", "packId", "gitSha", "liveSha", "lines", "supportedPoints", "coverage", "grade", "verdict", "applicable"]) ok(k in rec, `grade record has ${k}`);
ok(rec.synthetic === true, "worked example is labelled synthetic in the record");
const levels = Object.fromEntries(rec.lines.filter((l) => typeof l.level === "number").map((l) => [l.id, l.level]));
ok(scoreLevels(LENS.rubric, levels).grade === rec.grade, "grade equals weight * level / 4 over measured lines");
const fx = runFixtures(LENS, good); ok(fx.status === "PASS", "negative fixtures: " + fx.fails.join("; "));
console.log(JSON.stringify({ status: fails.length ? "FAIL" : "PASS", template: LENS.rubric.id, fixtureCases: fx.cases, fails, notes }));
process.exit(fails.length ? 1 : 0);
```

### tests/lens-negative-fixtures.mjs

```
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
```

### tests/test-empty-sample.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import assert from "node:assert/strict";
import fs from "node:fs";
import {grade, mutations, applyCase} from "../engine/lens-kit.mjs";
import {LENS} from "../engine/lens.mjs";

const good = JSON.parse(fs.readFileSync(new URL("../fixtures/good-pack.json",import.meta.url)));
const checkEmpty = pack => {
  const result = grade(LENS,pack);
  assert.equal(result.grade,0);
  assert.equal(result.supportedPoints,0);
  assert.equal(result.coverage,0);
  assert.equal(result.verdict,"CONDITIONAL");
  assert.equal(result.lines.length,10);
  assert.ok(result.lines.every(line => line.level === "U" && line.reason.startsWith("UNMEASURED")));
};
checkEmpty({...good,metrics:{}});
checkEmpty({...good,artifacts:[]});
for (const value of [0, [], null]) {
  const pack = structuredClone(good);
  for (const group of Object.values(pack.metrics)) group.measuredCases = value;
  checkEmpty(pack);
}
const cases = mutations(LENS,good).cases.filter(c => c.id.includes("#empty"));
for (const c of cases) {
  const pack = applyCase(good,c);
  const result = grade(LENS,pack);
  assert.equal(result.lines.find(line => line.id === c.line).level,"U",c.id);
  assert.ok(result.grade <= 90 && result.verdict !== "PASS",c.id);
}
console.log(JSON.stringify({status:"PASS",wholePacks:5,emptyLineCases:cases.length}));
```

### tests/run-all.mjs

```
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const tests = ["test-lens-contract","lens-negative-fixtures","test-empty-sample","test-safety","test-window"];
const cwd = fileURLToPath(new URL("..",import.meta.url));
const results = tests.map(test => {
  const run = spawnSync(process.execPath,["tests/"+test+".mjs"],{cwd,encoding:"utf8"});
  if (run.status !== 0) return {test,status:"FAIL",detail:run.stderr || run.stdout};
  return {test,...JSON.parse(run.stdout)};
});
const status = results.every(r => r.status === "PASS") ? "PASS" : "FAIL";
console.log(JSON.stringify({status,results},null,2));
process.exitCode = status === "PASS" ? 0 : 1;
```

### tests/test-window.mjs

```
#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Silent hours inside a declared window count as zero, not as missing, so averages are not inflated.
import assert from "node:assert/strict";
import { padWindow, regionSummary } from "../mm/fill.mjs";

const cells = [
  { region: "east", hour: 1, humans: 10, bots: 2, botShare: 2 / 12, primary: 10, waits: [4], primaryWaits: [4], comparisonWaits: [] },
  { region: "east", hour: 3, humans: 10, bots: 2, botShare: 2 / 12, primary: 10, waits: [4], primaryWaits: [4], comparisonWaits: [] },
];
const padded = padWindow(cells, { windowStartHour: 0, windowEndHour: 5 });
assert.equal(padded.length, 6);
assert.deepEqual(padded.map((c) => c.hour), [0, 1, 2, 3, 4, 5]);
assert.equal(padded[0].humans, 0);
assert.equal(padded[2].humans, 0);
assert.equal(padded[4].humans, 0);
assert.equal(padded[5].humans, 0);
assert.equal(padded[1].humans, 10);
assert.equal(padded[3].humans, 10);
const summary = regionSummary(padded);
assert.equal(summary.length, 1);
assert.ok(Math.abs(summary[0].humansPerHour - 20 / 6) < 1e-9, "silent hours must pull the average down");
assert.equal(padWindow([], { windowStartHour: 0, windowEndHour: 5 }).length, 0);
console.log(JSON.stringify({ status: "PASS", paddedHours: padded.length, humansPerHour: summary[0].humansPerHour }));
```
