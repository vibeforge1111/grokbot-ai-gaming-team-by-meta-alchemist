// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Reads an owner-prepared, de-identified event journal and prints an evidence pack or, with --digest, the local digest.
// All changes are in memory. Usage: node ledger/import-claim-ledger.mjs journal.json [--digest]
// Subject keys are the kit's salted subject ids (sub_ plus 32 lowercase hex, see the kit's team memory hashSubject).
// Row ids, prize keys, decision references and evidence references are short opaque keys.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {newLedger, addRow, apply, reconcile, digest, packMetrics, probeAuthority} from "./ledger.mjs";
export const SUBJECT = /^sub_[0-9a-f]{32}$/;
const safeKey = value => typeof value === "string" && /^[a-z][a-z0-9-]{0,31}$/.test(value);
export function importJournal(input) {
  if (!input || !Array.isArray(input.rows) || !input.profile) throw new Error("Supply a journal with rows and a profile");
  const ledger = newLedger(input.profile);
  for (const row of input.rows) {
    if (![row.id,row.prizeKey].every(safeKey) || !SUBJECT.test(String(row.subjectKey))) throw new Error("Supply opaque row and prize keys and a salted subject id (sub_ plus 32 hex)");
    if (!addRow(ledger,{id:row.id,kind:row.kind === "refund" ? "refund" : "entitlement",prizeKey:row.prizeKey,subjectKey:row.subjectKey})) throw new Error("Duplicate row " + row.id);
    for (const event of row.history || []) {
      if ((event.decisionRef && !safeKey(event.decisionRef)) || (event.evidence && !safeKey(event.evidence.ref))) throw new Error("Use opaque evidence references");
      const result = apply(ledger,{id:row.id,to:event.to,actor:{role:event.role},at:event.at,decisionRef:event.decisionRef,evidence:event.evidence});
      if (!result.ok) throw new Error(`Invalid journal transition for row ${row.id}: ${result.why}`);
    }
  }
  const rec = reconcile(ledger,{nowMs:input.nowMs,slaDays:input.profile.slaDays,deadlineMs:input.deadlineMs,entitlementSnapshot:input.snapshot});
  const probe = probeAuthority(ledger,fs.readFileSync(new URL("./ledger.mjs",import.meta.url),"utf8"));
  const text = digest(ledger,rec);
  const metrics = packMetrics(ledger,rec,probe,{digestBuilt:true,digestHasFullAddress:/\b(?=[0-9A-Za-z]*\d)[0-9A-Za-z]{20,}\b/.test(text)});
  delete metrics.wallet;
  delete metrics.eligibility; // The journal carries transitions, not the claim review.
  const artifacts = [{id:"ledger-export",kind:"trace"},{id:"authority-probe",kind:"trace"},{id:"digest",kind:"static"}];
  if (rec.snapshotPresent) artifacts.push({id:"entitlement-read",kind:"trace"});
  const pack = {status:"VALID",packId:input.packId,gitSha:input.gitSha,liveSha:input.liveSha,synthetic:input.synthetic === true,artifacts,profile:input.profile,metrics};
  return {pack,text};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv.slice(2).find(a => !a.startsWith("--"));
  if (!file) { console.error("usage: node ledger/import-claim-ledger.mjs journal.json [--digest]"); process.exit(2); }
  const {pack,text} = importJournal(JSON.parse(fs.readFileSync(file, "utf8")));
  console.log(process.argv.includes("--digest") ? text : JSON.stringify(pack,null,2));
}
