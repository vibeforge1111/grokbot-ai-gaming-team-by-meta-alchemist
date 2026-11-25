// Shared team memory: schema, helper, append-only rule and the personal-data lint.
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  FIELDS, TOPICS, CONFIDENCE, SUBJECT, makeRecord, lintRecord, lintText, lintDir, append, readTopic, hashSubject, isAppendOnly, memoryDir,
} from "../shared/team-memory/team-memory.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const HELPER = path.join(ROOT, "shared", "team-memory", "team-memory.mjs");
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, "spec", "shared-memory.schema.json"), "utf8"));
const SALT = "fixture-salt-".padEnd(32, "x");
const writer = { id: "gbf-06-economy-director", version: "1.0.0" };
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "team-memory-"));
const ok = (over = {}) => makeRecord({ writer, topic: "balance", kind: "value-changed", summary: "Daily reward raised after the week 2 simulation.",
  data: { parameter: "dailyReward", from: 40, to: 50 }, source: { artifact: "economy-change-list" }, confidence: "measured", ...over });
// Fake personal values are assembled at runtime so this file never holds one.
const j = (...p) => p.join("");

test("schema and helper agree on fields, topics and confidence", () => {
  assert.deepEqual([...schema.required].sort(), [...FIELDS].sort());
  assert.deepEqual(Object.keys(schema.properties).sort(), [...FIELDS].sort());
  assert.deepEqual(schema.properties.topic.enum, TOPICS);
  assert.deepEqual(schema.properties.confidence.enum, CONFIDENCE);
  assert.deepEqual(TOPICS, ["decisions", "incidents", "entitlements", "balance", "regions", "releases"]);
  assert.equal(schema.additionalProperties, false);
});

test("a valid record lints clean and round-trips through append and read", () => {
  const dir = tmp(), r = ok();
  assert.deepEqual(lintRecord(r, { writes: ["balance"] }), []);
  append(dir, r, { writes: ["decisions", "balance"] });
  assert.deepEqual(readTopic(dir, "balance"), [r]);
  assert.deepEqual(readTopic(dir, "incidents"), []);
  assert.deepEqual(lintDir(memoryDir(dir)), []);
});

test("a template may write only the topics it owns", () => {
  const dir = tmp();
  assert.throws(() => append(dir, ok({ topic: "entitlements" }), { writes: ["balance"] }), /may not write topic entitlements/);
  assert.throws(() => append(dir, ok(), {}), /writes/);
  assert.equal(fs.existsSync(path.join(memoryDir(dir), "entitlements.jsonl")), false);
});

test("supersedes hides the old record, expiry hides stale ones, and --all shows everything", () => {
  const dir = tmp(), t0 = new Date("2030-01-01T00:00:00.000Z");
  const first = append(dir, ok({ now: t0 }), { writes: ["balance"] });
  const second = append(dir, ok({ now: new Date(t0.getTime() + 1000), supersedes: first.id, summary: "Corrected: reward raised to 45, not 50." }), { writes: ["balance"] });
  const short = append(dir, ok({ now: new Date(t0.getTime() + 2000), expiresAt: new Date(t0.getTime() + 3000).toISOString() }), { writes: ["balance"] });
  const later = new Date(t0.getTime() + 10_000);
  assert.deepEqual(readTopic(dir, "balance", { now: later }).map((r) => r.id), [second.id]);
  assert.deepEqual(readTopic(dir, "balance", { now: new Date(t0.getTime() + 2500) }).map((r) => r.id), [second.id, short.id]);
  assert.equal(readTopic(dir, "balance", { all: true }).length, 3);
  assert.throws(() => append(dir, ok({ supersedes: "mem_zzzzzzzz_00000000" }), { writes: ["balance"] }), /not in balance/);
});

test("the lint rejects personal data in values", () => {
  const plants = {
    email: j("someone", "@", "studio.io"),
    handle: j("thanks ", "@", "player_123"),
    url: j("https://", "social.example/", "someone"),
    "evm-wallet": j("0x", "ab".repeat(20)),
    ipv4: j("100.", "101.", "102.", "103"),
    phone: j("+44 ", "20 7946 ", "0018"),
    "long-number-id": "1".repeat(17),
    "api-key": j("sk", "-live-", "a".repeat(24)),
    "private-key": j("-----BEGIN ", "RSA PRIVATE KEY-----"),
    jwt: j("eyJ", "a".repeat(12), ".", "b".repeat(12), ".", "c".repeat(12)),
    "base58-address": j("7Xq", "Fh2Lk9", "MnPq3Rs", "Tu4Vw5", "Xy6Za7Bc8", "Dd"),
  };
  for (const [rule, value] of Object.entries(plants)) {
    for (const where of ["summary", "data"]) {
      const r = where === "summary" ? ok({ summary: `Refund reviewed for ${value}` }) : ok({ data: { note: value } });
      const problems = lintRecord(r, { writes: ["balance"] });
      assert.ok(problems.some((p) => p.includes(rule)), `${rule} in ${where} was not caught: ${JSON.stringify(problems)}`);
    }
  }
});

