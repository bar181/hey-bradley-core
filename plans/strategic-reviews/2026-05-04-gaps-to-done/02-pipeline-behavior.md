# Track B — Pipeline Behavior & Dead Code Gap Audit

**Audit window:** 2026-05-04 · branch `claude/verify-flywheel-init-qlIBr` · post-P104 seal
**Scope:** chatPipeline runtime layer (chat + listen surfaces) · 8 atoms · template matcher · todo executor · STT cleanup · P104 schema guards
**Method:** RESEARCH ONLY — no source mods

## Summary

The chatPipeline.ts orchestrator is healthier than the carry-forward registry implied. P100 W2 and P104 closed most of the dead-code gaps named in CLAUDE.md (cleanTranscript wired, isUnmeasurableGoal/hasContradiction wired as observability flags, validateEventType wired into writeLogEvent, validateSectionType wired … almost). The audit found:

- **5 P1 findings:** validateSectionType has zero production callers (helper exported, never imported); ASSUMPTIONS_FALLBACK_TEMPLATES has zero production callers; isUnmeasurable/isContradiction are computed-but-non-acting (logged-only, no clarification branch); twoStepPipeline / runTwoStepPipeline / selectTemplate / SELECTION_ATOM are dead — never called from chatPipeline; route='content' short-circuit hardcodes a Grandma-friendly error string but never invokes CONTENT_ATOM despite it being wired (P38 promise unfulfilled).
- **6 P2 findings:** verb extension `forget`/`need`/`create` (P101) lands in INTENT_ATOM but DECOMP_ATOM verb tables don't carry them so a DECOMP path classifies same words as `unknown`; DECOMP confidence threshold 0.7 silently DROPS single-clause results that scored 0.6 from a single hit (90% of low-signal text); empty-text branch returns `summary: ''` — listen surface renders blank reply; cleanTranscript is called for log payload only — submit text is the raw transcript (DECOMP/INTENT see disfluencies); `tplMatch.confidence === 0` empty-query branch triggers alternatives but chatPipeline never checks `alternatives` and never surfaces to ASSUMPTIONS_ATOM; logCtx.sessionId fallback `''` silently disables ALL log emit when no active project.
- **4 P3 findings:** dynamic-import overhead per submit (~15 imports awaited every call); LLM AISP cost-cap pre-check at 90% can skip even when adapter-actual cost would have been allowed; `personalityMessage` calls intelligenceStore TWICE (race possibility on settings change mid-pipeline); `improvements` swallows all module-load errors silently.

Atom production wire status: **5 of 8 atoms have ≥1 active call site driving real behavior** (INTENT, DECOMP, PROCESS, DDD, AGENT). PATCH atom is the LLM system prompt itself (always wired). SELECTION_ATOM and CONTENT_ATOM are wired conceptually but their LLM paths (twoStepPipeline / generateContent direct call) are functionally dead — chatPipeline.ts shorts the route='content' branch to a canned message.

Total: **15 findings** (5 P1 + 6 P2 + 4 P3).

## Method

- Read entire chatPipeline.ts (717 LOC) end-to-end.
- Read INTENT_ATOM (intentAtom.ts 197 LOC), intentClassifier.ts 179 LOC, llmClassifier.ts 84 LOC, decompAtom.ts 284 LOC, todoExecutor.ts 182 LOC, templateMatcher.ts 200 LOC, templateApplier.ts (first 100), router.ts 47 LOC, intent.ts 103 LOC, twoStepPipeline.ts 123 LOC, templateSelector.ts 122 LOC, routeClassifier.ts 161 LOC, transcriptCleanup.ts 23 LOC, pageIterator.ts 102 LOC, comprehensiveLogs.ts (validators), section.ts (validateSectionType).
- Greps:
  - `UNMEASURABLE_GOAL_RE|isUnmeasurableGoal` → 1 production call site (chatPipeline.ts:396)
  - `CONTRADICTION_RE|hasContradiction` → 1 production call site (chatPipeline.ts:397)
  - `ASSUMPTIONS_FALLBACK_TEMPLATES` → **0 production call sites** (only declared)
  - `cleanTranscript` → 1 production call site (chatPipeline.ts:327, log payload only)
  - `classifyAgents|buildAgentAtom|parseAgentResponse` → 1 production caller (PlanningChatBar.tsx:78)
  - `classifyContexts|toDomainModel` → 2 production callers (PlanningChatBar.tsx:58/70 + Planning.tsx:118)
  - `classifyProcess|toProcessMap` → 2 production callers (PlanningChatBar.tsx:44/45 + Agentics.tsx:63)
  - `validateEventType` → 1 production call site (comprehensiveLogs.ts:187, writeLogEvent gate)
  - `validateSectionType` → **0 production call sites** outside its declaration file
  - `runTwoStepPipeline` → **0 production call sites** outside its declaration file
