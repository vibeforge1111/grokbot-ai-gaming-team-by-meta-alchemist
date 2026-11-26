// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Build a support-desk evidence pack from a redacted local intake folder.
// Usage: node support/build-pack.mjs <intake-dir> [--out <dir>] [--synthetic]
// Intake files (JSON): inventory.json, redteam.json, actions.json, kb.json,
// cases.json, observations.json, privacy.json. All changes stay local.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { draft, digest, revision } from "./drafts.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";

function readJson(dir, name) {
  const p = path.join(dir, name);
  if (!fs.existsSync(p)) throw new Error("Missing intake file " + name);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function metricsFromIntake(intake) {
  const inventory = intake.inventory || {};
  const tools = inventory.tools || [];
  const unknown = inventory.unknownAttempts || [];
  const redteam = intake.redteam || {};
  const cases = redteam.cases || [];
  const actions = intake.actions || {};
  const probes = actions.probes || [];
  const kb = intake.kb || {};
  const entries = kb.entries || [];
  const approved = entries.filter((e) => e.approved === true);
  const casesFile = intake.cases || {};
  const rows = casesFile.cases || [];
  const obs = intake.observations || {};
  const privacy = intake.privacy || {};
  const drafts = (casesFile.drafts || []).filter(Boolean);
  return {
    tools: {
      artifact: "tool-inventory",
      privilegedExposed: tools.filter((t) => t.privileged && t.exposed).length,
      unknownAttempted: unknown.length,
      unknownDenied: unknown.filter((a) => a.denied === true).length,
    },
    redteam: {
      artifact: "redteam-cases",
      cases: cases.length,
      failed: cases.filter((c) => c.passed !== true).length,
      categories: [...new Set(cases.map((c) => c.category).filter(Boolean))],
    },
    mod: {
      artifact: "action-probe",
      measuredCases: probes.length,
      liveActions: probes.filter((p) => p.live === true).length,
      protectedActions: probes.filter((p) => p.protected === true && p.executed === true).length,
      unknownActionsDenied: probes.length ? probes.filter((p) => p.unknown === true).every((p) => p.denied === true) : false,
      localPauseHolds: probes.length ? probes.every((p) => p.pauseHolds !== false) : false,
    },
    kb: {
      artifact: "kb-file",
      entries: entries.length,
      approved: approved.length,
      approvedShare: entries.length ? approved.length / entries.length : 0,
      entriesGuardPass: entries.filter((e) => revision(e)).length,
      purchaseRepliesWithoutReview: entries.filter((e) => e.topic === "purchase" && e.approved !== true && e.usedInDraft === true).length,
      editResetsApproval: kb.editResetsApproval === true,
      artifactsByLine: { "answers:2": "kb-revision-test" },
    },
    cases: {
      artifact: "case-trace",
      measuredCases: rows.length,
      draftsWithRef: rows.filter((c) => c.drafted === true && /^case-[a-z0-9]{1,12}$/.test(c.ref || c.caseRef || "")).length,
      outboundCalls: rows.reduce((n, c) => n + (Number(c.outboundCalls) || 0), 0),
    },
    privacy: {
      artifact: "action-probe",
      identifierEchoBlocked: privacy.identifierEchoBlocked === true,
      secretAskBlocked: privacy.secretAskBlocked === true,
      directContactFirstAllowed: privacy.directContactFirstAllowed === true,
      exportHasIdentifiers: privacy.exportHasIdentifiers === true,
      retentionDaysSet: Number.isFinite(privacy.retentionDays) && privacy.retentionDays > 0,
      measuredCases: Number(privacy.measuredCases) || [privacy.identifierEchoBlocked, privacy.secretAskBlocked, privacy.exportHasIdentifiers].filter((v) => typeof v === "boolean").length,
      artifactsByLine: { "privacy:2": "retention-profile" },
    },
    live: {
      artifact: "observation-log",
      observationDays: Number(obs.observationDays) || 0,
      firstResponseP50Min: obs.firstResponseP50Min,
      casesWithDraftShare: rows.length ? rows.filter((c) => c.drafted === true).length / rows.length : 0,
      sampleCases: Number(obs.sampleCases) || rows.length,
    },
    draftDigest: digest(drafts),
  };
}

export function buildPack(intakeDir, options = {}) {
  const inventory = readJson(intakeDir, "inventory.json");
  const redteam = readJson(intakeDir, "redteam.json");
  const actions = readJson(intakeDir, "actions.json");
  const kb = readJson(intakeDir, "kb.json");
  const cases = readJson(intakeDir, "cases.json");
  const observations = readJson(intakeDir, "observations.json");
  const privacy = readJson(intakeDir, "privacy.json");
  const profile = options.profile || JSON.parse(fs.readFileSync(path.join(intakeDir, "profile.json"), "utf8"));
  const metrics = metricsFromIntake({ inventory, redteam, actions, kb, cases, observations, privacy });
  const pack = {
    packId: options.packId || inventory.packId || "support-intake",
    status: "VALID",
    synthetic: options.synthetic === true,
    gitSha: options.gitSha || inventory.gitSha,
    liveSha: options.liveSha || inventory.liveSha,
    profile,
    artifacts: [
      { id: "tool-inventory", kind: "static", path: "artifacts/tool-inventory.json", body: inventory },
      { id: "redteam-cases", kind: "trace", path: "artifacts/redteam-cases.json", body: redteam },
      { id: "action-probe", kind: "trace", path: "artifacts/action-probe.json", body: actions },
      { id: "kb-file", kind: "static", path: "artifacts/kb-file.json", body: kb },
      { id: "observation-log", kind: "trace", path: "artifacts/observation-log.json", body: observations },
      { id: "case-trace", kind: "trace", path: "artifacts/case-trace.json", body: cases },
      { id: "kb-revision-test", kind: "trace", path: "artifacts/kb-revision-test.json", body: kb.revisionTests || kb },
      { id: "retention-profile", kind: "static", path: "artifacts/retention-profile.json", body: { retentionDays: privacy.retentionDays } },
    ],
    metrics,
  };
  delete metrics.draftDigest;
  return pack;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const takes = new Set(["--out", "--pack-id", "--git-sha", "--live-sha"]);
  const intake = args.find((a, i) => !a.startsWith("--") && !takes.has(args[i-1]));
  if (!intake) {
    console.error("usage: node support/build-pack.mjs <intake-dir> [--out <dir>] [--synthetic] [--pack-id <id>] [--git-sha <sha>] [--live-sha <sha>]");
    process.exit(2);
  }
  const value = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
  const pack = buildPack(intake, {
    synthetic: args.includes("--synthetic"),
    packId: value("--pack-id"),
    gitSha: value("--git-sha"),
    liveSha: value("--live-sha"),
  });
  const out = value("--out");
  if (out) {
    const written = writeEvidencePack(out, pack, {
      producer: "gbf-23-support-moderation-desk",
      profileId: pack.profile?.profileId || pack.packId,
      device: pack.profile?.device || "support-export",
      hook: "local-intake",
      gameplayArtifact: "case-trace",
    });
    console.log(JSON.stringify(written, null, 2));
  } else {
    console.log(JSON.stringify(pack, null, 2));
  }
}
