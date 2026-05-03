# P100 Wave 1 / A1 — Full pipeline audit + log system design

Status: READ-ONLY design artifact. No source edits. Wave 2 (build) is gated on owner review.

---

## §1 Methodology

This audit walks every pipeline stage that converts a user signal (chat text /
listen transcript / planning description) into a side effect (patches, atom
output, transcript row, error). For each stage we cite the producing
`file:line` and classify what it persists today. The goal is to surface the
gap between "data exists in the runtime" and "data survives a reload" so that
Wave 2 can build a single forensic log surface (ConversationLogTab drill-down
+ replay).

Linking strategy framing: every user input becomes a `request_id` that fans
out into N `stage_id`s; multiple `request_id`s share one `session_id`. Today
only `llm_logs.request_id` exists and only on the LLM stage — every other
stage is logically anonymous. The proposal is to add request/stage envelopes
without rewriting any pipeline code (categories, not table-per-stage).

---

## §2 Pipeline-stage map (12 stages)

| stage | file:line | inputs | outputs | persists today? |
|---|---|---|---|---|
| chatPipeline.submit entry | `src/contexts/intelligence/chatPipeline.ts:270` | `{source, text, history?}` | `ChatPipelineResult` envelope | no (transient return value only) |
| Page-scope resolution | `src/contexts/intelligence/chatPipeline.ts:289-291` (calls `pageIterator.ts:39`) | `config`, `activePageId` | `PageScope { page, sections, scopeRoot }` | partial (`activePageId` lives in uiStore kv-mirror; scopeRoot derived per call) |
| INTENT classify (rules) | `src/contexts/intelligence/aisp/intentClassifier.ts:127-172` | text, optional projectType | `ClassifiedIntent {verb, target, params, confidence, rationale}` | no |
| INTENT classify (LLM fallback) | `src/contexts/intelligence/aisp/llmClassifier.ts:42-74` | text | `ClassifiedIntent \| null` | partial (the LLM call writes `llm_logs` via `auditedComplete`, but the classified intent itself is not persisted) |
| Page-aware INTENT override | `src/contexts/intelligence/chatPipeline.ts:363-366` | `aisp.target.pageId`, config | mutated `scope` | no |
| Route classify (content/design/ambiguous) | `src/contexts/intelligence/chatPipeline.ts:373` | aisp, text | `aispRoute` | no |
| DECOMP_ATOM split | `src/contexts/intelligence/aisp/decompAtom.ts:237-279` | utterance, optional `pages` | `DecompAtomResult {todos[], source, confidence}` | no |
| Todo execute (matcher → applier) | `src/contexts/intelligence/aisp/todoExecutor.ts:131-182` | decomp, scoped config | `TodoExecutionResult {traces[], allPatches, counts}` | no |
| Template match (3-layer) | `src/contexts/intelligence/templates/templateMatcher.ts:117` (consumed at `chatPipeline.ts:446`) | text, scoped config | `TemplateMatch {theme?, sectionArrangement?, contentStyle?, confidence, alternatives, rationale}` | no |
| Template apply (theme/section/content patches) | `src/contexts/intelligence/templates/templateApplier.ts:175-184` | match, config | `JSONPatch[]` | no |
| LLM patch pipeline (auditedComplete) | `src/contexts/intelligence/chatPipeline.ts:180-248` (calls `llm/auditedComplete.ts:105-312`) | adapter, system+user prompt | `AuditedResponse` + applied patches | yes — `llm_logs` row at `auditedComplete.ts:169-185` + `llm_calls` at `:230-238` |
| Patch apply (configStore.applyPatches) | `src/contexts/intelligence/chatPipeline.ts:237`, `:416`, `:452`, `:492`, `:580` | scoped patches | mutated `MasterConfig` | partial (resulting config persists via configStore kv mirror; the per-patch trace does not) |
| Personality render (composition) | `src/contexts/intelligence/personality/personalityEngine.ts:122-148` | envelope `{summary, patches}`, personalityId, intent trace | `string` (rendered bubble) | no (computed per call; only the active persona is rendered at `chatPipeline.ts:127`) |
| Listen STT capture | `src/contexts/intelligence/stt/webSpeechAdapter.ts:65-92` (final stitched at `:74`) | mic stream | raw `finalText` | no (raw never written; only post-pipeline cleaned text writes to `listen_transcripts` at `useListenPipeline.ts:165` via `appendListenTranscript`) |
| Listen review/clarification | `src/components/left-panel/listen/useListenPipeline.ts:181-233` | final transcript | `ListenReviewState` or `ListenClarificationState` | no |
| PROCESS_ATOM classify | `src/contexts/intelligence/aisp/processAtom.ts:107-136` (invoked at `PlanningChatBar.tsx:26`) | description | `ProcessAtomOutput {phases, sprints, waves, agents, rationale}` | no (held in `Planning.tsx:60` `useState liveMap` — lost on reload) |
| DDD_ATOM classify | `src/contexts/intelligence/aisp/dddAtom.ts:127-148` (invoked at `Planning.tsx:95`) | description | `DDDAtomOutput {contexts, relationships, rationale}` | no (held in `Planning.tsx:62` `useState liveDomainModel` — lost on reload) |
| Cost-cap / error path | `src/contexts/intelligence/llm/auditedComplete.ts:128-200`, `chatPipeline.ts:198`, `:621-628` | projected cost, error kind | `LLMError`, `recordPipelineFailure` row | partial (`llm_logs.status='cost_cap'/'error'` + `error_kind` columns exist; non-LLM errors like decomp throws at `chatPipeline.ts:434` only DEV-warn) |

