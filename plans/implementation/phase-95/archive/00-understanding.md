# P95 / Planning Sprint A1 — Understanding + Research

> **Phase:** P95 · **Sprint:** Planning Wave 1 · **Agent:** A1 (understanding + research)
> **Date:** 2026-05-02 · **READ-ONLY** doc artifact (no source / test / ADR / CLAUDE.md edits).
> **Owned file:** `plans/implementation/phase-95/00-understanding.md`
> **Sibling chain:** A2 Decomposition · A3 DDD+ADR · A4 Process+AISP+Swarm · A5 Closer.

---

## §1 Methodology

- **Sources read (12 categories, 17 files):** 8 Crystal Atom modules (`intentAtom.ts`, `assumptionsAtom.ts`, `templateSelector.ts`, `contentAtom.ts`, `applyPatches.ts`, `decompAtom.ts`, `processAtom.ts`, `dddAtom.ts`, `agentAtom.ts`); 5 ADRs (116-120); 2 P100 planning docs (`milestone-plan.md`, `log-design.md`); 3 mode surfaces (`Planning.tsx`, `Agentics.tsx`, `AppShell.tsx`); routing (`main.tsx`); state (`uiStore.ts`); ConversationLogTab; pageIterator wiring; BYOK key handling; AISPDeveloperCard; auditedComplete request mint.
- **Honest-inventory discipline:** Every "exists today" claim in §2 carries a `file:line` citation. Anything not citable becomes either a §6 owner question or §5 risk. No claim repeated from `CLAUDE.md` headline-stats without re-verifying against source.
- **Owner-question framing:** Items where two-or-more reasonable directions exist with no on-disk decision evidence ⇒ §6 question with options + recommendation. "I don't know" never papered over.

---

## §2 What exists today — honest inventory

### A. AISP Atoms (8/8 expected — suite COMPLETE per ADR-120)

