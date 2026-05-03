# P101 / R3 — Security + Log Integrity Brutal Review

**Reviewer:** R3 (security + log integrity, 1 of 4 parallel)
**Branch:** `claude/verify-flywheel-init-qlIBr`
**Scope:** READ-ONLY audit of BYOK trust boundary, comprehensive log infra (P100 W2 / ADR-126), 8-atom param surface, and Claude Code export bundle.

---

## §1 BYOK trust boundary verification

**Redaction at write boundary** — `comprehensiveLogs.ts:122-126` (`safeStringifyRedacted`) wraps `JSON.stringify` then runs `redactKeyShapes` on the output. Called at:

- `comprehensiveLogs.ts:150` — `event_data` column on every `writeLogEvent`
- `comprehensiveLogs.ts:180` — `patch_applied` on `writeEditHistory`
- `comprehensiveLogs.ts:183-184` — `before_snapshot` + `after_snapshot` on `writeEditHistory`
- `comprehensiveLogs.ts:185` — `user_prompt` (raw `redactKeyShapes`, no stringify needed; column is `TEXT`)

**Key-shape regex coverage** (`comprehensiveLogs.ts:113-118`): 4 `sk-*` variants (Anthropic, OpenAI proj, OpenRouter, generic ≥20 char), `AIza` (Google, 35 char), `Bearer\s+\S+`. Mirrors `assumptionStore.ts:27-28` patterns. Does NOT cover HuggingFace `hf_*`, GitHub PAT `ghp_*`, xAI, Groq — see §5 P3-1.

**Pipeline-level pre-redaction** (defence-in-depth, `chatPipeline.ts`):
- `:326` — `input_event` `text` redacted before `emit()`
- `:327` — `listen_capture` `raw` + `cleaned` redacted before `emit()`
- `:567`, `:653` — `personality_display` `message` redacted

**`SENSITIVE_KV_KEYS` strip on `.heybradley` export** (`exportImport.ts:35-37` + `:100`): `byok_key` + `byok_provider` explicitly listed; `kv WHERE k LIKE 'byok_%' OR ...` prefix sweep. Per ADR-043 §4 this is "the single most important security guarantee in P17."

**No `process.env` / `VITE_*KEY` reads in any atom or repo file** — confirmed via `grep -rnE "process\.env|VITE_.*KEY"` on `src/`. Only legitimate hits are `pickAdapter.ts:23-26` (DEV warning + key bundling per ADR-043 §1) and `pickAdapter.ts:60` (`VITE_LLM_API_KEY` read for DEV). Production builds gate via `vite.config.ts` assertion (ADR-043 §1, status confirmed P20).

**Verdict §1:** BYOK boundary INTACT.

---

## §2 8-atom BYOK cleanliness

Per-atom signature audit (zero `apiKey` / `process.env` / `VITE_*` references in any atom file confirmed via `grep`):

| # | Atom | File | Public fns | Receives apiKey? | Output carries keys? |
|---|------|------|------------|------------------|----------------------|
| 1 | PATCH | (validator inlined `chatPipeline.ts`; AISP doc-ref only — `contentAtom.ts:20`) | applyPatches via configStore | NO | NO (JSON Patch shape only) |
| 2 | INTENT | `intentAtom.ts:147,159,166,186,195` | `isUnmeasurableGoal(text)`, `resolvePageReference()`, classifier | NO | NO (typed `ClassifiedIntent`) |
| 3 | SELECTION | `templateSelector.ts:41` | `TemplateSelection` type + `matchTemplates` | NO | NO (template IDs + scores) |
| 4 | CONTENT | `contentAtom.ts:33,75,83,90,118,152` | `validateGeneratedContent`, `isCleanContent` | NO | NO (typed `GeneratedContent`) |
| 5 | ASSUMPTIONS | `assumptionsAtom.ts:24,54,57` | `ASSUMPTIONS_ATOM` const + buildAssumptions | NO | NO; `assumptionStore.ts:27-28` enforces redaction at store boundary |
| 6 | DECOMP | `decompAtom.ts:25,69,93,237,282,284` | `decompose(text)`, `hasContradiction(utterance)` | NO | NO (typed `Todo[]`) |
| 7 | PROCESS | `processAtom.ts:107,139,221` | `classifyProcess(description: string)`, `buildProcessAtom`, `parseProcessResponse` | NO | NO (`ProcessAtomOutput`) |
| 8 | DDD | `dddAtom.ts:127,154,221` | `classifyContexts(description: string)`, `buildDDDAtom`, `parseDDDResponse` | NO | NO (`DDDAtomOutput`) |
| (9) | AGENT (8th, ADR-120) | `agentAtom.ts:49,145,185,280` | `classifyAgents(ctx: WaveContext)`, `buildAgentAtom`, `parseAgentResponse` | NO | NO (`AgentAtomOutput`) |

