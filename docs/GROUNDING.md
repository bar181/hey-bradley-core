# Hey Bradley — Project Grounding

> **Purpose:** A single document anyone (new contributor, future Claude session, presentation reviewer) can read in 10 minutes to understand the project, where we are in the sprint, and what to do next.
> **Last updated:** 2026-04-29 (Sprint J sealed — P50/P51/P52/P53)
> **Owner:** [Brad Ross](https://www.linkedin.com/in/bradaross/) — Harvard ALM Digital Media Design capstone (May 2026)
> **Pair this with:** `CLAUDE.md` (project rules), `docs/wiki/llm-call-process-flow.md` (how the pipeline runs), `plans/implementation/mvp-plan/STATE.md` (phase ledger).

---

## 1. What is Hey Bradley

A **JSON-driven marketing-website specification platform** — not a website builder. The user describes what they want (typed in chat OR spoken via push-to-talk), Hey Bradley produces two outputs in real time:

1. **A live preview** the user sees + iterates on
2. **An enterprise-grade specification document** (AISP-formatted) the user exports

The exported spec is precise enough that an AI dev agent (Claude Code, Cursor, etc.) can build the production site directly. The pipeline is `Ideation → Hey Bradley → Specs+JSON → Claude Code → Production Site`. **Apache-licensed open-core MVP.**

**Capstone thesis:** specification-driven development with AI agents can produce enterprise-quality output if the input ambiguity is sub-2%. Five Crystal Atom symbolic protocols (PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS) prove it.

---

## 2. Where We Are RIGHT NOW

**Sprint J sealed — P50/P51/P52/P53. Sprint G skipped per owner mandate.**

| | Status |
|---|---|
| Composite trajectory | 88 → 89 → 90 → 93 → 95 → 96 → 96 → 91 (P37) → P38 → Sprint H 89.7 → Sprint I 91 → **Sprint J 91.7/100 PASS (0 must-fix)** |
| Last sealed phase | **P53** (Sprint J Wave 4 — Mobile UX overhaul + Sprint J seal) |
| Last test count | Cumulative P29-P53 — ~615/615 PURE-UNIT GREEN target (550 prior + ~66 Sprint J: p50=15, p51=15, p52=21, p53=15) |
| Last brutal review | Sprint J end-of-sprint (single reviewer / lean): composite 91.7, Grandma 85 (+2 vs P49), Framer 91, Capstone 99 — PASS, 0 must-fix, 2 should-fix + 2 nice-to-have deferred to Sprint K opener |
| Outstanding carryforward | None (S1/S2 from Sprint J review = should-fix only, deferred). C11 closed at P49. |
| Presentation | Sprint F P38 produced `docs/wiki/presentation-readiness.md`; Vercel deploy still owner-triggered. Sprint K opens with comprehensive system-wide brutal review (Playwright + screenshots) per P53 preflight §Post-Wave-4. |

**Sprint J deliverables (P50/P51/P52/P53):**
- **P50 (ADR-073)** — `personalityEngine.ts` (5 modes; composition-only post-PATCH_ATOM; **no Σ widening**) + `chatPipeline` defensive `personalityMessage` + ChatMessage extension.
- **P51 (ADR-074)** — `PersonalityPicker.tsx` (radio-group + arrow-key nav) + Settings drawer mount + Onboarding first-run step + 5 chat-bubble styled variants + active-personality chip.
- **P52 (ADR-075)** — `ConversationLogTab.tsx` (6th EXPERT tab; joins `chat_messages ⨝ llm_logs`; MD + JSON export) + `ShareSpecButton.tsx` (clipboard data URL with `redactKeyShapes` at boundary).
- **P53 (ADR-076)** — Mobile UX overhaul: `MobileLayout.tsx` (3-tab sticky nav) + `MobileMenu.tsx` (hamburger drawer with PersonalityPicker / ReferenceManagement / BrandContextUpload / CodebaseContextUpload / ShareSpecButton / Conversation Log) + `Builder.tsx` `md:hidden` switch + RealityTab mobile sticky preview nav + ListenControls PTT mobile polish. **X8 narrowing:** Builder mobile = out forever; Chat/Listen/Preview mobile = in.

**Sprint H deliverables (P44/P45/P46 + fix-pass):**
- **P44 (ADR-067)** — Brand Voice Upload (CONTENT_ATOM Λ.brand_voice).
- **P45 (ADR-068)** — Codebase Reference Ingestion (INTENT_ATOM Λ.project_context + bias table).
- **P46 (ADR-069)** — Reference Management UI panel above the uploads.

**Sprint I deliverables (P47/P48/P49):**
- **P47 (ADR-070)** — Builder UX polish: `SectionsSection.tsx` per-row collapse/expand + categorized add-picker (Hero & CTA / Content / Social Proof + Media) + arrow-key list nav; right-panel a11y across 5 editors (~28 ARIA additions; ImagePicker focus-trap fix; FeaturesSectionSimple delete-focus management).
- **P48 (ADR-071)** — `QuickAddPicker.tsx` (curated 6-card opt-in section quick-add with category buckets + arrow-key grid nav); `improvementSuggester.ts` (pure-rule, ≤3 suggestions, $0); chatPipeline defensive `deriveImprovements()`; ChatInput "💡 Next steps" surface (testid `aisp-improvement-suggestions`).
- **P49 (ADR-072)** — Mobile polish: Welcome.tsx C11 vertical-snap carousel (`max-sm:` Tailwind only — no JS viewport detection, no new deps); SectionsSection touch parity; QuickAddPicker mobile grid; RealityTab `AddSectionDivider` always-visible on touch.

---

## 3. Sprint F + Sprint H at a glance (Sprint G skipped per owner mandate)

| Phase | Title | Status | Composite | Notes |
|---|---|---|---:|---|
| **P36** | Sprint F P1 — Listen + AISP Unification | ✅ SEALED | 96 | Review-first voice UX; ADR-065 |
| **P37** | Sprint F P2 — Command Triggers + Content/Design Route Split | ✅ SEALED | 91 | ADR-066; ListenTab 947→84 LOC |
| **P38** | Sprint F P3 — Sprint close + 4-reviewer brutal review + presentation gate | ✅ SEALED | — | `docs/wiki/presentation-readiness.md` |
| **P44** | Sprint H Wave 1 — Brand Voice Upload | ✅ SEALED | — | ADR-067; `brand_voice` channel |
| **P45** | Sprint H Wave 2 — Codebase Reference Ingestion | ✅ SEALED | — | ADR-068; `project_context` channel + bias table |
| **P46** | Sprint H Wave 3 — Reference Management UI | ✅ SEALED + fix-pass | — | ADR-069; `ReferenceManagement.tsx` |
| **P47** | Sprint I Wave 1 — Builder UX polish + a11y | ✅ SEALED | — | ADR-070; `SectionsSection.tsx` collapse + categorized picker + arrow-key + right-panel ARIA |
| **P48** | Sprint I Wave 2 — Quick-add + improvement suggestions | ✅ SEALED | — | ADR-071; `QuickAddPicker.tsx` + `improvementSuggester.ts` |
| **P49** | Sprint I Wave 3 — Mobile polish + C11 closure | ✅ SEALED | 91 | ADR-072; `<600px` carousel; touch parity |
| **P50** | Sprint J Wave 1 — Personality Engine | ✅ SEALED | — | ADR-073; 5 modes; composition-only; no Σ widening |
| **P51** | Sprint J Wave 2 — Picker UI + Onboarding step + chat bubble styling | ✅ SEALED | — | ADR-074; PersonalityPicker + first-run step |
| **P52** | Sprint J Wave 3 — Conversation Log + Share Spec | ✅ SEALED | — | ADR-075; ConversationLogTab + ShareSpecButton (data URL) |
| **P53** | Sprint J Wave 4 — Mobile UX overhaul + Sprint J seal | ✅ SEALED | 91.7 | ADR-076; MobileLayout + MobileMenu; X8 bifurcation |

**Sprint G skipped:** owner mandate — "Agent proxy for LLM testing. The mock/fixture adapter already exists from P18 — the swarm uses it for all testing. No real keys needed." All Sprint H tests run against AgentProxyAdapter / FixtureAdapter ($0 cost).

### Sprint H end-of-sprint review (lean 3-reviewer; this fix-pass closes it)

| Reviewer | Score | Verdict | Must-fix |
|---|---:|---|---:|
| R1 UX+Func | 88 | PASS | 4 |
| R2 Security | 90 | PASS | 0 (1 high-leverage L1) |
| R3 Architecture | 91 | PASS | 1 |
| **Avg** | **89.7** | **3-of-3 PASS** | **5 closed** |

Closed in this fix-pass: R3 F1 (ADR-068 enum drift) + R2 L1 (redactKeyShapes at persist + injection) + R1 F1 (4KB cap surface) + R1 F2 (5MB ZIP cap guidance + per-file skip) + R1 F3 (empty-state WHY) + R1 F4 (brand "unused this turn" on design routes) + R1 L4 (manifest staleness via cross-component event) + R3 L3 (this update).

---

## 4. The 5-Atom Crystal Atom Architecture (the thesis)

Every Crystal Atom is verbatim AISP per `bar181/aisp-open-core ai_guide` — Ω (Objective) Σ (Structure) Γ (Grounding) Λ (Logistics) Ε (Evaluation). Each Σ is **calibrated to its purpose**: smaller surface = lower hallucination = lower confidence threshold needed.

| # | Atom | ADR | Phase | Σ scope | Threshold |
|---|---|---|---|---|---:|
| 1 | **PATCH_ATOM** | 045 | P18 | full JSON-Patch envelope | n/a (validator) |
| 2 | **INTENT_ATOM** | 053 | P26 | verb + target + params | 0.85 |
| 3 | **SELECTION_ATOM** | 057 | P28 | templateId + confidence + rationale | 0.7 |
| 4 | **CONTENT_ATOM** | 060 | P31 | text + tone + length | 0.7 |
| 5 | **ASSUMPTIONS_ATOM** | 064 | P35 | up to 3 ranked clarifications | 0.7 |

**P37 (ADR-066)** adds an upstream gate before INTENT_ATOM: `parseCommand()` runs first; matched slash forms (`/browse`, `/template <name>`, `/generate`, `/design`, `/content`) bypass all 5 atoms entirely. **The cheapest LLM call is the one you don't make.**

**Sprint H Λ extensions (additive — Σ width unchanged on every atom):**

- **CONTENT_ATOM Λ.brand_voice** (P44 / ADR-067) — optional `{present, profile≤4096, bias{tone_preference?, lexicon_hints?≤512}}`. When present, the system prompt includes a 4 KB brand-voice block. Σ output contract identical to P31; Ε V5 re-asserts tone enum on brand-active runs.
- **INTENT_ATOM Λ.project_context** (P45 / ADR-068) — optional `{present, project_type∈{saas-app,landing-page,static-site,portfolio,unknown}}` from the codebase manifest. Drives `PROJECT_TYPE_TARGET_BIAS` re-ordering of candidate `target.type`s (subset of `ALLOWED_TARGET_TYPES` — never invents a new target).

---

## 5. File-System Map (DDD Bounded Contexts)

Per ADR-054. Each context owns its data and exposes a thin barrel.

```
src/
├─ contexts/
│  ├─ configuration/        — MasterConfig schema, Zod parsers
│  ├─ persistence/          — sql.js + IndexedDB; migrations + repositories + exportImport
│  │   └─ migrations/       — 000-init / 001-example-prompts / 002-llm-logs / 003-user-templates
│  │   └─ repositories/     — projects / sessions / messages / kv / examplePrompts / llmCalls / llmLogs / userTemplates / brandContext (P44) / codebaseContext (P45)
│  ├─ intelligence/         — LLM adapters + AISP atoms + chat pipeline
│  │   ├─ aisp/             — 5 Crystal Atoms + classifiers + assumptions store
│  │   ├─ commands/         — parseCommand (P37; ADR-066)
│  │   ├─ llm/              — adapters (claude/gemini/openai/openrouter/simulated/mock) + auditedComplete + cost.ts
│  │   ├─ prompts/          — system prompt (PATCH_ATOM; ADR-045)
│  │   ├─ stt/              — Web Speech wrapper (ADR-048)
│  │   └─ templates/        — registry + library + router + scoping + intent translator
│  ├─ specification/        — AISP spec exporter + diff
│  └─ ui-shell/             — (boundary doc only; UI lives under components/)
├─ components/
│  ├─ shell/                — ChatInput, AISPTranslationPanel, AISPSurface, ClarificationPanel, TemplateBrowsePicker, AISPPipelineTracePane
│  ├─ left-panel/           — LeftPanel, ListenTab + listen/ helpers + review cards
│  ├─ center-panel/         — preview, blueprints, resources, data, pipeline tabs
│  ├─ right-panel/          — settings, history
│  └─ settings/             — LLMSettings (BYOK) + BrandContextUpload (P44) + CodebaseContextUpload (P45) + ReferenceManagement (P46)
├─ lib/                     — cn, schemas (re-exports), cannedChat, mapChatError, sentry-shim
├─ store/                   — zustand stores (configStore, intelligenceStore, listenStore, projectStore, uiStore)
└─ data/                    — examples, fixtures, sequences
```

---

## 6. Standard Phase Process (CLAUDE.md mandates)

Every phase, in order:

1. **Phase execution** — code/docs per the phase plan
2. **End-of-phase** — `08-master-checklist.md` ticks + `STATE.md` row + `phase-N/session-log.md` + `phase-N/retrospective.md`
3. **Review with fixes** — post-seal review pass; must-fix items closed in `fix-pass-N` commits before next phase
4. **Preflight for next phase** — `phase-(N+1)/preflight/00-summary.md`

**Optional EXTRA for major phases:**
5. **Deep-dive brutal review** — 4 parallel reviewer perspectives (UX / Functionality / Security / Architecture); ≤600 LOC chunks; recursive ≤3 passes
6. **Persona re-score** — Grandma / Framer / Capstone scored against the rubric

Steps 1-4 are non-negotiable. Steps 5-6 decided per-phase. **P37 will run lean (1-reviewer combined UX+Func+Sec+Arch) due to recent stream-timeout instability.**

---

## 7. Testing Pattern (PURE-UNIT)

Every Sprint D-F test follows the same shape:
- No browser bootstrap (avoid Vite `import.meta.glob` in migrations runner)
- No `sql.js` boot (FS-level reads via `readFileSync` for source-level assertions)
- No live LLM calls (assertions on validators / adapter contracts / output Σ)
- Hardcoded constants in tests when import path would transitively pull `default-config.json`

**Cumulative count:** P29-P46 PURE-UNIT GREEN (Sprint H adds p44 brand-upload, p45 codebase-ref, p46 reference-management spec files; pattern unchanged).

Run regression:
```bash
npx playwright test tests/byok-providers.spec.ts tests/p29*.spec.ts tests/p30*.spec.ts tests/p31*.spec.ts tests/p32*.spec.ts tests/p33*.spec.ts tests/p34*.spec.ts tests/p35*.spec.ts tests/p36*.spec.ts tests/p37*.spec.ts tests/p44*.spec.ts tests/p45*.spec.ts tests/p46*.spec.ts
```

---

## 8. BYOK Provider Matrix (P35)

User picks a provider; the adapter chooses the cheap-and-fast default model automatically. **Models are NOT user-selectable** — keeps the menu clean and costs predictable.

| Provider | Default Model | Cost (in/out per 1M) | SDK |
|---|---|---:|---|
| Anthropic | `claude-haiku-4-5-20251001` | $1.00 / $5.00 | `@anthropic-ai/sdk` |
| Google | `gemini-2.5-flash` | $0.30 / $2.50 | `@google/genai` |
| OpenAI | `gpt-5-nano` | $0.05 / $0.40 | `openai` |
| OpenRouter | `mistralai/mistral-7b-instruct:free` | $0 / $0 | native fetch |
| Simulated | (canned) | $0 | — |
| Mock | (DB fixtures) | $0 | — |

All 4 paid adapters honor `req.signal` for AbortSignal cancellation. Errors funnel through `redactKeyShapes` (covers `sk-ant-` / `sk-proj-` / `sk-or-` / bare `sk-` / `AIza` / `Bearer …`) before any persistence.

---

## 9. Database (sql.js + IndexedDB)

**Single `.heybradley` SQLite DB**, browser-side, persisted to IndexedDB. Schema version target: **4** (all 4 migrations applied → `schema_version = 4`).

| Migration | Adds | Sentinel-tested |
|---|---|---|
| `000-init.sql` | `kv`, `schema_version`, `projects`, `sessions`, `chat_messages`, `listen_transcripts`, `llm_calls` | ✅ |
| `001-example-prompts.sql` | `example_prompts` (golden corpus) + `example_prompt_runs` (P28 C15 import-lock) | ✅ |
| `002-llm-logs.sql` | `llm_logs` (audit + ruvector deltas D1/D2/D3); `SENSITIVE_TABLE_OPS` truncates on export | ✅ |
| `003-user-templates.sql` | `user_templates` (P30 ADR-059); CHECK enums on category + kind; opt-in export | ✅ |

**See `src/contexts/persistence/migrations/README.md`** for canonical catalog + backup procedure + future-migration template. **Sprint F P38 may add migration 004 if persistent command-trigger audit lands; not committed yet.**

---

## 10. ADR Index (key references)

Full ADR set in `docs/adr/`. Most-cited in this sprint:

- **ADR-040** — Local SQLite persistence (P16)
- **ADR-040b** — sql.js FK deferral (P28; rationale-backed)
- **ADR-042** — LLM provider abstraction (P17)
- **ADR-043** — BYOK key trust boundaries (P17)
- **ADR-045** — System prompt = PATCH_ATOM (P18)
- **ADR-050** — Template-First Chat Architecture (P23)
- **ADR-053** — INTENT_ATOM (P26)
- **ADR-057** — SELECTION_ATOM + 2-step pipeline (P28)
- **ADR-058** — Template Library API (P29)
- **ADR-059** — Template Persistence (P30)
- **ADR-060** — CONTENT_ATOM (P31)
- **ADR-063** — Assumptions Engine + ClarificationPanel (P34)
- **ADR-064** — ASSUMPTIONS_ATOM + LLM lift (P35)
- **ADR-065** — Listen + AISP unification (P36)
- **ADR-066** — Command system + content/design route split (P37)
- **ADR-067** — Brand Context Upload (P44; CONTENT_ATOM Λ.brand_voice)
- **ADR-068** — Codebase Reference Ingestion (P45; INTENT_ATOM Λ.project_context + bias table)
- **ADR-069** — Context Management UI (P46; ReferenceManagement panel)

---

## 11. Cost-Cap & Audit Discipline

**Two-tier cost gate:**
1. **Soft gate (per-atom):** `assumptionsLLM` checks `sessionUsd >= cap × 0.65` before firing — falls closed to rule-based
2. **Hard gate (auditedComplete):** rejects when `sessionUsd + projected >= cap`

Every LLM call writes one `llm_logs` row at insertion + one update on completion. Schema fields: `request_id`, `parent_request_id`, `prompt_hash` (SHA-256), `provider`, `model`, `input_tokens`, `output_tokens`, `cost_usd`, `latency_ms`, `status`. **30-day auto-prune at `initDB`.** **10K LRU cap on the table** (P23 C18).

---

## 12. Carryforward Debt

All P36 carryforward items closed at P37 seal (R2 S3 ListenTab split shipped 947→84 LOC; R1 L3 + R2 S1/S2/S4/S5 closed in fix-pass). Sprint H end-of-sprint review surfaced 5 must-fix items, all closed in this fix-pass — no carryforward debt entering the next phase.

---

## 13. Where Next

Sprint H sealed; the platform now ingests both **brand voice** and **project context** without expanding any Σ. INTENT_ATOM bias table re-orders ALLOWED_TARGET_TYPES candidates against the project type (never invents). Brand voice flows through CONTENT_ATOM Λ.brand_voice into the system prompt, surfaced in the SIMPLE panel via `aisp-brand-voice-chip` (with "(unused this turn)" annotation on design-only routes per the P46 fix-pass).

Outstanding owner-triggered items: Vercel deploy + live BYOK validation; presentation rehearsal (`docs/wiki/presentation-readiness.md`).

**KISS. Single tool calls. Commit between milestones.** AgentProxyAdapter / FixtureAdapter remains the test backbone — $0 cost, no real keys.

---

*This document is updated at each phase seal. Companion: `docs/wiki/llm-call-process-flow.md` (how the pipeline actually runs).*
