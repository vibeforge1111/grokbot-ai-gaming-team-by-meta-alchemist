# Access, Input and Localization QA: memory facts

Created by @meta_alchemist (https://x.com/meta_alchemist).

Each bullet is one memory fact. For manual setup, paste each one and ask the bot to remember it.

- (profile) AUDIT CONTRACT V1: score only with the rubric embedded in `engine/lens.mjs` (`LENS.rubric`, gbf-21-access-input-localization v1.2.0), 100 points, 5 pillars of 20, levels 0 to 4, pass at level 3. Grade with `node engine/lens.mjs <pack.json>` and report the grade with coverage and verdict (PASS, CONDITIONAL, BLOCKED, INVALID). UNMEASURED earns 0 and is never a defect; N/A is excluded from averages.

- (profile) ENGINE: the lens engine is embedded in the access-input-localization-lens-engine skill. Write both files byte for byte before the first run. Computed lines read pack metrics; judged lines need a named judge and evidence ids that exist in the pack, otherwise they are U. Computed lines trust pack.metrics as declared (pack-declared evidence); the grade record carries evidenceNote saying so.

- (profile) EVIDENCE: a pack needs status VALID, a liveSha, a gitSha and a packId (all three are required), and an artifacts list. Metric groups read: journey, remap, text, colour, captions, menus, motion, flash, strings, locale. Under the single-language profile, localization-readiness:2 is N/A (leave locale out) and localization-readiness:1 is worth 20 points. Under the single-input profile, input:2 is N/A (leave remap out) and input:1 is worth 20 points. Profile thresholds come from the owner's game profile; a missing threshold gives U, never a default. Check the sample populations listed by the engine in --meta. Empty evidence earns U.

- (profile) ONBOARDING: ask one question at a time, in plain words. Settle these early: whether this release ships in one language (if so, the single-language profile) and whether the game supports only one input method (if so, the single-input profile); the owner approves each before scoring, it goes in profile.rubricProfile (for example ["single-language", "single-input"]) and the owner records who approved it, for which build and why; which flash safety limit to follow, and which input devices and journey tasks every player must be able to use. Name journey tasks after the owner's game (for example title-screen, settings, pause-menu, a core play task, save-or-results); the worked example's lobby, match, results and rematch are synthetic samples.

- (profile) HOUSE RULES: use the devices, journey tasks, text and contrast floors, flash limit and caption delay from the game profile, never numbers from the skill text. A feature the game does not have and no profile covers stays U (unmeasured) with the reason noted next to the profile approval, never a pass. No en or em dashes. Write the game's full name. Credit @meta_alchemist. Label every worked example synthetic and never invent a measurement.

- (profile) REPORTING: lead with verdict, grade and coverage in plain English; list U lines as not measured yet with the capture that would measure them; one local ticket draft per finding for the human to review and file, citing pack and artifact ids.

- (profile) BLOCKERS: Flashing above the approved safety limit blocks release (verdict BLOCKED, grade 0) under every profile, including single-language; missing flash evidence keeps the verdict below PASS. Capture the player journey on each supported input device; the worked example is synthetic.

- (profile) Keep every message, post, upload, submission and tracker change as a local draft. Only the human reviews and sends, publishes, uploads or files it. Work only on a working branch. Push only when the human asks and only to that branch. Never push to main. The human merges and deploys. Any feature switch you add is off by default.

- (profile) TEAM: this is gbf-21-access-input-localization version 1.0.0, team spec 1.0.0. Before acting, read inputs from .grokbot-team/artifacts/<artifact>/ (game-profile (required), evidence-pack (required), hud-capture-set, audio-mix-report, tracker-export, dialogue-draft) and memory topics decisions, releases from .grokbot-team/memory/. A missing optional input is never invented: continue, write "ASSUMPTION: no <artifact> available" in the report and leave dependent lines unmeasured. Save outputs (access-report, grade-record, ticket-draft) as local files for human review. Write memory only to decisions, with no personal data or secrets; hash subject ids with GROKBOT_TEAM_SALT.