| Atom | File | Crystal-Atom const | Output type | Live wiring | Consumer | Known gaps |
|---|---|---|---|---|---|---|
| INTENT_ATOM | `src/contexts/intelligence/aisp/intentAtom.ts:17` | `INTENT_ATOM` | `ClassifiedIntent {verb, target, params, confidence, rationale}` (`:147`) | `intentClassifier.ts:127` (rules) + `llmClassifier.ts:42` (LLM fallback); fired at `chatPipeline.ts:~360` per log-design §2 stage 3-4 | matcher / DECOMP / route classify | LLM-classified intent dropped when below threshold (`llmClassifier.ts:69`); only rules result survives (log-design §6 finding 4). |
| ASSUMPTIONS_ATOM | `src/contexts/intelligence/aisp/assumptionsAtom.ts:24` | `ASSUMPTIONS_ATOM` | `AssumptionAtomItem[]` (`:77`); validator at `:91` | `assumptionsLLM.ts` (LLM) + `assumptions.ts` (rules baseline P34) | UI clarification card (Listen + chat); fires when INTENT confidence < 0.7 | matcher per-layer alternatives never feed into ASSUMPTIONS even though `templateMatcher.ts` carries top-3 (log-design §6 finding 2). |
| SELECTION_ATOM | `src/contexts/intelligence/aisp/templateSelector.ts:22` | `SELECTION_ATOM` (Σ-restricted) | `TemplateSelection {templateId, confidence, rationale}` (`:41`) | `selectTemplate()` (`:72`) — LLM only; falls through to P23/P24 rules on null | 2-step pipeline (`twoStepPipeline.ts`) | Cap-skip when `sessionUsd ≥ capUsd × 0.75` (`:81`); no rules fallback inside the atom itself. |
| CONTENT_ATOM | `src/contexts/intelligence/aisp/contentAtom.ts:33` | `CONTENT_ATOM` | `GeneratedContent {text, tone, length, confidence, rationale}` (`:96`); validator at `:152` | `contentGenerator.ts:generateContent` (LLM with brand-voice channel per ADR-067) | generator templates (`kind='generator'`) | Brand-voice profile is caller-opaque (4096 char cap `:135`); per-render variants not persisted. |
| PATCH_ATOM | `src/contexts/intelligence/applyPatches.ts:16` (live applier); Crystal Atom verbatim lives in `prompts/system.ts` per `intentAtom.ts:9` comment | `PATCH_ATOM` (in `prompts/system.ts`) | `JSONPatch[]` mutations | `applyPatches(json, patches)` invoked at `chatPipeline.ts:237/416/452/492/580` (log-design §2 stage 12) | configStore | Per-patch trace not persisted; only resulting config survives via kv mirror (log-design §5). |
| DECOMP_ATOM | `src/contexts/intelligence/aisp/decompAtom.ts:25` | `DECOMP_ATOM` | `DecompAtomResult {todos[], source, confidence}` (`:93`) | `decompose()` (`:237`) at `chatPipeline.ts:~395` (per log-design stage 7) | `todoExecutor.ts:131` → matcher → applier | Per-todo execution status only DEV-warned on throw, not persisted on success (log-design §6 finding 1). |
| PROCESS_ATOM | `src/contexts/intelligence/aisp/processAtom.ts:40` | `PROCESS_ATOM` | `ProcessAtomOutput {phases, sprints, waves, agents, rationale}` (`:65`) | `classifyProcess()` (`:107`) invoked at `PlanningChatBar.tsx:26`; `toProcessMap()` adapter feeds `ProcessMapSVG` | `Planning.tsx:60 useState liveMap` (lost on reload) | Sprint+wave+agent records produced but only phase-level rendered (ADR-118 D4); no SQLite persistence (log-design §6 finding 3). |
| DDD_ATOM | `src/contexts/intelligence/aisp/dddAtom.ts:15` | `DDD_ATOM` | `DDDAtomOutput {contexts, relationships, rationale}` (`:53`); `DomainModel` adapter type at `:59` | `classifyContexts()` (`:127`) invoked at `Planning.tsx:95 handleRawText`; `toDomainModel()` feeds `DomainModelSVG` | `Planning.tsx:62 useState liveDomainModel` (lost on reload) | `relatedPhaseIds` not auto-bridged to PROCESS phase ids; rules-only baseline; transient (log-design §6 finding 3). |
| AGENT_ATOM | `src/contexts/intelligence/aisp/agentAtom.ts:49` | `AGENT_ATOM` | `AgentAtomOutput {waveId, agents: AgentSpec[], rationale}` (`:42`) | `classifyAgents()` defined; rules-only baseline; `buildAgentAtom`/`parseAgentResponse` scaffolded inert per ADR-120 D3 | NONE — landed P94 with no UI / pipeline wiring; consumers are P95 SpecWorkbench + P96 Export (ADR-120 D4) | Zero call site in app source today; ownedFiles disjoint invariant unenforced at runtime (Γ R3 lives in classifyAgents output, not validated cross-wave). |

**Atom suite count: 8/8.** AGENT_ATOM is the most fragile — module exists with zero consumers in `src/`. P95 SpecWorkbench is the first consumer.

### B. Three-mode product (per ADR-116)

- **Whiteboard mode** — route `/` (`main.tsx:71`); AppShell branch default fall-through (`AppShell.tsx:13-21` — anything not `/planning` / `/agentics` is `whiteboard`); behavior is the v1.0.0-RC1 builder UI byte-equivalent. AISP visibility hidden behind collapsible trace per ADR-116 D5.
- **Planning mode** — route `/planning` (`main.tsx:88`, lazy at `:36`); AppShell branch `planning` (`AppShell.tsx:65-67`, testid `appshell-mode-planning`). Wired today: 3-pane layout (project list left / process map OR domain model center / node detail right) at `Planning.tsx:99-235`. PlanningChatBar (`Planning.tsx:126`) drives both PROCESS_ATOM (`handleProcessMapChange` `:87`) and DDD_ATOM (`handleRawText` `:94`) in parallel from one submit. View toggle (`PlanningViewToggle` `:109`) swaps `process-map` ↔ `domain-model`. Both atoms' outputs are component `useState` — lost on reload.
- **Agentics mode** — route `/agentics` (`main.tsx:89`); AppShell branch `agentics` (`AppShell.tsx:83-85`). Today is a P90 stub at `Agentics.tsx:14-51` — header + roadmap list (P92-P100 bullet points) + `AISPDeveloperCard` mount (`:39`; dismissable via localStorage `hb-aisp-card-dismissed-v1` per `AISPDeveloperCard.tsx:18`) + back-home link. NO functional body: no PROCESS / DDD / AGENT viewer; no SpecWorkbench; no Export. The "Coming soon · P92-P100" badge (`Agentics.tsx:19`) is not yet retired even though P92-P94 sealed.

