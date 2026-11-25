# Security

Created by @meta_alchemist (https://x.com/meta_alchemist).

- This repo holds no secrets. `npm run scrub` fails CI on keys, tokens, private keys, IPs, emails, local paths, private hostnames, ids and wallet addresses.
- Prepare a restricted local advisory draft with sanitized locations. Only the maintainer reviews it and opens the private advisory.
- Templates never ask a bot to approve payments, refunds, bans or public posts on its own. Only the human acts on a draft.
- When you bridge a bot to your own machine, follow [guides/bridging-pc-mac.md](guides/bridging-pc-mac.md): private network only, token in a file and never printed, approval gate on.
