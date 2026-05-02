# P95 / Planning Sprint A3 — DDD + ADR Plan

> **Phase:** P95 · **Sprint:** Planning Wave 1 · **Agent:** A3 (DDD + ADR planning)
> **Date:** 2026-05-02 · **READ-ONLY** doc artifact (no source / test / ADR / CLAUDE.md edits).
> **Owned file:** `plans/implementation/phase-95/02-ddd-adr-plan.md`
> **Sibling chain:** A1 (sealed `00-understanding.md`) · A2 (sealed `01-decomposition.md`) · A4 Process+AISP+Swarm · A5 Closer.

Inputs consumed: `phase-95/00-understanding.md` (§§2-7), `phase-95/01-decomposition.md` (§§2-7), `docs/adr/ADR-054-ddd-bounded-contexts.md`, `docs/ddd/{ui-shell-bounded-context.md, data-flow-context-map.md, stage-2-context-map.md}`, `docs/adr/README.md` (numbering policy).

---

## §1 Methodology

- **DDD method:** for each P95-P104 task table from A2 §2, identify which existing bounded context(s) it touches per ADR-054 (5 canonical) + visible-in-`src/` extensions (planning, agentics). Flag any task crossing 2+ contexts as candidate for an anti-corruption layer (ACL); flag any responsibility not covered by existing contexts as candidate new context.
- **ADR catalog method:** for each AISP Σ block in A2 §5, name the implied ADR — title + decision question + 2-3 options considered (NOT decided; recommendation only when obvious from A1 §6 owner-question Q-grade); cite cross-references against the existing ADR ledger (range ADR-001..ADR-120 per `docs/adr/README.md`). Mark ADRs that depend on owner-question gates from A1 §6 (Q1, Q2, Q3, Q4, Q5, Q6, Q7).
- **KISS-strike DDD validation:** for each strike in A2 §6, confirm the removed responsibility doesn't leave a gap in any bounded context (i.e., another context still owns the use-case, OR the use-case is genuinely out-of-scope).

---

## §2 Existing bounded context inventory

ADR-054 named 5 canonical contexts (Configuration / Persistence / Intelligence / Specification / UI Shell). The `src/contexts/` tree today shows only 3 explicit directories (`intelligence`, `persistence`, `specification`). Configuration + UI Shell are de-facto contexts owned by `src/store/` + `src/components/` + `src/pages/` respectively. Two additional contexts surface in `src/` post-P54: `planning` (P91+) and `agentics` (P90 stub + P85 dev-card).

### A. ui-shell

- **Files:** `src/components/shell/AppShell.tsx`, `src/components/shell/MobileLayout.tsx`, `src/components/shell/AISPPipelineTracePane.tsx`, `src/components/onboarding/{ModeSelectorCard,AISPDeveloperCard}.tsx`, `src/store/uiStore.ts`, all of `src/components/{left-panel,center-canvas,right-panel,settings,marketing}/`.
- **Responsibility:** render the frame; mount routes; mode-aware layout (per ADR-116 — Whiteboard / Planning / Agentics route-derived from `useLocation()`); UI-only state (`activeTab`, `interactionMode`, `activePageId`, `activeMode` mirror per ADR-116, personality picker per ADR-073, latency badge per ADR-077).
- **Aggregates:** `uiStore`, `AppShell`, design-token system (ADR-087), section component library (ADR-088 enables / ADR-087 disciplines).

### B. intelligence

- **Files:** `src/contexts/intelligence/{chatPipeline.ts, intentClassifier.ts, llmClassifier.ts, applyPatches.ts, todoExecutor.ts, personality/*, llm/*, stt/*, prompts/system.ts}` + 8 atom modules under `src/contexts/intelligence/aisp/{intentAtom, assumptionsAtom, templateSelector (SELECTION_ATOM), contentAtom, decompAtom, processAtom, dddAtom, agentAtom}.ts` + `pageIterator.ts` (P79).
- **Responsibility:** pipeline + 8 atoms + classifiers + LLM adapters + STT; pure-function modules where possible; cost-cap + audit chokepoint at `auditedComplete()`; cross-surface mutex via `inFlight` flag.
- **Aggregates:** `LLMRequest`, `LLMResponse`, `ChatMessage`, `Transcript`, atoms (`AtomTrace` shape), `Todo[]` from DECOMP, `AgentSpec[]` from AGENT_ATOM.

### C. persistence

