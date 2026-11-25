# Shared bug ledger

Created by @meta_alchemist (https://x.com/meta_alchemist).

Use one read-only ledger export for matching findings to existing reports.

- **One ticket per bug.** Bug Desk (template 18) owns intake and the dedup key. Each template prepares local ticket drafts. Bug Desk drafts new records, merges and closure changes against the export. Only the human reviews and applies a tracker change.
- **Dedup key:** root cause area + reproduction signature + build id. Similarity only proposes a merge; a person or the owner confirms it. Nothing auto merges.
- **Severity and confidence are separate fields.** A P0 with low confidence stays P0 and gets more evidence.
- **Audit mistakes are not game bugs.** A wrong rubric reading or a broken capture goes to an audit fix list, not the game bug list.
- **Closure needs a verifier who is not the fixer**, plus the raw artifacts of the passing run.
- Counts (open, by severity, by template) are derived from the ledger, never typed by hand.

The shape of one ticket is in [tickets.example.json](tickets.example.json). Use your own tracker if you have one: export it to this shape for the engines.