### C. Process map + Domain model rendering

- **ProcessMapSVG** — `src/components/planning/ProcessMapSVG.tsx` (per ADR-117 D1, ~220 LOC). Accepts `ProcessMap = { nodes: ProcessNode[], edges: ProcessEdge[], activeNodeId? }`. Status enum `planned | in-flight | sealed | deferred`; edge type `sequential | parallel | gate`; shape `rect | diamond`. Click + Enter/Space → `onNodeSelect(nodeId)`. Consumer: `Planning.tsx:168` (renders `liveMap ?? HEY_BRADLEY_SAMPLE_MAP`).
- **DomainModelSVG** — `src/components/planning/DomainModelSVG.tsx` per ADR-119 acceptance gate (~217 LOC). Accepts `DomainModel = { contexts: BoundedContext[], relationships: ContextRelationship[] }`. 4 relationship kinds (partnership solid / customer-supplier solid+arrow / conformist dashed / anti-corruption-layer double-line). Click → `onContextSelect`. Consumer: `Planning.tsx:175` (renders `liveDomainModel`; empty state at `:178` when null).
- **PlanningViewToggle** — `src/components/planning/PlanningViewToggle.tsx`; 2-tab toggle (`process-map` | `domain-model`) per ADR-119 D4. Wired at `Planning.tsx:109` (header) + `:64 const [view, setView] = useState<PlanningView>('process-map')`.

### D. Persistence

- **Local sql.js** — 5 migrations on disk: `000-init.sql` (sessions/projects/messages base), `001-example-prompts.sql`, `002-llm-logs.sql`, `003-user-templates.sql`, `004-prompt-library.sql`. 13 repos: `brandContext.ts`, `codebaseContext.ts`, `examplePrompts.ts`, `kv.ts`, `llmCalls.ts`, `llmLogs.ts`, `messages.ts`, `projects.ts`, `promptLibrary.ts`, `sessions.ts`, `userTemplates.ts` (+ `index.ts`). NO migration for atom outputs (PROCESS / DDD / AGENT) — confirmed by log-design §6 finding 3.
- **BYOK key handling** — `src/contexts/intelligence/llm/keys.ts` is the SOLE writer to `kv['byok_key']` + `kv['byok_provider']` (`:11-12`). API: `readBYOK()` (`:23`), `writeBYOK(entry, {remember})` (`:33`), `clearBYOK()` (`:47`), `hasBYOK()` (`:55`). Per ADR-043 + ADR-114 D3 trust-boundary: keys NEVER cross to Supabase; opt-in `remember: true` writes to local kv only. Memory-first read.
- **Multi-page state** — `uiStore.ts:182 activePageId: string | null` + `:244 setActivePageId(id)` + `:313` setter (no-op when unchanged). `pageIterator.ts:getActivePage(config, activePageId)` consumed at `chatPipeline.ts:291` (single read at submit-entry); `prefixPatchPaths(patches, scopeRoot)` invoked before `applyPatches`. Page-aware override path at `chatPipeline.ts:361-366` (INTENT.target.pageId → re-resolve scope). Per-todo `targetPage` honored at `:407` for DECOMP fan-out.

### E. ConversationLogTab + log infrastructure

