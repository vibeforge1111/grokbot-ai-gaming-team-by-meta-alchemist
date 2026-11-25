#!/usr/bin/env node
// Public-safety scrub check. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Scans every text file in the repo for secrets, keys, IPs, emails, local paths, private hostnames, ids,
// wallet addresses, token-sale words, handles and dates. Exit 1 on any unallowed hit.
// Private names (unreleased products, internal codenames) are never written in this public file:
// put them one per line in a gitignored denylist and pass it with --denylist <file> or SCRUB_DENYLIST=<file>.
// Usage: node scripts/scrub-check.mjs [--json] [--root <dir>] [--denylist <file>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const ROOT = path.resolve(opt("--root") || path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const SELF = new Set(["scripts/scrub-check.mjs", "tests/scrub.test.mjs", "scrub-allowlist.json"]);

export const RULES = [
  ["private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["github-token", /\b(ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}/],
  ["openai-style-key", /\bsk-(proj-)?[A-Za-z0-9_-]{20,}/],
  ["anthropic-key", /\bsk-ant-[A-Za-z0-9_-]{10,}/],
  ["xai-key", /\bxai-[A-Za-z0-9]{20,}/],
  ["slack-token", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["aws-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["google-key", /\bAIza[0-9A-Za-z_-]{30,}/],
  ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["assigned-secret", /\b(api[_-]?key|secret|token|passw(or)?d|bearer)\b["']?\s*[:=]\s*["'][A-Za-z0-9_\-./+]{16,}["']/i],
  ["env-secret", /^\s*(?:export\s+)?(?:[A-Z][A-Z0-9_]*_)?(?:API_KEY|TOKEN|PASSWORD|SECRET)\s*=\s*[A-Za-z0-9_./+-]{16,}\s*(?:#.*)?$/i],
  ["discord-id", /\b\d{17,20}\b/],
  ["discord-webhook", /https?:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api(?:\/v\d+)?\/webhooks\/\d+\/[\w-]+/i],
  ["assigned-player-name", /\bplayer[_-]?name["']?\s*[:=]\s*["'][^"'<>\n]+["']/i],
  ["assigned-social-id", /\bx[_-]id["']?\s*[:=]\s*["']?\d+\b/i],
  ["ipv4", /\b(?!(?:127\.0\.0\.1|0\.0\.0\.0|192\.0\.2\.\d+|198\.51\.100\.\d+|203\.0\.113\.\d+)\b)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/],
  ["email", /\b[A-Za-z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/],
  ["local-path", /\/home\/[a-z_][\w-]*|\/workspace\/|\/Users\/[A-Za-z][\w-]*|\/cursor\/stores|agent-data\/|[A-Z]:\\Users\\/],
  ["private-hostname", /\b[\w-]+\.(?:ts\.net|internal|corp|lan)\b|\b[\w-]+\.local\b(?!host)/],
  ["uuid", /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i],
  ["evm-wallet", /\b0x[0-9a-fA-F]{40}\b/],
  ["token-sale", /\b(TGE|IDO|ICO)\b|\bwhite-?list(ed)?\b|\bairdrops?\b|\btokenomics\b|\blaunchpad\b|\bpre-?sale\b|\btoken sale\b/i],
  ["ticker", /(?<![\w$])\$[A-Z]{3,6}\b(?![\w(])/],
  // A Keep a Changelog release heading ("## [1.2.0] - YYYY-MM-DD") records a past release and is allowed.
  ["launch-date", /\blaunch(es|ing)? (on|date|in) \w+|\brelease date\b|(?<!^## \[\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\] - )\b20\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/i],
  ["handle", /(?<![\w.@/])@(?!meta_alchemist\b|param\b|returns?\b|module\b|description\b|type(def)?\b|example\b|see\b|throws\b|deprecated\b|license\b|author\b|version\b)[A-Za-z0-9_]{3,15}\b(?![/.\w-])/],
];

function files(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".scrub-denylist"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...files(p));
    else if (e.isFile() && fs.statSync(p).size < 5e6) out.push(p);
  }
  return out;
}

export function scan(root = ROOT, denyFile = opt("--denylist") || process.env.SCRUB_DENYLIST || null) {
  const allowPath = path.join(root, "scrub-allowlist.json");
  const allow = fs.existsSync(allowPath) ? JSON.parse(fs.readFileSync(allowPath, "utf8")).allow : [];
  const deny = denyFile && fs.existsSync(denyFile) ? fs.readFileSync(denyFile, "utf8").split("\n").map((s) => s.trim()).filter((s) => s && !s.startsWith("#")) : [];
  const rules = [...RULES, ...deny.map((w) => ["denylist", new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")])];
  const hits = [], allowed = [];
  let scanned = 0;
  for (const f of files(root)) {
    const rel = path.relative(root, f).split(path.sep).join("/");
    if (SELF.has(rel)) continue;
    const buf = fs.readFileSync(f);
    if (buf.includes(0)) continue; // binary
    scanned++;
    const lines = buf.toString("utf8").split("\n");
    lines.forEach((line, i) => {
      for (const [name, re] of rules) {
        const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
        for (const m of line.matchAll(g)) {
          const hit = { rule: name, file: rel, line: i + 1 };
          const a = allow.find((x) => x.rule === name && x.file === rel && (!x.match || m[0].includes(x.match)));
          (a ? allowed : hits).push(a ? { ...hit, reason: a.reason } : hit);
        }
      }
    });
  }
  return { root, scanned, rules: rules.length, denylistTerms: deny.length, hits, allowed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = scan();
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    for (const h of r.hits) console.log(`HIT ${h.rule} ${h.file}:${h.line}`);
    console.log(`scrub-check: ${r.scanned} files, ${r.rules} rules (${r.denylistTerms} private denylist terms), ${r.allowed.length} allowlisted, ${r.hits.length} hits -> ${r.hits.length ? "FAIL" : "CLEAN"}`);
  }
  process.exit(r.hits.length ? 1 : 0);
}
