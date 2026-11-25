// Scrub check tests: the repo is clean, and planted leaks are caught. Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scan } from "../scripts/scrub-check.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("the repo is clean", () => {
  const r = scan(ROOT, process.env.SCRUB_DENYLIST || null);
  assert.equal(r.hits.length, 0, JSON.stringify(r.hits.slice(0, 5), null, 1));
  assert.ok(r.scanned > 100);
});

// Fake values assembled at runtime so this file never holds a real looking secret.
const j = (...p) => p.join("");
const plants = {
  "github-token": j("ghp", "_", "A".repeat(36)),
  "openai-style-key": j("sk", "-", "b".repeat(32)),
  "slack-token": j("xox", "b-", "1234567890-abcdef"),
  "aws-key": j("AK", "IA", "ABCDEFGHIJKLMNOP"),
  "private-key": j("-----BEGIN ", "RSA PRIVATE KEY-----"),
  "ipv4": j("100.", "101.", "102.", "103"),
  "email": j("someone", "@", "company.io"),
  "local-path": j("/home", "/someone/project"),
  "private-hostname": j("build-box.", "tail1234.ts.net"),
  "uuid": "123e4567-e89b-42d3-a456-426614174000",
  "env-secret": j("SERVICE_", "TOKEN=", "a".repeat(18)),
  "discord-id": "1".repeat(18),
  "discord-webhook": j("https://", "discord.com/api/", "webhooks/123/", "fakeToken"),
  "assigned-player-name": j("player_", 'name="', "redaction-test", '"'),
  "assigned-social-id": j("x_", 'id="', "12345", '"'),
  "evm-wallet": j("0x", "ab".repeat(20)),
  "token-sale": j("join the air", "drop"),
  "launch-date": j("launching on ", "Friday"),
  "handle": j("thanks ", "@", "somebody_123", " for the clip"),
};
for (const [rule, text] of Object.entries(plants)) {
  test(`catches ${rule}`, () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scrub-"));
    fs.writeFileSync(path.join(tmp, "leak.md"), `Line one.\n${text}\n`);
    const r = scan(tmp, null);
    assert.ok(r.hits.some((h) => h.rule === rule), `${rule} not caught: ${JSON.stringify(r.hits)}`);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
}

test("private denylist terms are caught and never echoed", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scrub-"));
  fs.writeFileSync(path.join(tmp, "doc.md"), "Our codename is Bluebottle.\n");
  const deny = path.join(tmp, ".scrub-denylist");
  fs.writeFileSync(deny, "# private\nbluebottle\n");
  const r = scan(tmp, deny);
  assert.equal(r.hits.length, 1);
  assert.deepEqual(r.hits[0], { rule: "denylist", file: "doc.md", line: 1 });
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("safe look-alikes pass", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scrub-"));
  fs.writeFileSync(path.join(tmp, "ok.md"), "Created by @meta_alchemist. Mail test@example.com. Docs IP 192.0.2.10. Version 1.1.1. localhost:3000.\n");
  assert.equal(scan(tmp, null).hits.length, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});