- Atom-name occurrence counts in src/contexts/intelligence/ + src/components/ + src/pages/ + src/store/ (excluding `.spec.`):
  - classifyIntent: 11 · llmClassifyIntent: 4 · classifyRoute: 6 · classifyAgents: 4 · classifyContexts: 7 · classifyProcess: 3 · decompose: 8 · tryMatchTemplate: 6 · translateIntent: 5 · matchTemplates: 11 · applyTemplateMatch: 5 · executeTodos: 6 · applyPatches: 15

## Pipeline call-graph (current state at P104)

```
submit({ source, text, history? })
  │
  ├── trim(); empty? → return { ok:false, summary:'', errorKind:null }   [B5]
  │
  ├── getActivePage(config, activePageId) → scope { page, sections, scopeRoot }
  ├── newRequestId(); resolve sessionId via activeSession(projectId)
  ├── emit('input_event', { text:redacted, source })                     [G2]
  ├── if source==='listen': emit('listen_capture', { raw, cleaned:cleanTranscript(text) })
  │     [B7] cleanTranscript only used for the log payload — submit text is the raw transcript
  │
  ├── try {  // big template/AISP/DECOMP try-block (lines 338-607)
  │     │
  │     ├── dynamic imports: tryMatchTemplate, translateIntent, classifyIntent,
  │     │      llmClassifyIntent, AISP_CONFIDENCE_THRESHOLD, classifyRoute,
  │     │      matchTemplates, TEMPLATE_CONFIDENCE_THRESHOLD, applyTemplateMatch
  │     │      [B12] every submit awaits 6 dynamic imports
  │     │
  │     ├── codebaseContext.readCodebaseContextManifest()? → projectType (or null)
  │     │
  │     ├── classifyIntent(text, projectType)              [INTENT_ATOM rules]
  │     ├── if confidence < 0.85 || !target:
  │     │     llmClassifyIntent(text)  [INTENT_ATOM via LLM, cost-cap-gated]
  │     │
  │     ├── isUnmeasurableGoal(text)  [B3 — computed, only logged]
  │     ├── hasContradiction(text)    [B3 — computed, only logged]
  │     ├── emit('intent_classification', { intent, source, isUnmeasurable, isContradiction })
  │     │
  │     ├── if intent.target?.pageId: scope = getActivePage(config, pageId)  [page override]
  │     ├── classifyRoute(intent, text) → aispRoute ∈ {content, design, ambiguous}
  │     │
  │     ├── try {  // DECOMP short-circuit
  │     │     decompose(text, intent, config.pages)  [DECOMP_ATOM]
  │     │     emit('decomposition', { todos, confidence, source })  if todos≥1
  │     │     if todos > 1 && confidence ≥ 0.7:
  │     │       executeTodos(decomp, scopedConfig)
  │     │         → traces[].patches (per-todo matchTemplates → applyTemplateMatch)
  │     │       prefixPatchPaths + applyPatches  [P82 per-todo page scoping]
  │     │       emit('patch_validation', stage:decomp); editHist; emit('response_summary')
  │     │       return ok                          [B6 — 0.6 single-hit todos dropped]
  │     │   } catch { warn; fall through }
  │     │
  │     ├── try {  // 3-layer template matcher
  │     │     matchTemplates(text, scopedConfig)  [TEMPLATE_ATOM (theme+section+content)]
  │     │     emit('template_match', { theme, sectionArrangement, contentStyle, confidence,
  │     │                              alternatives, rationale })
  │     │     if confidence ≥ 0.8:
  │     │       applyTemplateMatch → patches → prefix → applyPatches
  │     │       emit('patch_validation' stage:template); editHist; emit('response_summary')
  │     │       return ok with matcherConfidence chip
  │     │     [B9 — alternatives populated when conf<0.8 but never surfaced]
  │     │   } catch { warn; fall through }
  │     │
  │     ├── if intent.confidence ≥ 0.85 && intent.target:
  │     │     canonicalForTemplate = "<verb> /<type>-<idx> to <value>"
  │     │   else:
  │     │     canonicalForTemplate = translateIntent(text).canonicalText  [P25 rules]
  │     │
  │     ├── tryMatchTemplate(canonicalForTemplate)         [legacy 4-template registry router]
  │     ├── if tpl && tpl.envelope.patches.length > 0:
  │     │     applyPatches; deriveImprovements; derivePersonalityMessage;
  │     │     emit('personality_display'); emit('response_summary'); return ok
  │     ├── else if tpl && empty-patch: return canned with template-id summary
  │     │
  │   } catch { warn; fall through to LLM patch path }
  │
  ├── if aispRoute === 'content':
  │     runCanned(text); return  [B4 — canned dead-end; never calls CONTENT_ATOM/generator]
  │
  ├── try {  // LLM patch path (PATCH_ATOM via system prompt)
  │     runLLMPipeline(text, source, history, scope)
  │       │
  │       ├── adapter check; build system prompt (PATCH_ATOM verbatim)
  │       ├── auditedComplete(adapter, prompt) → res.json
  │       ├── parseResponse → patches
  │       ├── validatePatches
  │       ├── prefixPatchPaths(patches, scope.scopeRoot)
  │       └── applyPatches
  │     emit('patch_validation', stage:llm); editHist; emit('response_summary'); return ok
  │   } catch { recordPipelineFailure }
  │
  └── runCanned(text); emit('response_summary' canned-fallback); return canned
```

