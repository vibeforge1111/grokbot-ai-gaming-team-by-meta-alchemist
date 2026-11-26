// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Synthetic mixed program (puzzle chapter unlocks, optional payout address checks, refunds, a lookalike address).
// Every key, address and reference is made up. The address format and mask lengths are this example's profile values.
import { newLedger, addRow, apply, checkClaim, checkWallet, reconcile, digest, packMetrics } from "./ledger.mjs";
import fs from "node:fs";
import { writeEvidencePack } from "../engine/write-pack.mjs";

const A = (h) => "0x" + h.padEnd(40, "0").slice(0, 40);
export const KNOWN_PAYOUT_ADDRESSES = [A("a1b2c3" + "1".repeat(30) + "d4e5"), A("77aa00" + "2".repeat(30) + "9f9f")];
export const EXCHANGES = [A("ee0001" + "3".repeat(30) + "beef")];
const POISON = "0xa1b2c3" + "9".repeat(30) + "d4e5"; // same first 6 and last 4 as KNOWN_PAYOUT_ADDRESSES[0], different middle
// Synthetic profile values: an example address format and mask lengths. Set your own in the pack profile.
export const PROFILE = { minProbeAttempts: 18, slaDays: 3, maxOverdue: 0, maxRefundsOwed: 2, maxReportedOnly: 0, addressPattern: "^0x[0-9a-fA-F]{40}$", maskHead: 6, maskTail: 4 };
const agent = { role: "agent" }, owner = { role: "owner" }, imp = { role: "evidence-import" };
const NOW = Date.UTC(2001, 0, 10, 12), at = (d) => new Date(NOW - d * 86400000).toISOString();

export function build({ broken = {} } = {}) {
  const L = newLedger(PROFILE), profile = { excludedKeys: ["k-team-1"] };
  const entry = (i) => `y${String(i).padStart(2, "0")}`;
  for (let i = 1; i <= 8; i++) addRow(L, { id: entry(i), kind: "entitlement", prizeKey: "chapter-unlock", winnerKey: `k-${i}` });
  // 1..4 normal winners: claim, identity, owner approval, confirmation from an entitlement read
  for (let i = 1; i <= 4; i++) {
    const id = entry(i); checkClaim(L, id, { claimantKey: `k-${i}`, subjectKey: `k-${i}` }, profile);
    apply(L, { id, to: "CLAIM_RECEIVED", actor: agent }); apply(L, { id, to: "IDENTITY_CHECKED", actor: agent });
    apply(L, { id, to: "GRANT_PROPOSED", actor: agent }); apply(L, { id, to: "GRANT_APPROVED", actor: owner, decisionRef: `decision-${i}`, at: at(1) });
    apply(L, { id, to: "GRANT_CONFIRMED", actor: imp, evidence: { kind: "entitlement-read", ref: `read-${i}` } });
  }
  // 5: a prize is requested for a different account: held, then the owner reviews
  checkClaim(L, entry(5), { claimantKey: "k-5", subjectKey: "k-alternate" }, profile);
  apply(L, { id: entry(5), to: "CLAIM_RECEIVED", actor: agent }); apply(L, { id: entry(5), to: "HELD", actor: agent, reason: "redirect to another account" });
  apply(L, { id: entry(5), to: "GRANT_APPROVED", actor: owner, decisionRef: "decision-5-redirect", at: at(1) });
  apply(L, { id: entry(5), to: "GRANT_CONFIRMED", actor: imp, evidence: { kind: "grant-log", ref: "log-5" } });
  // 6: team or affiliate
  checkClaim(L, entry(6), { claimantKey: "k-team-1", subjectKey: "k-team-1" }, { excludedKeys: ["k-team-1"] });
  L.rows.get(entry(6)).winnerKey = "k-team-1"; apply(L, { id: entry(6), to: "INELIGIBLE", actor: agent });
  // 7: already owned the entitlement: refund path, owner approves, receipt imported
  checkClaim(L, entry(7), { claimantKey: "k-7", subjectKey: "k-7", alreadyOwns: true }, profile);
  apply(L, { id: entry(7), to: "CLAIM_RECEIVED", actor: agent }); apply(L, { id: entry(7), to: "IDENTITY_CHECKED", actor: agent });
  apply(L, { id: entry(7), to: "REFUND_PROPOSED", actor: agent }); apply(L, { id: entry(7), to: "REFUND_APPROVED", actor: owner, decisionRef: "decision-7" });
  apply(L, { id: entry(7), to: "REFUND_CONFIRMED", actor: imp, evidence: { kind: "tx-receipt", ref: "tx-7" } });
  // 8: someone other than the winner replied from another account
  checkClaim(L, entry(8), { claimantKey: "k-stranger", subjectKey: "k-stranger" }, profile);
  apply(L, { id: entry(8), to: "HELD", actor: agent, reason: "reply from someone other than the winner" });
  // optional address review: five payout addresses, one lookalike of a known payout address, one exchange deposit address
  const wallets = [A("c0ffee" + "4".repeat(30) + "0001"), A("c0ffee" + "5".repeat(30) + "0002"), POISON, EXCHANGES[0], A("c0ffee" + "6".repeat(30) + "0005")];
  wallets.forEach((w, i) => {
    const id = `c0${i + 1}`; addRow(L, { id, kind: "contest", prizeKey: "contest-award", winnerKey: `w-${i}`, needsWallet: true });
    checkClaim(L, id, { claimantKey: `w-${i}`, subjectKey: `w-${i}` }, profile);
    apply(L, { id, to: "CLAIM_RECEIVED", actor: agent }); apply(L, { id, to: "IDENTITY_CHECKED", actor: agent });
    apply(L, { id, to: "WALLET_REQUESTED", actor: agent }); apply(L, { id, to: "WALLET_COLLECTED", actor: agent });
    const flags = checkWallet(L, id, w, { known: KNOWN_PAYOUT_ADDRESSES, exchanges: EXCHANGES });
    if (flags.length) apply(L, { id, to: "HELD", actor: agent, reason: `address flagged ${flags.join(" and ")} ${w}` });
    else { apply(L, { id, to: "WALLET_CHECKED", actor: agent }); apply(L, { id, to: "GRANT_PROPOSED", actor: agent }); }
  });
  // refunds: 4 rows, 3 confirmed by receipt, 1 awaiting receipt evidence
  for (let i = 1; i <= 4; i++) {
    const id = `r${String(i).padStart(2, "0")}`; addRow(L, { id, kind: "refund", prizeKey: "refund", winnerKey: `p-${i}` });
    apply(L, { id, to: "CLAIM_RECEIVED", actor: agent }); apply(L, { id, to: "IDENTITY_CHECKED", actor: agent });
    apply(L, { id, to: "REFUND_PROPOSED", actor: agent }); apply(L, { id, to: "REFUND_APPROVED", actor: owner, decisionRef: `decision-r${i}` });
    if (i <= 3) apply(L, { id, to: "REFUND_CONFIRMED", actor: imp, evidence: { kind: "tx-receipt", ref: `rtx-${i}` } });
  }
  if (broken.agentApproves) { const r = L.rows.get("c01"); r.state = "GRANT_APPROVED"; } // simulated bypass for negative fixtures
  const snapshot = [...L.rows.values()].filter((r) => r.state === "GRANT_CONFIRMED").map(r => ({subjectKey:r.subjectKey,prizeKey:r.prizeKey}));
  const rec = reconcile(L, { nowMs: NOW, slaDays: PROFILE.slaDays, deadlineMs: NOW + 48 * 3600000, entitlementSnapshot: snapshot });
  const text = digest(L, rec);
  const probe = { attempted: 18, succeeded: 0, valueMovingFunctions: 0 };
  const unmasked = (text.match(/0x[0-9a-fA-F]{40}/g) || []).length + L.rejected.filter((x) => /0x[0-9a-fA-F]{40}/.test(x.why)).length;
  const caught = (k) => [...L.rows.values()].filter((r) => r.walletFlags.includes(k)).length;
  const metrics = packMetrics(L, rec, probe, { unmaskedInOutputs: unmasked, poisonPlanted: 1, poisonCaught: caught("POISON_SUSPECT"), exchangePlanted: 1, exchangeCaught: caught("EXCHANGE"), digestBuilt: text.length > 0, digestHasFullAddress: /0x[0-9a-fA-F]{40}/.test(text) });
  return { L, rec, text, metrics };
}

