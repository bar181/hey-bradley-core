# Changelog

All notable changes to **hey-bradley-core** are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project does not yet follow strict SemVer (v1.0.0-RC1 was the first tagged release; v2.0.0-RC1 ships the Agentic Workbench arc).

## [v2.0.0-RC1] — 2026-05-01

Second release-candidate of the Hey Bradley open-core SPA — the **Agentic Workbench RC**. As of P109 / FINAL-CLEANUP: **109 phases sealed (P11 → P109)** + 5-PROJECTS + FINAL-CLEANUP; **237 cumulative regression GREEN / ~1491+ cumulative session GREEN**; **128 ADRs on disk (IDs run ADR-001 — ADR-137 with documented gaps)**; **51 templates** (EXAMPLE_SITES); 21 themes; 18 section types; 12 blog posts; **8 Crystal Atoms — AISP suite COMPLETE** (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT); **3 modes routed** (Whiteboard / Planning / Agentics); **7-step methodology** (Research → Decompose → Architect → Spec → Plan → Build → Reflect). Persona scores **Grandma 86 / Framer 86 / Lars 88** per ADR-132 (0/3 floor breaches at v2.0.0-RC1 seal); SOTA composite **86.7/100** vs Lovable 80/100 baseline per ADR-133.

### Highlights