- **ConversationLogTab current state** — `src/components/center-canvas/ConversationLogTab.tsx` (245 LOC). Renders sessions × turns from `loadConversationLog(filter)` (`:64`) joining `chat_messages + llm_logs` via `conversationLogExport.ts`. Filters: session/provider/personality/date (`:114-150`). Per-row toggle highlight↔full (`:191`). Soft-typed reads via `tAny` cast (`:172`) for `latency_ms`, `aisp_atoms[]`, `todoTraces[]`, `decompStatus`. Two export buttons: MD + JSON (`:93-110`; downloads via Blob at `:28`). Defence-in-depth `redactKeyShapes` on every rendered string.
- **Log persistence today** — Per log-design §2 (12 stages enumerated): only `llm_logs` (`auditedComplete.ts:169-185`) + `llm_calls` (`:230-238`) + `listen_transcripts` (`useListenPipeline.ts:165`) write to SQLite. Every other stage is logically anonymous: 7 silently-discarded data findings (log-design §6 — DECOMP per-todo statuses, template matcher alternatives, PROCESS+DDD outputs, LLM-classified intent below threshold, route classification rationale, personality variants for inactive personas, `recordPipelineFailure` orphans on root-level throws).
- **Request linking** — Today only `llm_logs.request_id` exists (`auditedComplete.ts:165`); minted ONLY when the request reaches the LLM. Non-LLM short-circuits (DECOMP-only, template-match-only, canned fallback) emit zero rows that share an id (log-design §4).

---

## §3 What P95-P104 needs to deliver

Per `phase-100/milestone-plan.md` §2, restated with explicit acceptance criteria:

- **P95 SpecWorkbench (AISP + human-spec dual-view)** — Planning-mode tab rendering all 8 atoms as one composite spec; left = AISP Σ/Ω/Γ, right = human prose. ADR-121. **Accept:** read-only render of PROCESS+DDD+AGENT outputs from `Planning.tsx liveMap/liveDomainModel/liveAgents`; KISS — zero `classify*` import (atoms stay owned by their modules); ≥15 tests; ADR cross-refs ADR-110 dual-view.
- **P96 Export Claude Code (CLAUDE.md + swarm + ADR bundle)** — "Export" button on SpecWorkbench → ZIP with auto-generated CLAUDE.md (project intro + atoms summary), swarm dispatch JSON (one entry per `AgentSpec`), stub ADR scaffold. ADR-122. **Accept:** golden-file test against `examples/3rd-party-consumer/` polyglot reference; round-trippable into a target repo (5-line "hello world" agent dispatches without manual edit).
- **P97 TDD Scaffold Generator (test spec from AISP)** — From AISP Γ rules per atom, auto-emit Playwright test scaffold (one describe block per Γ rule). ADR-123. **Accept:** scaffold writes ONLY to `tests/scaffold/` namespace (CI gate excludes); per-atom DoD bullets become test names; ≥1 scaffold per atom.
- **P98 KISS + Review Pattern (automated reviewer generator)** — Reviewer template generator: given an `AgentSpec`, emit a brutal-honest review prompt scoped to its `ownedFiles + dod`. Powers post-seal review per CLAUDE.md "Standard Phase Process" §3. ADR-124. **Accept:** reviewer output schema-validated; prompt-injection guarded via Σ contract scoping; surfaces findings to a defined channel (see §6 Q3).
- **P99 Seal Panel (DoD + session log + retro UI)** — Agentics-mode tab rendering CLAUDE.md "Standard Phase Process" steps 2-4 as a checklist UI. Owner ticks DoD; auto-generates `phase-N/session-log.md` + `retrospective.md` stubs. ADR-125. **Accept:** template emitter `existsSync`-guards (append-only — never overwrites existing session-log files); checklist rows derive from `AgentSpec.dod`; markdown output diffable.
- **P100 Wave 2 Log build (SQLite migrations + repos + pipeline wiring + drill-down)** — 5 new additive migrations (`005-request-envelopes.sql` … `009-atom-outputs.sql` per log-design §9); request_envelope/stage_event repos; pipeline wiring in `chatPipeline.ts`; ConversationLogTab drill-down per request_id. ADR-126. **Accept:** additive-only migrations (no `ALTER` on existing tables); existing-state round-trip test; drill-down renders 11 categories.
- **P101 Agentic Workbench RC** — Full system seal of Whiteboard + Planning + Agentics modes. ADR-127. **Accept:** 4-reviewer brutal-honest pass (UX / Functionality / Security / Architecture; ≤600 LOC per file; ≤3 recursive must-fix passes); composite ≥ ADR-094 floor.
- **P102 Final QA + persona re-score** — Grandma / Framer / Capstone scored against rubric. ADR-128. **Accept:** composite ≥ SOTA 80; logged to `phase-102/personas.md`.
- **P103 v2.0.0 release artifacts** — CHANGELOG (P85→P104 history); release notes; Show HN; Product Hunt; demo script update; owner launch checklist v2. Mirrors P84 / OC-18. ADR-129. **Accept:** all 6 launch artifacts on disk; demo-script ≤180 LOC.
- **P104 v2.0.0-RC1 public launch** — Tag + Show HN/PH/Reddit/LinkedIn/Twitter-X posts; Agentics Foundation beta dispatch (20-50 users); AISP campaign. **Accept:** owner-led; Claude-side limited to final CLAUDE.md sync + retro.

