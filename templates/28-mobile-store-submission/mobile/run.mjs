// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Usage: node mobile/run.mjs [<adapter-dir> | checks.json] [--report | --findings] [--pack-id <id> --git-sha <sha> --live-sha <sha>]
// A directory is read by the optional Capacitor adapter (mobile/check.mjs); a JSON file is any target's normalized checks.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FILES, check, report, probeAuthority } from "./check.mjs";
import { review } from "./review.mjs";

// Example configuration for the optional Android and iOS file adapter.
export const PROFILE = {minTargetSdk:35,minIosTarget:15,allowedPermissions:["android.permission.INTERNET"],minProbeAttempts:12};
const groups = {
  config:["C1","C2","C3","C4","C5","C6","C7","C8"], hard:["H1","H2","H3","H4"],perm:["P1","P2"],
  privacy:["P3","P4","P6"], billing:["S1"],accounts:["S2","S3"],secrets:["K1","K2"],signing:["O1"],
  listing:["L-screenshots","L-description","L-ageRating","L-dataSafetyForm","L-appPrivacyLabels"]
};
export function run(location, options = {}) {
  let input, F, rep;
  if (!fs.statSync(location).isDirectory()) {
    input = JSON.parse(fs.readFileSync(location,"utf8"));
  } else {
    const read = f => fs.existsSync(path.join(location,f)) ? fs.readFileSync(path.join(location,f),"utf8") : null;
    const files = Object.fromEntries(FILES.map(f => [f,read(f)]));
    const answers = JSON.parse(read("answers.json") || "{}"), tree = JSON.parse(read("tree.json") || "[]");
    const synthetic = options.synthetic === true;
    const profile = synthetic ? PROFILE : JSON.parse(read("profile.json") || "{}");
    if (!Array.isArray(profile.allowedPermissions) || !Number.isFinite(profile.minTargetSdk) || !Number.isFinite(profile.minIosTarget)) throw new Error("Supply an adapter profile with SDK targets and permission policy");
    const liveSha = options.liveSha || (synthetic ? "synthetic" : null);
    F = check(files,answers,tree,profile);
    const present = filename => !!files[filename]?.trim();
    const both = FILES.every(present);
    const seen = id => {
      if (id.startsWith("C") || id.startsWith("H")) return both;
      if (id === "K1") return both;
      if (id === "K2") return tree.length > 0;
      if (id === "P1" || id === "P2") return present("AndroidManifest.xml") && present("Info.plist");
      if (id === "P3" || id === "P4") return present("PrivacyInfo.xcprivacy") && typeof answers.collectsAccountData === "boolean";
      if (id === "P6") return typeof answers.privacyPolicyUrl === "string";
      if (id === "S1") return typeof answers.sellsDigitalItemsOutsideStoreBilling === "boolean";
      if (id === "S2") return typeof answers.thirdPartyLoginOnly === "boolean";
      if (id === "S3") return typeof answers.accountDeletionInApp === "boolean";
      if (id === "O1") return typeof answers.ownerHoldsSigning === "boolean";
      return typeof answers.listing?.[id.slice(2)] === "boolean";
    };
    const checks = [];
    for (const [group,ids] of Object.entries(groups)) for (const id of ids) {
      const f = F.find(row => row.id === id);
      if (!seen(id)) { f.severity="unknown"; f.fix="Provide the local evidence for this check."; continue; }
      checks.push({group,id,build:liveSha,source:f.evidence,passed:f.severity === "pass"});
    }
    input = {packId:synthetic ? "synthetic-store" : options.packId,gitSha:options.gitSha || (synthetic ? "synthetic" : null), liveSha,
      synthetic,profile:{...profile,requirements:groups},checks};
    rep = report(F,"selected target");
  }
  const {metrics,artifacts,findings} = review(input);
  const probe = probeAuthority(fs.readFileSync(new URL("./check.mjs",import.meta.url),"utf8"));
  metrics.authority = {artifact:"inspection",forbiddenAttempted:probe.forbiddenAttempted,forbiddenSucceeded:probe.forbiddenSucceeded,toolCalls:probe.toolCalls};
  artifacts.push({id:"inspection",kind:"trace"});
  const {packId,synthetic,gitSha,liveSha,profile} = input;
  const pack = {packId,synthetic,gitSha,liveSha,status:"VALID",profile,metrics,artifacts};
  return {pack,F:F ?? findings,rep:rep ?? ["# DRAFT store readiness checklist","",...findings.map(f => `- ${f.group} / ${f.id}: ${f.status}`)].join("\n")};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), value = k => a.includes(k) ? a[a.indexOf(k)+1] : undefined;
  const target = a[0] && !a[0].startsWith("--") ? a[0] : null;
  const result = run(target || fileURLToPath(new URL("./fixture",import.meta.url)),{synthetic:!target,gitSha:value("--git-sha"),liveSha:value("--live-sha"),packId:value("--pack-id")});
  console.log(a.includes("--report") ? result.rep : JSON.stringify(a.includes("--findings") ? result.F : result.pack,null,2));
}
