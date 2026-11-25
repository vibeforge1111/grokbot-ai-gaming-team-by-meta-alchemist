# Bridging Grok Bot with your PC or Mac

Created by @meta_alchemist (https://x.com/meta_alchemist).

Grok Bot works in the cloud. Your game, your GPU, your local models and your coding agents live on your PC or Mac. A small bridge lets the bot queue jobs on your machine and lets you watch them run, without opening your machine to the internet.

This guide describes the pattern. It uses placeholders only: replace `<your-machine>`, `<port>` and paths with your own, and never paste real hostnames or tokens into a public repo.

## The pattern

```
Grok Bot ──(private network only)──> bridge service on your machine ──> local agents and tools
   queue job, poll status                token check, approval gate         Claude Code, Codex, local LLM,
   read results                          job log you can watch               game build, test runner
```

1. **Private network.** Put the bot's runner and your machine on a private mesh network such as Tailscale (a tailnet). The bridge listens only on the private interface. Nothing is exposed to the public internet.
2. **Token auth.** The bridge requires a long random token on every request. The token lives in a file with tight permissions on each side, for example `~/.config/<bridge>/token` with mode `600`. It is read by the program, never printed, never pasted into chat, never committed.
3. **Job queue.** The bot does not get a shell. It prepares local job drafts for the human to review and queue from an allowlist: `run-playtest`, `grade-pack`, `agent-session` with a brief, `build`, `export-clip`. Each job has a timeout, a working folder and a log.
4. **Live sessions.** Agent jobs run in a terminal session you can attach to (for example a `tmux` session per job) or a local web view of the log, so you can watch, pause or stop it.
5. **Results back as files.** The job writes its outputs (pack, grade record, branch name, logs) to a results folder the bot reads.

## Security defaults

| Default | Why |
|---|---|
| Private network only; bind to the tailnet address, not `0.0.0.0` | Nobody on the internet can reach it |
| Token in a file, read at start, never logged or printed | Logs and chats leak; files with `600` permissions do not |
| Rotate the token if it ever appears in output | Assume anything printed is public |
| Allowlisted job types; no raw shell endpoint | The bot can only ask for what you defined |
| **Approval gate on by default** | Each new job shows on your machine or phone and waits for your yes. Never set "approve all" |
| Jobs run as a normal user in a dedicated folder | A bad job cannot touch the rest of your disk |
| Working branch only. Push only on human request, never to main. New switches default off | You merge and release yourself |
| Timeouts and a heartbeat per job | Hung jobs get noticed and stopped |
| Secrets for the game (store keys, payment keys) are not in the bridge's environment | A job that does not need them cannot leak them |

## A minimal job contract

Local request draft for the human to review and queue:

```json
{ "type": "grade-pack", "template": "18-bug-desk-triage", "pack": "packs/build-abc123.json", "timeoutMin": 10 }
```

Response:

```json
{ "jobId": "job-0042", "state": "QUEUED" }
```

States: `QUEUED`, `AWAITING_APPROVAL`, `RUNNING`, `COMPLETED`, `FAILED`, `TIMED_OUT`. The bot polls status and reads the result file when it completes.

## Pairing with local LLMs

The same bridge can call a local model server (for example Ollama or LM Studio) for cheap bulk work: tagging clips, summarizing logs, first pass bug dedup candidates. Keep the local model on `localhost` and let only the bridge talk to it. Treat local model output like any judge: it proposes, the engine and a person decide.

## Checklist before you turn it on

- [ ] Bridge reachable only over the private network
- [ ] Token file exists on both sides with `600` permissions, never printed
- [ ] Job allowlist written down; no shell endpoint
- [ ] Approval gate on
- [ ] Push only to the working branch when the human asks. The human merges and deploys
- [ ] You can attach to a running session and stop it
- [ ] A test job (`grade-pack` on a fixture) round trips
