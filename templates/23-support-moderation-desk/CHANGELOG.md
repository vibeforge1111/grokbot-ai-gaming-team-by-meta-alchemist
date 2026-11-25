# Changelog

All notable changes to Community Support and Moderation Desk (`gbf-23-support-moderation-desk`) are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/VERSIONING.md](../../docs/VERSIONING.md) for what each kind of change bumps.

Created by @meta_alchemist (https://x.com/meta_alchemist).

## [Unreleased]

## [0.1.0] - 2026-11-25

### Added

- Preview release of Community Support and Moderation Desk: Prepare support replies, moderation reviews and case digests from redacted local intake. Not yet held to the release standard; see the README for what it needs before it can ship.
- Rubric `gbf-23-support-moderation-desk` 1.2.0 (100 points, 5 pillars of 20) with a synthetic worked example and negative fixtures.
- Team spec 1.0.0: produces `support-case-draft` 1.0.0, `grade-record` 1.0.0, `ticket-draft` 1.0.0; reads `incident-report`, `entitlement-ledger`, `patch-notes-draft`.
- Shared memory: reads `decisions`, `incidents`, `entitlements`, `releases`, `balance`; writes `decisions`, `incidents`.
