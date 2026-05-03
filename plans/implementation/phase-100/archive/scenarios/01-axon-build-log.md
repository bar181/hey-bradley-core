# Scenario 1 — Axon CLI Tool — Execution Log

**Agent:** A3 (P100 W2)
**Scenario:** Claude Code developer building "Axon" CLI tool landing page
**Mode:** simulation (W1 wired pipeline consumed; no live LLM calls)
**Final state target:** `tests/fixtures/scenario-1-axon-final.json`
**Prompt fixture:** `tests/fixtures/scenario-1-axon-cli.ts`

---

### Prompt 1 — Initial scaffold
- Input: "Create a site for my CLI tool called Axon"
- Mode: chat
- request_id: req-s1-001
- Pipeline route: SELECTION matched dev-tool template (confidence 0.91)
- Atoms: INTENT → SELECTION → PATCH
- SQLite rows written:
  - log_events: input_event, intent_classification, template_match, patch_validation, response_summary (5 rows)
  - edit_history: 1 row (before=empty, after=8-section scaffold)
- Simulated latency: 1850ms
- Outcome: site shell + dev-tool-dark theme + 8 default sections (navbar / hero / quickstart / value-props / pricing / numbers / cta / footer) — copy is template-default, will be edited in subsequent prompts.

### Prompt 2 — Add quickstart section
- Input: "Add a quickstart section with npm install steps"
- Mode: chat
- request_id: req-s1-002
- Pipeline route: INTENT verb=add, target=section/columns; rules-fast path (no SELECTION re-run since template already selected)
- Atoms: INTENT → PATCH
- SQLite rows written:
  - log_events: input_event, intent_classification, patch_validation, response_summary (4 rows)
  - edit_history: 1 row (added `columns#quickstart` with 3 code-step children)
- Simulated latency: 150ms
- Outcome: quickstart section now contains real `npm install axon` + define + ship code blocks. Code is JetBrains Mono.

### Prompt 3 — Hero darker + technical
- Input: "Make the hero darker and more technical"
- Mode: chat
- request_id: req-s1-003
- Pipeline route: INTENT verb=change, target=hero (theme.palette.bgPrimary lowered + tone shifted to technical)
- Atoms: INTENT → PATCH
- SQLite rows written:
  - log_events: input_event, intent_classification, patch_validation, response_summary (4 rows)
  - edit_history: 1 row (hero copy + theme.palette.bgPrimary)
- Simulated latency: 200ms
- Outcome: hero bgPrimary `#0a0a0f` → `#08090b`; subheading rewritten to "TypeScript-first CLI framework. Parse arguments, validate input, render ergonomic help — in 12 lines instead of 400."

### Prompt 4 — Pricing section (DECOMP, 2 todos)
- Input: "Add a pricing section — free tier and $19/month pro"
- Mode: chat
- request_id: req-s1-004
- Pipeline route: DECOMP_ATOM splits into 2 todos: (a) add pricing structure, (b) populate Free + Pro tiers; INTENT routes each
- Atoms: INTENT → DECOMP → PATCH
- expectedTodos: 2
- SQLite rows written:
  - log_events: input_event, intent_classification, decomp_split, patch_validation, response_summary (5 rows)
  - edit_history: 1 row (pricing section + 2-tier content applied as a single patch batch)
- Simulated latency: 300ms
- Outcome: `pricing#pricing` populated with Free ($0 forever) + Pro ($19/dev/month), 4 features each, highlighted=true on Pro.

### Prompt 5 — Developer-friendly font
- Input: "Change the font to something more developer-friendly"
- Mode: chat
- request_id: req-s1-005
- Pipeline route: INTENT verb=change, target=theme.typography; matches "monospace" / "tech-business" theme keyword in the matcher
- Atoms: INTENT → PATCH
- SQLite rows written:
  - log_events: input_event, intent_classification, patch_validation, response_summary (4 rows)
  - edit_history: 1 row (theme.typography swap)
- Simulated latency: 250ms
- Outcome: theme.typography.headingFamily → JetBrains Mono; baseSize tightens from 16px → 15px; lineHeight 1.7 → 1.6.

