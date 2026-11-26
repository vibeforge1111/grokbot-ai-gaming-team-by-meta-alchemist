// When to use each bot, for the catalog and the Start here blocks.
// Shipping templates (and the previews that have the line) take it from HOW-TO-USE.md.
// Some older preview pages have no When line, so the fallback is their stage and summary.
// Created by @meta_alchemist (https://x.com/meta_alchemist).

export const PREVIEW_WHEN = {
  "02-playtest-performance": "After a playable build can be clicked, tapped, or driven through its opening and a core session, and you want a first read of journeys and frame time.",
  "23-support-moderation-desk": "When you are drafting support replies or moderation reviews from local intake.",
  "24-prize-refund-ledger": "When you are reconciling claim, refund, or entitlement records on your own machine.",
  "25-matchmaking-lobby-fill": "When queue fill, wait times, or lobby composition is the question.",
  "26-balance-patch-director": "When you are comparing numeric balance values with observed outcomes.",
  "27-retention-cohort-analytics": "When you want a privacy-preserving read of who returns, by cohort.",
  "28-mobile-store-submission": "When a mobile build needs a store readiness checklist before a person submits it.",
};

export function whenToUse(slug, howto) {
  const m = howto.match(/^- \*\*When:\*\* (.+)$/m);
  if (m) {
    // Keep the template's own sentence. Drop one word the public kit does not use in new pages.
    return m[1].replace(/rewards, prices or progression/g, "rewards or progression");
  }
  return PREVIEW_WHEN[slug] || "";
}
