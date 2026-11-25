# Scrub report

Created by @meta_alchemist (https://x.com/meta_alchemist).

Run `npm run scrub` from the repository root. To supply additional project-specific terms, use `node scripts/scrub-check.mjs --denylist <file>` with a file outside the checkout.

## What is checked

| Rule | Looks for |
|---|---|
| private-key | PEM private key blocks |
| github-token, openai-style-key, anthropic-key, xai-key, slack-token, aws-key, google-key, jwt | Real secret shapes |
| discord-id, discord-webhook | Numeric platform identifiers and webhook URLs |
| assigned-player-name, assigned-social-id | Assigned identity fields |
| env-secret | Unquoted credential assignments in environment files |
| assigned-secret | `api_key = "..."`, `token: "..."` style assignments with long values |
| ipv4 | Any IPv4 address except loopback, 0.0.0.0 and the documentation ranges |
| email | Any email except example.com, example.org, example.net |
| local-path | Home folders on Linux, macOS and Windows, agent workspace folders and agent data folders |
| private-hostname | `*.ts.net`, `*.internal`, `*.corp`, `*.lan`, `*.local` |
| uuid | Any UUID (bot, user or session ids) |
| evm-wallet | 0x wallet addresses |
| token-sale, ticker | Crypto sale words and ticker symbols written with a dollar sign |
| launch-date | Launch phrasing and ISO dates (a Keep a Changelog release heading such as `## [1.0.0] - <date>` is the one allowed place for a date) |
| handle | Social handles other than the creator credit, and code doc tags |
| denylist (private run only) | Internal product, studio, world and player names; only the rule, file and line are reported |

The [allowlist](scrub-allowlist.json) has no exceptions. Public rules and any additional denylist terms are reported separately in the command output.