All atoms are pure functions of `string` / typed-context inputs. None accept an `apiKey` parameter; none read from `intelligenceStore` or BYOK kv. **AgentProxy adapters** are the sole consumers of `apiKey` (`claudeAdapter.ts:17`, `geminiAdapter.ts:18`, `openaiAdapter.ts:21`, `openrouterAdapter.ts:29`) — keys flow `LLMSettings → intelligenceStore → pickAdapter → adapter constructor`, never into the atom layer.

**Verdict §2:** 8-atom suite is BYOK-clean.

---

## §3 Log integrity audit

**CHECK enum** (`migrations/005-comprehensive-logs.sql:36-47`) — 15 values:
`input_event, intent_classification, decomposition, template_match, patch_validation, personality_display, listen_capture, multi_page_scope, process_atom_output, ddd_atom_output, error_event, response_summary, todo_execution, decomp_split, export_emit`.

**Repo-side type union** (`comprehensiveLogs.ts:15-32`) — identical 15 values; matches schema 1:1 (verified via `grep -nE "eventType:"` cross-walk).

**Writer coverage per event_type:**

| event_type | Writer site(s) | Status |
|---|---|---|
| `input_event` | `chatPipeline.ts:326` | WIRED |
| `intent_classification` | `chatPipeline.ts:398` | WIRED |
| `decomposition` | `chatPipeline.ts:432` | WIRED |
| `template_match` | `chatPipeline.ts:499` | WIRED |
| `patch_validation` | `chatPipeline.ts:466,509,553,646` | WIRED (4 stages) |
| `personality_display` | `chatPipeline.ts:567,653` | WIRED |
| `listen_capture` | `chatPipeline.ts:327` | WIRED |
| `multi_page_scope` | (no writer found) | **GAP — see §5 P2-1** |
| `process_atom_output` | `PlanningChatBar.tsx:55` | WIRED (P99 / A8) |
| `ddd_atom_output` | `PlanningChatBar.tsx:61` | WIRED (P99 / A8) |
| `error_event` | (no writer found) | **GAP — see §5 P2-2** |
| `response_summary` | `chatPipeline.ts:475,519,569,655,698` + `SpecWorkbench.tsx:238` (KISS-review) | WIRED (6 sites) |
| `todo_execution` | (no writer found at this event_type literal) | **GAP — see §5 P2-3** |
| `decomp_split` | (declared in schema + repo type, no writer) | **GAP — see §5 P2-4** |
| `export_emit` | (declared in schema + repo type, no writer) | **GAP — see §5 P2-5** |

**No event_type written but missing from CHECK** — all `eventType:` literals in `src/` are in the union (`grep -nE "eventType:"` enumerated PlanningChatBar + SpecWorkbench + chatPipeline call sites).

**Retention enforcement** — `pruneOldLogs(db, 30)` and `pruneOldEditHistory(db, 90)` exported (`comprehensiveLogs.ts:198, 212`) but **NEVER CALLED** in `src/` (verified via `grep -rn "pruneOldLogs\|pruneOldEditHistory" src/` — only definition lines hit). Retention is **DOC-ONLY**, not enforced. **See §5 P1-1.**