---

## §4 Dependencies between phases

**Hard dependencies (must seal in order):**

- P95 ← P94 (AGENT_ATOM types `AgentSpec` / `AgentAtomOutput` must be importable from `agentAtom.ts:31/42`).
- P96 ← P95 (Export reads SpecWorkbench composite); P96 ← P94 (`AgentSpec` is the per-agent prompt unit).
- P97 ← P94 (DoD checklist drives test bullets).
- P98 ← P94 (`AgentSpec` is the reviewer scoping unit).
- P99 ← P94 (`AgentSpec.dod` drives Seal Panel checklist rows).
- P100 Wave 2 ← P100 Wave 1 (this design doc + milestone-plan must be ratified by owner).
- P101 ← {P95 ∧ P96 ∧ P97 ∧ P98 ∧ P99 ∧ P100/W2} all sealed (RC requires every body sprint + log infra).
- P102 ← P101 sealed.
- P103 ← P102 personas ≥ SOTA 80.
- P104 ← P103 sealed.

**Critical-path chain (RC blocker):** P94 → P95 → P96 → P101 → P102 → P103 → P104 (7 phases, per milestone-plan §3).

**Soft dependencies (benefit but not block):**

- P98 KISS Reviewer benefits from P96 Export (reviewer can attach to exported bundles) but ships standalone if P96 slips.
- P99 Seal Panel benefits from P100 Wave 2 log infra (ticking DoD writes to log) but can render markdown-only without log writes.
- P97 TDD Scaffold benefits from P95 SpecWorkbench (re-uses composite) but generates from raw atoms if P95 slips.
- P100 Wave 2 entirely independent of P95-P99 critical path — can ship in any parallel batch.

---

## §5 Risks + unknowns

