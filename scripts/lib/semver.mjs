// Minimal semver for the kit (no dependencies). Created by @meta_alchemist (https://x.com/meta_alchemist).
// Supports versions like 1.2.3 and 1.2.3-pre.1, and ranges "*", "1.2.3", "^1.2.3", "~1.2.3", ">=1.2.3".
const RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export function parse(v) {
  const m = RE.exec(String(v ?? ""));
  return m ? { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ?? null, raw: v } : null;
}

export const valid = (v) => parse(v) !== null;

export function compare(a, b) {
  const x = parse(a), y = parse(b);
  if (!x || !y) throw new Error(`not a semver version: ${!x ? a : b}`);
  for (const k of ["major", "minor", "patch"]) if (x[k] !== y[k]) return x[k] < y[k] ? -1 : 1;
  if (x.pre === y.pre) return 0;
  if (x.pre === null) return 1;
  if (y.pre === null) return -1;
  return x.pre < y.pre ? -1 : 1;
}

export function parseRange(r) {
  const s = String(r ?? "").trim();
  if (s === "*") return { op: "*", base: null };
  const m = /^(\^|~|>=)?(.+)$/.exec(s);
  const base = m && parse(m[2]);
  return base ? { op: m[1] || "=", base } : null;
}

export const validRange = (r) => parseRange(r) !== null;

export function satisfies(v, r) {
  const x = parse(v), range = parseRange(r);
  if (!x || !range) return false;
  if (range.op === "*") return true;
  const b = range.base, cmp = compare(v, b.raw);
  if (range.op === "=") return cmp === 0;
  if (range.op === ">=") return cmp >= 0;
  if (cmp < 0) return false;
  if (range.op === "~") return x.major === b.major && x.minor === b.minor;
  // caret: same major, or for 0.x the same minor
  return b.major === 0 ? x.major === 0 && x.minor === b.minor : x.major === b.major;
}

// The major a range targets (null for "*" or ">=").
export function rangeMajor(r) {
  const range = parseRange(r);
  return range && (range.op === "^" || range.op === "~" || range.op === "=") ? range.base.major : null;
}