- **Files:** `src/contexts/persistence/{db.ts, exportImport.ts, kv.ts}` + `src/contexts/persistence/migrations/{000-init,001-example-prompts,002-llm-logs,003-user-templates,004-prompt-library}.sql` + `src/contexts/persistence/repositories/{sessions,llmCalls,llmLogs,kv,projects,messages,brandContext,codebaseContext,examplePrompts,promptLibrary,userTemplates,index}.ts`.
- **Responsibility:** local sql.js + IndexedDB; autosave; 30-day retention at `initDB`; BYOK trust boundary (per ADR-043 — keys never cross to Supabase / external service); cross-tab Web Locks (`hb-db-write`) + BroadcastChannel coordination; sensitive-table-ops registry strips `byok_*` + `llm_logs` from exports.
- **Aggregates:** Session, LLMCall, LLMLog, KV entry, Project, Page (per ADR-103), UserTemplate, BrandContext.

### D. specification

- **Files:** `src/contexts/specification/{shareSpecBundle.ts, staticHtmlExport.ts, attribution.ts, *}` + Blueprints rendering surface at `src/components/center-canvas/BlueprintsTab.tsx` + sub-components.
- **Responsibility:** spec bundle composition (per ADR-101 — canonical export modal CTAs + valid HTML5 + versioned AISP filenames); AISP adoption surface (per ADR-108 — adoption guide tree + polyglot ref impls); 7-tab Blueprints viewer; specs are derived (read-only from Configuration), never source-of-truth.
- **Aggregates:** `SpecBundle`, `AISP Crystal Atom output`, `North Star`, `Architecture`, `Build Plan`, `Features`, `Human Spec`, `AISP Symbol Vocabulary` instance.

### E. planning (visible in `src/components/planning/` from P91)

- **Files:** `src/components/planning/{ProcessMapSVG.tsx, DomainModelSVG.tsx, PlanningChatBar.tsx, PlanningViewToggle.tsx}` + `src/pages/Planning.tsx` + `src/data/sample-process-map.ts`.
- **Responsibility:** process-map + domain-model rendering surface; PlanningChatBar drives PROCESS_ATOM + DDD_ATOM in parallel from one submit (`onRawText` fan-out per ADR-119 D4); view toggle swaps process-map ↔ domain-model.
- **Aggregates:** `ProcessMap` (`{nodes: ProcessNode[], edges: ProcessEdge[], activeNodeId?}`), `DomainModel` (`{contexts: BoundedContext[], relationships: ContextRelationship[]}`), Planning-page UI state (`liveMap`, `liveDomainModel`, `view`).
- **Status:** today's atom outputs are `useState` only — lost on reload (A1 §2.B confirms); no persistence aggregate yet; A4 will surface this as a P100 W2 hydration task.

### F. agentics (visible in `src/pages/Agentics.tsx` + `src/components/onboarding/AISPDeveloperCard.tsx` from P90/P85)

- **Files:** `src/pages/Agentics.tsx` (P90 stub), `src/components/onboarding/AISPDeveloperCard.tsx` (P85 dismissable card).
- **Responsibility:** multi-agent coordination surface for the developer audience per ADR-110 ("Agentics prominent" mode); P90-P100 functional bodies pending (`Coming soon · P92-P100` badge still live at `Agentics.tsx:19` per A1 §7 honest-declaration).
- **Aggregates:** none yet — pure rendering layer awaiting P95 SpecWorkbench / P96 Export / P98 KISS Reviewer / P99 Seal Panel mounts.

---

## §3 Per-phase bounded-context impact map

For each phase from A2 §2, list which contexts it touches + cross-context flag + ACL flag.

### P95 SpecWorkbench (BLOCKED on Q1, Q6)
- Touches: **ui-shell** (mount Spec tab; AtomCard render), **intelligence** (consume 8 atoms read-only via `specComposer.ts`), **specification** (compose `SpecBundle` from atoms), **planning** (mount surface in `Planning.tsx`).
- New context needed? NO.
- Cross-context tasks: P95-T1 (`specComposer.ts`) crosses intelligence ↔ specification (atom shapes → `SpecBundle`); P95-T2/T4 cross ui-shell ↔ planning ↔ specification. ACL needed? NO — `AtomTrace` shape already shared; `SpecBundle` already lives in specification context; composer is pure read-only adapter (KISS R4 forbids `classify*` import).

### P96 Export Claude Code (BLOCKED on Q2)
- Touches: **specification** (read `SpecBundle` from P95), **intelligence** (read `AgentSpec[]` from AGENT_ATOM for swarm.json), **ui-shell** (Export button mount).
- New context needed? NO.
- Cross-context tasks: P96-T1 (`claudeCodeBundle.ts`) crosses intelligence ↔ specification (AgentSpec → swarm.json); P96-T7 (Planning.tsx button mount) is ui-shell ↔ planning. ACL needed? NO — golden-file fixture in `examples/3rd-party-consumer/golden-bundle/` IS the contract; round-trip test enforces shape stability.