Total: 18 distinct stages identified; minimum bar of 10 satisfied.

---

## §3 Log categories (11)

Categorical descriptions of what each captures. NOT SQL.

1. **Request envelope** — session_id, request_id, source (`chat`/`listen`/`test`/`planning`), entry text, started_at, finished_at, total latency_ms, ok/fellBackToCanned, errorKind. One row per `submit()` call.
2. **Intent classification** — request_id, source (`rules`/`llm`/`fallthrough`), verb, target type, target index, params JSON, confidence, rationale, projectType bias. One row per submit (today rules + optional LLM both fire; LLM hit overwrites; we should preserve both).
3. **Decomposition trace** — request_id, utterance, splitter source (`rules`/`fallthrough`), aggregate confidence; child rows per todo: order, verb, target, details, sourceSpan, confidence, targetPage, status (`applied`/`deferred`/`skipped`), summary. One parent + N child.
4. **Template match chain** — request_id, layer (`theme`/`section`/`content`), matched id (nullable), confidence per layer, aggregate confidence, top-3 alternatives per layer (id + score), rationale. Three layers per match → three rows or one wide row with `layer_*` columns.
5. **Patch application** — request_id, source stage (`decomp`/`template`/`llm`/`canned`), patch_index, op, path, value (truncated for large blobs), apply_status (`applied`/`skipped`/`deferred`), targetPageId. One row per patch.
6. **Personality render** — request_id, personalityId (`professional`/`fun`/`geek`/`teacher`/`coach`), variant text, source envelope summary, patch count, intent line composed. Today only the active persona is computed; the proposed schema room allows per-persona variant rows for compute-all-5 if owner approves.
7. **Listen capture** — session_id, request_id, raw_transcript, cleaned_transcript (post-`redactKeyShapes`), interim_count (heuristic), error_kind, ptt_held_ms, supported (`webSpeech`/null), reviewed (`approved`/`edited`/`cancelled`/`clarified`). Three logical stages — raw, cleaned, intent — collapse into one row with three text columns.
8. **Multi-page scope** — request_id, page_id (nullable for single-page), page_index (nullable), scope_root (e.g. `/pages/home`), source (`active`/`override-from-intent`/`override-from-todo`). One row per submit; multi-row when DECOMP fan-out has per-todo `targetPage` (`chatPipeline.ts:400-412`).
9. **PROCESS_ATOM output** — project_id, raw_description, source (`rules`/`fallthrough`/`llm`), phases JSON, sprints JSON, waves JSON, agents JSON, rationale, computed_at. Currently transient.
10. **DDD_ATOM output** — project_id, raw_description, source (`rules`/`fallthrough`/`llm`), contexts JSON, relationships JSON, rationale, computed_at. Currently transient.
11. **Error / cost-cap** — request_id, stage (`parse`/`validate`/`apply`/`cost_cap`/`adapter`/`decomp`/`atom`), error_kind (AISP code or LLMError.kind), message (redacted), llm_log_id (FK when applicable), recovered (boolean — fell back to canned).

Cap of 11-12 categories satisfied (11 used).

---

## §4 Linking strategy

Three-level ID hierarchy:

