#!/usr/bin/env node
// Checks every local Markdown link in the repo: the target file exists and, for Markdown targets, the #anchor exists.
// Created by @meta_alchemist (https://x.com/meta_alchemist). Web links are not fetched. Exit 1 on any broken link.
// Usage: node scripts/check-links.mjs [--json] [--root <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const rootIdx = args.indexOf("--root");
const ROOT = path.resolve(rootIdx >= 0 ? args[rootIdx + 1] : path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));

function mdFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...mdFiles(p));
    else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
  return out;
}
// GitHub-style heading anchors.
export function slug(heading) {
  return heading.trim().toLowerCase().replace(/<[^>]+>/g, "").replace(/[`*_~]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
}
function anchors(file) {
  const text = fs.readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
  const seen = new Map(), out = new Set();
  for (const m of text.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const base = slug(m[1]); const n = seen.get(base) ?? 0;
    out.add(n ? `${base}-${n}` : base); seen.set(base, n + 1);
  }
  return out;
}

export function checkLinks(root = ROOT) {
  const broken = []; let checked = 0;
  const cache = new Map();
  for (const file of mdFiles(root)) {
    const text = fs.readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    for (const m of text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue; // web, mailto, grokbot:// and similar
      checked++;
      const [rel, hash] = target.split("#");
      const dest = rel ? path.resolve(path.dirname(file), decodeURIComponent(rel)) : file;
      const where = path.relative(root, file);
      if (!fs.existsSync(dest)) { broken.push({ file: where, target, reason: "missing file" }); continue; }
      if (hash && dest.endsWith(".md")) {
        if (!cache.has(dest)) cache.set(dest, anchors(dest));
        if (!cache.get(dest).has(hash.toLowerCase())) broken.push({ file: where, target, reason: "missing anchor" });
      }
    }
  }
  return { checked, broken };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = checkLinks();
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    for (const b of r.broken) console.log(`BROKEN ${b.file}: ${b.target} (${b.reason})`);
    console.log(`check-links: ${r.checked} local links, ${r.broken.length} broken -> ${r.broken.length ? "FAIL" : "OK"}`);
  }
  process.exit(r.broken.length ? 1 : 0);
}