### P97 TDD Scaffold Generator (READY)
- Touches: **intelligence** (`scaffold/tddScaffold.ts` + `scaffold/scaffoldWriter.ts`), **persistence** (none — scaffold writes to filesystem `tests/scaffold/`, not SQLite).
- New context needed? NO — scaffold is a sub-module under intelligence (mirrors how `aisp/` lives under intelligence).
- Cross-context tasks: P97-T2 writes outside `src/` to `tests/scaffold/` — boundary crossing is build-time only (filesystem I/O), not runtime; existsSync guard is the ACL. ACL needed? Implicit (filesystem-write helper is the boundary).

### P98 KISS Reviewer (BLOCKED on Q3)
- Touches: **intelligence** (`review/reviewerPrompt.ts` + `review/reviewerSchema.ts`), **ui-shell** (findings render surface — channel TBD on Q3), conditionally **agentics** (if Q3=B, dedicated tab in Agentics mode).
- New context needed? NO — reviewer is a sub-module under intelligence (parallel to `aisp/`).
- Cross-context tasks: P98-T1 reads `AgentSpec` from intelligence; P98-T3 renders to ui-shell or agentics depending on Q3. ACL needed? YES — Σ R1 scope guard (reject any file outside `AgentSpec.ownedFiles`) is a Σ-contract-as-ACL pattern; prevents prompt-injection per A2 §5 P98 Σ.

### P99 Seal Panel (READY)
- Touches: **agentics** (mount Seal Panel as new tab in `Agentics.tsx`), **intelligence** (`seal/markdownEmitter.ts` + `seal/fileWriter.ts` consume `AgentSpec.dod`), **ui-shell** (DoD checklist render — `SealPanel.tsx`).
- New context needed? NO — seal is a sub-module under intelligence (mirrors `aisp/`); UI lives in ui-shell + agentics surface.
- Cross-context tasks: P99-T2 (markdownEmitter) is pure intelligence; P99-T3 (fileWriter) writes outside `src/` to `plans/implementation/phase-N/`; P99-T4 retires stale Agentics badge (A1 §7 finding). ACL needed? YES — existsSync guard on session-log writes (Σ R2 — never overwrites existing) is the ACL.

### P100 W2 Log Build (BLOCKED on Q4, Q7)
- Touches: **persistence** (5 new migrations 005-009 + 5 new repositories), **intelligence** (`chatPipeline.ts` request_id mint hoist; `PlanningChatBar` atom-output persistence), **ui-shell** (ConversationLogTab drill-down), **planning** (`Planning.tsx` hydrate `liveMap`/`liveDomainModel` from atomOutputs on mount).
- New context needed? NO — log is an extension of persistence (additive migrations only — Σ R3 mitigation per A1).
- Cross-context tasks: largest cross-context phase in the arc. P100W2-T11 (chatPipeline edit) crosses intelligence ↔ persistence; P100W2-T13 (Planning hydration) crosses planning ↔ persistence. ACL needed? YES — the new `requestIdMint.ts` helper recommended in A2 §7 is the ACL between chatPipeline (high-traffic) and the new request_envelopes repo. Extracting it keeps the chatPipeline edit minimal + protects the boundary.

### P101 Agentic Workbench RC (BLOCKED on Q5)
- Touches: **ALL contexts** (full system seal — UX/Functionality/Security/Architecture review per CLAUDE.md "Standard Phase Process" §5).
- New context needed? NO.
- Cross-context tasks: T5 fix-pass commits span every context. ACL needed? NO — review is a process-phase, not a system change; ADRs / KISS denylist tests / existsSync guards already constitute the runtime ACLs.

### P102 Final QA + persona re-score (READY)
- Touches: **ui-shell** + **specification** (persona scoring rubric reads rendered surfaces). No source code changes.
- New context needed? NO.
- Cross-context tasks: zero — pure scoring.

### P103 v2.0.0 release artifacts (READY)
- Touches: **specification** (CHANGELOG + release notes + Show HN + PH + demo script + owner-launch-checklist v2 are spec-context artifacts in `docs/launch/`).
- New context needed? NO.
- Cross-context tasks: zero.

### P104 v2.0.0-RC1 public launch (READY)
- Touches: none in source — owner-led tag + posts + beta dispatch + AISP campaign. Final CLAUDE.md sync row is the only Claude-side write.
- New context needed? NO.
- Cross-context tasks: zero.

