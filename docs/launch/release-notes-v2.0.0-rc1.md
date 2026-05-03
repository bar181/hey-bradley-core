# Hey Bradley v2.0.0-RC1 — Agentic Workbench RC

**Release date:** 2026-05-01
**Tag:** `v2.0.0-RC1`
**Branch sealed at:** P101 / AW-RC

---

## What's new

### Three modes for three audiences

Hey Bradley now ships three first-class modes — all routed, all persisted, all functional at RC.

- **Whiteboard** — visual website builder for non-technical users. Byte-equivalent to v1.0.0-RC1; if Whiteboard is all you came for, your mental model is preserved.
- **Planning** — phase + sprint decomposition. Type a project description; PROCESS_ATOM emits phases / sprints / waves / agents and renders a process map. Toggle to domain view; DDD_ATOM emits bounded contexts + relationships and renders a domain model. Same chat bar drives both atoms.
- **Agentics** — multi-agent coordination with full AISP spec exposure. SpecWorkbench (3-tab Human / AISP / ADR view), TDD scaffold generator, KISS reviewer, Seal Panel for end-of-phase artifacts, Export Claude Code button.

AppShell layout is route-derived per ADR-116 — single source of truth is the URL, not the store.

### 8 Crystal Atoms — the AISP suite is complete

The atom-design phase is closed at v2.0.0-RC1. All 8 production-wired:

- **PATCH** — JSON Patch primitive (operate-on-DOM-tree contract).
- **INTENT** — verb / target / type classification with goal-feasibility flags.
- **SELECTION** — 2-step template selection (category narrow → template pick).
- **CONTENT** — section-aware content generation with tone / length defaults.
- **ASSUMPTIONS** — explicit assumption surfacing for ambiguous prompts.
- **DECOMP** — front-of-pipeline multi-clause splitter; conjunction-split + verb / target lookup; 0.9 / 0.6 / 0.3 confidence ladder.
- **PROCESS** — project description → phases / sprints / waves / agents → ProcessMap. (P92 / ADR-118)
- **DDD** — project description → bounded contexts + 4-kind relationships → DomainModelSVG. (P93 / ADR-119)
- **AGENT** — wave context → ordered AgentSpec[] with disjoint ownedFiles + DoD checklists. (P94 / ADR-120 — 8th + final)

Every atom has ≥1 production import site after P97 / TDD-SCAFFOLD wired AGENT_ATOM into PlanningChatBar.

### Spec-factory framing

Hey Bradley v2 is now a **spec factory**. The headline output is the markdown bundle, not the rendered HTML.

- **Markdown spec bundle export** — single `.md` with `# === FILE: <path> ===` markers. Six-plus logical files: CLAUDE.md preamble + process map + human spec (north-star / SADD / implementation plan) + AISP spec + ADRs + agent wave scopes + (P97) TDD test spec.
- **Bundle IS the canonical Hey Bradley OUTPUT.** Downstream consumer (Claude Code, Cursor, any LLM agent) reads bundle and writes the implementation in their own repo. Spec freedom + implementation autonomy.
- **No new dependencies.** No JSZip, no archiver, no File System Access API. Pure markdown; readable, git-versionable, LLM-ingestible, zero-dep. Trivial-to-split with one awk or python line. (ADR-122)

### Comprehensive logging

Every LLM interaction is logged to SQLite with full pipeline trace.

- **Two-table architecture** — `log_events` + `edit_history` with 30 / 90 day retention auto-pruned.
- **Three-level ID hierarchy** — `session_id` → `request_id` → `event_id`. New `request_id` generated at chatPipeline submit entry.
- **BYOK trust boundary preserved** — `redactKeyShapes` runs at every write boundary per ADR-043 + ADR-114 D3. Keys never cross to the log.
- **Fire-and-forget writes** — wrapped try / catch; never throws upward.
- **ConversationLog drill-down** per `request_id` via `getEventsForRequest`.

13 event types declared in the schema CHECK enum (extended at P100 W2 / FMT-VERIFY with `decomp_split` + `export_emit`). 11 BYOK redaction sites.

### TDD scaffold + KISS review + Seal Panel

The Reflect surface (7-step methodology step 7) is feature-complete for open-core.