- **8 Crystal Atoms — AISP suite COMPLETE.** PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT. The atom-design phase is closed; v2.0+ pivots to surface implementation and Tier-2 commercial work.
- **3 modes for 3 audiences.** Whiteboard (visual builder), Planning (phase + sprint decomposition with PROCESS_ATOM + DDD_ATOM), Agentics (multi-agent coordination with full AISP spec). All routed; AppShell layout route-derived per ADR-116.
- **7-step methodology.** Research → Decompose → Architect → Spec → Plan → Build → Reflect — encoded in the Agentics mode workflow and the markdown spec bundle.
- **Comprehensive SQLite log infrastructure.** Two-table architecture (`log_events` + `edit_history`) with 30 / 90 day retention; three-level ID hierarchy (`session_id` → `request_id` → `event_id`); BYOK trust boundary preserved via `redactKeyShapes` at every write boundary. ADR-126.
- **Markdown spec bundle export for Claude Code consumption.** Single `.md` with `# === FILE: <path> ===` markers; ≥6 logical files (CLAUDE.md preamble + process map + human spec + AISP spec + ADRs + agent wave scopes); bundle IS the canonical Hey Bradley OUTPUT — downstream consumer (Claude Code, Cursor, any LLM agent) reads bundle and writes implementation in their own repo. ADR-122.
- **TDD scaffold + KISS review + Seal Panel.** Given/When/Then markdown derived from AISP-Σ + DDD context + AGENT DoD + phase-gate (ADR-128); 6-category 3-tier KISS reviewer with PASS = zero P1 (ADR-129); 3-card EOP markdown panel with PROCESS+DDD log persistence (ADR-130).
- **51 templates / 18 section types / 21 themes / 12 blog posts.** Open-core asset surface expanded post-RC: +2 E2E-validation entries (aisp-executive + aisp-developer-retro), +3 E2E-TEST-2 multi-scenario entries (coffee-essay + north-light-agency + indie-coffee-roaster), +5 5-PROJECTS persona-driven full-pipeline builds (Axon CLI + GreenLane + Quattro Studio + Mrs. Albright's Tutoring + Bordo Spec; composite reviewer score 9.4/10).

### Phase ledger

Full ledger lives in `plans/implementation/mvp-plan/STATE.md`. Highlights only here; v1.0.0-RC1 entries summarised; v2.0.0-RC1 entries enumerated.

#### Open Core Foundation (P11 — P22) — composite scores ~74 — 88/100

- P11 — Public marketing site + enhanced demos + brand and design locks (83/100).
- P12 — Content Intelligence: site-context derivation, 13 image effects, Resources tab (78/100).
- P13 — Advanced features: blog section type, multi-page scaffolding, ZIP export, a11y baseline (76/100).
- P14 — Marketing review: 20 issues fixed; AISP validation (74/100).
- P15 — Polish + Kitchen Sink + Blog + Novice simplification (82/100).
- P16 — Local database (sql.js + IndexedDB) (86/100).
- P17 — LLM provider abstraction + env-var + BYOK scaffold (88/100).
- P18 / P18b — Real Chat mode + provider expansion + observability (89-90/100).
- P19 — Real Listen mode (Web Speech STT) (88/100).
- P20 — Verify, cost-caps, MVP close (88/100).
- P21 — Cleanup + ADR/DDD gap-fill.
- P22 — Public website rebuild: BYOK demo + Don Miller blog-style (81/100).

#### Sprints A — F (P23 — P38)

- Sprint B (P23 — P25) — Simple Chat: template-first routing, section targeting, intent translation. ADRs 050-052.
- Sprint C (P26 — P28) — AISP instruction layer + Crystal Atom + 2-step template selection. ADRs 053, 055-057.
- Sprint D (P29 — P33) — Template Library API, persistence, Content Generators (CONTENT_ATOM), pipeline, bridge. ADRs 058-062.
- Sprint E (P34 — P35) — UI closure + ASSUMPTIONS_ATOM + EXPERT trace pane + OpenAI BYOK. ADR-064. **5-atom AISP in production.**
- Sprint F (P36 — P38) — Listen + AISP unification + command triggers + ListenTab refactor (947 → 84 LOC). ADRs 065-066.

#### Sprints H — J (P44 — P53)

- Sprint H (P44 — P46) — Brand Context Upload + codebase reference ingestion + Reference Management UI. ADRs 067-069.
- Sprint I (P47 — P49) — Builder UX polish + Quick-add picker + mobile polish. ADRs 070-072.
- Sprint J (P50 — P53) — Personality Engine + Picker UI + Conversation Log EXPERT tab + mobile UX overhaul. ADRs 073-076.

#### Moat sprints K — N (P54 — P57)

- P54 / Sprint K — Speed visible: latency capture + UI badge. ADR-077.
- P55 / Sprint L — Spec unmissable: AISP always-on + atom animations. ADR-078.
- P56 / Sprint M — Premium templates: 3 — 5 strongly opinionated templates. ADR-079.
- P57 / Sprint N — Shareable output: static HTML export + share URL stub. ADRs 080-081.

#### RC + QA arc (P58 — P60) — v1.0.0-RC1 path

- P58 / Sprint O — Open Core RC: README / CLAUDE final + demo video + Agentics Foundation beta. ADR-082.
- P59 — Test library prompt corpus: 280-entry canonical corpus. ADR-083.
- P60 — Comprehensive QA architecture: 50 personality + 80 LLM matrix + flagship + 4 per-concern specs. ADR-084.

#### OC arc (P61 — P83) — v1.0.0-RC1 sealed

- P61 — Multi-page MVP planning. ADRs 085-086.
- P62 — P67c — Design tokens, mode architecture, mobile redesign, polish waves. ADRs 087-095.
- P68 / OC-4 — Templates Round 2 (11 new templates). ADR-096.
- P69 / OC-5 — Mobile UX redesign. ADR-090 supersedes ADR-076.
- P70 / OC-CLEANUP — Docs / scoring cleanup.
- P71 / OC-13 — Blog expansion (4 → 10 posts). ADR-097.
- P72 / OC-TI — Template Intelligence (3-layer: theme / section / content). ADR-098.
- P73 / OC-TPL-AUDIT — 37 starter pack audit + bottom-5 fixes + `exampleQueries` REQUIRED on all 51 entries.
- P74 / OC-DECOMP — DECOMP_ATOM front-of-pipeline multi-clause splitter + todoExecutor. ADR-099.
- P75 / OC-7 — Section Type closure: case-study + contact-form (16 → 18). ADR-100.
- P76 / OC-9 — Spec Export Quality Standard. ADR-101.
- P77 / OC-10 — Performance + accessibility baseline. ADR-102.
- P78 / OC-11 — Multi-page MVP wire. ADR-103.
- P79 / OC-14 — Page-aware chat pipeline. ADR-104.
- P80 / OC-15 — Agentic-product templates (4 vertical-positioned; 37 → 41). ADR-105.
- P81 / OC-16 — Prompt Library completeness (280 → 500+). ADR-106.
- P82 / OC-CLEANUP — Pre-RC cleanup batch. ADR-107.
- P83 / OC-17 — AISP Adoption Push: README rewrite + adoption guide tree + polyglot reference impls. ADR-108.

#### v1.0.0-RC1 seal arc (P84) — sealed 2026-05-01

- P84 / OC-18 — Open Core v1.0.0-RC1 release artifacts: CHANGELOG + release notes + Show HN + Product Hunt tagline + demo script + owner launch checklist. ADR-109.

#### Agentic Workbench arc (P85 — P101) — v2.0.0-RC1 sealed 2026-05-01

- **P85** — AISP Visibility Standard: dual-view candidates surfaced (chat matcher confidence + DECOMP todos + EXPERT error code suffix); developer onboarding card component ships. ADR-110.
- **P86 / OC-POLISH-W4** — Final Polish Standard: library-wide ≥8.5 score declaration on the ADR-094 rubric; token-derived spacing/colors; canonical hover-lift + focus-visible. ADR-111.
- **P87 / OC-5-MKT-MOBILE** — Marketing Site Mobile Standard: 8 marketing pages render cleanly at 375 / 390 / 428 px; WCAG 44 px touch target floor; Lighthouse mobile target ≥85. ADR-112.
- **P88** — Section Type Visual Quality: all 18 section components ≥8.5; MobileListenFullscreen tokenized. ADR-113.
- **P89 / TIER2-FOUNDATION** — Supabase architecture + feature flag (5-table schema + magic-link/OAuth + BYOK trust boundary preserved + `VITE_SUPABASE_URL` build-time gate). ADRs 114-115.
- **P89b / TIER2-CLEANUP** — Supabase boundary correction: open-core `src/` has zero Supabase refs; ADR-114 + ADR-115 retained as Tier-2 planning docs (relocated to `plans/tier-2/`).
- **P90 / AW-MODE-ARCH** — Three-Mode Product Architecture: `/`, `/planning`, `/agentics` routes; AppShell mode-aware layout (route-derived via `useLocation()`); Planning + Agentics ship as stubs P90 with full bodies P91 — P100. ADR-116.
- **P91 / AW-PROCESS-MAP** — Process Map SVG: pure SVG no-new-deps; 4 status colors; 3 edge types; sample Hey Bradley arc P15 — P20 with diamond gate. ADR-117.
- **P92 / AW-PROCESS-ATOM** — **PROCESS_ATOM 6th Crystal Atom.** Project description → phases / sprints / waves / agents → ProcessMap. Live in Planning mode chat via PlanningChatBar; rules-based classifier baseline + AgentProxy hand-off scaffolded. ADR-118.
- **P93 / AW-DDD-ATOM** — **DDD_ATOM 7th Crystal Atom.** Project description → bounded contexts + relationships → DomainModelSVG; Planning mode view toggle swaps process-map ↔ domain-model with shared chat bar. ADR-119.
- **P94 / AW-AGENT-ATOM** — **AGENT_ATOM 8th + FINAL Crystal Atom.** Wave context → ordered AgentSpec[] with disjoint ownedFiles + DoD checklists. **AISP suite COMPLETE at 8 atoms.** ADR-120.
- **P95 / SPEC-WORKBENCH** — Tabbed Human / AISP / ADR dual-view; horizontally-scrollable sprint cards with click-to-expand; clipboard primary for AISP; mounts in Agentics + Planning right panel. First AGENT_ATOM consumer. ADR-121.
- **P96 / AW-EXPORT-CLAUDE-CODE** — Markdown spec bundle (NOT ZIP); single `.md` with `# === FILE: <path> ===` markers; ≥6 logical files; bundle IS canonical Hey Bradley OUTPUT. ADR-122.
- **P97 / TDD-SCAFFOLD** — TDD scaffold pure module: Given/When/Then markdown derived from AISP-Σ + DDD context + AGENT DoD + phase-gate; AGENT_ATOM `classifyAgents()` production-wired in PlanningChatBar (closes P101 carry-forward #1). Test spec joins Claude Code bundle as 7th logical file. ADR-128.
- **P98 / KISS-REVIEW** — KISS Reviewer pure module: 6 categories (no-new-deps / loc-cap / no-hardcode / gate-conditions / aisp-sigma / scope-creep) × 3-tier severity (P1 blocking / P2 should-fix / P3 note); PASS = zero P1 binary verdict. ADR-129.
- **P99 / SEAL-PANEL** — Seal Panel + EOP persistence: pure component contract `{phase, eop, onSeal}`; 3-card markdown layout (post-review / session-log / retrospective); minimal renderer rejecting full-markdown parser deps; PROCESS+DDD persistence on every Planning chat submit (closes P101 carry-forward #2). ADR-130.
- **P100 W2 / LOG-BUILD** — Comprehensive LLM Interaction Logging: `log_events` + `edit_history` SQLite tables; 13 event types; 11 BYOK redaction sites; 4-scenario validation (Axon CLI dev / adversarial edge cases / listen mode startup / Planning SaaS auth) scoring **88 / 100 SOTA** vs Lovable 80 baseline. ADR-126.
- **P100 W2 / FMT-VERIFY** — Format Verification + Top-3 Atom-Helper Fixes: AgentProxy response shape MATCHES Zod schema for happy path with 5 LIVE-LLM divergence risks documented; 3 critical helpers wired (`isUnmeasurableGoal` + `hasContradiction` + `cleanTranscript`); schema CHECK enum extended. **Honest SOTA revision: 88 → 79 / 100 raw → 84 / 100 with D1 fixes** (-9 honesty haircut, +5 with fixes). ADR-127.
- **P101 / AW-RC** — Agentic Workbench RC: definitive boundary record naming what ships at v2.0.0-RC1 (3 modes routed + 8 atoms wired + 7-step methodology); 12-item carry-forward registry (CF#1-3 CLOSED + CF#4-5 OWNER-REQUIRED + CF#6 TIER-2 + CF#7-12 P102 candidates); 4 PARTIAL verdicts from W2 brutal review with A4 fix-pass landing 4 cheapest blockers (≤70 LOC cap). ADR-131.

#### Post-RC seal arc (P102 — P109 + 5-PROJECTS + FINAL-CLEANUP) — landed before tag

- **P102 / OC-POLISH-W5** — Final QA + Token Migration + Agentics Live-Wire + Persona Gate. Welcome 47→0 hex + Onboarding 91→9 hex + 22 new tokens; Agentics live-wire SQLite `process_atom_output` query → toProcessMap → setLiveMap; CF#11 status palette tokens `--hb-status-{sealed,deferred}` + CF#12 migration 005 INTENT_FUTURE comment block. Persona re-score Grandma 84→86 / Framer 84→86 / Lars 85→88 — **0/3 floor breaches** at v2.0.0-RC1 seal. ADR-132.
- **P103 / RC-RELEASE** — v2.0.0-RC1 Open Core Boundary record. CHANGELOG + release notes + Show HN + Product Hunt tagline + demo video script + owner launch checklist. Composite **86.7/100** vs Lovable 80/100. ADR-133 (definitive ship-boundary record).
- **P104 / SCHEMA-GUARDS** — Runtime validators. `validateEventType()` in `comprehensiveLogs.ts` (writeLogEvent integration; `patch_applied` → `patch_validation` remap) + `validateSectionType()` with alias map (article/long-form→text, testimonial/pull-quote→quotes, nav→menu, cta→action, faq→questions, stats→numbers) + CI smoke test. 12 new tests; 2 schema-enum carry-forwards from E2E-TEST-2 closed.
- **P105 / RC-BLOCKERS-CLOSURE** — Top-4 P1 blockers closed (4 parallel disjoint-scope agents). Welcome routes (5× `/onboarding` → `/new-project`) + AppShell cleanup (113→67 LOC dead-branch purge per ADR-116 D3) + log persistence flush (`scheduleFlush` 500ms debounce + `flushLogsImmediate` + pagehide listener — closes "logs evaporate on tab close") + cleanTranscript pipeline wire (effectiveText threaded through 14 consumers when `source==='listen'`) + validateSectionType production-wire (0 → 2 production callers). 17 new tests.
- **P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX** — Architectural-debt P1 closure (3 parallel disjoint-scope agents). twoStepPipeline.ts orphan DELETED (-123 LOC; ADR-057 SUPERSEDED in implementation; templateMatcher.ts is canonical SELECTION) + atom→view dependency inversion FIXED (NEW `processMapTypes.ts` + `types.ts` neutral type modules; 4 atom modules re-pointed; zero `@/components` imports in `src/contexts/`) + section-type enum 3-way reconciliation (PATCH_ATOM 16→18 + ALLOWED_TARGET_TYPES 23→18 + intentTargetTypeSchema 23→18; 5 sources agree on canonical 18 per ADR-100). 22 new tests. ADR-134.
- **P107 / LOG-INTEGRITY-EXPANSION** — Persistence/observability P1 closure. 4 unwired event_types now have production writers (`multi_page_scope` + `decomp_split` + `todo_execution` + `export_emit`; preserves atom-pure contract via NEW `ExportEmitCallback` type) + centralized `writeErrorEvent(db, ctx, err, source)` helper (BYOK redaction via `redactKeyShapes` on **both** message AND stack per ADR-043; 4 chatPipeline catch sites wired). CHECK enum coverage 10/15 → **15/15 = 100%**. 19 new tests. ADR-135.
- **P108 / TEST-RUNTIME-SHIFT** — Test-trustworthiness P1 closure. p76 spec audit-correction (D7 was false positive — `const it = test;` aliasing audit grep missed; trimmed 217→167 LOC) + mobile viewport projects (`playwright.config.ts` 1→4 projects: chromium Desktop preserved + mobile-375 iPhone-SE + mobile-390 iPhone-13 + mobile-428 iPhone-13-Pro-Max; opt-in via `testMatch`) + helpers behavioral coverage (NEW spec — cleanTranscript 12 cases + validateSectionType 13 cases + validateEventType 5 cases via `node:vm` `runInNewContext` sandbox + integration sanity 3 cases; behavioral finding `cleanTranscript` does NOT preserve quoted strings). 87 new test runs. ADR-136.
- **P109 / ADR-LEDGER-TRUTH-UP** — Documentation truth-up P1 closure. `docs/adr/README.md` rebuilt to disk reality (was 38 ADRs through ADR-048 last touched 2026-04-27 / post-P19; 60+ phases stale; now 127 entries / 18 phase-family buckets / 260 LOC) + section-enum drift regression guard (NEW `tests/p109-section-enum-drift-guard.spec.ts` — 13 cases / 7 describes; locks 5 sources of section-type truth to canonical 18; promotes ADR-100 discipline to CI-enforced invariant). 13 new tests. ADR-137.
- **5-PROJECTS / persona validation sprint** — 5 persona-driven full-pipeline builds wired into `EXAMPLE_SITES`: Axon CLI (Claude Code dev) + GreenLane (Marcus startup founder) + Quattro Studio (Sarah agency) + Mrs. Albright's Tutoring (Grandma listen-mode) + Bordo Spec (Lars agentic engineering). Composite reviewer score 9.4/10. 4-reviewer brutal-review pass with 0 P1 / 0 P2 / 3 P3 cosmetic findings.
- **FINAL-CLEANUP** (post-P109; same-branch swarm closure) — Fixture normalization (project-4 wrapper unwrap / `patch_applied`→`patch_validation` direct-rewrite / session-prefix mislabels fixed) + `todo_execution` + `error_event` fixture rows added so all **5 of 5 declared event_types now have BOTH production writers AND fixture coverage** + `docs/adr/README.md` header counter fix 127/ADR-136 → 128/ADR-137. All 4 honest gaps from `docs/validation/database-integrity-report.md` Check 2 CLOSED. EXAMPLE_SITES 51 (was 46 at v2.0.0-RC1 boundary; +5 from this sprint).

### Honest scoring vs SOTA

Per ADR-132 (P102 persona re-score) and ADR-133 (v2.0.0-RC1 boundary):

- **vs Lovable 80 / 100 baseline:** Hey Bradley scored **86.7 / 100** at v2.0.0-RC1 seal (P103 / ADR-133) — **+6.7 vs SOTA** on the 7-category rubric (intent / visual / content / patches / sqlite / pipeline / ux). The earlier P101 honest range of 79 — 84/100 reflected pre-P102 fix-pass state; P102 token migration + Agentics live-wire landed BEFORE tag.
- **Persona scores at v2.0.0-RC1 seal (P102 / ADR-132) — 0/3 floor breaches:**
  - Grandma **86** (floor 85; +1)
  - Framer **86** (floor 85; +1)
  - Lars **88** (floor 88; on)
- P102 token migration **lifted** Grandma + Framer to ≥85 (closed CF#7 + CF#8); Agentics live-wire **lifted** Lars to ≥88 (closed CF#9). Composite delta vs Lovable 80 is +6.7. Post-P109 + 5-PROJECTS honest delta estimate: +0 to +2 vs RC1 (no persona re-score this sprint; gains compound silently — token migration verified, log integrity proven, mobile coverage live, atom-view discipline locked, ADR ledger reconciled to disk truth).

### Known limitations (honest)

- **Live LLM verifications require BYOK** — owner-required post-RC task; 5 LIVE-LLM divergence risks documented in ADR-127 §9. (CF#4)
- **Real STT calibration requires browser session** — owner-required post-RC task. (CF#5)
- **Tier-2 commercial features deferred** — Supabase auth, hosted share URLs, multi-tenant, real-time observability dashboard, cross-session analytics, ML anomaly detection, Tier-2 SaaS-dashboard flagship. (Tier-2)
- **Persona scores 1 — 3 below floor at seal** — see "Honest scoring" above; P102 is the fix-pass.
- **Build-time EOP pre-bake** — Vite plugin reads disk + injects markdown into PhaseCard fixtures; runtime `eop` prop is null at open-core with empty-state card. (Tier-2 / CF#6)
- **HNSW vector-DB activation** — ruvector exists as a manually-curated static snapshot (126 entries; 0 indexed vectors). HNSW re-index + auto-write per agent run deferred to Tier-2 learning runtime.
- **Multi-tenant** — open-core is single-user single-browser. OAuth + Supabase persistence in the commercial track.
- **Native mobile apps** — none. Mobile UX is responsive-web only (ADR-090).
- **Full WCAG AAA** — open-core ships a WCAG 2.1 AA-leaning baseline (ADR-102). AAA contrast everywhere not guaranteed.
- **Localization** — English only.
- **Live-LLM evaluation harness** — prompt corpus runs against AgentProxy mock; live-LLM matrix execution against the 5-adapter set deferred (ADR-083 / ADR-084).
- **Welcome + Onboarding token migration** — ~150 LOC honest deferred (P102 / OC-POLISH-W5).
- **Agentics live-map wire** — hoist `liveMap` cross-mode (P102 candidate).
- **SVG legend strips** — ProcessMap + DomainModel (P102 candidate).
- **`useChatPipeline` hook extraction** — ChatInput at 738 / 750 LOC (P102 candidate).
- **Status palette tokens** — `--hb-status-{sealed,deferred}` (literal hex stopgap until palette pass).
- **Log enum housekeeping** — 5 declared event_types unwired (P102 candidate).

### Migration notes

- **Open-core users:** no migration needed. sql.js + BYOK persistence preserved byte-equivalent. v1.0.0-RC1 → v2.0.0-RC1 is additive (3 modes added; Whiteboard mode is byte-equivalent to v1).
- **Tier-2 fork:** see `plans/tier-2/README.md` for activation path. ADR-114 + ADR-115 are retained as Tier-2 planning docs; open-core `src/` has zero Supabase refs.
- **AISP versioning policy (per ADR-108 / ADR-109):**
  - `aisp-1.X` minor bumps preserve backward compatibility on the bundle parsing surface.
  - `aisp-2.0+` major bumps require an **RFC issue** with motivation, alternatives, migration path, and backward-compat shim plan.

### Numbers (as of P109 / FINAL-CLEANUP)

- **Phases:** 109 sealed (P11 → P109) + 5-PROJECTS + FINAL-CLEANUP
- **Tests:** 237 cumulative regression GREEN / ~1491+ cumulative session GREEN at P109 anchor
- **ADRs:** 128 files on disk; ADR IDs run ADR-001 — ADR-137 with documented gaps (002-004, 006-009, 034-037, 123-125 reserved) plus 3 P21-stub-then-superseded duplicates (ADR-051 / 052 / 053)
- **Templates:** 51 EXAMPLE_SITES (17 baseline + 3 OC-3 + 11 OC-4 + 4 OC-15 agentic-product + 2 E2E-TEST + 3 E2E-TEST-2 + 5 5-PROJECTS persona-driven full-pipeline)
- **Crystal Atoms:** 8 (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT) — **AISP suite COMPLETE**
- **Modes:** 3 (Whiteboard / Planning / Agentics)
- **Themes:** 21
- **Section types:** 18
- **Section arrangements:** 15
- **Content styles:** 15
- **Blog posts:** 12
- **EXPERT center tabs:** 5
- **Blueprint sub-tabs:** 7
- **BYOK providers:** 3 (Claude / Gemini / OpenRouter) + simulated + AgentProxy mock + DEV-only fixture
- **Images:** 300; **image effects:** 13 (8 core + 5 wow-factor)
- **Ruvector entries:** 126 (manually curated; HNSW deferred)
- **Persona scores (P102 / ADR-132):** Grandma 86 / Framer 86 / Lars 88 (0/3 floor breaches)
- **SOTA composite (P103 / ADR-133):** 86.7 / 100 vs Lovable 80 / 100

### Contributors

Bradley Ross (sole author / Hey Bradley creator / AISP open-spec creator)

---

## [v1.0.0-RC1] — 2026-05-01

First release-candidate of the Hey Bradley open-core SPA. **84 phases sealed (P11 → P83)**; ~996 cumulative pure-unit GREEN; **108 ADRs Accepted**; 41 templates; 21 themes; 18 section types; 12 blog posts; 5-atom Crystal Atom AISP architecture (+ DECOMP front-of-pipeline).

See `docs/launch/release-notes-v1.0.0-rc1.md` for the full v1.0.0-RC1 release notes. Phase ledger and known-limitations summary preserved above under the v2.0.0-RC1 phase-ledger section (P11 — P83) and the foundation history.

[v1.0.0-RC1]: https://github.com/bar181/hey-bradley-core/releases/tag/v1.0.0-RC1
[v2.0.0-RC1]: https://github.com/bar181/hey-bradley-core/releases/tag/v2.0.0-RC1