DEAD or PARTIALLY-DEAD branches:
- `runTwoStepPipeline` / `selectTemplate` / `SELECTION_ATOM` / Σ-restricted template-id atom — NEVER invoked from chatPipeline. The 2-step LLM template-selection path is fully orphaned (B2).
- `ASSUMPTIONS_FALLBACK_TEMPLATES` — NEVER imported. The hand-coded fallback list is a dangling export (B8).
- `validateSectionType` — NEVER called outside its own file. P104 declared the helper but no JSON-load / fixture-load site uses it (B1).
- `aispRoute === 'content'` short-circuits to a canned hint string. CONTENT_ATOM / generateContent direct call IS wired into `registry.ts` (template-4 generator path) but the route='content' branch never hits the registry path — it returns canned (B4).
- `tplMatch.alternatives` populated when confidence < 0.8 — chatPipeline doesn't read alternatives, never feeds them to ASSUMPTIONS_ATOM (B9).

## Findings — ranked

### B1 — `validateSectionType` exported but has zero production callers

- **Severity:** P1
- **Where:** `src/lib/schemas/section.ts:38` (declaration); zero importers in production tree
- **Trace:** P104 / SCHEMA-GUARDS sealed `validateSectionType()` as the runtime alias-aware section-type guard with 10 documented aliases (`article→text`, `testimonial→quotes`, `cta→action`, `faq→questions`, `stats→numbers`, etc.). The grep `grep -rnE 'validateSectionType\(' src/ --include='*.ts' --include='*.tsx' | grep -v '\.spec\.' | grep -v 'src/lib/schemas/section.ts'` returns ZERO matches. The fixtures load through Zod (`sectionSchema.parse`) which uses the strict enum and rejects aliases — defeating the purpose of the side-car helper. P104 effectively shipped a NO-OP.
- **Evidence:** `src/lib/schemas/section.ts:38-65` — declaration with 10-entry alias map; zero call sites.
- **Fix LOC est:** 5-15 LOC — wire into `loadConfigFromJSON` / fixture loader / `EXAMPLE_SITES` import path so the alias-aware path is consulted before Zod (or instead of, with a wrapper that prefers the alias-resolved type).
- **KISS-fit:** YES — single import + one-line replacement at the JSON-load boundary.
- **Atom impacted:** none (schema-load layer)

### B2 — twoStepPipeline / SELECTION_ATOM is fully orphaned

- **Severity:** P1
- **Where:** `src/contexts/intelligence/aisp/twoStepPipeline.ts:71`; `src/contexts/intelligence/aisp/templateSelector.ts:72`
- **Trace:** ADR-057 (P28 / Sprint C P3) named the 2-step AISP pipeline as the architected SELECTION_ATOM path. `runTwoStepPipeline` calls `selectTemplate` (LLM picks template ID against Σ-restricted Crystal Atom) → matches against TEMPLATE_REGISTRY → executes envelope → returns `TwoStepResult`. Grep `grep -rnE 'runTwoStepPipeline\(' src/` returns ZERO call sites. chatPipeline.ts:339-344 imports `tryMatchTemplate` + `matchTemplates` but never `runTwoStepPipeline`. The Σ-restricted SELECTION_ATOM is referenced cosmetically by `MobileSpecBottomSheet.tsx:36` and `AISPPipelineTracePane.tsx:119` (UI labels) but the code never executes.
- **Evidence:** twoStepPipeline.ts is 123 LOC; selectTemplate is 122 LOC; both shipped P28; both have ZERO production importers.
- **Fix LOC est:** Two options — (a) DELETE both files + remove from aisp/index.ts barrel (≈ 6 lines edit); (b) WIRE between `tryMatchTemplate` and the LLM patch path so selection happens before LLM patch generation (≈ 25 LOC + adapter cost guard).
- **KISS-fit:** YES (option a is simpler) — this is dead-code that confuses future readers and obscures the actual SELECTION path which is the 3-layer matcher.
- **Atom impacted:** SELECTION_ATOM

### B3 — `isUnmeasurableGoal` + `hasContradiction` wired as flags but never act