### Prompt 6 — Social proof
- Input: "Add social proof with GitHub stars and downloads"
- Mode: chat
- request_id: req-s1-006
- Pipeline route: INTENT verb=add, target=numbers section
- Atoms: INTENT → PATCH
- SQLite rows written:
  - log_events: input_event, intent_classification, patch_validation, response_summary (4 rows)
  - edit_history: 1 row (numbers#social-proof with 4 stats)
- Simulated latency: 180ms
- Outcome: 4-stat grid — 12.4k stars, 284k downloads/mo, 186 contributors, 2,400+ CLIs in production.

### Prompt 7 — Second page (docs)
- Input: "Create a second page for documentation"
- Mode: chat
- request_id: req-s1-007
- Pipeline route: INTENT verb=add, target=page; pageIterator triggers; pages[1] created with id="docs"
- Atoms: INTENT → PATCH
- SQLite rows written:
  - log_events: input_event, intent_classification, page_scope_resolution, patch_validation, response_summary (5 rows)
  - edit_history: 1 row (pages array extended with docs page)
- Simulated latency: 200ms
- Outcome: pages[1] = { id:"docs", slug:"/docs", sections:[hero, footer] }; default docs hero + minimal footer.

### Prompt 8 — Changelog scoped to docs
- Input: "Add a changelog section to the docs page"
- Mode: chat
- request_id: req-s1-008
- Pipeline route: INTENT verb=add, target=blog (changelog kind); pageId="docs" scope detected via pageIterator
- Atoms: INTENT → PATCH
- expectedPageScope: page-2
- SQLite rows written:
  - log_events: input_event, intent_classification, page_scope_resolution, patch_validation, response_summary (5 rows)
  - edit_history: 1 row (blog#changelog appended to pages[1].sections)
- Simulated latency: 250ms
- Outcome: 4-entry changelog (v1.0.0 stable, v0.9.0 async validators + Bun, v0.8.0 subcommand groups, v0.7.0 interactive prompt fallback).

### Prompt 9 — Linear.app feel (DECOMP, 3 todos)
- Input: "Make the whole site feel more like linear.app"
- Mode: chat
- request_id: req-s1-009
- Pipeline route: DECOMP_ATOM multi-clause split into 3 todos: (a) tighten theme palette, (b) reduce typography scale + monospace heading, (c) tighten section spacing
- Atoms: INTENT → DECOMP → PATCH
- expectedTodos: 3
- SQLite rows written:
  - log_events: input_event, intent_classification, decomp_split, patch_validation, response_summary (5 rows)
  - edit_history: 1 row (theme.palette + theme.typography + theme.spacing batch)
- Simulated latency: 400ms
- Outcome: accentPrimary → `#7c3aed`; sectionPadding 64px → 96px; containerMaxWidth 1280 → 1120px; borderRadius 12px → 8px.

### Prompt 10 — Export Claude Code bundle
- Input: "Export the spec for Claude Code"
- Mode: chat
- request_id: req-s1-010
- Pipeline route: INTENT verb=export, target=claude-code-bundle; triggers `buildClaudeCodeBundle()` per ADR-122
- Atoms: INTENT
- SQLite rows written:
  - log_events: input_event, intent_classification, export_emit, response_summary (4 rows)
  - edit_history: 0 rows (no patch — emit-only)
- Simulated latency: 50ms
- Outcome: markdown bundle emitted with `# === FILE: <path> ===` markers covering CLAUDE.md preamble + process-map + human-spec + AISP spec + ADRs + agent waves; downloaded as `axon-claude-code-bundle.md`.

---

## Scenario 1 — Axon CLI Tool — Summary

- 10 prompts executed
- Total log_events rows: **45** (5 + 4 + 4 + 5 + 4 + 4 + 5 + 5 + 5 + 4)
- Total edit_history rows: **9** (steps 1-9; step 10 = export-only, no patch)
- **Total SQLite rows: 54**
- Simulated wall-clock: **3,830 ms** (~3.8 sec)
- Final state: 1 home page (8 sections: navbar, hero, quickstart, value-props, pricing, numbers, cta, footer) + 1 docs page (3 sections: hero, changelog, footer) — **11 sections total**
- Section types touched (10 of 18): menu, hero, columns, pricing, numbers, action, footer, blog — plus quickstart as a `columns` variant
- Theme: dark mode, JetBrains Mono headings, linear.app-derived palette + spacing
- Export bundle generated at prompt 10 (no patch row, single export_emit log)

### Cross-references for A7 audit

- log_events expected count: 45 → matches `SCENARIO_1_EXPECTED_LOG_EVENT_ROW_COUNT`
- edit_history expected count: 9 → matches `SCENARIO_1_EXPECTED_EDIT_HISTORY_ROW_COUNT`
- Total SQLite rows: 54 → matches `SCENARIO_1_EXPECTED_SQLITE_ROW_COUNT`
- DECOMP-producing prompts: 2 (steps 4, 9) — both emit `decomp_split` event
- Page-scope prompts: 2 (steps 7, 8) — both emit `page_scope_resolution` event
- Export-only prompts: 1 (step 10) — emits `export_emit`, no edit_history