- **R1 (HIGH) — P95 SpecWorkbench scope creep.** "All 8 atoms in one UI" balloons into editing/re-classifying/multi-page composer. *Impact:* sets template for P96-P99; 60-90min phase becomes multi-session. *Mitigation:* explicit Σ contract — read-only render only; KISS denylist test forbids `classify*` imports in P95 source.
- **R2 (HIGH) — P96 Export Claude Code round-trip incorrectness.** Exported CLAUDE.md / swarm.json / ADR bundle is not Claude-Code-consumable; opening the zip fails to dispatch. *Impact:* user-visible deliverable that justifies the entire arc fails on demo. *Mitigation:* golden-file tests against `examples/3rd-party-consumer/` polyglot; sandbox stub-load 5-line "hello world" agent.
- **R3 (MED) — P100 Wave 2 SQLite migration breaks live kv-persisted store.** Adding `log_*` tables triggers re-migration that wipes user state (sessions / projects / pages / personality / `appMode`). *Impact:* open-core users lose state silently. *Mitigation:* `005-009` migrations are `CREATE TABLE IF NOT EXISTS` only — no `ALTER TABLE` on existing tables; pre-vs-post round-trip test on existing kv slots.
- **R4 (MED) — AGENT_ATOM rules-only baseline insufficient for real swarms.** ADR-120 D3 ships `classifyAgents` deterministic; LLM enrichment via `buildAgentAtom` is inert. P95 SpecWorkbench rendering rules-only output may look thin (1-2 generic agent recipes per wave). *Impact:* dual-view spec looks under-developed; persona scoring (P102) penalizes Agentics depth. *Mitigation:* expand `ROLE_RECIPES` table (`agentAtom.ts:76`) before P95 lands; document rules-only as expected open-core behavior with LLM-enrichment as Tier-2 deferral.
- **R5 (MED) — P101 RC composite regression below SOTA 80.** Capstone or Framer scores Agentic Workbench arc below v1.0.0-RC1 baseline. *Impact:* delays RC tag; forces P102b polish phase. *Mitigation:* P101 4-reviewer brutal pass catches drift first; pre-emptive polish woven into P95-P99; KISS denylist on every body sprint.
- **R6 (MED) — SpecWorkbench dual-view layout density on mobile.** ADR-110 dual-view in Planning mode + 8-atom render = vertical scroll death on 375px. *Impact:* Grandma persona scores Planning mode unusable on phone. *Mitigation:* see §6 Q1 — owner choice between side-by-side desktop / stacked mobile vs single-pane-with-toggle. Recommendation: mobile collapses to toggle; desktop side-by-side.
- **R7 (LOW) — Listen 3-stage capture rejected by P100 A1 audit but still surfaces in expectations.** log-design §7(a) confirms only 2 stages persist (cleaned only). If Wave 2 builds the listen-capture row with raw column, must clarify whether webSpeechAdapter actually starts emitting raw to disk or whether the column stays null at open-core. *Impact:* schema ambiguity. *Mitigation:* P100 Wave 2 spec must declare raw column nullable + populated only in dev mode.
- **R8 (LOW) — `recordPipelineFailure` orphans on non-LLM throws.** log-design §6 finding 7: errors from DECOMP throws (`chatPipeline.ts:434`) only DEV-warn; never join to a `request_id`. *Impact:* forensic drill-down (P100 W2 deliverable) cannot reconstruct non-LLM failures. *Mitigation:* P100 W2 must mint `request_id` at `chatPipeline.ts:271` (submit-entry), BEFORE any throw site.

---

## §6 Questions for owner

### Q1 — P95 SpecWorkbench dual-view layout
Per ADR-110 dual-view standard + ADR-116 D5 (Planning = dual-view spec-default-open), the 8-atom composite needs a layout decision. Options: **(A)** side-by-side desktop / stacked mobile (vertical scroll on 375px) — preserves dual-view always; **(B)** single-pane with toggle (AISP ↔ human) — smaller mobile footprint but loses simultaneity; **(C)** desktop side-by-side; mobile auto-collapses to toggle (responsive hybrid). **Recommendation: C** — preserves dual-view on the surface ADR-110 governs (desktop) while honoring ADR-090 mobile UX redesign discipline (single visible pane on phone).

### Q2 — P96 Export Claude Code output target
Owner intent for the export deliverable. Options: **(A)** ZIP download via Blob — matches existing `shareSpecBundle.ts` pattern from P78; **(B)** in-page render with copy-buttons per file — no download; **(C)** filesystem write to `dist/claude-code-bundle/` via download script. **Recommendation: A** — ZIP via Blob is consistent with already-shipped export modal (ADR-101); zero new infra; works in static-host context. (B can be a secondary affordance.)

### Q3 — P98 KISS Review surface for findings
Where do reviewer findings render? Options: **(A)** Streams into ConversationLogTab as a new turn role `reviewer` — user sees inline next to their request; **(B)** Dedicated panel in Agentics mode "Review" tab — separate from chat; **(C)** Chat reply from "Bradley-as-Reviewer" persona — uses existing personality engine. **Recommendation: B** — keeps reviewer findings persistent + discoverable in Agentics (where the developer audience lives) without polluting chat history. Persists naturally to P100 Wave 2 log infra.

