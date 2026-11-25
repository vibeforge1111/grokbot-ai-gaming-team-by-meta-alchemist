// Keep a Changelog reader and the breaking-change rule. Created by @meta_alchemist (https://x.com/meta_alchemist).
// Rule: a release whose entry has a "Breaking" or "Removed" section, or a bullet starting "BREAKING", needs a new
// major version (for 0.x versions, a new minor version), compared with the release below it.
import { parse, compare, valid } from "./semver.mjs";

const HEAD = /^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?\s*$/;
const SECTION = /^### (.+?)\s*$/;
export const SECTIONS = ["Breaking", "Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"];

export function parseChangelog(text) {
  const releases = [];
  let cur = null, sec = null;
  for (const line of text.split("\n")) {
    const h = HEAD.exec(line);
    if (h) { releases.push(cur = { version: h[1], date: h[2] ?? null, sections: {} }); sec = null; continue; }
    const s = SECTION.exec(line);
    if (s && cur) { sec = s[1]; cur.sections[sec] ||= []; continue; }
    if (cur && sec && /^\s*[-*] /.test(line)) cur.sections[sec].push(line.replace(/^\s*[-*] /, "").trim());
  }
  return releases;
}

export const isBreaking = (rel) => (rel.sections.Breaking?.length ?? 0) > 0 || (rel.sections.Removed?.length ?? 0) > 0 ||
  Object.values(rel.sections).flat().some((b) => /^BREAKING\b/.test(b));

// Returns a list of problems. manifestVersion is the template.json version.
export function checkChangelog(text, manifestVersion) {
  const problems = [];
  if (!/^# Changelog/m.test(text)) problems.push('first heading must be "# Changelog"');
  if (!/keepachangelog\.com/.test(text)) problems.push("must link Keep a Changelog");
  const all = parseChangelog(text);
  if (!all.length || all[0].version !== "Unreleased") problems.push('first entry must be "## [Unreleased]"');
  const released = all.filter((r) => r.version !== "Unreleased");
  if (!released.length) problems.push("no released version");
  for (const r of released) {
    if (!valid(r.version)) problems.push(`${r.version}: not a semver version`);
    if (!r.date) problems.push(`${r.version}: missing date (## [x.y.z] - YYYY-MM-DD)`);
    for (const s of Object.keys(r.sections)) if (!SECTIONS.includes(s)) problems.push(`${r.version}: unknown section "${s}"`);
    if (!Object.values(r.sections).flat().length) problems.push(`${r.version}: empty entry`);
  }
  if (released.length && manifestVersion && released[0].version !== manifestVersion) {
    problems.push(`newest release ${released[0].version} does not match template.json version ${manifestVersion}`);
  }
  for (let i = 0; i + 1 < released.length; i++) {
    const newer = released[i], older = released[i + 1];
    if (!valid(newer.version) || !valid(older.version)) continue;
    if (compare(newer.version, older.version) <= 0) { problems.push(`${newer.version} is not newer than ${older.version} below it`); continue; }
    if (isBreaking(newer)) {
      const a = parse(newer.version), b = parse(older.version);
      const bumped = b.major === 0 ? a.major > 0 || a.minor > b.minor : a.major > b.major;
      if (!bumped) problems.push(`${newer.version} has a breaking change but is not a new major version after ${older.version}`);
    }
  }
  return problems;
}
