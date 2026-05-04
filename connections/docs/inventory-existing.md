# Internal Inventory — What Exists in Hey Bradley

> Date: 2026-05-04 · Branch: `swarm/connections-phase-1` · Phase: CONNECTIONS-P1 / Agent A1
> Source: `bar181/hey-bradley-core` repo at v2.0.0-RC1 + cleanup arc (P102 → P109)
> Scope: research-only inventory; every claim cites file:line.

## TL;DR

The repo carries the full **8-atom AISP suite + 3-mode product surface + markdown-bundle exporter** ready for connections-layer wrapping: pure-module Crystal Atoms emit deterministic outputs (no live LLM dep), `buildClaudeCodeBundle()` already produces a single-file `# === FILE: path ===` markdown artifact (ADR-122 contract), and a 15-value `log_events` enum is 100% production-wired post-P107. What's missing for the connections layer: **no public-facing CLI/programmatic surface** — every entry-point today is a React component or browser-only Vite-bundled module (e.g. atoms transitively pull `import.meta.glob` via `migrations/index.ts` per P108/A10 finding). A standalone NPX/MCP/plugin layer must extract the pure-module subset and re-bundle without the React + Vite dependencies.

## 1. Crystal Atoms (8 — AISP suite COMPLETE per ADR-120)