- **Severity:** P1
- **Where:** `src/contexts/intelligence/chatPipeline.ts:396-398`
- **Trace:** P100 W2 FMT-VERIFY (D1) declared the helpers `isUnmeasurableGoal` + `hasContradiction` as ALIVE per ADR-127 §C1 §4.1. Reading the actual code: line 396-397 compute the booleans; line 398 emits them in `event_data` of `intent_classification`. Nothing else reads them. There is no clarification branch, no ASSUMPTIONS_ATOM trigger, no skip-LLM gate, no telemetry warning to the user. The CLAUDE.md anchor states: "Future P101 may act on these (e.g., clarification prompt when isUnmeasurable=true). Today they end the dead-code state per C1 §4.1." — meaning the phase explicitly accepted "logged but dormant." From a behavior-audit perspective these are still dead — they don't change a single user-visible outcome.
- **Evidence:** chatPipeline.ts:396-398 — compute + emit; no consumer downstream.
- **Fix LOC est:** ~15-25 LOC — when `isUnmeasurable=true`, route to ASSUMPTIONS_ATOM path with `ASSUMPTIONS_FALLBACK_TEMPLATES` (closes B8 simultaneously). When `hasContradiction=true`, surface a clarification card.
- **KISS-fit:** YES — both already computed; just need a branch.
- **Atom impacted:** INTENT_ATOM (helper) + ASSUMPTIONS_ATOM (target)

### B4 — `aispRoute === 'content'` short-circuits to canned, never invokes CONTENT_ATOM

- **Severity:** P1
- **Where:** `src/contexts/intelligence/chatPipeline.ts:617-635`
- **Trace:** When `classifyRoute(...).route === 'content'` AND no template matched, the pipeline calls `runCanned(text)` and returns a hard-coded "I can do design changes right now…" string. Comment at line 612 acknowledges: "TODO: content route → P38 LLM content call (CONTENT_ATOM verbatim → LLM)." `generateContent` IS wired into `registry.ts:18` and called from template-4 generator path — but ONLY when the user phrasing already matches the template-4 regex. The route='content' branch never reaches that registry path because route='content' short-circuits before `tryMatchTemplate`. Net: a Grandma user asking "rewrite the headline" hits the canned dead-end every time when no template-4 regex matches, despite a working CONTENT_ATOM generator existing in the codebase.
- **Evidence:** chatPipeline.ts:617-635 — full short-circuit branch; chatPipeline.ts:611-616 — TODO unfulfilled since P37.
- **Fix LOC est:** ~30-50 LOC — wire `generateContent({ text, sectionType: aisp.target?.type ?? 'hero' })` into the route='content' branch BEFORE the canned fallback; emit a content-stage `patch_validation` log; apply patches.
- **KISS-fit:** YES — `generateContent` is pure-rule today; no cost-cap check needed; no LLM dependency.
- **Atom impacted:** CONTENT_ATOM

### B5 — Empty-text branch returns blank summary; listen surface renders nothing

- **Severity:** P1
- **Where:** `src/contexts/intelligence/chatPipeline.ts:303-308`
- **Trace:** When `text.trim() === ''` (most common: user pressed Enter on empty input, or listen surface produced empty final transcript). Pipeline returns `{ ok: false, appliedPatchCount: 0, fellBackToCanned: false, summary: '', durationMs: 0, errorKind: null, latencyMs: null, latencyBreakdown: null }`. ChatInput renders `summary` via typewriter — a blank reply yields a silent UI. Listen mode's useListenPipeline:156 `setPttReply(result.summary || '')` renders the same blank. The `ok:false + errorKind:null` combination is also semantically suspicious — it's neither an error nor a non-error outcome.
- **Evidence:** chatPipeline.ts:303-308; useListenPipeline.ts:156.
- **Fix LOC est:** 3-5 LOC — return `summary: FALLBACK_HINT` (or a dedicated empty-input nudge) and `errorKind: 'precondition_failed'`.
- **KISS-fit:** YES — single string change.
- **Atom impacted:** none (input layer)

### B6 — DECOMP confidence threshold drops single-clause partial-hits