---

## §4 New bounded contexts to introduce

**NONE.** P95-P104 fits within ui-shell + intelligence + persistence + specification + planning + agentics — all 6 contexts already exist in `src/`. New sub-modules introduced (scaffold, review, seal, export, log, spec) all live under intelligence + specification + persistence + ui-shell as nested directories — they are sub-aggregates, NOT new bounded contexts.

The "scaffold" / "review" / "seal" / "export" / "log" / "spec" sub-modules follow the existing `intelligence/aisp/` pattern (sub-folder owns one concern; pure-function modules where possible; consumed by ui-shell render layer). This consistency preserves ADR-054's 5-context map (extended with planning + agentics surfaces visible since P85/P90).

---

## §5 ADRs to author

For each AISP Σ block in A2 §5 + each phase ADR ledger row in A2 §2.

### ADR-121 — SpecWorkbench Layout

- **Phase:** P95 (BLOCKED on Q1)
- **Decision question:** How should the dual-view spec composer render across desktop + mobile while preserving ADR-110 dual-view default?
- **Options considered:**
  1. **Side-by-side desktop / stacked mobile** — pros: dual-view always visible; cons: vertical scroll death on 375px (A1 R6).
  2. **Single-pane with toggle** — pros: smaller mobile footprint; cons: loses simultaneity ADR-110 governs.
  3. **Desktop side-by-side / mobile auto-collapses to toggle** — pros: best-of-both; cons: more layout code (responsive hybrid).
- **Recommendation:** **C** (per A1 §6 Q1 recommendation — preserves ADR-110 on the surface it governs while honoring ADR-090 mobile UX redesign).
- **Cross-refs:** ADR-110 (AISP Visibility Standard), ADR-116 (Three-Mode Product Architecture — Planning dual-view default), ADR-120 (AGENT_ATOM — composer Σ contract), ADR-091 (Canonical Component Quality), ADR-090 (Mobile UX Redesign).
- **Status when authored:** "Accepted" by closer agent at P95 seal.

### ADR-122 — Export Claude Code Format

- **Phase:** P96 (BLOCKED on Q2)
- **Decision question:** What is the export deliverable target — file ZIP, in-page render, or filesystem write?
- **Options considered:**
  1. **ZIP via Blob download** — pros: matches existing `shareSpecBundle.ts` P78 pattern; works in static-host; cons: requires file-handler chain.
  2. **In-page render with copy-buttons per file** — pros: zero download infra; cons: not portable to a target repo.
  3. **Filesystem write to `dist/claude-code-bundle/`** — pros: direct reuse; cons: requires download script (out-of-process).
- **Recommendation:** **A** (per A1 §6 Q2 recommendation — consistent with ADR-101 export modal CTAs; zero new infra; B can be a secondary affordance).
- **Cross-refs:** ADR-101 (Spec Export Quality Standard), ADR-108 (AISP Adoption Standard), ADR-120 (AGENT_ATOM — swarm.json shape), ADR-082 (Open Core RC).
- **Status when authored:** "Accepted" at P96 seal.

### ADR-123 — TDD Scaffold Conventions

- **Phase:** P97 (READY)
- **Decision question:** What naming + assertion style do scaffold-generated tests adopt to mirror existing `pXX-name.spec.ts` conventions?
- **Options considered:**
  1. **`<atom>.spec.ts` namespace under `tests/scaffold/`** — pros: matches existing per-atom spec pattern; cons: double naming if atom later gets a phase-spec.
  2. **`scaffold-<atom>.spec.ts` under `tests/`** — pros: globally identifiable; cons: pollutes top-level tests dir.
  3. **`tests/scaffold/p<phase>-<atom>.spec.ts`** — pros: phase-aligned; cons: invites overwrite-on-rerun risk.
- **Recommendation:** **A** — namespace under `tests/scaffold/` matches A2 §2 P97-T2 spec; CI gate excludes `tests/scaffold/**` so no false-fail risk.
- **Cross-refs:** ADR-083 (Test Library Architecture), ADR-120 (AGENT_ATOM — DoD shape drives `it` blocks), ADR-099 (DECOMP_ATOM — Γ rule shape drives `describe` blocks).
- **Status when authored:** "Accepted" at P97 seal.

### ADR-124 — KISS Review Pattern