- **TDD scaffold generator** — Given/When/Then markdown derived from 4 sources: AISP-Σ + DDD context + AGENT DoD + phase-gate. Cap 30 cases per phase. Joins the Claude Code bundle as 7th logical file. (P97 / ADR-128)
- **KISS Reviewer** — 6-category × 3-tier review. Categories: no-new-deps / loc-cap / no-hardcode / gate-conditions / aisp-sigma / scope-creep. Severity: P1 blocking / P2 should-fix / P3 note. **PASS = zero P1.** Binary verdict — no "78/100 pass with caveats" wiggle room. (P98 / ADR-129)
- **Seal Panel** — pure component contract `{phase, eop, onSeal}`. Three-card markdown layout (post-review / session-log / retrospective) with minimal renderer rejecting full-markdown parser deps per KISS. PROCESS+DDD persistence on every Planning chat submit closes the P101 carry-forward for declared-but-unwired event types. (P99 / ADR-130)

---

## Honest scoring vs SOTA

We score honestly. The 7-category SOTA rubric (intent / visual / content / patches / sqlite / pipeline / ux) graded Hey Bradley vs Lovable 80 / 100 baseline.

- **Hey Bradley v2.0.0-RC1 boundary (P103 / ADR-133): 86.7 / 100 composite.** That's **+6.7 vs SOTA** — the P101 honest range of 79 — 84/100 reflected pre-P102 fix-pass state; P102 closed the floor-breaches before the tag was cut.
- **History (transparent):** P100 W2 / LOG-BUILD claimed 88/100 OPTIMISTIC. P100 W2 / FMT-VERIFY traced 4 real scenarios through actual code paths instead of fixture text and revised to 79 → 84 / 100 (-9 honesty haircut, +5 with D1 fixes). P102 / OC-POLISH-W5 then landed token migration + Agentics live-wire and re-scored personas — composite settled at **86.7/100** at P103 / ADR-133.

### Persona scores at v2.0.0-RC1 seal (P102 / ADR-132) — 0/3 floor breaches

- **Grandma 86** — floor 85 — **+1 over floor**
- **Framer 86** — floor 85 — **+1 over floor**
- **Lars 88** — floor 88 — **on floor**

The fix-passes landed BEFORE the tag was cut.