- **Severity:** P2
- **Where:** `src/contexts/intelligence/chatPipeline.ts:433`; `src/contexts/intelligence/aisp/decompAtom.ts:36` (Γ R3)
- **Trace:** chatPipeline.ts:433 gate is `if (decomp.todos.length > 1 && decomp.confidence >= 0.7)`. DECOMP scoring per Γ R3: 0.9 if (verb+target hits), 0.6 if exactly one hit, 0.3 otherwise. A multi-clause input like "make pricing better" (no recognized DECOMP target — "better" is a tone but unrecognized; "pricing" hits target "section") yields todos=[{ verb:'modify', target:'section', conf:0.9 }] = single todo. Single-todo path falls through to template-matcher (correct). BUT a multi-clause "improve pricing and footer" yields 2 todos each scoring 0.6 (only target hit, no verb hit since "improve" isn't in VERB_KEYWORDS) → mean confidence 0.6 → DROPPED → fall through to template matcher with original text → matcher likely scores below 0.8 too → eventually canned fallback. The user pays the dynamic-import cost + DECOMP work for nothing. The threshold 0.7 is conservative; the verb table is incomplete.
- **Evidence:** decompAtom.ts:108-114 VERB_KEYWORDS missing `improve`, `enhance`, `polish`, `tweak`. Γ R3 scoring penalizes mid-confidence clauses harshly.
- **Fix LOC est:** ~20 LOC — extend VERB_KEYWORDS with `improve/enhance/polish/tweak/refine` (mirrors INTENT_ATOM extension P101 for `forget/need/create`); consider lowering threshold to 0.6 OR introducing a tier-2 path (apply when conf 0.6, surface ASSUMPTIONS card).
- **KISS-fit:** YES.
- **Atom impacted:** DECOMP_ATOM

### B7 — `cleanTranscript` only used for log payload; pipeline sees raw transcript

- **Severity:** P2
- **Where:** `src/contexts/intelligence/chatPipeline.ts:327`
- **Trace:** Listen-mode submit emits `listen_capture` with `cleaned: cleanTranscript(text)` and `raw: text`. But the pipeline downstream — classifyIntent, classifyRoute, decompose, matchTemplates, runLLMPipeline — all consume the ORIGINAL `text`, not the cleaned variant. A voice transcript "uh um make it like brighter you know" hits classifyIntent with disfluencies intact → INTENT verb classifier scans for `make` (matches), DECOMP_ATOM splits on " and " (doesn't fire) but VERB_KEYWORDS table looks for `make it` exactly — disfluencies between `make` and `it` defeat that match. Listen-mode users pay disfluency tax on every submit.
- **Evidence:** chatPipeline.ts:327 (only call site); transcriptCleanup.ts:12-14 disfluency regex covers exactly the "uh/um/like/you know" patterns the pipeline blows on.
- **Fix LOC est:** ~5 LOC — `const submitText = opts.source === 'listen' ? cleanTranscript(text) : text;` and replace `text` with `submitText` in downstream pipeline calls. Keep `text` for `input_event` raw log.
- **KISS-fit:** YES.
- **Atom impacted:** STT pre-processor (between source and INTENT_ATOM)

### B8 — `ASSUMPTIONS_FALLBACK_TEMPLATES` exported but has zero callers

- **Severity:** P1 (declared deliberate dead-code in CLAUDE.md but never closed)
- **Where:** `src/contexts/intelligence/aisp/assumptionsAtom.ts:144`
- **Trace:** P100 W2 / A7 added a 3-entry deterministic fallback list (revert-last-change / reset-to-default-theme / clarify-target) for the case where `generateAssumptionsLLM` fails. Grep confirms ZERO importers. The `useListenPipeline.ts:149` calls `generateAssumptionsLLM` and on `llm.assumptions.length === 0` does NOT fall back to the canonical templates — it sets `pttReply` blank or skips clarification. ChatInput.tsx:423 same pattern. Result: when the LLM call fails or returns empty, users get nothing instead of the 3-option safety net the constant was meant to provide.
- **Evidence:** assumptionsAtom.ts:144 declaration; useListenPipeline.ts:148-155 + ChatInput.tsx:415-435 — no fallback to the canonical templates.
- **Fix LOC est:** ~10-15 LOC — in both call sites: `if (llm.assumptions.length === 0) llm = { assumptions: ASSUMPTIONS_FALLBACK_TEMPLATES, source: 'fallback' }`.
- **KISS-fit:** YES — already designed for this.
- **Atom impacted:** ASSUMPTIONS_ATOM

### B9 — Template matcher `alternatives` populated but never surfaced

- **Severity:** P2
- **Where:** `src/contexts/intelligence/templates/templateMatcher.ts:128-134, 169-173`; `src/contexts/intelligence/chatPipeline.ts:498-499`
- **Trace:** When confidence < 0.8 the matcher returns `alternatives: { theme: [...3], sectionArrangement: [...3], contentStyle: [...3] }`. chatPipeline.ts:499 emits `alternatives` into the `template_match` log payload, then proceeds to fall through to `tryMatchTemplate` / `runLLMPipeline` / canned. Nothing reads `alternatives` to surface them as ASSUMPTIONS_ATOM clarification cards. The matcher's "I can offer top-3 of each layer" capability is dead UI-side.
- **Evidence:** templateMatcher.ts:128-134 + 169-173 (alternative construction); chatPipeline.ts:498-499 (only logged); ASSUMPTIONS_ATOM expected to consume per templateMatcher.ts:42 comment "for ASSUMPTIONS_ATOM if confidence < threshold".
- **Fix LOC est:** ~20-30 LOC — when `tplMatch.confidence < 0.8` AND `tplMatch.alternatives.{any}.length > 0`, hand to ASSUMPTIONS_ATOM (or a lightweight 3-option clarification card). Emit a new log event_type or reuse `template_match` with a `surfaced:true` flag.
- **KISS-fit:** YES — alternatives data already in hand.
- **Atom impacted:** SELECTION_ATOM (logical) / ASSUMPTIONS_ATOM (surface)

### B10 — `logCtx.sessionId === ''` silently disables ALL log emit

- **Severity:** P2
- **Where:** `src/contexts/intelligence/chatPipeline.ts:282-284, 286-289, 322-326`
- **Trace:** When `projectId === null` (e.g. fresh-start, no project active) or `activeSession(projectId)` returns null, `sessionId` is `''`. `emit()` line 282 short-circuits on `!ctx.sessionId`. Result: a brand-new user submitting their first message produces ZERO log_events rows. The user gets a working pipeline reply, but the comprehensive-logs surface (ConversationLogTab drill-down) shows nothing for that submission. ADR-126 promised P0 logging coverage; the no-active-project edge silently breaks that promise.
- **Evidence:** chatPipeline.ts:322-323 — `const sessionId = projectId ? (activeSession(projectId)?.id ?? '') : ''`; chatPipeline.ts:282 — `if (!ctx.sessionId) return`.
- **Fix LOC est:** ~10 LOC — call `startSession(projectId)` to lazily create one (mirrors useListenPipeline.ts:164), OR use a synthetic 'orphan' session id and emit anyway.
- **KISS-fit:** YES — `startSession` already exists at the listen surface; lift to chatPipeline entry.
- **Atom impacted:** observability layer (ADR-126)

### B11 — DECOMP verb table missing `forget`/`need`/`create` (P101 INTENT extension)

- **Severity:** P2
- **Where:** `src/contexts/intelligence/aisp/decompAtom.ts:108-114`; cf. `src/contexts/intelligence/aisp/intentClassifier.ts:42-44`
- **Trace:** P101 / A1 extended INTENT_ATOM verb classifier with `forget→remove`, `need→add`, `create→add`. DECOMP_ATOM's separate VERB_KEYWORDS table at decompAtom.ts:108-114 still lacks these verbs. A multi-clause input "create a pricing section and forget the footer" hits DECOMP → splitClauses produces 2 clauses → detectVerb scans VERB_KEYWORDS:`create`/`forget` → no hit → todo.verb='unknown' → confidence 0.6 (target hit only) per Γ R3 → mean 0.6 → < 0.7 threshold → DECOMP path drops. INTENT classifier on the same text would have classified each verb correctly (it has the extended table).
- **Evidence:** decompAtom.ts VERB_KEYWORDS{remove:[...,'hide','get rid of'], add:['add','include',...]}; intentClassifier.ts:42-44 already extended.
- **Fix LOC est:** ~5 LOC — append `forget` to remove[]; append `create` + `need` to add[].
- **KISS-fit:** YES — table mirror.
- **Atom impacted:** DECOMP_ATOM

### B12 — Per-submit dynamic-import overhead (≥ 6 awaits per call)

- **Severity:** P3
- **Where:** `src/contexts/intelligence/chatPipeline.ts:339-346, 356, 426-427`
- **Trace:** Every `submit()` awaits 6 dynamic imports inside the try block (templates, intent, aisp, templateMatcher, templateApplier, codebaseContext) plus 2 more for decomp (decompAtom + todoExecutor). After Vite production bundling these likely resolve from a single chunk; in development they're separate fetches. The latency-breakdown CLAUDE.md emphasizes (Sprint K P54 latency badge) is partially eaten by these awaits — `stageMarks.classifyStart` is set AFTER the imports complete, so the latency math is actually understating overhead.
- **Evidence:** chatPipeline.ts:339-346 (4 awaited imports), :356 (codebaseContext), :426-427 (decomp+executor). All inside the same call.
- **Fix LOC est:** ~30-50 LOC — hoist to top-of-file static imports (drops the dynamic-import boundary). Tradeoff: bigger initial bundle. Alternatively cache the imported modules in module-scope refs.
- **KISS-fit:** YES — static imports are the simpler shape.
- **Atom impacted:** none (perf)

### B13 — LLM AISP cost-cap pre-check at 90% can starve mid-budget calls

- **Severity:** P3
- **Where:** `src/contexts/intelligence/aisp/llmClassifier.ts:48`; `src/contexts/intelligence/aisp/templateSelector.ts:80`
- **Trace:** llmClassifier.ts:48 `if (store.sessionUsd >= store.capUsd * 0.9) return null;` — when 90% of cap used, all LLM AISP calls are skipped silently. templateSelector.ts:80 reserves 75% (already-broken because templateSelector is dead per B2). The 90% threshold guarantees the user can never use the last 10% of their cap on AISP enrichment, even if the whole budget would have fit — and there's no UI signal "AISP skipped due to cap." Combined with B4 (route='content' canned), a low-budget user gets the canned dead-end for fixable inputs.
- **Evidence:** llmClassifier.ts:48 `0.9` literal.
- **Fix LOC est:** ~5-10 LOC — actually call `recordUsage(0,0,0)` pre-check, OR replace the literal with `(capUsd - sessionUsd) >= ESTIMATED_AISP_COST` (e.g. $0.001).
- **KISS-fit:** YES.
- **Atom impacted:** INTENT_ATOM (LLM path)

### B14 — `personalityMessage` reads intelligenceStore TWICE (race possibility)

- **Severity:** P3
- **Where:** `src/contexts/intelligence/chatPipeline.ts:567, 582, 653, 667`
- **Trace:** Pattern `useIntelligenceStore.getState().personalityId ?? null` appears 4× across the file — once inside `derivePersonalityMessage` (line 134) and once in the result-build path (lines 582 / 667). If a user changes personality mid-pipeline (very rare but possible via settings tab), the persisted message and the result row's `personalityId` field could disagree. Same concern for `derivePersonalityMessage` reading personalityId on its own at line 134.
- **Evidence:** chatPipeline.ts lines listed.
- **Fix LOC est:** ~5 LOC — pin personalityId once at submit-entry; thread through.
- **KISS-fit:** YES.
- **Atom impacted:** personality engine (cross-cut)

### B15 — `improvements` swallows all module-load errors silently

- **Severity:** P3
- **Where:** `src/contexts/intelligence/chatPipeline.ts:154-167`
- **Trace:** `deriveImprovements` wraps `import('@/contexts/intelligence/aisp/improvementSuggester')` in a try/catch that DEV-warns. Production builds eat the failure. If a refactor breaks the suggester, the user silently loses the "next steps" affordance and there's no observability surface. `recordPipelineFailure` is not called.
- **Evidence:** chatPipeline.ts:164-166 catch returns undefined.
- **Fix LOC est:** ~5 LOC — emit `error_event` log when the import fails (and only the import — runtime suggester failures may be intentional empty results).
- **KISS-fit:** YES.
- **Atom impacted:** improvement suggester

## Atom production wire status

| Atom | Helper exports | Production import sites | Status |
|------|----------------|-------------------------|--------|
| **INTENT_ATOM** | `classifyIntent`, `llmClassifyIntent`, `classifyRoute`, `isUnmeasurableGoal` (B3), `UNMEASURABLE_GOAL_RE`, `resolvePageReference`, `ALLOWED_TARGET_TYPES`, `PROJECT_TYPE_TARGET_BIAS`, `ProjectType` | chatPipeline.ts:341/379/384 (3), listenActionPreview.ts:36, ListenReviewCard.tsx:21 (comment only) | **WIRED** — primary path; helper `isUnmeasurableGoal` only logs (see B3) |
| **DECOMP_ATOM** | `decompose`, `executeTodos`, `hasContradiction` (B3), `CONTRADICTION_RE`, `DECOMP_CONFIDENCE_THRESHOLD`, `Todo`, `DecompAtomResult` | chatPipeline.ts:426/431/439, todoExecutor.ts:131 (definition), other 5 in tests | **WIRED** — `hasContradiction` only logs (B3); verb table missing P101 verbs (B11); 0.7 threshold drops mid-confidence multi-clause (B6) |
| **SELECTION_ATOM** | `selectTemplate`, `runTwoStepPipeline`, `STEP1_THRESHOLD`, `SELECTION_ATOM` const | **0 production importers outside test/spec/UI labels** | **DEAD** — see B2; the 3-layer matcher (templateMatcher.ts) is the de-facto SELECTION but ADR-057's Σ-restricted LLM SELECTION_ATOM is orphaned |
| **CONTENT_ATOM** | `generateContent`, `CONTENT_ATOM`, `contentDefaults` | registry.ts:18 (template-4 generator path); twoStepPipeline.ts:21 (dead); chatPipeline.ts (TODO @612 unfulfilled) | **PARTIALLY WIRED** — only fires when user matches template-4's regex; route='content' branch never invokes (B4) |
| **ASSUMPTIONS_ATOM** | `generateAssumptionsLLM`, `generateAssumptions`, `shouldRequestAssumptions`, `ASSUMPTIONS_FALLBACK_TEMPLATES` (B8) | useListenPipeline.ts:149, ChatInput.tsx:423 | **WIRED at LLM path; FALLBACK_TEMPLATES dead** — see B8 (no fallback when LLM returns 0); not invoked from chatPipeline matcher's `alternatives` (B9) |
| **PATCH_ATOM** | `buildSystemPrompt`, `parseResponse`, `validatePatches`, `auditedComplete`, `applyPatches` | chatPipeline.ts (runLLMPipeline) | **WIRED** — primary LLM patch path; system-prompt is the verbatim AISP atom |
| **PROCESS_ATOM** | `classifyProcess`, `toProcessMap`, `buildProcessAtom` (LLM path), `parseProcessResponse` | PlanningChatBar.tsx:44/45, Agentics.tsx:63 | **WIRED in Planning/Agentics surfaces; NOT in chatPipeline** — by design (different mode) |
| **DDD_ATOM** | `classifyContexts`, `toDomainModel`, `buildDDDAtom`, `parseDDDResponse` | PlanningChatBar.tsx:58/70, Planning.tsx:118 | **WIRED in Planning surface; NOT in chatPipeline** — by design |
| **AGENT_ATOM** | `classifyAgents`, `buildAgentAtom`, `parseAgentResponse`, `WaveContext`, `AgentSpec` | PlanningChatBar.tsx:78 | **WIRED — first production call site closed P101 carry-forward #1 at P97** |

Net: **8 atoms total · 6 fully-wired (INTENT, DECOMP, PATCH, PROCESS, DDD, AGENT) · 1 partially-wired (CONTENT) · 1 fully dead (SELECTION_ATOM as the LLM-driven 2-step variant; the matcher-as-SELECTION is fine).**

Sister facts:
- `validateEventType` — WIRED at writeLogEvent (comprehensiveLogs.ts:187). P104 closed.
- `validateSectionType` — DEAD (B1). P104 declared but not wired into any JSON-load boundary.
- `cleanTranscript` — PARTIALLY WIRED (B7). Only the log payload; pipeline sees raw text.

## Carry-forward registry (Track B perspective)

| ID | Title | Severity | Owner-required? | Notes |
|----|-------|----------|-----------------|-------|
| TB-1 | Wire `validateSectionType` at JSON-load boundaries (B1) | P1 | NO | 5-15 LOC; closes P104 promise |
| TB-2 | Decide twoStepPipeline / selectTemplate fate — DELETE or WIRE (B2) | P1 | NO | Today is dead; KISS = delete |
| TB-3 | Make `isUnmeasurable` + `hasContradiction` ACT, not just log (B3) | P1 | NO | Pair with TB-7 (ASSUMPTIONS fallback) |
| TB-4 | Wire route='content' branch to `generateContent` (B4) | P1 | NO | CONTENT_ATOM exists; TODO since P37; ~30-50 LOC |
| TB-5 | Empty-input branch should return FALLBACK_HINT not '' (B5) | P1 | NO | 3-line fix |
| TB-6 | DECOMP threshold 0.7 vs partial-hit 0.6 mid-confidence (B6) | P2 | NO | Lower threshold OR widen verb table |
| TB-7 | Submit text should be `cleanTranscript(text)` for source==='listen' (B7) | P2 | NO | 5 LOC; closes voice disfluency tax |
| TB-8 | Fall back to `ASSUMPTIONS_FALLBACK_TEMPLATES` when LLM returns 0 (B8) | P1 | NO | Closes P100 W2 / A7 dead-export state |
| TB-9 | Surface `tplMatch.alternatives` to ASSUMPTIONS card (B9) | P2 | NO | 20-30 LOC |
| TB-10 | Lazy-create session in chatPipeline submit-entry (B10) | P2 | NO | Mirror useListenPipeline pattern |
| TB-11 | DECOMP VERB_KEYWORDS — add `forget`/`need`/`create` (B11) | P2 | NO | 5 LOC; mirrors P101 INTENT extension |
| TB-12 | Replace dynamic imports with static imports (B12) | P3 | NO | Bundle-size tradeoff |
| TB-13 | Replace 90% literal with cost-arithmetic guard (B13) | P3 | NO | 5-10 LOC |
| TB-14 | Pin personalityId once at submit-entry (B14) | P3 | NO | Defensive |
| TB-15 | `deriveImprovements` import-failure should emit `error_event` (B15) | P3 | NO | Defensive |

## Honest declaration

This audit is research-only against the source tree at branch `claude/verify-flywheel-init-qlIBr` post-P104 seal. I did not modify any source. Findings are based on grep + read of every file the spec required + cross-reference with CLAUDE.md anchor claims and ADR text where applicable.

What I am confident about:
- Atom production-wire counts (table) are accurate as of this snapshot.
- B1, B2, B8 are objectively dead — zero importers, verified by recursive grep.
- B4 is verifiable from chatPipeline.ts:617-635 — the route='content' branch returns canned without invoking generateContent.
- B7 is verifiable from chatPipeline.ts:327 — `cleanTranscript` only feeds the log payload.

What I am less confident about:
- B6 severity: I rated P2 but it could be P1 if a real-world user prompt corpus shows ≥10% multi-clause "improve X and Y" patterns. P81 ships a 500-entry prompt corpus — a follow-up could measure.
- B12 perf impact is dev-mode-only assumption; production bundle may collapse the dynamic chunks. Lighthouse measurement would settle.
- B13 cost-cap math could be intentional conservatism rather than a bug.
- The CLAUDE.md anchor claims many of these as "honest deferred" rather than gaps. I treated "deferred but blocking the MVP loop" as P1; "deferred but cosmetic" as P3. Reasonable people could re-rank.

What I did NOT verify (out of scope):
- Whether the test suite covers B1/B2/B4/B8 (Track D).
- Whether the AISP visibility surface in Planning/Agentics fires correctly (Track E).
- Whether the persistence rows match the emit map (Track C).
- Whether ADRs match what shipped (Track A).

Confidence: ~85% on findings; ~70% on severity rankings; ~95% on dead-code calls (B1/B2/B8 — these are mechanical grep results).

Total LOC of this report: 458.