- **Phase:** P98 (BLOCKED on Q3)
- **Decision question:** Where do auto-generated reviewer findings render in the running app?
- **Options considered:**
  1. **Stream into ConversationLogTab as `reviewer` turn role** — pros: inline next to user request; cons: pollutes chat history.
  2. **Dedicated panel in Agentics mode "Review" tab** — pros: persistent + discoverable for developer audience; cons: yet-another-tab.
  3. **Chat reply from "Bradley-as-Reviewer" persona** — pros: reuses personality engine (ADR-073); cons: blurs persona vs reviewer roles.
- **Recommendation:** **B** (per A1 §6 Q3 — keeps findings persistent + discoverable in Agentics mode where developer audience lives; persists naturally to P100 W2 log infra).
- **Cross-refs:** ADR-094 (Professional Grade Standard), ADR-095 (Library-Wide Polish Standard), ADR-110 (AISP Visibility Standard), ADR-120 (AGENT_ATOM — ownedFiles drives scope guard), ADR-073 (Personality Engine — boundary vs persona).
- **Status when authored:** "Accepted" at P98 seal.

### ADR-125 — Seal Panel UI

- **Phase:** P99 (READY)
- **Decision question:** Should the Seal Panel render inline in Agentics mode, as a modal, or as a separate route?
- **Options considered:**
  1. **Inline tab in Agentics mode** — pros: matches A2 §2 P99-T4 mount; consistent with three-mode product architecture (ADR-116); cons: adds tab count to Agentics.
  2. **Modal dialog launched from current phase context** — pros: focused workflow; cons: modal-fatigue for repeat use.
  3. **Separate route `/seal/<phaseId>`** — pros: deep-link friendly; cons: out-of-mode (breaks ADR-116 mode discipline).
- **Recommendation:** **A** — inline tab honors ADR-116 mode discipline + matches A2 decomposition.
- **Cross-refs:** ADR-116 (Three-Mode Product Architecture), ADR-120 (AGENT_ATOM — DoD drives checklist rows), ADR-094 (Professional Grade Standard); CLAUDE.md "Standard Phase Process" §2-4.
- **Status when authored:** "Accepted" at P99 seal.

### ADR-126 — Log Architecture (P100 W2)

- **Phase:** P100 W2 (BLOCKED on Q4, Q7)
- **Decision question:** How are stage-event + atom-output rows persisted + drilled-down without breaking existing kv-persisted user state?
- **Options considered:**
  1. **Additive `CREATE TABLE IF NOT EXISTS` migrations 005-009; auto-migrate on next launch** — pros: safe-by-construction (R3 mitigation); zero user-visible disruption; matches "logs are infrastructure not opt-in" spirit; cons: silent migration.
  2. **Opt-in via Settings toggle** — pros: explicit user consent; cons: most users won't toggle; defeats audit narrative.
  3. **Build-time env flag `VITE_LOG_FORENSIC=1`** — pros: opt-in via build only; cons: requires deployment fork.
- **Recommendation:** **A** (per A1 §6 Q4 — consumes A1 P100 design from `phase-100/log-design.md` §9 migration plan).
- **Cross-refs:** ADR-018 (Persistence Schema Versioning), ADR-074 (Conversation Log EXPERT tab — supersession risk; see §8), ADR-110 (AISP Visibility Standard — drill-down dual-view), ADR-040 (Local SQLite Persistence), ADR-103 (Multi-Page MVP Wire — page_id column on request_envelopes).
- **Status when authored:** "Accepted" at P100 W2 seal.

### ADR-127 — Agentic Workbench RC Architecture

- **Phase:** P101 (BLOCKED on Q5)
- **Decision question:** Definitive boundary doc for v2.0.0-RC1 — what ships in the open-core Agentic Workbench (P90-P100) vs Tier-2 deferrals (analogous to ADR-109 for v1).
- **Options considered:**
  1. **All-on at tag** — pros: ADR-116 already routes all three modes via `main.tsx:88-89`; matches moat narrative; cons: no staged rollout.
  2. **Planning + Agentics behind `VITE_AGENTIC_WORKBENCH=1`** — pros: gradual rollout; cons: requires reverting ADR-116 + rebuilding env-var infra stripped at P89b.
  3. **Routes present but UI hidden behind Settings toggle** — pros: deep-link still works; cons: hidden-by-default contradicts moat positioning.
- **Recommendation:** **A** (per A1 §6 Q5 — gating now contradicts the open-core promise the P90-P100 arc IS).
- **Cross-refs:** ADR-094 (Professional Grade Standard — composite ≥80 floor), ADR-116 (Three-Mode Product Architecture), ADR-109 (Open Core RC Architecture — analogous v1 boundary doc), ADR-110 (AISP Visibility Standard), ADR-126 (Log Architecture — RC drill-down infra).
- **Status when authored:** "Accepted" at P101 seal.