| Atom | File (LOC) | Σ block? | Pure? | Production wire (file:line) |
|------|------------|----------|-------|------------------------------|
| **PATCH_ATOM** | `src/contexts/intelligence/prompts/system.ts:37-70` (189 LOC file) | YES (`CRYSTAL_ATOM` const, lines 37-70 — Ω/Σ/Γ/Λ/Ε present, `aisp-1.2`) | YES | `buildSystemPrompt()` line 161; consumed `chatPipeline.ts:209` |
| **INTENT_ATOM** | `src/contexts/intelligence/aisp/intentAtom.ts:17` (212 LOC) | YES (`INTENT_ATOM` export, Ω/Σ/Γ/Λ/Ε) | YES | `chatPipeline.ts:354` via `classifyIntent` + `llmClassifyIntent` |
| **SELECTION_ATOM** | `src/contexts/intelligence/aisp/templateSelector.ts:22` (122 LOC) | YES (inline `SELECTION_ATOM` const) | YES | exported `selectTemplate()` line 72; **note: P106/ADR-134 SUPERSEDED** the LLM dispatcher (`twoStepPipeline.ts` deleted); `templateMatcher.ts` is canonical now |
| **CONTENT_ATOM** | `src/contexts/intelligence/aisp/contentAtom.ts:33` (184 LOC) | YES (Ω/Σ/Γ/Λ/Ε) | YES | `contentGenerator.ts:102` `generateContent()` |
| **ASSUMPTIONS_ATOM** | `src/contexts/intelligence/aisp/assumptionsAtom.ts:24` (148 LOC) | YES (Ω/Σ/Γ/Λ/Ε) | YES | `assumptionsLLM.ts:90` `generateAssumptionsLLM()` |
| **DECOMP_ATOM** | `src/contexts/intelligence/aisp/decompAtom.ts:25` (284 LOC) | YES (`DECOMP_ATOM`, Ω/Σ/Γ/Λ/Ε) | YES | `chatPipeline.ts:444` short-circuit; `todoExecutor.ts:131` |
| **PROCESS_ATOM** | `src/contexts/intelligence/aisp/processAtom.ts:42` (295 LOC) | YES (verbatim AISP) | YES | `PlanningChatBar.tsx:44` `classifyProcess()` → `toProcessMap()` |
| **DDD_ATOM** | `src/contexts/intelligence/aisp/dddAtom.ts:15` (291 LOC) | YES (Ω/Σ/Γ) | YES | `PlanningChatBar.tsx:58` `classifyContexts()` |
| **AGENT_ATOM** | `src/contexts/intelligence/aisp/agentAtom.ts:49` (299 LOC) | YES | YES | `PlanningChatBar.tsx:78` `classifyAgents()` (closes ADR-128 D3 / ADR-131 CF#1) |

Barrel: `src/contexts/intelligence/aisp/index.ts` (66 LOC) re-exports atoms 2-9. **PATCH_ATOM lives in `prompts/system.ts` not the `aisp/` folder** — historical placement (ADR-045 precedent).

Each atom exposes a `classifyX()` deterministic baseline + `buildXAtom() / parseXResponse()` LLM-handoff path that is **inert at v2.0.0-RC1** (CF#4 owner-required).

## 2. MasterConfig schema

- `src/lib/schemas/masterConfig.ts` (174 LOC) — three-level hierarchy: `siteSchema` (line 33) + `themeSchema` (line 130) + `pageSchema` (line 147) + top-level `masterConfigSchema` (line 161) with `pages: z.array(pageSchema).optional()` for ADR-085 multi-page.
- `src/lib/schemas/section.ts` (240 LOC) — `sectionTypeSchema` (line 5) Zod enum **canonical 18** types (hero, menu, columns, pricing, action, footer, quotes, questions, numbers, gallery, logos, team, image, divider, text, blog, case-study, contact-form). `VALID_SECTION_TYPES` const helper at line 29; `validateSectionType()` line 38 — **P104 strict-vs-friendly remap pattern**: Zod stays strict; helper opt-in remaps aliases (article/long-form→text, testimonial/pull-quote→quotes, nav→menu, cta→action, faq→questions, stats→numbers); **never throws**, returns null on unknown.
- `src/lib/schemas/intent.ts` (36 LOC) — `intentVerbSchema` (6 verbs: hide/show/change/remove/add/reset, line 12) + `intentTargetTypeSchema` (line 17, mirrors canonical 18 per P106/ADR-134).
- Bundle marker: `BUNDLE_VERSION = 'aisp-1.2'` at `shareSpecBundle.ts:17` and `prompts/system.ts:61` (`SCHEMA_VERSION := "aisp-1.2"`).

P109 / ADR-137 introduced section-enum drift regression guard locking 5 sources (sectionTypeSchema + VALID_SECTION_TYPES + PATCH_ATOM SectionType + intentTargetTypeSchema + INTENT_ATOM ALLOWED_TARGET_TYPES) to canonical 18 — `tests/p109-section-enum-drift-guard.spec.ts`.

## 3. Pipeline entry points

### chatPipeline (chat mode — Whiteboard)

- `src/contexts/intelligence/chatPipeline.ts` (764 LOC).
- `submit(opts: ChatPipelineOptions): Promise<ChatPipelineResult>` exported at line 298. `ChatPipelineOptions` = `{ source: 'chat' | 'listen' | 'test', text, history? }` (line 34); `ChatPipelineResult` (line 45) carries `appliedPatchCount`, `summary`, `aisp` (intent + source), `aispRoute`, `improvements`, `personalityMessage`, `latencyMs`, `latencyBreakdown`, `matcherConfidence`.
- Trace: `input_event` emit (line 326) → `listen_capture` (327) → `multi_page_scope` (332, ADR-104) → `effectiveText = source==='listen' ? cleanTranscript(text) : text` (340) → `classifyIntent`/`llmClassifyIntent` (392-397) → `intent_classification` emit (411) → `classifyRoute` (432) → DECOMP short-circuit branch (444 `decompose()` → 446 `decomp_split` emit when ≥2 todos → 469 `todo_execution` per-todo → 502 `patch_validation`) → `matchTemplates` fallback (539) → `selectTemplate` LLM path (584+) → `applyPatches` via `prefixPatchPaths(scope.scopeRoot)` (244, 493, 497, 547, 593) → `response_summary` emit + `writeEditHistory`.
- `emit()` helper line 281 wraps `writeLogEvent` in try/catch; `LogCtx` carries `sessionId`/`requestId`/`projectId`/`pageId`/`pageIndex`. `newRequestId()` minted at submit entry.

### useListenPipeline (listen mode — Whiteboard)

- `src/components/left-panel/listen/useListenPipeline.ts` (397 LOC) — React hook returning `{ state, handlers }` at line 89.
- Imports `submit as submitChatPipeline` from chatPipeline (line 21), invoked at line 131 with `{ source: 'listen', text }` — single source of truth; cleanTranscript runs **inside** chatPipeline (not the hook).
- PTT (push-to-talk) timers at lines 304/334 trigger `submitListenFinal` (line 181) → chatPipeline.

### PlanningChatBar (Planning + Agentics modes)

- `src/components/planning/PlanningChatBar.tsx` (119 LOC) — separate from chatPipeline; calls atoms directly.
- Submit handler: `classifyProcess(text)` (line 44) → emit `process_atom_output` log (line 53-55) + `classifyContexts()` (58-61) emits `ddd_atom_output` + `classifyAgents()` per-context (78) — fan-out wires PROCESS+DDD+AGENT atoms.

## 4. Export surfaces

- **`exportClaudeCode.ts`** (`src/contexts/specification/exportClaudeCode.ts`, 269 LOC) — markdown bundle per ADR-122. `buildClaudeCodeBundle(phase, projectSlug?, onEmit?)` line 203. Returns `ExportClaudeCodeBundle` (line 28). Emits ≥6 logical files (lines 211-238): `process-map.md`, `human-spec/{north-star,sadd,implementation-plan}.md`, `aisp/phase-aisp.md`, `adrs/ADR-{id}.md` per ADR ref, `agents/wave-{n}.md` per sprint, `phase-plans/{id}-test-spec.md` (P97/ADR-128 7th file). Concatenates via `# === FILE: ${f.path} ===` marker (line 241). `ExportEmitCallback` type line 55 + `ExportEmitEvent` line 45 enable observability without coupling to persistence (atom-pure preserved per P107/ADR-135).
- **`staticHtmlExport.ts`** (218 LOC) — emits standalone HTML5 with `<nav class="hb-page-nav">` for multi-page (line 191, ADR-103). Inline CSS (lines 168-170).
- **`shareSpecBundle.ts`** (106 LOC) — composer for clipboard-ready spec. **AISP versioned filename pattern** at line 50: `${slug}-aisp-${v}.txt` (e.g. `coffee-roaster-aisp-v1.0.txt`); full `bundleFilenames()` line 44 also emits `${slug}-northstar-${v}.md`, `${slug}-human-spec-${v}.md`, `${slug}-config-${v}.json`, `${slug}-manifest-${v}.json`. `withVersionHeader()` line 57 prepends 2-line header per ADR-101.
- **`hostedSpecLink.ts`** (133 LOC) — kvSet/kvGet round-trip; `data:` URL only, NO server (locked D5 per ADR-081).
- **`tddScaffoldGenerator.ts`** (`src/contexts/specification/exporters/`, 202 LOC) — `buildTDDScaffold(phase, contexts?, agents?)` line 160; emits Given/When/Then markdown per ADR-128 (joins exportClaudeCode bundle as 7th file).
- **`kissReviewer.ts`** (`src/contexts/specification/reviewers/`, 286 LOC) — `buildKissReview(phase)` per ADR-129; 6-category × 3-tier output.
- **`attribution.ts`** (56 LOC) — "Built with Hey Bradley" canonical string + kv-toggle.
- **`exportProject.ts`** (`src/lib/`) — wraps the 6 spec generators for full-project export.
- **`conversationLogExport.ts`** (118 LOC) — exports ConversationLog drill-down per request_id (ADR-126).

## 5. Three modes (per ADR-116 / ADR-131)

| Mode | Route | Page (LOC) | Role |
|------|-------|-----------|------|
| **Whiteboard** (Builder) | `/builder` | `src/pages/Builder.tsx` (15) | Tri-pane (chat + canvas + spec); single-source UX for chat/listen submission via `chatPipeline.submit`; AISP hidden surface |
| **Planning** | `/planning` | `src/pages/Planning.tsx` (234) | 3-pane: project list + ProcessMapSVG ↔ DomainModelSVG view toggle + SpecWorkbench right; PROCESS+DDD atoms drive the center via PlanningChatBar |
| **Agentics** | `/agentics` | `src/pages/Agentics.tsx` (263) | 3-pane: phase tree + ProcessMapSVG (live from `log_events` via `useEffect` query at lines 53-72) + SpecWorkbench right + SealPanel + AISPDeveloperCard onboarding (ADR-110) |

Routes registered at `src/main.tsx:73, 88, 89`. `useLocation()` drives AppShell layout (route is single source of truth, not the store — ADR-116 D3).

## 6. Spec generators (`src/lib/specGenerators/`)

| Generator | File (LOC) | Export |
|-----------|-----------|--------|
| North Star | `northStarGenerator.ts` (272) | `generateNorthStar(config)` line 20 |
| SADD | `saddGenerator.ts` (211) | `generateSADD(config)` line 12 |
| Build Plan | `buildPlanGenerator.ts` (206) | `generateBuildPlan(config)` line 94 |
| Features | `featuresGenerator.ts` (292) | `generateFeatures(config)` line 87 |
| Human Spec | `humanSpecGenerator.ts` (231) | `generateHumanSpec(config)` line 21 |
| AISP Spec | `aispSpecGenerator.ts` (220) | `generateAISPSpec(config)` line 21 |
| Helpers | `helpers.ts` (272) | shared utilities |
| Section Rules | `sectionRules.ts` (449) | section-aware rule library |

Barrel: `src/lib/specGenerators/index.ts` (12 LOC) re-exports the 6 public generators.

PROCESS_ATOM consumer = `ProcessMapSVG.tsx` (atom output → `toProcessMap()` adapter); DDD_ATOM consumer = `DomainModelSVG.tsx`; AGENT_ATOM consumer = `SpecWorkbench.tsx` (330 LOC) which renders `phases: PhaseCard[]` prop with sprint cards exposing AgentSpec scopes + DoD + verbatim AISP Σ block.

## 7. Persistence

- **`src/contexts/persistence/db.ts`** — sql.js + IndexedDB initializer; pagehide listener for log flush (P105/A2).
- **`src/contexts/persistence/repositories/comprehensiveLogs.ts`** — heart of observability layer (ADR-126).
  - `LogEventType` union (line 25) — 15 types.
  - `VALID_LOG_EVENT_TYPES` const array (line 50) — mirror of migration 005 CHECK.
  - `validateEventType(t)` line 75 — strict validator + `patch_applied → patch_validation` alias remap; never throws.
  - `writeLogEvent(db, event)` line 231 — fire-and-forget per ADR-126 D4.
  - `writeErrorEvent(db, ctx, err, source)` line 277 — P107/A6 centralized error capture; calls `redactKeyShapes` on **both** `message` AND `stack`; truncates stack to 500 chars.
  - `writeEditHistory(db, entry)` line 305 — per-patch before/after snapshots.
  - `redactKeyShapes(s)` line 168 — strips `sk-ant-*` / `sk-proj-*` / `AIza*` / `Bearer ` (ADR-043 BYOK boundary).
  - `newRequestId()` line 155 — `crypto.randomUUID()` with Math.random fallback.
  - `flushLogsImmediate()` line 214 — forced-flush callers.
  - `pruneOldLogs()` / `pruneOldEditHistory()` (lines 340, 354) — 30/90-day retention.
- Other repos: `brandContext.ts`, `codebaseContext.ts`, `examplePrompts.ts`, `kv.ts`, `llmCalls.ts`, `llmLogs.ts`, `messages.ts`, `projects.ts`, `promptLibrary.ts`, `sessions.ts`, `userTemplates.ts`.
- **5/5 declared `event_type` values now have production writers post-P107** (ADR-135) — was 10/15 pre-P107: `multi_page_scope` (chatPipeline.ts:332), `decomp_split` (450), `todo_execution` (469), `export_emit` (ExportClaudeCodeButton.tsx:44 callback), `error_event` (writeErrorEvent helper at 4 chatPipeline catch sites).

## 8. ADR ground-truth

### ADR-120 — AGENT_ATOM (8th + final Crystal Atom; P94)

Decisions: (1) AGENT_ATOM closes AISP suite — no further atoms in open-core arc; (2) AISP Σ contract `agents: AgentSpec[]` with Γ R1 |agents| ≤ 7 + Γ R2 ≥1 DoD per agent + Γ R3 disjoint `ownedFiles` per wave + Ε V1 disjoint-ownedFiles invariant + V3 unique role per wave; (3) AgentProxy adapter only — `classifyAgents()` rules-based deterministic baseline + `buildAgentAtom()`/`parseAgentResponse()` LLM-handoff inert at P94; (4) prepares SpecWorkbench (P95) + Export Claude Code (P96) consumption.
Cross-refs: ADR-045 / ADR-053 / ADR-099 / ADR-118 / ADR-119.

### ADR-122 — Export Claude Code (Markdown Bundle; P96)

Decisions: (1) markdown bundle NOT ZIP per Q2 owner answer; (2) single `.md` with `# === FILE: <path> ===` markers + trivial post-process script splits to file tree; (3) the bundle IS the canonical Hey Bradley OUTPUT (workbench is a spec factory; code generation downstream — Claude Code/Cursor reads bundle and writes implementation in its own repo); (4) logical file set ≥6 (CLAUDE.md preamble + process-map.md + 3× human-spec + aisp/phase-aisp.md + adrs/ADR-{id}.md + agents/wave-{n}.md).
Cross-refs: ADR-101 / ADR-108 / ADR-110 / ADR-121.

### ADR-126 — Comprehensive LLM Interaction Logging (P100 W2)

Decisions: (1) two-table architecture — `log_events` (13 event_type values, 30-day retention) + `edit_history` (per-patch snapshots, 90-day retention); (2) three-level ID hierarchy `session_id → request_id → event_id` with `newRequestId()` minted at submit entry + threaded through all `writeLogEvent` calls; (3) BYOK trust boundary preserved — `redactKeyShapes` at every write boundary (event_data + before_snapshot + after_snapshot + user_prompt) per ADR-043; (4) fire-and-forget — every write try/catch wrapped, never throws upward, pipeline continues even if SQLite unavailable.
Cross-refs: ADR-016 / ADR-018 / ADR-074 / ADR-104.

### ADR-131 — Agentic Workbench RC Architecture (P101 / AW-RC)

Decisions: (1) RC ships at v2.0.0-RC1 with 3 modes routed + 8 atoms wired + 7-step methodology (Research / Decompose / Architect / Spec / Plan / Build / Reflect) + comprehensive log infra; (2) persona scoring acceptance HONEST not optimistic — Grandma 84 / Framer 84 / Lars 85 (3 floor breaches named, not papered); (3) 12-item carry-forward registry CF#1-3 CLOSED + CF#4-5 OWNER-REQUIRED + CF#6 TIER-2 + CF#7-12 P102 candidates; (4) SOTA composite 79–84/100 vs Lovable 80/100 (honest +0 to +4 vs SOTA per ADR-127 §C; was 88/100 OPTIMISTIC).
Cross-refs: ADR-082 / ADR-109 / ADR-116 / ADR-126 / ADR-128 / ADR-129 / ADR-130.

### ADR-133 — v2.0.0-RC1 Open Core Boundary (P103 / RC-RELEASE)

Decisions: (1) ship boundary — 3 modes routed + 8 Crystal Atoms wired + 132 ADRs Accepted + ~1320+ tests GREEN + 7-step methodology + 43 templates / 21 themes / 18 section types / 12 blog posts; (2) open-core scope — zero new deps beyond P84 baseline (no JSZip / archiver / Supabase / animation libs / full-markdown parsers) + sql.js + IndexedDB persistence + BYOK preserved + markdown bundle is headline output + byte-equivalent to v1.0.0-RC1 + Workbench surfaces; (3) Tier-2 deferrals NAMED — Supabase, multi-tenant teams, HNSW activation, AI-powered review, Commercial dashboard, native mobile, WCAG AAA, localization, build-time EOP pre-bake, live-LLM eval; (4) owner-required post-RC tasks — tag v2.0.0-RC1, CF#4 BYOK smoke ($0.05), CF#5 STT calibration, demo video, social posts, Agentics Foundation beta, AISP campaign; (5) carry-forwards CLOSED in P102 — CF#7 + CF#8 + CF#11 + CF#12 closed; CF#9 + CF#10 post-launch; (6) AISP versioning policy — `aisp-1.X` minor backward-compat, `aisp-2.0` major requires RFC.
Cross-refs (primary): ADR-082 / ADR-109 / ADR-122 / ADR-131 / ADR-132.
Cross-refs (secondary): ADR-104 / ADR-108 / ADR-126.

## What's MISSING (gaps for the connections layer to fill)

1. **No CLI / programmatic entry-point.** Every consumer is a React component or browser-only Vite-bundled module. `chatPipeline.submit`, `buildClaudeCodeBundle`, atom classifiers — all callable from Node only via `node:vm` workaround (P108/A10 finding for `validateEventType` in tests). The atoms transitively pull `migrations/index.ts` which uses `import.meta.glob` (Vite-only) via `db.ts` re-export chain.
2. **No NPX surface.** `package.json` has no `"bin"` entry; no `scripts` for `init / spec / export / score`. `dist/` is a Vite SPA build, not a library.
3. **No MCP server.** Zero `@modelcontextprotocol/*` deps; no `mcp.json`; no JSON-RPC stdio surface. Atoms exposed only as React-bound TS modules.
4. **No Claude Code plugin scaffold.** No `plugin.json`, no `SKILL.md` files, no hooks dir, no marketplace metadata.
5. **No standalone Rust crate.** AISP-related Rust lives in the separate `bar181/aisp-open-core` repo (referenced in CLAUDE.md but not vendored here); Hey Bradley repo is TS/TSX only.
6. **AGENT_ATOM `parseAgentResponse` LLM-handoff inert.** All 8 atoms ship deterministic rules baseline + LLM-handoff path scaffolded (`buildXAtom() + parseXResponse()`) but **inert** at v2.0.0-RC1 (CF#4 owner-required post-RC BYOK smoke). Connections layer must either (a) wait on owner BYOK activation or (b) supply its own LLM transport (Claude Code provides this natively for the plugin path).
7. **No δ-ambiguity scorer surface.** AISP `Ε` (Evaluation) blocks are present in atom Σ contracts but no public `scoreAmbiguity(spec): δ` helper exists in `src/`. ADR-053 references `<2% ambiguity discipline` but enforcement is contract-only, not measured.
8. **No hosted spec URL runtime.** `hostedSpecLink.ts` is `data:` URL only (locked D5). Connections layer wanting share-by-URL must layer hosting (deferred to Tier-2 commercial per ADR-133 D3).
9. **HNSW vector-DB not indexed.** Ruvector is manually-curated static snapshot (126 entries, 0 vectors); search via SQL `LIKE` only. Per ADR-133 D3 deferred to Tier-2.
10. **No stable public API contract.** Atoms re-export through 4+ barrel files (`aisp/index.ts` + `lib/specGenerators/index.ts` + `lib/schemas/index.ts` + `contexts/specification/types.ts`); no `@hey-bradley/core` package boundary; type stability not declared.