**Verdict §3:** Log integrity PARTIAL — schema/type alignment is clean; 5 `event_type` enum values lack writers; retention prune is unwired.

---

## §4 Export bundle key audit

**`buildClaudeCodeBundle`** (`exportClaudeCode.ts:179-224`) — input is a `PhaseCard` (typed at `SpecWorkbench.tsx`); **NO** `localStorage` / `sessionStorage` / `getItem` reads (verified via grep). Bundle is composed entirely from prop-passed `PhaseCard` fields:
- `phase.name`, `phase.phase`, `phase.status`, `phase.id` (string identifiers)
- `phase.humanSpec.{northStar,sadd,implementationPlan}` (prose)
- `phase.aispSpec` (verbatim AISP Σ block, math-symbolic)
- `phase.adrRefs[].{id,title,href}` (ADR pointers)
- `phase.sprints[].{name,status,agentCount,keyDeliverable,agentScopes,dod}` (sprint metadata)

Plus `buildTDDScaffold(phase)` output (`exportClaudeCode.ts:209`) — pure phase→markdown transform per ADR-128.

**`ExportClaudeCodeButton`** — calls `buildClaudeCodeBundle(phase)` then triggers `Blob` download. No BYOK read path.

**Sample fixture audit:**
- `src/data/sample-spec-workbench.ts` (149 LOC) — `HEY_BRADLEY_SAMPLE_PHASES` const; static spec text (P15-P20 phases). **Zero key shapes** (`grep -lE "sk-|AIza|Bearer\s+\w"` returned empty).
- `src/data/sample-process-map.ts` — same; zero key shapes.
- `src/data/examples/*.json` (43 fixtures) — zero key shapes (only false positive was the word "monitor" in a tags array, no `AIza`/`sk-` prefix). The `oss-library.json:210` mention of `process.env` is prose copy describing a fictional product; no actual env-var read.

**`SENSITIVE_KV_KEYS` does NOT need to gate this export path** because the export is composed from `PhaseCard` props, not from kv reads. The `.heybradley` archive export (`exportImport.ts`) is a separate, DB-level export path that DOES strip `byok_*` per ADR-043 §4.

**Verdict §4:** Export bundle is structurally key-free.

---

## §5 Findings

### P1 (blocking)

**P1-1 — Retention prune unwired.** `pruneOldLogs` (`comprehensiveLogs.ts:198`) and `pruneOldEditHistory` (`comprehensiveLogs.ts:212`) are exported but never called anywhere in `src/`. The 30-day / 90-day retention claims in ADR-126 + the schema header comment (migration 005:1-30) are **doc-only**. A user running the app for months will accumulate unbounded `log_events` and `edit_history` rows, increasing the SQLite blob size and (more importantly) widening the BYOK exposure window if redaction ever has a regex miss. **Fix:** wire `pruneOldLogs(db, 30)` + `pruneOldEditHistory(db, 90)` into a startup hook (e.g. after migration runner in `db.ts` boot) or into a session-end hook. ≤10 LOC.

### P2 (should-fix)

**P2-1 — `multi_page_scope` declared, never written.** Schema (`migrations/005:38`) + type (`comprehensiveLogs.ts:23`) declare it; no `emit()` site. Either remove from CHECK + union or add an emit at `chatPipeline.ts` after `getActivePage(config, activePageId)` resolution (`:319`).

**P2-2 — `error_event` declared, never written.** Schema (`:39`) + type (`:26`). Pipeline catches errors via `pipelineErrorKind` (`:698` `errorKind` field on `response_summary`) but never emits a typed `error_event`. Either drop from enum or wire into the canned-fallback / catch sites.

**P2-3 — `todo_execution` declared, never written.** Schema (`:40`) + type (`:28`). `todoExecutor.ts` runs decomposed todos (P74 / OC-DECOMP) but emits `response_summary` at `chatPipeline.ts:475` instead of the typed `todo_execution` event. Either drop from enum or thread emit through `todoExecutor`.