### ADR-128 — Final QA Standard

- **Phase:** P102 (READY)
- **Decision question:** What composite floor + persona scoring rubric applies to the v2.0.0-RC1 final QA pass?
- **Options considered:**
  1. **ADR-094 SOTA 80 floor (unchanged from v1)** — pros: continuity; cons: doesn't reflect arc's depth growth.
  2. **Raised floor (e.g., 82)** — pros: pushes quality; cons: arbitrary lift without rubric change.
  3. **Per-persona floor (Grandma 78 / Framer 80 / Capstone 88)** — pros: differentiated; cons: complicates pass/fail decision.
- **Recommendation:** **A** — keeps the rubric stable; single floor unambiguous; P102b polish trigger lives in A2 §2 P102-T7 if any persona < 78.
- **Cross-refs:** ADR-094 (Professional Grade Standard), ADR-127 (Agentic Workbench RC Architecture).
- **Status when authored:** "Accepted" at P102 seal.

### ADR-129 — v2.0.0 Release Architecture

- **Phase:** P103 (READY)
- **Decision question:** What release artifact set + post-RC owner tasks bundle constitutes the v2.0.0 release (analogous to ADR-109 for v1)?
- **Options considered:**
  1. **Mirror ADR-109 set** (CHANGELOG + release notes + Show HN + PH tagline + demo script + owner-launch-checklist) — pros: known pattern; cons: no innovation.
  2. **Add Agentics-specific artifacts** (e.g., AISP campaign kit, swarm-dispatch sample bundles) — pros: showcases new arc; cons: doubles artifact count.
  3. **Minimal artifact set** (CHANGELOG + release notes only) — pros: less work; cons: weakens launch.
- **Recommendation:** **A + select adds from B** — keep ADR-109 spine; add 1-2 Agentics-specific items if owner picks (e.g., AISP campaign kit).
- **Cross-refs:** ADR-109 (Open Core RC Architecture — direct precedent), ADR-127 (Agentic Workbench RC), ADR-128 (Final QA Standard), ADR-108 (AISP Adoption Standard).
- **Status when authored:** "Accepted" at P103 seal.

**ADR row count: 9 (ADR-121..ADR-129).** Ledger goes 120 → 129. Numbering policy per `docs/adr/README.md`: append-only, no re-use of burned numbers.

---

## §6 ADR cross-reference matrix

| New ADR | Depends on | Conflicts with | Notes |
|---|---|---|---|
| ADR-121 SpecWorkbench Layout | ADR-110, ADR-116, ADR-120, ADR-091, ADR-090 | none | dual-view default; mobile collapse honors ADR-090 |
| ADR-122 Export Claude Code | ADR-101, ADR-108, ADR-120, ADR-082 | none | round-trip with `examples/3rd-party-consumer/` |
| ADR-123 TDD Scaffold | ADR-083, ADR-120, ADR-099 | none | namespace isolation via CI exclude |
| ADR-124 KISS Review Pattern | ADR-094, ADR-095, ADR-110, ADR-120, ADR-073 | none if Q3=B; **conflicts with ADR-073 if Q3=C** (reviewer-as-persona blurs personality engine) | Σ R1 scope guard is the ACL |
| ADR-125 Seal Panel | ADR-116, ADR-120, ADR-094 | none | retires stale Agentics badge (A1 §7) |
| ADR-126 Log Architecture | ADR-018, ADR-074, ADR-110, ADR-040, ADR-103 | **supersedes ADR-074** in part (ConversationLogTab drill-down extends beyond original 7-tab scope) | additive migrations only — R3 mitigation |
| ADR-127 Agentic Workbench RC | ADR-094, ADR-116, ADR-109, ADR-110, ADR-126 | **extends ADR-116** by formalizing P90-P100 arc as a sealed v2 scope; no direct conflict | RC blocker — composite ≥80 |
| ADR-128 Final QA | ADR-094, ADR-127 | none | continuity with v1 rubric |
| ADR-129 v2.0.0 Release | ADR-109, ADR-127, ADR-128, ADR-108 | none | mirrors ADR-109 spine + Agentics adds |

**Summary:** 9 new ADRs; 1 partial supersession (ADR-126 ⇒ ADR-074); 1 extension (ADR-127 ⇒ ADR-116); 1 conditional conflict (ADR-124 ⇔ ADR-073 only if Q3=C); 0 hard conflicts otherwise.

---

## §7 KISS-strike DDD validation

For each strike in A2 §6, confirm removing it doesn't create a DDD violation.

