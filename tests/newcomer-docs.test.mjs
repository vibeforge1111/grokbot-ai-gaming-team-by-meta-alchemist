// The newcomer pages stay in sync with the bots: starter team, catalog, and Start here blocks.
// Created by @meta_alchemist (https://x.com/meta_alchemist).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

test("the landing page points at the starter guide, the catalog, and the FAQ", () => {
  const readme = read("README.md");
  assert.match(readme, /Five minute quickstart/);
  assert.match(readme, /GETTING-STARTED\.md/);
  assert.match(readme, /TEMPLATES\.md/);
  assert.match(readme, /FAQ\.md/);
  assert.match(readme, /game-vibes-getting-started/);
  assert.doesNotMatch(readme, /[\u2013\u2014]/);
});

test("the starter guide names the four shipping bots and their real getting-started skills", () => {
  const guide = read("GETTING-STARTED.md");
  for (const bit of [
    "templates/01-game-feel/",
    "templates/09-hud-designer/",
    "templates/18-bug-desk-triage/",
    "templates/12-parallel-game-producer/",
    "game-vibes-getting-started",
    "hud-designer-getting-started",
    "bug-desk-triage-getting-started",
    "parallel-game-producer-getting-started",
    "The starter team",
  ]) assert.ok(guide.includes(bit), bit);
  assert.doesNotMatch(guide, /[\u2013\u2014]/);
  assert.doesNotMatch(read("FAQ.md"), /[\u2013\u2014]/);
});

test("every template README has the same Start here shape, and the catalog names when to use it", () => {
  const catalog = read("TEMPLATES.md");
  assert.match(catalog, /When to use/);
  assert.match(catalog, /GETTING-STARTED\.md/);
  const slugs = fs.readdirSync(path.join(ROOT, "templates")).filter((d) => fs.existsSync(path.join(ROOT, "templates", d, "template.json")));
  assert.ok(slugs.length >= 23);
  for (const slug of slugs) {
    const man = JSON.parse(read(`templates/${slug}/template.json`));
    const page = read(`templates/${slug}/README.md`);
    const howto = read(`templates/${slug}/HOW-TO-USE.md`);
    assert.ok(page.includes("## Start here"), slug);
    assert.ok(page.includes("**What it does.**"), slug);
    assert.ok(page.includes("**When to use it.**"), slug);
    assert.ok(page.includes("**Setup.**"), slug);
    assert.ok(page.includes("**First prompt.**"), slug);
    assert.ok(page.includes("**Example output.**"), slug);
    assert.ok(page.includes(man.gettingStarted), slug);
    assert.ok(page.includes(`verdict **`), slug);
    assert.ok(howto.includes("README.md#start-here"), slug);
    assert.ok(catalog.includes(`templates/${slug}/`), slug);
    assert.doesNotMatch(page.slice(page.indexOf("<!-- start:begin"), page.indexOf("<!-- start:end")), /[\u2013\u2014]/, slug);
  }
});