### Q4 — P100 Wave 2 live data migration plan
Migrations 005-009 are additive; `004_*.sql` last shipped in v1.0.0-RC1. Options: **(A)** auto-migrate on next launch (additive only — no destructive ops); **(B)** opt-in via Settings toggle — user clicks "enable forensic logging"; **(C)** environment flag `VITE_LOG_FORENSIC=1` — opt-in via build only. **Recommendation: A** — additive `CREATE TABLE IF NOT EXISTS` is safe-by-construction (R3 mitigation); zero user-visible disruption; matches the "logs are infrastructure, not opt-in" spirit. Risk fully mitigated by additive constraint.

### Q5 — P101 Agentic Workbench RC rollout
RC tag = three modes all-on, OR feature-flagged Planning + Agentics for staged rollout? Options: **(A)** all-on at tag — ADR-116 already routes all three via `main.tsx:88-89`; **(B)** Planning + Agentics behind `VITE_AGENTIC_WORKBENCH=1` until Tier-2; **(C)** route present but UI hidden behind a Settings toggle (deep-link still works). **Recommendation: A** — ADR-116 already shipped routes; gating now would require ADR amendment + feature-flag plumbing not present in v1.0.0-RC1 (P89b correction stripped Supabase env-var infra). The whole P90-P100 arc is the open-core promise; gating it contradicts the moat narrative.

### Q6 — AGENT_ATOM rules-only depth before P95 lands
ADR-120 D3 ships `classifyAgents` as rules-based deterministic. Today `agentAtom.ts:76 ROLE_RECIPES` likely covers 1-2 role recipes (schema-design visible at `:77`). Options: **(A)** ship P95 with current recipe count; let SpecWorkbench surface "thin" output as honest baseline; **(B)** spawn P94b to expand recipes to ≥6 roles BEFORE P95 dispatches; **(C)** widen role inference in P95 itself (would violate KISS denylist from R1). **Recommendation: B** — small sub-phase preserves R1 mitigation while addressing R4 demo-quality risk; <30 min wall-clock.

### Q7 — Compute-all-5 personality variants (carry-forward from P100/A1 §7(e))
log-design §7(e) recommended compute-all on the basis that P100's "visible audit" goal benefits from all 5 personality variants per request. Owner gate before Wave 2 dispatch. Options: **(A)** compute-all (5 string concats per submit; cheap); **(B)** compute-once (active persona only — current behavior); **(C)** compute-on-demand from drill-down (lazy). **Recommendation: A** — matches the auditability narrative; cost is negligible; ConversationLogTab drill-down already has soft-read scaffolding (`tAny` casts `:172`) that would benefit.

---

## §7 Honest declarations

**Items DEFERRED to Tier-2 commercial (NOT v2.0.0-RC1 scope):**
- Live AgentProxy LLM runtime (per ADR-118/119/120 D3 — all three atoms scaffolded inert).
- HNSW vector activation (P70 audit confirmed both indexes show 0 vectors; manual snapshot only).
- Multi-tenant team workspaces + ACL (Supabase 5-table schema scaffolded P89; src/ stripped at P89b).
- Hosted share URLs (P89b boundary; ADR-114/115 retained as Tier-2 planning docs).
- ML-enriched atom classifiers via vector-DB lookup (PROCESS / DDD / AGENT all rules-only).
- Real-time multi-user / pan-zoom on process map / drag-rearrange phases (ADR-117/119 Tier-2).
- Cross-project context federation; sprint+wave+agent additional graph levels (ADR-118 D4).
- Native mobile apps; live LLM eval harness; localization; full WCAG 2.1 AAA.

**Items the swarm SKIPPED in prior dispatches that this planning pass surfaces:**
- PROCESS+DDD outputs not persisted (`Planning.tsx:60/62 useState` only — log-design §6 finding 3 + §7(d) CONFIRM).
- AGENT_ATOM has zero call sites in `src/` today (P94 atom landed; no consumer until P95).
- ConversationLogTab soft-reads (`tAny` cast at `:172`) for `latency_ms` / `aisp_atoms` / `todoTraces` are still un-typed; ConversationTurn widening was carry-forward at P74 close (not yet shipped).
- Listen 3-stage capture rejected by P100 A1 audit (only cleaned persists; raw never written; intent never linked back to transcript).
- `recordPipelineFailure` orphans on root-level throws (log-design §6 finding 7).
- Agentics mode "Coming soon · P92-P100" badge (`Agentics.tsx:19`) not retired even though P92-P94 sealed — stale UX copy.

