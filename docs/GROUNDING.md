# Hey Bradley — Project Grounding

> **Purpose:** A single document anyone (new contributor, future Claude session, presentation reviewer) can read in 10 minutes to understand the project, where we are in the sprint, and what to do next.
> **Last updated:** 2026-04-28 (mid-Sprint F P37, pre-seal)
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

**Sprint F P2 (Phase 37) — mid-flight, pre-seal.**

| | Status |
|---|---|
| Composite trajectory | 88 → 89 → 90 → 93 → 95 → 96 → 96 (P36 sealed) → **P37 pending** |
| Last sealed phase | **P36** (Sprint F P1 — Listen + AISP Unification) — commit `5f0a84c` |
| Last test count | 344/344 PURE-UNIT GREEN (after P37 Wave 1 integration) |
| Last brutal review | P36: R1 UX+Func 92, R2 Sec+Arch 87 (5 should-fix queued for P37) |
| Outstanding hard-block carryforward | **R2 S3:** ListenTab.tsx is ~875 LOC vs CLAUDE.md 500-LOC hard cap. **Must clear before P37 seal.** |
| Presentation | ~2-3 days out at current velocity. Vercel deploy still owner-triggered. |

**P37 Wave 1 is on disk but not yet committed:**
- `src/contexts/intelligence/commands/commandTriggers.ts` (+ 36 tests) — A1
- `src/contexts/intelligence/aisp/routeClassifier.ts` (+ 25 tests) — A2
- `docs/adr/ADR-066-command-system-and-route-split.md` (+ 14 bridge tests) — A3 (committed `dcb98e5`)
- ChatInput / ListenTab / aisp barrel / chatPipeline — modified, uncommitted

---

## 3. Sprint F at a glance (3 phases, compressed from 4)

| Phase | Title | Status | Composite | Notes |
|---|---|---|---:|---|
| **P36** | Sprint F P1 — Listen + AISP Unification | ✅ SEALED | 96 | Review-first voice UX; ADR-065 |
| **P37** | Sprint F P2 — Command Triggers + Content/Design Route Split | ⏳ Wave 1 done; review pending | — | ADR-066 |
| **P38** | Sprint F P3 — TBD per owner mandate | 📋 PLANNED | — | Likely sprint-close brutal review + presentation prep |

### Remaining work for P37 (in order)

1. ✅ Wave 1 deliverables on disk (parseCommand + classifyRoute + ADR-066 + tests)
2. ✅ Full P29-P37 regression: **344/344 GREEN**
3. ⏳ Commit Wave 1 (single commit; A1 + A2 sources + barrel + ChatInput + ListenTab + chatPipeline + p34-wave1 source-pin update)
4. ⏳ Push to `claude/verify-flywheel-init-qlIBr`
5. ⏳ **R2 S3 fix:** ListenTab split from ~875 LOC → <500 LOC (extract `useListenPipeline` hook covering review/clarification/handlers state)
6. ⏳ Brutal-honest review (lean: 1 reviewer agent, ≤200 LOC report)
7. ⏳ Fix-pass for any must-fix items (target Grandma ≥80, composite ≥96)
8. ⏳ P37 seal artifacts (session-log + retrospective + STATE row + CLAUDE roadmap update + P38 preflight)
9. ⏳ Final P37 commit + push

### Remaining work for Sprint F (P38)

P38 candidates per owner mandate:
- **Sprint F close brutal-honest review** — full UX + Functionality + Security + Architecture pass on cumulative P34-P37 work; persona re-walk
- **Presentation readiness gate** — single read-only audit producing the demo flow / strongest features / gap mitigation report (already drafted at P36; refresh post-P37)
- **Vercel deploy + live BYOK validation** — owner-triggered; pair with the deploy
- **Wiki 2 (Developers)** — deferred from this session; agentic-developer-targeted explainer

**Sprint F seal criteria:** 4 reviewers PASS, all must-fix closed, persona re-score completed, Vercel deploy live, ≥33/35 prompt coverage, presentation rehearsal complete.

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

---

## 5. File-System Map (DDD Bounded Contexts)

Per ADR-054. Each context owns its data and exposes a thin barrel.

```
src/
├─ contexts/
│  ├─ configuration/        — MasterConfig schema, Zod parsers
│  ├─ persistence/          — sql.js + IndexedDB; migrations + repositories + exportImport
│  │   └─ migrations/       — 000-init / 001-example-prompts / 002-llm-logs / 003-user-templates
│  │   └─ repositories/     — projects / sessions / messages / kv / examplePrompts / llmCalls / llmLogs / userTemplates
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
│  └─ settings/             — LLMSettings (BYOK)
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

**Cumulative count:** 344 PURE-UNIT cases / 19 spec files / first-pass green / zero browser flake (P29 → P37).

Run regression:
```bash
npx playwright test tests/byok-providers.spec.ts tests/p29*.spec.ts tests/p30*.spec.ts tests/p31*.spec.ts tests/p32*.spec.ts tests/p33*.spec.ts tests/p34*.spec.ts tests/p35*.spec.ts tests/p36*.spec.ts tests/p37*.spec.ts
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

---

## 11. Cost-Cap & Audit Discipline

**Two-tier cost gate:**
1. **Soft gate (per-atom):** `assumptionsLLM` checks `sessionUsd >= cap × 0.65` before firing — falls closed to rule-based
2. **Hard gate (auditedComplete):** rejects when `sessionUsd + projected >= cap`

Every LLM call writes one `llm_logs` row at insertion + one update on completion. Schema fields: `request_id`, `parent_request_id`, `prompt_hash` (SHA-256), `provider`, `model`, `input_tokens`, `output_tokens`, `cost_usd`, `latency_ms`, `status`. **30-day auto-prune at `initDB`.** **10K LRU cap on the table** (P23 C18).

---

## 12. Carryforward Debt (must-clear before P37 seal)

| # | Item | Source | Severity |
|---|---|---|---|
| **R2 S3** | ListenTab.tsx ~875 LOC → split to <500 LOC | P36 review | **HARD-BLOCK** |
| R1 L3 | Clarification fallthrough silent when LLM returns 0 assumptions | P36 review | should-fix |
| R2 S1 | `pendingChatPrefill` envelope hardening (length/scope) | P36 review | should-fix |
| R2 S2 | Listen-write redaction symmetry (BYOK leak guard) | P36 review | should-fix |
| R2 S4 | `pendingChatPrefill` global vs directed-message refactor | P36 review | should-fix |
| R2 S5 | ADR-065 "every AISP surface" claim re: P35 EXPERT trace pane | P36 review | doc-fix |

**Recommended P37 seal sequence:**
1. Commit Wave 1 (parseCommand + classifyRoute + ADR + tests + integration edits)
2. Tackle R2 S3 (ListenTab split)
3. Lean brutal review
4. Fix-pass any new must-fix items
5. Seal + presentation gate

---

## 13. The Goal Tonight

**Understand the sprint, then implement.**

We are 1.5 phases away from sprint close. The 344 GREEN regression confirms structural soundness. The work remaining is **discipline**, not invention: commit what's on disk, fix the LOC overrun, run a tight review, seal cleanly, then run the presentation gate.

**KISS. Single tool calls. Commit between milestones.** The LLM provider has been intermittently unstable today — every artifact must survive a stream timeout.

---

*This document is updated at each phase seal. Companion: `docs/wiki/llm-call-process-flow.md` (how the pipeline actually runs).*