**P2-4 — `decomp_split` declared, never written.** Schema (`:46`) + type (`:31`). The P100 W2 / FMT-VERIFY / D1 fix added these enum values "to admit fixture event types that were silently rejected" (schema comment :42-44) — but no writer materialized in src/. Either wire in `decompAtom.decompose` callers or drop from enum.

**P2-5 — `export_emit` declared, never written.** Same as P2-4 (`exportClaudeCode.ts` does not call `writeLogEvent`). Wiring would close the symmetry between "user submits in Planning" (currently logged) and "user exports a bundle" (currently invisible to forensics).

**P2-6 — `redactKeyShapes` regex coverage gap vs ADR-043 §statusP20.** ADR-043 status (line 115): "Husky pre-commit guard covers 9 key-shape patterns." `comprehensiveLogs.ts:113-118` covers 6. Missing: HuggingFace `hf_`, GitHub PAT `ghp_`, Groq, xAI, OpenRouter `sk-or-` (partially covered by generic `sk-` fallback at :116). Defence-in-depth means runtime redaction should match commit-time redaction. **Fix:** add 3-4 regex lines mirroring `scripts/check-no-leaked-keys.mjs` patterns (verify list against that script).

### P3 (notes)

**P3-1 — Math.random fallback in `newRequestId`** (`comprehensiveLogs.ts:103-106`). Acceptable for a request-correlation ID (not cryptographic), but worth a comment that this is non-cryptographic. Already labeled "for older harnesses" — minor.

**P3-2 — `safeStringifyRedacted` swallows non-stringifiable values** (`comprehensiveLogs.ts:124`) → emits `"[unstringifiable]"`. Forensics signal lost. Consider including the type name (`typeof value`) in the fallback.

**P3-3 — `getEventsForRequest` does NOT re-redact on read** (`comprehensiveLogs.ts:228-243`). Defence-in-depth would re-run `redactKeyShapes` on the parsed `eventData` before returning, in case a future writer bypassed the redacted helper. Currently safe (all writes go through `safeStringifyRedacted`) but brittle.

**P3-4 — `redactKeyShapes` is exported from BOTH `comprehensiveLogs.ts:110` AND `intelligence/llm/keys.ts`.** Two definitions. They MUST stay in sync; one source of truth would be safer. The codebase already imports `keys.ts:redactKeyShapes` in 6 files (RequestDrillDown, ConversationLogTab, useListenPipeline, promptLibrary, brandContext, codebaseContext) and `comprehensiveLogs.ts:redactKeyShapes` only internally. Re-export from one canonical site.

---

## §6 Verdict

| Question | Answer |
|---|---|
| BYOK boundary intact? | **YES** — atoms clean, redaction at every text-write boundary, export-strip on `.heybradley`, no key shapes anywhere in `src/` |
| Log integrity? | **PARTIAL** — schema/type aligned, 5 of 15 `event_type` values have no writer (P2-1..P2-5), retention prune unwired (P1-1) |
| Export safety? | **PASS** — Claude Code bundle composes from typed `PhaseCard` props only; zero localStorage reads; sample fixtures key-free |
| Overall security RC-ready? | **PASS** with ONE blocker (P1-1 retention prune) |

P1: 1 · P2: 6 · P3: 4

**Recommendation:** Land P1-1 (retention prune wire) before RC tag. P2-1..P2-5 are integrity-of-schema items — ship as a single follow-up "log enum housekeeping" patch (either wire all 5 emit sites, or drop the unused values). P2-6 hardens redaction to match commit-time guard. P3-* are post-RC polish.

The BYOK trust boundary is structurally sound: atoms cannot see keys, the export bundle cannot exfiltrate keys, and the log-write redaction is called at every observed boundary. The integrity gaps are about completeness of the log surface, not about leakage.