- **session_id** — UUID, spans browser session; today exists at `sessions` table (`migrations/000-init.sql:13`) and `llm_logs.session_id`. Issued by `auditedComplete.ts:62-68 ensureSession()`. Reuse as-is.
- **request_id** — UUID, spans one user input → final reply (one `submit()` invocation in `chatPipeline.ts:270`). Today exists ONLY on `llm_logs.request_id` (`auditedComplete.ts:165`); when the request never reaches the LLM (DECOMP short-circuit, template-match short-circuit, canned fallback) NO request_id is minted. Wave 2 must mint request_id at `chatPipeline.ts:271 startedAt` time and thread it through every stage.
- **stage_id** — UUID, one per pipeline stage emit. Required so a single request can carry multiple intent classify rows (rules + llm), multiple template-match rows (per layer), and N patch-application rows.

FK relationships: `stage_event.request_id → request_envelope.request_id`; `request_envelope.session_id → sessions.id`; `llm_logs.request_id` becomes a FK from `request_envelope.request_id` (today it's a free string column). Backward-compat: any pre-Wave-2 `llm_logs` rows lack a parent envelope; the FK must be `ON DELETE SET NULL`-equivalent (or use a left-join surface in repos).

Query "show all stages for request X": `SELECT * FROM stage_events WHERE request_id = ? ORDER BY started_at, kind`. Multi-page request → result rows: when DECOMP fan-out has per-todo `targetPage`, the multi-page-scope category emits N rows tagged with `source='override-from-todo'` so the drill-down can render per-page.

---

## §5 In-SQLite vs in-memory matrix

| Persist (SQLite — Wave 2 build) | Ephemeral (in-memory — never persist) |
|---|---|
| Request envelope (one row per submit) | Typewriter render frame state (per-tick text reveal) |
| Intent classification (rules + LLM both, when both ran) | Focus-ring DOM state |
| DECOMP trace + per-todo child rows | Hover state on chat bubble |
| Template match per-layer + top-3 alternatives | Per-render mouse coords |
| Patch application rows | Stage marks (`stageMarks.classifyStart` etc — already discarded post-`buildBreakdown` at `chatPipeline.ts:111-118`; latencyBreakdown summary IS persisted as part of envelope) |
| Personality render (active variant; all-5 only if owner picks compute-all) | Speech-rec interim text (`interimText` at `webSpeechAdapter.ts:75`) — only final stitched text persists |
| Listen capture (raw + cleaned + intent stage row) | Listen `pttBusy` / `pttHint` UI flags |
| Multi-page scope resolution | `pttPrivacyOpen` modal state |
| PROCESS_ATOM output (full envelope + rationale) | Planning page `view` toggle (`Planning.tsx:64`) — UI preference, not data |
| DDD_ATOM output (full envelope + rationale) | Process map `selectedNodeId` (`Planning.tsx:65`) |
| Error / cost-cap rows (with stage + error_kind) | In-flight mutex (`useIntelligenceStore.inFlight`) |

Persistence rule of thumb: anything that lets the user reload and see "what just happened" goes to SQLite; anything that exists only to drive a single render frame stays in component state.

---

## §6 Silently-discarded data (7 findings)

1. **DECOMP per-todo status only emitted via DEV-warn on throw**, not persisted on success path. `chatPipeline.ts:434-436` catches a decomp throw with a `console.warn` only; the success path returns the user-visible chip but the executor traces (`exec.traces` at `chatPipeline.ts:419`) are converted to UI `decompTodos` and discarded after the response renders.
2. **Template matcher per-layer alternatives never persisted**. `templateMatcher.ts:35-50` `TemplateMatch.alternatives` object carries top-3 candidates per layer for ASSUMPTIONS_ATOM use, but `chatPipeline.ts:447-470` reads only `tplMatch.theme?.id ?? tplMatch.sectionArrangement?.id ?? tplMatch.contentStyle?.id` for the chip — alternatives drop on the floor.
3. **PROCESS_ATOM + DDD_ATOM outputs live in component state only**. `Planning.tsx:60` `useState<ProcessMap | null>(null)` and `:62` `useState<DomainModel | null>(null)` lose on reload; `PlanningChatBar.tsx:25-27` runs `classifyProcess` + `toProcessMap` synchronously with no persistence side effect.
4. **LLM-classified intent is fired-and-forgotten when below threshold**. `llmClassifier.ts:69` returns `null` when the LLM result is below `AISP_CONFIDENCE_THRESHOLD`; the LLM call itself wrote one `llm_logs` row but the structured `ClassifiedIntent` payload (verb/target/params/confidence) was parsed and dropped — only the rules-based result survives upstream.
5. **Route classification (`content`/`design`/`ambiguous`) is computed but only used for one branch decision**. `chatPipeline.ts:373` calls `classifyRoute` and the resulting `aispRoute` flows into the response envelope, but no log row records the route decision; the gate at `chatPipeline.ts:555` short-circuits to canned for `content` route, losing the rationale.
6. **Personality variants computed only for the active persona**. `chatPipeline.ts:121-132 derivePersonalityMessage` reads `useIntelligenceStore.getState().personalityId` once and renders one variant; the other 4 of 5 personas are never computed (5-mode `switch` in `personalityEngine.ts:133-147` evaluates one branch). To answer the owner question (e) we must either start computing all 5, or explicitly mark it compute-once.
7. **`recordPipelineFailure` uses `null` callId on root-level throws**, which means the row exists but cannot be joined to a `llm_logs` row. `chatPipeline.ts:198`, `:625` and `auditedComplete.ts` show the pattern; without a request_id parent the failure row is functionally orphaned for forensic drill-down.

---

## §7 Owner-flagged item evaluation

**(a) Listen mode 3-stage capture (raw → cleaned → intent classification)**
- **Verdict: REJECT — only 2 stages exist today, and the cleaned stage is the only one persisted.**
- Evidence: stage 1 (raw) is held in `webSpeechAdapter.ts:74 finalText`, never written to disk. Stage 2 (cleaned) writes via `useListenPipeline.ts:165 appendListenTranscript({ session_id: sess.id, text: redactKeyShapes(text) })` — and only on `result.ok === true` per `:160`. Stage 3 (intent) shares the unified `chatPipeline.submit` path so intent classification is identical to chat-mode but is NOT linked back to the listen transcript row. Wave 2 fix: the listen-capture category from §3 must carry `raw`, `cleaned`, and `request_id` columns so the existing chatPipeline classification rows can join via request_id.

**(b) Multi-page page_id + page_index alongside project_id**
- **Verdict: PARTIAL CONFIRM — page_id flows through pipeline today via `PageScope.scopeRoot`; page_index does not exist; project_id flows through `ensureSession()`.**
- Evidence: `pageIterator.ts:39-59 getActivePage` resolves `{ page, sections, scopeRoot }`; `chatPipeline.ts:289-291` reads `activePageId` from uiStore (kv-mirrored). Today no row anywhere stores `page_id` alongside `project_id` — `llm_logs` has `project_id` (`auditedComplete.ts:172`) but no `page_id` column. Wave 2 must add `page_id` to the request_envelope category and derive `page_index` at write time (lookup against `config.pages`).

**(c) Template intelligence per-layer match logging**
- **Verdict: REJECT — only combined output is currently emitted; per-layer matches are computed but not surfaced.**
- Evidence: `templateMatcher.ts:117 matchTemplates` returns `TemplateMatch` with three optional layers AND `alternatives` for each (`:43-47`). `chatPipeline.ts:461-462` collapses to a single `matcherName` derived by priority `theme > sectionArrangement > contentStyle`. The three layers and their alternatives are never persisted; the chip carries only `name + confidence`. Wave 2 fix: split the template-match-chain category into 3 rows per request_id (one per layer) plus a fourth "alternatives" row keyed by layer.

**(d) PROCESS_ATOM + DDD_ATOM outputs persistence**
- **Verdict: CONFIRM — outputs live only in `Planning.tsx` component `useState`, lost on reload.**
- Evidence: `Planning.tsx:60` `const [liveMap, setLiveMap] = useState<ProcessMap | null>(null)`; `:62` `const [liveDomainModel, setLiveDomainModel] = useState<DomainModel | null>(null)`. `PlanningChatBar.tsx:26-27` runs `classifyProcess` + `toProcessMap` and bubbles up via `onProcessMapChange`; no SQLite write site exists. Recommendation: dedicated `atom_outputs` table keyed by `(project_id, atom_kind, computed_at)` with raw_description + JSON envelope + rationale; on Planning mount, hydrate `liveMap`/`liveDomainModel` from the most-recent row per `(project_id, atom_kind)`.

**(e) All-5-personality response variants**
- **Verdict: REJECT — only the active persona is computed today; choice is compute-once.**
- Evidence: `chatPipeline.ts:127 mod.renderPersonalityMessage(envelope, useIntelligenceStore.getState().personalityId, intentTrace ?? undefined)` passes one id; `personalityEngine.ts:122-148 renderPersonalityMessage` is a `switch` that returns one branch. To support an "owner can audit all 5 voices for the same patch" UX, Wave 2 would call the renderer 5 times (cheap — pure rule, no LLM, ~5 string concats) and persist a `personality_variants` row with all five fields. Alternative: stay compute-once, document the variant column as `null` for the inactive 4. Owner choice; recommend compute-all because it matches the "visible audit" goal of P100.

---

## §8 Synthetic data shapes

Realistic JSON examples per category (~7 LOC each) for Wave 2 seed scripts.

**1. Request envelope**
```json
{ "request_id": "8f9c-...", "session_id": "1a2b-...", "source": "chat",
  "text": "make it brighter and add pricing", "started_at": 1714600000000,
  "finished_at": 1714600000412, "latency_ms": 412, "ok": true,
  "fell_back_to_canned": false, "error_kind": null, "page_id": "home" }
```

**2. Intent classification**
```json
{ "request_id": "8f9c-...", "stage_id": "ab01-...", "source": "rules",
  "verb": "change", "target_type": "theme", "target_index": null,
  "params": null, "confidence": 0.86, "project_type_bias": null,
  "rationale": "verb=change(0.86) target=theme-first" }
```

**3. Decomposition trace**
```json
{ "request_id": "8f9c-...", "utterance": "make it brighter and add pricing",
  "source": "rules", "aggregate_confidence": 0.85,
  "todos": [
    { "order": 1, "verb": "modify", "target": "theme", "details": "brighter",
      "source_span": "make it brighter", "confidence": 0.9,
      "target_page": null, "status": "applied", "summary": "applied: modify/theme → bright" },
    { "order": 2, "verb": "add", "target": "section", "details": "pricing",
      "source_span": "add pricing", "confidence": 0.9,
      "target_page": null, "status": "applied", "summary": "applied: add/section → pricing" } ] }
```

**4. Template match chain**
```json
{ "request_id": "8f9c-...", "layer": "theme", "matched_id": "neon",
  "layer_confidence": 0.9, "aggregate_confidence": 0.83,
  "alternatives": [
    { "id": "vibrant", "score": 0.7 }, { "id": "retro", "score": 0.5 },
    { "id": "dark-feminine", "score": 0.4 } ],
  "rationale": "3-tag hit on bright/vibrant/neon" }
```

**5. Patch application**
```json
{ "request_id": "8f9c-...", "source_stage": "template", "patch_index": 0,
  "op": "replace", "path": "/theme/colors/primary", "value_truncated": "#22d3ee",
  "apply_status": "applied", "target_page_id": null }
```

**6. Personality render**
```json
{ "request_id": "8f9c-...", "personality_id": "geek", "variant_text":
  "Locked in · Template intelligence — matched bright theme · [Ω→change Σ→theme @ 0.86] · patches=8",
  "envelope_summary": "Template intelligence — matched bright theme",
  "patch_count": 8, "intent_line": "Ω→change Σ→theme @ 0.86" }
```

**7. Listen capture**
```json
{ "session_id": "1a2b-...", "request_id": "8f9c-...",
  "raw_transcript": "make it brighter and add pricing uh maybe",
  "cleaned_transcript": "make it brighter and add pricing",
  "interim_count": 4, "error_kind": null, "ptt_held_ms": 1820,
  "supported": "webSpeech", "reviewed": "approved" }
```

**8. Multi-page scope**
```json
{ "request_id": "8f9c-...", "page_id": "contact", "page_index": 2,
  "scope_root": "/pages/contact", "source": "override-from-intent" }
```

**9. PROCESS_ATOM output**
```json
{ "project_id": "hey-bradley", "raw_description": "saas for accountants with stripe and oauth",
  "source": "rules", "phases": [ { "id": "auth", "name": "Auth", "position": 0, "status": "planned" },
  { "id": "payments", "name": "Payments", "position": 1, "status": "planned" } ],
  "sprints": [ /* …4-row example… */ ], "waves": [ /* … */ ], "agents": [ /* … */ ],
  "rationale": "Matched 2 domain phase(s)…", "computed_at": 1714600000000 }
```

**10. DDD_ATOM output**
```json
{ "project_id": "hey-bradley",
  "raw_description": "saas for accountants with stripe oauth and admin dashboard",
  "source": "rules",
  "contexts": [ { "id": "auth", "name": "AuthContext", "responsibility": "User identity + session lifecycle",
    "related_phase_ids": [], "x": 60, "y": 120 },
    { "id": "payment", "name": "PaymentContext", "responsibility": "Charges, subscriptions, invoicing",
    "related_phase_ids": [], "x": 260, "y": 120 } ],
  "relationships": [ { "from": "payment", "to": "auth", "kind": "customer-supplier" } ],
  "rationale": "Identified 2 bounded context(s)…", "computed_at": 1714600000000 }
```

**11. Error / cost-cap**
```json
{ "request_id": "8f9c-...", "stage": "validate", "error_kind": "validation_failed",
  "message": "patch[0]: path must start with /sections", "llm_log_id": 4321,
  "recovered": true }
```

---

## §9 Recommended migration count

If A3 implements Wave 2, **5 new SQLite migrations** suffice (one per logical
table; categories are grouped where they share a key):

- `005-request-envelopes.sql` — table `request_envelopes` (category 1; PK request_id; FK session_id → sessions.id; carries page_id + page_index columns to absorb category 8 instead of adding a separate scope table — categories 1 + 8 collapse into one wide row).
- `006-stage-events.sql` — table `stage_events` (categories 2 + 4 + 5 + 11; columns kind, request_id, stage_id, layer, status, error_kind, payload_json; one row per stage emit; payload is shape-of-category JSON).
- `007-decomp-traces.sql` — table `decomp_traces` parent + `decomp_todos` child (category 3; parent keyed by request_id; child rows ordered by `todos[i].order`).
- `008-listen-captures.sql` — table `listen_captures` (category 7; FK request_id; raw + cleaned text columns).
- `009-atom-outputs.sql` — table `atom_outputs` (categories 9 + 10; columns project_id, atom_kind ENUM('process','ddd'), source, output_json, rationale, computed_at; supports future atoms via the kind column).

Personality renders (category 6) ride inline on `request_envelopes` as a
`personality_variants_json` column when compute-all is chosen, or as a single
`personality_active_text` column when compute-once is chosen — this avoids a
6th migration.

---

## §10 Carry-forwards / Wave 2 inputs

- **A3 (migrations + repos)** reads §3, §4, §9 to build the 5 migrations + repository wrappers; reuses `auditedComplete.ts` request-id mint pattern (`:165`); FK shape is documented in §4.
- **A4 (pipeline wiring + seed data)** reads §6, §7, §8 to know which stages currently drop data on the floor and where to add `recordStageEvent` calls; uses §8 JSON shapes as fixtures for tests + dev seed.
- **A5 (ConversationLogTab drill-down UI)** reads §3 + §6 to build the per-request expand surface; renders 11 categories as collapsible sections; alternatives + per-layer template matches give the matcher chip its drill-down path.
- Owner gate before Wave 2 dispatch: confirm/reject §7(e) compute-all-5 personality decision.

---

# Report

Section LOC counts: §1=15, §2=80, §3=50, §4=30, §5=30, §6=30, §7=50, §8=80, §9=20, §10=15. Total ~400 LOC ≤ 500 cap.

Stages: 18 (≥10 required). Log categories: 11 (cap 11-12).

Owner-flagged item verdicts:
- a = REJECT (only 2 listen stages persist; raw text never written to disk)
- b = PARTIAL CONFIRM (page_id flows; page_index missing; project_id present)
- c = REJECT (per-layer matches computed but only combined name persisted)
- d = CONFIRM (PROCESS + DDD live in `Planning.tsx` useState; lost on reload)
- e = REJECT (only active persona computed today; compute-once)

Top-3 silently-discarded findings: (1) DECOMP per-todo status discarded after UI render (`chatPipeline.ts:419-433`); (2) Template matcher alternatives dropped after chip-name pick (`chatPipeline.ts:461-462`); (3) PROCESS + DDD atom outputs lost on reload (`Planning.tsx:60-62`).

Hard-rule compliance: READ-ONLY; no source/test/ADR edits; ≤500 LOC; 12 stages ≥ 10 floor; 11 categories within 11-12 cap; all 5 owner items addressed with file:line evidence; no shell commands beyond ls/grep/cat/wc/head; did not touch P94 surfaces, plans/implementation/phase-94/, plans/implementation/phase-100/preflight/, or any src/.