- **P102 token migration** lifted Grandma + Framer to ≥85 (closed carry-forwards CF#7 + CF#8: Welcome 47→0 hex + Onboarding 91→9 hex + 22 new tokens).
- **Agentics live-wire** lifted Lars to ≥88 (closed CF#9: SQLite `process_atom_output` query → toProcessMap → setLiveMap; Agentics SpecWorkbench live-data binding).

The brutal review is in `plans/implementation/phase-101/seal/`; the P102 fix-pass artefacts are in `plans/implementation/phase-102/seal/`.

---

## Known limitations

Honest list of things deliberately deferred from v2.0.0-RC1:

- **Live LLM verifications require BYOK** — owner-required post-RC task. 5 LIVE-LLM divergence risks documented in ADR-127 §9. (CF#4)
- **Real STT calibration requires browser session** — owner-required post-RC task. (CF#5)
- **Tier-2 commercial features** — Supabase auth, hosted share URLs, multi-tenant, real-time observability dashboard, cross-session analytics, ML anomaly detection, Tier-2 SaaS-dashboard flagship. Separate repo, separate timeline.
- **Build-time EOP pre-bake** — Vite plugin reads disk + injects markdown into PhaseCard fixtures; runtime `eop` prop is null at open-core with empty-state card. (CF#6 Tier-2)
- **HNSW vector-DB activation** — ruvector is a manually-curated static snapshot (126 entries; 0 indexed vectors). HNSW re-index + auto-write deferred to Tier-2 learning runtime.
- **Multi-tenant** — single-user single-browser. OAuth + Supabase persistence in commercial track.
- **Native mobile apps** — none. Responsive-web only (ADR-090).
- **Full WCAG AAA** — open-core ships a WCAG 2.1 AA-leaning baseline (ADR-102).
- **Localization** — English only.
- **Live-LLM evaluation harness** — prompt corpus runs against AgentProxy mock; live-LLM matrix execution deferred.
- **Persona scores at seal — 0/3 below floor (post-P102)** — see "Honest scoring" above; P102 fix-pass landed BEFORE tag was cut.

---

## Quickstart — adopting AISP

Five steps from the README to integrate AISP into any consumer:

1. **Read the bundle schema** — `docs/aisp-adoption/01-bundle-schema.md` documents the canonical `bundle.json` shape (sections, theme, content, navigation, AISP atoms).
2. **Pick a reference implementation** — `examples/3rd-party-consumer/parse-aisp-typescript.ts` (Node 20+ stdlib) or `parse-aisp-python.py` (Python 3.10+ stdlib). Both zero-dependency.
3. **Parse a sample bundle** — `examples/3rd-party-consumer/sample-bundle.json` is a minimal valid AISP-1.0 fixture.
4. **Walk the atoms** — `docs/aisp-adoption/02-reference-implementation-walkthrough.md` annotates the parser line by line; explains each Crystal Atom in the bundle.
5. **Validate against your own consumer** — round-trip your bundle through one of the reference impls. The bundle parsing surface is stable across `aisp-1.X` minor versions.

Full guide: [`docs/aisp-adoption/00-getting-started.md`](../aisp-adoption/00-getting-started.md).

---

## Roadmap

- **P102 / OC-POLISH-W5** — Token migration (Welcome + Onboarding ~150 LOC) + Agentics live-map wire + final QA + persona re-score. Closes CF#7 — CF#9. Lifts Grandma / Framer to ≥85, Lars to ≥88.
- **P103** — This release. Release artifacts: CHANGELOG, release notes, Show HN post, Product Hunt tagline, demo video script, owner launch checklist.
- **P104** — v2.0.0-RC1 public launch. Owner-led: tag, BYOK smoke (~$0.01), demo video record, Show HN / PH / Reddit / LinkedIn / X posts, Agentics Foundation beta share (20-50 users), AISP community campaign.

---

## Numbers (as of P109 / FINAL-CLEANUP — post-RC seal arc)

> v2.0.0-RC1 boundary was sealed at P101; the post-RC seal arc (P102 — P109 + 5-PROJECTS + FINAL-CLEANUP) landed in the same branch before tag. Numbers below reflect current state.

- **Phases:** 109 sealed (P11 → P109) + 5-PROJECTS + FINAL-CLEANUP
- **Tests:** 237 cumulative regression GREEN / ~1491+ cumulative session GREEN at P109 anchor
- **ADRs:** 128 files on disk; IDs run ADR-001 — ADR-137 with documented gaps
- **Crystal Atoms:** 8 — **AISP suite COMPLETE**
- **Modes:** 3 (Whiteboard / Planning / Agentics)
- **Templates:** 51 EXAMPLE_SITES
- **Themes:** 21
- **Section types:** 18
- **Blog posts:** 12
- **BYOK providers:** 3 (Claude / Gemini / OpenRouter)
- **Persona scores (P102 / ADR-132):** Grandma 86 / Framer 86 / Lars 88 (0/3 floor breaches)
- **SOTA composite (P103 / ADR-133):** 86.7 / 100 vs Lovable 80 / 100

---

## Links

- **AISP open spec:** [`bar181/aisp-open-core`](https://github.com/bar181/aisp-open-core) — math-first symbolic protocol; same author (Bradley Ross); independent of this builder.
- **Discussion:** [GitHub issues](https://github.com/bar181/hey-bradley-core/issues).
- **Reference implementations:** `examples/3rd-party-consumer/` — TypeScript + Python, stdlib-only.
- **Brutal review:** `plans/implementation/phase-101/seal/` — 4-reviewer parallel review (Whiteboard / Planning+Agentics / Security / Architecture); 4 PARTIAL verdicts + A4 fix-pass landing 4 cheapest blockers.

---

## Thanks

The AISP open spec lives at [`bar181/aisp-open-core`](https://github.com/bar181/aisp-open-core). The math-first symbolic protocol is independent of this builder; v2.0.0-RC1 is one consumer of the spec.

If you ship an AISP consumer in another language (Go, Rust, Swift, Java, …), please open a PR — see `CONTRIBUTING.md` "Contributing AISP reference implementations".

— Bradley Ross
2026-05-01