if (process.argv[1] && process.argv[1].endsWith("scenario.mjs")) {
  const { rec, text, metrics, L } = build();
  const artifacts = [
    {id:"ledger-export",kind:"trace",path:"artifacts/ledger-export.json",body:{rows:[...L.rows.values()].map(r=>({id:r.id,state:r.state,prizeKey:r.prizeKey,claimFlags:r.claimFlags,walletFlags:r.walletFlags}))}},
    {id:"authority-probe",kind:"trace",path:"artifacts/authority-probe.json",body:{attempted:18,succeeded:0,valueMovingFunctions:0}},
    {id:"wallet-checks",kind:"trace",path:"artifacts/wallet-checks.json",body:{known:KNOWN_PAYOUT_ADDRESSES,exchanges:EXCHANGES}},
    {id:"entitlement-read",kind:"trace",path:"artifacts/entitlement-read.json",body:{snapshotPresent:true}},
    {id:"digest",kind:"static",path:"artifacts/digest.md",body:text},
  ];
  const pack = { packId: "synthetic-ledger-001", status: "VALID", synthetic: !process.argv.includes("--live"), gitSha: "synthetic", liveSha: "synthetic", gameProfile: "synthetic",
    artifacts, profile: PROFILE, metrics };
  const args = process.argv.slice(2);
  const out = args.includes("--out") ? args[args.indexOf("--out")+1] : undefined;
  if (process.argv.includes("--digest")) console.log(text);
  else if (out) console.log(JSON.stringify(writeEvidencePack(out, pack, {producer:"gbf-24-prize-refund-ledger",profileId:"synthetic-ledger-profile",device:"ledger-export",hook:"scenario",gameplayArtifact:"ledger-export"}),null,2));
  else console.log(JSON.stringify(pack, null, 1));
}
