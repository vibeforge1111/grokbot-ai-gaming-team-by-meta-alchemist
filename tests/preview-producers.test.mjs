// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Each preview producer writes artifact bytes and a receipt, then the lens grades the pack from that folder.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function run(args, cwd = root) {
  return spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
}

function grade(lens, packPath) {
  const result = run([lens, packPath]);
  if (result.status !== 0 && !result.stdout.trim()) {
    return { verdict: "INVALID", grade: null, reason: result.stderr || `exit ${result.status}` };
  }
  try {
    return JSON.parse(result.stdout);
  } catch (err) {
    return { verdict: "INVALID", grade: null, reason: result.stdout || result.stderr || String(err) };
  }
}

const cases = [
  {
    id: "02-playtest-performance",
    args: ["templates/02-playtest-performance/engine/build-pack.mjs", "templates/02-playtest-performance/fixtures/good-pack.json"],
    lens: "templates/02-playtest-performance/engine/lens.mjs",
    expectPass: true,
    allowSynthetic: true,
  },
  {
    id: "23-support-moderation-desk",
    args: ["templates/23-support-moderation-desk/support/build-pack.mjs", "templates/23-support-moderation-desk/support/fixture"],
    lens: "templates/23-support-moderation-desk/engine/lens.mjs",
    expectPass: true,
  },
  {
    id: "24-prize-refund-ledger",
    args: ["templates/24-prize-refund-ledger/ledger/import-claim-ledger.mjs"],
    journalFrom: ["templates/24-prize-refund-ledger/ledger/build-journal.mjs"],
    lens: "templates/24-prize-refund-ledger/engine/lens.mjs",
    expectPass: true,
  },
  {
    id: "25-matchmaking-lobby-fill",
    args: ["templates/25-matchmaking-lobby-fill/mm/scenario.mjs", "--live"],
    lens: "templates/25-matchmaking-lobby-fill/engine/lens.mjs",
    expectPass: true,
  },
  {
    id: "26-balance-patch-director",
    args: ["templates/26-balance-patch-director/balance/run.mjs", "templates/26-balance-patch-director/balance/data/fixture-ledger.json", "--live"],
    lens: "templates/26-balance-patch-director/engine/lens.mjs",
    expectPass: true,
  },
  {
    id: "27-retention-cohort-analytics",
    args: ["templates/27-retention-cohort-analytics/cohorts/scenario.mjs", "--live"],
    lens: "templates/27-retention-cohort-analytics/engine/lens.mjs",
    expectPass: true,
  },
  {
    id: "28-mobile-store-submission",
    args: ["templates/28-mobile-store-submission/mobile/run.mjs", "templates/28-mobile-store-submission/fixtures/plain-checks.json", "--live"],
    lens: "templates/28-mobile-store-submission/engine/lens.mjs",
    expectPass: true,
  },
];

describe("preview pack producers", () => {
  for (const c of cases) {
    it(`${c.id} writes a receipt and grades without INVALID`, () => {
      const out = fs.mkdtempSync(path.join(os.tmpdir(), `aigt-${c.id}-`));
      const args = [...c.args];
      if (c.journalFrom) {
        const built = run(c.journalFrom);
        assert.equal(built.status, 0, built.stderr || built.stdout);
        const journal = path.join(out, "journal.json");
        fs.mkdirSync(out, { recursive: true });
        fs.writeFileSync(journal, built.stdout);
        args.push(journal);
      }
      const produced = run([...args, "--out", out]);
      assert.equal(produced.status, 0, produced.stderr || produced.stdout);
      const packPath = path.join(out, "pack.json");
      assert.equal(fs.existsSync(packPath), true, "pack.json was not written");
      const pack = JSON.parse(fs.readFileSync(packPath, "utf8"));
      if (!c.allowSynthetic) {
        assert.notEqual(pack.synthetic, true, "live producer path must not mark the pack synthetic");
        assert.equal(pack.producerReceipt?.schema, "game-evidence-v1");
      }
      const rec = grade(path.join(root, c.lens), packPath);
      assert.notEqual(rec.verdict, "INVALID", rec.reason || JSON.stringify(rec));
      if (c.expectPass) {
        assert.equal(rec.verdict, "PASS", `${rec.verdict} ${rec.grade} ${rec.reason || ""}`);
        assert.equal(rec.grade, 100);
      }
    });
  }
});
