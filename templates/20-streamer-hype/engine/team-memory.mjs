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
