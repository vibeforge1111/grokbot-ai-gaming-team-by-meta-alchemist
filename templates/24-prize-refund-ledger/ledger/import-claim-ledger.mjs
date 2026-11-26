// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Reads an owner-prepared, de-identified event journal and prints an evidence pack or, with --digest, the local digest.
// All changes are in memory. Usage: node ledger/import-claim-ledger.mjs journal.json [--digest] [--out <dir>]
// Subject keys are the kit's salted subject ids (sub_ plus 32 lowercase hex, see the kit's team memory hashSubject).
// Row ids, prize keys, decision references and evidence references are short opaque keys.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {newLedger, addRow, apply, checkClaim, checkWallet, reconcile, digest, packMetrics} from "./ledger.mjs";
import { writeEvidencePack } from "../engine/write-pack.mjs";
export const SUBJECT = /^sub_[0-9a-f]{32}$/;
const safeKey = value => typeof value === "string" && /^[a-z][a-z0-9-]{0,31}$/.test(value);
export function importJournal(input) {
  if (!input || !Array.isArray(input.rows) || !input.profile) throw new Error("Supply a journal with rows and a profile");
  const ledger = newLedger(input.profile);
  for (const row of input.rows) {
    if (![row.id,row.prizeKey].every(safeKey) || !SUBJECT.test(String(row.subjectKey))) throw new Error("Supply opaque row and prize keys and a salted subject id (sub_ plus 32 hex)");
    if (!addRow(ledger,{id:row.id,kind:row.kind === "refund" ? "refund" : row.kind || "entitlement",prizeKey:row.prizeKey,subjectKey:row.subjectKey,winnerKey:row.winnerKey,needsWallet:row.needsWallet === true})) throw new Error("Duplicate row " + row.id);
    if (row.claim) checkClaim(ledger, row.id, row.claim, input.profile);
    for (const event of row.history || []) {
      if ((event.decisionRef && !safeKey(event.decisionRef)) || (event.evidence && !safeKey(event.evidence.ref))) throw new Error("Use opaque evidence references");
      const result = apply(ledger,{id:row.id,to:event.to,actor:{role:event.role},at:event.at,decisionRef:event.decisionRef,evidence:event.evidence});
      if (!result.ok) throw new Error(`Invalid journal transition for row ${row.id}: ${result.why}`);
    }
    if (row.wallet) {
      const lists = { known: input.knownAddresses || [], exchanges: input.exchangeAddresses || [] };
      checkWallet(ledger, row.id, row.wallet, lists);
    }
  }
  const rec = reconcile(ledger,{nowMs:input.nowMs,slaDays:input.profile.slaDays,deadlineMs:input.deadlineMs,entitlementSnapshot:input.snapshot});
  const text = digest(ledger,rec);
  const audit = input.audit || { attempted: 0, succeeded: 0, valueMovingFunctions: 0 };
  const caught = (k) => [...ledger.rows.values()].filter((r) => (r.walletFlags || []).includes(k)).length;
  const metrics = packMetrics(ledger,rec,audit,{
    digestBuilt:true,
    digestHasFullAddress:/\b(?=[0-9A-Za-z]*\d)[0-9A-Za-z]{20,}\b/.test(text),
    unmaskedInOutputs: (text.match(/\b(?=[0-9A-Za-z]*\d)[0-9A-Za-z]{20,}\b/g) || []).length,
    poisonPlanted: input.poisonPlanted || 0,
    poisonCaught: caught("POISON_SUSPECT"),
    exchangePlanted: input.exchangePlanted || 0,
    exchangeCaught: caught("EXCHANGE"),
  });
  const ledgerBody = { rows: [...ledger.rows.values()].map(r => ({id:r.id,kind:r.kind,state:r.state,prizeKey:r.prizeKey,claimFlags:r.claimFlags,walletFlags:r.walletFlags,walletMask:r.walletMask})) };
  const artifacts = [
    {id:"ledger-export",kind:"trace",path:"artifacts/ledger-export.json",body:ledgerBody},
    {id:"authority-probe",kind:"trace",path:"artifacts/authority-probe.json",body:audit},
    {id:"digest",kind:"static",path:"artifacts/digest.md",body:text},
    {id:"wallet-checks",kind:"trace",path:"artifacts/wallet-checks.json",body:{known:input.knownAddresses||[],exchanges:input.exchangeAddresses||[]}},
  ];
  if (rec.snapshotPresent) artifacts.push({id:"entitlement-read",kind:"trace",path:"artifacts/entitlement-read.json",body:input.snapshot});
  const pack = {status:"VALID",packId:input.packId,gitSha:input.gitSha,liveSha:input.liveSha,synthetic:input.synthetic === true,artifacts,profile:input.profile,metrics};
  return {pack,text,audit};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const takes = new Set(["--out"]);
  const file = args.find((a, i) => !a.startsWith("--") && !takes.has(args[i-1]));
  if (!file) { console.error("usage: node ledger/import-claim-ledger.mjs journal.json [--digest] [--out <dir>]"); process.exit(2); }
  const {pack,text} = importJournal(JSON.parse(fs.readFileSync(file, "utf8")));
  const out = args.includes("--out") ? args[args.indexOf("--out")+1] : undefined;
  if (args.includes("--digest")) console.log(text);
  else if (out) {
    const written = writeEvidencePack(out, pack, {
      producer: "gbf-24-prize-refund-ledger",
      profileId: pack.profile?.profileId || pack.packId,
      device: pack.profile?.device || "ledger-export",
      hook: "claim-journal",
      gameplayArtifact: "ledger-export",
    });
    console.log(JSON.stringify(written,null,2));
  } else console.log(JSON.stringify(pack,null,2));
}