test("the lint rejects personal-data keys and unhashed subject ids", () => {
  for (const key of ["name", "email", "playerId", "user_id", "wallet", "Display Name", "ip", "handle", "phone", "apiKey"]) {
    const problems = lintRecord(ok({ data: { [key]: "x" } }), { writes: ["balance"] });
    assert.ok(problems.some((p) => p.includes(`key "${key}"`)), `${key} not caught`);
  }
  assert.ok(lintRecord(ok({ data: { subject: "account-42" } })).some((p) => p.includes("hashed")));
  assert.ok(lintRecord(ok({ data: { subjects: ["sub_" + "a".repeat(32), "raw"] } })).some((p) => p.includes("hashed")));
  assert.deepEqual(lintRecord(ok({ data: { subjects: ["sub_" + "a".repeat(32)] } })), []);
});

test("the lint rejects broken records", () => {
  const r = ok();
  assert.ok(lintRecord({ ...r, extra: 1 }).some((p) => p.includes("unknown field extra")));
  assert.ok(lintRecord({ ...r, time: "yesterday" }).some((p) => p.includes("UTC")));
  assert.ok(lintRecord({ ...r, topic: "gossip" }).some((p) => p.includes("topic")));
  assert.ok(lintRecord({ ...r, confidence: "sure" }).some((p) => p.includes("confidence")));
  assert.ok(lintRecord({ ...r, expires_at: r.time }).some((p) => p.includes("expires_at")));
  assert.ok(lintRecord({ ...r, writer: { id: "gbf-06-economy-director" } }).some((p) => p.includes("writer")));
  assert.ok(lintRecord({ ...r, summary: "x".repeat(281) }).some((p) => p.includes("summary")));
  assert.ok(lintRecord({ ...r, data: { blob: "x".repeat(5000) } }).some((p) => p.includes("larger")));
  const { source, ...noSource } = r;
  assert.ok(lintRecord(noSource).some((p) => p.includes("missing field source")));
});

test("lintText catches duplicate ids, forward supersedes and blank lines", () => {
  const a = ok(), b = ok({ supersedes: a.id });
  assert.deepEqual(lintText(JSON.stringify(a) + "\n" + JSON.stringify(b) + "\n", "balance"), []);
  assert.ok(lintText(JSON.stringify(b) + "\n" + JSON.stringify(a) + "\n", "balance").some((p) => p.includes("not an earlier record")));
  assert.ok(lintText(JSON.stringify(a) + "\n" + JSON.stringify(a) + "\n", "balance").some((p) => p.includes("duplicate id")));
  assert.ok(lintText(JSON.stringify(a) + "\n\n" + JSON.stringify(b) + "\n", "balance").some((p) => p.includes("blank line")));
  assert.ok(lintText(JSON.stringify(a) + "\n", "incidents").some((p) => p.includes("in incidents.jsonl")));
  assert.ok(lintText(JSON.stringify(a) + "\n", "balance", { owners: { [writer.id]: ["decisions"] } }).some((p) => p.includes("may not write")));
});

test("hashSubject needs the salt and is stable per salt", () => {
  assert.throws(() => hashSubject("account-42", undefined), /GROKBOT_TEAM_SALT/);
  assert.throws(() => hashSubject("account-42", "short"), /16 or more/);
  const h = hashSubject("account-42", SALT);
  assert.match(h, SUBJECT);
  assert.equal(hashSubject("account-42", SALT), h);
  assert.notEqual(hashSubject("account-42", SALT + "y"), h);
  assert.notEqual(hashSubject("account-43", SALT), h);
  assert.ok(!h.includes("account"));
});

test("isAppendOnly accepts additions and rejects edits", () => {
  const a = JSON.stringify(ok()) + "\n", b = JSON.stringify(ok()) + "\n";
  assert.equal(isAppendOnly("", a), true);
  assert.equal(isAppendOnly(a, a + b), true);
  assert.equal(isAppendOnly(a + b, b), false);
  assert.equal(isAppendOnly(a, a.replace("50", "55")), false);
});

test("the CLI lints a folder and hashes with the environment salt", () => {
  const dir = tmp();
  append(dir, ok(), { writes: ["balance"] });
  const clean = spawnSync(process.execPath, [HELPER, "lint", memoryDir(dir)], { encoding: "utf8" });
  assert.equal(clean.status, 0, clean.stdout);
  fs.appendFileSync(path.join(memoryDir(dir), "balance.jsonl"), JSON.stringify({ ...ok(), data: { email: "x" } }) + "\n");
  const dirty = spawnSync(process.execPath, [HELPER, "lint", memoryDir(dir)], { encoding: "utf8" });
  assert.equal(dirty.status, 1);
  assert.match(dirty.stdout, /personal data/);
  const noSalt = spawnSync(process.execPath, [HELPER, "hash", "account-42"], { encoding: "utf8", env: { ...process.env, GROKBOT_TEAM_SALT: "" } });
  assert.equal(noSalt.status, 1);
  const salted = spawnSync(process.execPath, [HELPER, "hash", "account-42"], { encoding: "utf8", env: { ...process.env, GROKBOT_TEAM_SALT: SALT } });
  assert.equal(salted.stdout.trim(), hashSubject("account-42", SALT));
});
