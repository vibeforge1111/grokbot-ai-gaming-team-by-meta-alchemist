#!/usr/bin/env node
// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Prints a synthetic claim journal for import-claim-ledger.mjs. Every address is made up and built in parts so the
// file never contains a full address literal. Usage: node ledger/build-journal.mjs > journal.json
const S = (n) => "sub_" + n.toString(16).padStart(32, "0");
const A = (h) => "0x" + h.padEnd(40, "0").slice(0, 40);
const KNOWN = [A("a1b2c3" + "1".repeat(30) + "d4e5"), A("77aa00" + "2".repeat(30) + "9f9f")];
const EXCHANGES = [A("ee0001" + "3".repeat(30) + "beef")];
const POISON = "0xa1b2c3" + "9".repeat(30) + "d4e5";
const NOW = Date.UTC(2001, 0, 10, 12);
const at = (d) => new Date(NOW - d * 86400000).toISOString();
const PROFILE = { minProbeAttempts: 18, slaDays: 3, maxOverdue: 0, maxRefundsOwed: 2, maxReportedOnly: 0, addressPattern: "^0x[0-9a-fA-F]{40}$", maskHead: 6, maskTail: 4, excludedKeys: [S(6)] };

function entitlement(i, extra = {}) {
  const id = `y${String(i).padStart(2, "0")}`;
  const sub = extra.subjectKey || S(i);
  const claim = extra.claim || { claimantKey: extra.claimantKey || sub, subjectKey: sub, alreadyOwns: extra.alreadyOwns === true };
  const history = extra.history || [
    { to: "CLAIM_RECEIVED", role: "agent" },
    { to: "IDENTITY_CHECKED", role: "agent" },
    { to: "GRANT_PROPOSED", role: "agent" },
    { to: "GRANT_APPROVED", role: "owner", decisionRef: `decision-${i}`, at: at(1) },
    { to: "GRANT_CONFIRMED", role: "evidence-import", evidence: { kind: "entitlement-read", ref: `read-${i}` } },
  ];
  return { id, kind: "entitlement", prizeKey: "chapter-unlock", subjectKey: sub, winnerKey: extra.winnerKey || sub, history, claim };
}

const rows = [];
for (let i = 1; i <= 4; i++) rows.push(entitlement(i));
rows.push(entitlement(5, { subjectKey: S(5), claimantKey: S(5), history: [
  { to: "CLAIM_RECEIVED", role: "agent" },
  { to: "HELD", role: "agent" },
  { to: "GRANT_APPROVED", role: "owner", decisionRef: "decision-5-redirect", at: at(1) },
  { to: "GRANT_CONFIRMED", role: "evidence-import", evidence: { kind: "grant-log", ref: "log-5" } },
]}));
rows.push({ id: "y06", kind: "entitlement", prizeKey: "chapter-unlock", subjectKey: S(6), winnerKey: S(6), claim: { claimantKey: S(6), subjectKey: S(6) }, history: [ { to: "INELIGIBLE", role: "agent" } ] });
rows.push(entitlement(7, { alreadyOwns: true, history: [
  { to: "CLAIM_RECEIVED", role: "agent" },
  { to: "IDENTITY_CHECKED", role: "agent" },
  { to: "REFUND_PROPOSED", role: "agent" },
  { to: "REFUND_APPROVED", role: "owner", decisionRef: "decision-7" },
  { to: "REFUND_CONFIRMED", role: "evidence-import", evidence: { kind: "tx-receipt", ref: "tx-7" } },
]}));
rows.push(entitlement(8, { claimantKey: S(99), subjectKey: S(8), history: [ { to: "HELD", role: "agent" } ] }));
const wallets = [A("c0ffee" + "4".repeat(30) + "0001"), A("c0ffee" + "5".repeat(30) + "0002"), POISON, EXCHANGES[0], A("c0ffee" + "6".repeat(30) + "0005")];
wallets.forEach((w, i) => {
  const id = `c0${i + 1}`;
  const sub = S(20 + i);
  rows.push({
    id, kind: "contest", prizeKey: "contest-award", subjectKey: sub, winnerKey: sub, needsWallet: true,
    claim: { claimantKey: sub, subjectKey: sub },
    history: [
      { to: "CLAIM_RECEIVED", role: "agent" },
      { to: "IDENTITY_CHECKED", role: "agent" },
      { to: "WALLET_REQUESTED", role: "agent" },
      { to: "WALLET_COLLECTED", role: "agent" },
    ],
    wallet: w,
  });
});
for (let i = 1; i <= 4; i++) {
  const id = `r${String(i).padStart(2, "0")}`;
  const sub = S(30 + i);
  const history = [
    { to: "CLAIM_RECEIVED", role: "agent" },
    { to: "IDENTITY_CHECKED", role: "agent" },
    { to: "REFUND_PROPOSED", role: "agent" },
    { to: "REFUND_APPROVED", role: "owner", decisionRef: `decision-r${i}` },
  ];
  if (i <= 3) history.push({ to: "REFUND_CONFIRMED", role: "evidence-import", evidence: { kind: "tx-receipt", ref: `rtx-${i}` } });
  rows.push({ id, kind: "refund", prizeKey: "refund", subjectKey: sub, winnerKey: sub, history, claim: { claimantKey: sub, subjectKey: sub } });
}
const snapshot = rows.filter((r) => r.history.some((h) => h.to === "GRANT_CONFIRMED")).map((r) => ({ subjectKey: r.subjectKey, prizeKey: r.prizeKey }));
const journal = {
  packId: "journal-ledger-001",
  gitSha: "journal-git",
  liveSha: "journal-live",
  synthetic: false,
  profile: PROFILE,
  nowMs: NOW,
  deadlineMs: NOW + 48 * 3600000,
  snapshot,
  knownAddresses: KNOWN,
  exchangeAddresses: EXCHANGES,
  poisonPlanted: 1,
  exchangePlanted: 1,
  audit: { attempted: 18, succeeded: 0, valueMovingFunctions: 0 },
  rows,
};
process.stdout.write(JSON.stringify(journal, null, 2) + "\n");
