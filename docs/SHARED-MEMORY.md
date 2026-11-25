# Shared team memory

Created by @meta_alchemist (https://x.com/meta_alchemist).

When several templates work on the same game, they need a few shared facts: what the owner decided, which incidents are open, which balance values changed, which build shipped. Shared memory is a small, append-only store for those facts. It lives in your game project, not in this kit.

```
your-game/.grokbot-team/memory/
  decisions.jsonl      owner calls: profile approvals, scope, applicability
  incidents.jsonl      outages, save loss, payment or entitlement incidents
  entitlements.jsonl   reviewed grants, refunds and access issues (never the money action itself)
  balance.jsonl        tuning values that changed, with the evidence behind them
  regions.jsonl        server regions and queues added, merged or retired
  releases.jsonl       builds cut, verified and described in patch notes
```

Each file holds one JSON record per line. The record format is [spec/shared-memory.schema.json](../spec/shared-memory.schema.json); the helper is [shared/team-memory/team-memory.mjs](../shared/team-memory/team-memory.mjs) (Node 18+, no dependencies). Every template carries a byte-identical copy as `engine/team-memory.mjs`.

## The rules

1. **Read before acting.** A template reads the topics listed under `memory.reads` in its `template.json` and skips records that have expired or that a later record supersedes.
2. **Write only your own topics.** A template appends only to the topics listed under `memory.writes`. The helper refuses anything else. The [team map](TEAM-MAP.md) shows who writes what.
3. **Append only.** Nobody edits or deletes a line. To correct a record, append a new one whose `supersedes` names the old id. `isAppendOnly(before, after)` checks a file against a backup or your last commit.
4. **No personal data, no secrets.** No names, handles, emails, wallets, phone numbers, IP addresses, raw user or account ids, URLs, keys or tokens. A person or account appears only as a hashed subject id under a key named `subject` or `subjects`.
5. **Never invent.** `confidence` says how a fact is known: `measured` (from an evidence pack or artifact), `reported` (a person said so) or `assumed` (a clearly marked working assumption).

## A record

```json
{"id":"mem_mf3k2x9a_1f2e3d4c","time":"2026-01-15T09:30:00.000Z","writer":{"id":"gbf-06-economy-director","version":"1.0.0"},"topic":"balance","kind":"value-changed","summary":"Daily quest reward raised from 40 to 50 coins after the week 2 simulation.","data":{"parameter":"dailyQuestCoins","from":40,"to":50},"source":{"artifact":"economy-change-list","pack":"week-2"},"confidence":"measured","expires_at":null,"supersedes":null}
```

| Field | Meaning |
|---|---|
| `id` | `mem_<time>_<8 hex>`, unique, never reused |
| `time` | ISO 8601 UTC time the record was written |
| `writer` | the writing template's `id` and `version` from its `template.json` |
| `topic` | one of the six topics; also the file name |
| `kind` | a short kebab-case word, for example `decision`, `incident-opened`, `value-changed`, `release-cut` |
| `summary` | one plain sentence, 280 characters at most |
| `data` | structured details, 4 KB at most; put anything bigger in an artifact file and cite it |
| `source` | where it came from: `pack`, `artifact`, `path`, `gitSha`, `liveSha` or `note` |
| `confidence` | `measured`, `reported` or `assumed` |
| `expires_at` | UTC time after which the record is no longer active, or `null` |
| `supersedes` | the id of an earlier record in the same topic that this one replaces, or `null` |

## Hashing people and accounts

Set a long random salt once per game project in the environment, never in a file you commit:

```bash
export GROKBOT_TEAM_SALT="<at least 16 random characters>"
node engine/team-memory.mjs hash <raw account id>      # prints sub_ followed by 32 hex characters
```

The helper refuses to hash without the salt. The same salt gives the same subject id, so templates can match records about one account without ever storing who it is. Rotating the salt starts a fresh set of subject ids.

## Commands

Run these from your game project root.

```bash
node engine/team-memory.mjs read balance            # active records in one topic
node engine/team-memory.mjs read balance --all      # every record, including superseded and expired
node engine/team-memory.mjs append balance record.json --writer gbf-06-economy-director@1.0.0 --writes decisions,balance
node engine/team-memory.mjs lint                    # schema and personal-data lint, exit 1 on any problem
```

In code:

```js
import { makeRecord, append, readTopic, hashSubject } from "./engine/team-memory.mjs";
const record = makeRecord({ writer: { id: "gbf-22-live-service-trust", version: "1.0.0" }, topic: "incidents",
  kind: "incident-opened", summary: "Cloud saves failed to upload for some sessions on build b7.",
  data: { affectedShare: 0.03, subjects: [hashSubject(accountId)] }, source: { pack: "drill-04" }, confidence: "measured" });
append(process.cwd(), record, { writes: ["decisions", "incidents", "entitlements"] });
const open = readTopic(process.cwd(), "incidents");
```

## What the lint catches, and what it cannot

The lint rejects unknown fields, a writer outside its topics, broken ids or times, `supersedes` pointing at a missing or later record, keys that carry personal data (`name`, `email`, `handle`, `wallet`, `userId`, `playerId`, `ip` and similar), unhashed subject ids, and values that look like emails, handles, URLs, wallet addresses, phone numbers, IP addresses, long numeric account ids, keys, tokens or private keys.

It cannot recognise a person's name written inside a free-text sentence. That is why the house rule is "describe what happened, not who": write "an account lost a purchased item", never who it was. Use `label`, not `name`, for things such as items or levels; `name` is rejected because it is where people's names leak.

## Where to keep it

The default home is `.grokbot-team/` in the game project: `memory/` for this store and `artifacts/` for the files templates hand each other.

- **Private game repository:** commit `.grokbot-team/`. The history shows who appended what, and `isAppendOnly(before, after)` can compare each file with the last commit.
- **Public game repository:** keep it out. Incidents, entitlement reviews and draft store copy are business facts even without personal data. Add this to the game's `.gitignore` and keep a private backup instead (the append-only check then compares with the backup):

```gitignore
# Grok Bot team files: drafts, findings and shared memory stay out of the public repository
.grokbot-team/
```

Either way, never commit `GROKBOT_TEAM_SALT`: keep it in the environment or your secret store.