---

## §8 Carry-forward to A2 (Decomposition)

What A2 needs from this doc to decompose P95-P104 into atomic tasks:

- **§3 phase deliverables** — one row per phase with explicit acceptance criteria; A2 splits each into agent-sized atomic tasks (target ≤2 hour wall-clock per agent per CLAUDE.md velocity rule). Critical path: P95 → P96 → P101 → P102 → P103 → P104.
- **§4 dependencies** — A2 marks parallel-vs-sequential per the 3 parallelism opportunities surfaced in `phase-100/milestone-plan.md` §4 (Triple A, Triple B, Pair C). Confirm: P97 + P98 + P99 + P100/W2 all parallel-batchable post-P94.
- **§6 unanswered questions** — A2 should NOT decompose P95 (Q1, Q6) or P96 (Q2) or P98 (Q3) or P100 W2 (Q4, Q7) or P101 (Q5) until owner answers. Q6 specifically gates whether to insert a P94b recipe-expansion sub-phase BEFORE P95 dispatches.
- **§5 risks** — A2 includes mitigation tasks: (R1) KISS denylist test in P95 spec; (R2) golden-file test in P96 spec; (R3) round-trip data test in P100 Wave 2 spec; (R4) recipe-expansion task gated by Q6; (R6) responsive layout test in P95 spec; (R8) request_id mint hoisted to `chatPipeline.ts:271` in P100 Wave 2 spec.
- **§7 honest declarations** — A2 carries the 6 swarm-skipped items as explicit task line-items, OR explicit defers with rationale (e.g., Agentics "Coming soon" badge retirement is a 1-line `Agentics.tsx` edit folded into P95 / P99 — owner choice).

A3 (DDD+ADR) reads §2 A-E inventory + §6 questions to draft ADR-121 (P95 SpecWorkbench architecture) including the Q1 layout decision and the dual-view-density boundary vs ADR-110.

A4 (Process Map + AISP Spec + Swarm Config) reads §3 + §4 critical path to author the P95-P104 process map (one phase per ProcessNode; sequential edges; gate diamonds at P101 + P102 + P103).

A5 (Closer) reads §7 honest declarations to draft retro entry "what we surfaced this planning pass that the previous swarm dispatch skipped".

---

# Report

Section LOC counts: §1≈8, §2≈55, §3≈22, §4≈23, §5≈18, §6≈30, §7≈19, §8≈14. Total ≈ 240 LOC ≤ 500 cap (whitespace + headers excluded; tables count toward §2).

Atoms inventoried: 8/8 (INTENT · ASSUMPTIONS · SELECTION · CONTENT · PATCH · DECOMP · PROCESS · DDD · AGENT — AISP suite COMPLETE per ADR-120 D1).

Owner-question count: 7 (≥5 floor satisfied; Q1 P95 layout / Q2 P96 export target / Q3 P98 review surface / Q4 P100 W2 migration plan / Q5 P101 RC rollout / Q6 AGENT_ATOM recipe depth / Q7 personality compute-all gate).

Risk count: 8 (5-8 floor satisfied; 2 HIGH / 4 MED / 2 LOW).

Hard-rule compliance: READ-ONLY (no source/test/ADR/CLAUDE.md edits); doc artifact only at owned path `plans/implementation/phase-95/00-understanding.md`; ≤500 LOC; file:line citations on every "exists today" claim in §2 (atoms, modes, viewers, persistence, log infra); ≥5 owner questions in §6 (7 actual); 5-8 risks in §5 (8 actual); no shell commands beyond ls/grep/cat/wc/find/head; all 8 sections (§1-§8) present; honest inventory in §2 covers all 5 areas (A atoms / B modes / C viewers / D persistence / E log).
