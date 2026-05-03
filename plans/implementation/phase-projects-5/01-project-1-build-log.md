# 5-PROJECTS Sprint — Project 1 Build Log (Axon CLI)

> **Phase:** PROJECTS-5 · **Project 1 of 5** · **Date:** 2026-05-03
> **Owns:** `plans/implementation/phase-projects-5/01-project-1-build-log.md` (this file) + `src/data/examples/axon-cli.json` + `tests/fixtures/project-1-axon-cli-logevents.json`
> **Persona:** Claude Code (developer). Voice: technical, dry, precise. Audience: engineers who use AI tooling.
> **Scenario:** A developer prompts Hey Bradley to build a landing page for **Axon CLI** — a hypothetical agentic CLI for parallel code review and dependency management. 10 prompts mixing chat-mode generation, theme overrides, multi-page expansion, and a final dryness pass.
> **Output:** `axon-cli.json` validated against `MasterConfig` (8 top-level home sections + 4 docs sections across 2 pages; site title "Axon CLI"; dark terminal-inspired theme; voice=technical/dry/precise)

## §1 Per-prompt log table

| seq | timestamp | request_id | event_type | prompt (excerpt ≤80 chars) | classified_intent | patches_applied | latency_ms |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-03T10:00:00Z | req-001 | intent_classification | "Build a landing page for Axon CLI..." | verb=generate, target=site, atom=INTENT_ATOM, conf=0.92 | scaffold MasterConfig; site.purpose=saas, audience=developer, tone=technical; brandName="Axon"; placeholder hero/features/cta/footer | 1820 |
| 2 | 2026-05-03T10:00:02Z | req-001 | template_match | "Build a landing page for Axon CLI..." | SELECTION_ATOM matched theme=industrial-modern + section set [menu,hero,columns,pricing,quotes,action,footer]; conf 0.84 | theme.preset=industrial-modern; mode=dark; placeholder palette set to fall back palette pending prompt 2 override | 280 |
| 3 | 2026-05-03T10:00:04Z | req-001 | patch_validation | "Build a landing page for Axon CLI..." | initial scaffold patch (38 ops) | 7 sections inserted (menu/hero/columns/pricing/quotes/action/footer); theme defaults applied | 130 |
| 4 | 2026-05-03T10:00:18Z | req-002 | intent_classification | "Theme: dark mode terminal-inspired; mono..." | verb=change, target=theme, target_attr=palette+typography, atom=INTENT_ATOM, conf=0.91 | theme.palette overridden — bgPrimary #0b0a14, accentPrimary #6c4dff (deep-purple), accentSecondary #22d3ee; typography.headingFamily=JetBrains Mono | 410 |
| 5 | 2026-05-03T10:00:32Z | req-003 | intent_classification | "Hero: 'Stop reviewing dependencies one PR..." | verb=change, target=hero, target_components=[headline,subtitle], atom=CONTENT_ATOM, conf=0.95 | sections[hero].components[headline].text rewritten verbatim; sections[hero].components[subtitle].text rewritten verbatim | 920 |
| 6 | 2026-05-03T10:00:48Z | req-004 | decomp_split | "Add a features section — 6 bullets cover..." | DECOMP→6 todos: parallel-review/dep-graphs/security-scan/batch-refactor/lint-enforce/atomic-rollback; conf 0.93 | sections[columns#features-01].components[] populated with 6 feature-card components; copy generated via CONTENT_ATOM in voice=technical/dry | 380 |
| 7 | 2026-05-03T10:00:50Z | req-004 | process_atom_output | "Add a features section — 6 bullets cover..." | CONTENT_ATOM regen × 6 (one per feature card); voice=technical,dry,precise | 6 feature-card props bodies finalised (40-90 char descriptions); columns layout grid columns=3 gap=24px | 1240 |
| 8 | 2026-05-03T10:00:52Z | req-004 | patch_validation | "Add a features section — 6 bullets cover..." | bulk apply (12 patch ops) | features section now carries 6 cards; no other section affected | 80 |
| 9 | 2026-05-03T10:01:08Z | req-005 | intent_classification | "Add a code example section showing axon..." | verb=add, target=text, target_variant=code-block, atom=CONTENT_ATOM, conf=0.89 | sections[].insert at order=2: text section variant=code-block with terminal output mock; bash highlighting; deterministic-output explainer paragraph | 1080 |
| 10 | 2026-05-03T10:01:24Z | req-006 | intent_classification | "Add a pricing section — open source + t..." | verb=add, target=pricing, target_variant=three-tier, count=3, atom=CONTENT_ATOM, conf=0.94 | sections[pricing-01].components = 3 pricing-card components (Open Source/Team $99/Enterprise contact); team tier highlighted=true | 1340 |
| 11 | 2026-05-03T10:01:42Z | req-007 | multi_page_scope | "Add a docs page (page 2) at /docs with a..." | verb=add, target=page, page_id=docs, slug=docs, atom=INTENT_ATOM, conf=0.96 | pages[] gains docs page; isHome=false; sections array bootstrapped with hero | 240 |
| 12 | 2026-05-03T10:01:44Z | req-007 | decomp_split | "Add a docs page (page 2) at /docs with a..." | DECOMP→2 todos: getting-started-article + cli-reference-grid; conf 0.91 | docs page sections expanded — 1 hero + 1 text(article ~150 words) + 1 columns(5 CLI commands) + 1 footer | 320 |
| 13 | 2026-05-03T10:01:46Z | req-007 | process_atom_output | "Add a docs page (page 2) at /docs with a..." | CONTENT_ATOM regen × 6 (3 article paragraphs + 5 CLI feature-cards); voice preserved | docs.text.components = 3 paragraphs (~150 words total); docs.columns.components = 5 feature-cards (axon init/run/rollback/graph/report) | 2180 |
| 14 | 2026-05-03T10:01:50Z | req-007 | patch_validation | "Add a docs page (page 2) at /docs with a..." | bulk apply (24 patch ops) | docs page now carries 4 sections (hero/text/columns/footer); home page unchanged | 110 |
| 15 | 2026-05-03T10:02:08Z | req-008 | intent_classification | "Add testimonials — 3 quotes from enginee..." | verb=add, target=quotes, target_variant=three-up, count=3, atom=CONTENT_ATOM, conf=0.93 | sections[quotes#testimonials-01].components = 3 testimonial components (Priya Vasquez/Devon Marsh/Yuki Hartman, all Eng Manager titles) | 1190 |
| 16 | 2026-05-03T10:02:24Z | req-009 | intent_classification | "Add a footer with GitHub link + Discord ..." | verb=change, target=footer, target_attr=components, atom=INTENT_ATOM, conf=0.88 | sections[footer-01].components links updated — Community col now lists GitHub/Discord/Email/RSS; Links col holds canonical URLs | 380 |
| 17 | 2026-05-03T10:02:38Z | req-010 | intent_classification | "Make all the copy slightly drier; remove..." | verb=change, target=site, target_attr=voice, length_constraint=tighten, atom=CONTENT_ATOM, conf=0.86 | global voice tighten — voiceAttributes set to ["technical","dry","precise"]; pass triggers regen on every text/heading/feature-card body | 220 |
| 18 | 2026-05-03T10:02:40Z | req-010 | process_atom_output | "Make all the copy slightly drier; remove..." | CONTENT_ATOM regen × 18 (6 features + 3 testimonials + 4 hero/cta texts + 5 docs CLI cards); each line ≤12 words | 18 components rewritten in place; total LOC delta -0 (props.text only); marketing fluff removed (no "delight"/"unleash"/"empower") | 2740 |
| 19 | 2026-05-03T10:02:44Z | req-010 | patch_validation | "Make all the copy slightly drier; remove..." | bulk apply (18 patch ops) | site-wide tone tightened; final word count reduced ~28%; sentence-length cap held at ≤12 words | 110 |

## §2 Per-prompt narrative

### Prompt 1 — "Build a landing page for Axon CLI..." (chat)
- **Input:** "Build a landing page for Axon CLI — an agentic CLI for parallel code review and dependency management"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=generate, target=site` with high confidence (0.92). SELECTION_ATOM matches against developer-tooling theme bank (`industrial-modern` wins on dark-mode + mono cues). Initial scaffold patches the MasterConfig with site/theme/sections defaults; placeholder copy is intentionally minimal so prompt 2's theme override and prompt 3's hero verbatim land cleanly.
- **Patches:** 7 sections scaffolded (menu, hero, columns, pricing, quotes, action, footer). site.brandName="Axon", domain="axoncli.dev", purpose="saas", audience="developer", tone="technical".
- **Latency:** 1820ms (rules +50 / SELECTION +280 / scaffold patch apply +130 / overhead +1360 cold-start).
- **Resulting state:** 7-section single-page scaffold with placeholder copy and default palette.

### Prompt 2 — Theme override (chat)
- **Input:** "Theme: dark mode terminal-inspired; monospace heading font; deep-purple accent #6c4dff"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=change, target=theme`. CONTENT_ATOM not invoked — palette + typography swap only. Hex literal `#6c4dff` extracted via regex; fallback secondary cyan `#22d3ee` chosen to balance the purple anchor.
- **Patches:** theme.palette swapped to deep-purple/dark-mode 6-slot palette; typography.headingFamily="JetBrains Mono"; alternatePalette generated (light variant) for token symmetry.
- **Latency:** 410ms (rules +30 / palette resolve +220 / typography swap +60 / patch +100).
- **Resulting state:** Dark terminal palette locked; JetBrains Mono headings on Inter body.

### Prompt 3 — Hero verbatim (chat)
- **Input:** "Hero: 'Stop reviewing dependencies one PR at a time.' subheadline 'Axon runs 30 parallel review agents per repo.'"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=change, target=hero, target_components=[headline,subtitle]` from the literal-quote pattern (single quotes around the strings). CONTENT_ATOM does NOT regenerate — user-supplied verbatim text is honored.
- **Patches:** sections[hero].components[headline].props.text = "Stop reviewing dependencies one PR at a time."; sections[hero].components[subtitle].props.text expanded slightly with the parallel-agents framing per the user's subheadline cue.
- **Latency:** 920ms (rules +30 / verbatim parse +60 / patch +30 / re-render warm +800).
- **Resulting state:** Hero copy locked to user input; subhead carries the "30 parallel review agents per repo" anchor.

### Prompt 4 — Features bullets (chat)
- **Input:** "Add a features section — 6 bullets covering parallel review / dependency graphs / security scanning / batch refactor / lint enforcement / atomic rollback"
- **Mode:** chat
- **Pipeline:** Slash-separated list triggers DECOMP_ATOM (slash is a known disjunction marker). DECOMP yields 6 disjoint todos. Each todo expands via CONTENT_ATOM into a feature-card with a 40-90 character description in the voice (technical, dry).
- **Patches:** sections[columns#features-01].components = 6 feature-card components. Each card carries a single icon hint (git-branch / share-2 / shield / edit-3 / check-square / rotate-ccw) and a copy body that names the engineering pain it removes.
- **Latency:** 1700ms total (DECOMP +380 / CONTENT 6× +1240 / patch +80).
- **Resulting state:** Features section live with 6 cards, grid columns=3, in voice.

### Prompt 5 — Code example (chat)
- **Input:** "Add a code example section showing `axon run --parallel 30 --review`"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=add, target=text, target_variant=code-block` (the section type is `text` per the 18-section enum; variant=`code-block` is the renderer hint). CONTENT_ATOM generates a realistic terminal output mock (1847 deps / 7 CVEs / 14 lint failures / 47s wall-clock) and a deterministic-output explainer paragraph.
- **Patches:** sections[].insert at order=2 a new `text` section with three components: eyebrow badge ("// example invocation"), heading, code block, explainer text. Code block uses bash language hint.
- **Latency:** 1080ms (rules +30 / CONTENT terminal-mock +890 / patch +160).
- **Resulting state:** Code-example section sits between the features grid and the pricing tiers.

### Prompt 6 — Pricing tiers (chat)
- **Input:** "Add a pricing section — open source + team $99/mo + enterprise contact"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=add, target=pricing, count=3`. CONTENT_ATOM generates three pricing-card components with feature lists pulled from prompt 4 (parallel-agent count is the distinguishing axis between tiers). Team tier marked `highlighted=true`.
- **Patches:** sections[pricing-01].components = 3 pricing-card components. Open Source = 10 agents free MIT; Team = 30 agents $99/seat/mo with hosted dispatch + SSO; Enterprise = unlimited + on-prem + SOC 2.
- **Latency:** 1340ms (rules +30 / CONTENT 3× +1180 / patch +130).
- **Resulting state:** Pricing tier strip live, three columns, Team highlighted.

### Prompt 7 — Docs page (chat, multi-page)
- **Input:** "Add a docs page (page 2) at /docs with a getting-started article (~150 words) and a CLI commands reference"
- **Mode:** chat
- **Pipeline:** Multi-page intent triggers `multi_page_scope` log_event (per migration 005 enum). INTENT_ATOM resolves `verb=add, target=page, page_id=docs`. DECOMP_ATOM splits into 2 todos: getting-started article + CLI reference. CONTENT_ATOM regenerates 3 article paragraphs (~150 words total) plus 5 CLI command feature-cards (init / run / rollback / graph / report).
- **Patches:** pages[] gains a `docs` page (id=docs, slug=docs, isHome=false). docs.sections = [hero, text(article 3 paragraphs), columns(5 CLI cards), footer]. Home page unchanged.
- **Latency:** 2850ms total (multi-page resolve +240 / DECOMP +320 / CONTENT 6× +2180 / patch +110).
- **Resulting state:** 2-page site. Home = 8 sections (after subsequent prompts). Docs = 4 sections.

### Prompt 8 — Testimonials (chat)
- **Input:** "Add testimonials — 3 quotes from engineering managers"
- **Mode:** chat
- **Pipeline:** Trigger word `testimonials` → quotes section type with variant=three-up. INTENT_ATOM resolves `verb=add, target=quotes, count=3`. CONTENT_ATOM generates three quotes from fictional engineering managers, each anchored to one of the prompt-4 features (parallel review / atomic rollback / 47-second runtime).
- **Patches:** sections[quotes#testimonials-01].components = 3 testimonial components. Layout = grid columns=3 gap=24px. Each quote ≤16 words to match the dry voice.
- **Latency:** 1190ms (rules +30 / CONTENT 3× +1080 / patch +80).
- **Resulting state:** Testimonials sit between pricing and the install CTA.

### Prompt 9 — Footer links (chat)
- **Input:** "Add a footer with GitHub link + Discord + email"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=change, target=footer, target_attr=components`. The footer scaffolded in prompt 1 is updated in place — Community column gains GitHub/Discord/Email/RSS; Links column carries the canonical URLs (github.com/axonlabs/axon-cli, discord.gg/axon, core@axoncli.dev).
- **Patches:** sections[footer-01].components updated; brand text "$ axon" preserved; copyright line updated to reference MIT and the engineer-meeting-elimination thesis.
- **Latency:** 380ms (rules +30 / patch +80 / re-render warm +270).
- **Resulting state:** Footer carries 4 columns + brand + copyright; same shape as the docs-page footer for consistency.

### Prompt 10 — Dryness pass (chat, global)
- **Input:** "Make all the copy slightly drier; remove any marketing fluff; trim to 12 words per sentence max"
- **Mode:** chat
- **Pipeline:** INTENT_ATOM resolves `verb=change, target=site, target_attr=voice, length_constraint=tighten`. site.voiceAttributes locked to `["technical","dry","precise"]`. CONTENT_ATOM runs a global regen over every text/heading/feature-card/testimonial body — 18 components total. Sentence-length cap enforced at 12 words (the matcher rejects regen output above that threshold and re-prompts).
- **Patches:** 18 components rewritten. No marketing words ("delight", "unleash", "empower", "magical", "world-class") survive. Active voice preferred. Stats and code samples preserved verbatim.
- **Latency:** 3070ms total (rules +220 / CONTENT 18× +2740 / patch +110).
- **Resulting state:** Final shape — voice consistent across home + docs; sentence-length cap held; ~28% word count reduction site-wide.

## §3 Total wall-clock simulated

- **Sum of latency_ms:** 19,070 ms (= 1820 + 280 + 130 + 410 + 920 + 380 + 1240 + 80 + 1080 + 1340 + 240 + 320 + 2180 + 110 + 1190 + 380 + 220 + 2740 + 110)
- **Per-user-prompt avg:** ~1,907 ms (10 user prompts; 9 internal pipeline steps split across prompts 1, 4, 7, 10)
- **Mode breakdown:**
  - chat: 10 prompts → 19,070 ms
  - listen: 0 prompts (developer persona drives chat-only; sibling Project 4 covers listen mode)
- **Atom-path breakdown:**
  - INTENT only (theme/footer/hero verbatim/voice tighten): 4 user-visible prompts (1,930 ms)
  - INTENT → CONTENT_ATOM (single-section regen): 3 prompts (3,610 ms — code-example, testimonials, footer-update)
  - DECOMP → CONTENT_ATOM (multi-todo): 1 prompt (1,700 ms — features bullets)
  - INTENT → SELECTION → scaffold (initial generate): 1 prompt (2,230 ms — prompt 1)
  - multi_page_scope → DECOMP → CONTENT (docs page): 1 prompt (2,850 ms — prompt 7)
  - global CONTENT regen (voice tighten): 1 prompt (3,070 ms — prompt 10)
- **Atoms invoked (unique):** INTENT_ATOM, SELECTION_ATOM, DECOMP_ATOM, CONTENT_ATOM (4 of 8 AISP atoms; PROCESS/DDD/AGENT/ASSUMPTIONS not in this pipeline)
- **Patches applied (total):** 119 patch operations across 10 user prompts.

## §4 Final state

- **Page 1 (home):** 8 sections — menu / hero / columns(features×6) / text(code-example) / pricing / quotes(testimonials×3) / action(install CTA) / footer
- **Page 2 (docs):** 4 sections — hero / text(getting-started 3 paragraphs ~150 words) / columns(CLI commands ×5) / footer
- **Theme:** industrial-modern dark mode; deep-purple accent (#6c4dff) + cyan secondary (#22d3ee); JetBrains Mono headings on Inter body; bgPrimary #0b0a14
- **Voice:** technical, dry, precise (preserved across all CONTENT_ATOM regens; final pass capped at 12 words/sentence)
- **Concrete details preserved across the build:** 30 parallel agents, 47-second runtime, 1847 deps, 7 CVEs surfaced, 14 lint failures, $99/seat Team tier, MIT open-source, OSV CVE source, axon.toml config file, atomic rollback via snapshot ID
- **Schema validation:** `axon-cli.json` parses cleanly + matches `MasterConfig` type at index.ts wire-time (closer agent owns wire)
- **DECOMP / process_atom_output / multi_page_scope persisted:** seq 6 (decomp_split prompt 4), seq 7 (process_atom_output prompt 4), seq 11 (multi_page_scope prompt 7), seq 12 (decomp_split prompt 7), seq 13 (process_atom_output prompt 7), seq 18 (process_atom_output prompt 10) — all event_types are valid migration 005 + P104 validateEventType enum members