1. **P95-T7 atom search box (strike)** — no DDD violation. Atom enumeration is owned by the intelligence context (8-atom roster); a search box in ui-shell would duplicate the enumeration as a UI concern. Removing it keeps single source of truth in intelligence. OK to strike.

2. **P96-T8 bundle versioning UI panel (strike)** — no DDD violation. Versioning lives in `shareSpecBundle.ts` (per ADR-101 versioned-AISP-filename pattern) inside specification context. UI panel would expose specification-internal state to ui-shell. OK to strike.

3. **P97-T7 scaffold visual preview UI (strike)** — no DDD violation. Scaffold output is plain TS — opening it in any editor IS the preview. UI render layer would create a scaffold-rendering responsibility split between intelligence (generator) and ui-shell (preview). OK to strike.

4. **P98-T6 reviewer-history viewer with diff (strike)** — no DDD violation. Git already owns history; reviewer findings persist as commits + EOP retro entries (per CLAUDE.md "Standard Phase Process" §3). In-app diff viewer would create a parallel history-store inside ui-shell. OK to strike.

5. **P99-T7 drag-to-reorder DoD items (strike)** — no DDD violation. DoD comes from `AgentSpec.dod` (canonical source in intelligence context per ADR-120). UI reordering would invite ui-shell to mutate intelligence-context state — direct boundary violation. OK to strike (and arguably required-to-strike to preserve DDD invariant).

6. **P101-T6 feature-flag plumbing (conditional strike if Q5=A)** — no DDD violation when struck. ADR-116 routes already shipped; flag adds a build-time concern that would live cross-context (ui-shell route + intelligence wiring). OK to strike if Q5=A.

7. **P103-T9 re-record demo video (strike from Claude scope)** — no DDD violation. Owner-only post-RC task per ADR-109 §4 — outside system scope entirely.

8. **P104-T7 promo automation (strike)** — no DDD violation. Outside system scope.

9. **P96-T9 in-page render of bundle (strike if Q2=A)** — no DDD violation. Specification context still owns the bundle composition; only the delivery mode changes from in-page to ZIP download.

10. **P100W2-T17 personality compute-all-5 (conditional)** — no DDD violation either way. Personality variants are owned by intelligence context (per ADR-073); compute-all-5 is a richness-of-output choice, not a context boundary change.

**All 10 strikes confirmed safe to strike from a DDD perspective.** Strike #5 (P99-T7) is arguably DDD-mandatory (preventing ui-shell from mutating intelligence state).

---

## §8 ADR conflicts / supersession risk

- **ADR-126 (P100 W2 Log System) partially supersedes ADR-074 (Conversation Log EXPERT tab).** ADR-074 scoped a 7-tab Conversation Log surface within EXPERT mode; P100 W2 extends drill-down to a per-`request_id` rendering of 11 categories (per A1 §3 acceptance). The original 7-tab UI persists; only the row-level drill-down semantics extend. ADR-126 should explicitly note "extends ADR-074 — original 7-tab scope retained, per-row drill-down newly added" rather than full supersession.

- **ADR-127 (P101 RC Architecture) extends ADR-116 (Three-Mode Product Architecture).** ADR-116 routed three modes; ADR-127 formalizes the sealed P90-P100 arc as the v2.0.0-RC1 scope. No conflict — extension only. ADR-127 should cite ADR-116 as foundation, not predecessor.

- **ADR-124 (KISS Review Pattern) conditionally conflicts with ADR-073 (Personality Engine) if Q3=C.** If owner picks Q3 option C ("Bradley-as-Reviewer persona"), the personality engine gains a new variant whose role conflicts with the reviewer-prompt scope guard (Σ R1 — reject paths outside `ownedFiles`). Persona variants today are stylistic (5 bubble styles); reviewer-as-persona introduces semantic-level constraints (severity/scope/schema) that don't fit ADR-073's scope. **Recommendation:** persist owner Q3 answer before drafting ADR-124; if Q3=C, ADR-124 must explicitly amend ADR-073 to widen persona scope (or drop Q3=C as an option).

- **ADR-129 (v2.0.0 Release) does NOT supersede ADR-109 (v1.0.0-RC1 Release).** ADR-109 remains the v1 boundary record; ADR-129 is the v2 boundary record. Both stay accepted; cross-reference is one-directional (ADR-129 cites ADR-109 as precedent).

- **No hard conflicts beyond the above.** ADRs 121, 122, 123, 125, 128 are net-additive — no supersession of existing ADRs.

---

## §9 Carry-forward to A4 (Process Map + AISP Spec + Swarm Config)

What A4 needs from this doc to author the P95-P104 process map, AISP specs, and swarm configs:

- **§3 bounded-context impact map** — A4 builds ProcessMap nodes per phase with bounded-context tags as node metadata. Recommend node-color per primary context (intelligence = blue / ui-shell = green / persistence = purple / specification = amber / planning = teal / agentics = magenta).
- **§5 ADR list (9 rows)** — A4 includes ADR authoring as gate items in the process map (one diamond gate per phase with ADR-12X label). Diamond gates at P101 + P102 + P103 carry composite-floor + persona-scoring + release-artifact-completeness checks respectively (per A2 §4 Band 3 sequence).
- **§6 cross-ref matrix** — A4 dependency edges in process map: ADR-121 → ADR-122 (P95→P96 spec→export); ADR-126 → ADR-127 (P100W2→P101 log infra → RC); ADR-127 → ADR-128 → ADR-129 (P101→P102→P103 release sequence).
- **§7 KISS validation** — A4 confirms strikes carry forward unchanged in process map (struck tasks do NOT become ProcessNodes); Strike #5 (P99-T7 drag-to-reorder DoD) flagged as DDD-mandatory in process map metadata.
- **§8 supersession risks** — A4 flags 3 risk edges: (a) ADR-126 ⊃ ADR-074 partial supersession (Log node should reference Conversation Log node as predecessor); (b) ADR-127 ⊇ ADR-116 extension (RC node should reference Three-Mode Architecture node); (c) ADR-124 conditional conflict with ADR-073 if Q3=C (Reviewer node carries a Q3-conditional edge to Personality node).
- **Wave-gating from A2 §7 conflict map** — A4 process map enforces Planning.tsx wave order: P95 → P96 → P100W2 → P101; Agentics.tsx wave: P99 → P101; chatPipeline.ts wave: P100W2 → P101.
- **AISP Σ blocks from A2 §5** — A4 lifts the 6 Σ blocks (P95, P96, P97, P98, P99, P101) into the process map as node-level metadata; P100W2 + P102-P104 carry "no atomic computation" tag per A2 §5 closing note.
- **Swarm configuration** — per CLAUDE.md "Swarm Configuration & Anti-Drift" + ADR-093 Component Decomposition Standard: A4 sizes each phase swarm at 6-8 agents max (hierarchical topology / specialized strategy / raft consensus); per-phase agent count derives from A2 task tables (P95 = 5 agents A1-A5; P96 = 6 agents A1-A6; P97 = 4 agents; P98 = 3 agents; P99 = 4 agents; P100W2 = 8 agents; P101 = 5 agents incl 4 reviewers + closer; P102 = 4 agents; P103 = 6 agents; P104 = 2 agents owner-led).

---

# Report

Section LOC counts: §1≈8, §2≈55 (6 contexts A-F), §3≈48 (10 phases impact-mapped P95-P104), §4≈9, §5≈92 (9 ADR rows), §6≈14 (matrix table + summary), §7≈22 (10 strikes validated), §8≈14 (4 supersession-risk items), §9≈14. Total ≈ 276 LOC ≤ 500 cap (whitespace + headers excluded; tables count toward owning section).

Bounded-context count: **6** (A ui-shell · B intelligence · C persistence · D specification · E planning · F agentics — 4 per ADR-054 owner-named + 2 visible in `src/` since P85/P90).

ADR-row count in §5: **9** (ADR-121..ADR-129; ledger 120 → 129).

New-bounded-context count: **0** (per §4 — all P95-P104 work fits within existing 6 contexts; new sub-modules nest under intelligence/specification/persistence/ui-shell as sub-aggregates).

KISS-strike validation count: **10** (all confirmed safe to strike from DDD perspective; strike #5 P99-T7 flagged DDD-mandatory).

Supersession-risk count: **3** (ADR-126 ⊃ ADR-074 partial; ADR-127 ⊇ ADR-116 extension; ADR-124 ⇔ ADR-073 conditional on Q3=C).

Hard-rule compliance: READ-ONLY (no source / test / ADR / CLAUDE.md edits — only the owned doc artifact at `plans/implementation/phase-95/02-ddd-adr-plan.md` written); doc artifact only ≤500 LOC; all 9 sections (§1-§9) present; bounded-context impact map for all 10 phases P95-P104 (BLOCKED phases get impact-map skeleton with Q-blocker noted, per spec); ≥7 ADR rows in §5 (9 actual); 6 bounded contexts inventoried in §2 (4 ADR-054 + planning + agentics — meets spec floor); no shell commands beyond ls/read/cat/find; phase/task/ADR IDs cited (no file:line required this pass per spec).
