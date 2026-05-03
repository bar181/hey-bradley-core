// Spec: plans/implementation/mvp-plan/05-phase-19-real-listen.md §3.5
//   (extracted chat pipeline; called by both ChatInput and ListenTab).
// Decision record: docs/adr/ADR-048-stt-web-speech-api.md
//
// P19 Step 2 (A4): single canonical entry point for any text → JSON-patch flow,
// regardless of source (chat input or listen-mode final transcript). Body is a
// strict-move of the previous `runLLMPipeline` + `runCannedFallback` helpers
// from ChatInput.tsx — every error branch and the audited-complete mutex are
// preserved verbatim. Caller decides how to render `summary`.

import { useConfigStore } from '@/store/configStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useUIStore } from '@/store/uiStore'
import { useProjectStore } from '@/store/projectStore'
import { buildSystemPrompt } from '@/contexts/intelligence/prompts/system'
import { parseResponse } from '@/contexts/intelligence/llm/responseParser'
import { validatePatches } from '@/contexts/intelligence/llm/patchValidator'
import { auditedComplete } from '@/contexts/intelligence/llm/auditedComplete'
import { recordPipelineFailure } from '@/contexts/intelligence/llm/recordPipelineFailure'
import { parseChatCommand, parseMultiPartCommand } from '@/lib/cannedChat'
import { isUnmeasurableGoal } from '@/contexts/intelligence/aisp/intentAtom'
import { hasContradiction } from '@/contexts/intelligence/aisp/decompAtom'
import { cleanTranscript } from '@/contexts/intelligence/stt/transcriptCleanup'
import { getActivePage, prefixPatchPaths } from '@/contexts/intelligence/pageIterator'
import type { PageScope } from '@/contexts/intelligence/pageIterator'
import { activeSession } from '@/contexts/persistence/repositories/sessions'
import { writeLogEvent, newRequestId, writeEditHistory, redactKeyShapes, type LogEventType } from '@/contexts/persistence/repositories/comprehensiveLogs'
import { getDB } from '@/contexts/persistence/db'
import type { ChatErrorKind } from '@/lib/mapChatError'
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp'
import type { PersonalityId } from '@/contexts/intelligence/personality/personalityEngine'
import type { JSONPatch } from '@/lib/schemas/patches'

export interface ChatPipelineOptions {
  source: 'chat' | 'listen' | 'test'
  text: string
  /**
   * P19 fix: restore chat history threading lost during the strict-move from
   * ChatInput. Last 6 turns; passed through to buildSystemPrompt. Listen
   * surface intentionally omits this (no message thread on that surface).
   */
  history?: Array<{ role: 'user' | 'bradley'; text: string }>
}

export interface ChatPipelineResult {
  ok: boolean
  appliedPatchCount: number
  fellBackToCanned: boolean
  /** Bradley reply text (drives the typewriter / banner). */
  summary: string
  durationMs: number
  /**
   * P19 Fix-Pass 2 (F2): surface the failure category so callers can render a
   * kind-specific UI (mapChatError). `null` on success or canned-only fallback
   * (no LLM error to report). Drives ChatInput's error pill.
   */
  errorKind?: ChatErrorKind | null
  /**
   * P34 Sprint E P1 (Sprint D UI closure A1) — AISPTranslationPanel feed.
   * The classified intent + which classifier produced it. Populated when the
   * AISP-rules / AISP-LLM chain ran. `null` when the request bypassed AISP
   * (e.g. canned-fallback miss). Drives the "How I understood this" panel.
   */
  aisp?: { intent: ClassifiedIntent | null; source: 'rules' | 'llm' | 'fallthrough' } | null
  /**
   * P34 Sprint E P1 — generator-path trace. When the matched template's
   * kind === 'generator', the template-router still runs but ALSO surfaces
   * the generated tone/length/confidence so the panel can show step-2 detail.
   */
  generated?: {
    text: string
    tone: string
    length: string
    confidence: number
  } | null
  /** P34 — id of the matched template (for "Used template: X" UI). */
  templateId?: string | null
  /**
   * P46 fix-pass (R1 F4) — surface the route classification so the SIMPLE
   * AISP panel can warn "brand voice loaded but unused this turn" on
   * design-only routes (where the system-prompt brand block is irrelevant
   * to the underlying transformation). Pure cosmetic; null when AISP did
   * not run.
   */
  aispRoute?: 'content' | 'design' | 'ambiguous' | null
  /**
   * P48 Sprint I Wave 2 (A5) — actionable next-step suggestions surfaced
   * after a successful patch lands. Rule-based, $0, max 3 entries. Empty
   * (and undefined) on any non-success path or when no rule fired.
   */
  improvements?: readonly string[]
  /** Sprint J P50 (A2) — composition-rendered chat-bubble voice; null on throw / non-success. */
  personalityMessage?: string | null
  personalityId?: PersonalityId | null
  /** Sprint K P54 (A1) — wall-clock latency in ms from pipeline entry to
   *  patch-applied. null on non-success paths. */
  latencyMs?: number | null
  /** Optional pipeline-stage breakdown for EXPERT mode. ms per stage. */
  latencyBreakdown?: { classify?: number; select?: number; patch?: number; apply?: number } | null
  /**
   * P85 / OC-19 (A2) — Template matcher confidence chip text (Recommendation 1).
   * Surfaced when the 3-layer Template Intelligence matcher fires above
   * threshold. Drives the inline `selected <name> (<conf> confidence)` chip
   * under the bradley reply. Undefined when the matcher did not short-circuit
   * (low confidence, no layer match, error path, or non-template route).
   */
  matcherConfidence?: { name: string; confidence: number }
  /**
   * P85 / OC-19 (A2) — Decomp todos surfaced for the user-visible
   * "I found N things to do" inline list (Recommendation 2). Populated only on
   * the DECOMP_ATOM short-circuit path (≥2 todos, confidence ≥ 0.7, ≥1 patch).
   * Render gate `decompTodos.length >= 2` keeps single-clause replies clean.
   */
  decompTodos?: Array<{ verb: string; target?: string; status: 'applied' | 'deferred' | 'skipped' }>
}

/** Sprint K P54 (A1) — compose latencyBreakdown from optional stage marks. */
function buildBreakdown(m: { classifyStart?: number; selectStart?: number; patchStart?: number; applyStart?: number }, doneAt: number): ChatPipelineResult['latencyBreakdown'] {
  const b: NonNullable<ChatPipelineResult['latencyBreakdown']> = {}
  if (m.classifyStart != null && m.selectStart != null) b.classify = m.selectStart - m.classifyStart
  if (m.selectStart != null && (m.patchStart != null || m.applyStart != null)) b.select = (m.patchStart ?? m.applyStart!) - m.selectStart
  if (m.patchStart != null) b.patch = doneAt - m.patchStart
  if (m.applyStart != null) b.apply = doneAt - m.applyStart
  return b
}

/** Sprint J P50 (A2) — defensive composition render; mirrors deriveImprovements. */
async function derivePersonalityMessage(
  envelope: { summary: string; patches: readonly unknown[] },
  intentTrace: { intent: ClassifiedIntent | null } | null,
): Promise<string | null> {
  try {
    const mod = await import('@/contexts/intelligence/personality/personalityEngine')
    return mod.renderPersonalityMessage(envelope, useIntelligenceStore.getState().personalityId, intentTrace ?? undefined)
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[chatPipeline] personalityEngine unavailable', e)
    return null
  }
}

/** P48 (A5) — defensive 1-3 next-step suggestions for a successful patch.
 *  P79 / OC-14 (A3) — `sections` comes from the active page scope so the
 *  improvement suggester sees the active-page sections only (multi-page) or
 *  root sections (single-page). Backward-compat: when omitted, falls back to
 *  the full config sections (byte-equivalent to pre-P79 behavior). */
async function deriveImprovements(
  userText: string,
  appliedPatchCount: number,
  summary: string,
  aispTrace: { intent: ClassifiedIntent | null } | null,
  scope?: PageScope,
): Promise<readonly string[] | undefined> {
  if (appliedPatchCount <= 0) return undefined
  try {
    const mod = await import('@/contexts/intelligence/aisp/improvementSuggester')
    const intent = aispTrace?.intent ?? null
    const sections = scope ? scope.sections : useConfigStore.getState().config.sections
    const out = mod.suggestImprovements({
      userText, appliedPatchCount, summary,
      sectionTypesPresent: sections.map((s) => s.type),
      verb: intent?.verb, targetType: intent?.target?.type,
    })
    return out.length > 0 ? out.map((s) => s.text) : undefined
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[chatPipeline] improvementSuggester unavailable', e)
    return undefined
  }
}

const FALLBACK_HINT =
  "Hmm, I didn't catch that. Try one of: " +
  "Make the hero say 'Bake Joy Daily' · " +
  'Change to dark mode · ' +
  'Add a pricing section · ' +
  "Rewrite the headline bold to \"Stop guessing, start shipping\" · " +
  'Make it professional'

/**
 * Primary path: build system prompt → auditedComplete (FixtureAdapter or
 * AgentProxyAdapter in DEV) → parse → validate → applyPatches. Returns
 * { ok: true } when at least one patch landed.
 *
 * Any failure mode (no adapter, parse fail, validate fail, apply throw) is
 * routed to the canned fallback below; the audit row is updated in place via
 * recordPipelineFailure so we still get one row per call/decision.
 */
async function runLLMPipeline(
  text: string,
  source: 'chat' | 'listen' | 'test',
  history?: ChatPipelineOptions['history'],
  scope?: PageScope,
): Promise<{
  applied: number
  summary: string
  preconditionFailed?: 'no_adapter'
  /** P19 Fix-Pass 2 (F2): pass the adapter/pipeline error category up. */
  errorKind?: ChatErrorKind | null
}> {
  const adapter = useIntelligenceStore.getState().adapter
  if (!adapter) {
    // FIX 4: emit an audit-equivalent observability signal so missing-adapter
    // is not a silent failure. recordPipelineFailure tolerates a null callId
    // and DEV-warns — keeping ADR-047 observability honoured even when no
    // llm_calls row exists (auditedComplete never ran).
    recordPipelineFailure(null, 'validate', '@root: no_adapter')
    return { applied: 0, summary: '', preconditionFailed: 'no_adapter', errorKind: 'precondition_failed' }
  }
  const configState = useConfigStore.getState()
  const systemPrompt = buildSystemPrompt({ configJson: configState.config, history })
  const res = await auditedComplete(adapter, { systemPrompt, userPrompt: text }, { source })
  if (!res.ok) {
    // F2: translate adapter LLMError.kind onto the ChatErrorKind union.
    const k = res.error.kind
    const mapped: ChatErrorKind =
      k === 'cost_cap' ? 'cost_cap'
      : k === 'timeout' ? 'timeout'
      : k === 'rate_limit' ? 'rate_limit'
      : k === 'precondition_failed' ? 'precondition_failed'
      : k === 'invalid_response' ? 'validation_failed'
      : 'unknown'
    return { applied: 0, summary: '', errorKind: mapped }
  }
  const callId = res.auditCallId
  const parsed = parseResponse(res.json)
  if (!parsed.ok) {
    recordPipelineFailure(callId, 'parse', `@root: ${parsed.reason}`)
    return { applied: 0, summary: '', errorKind: 'validation_failed' }
  }
  const errs = validatePatches(parsed.envelope.patches, configState.config)
  if (errs.length > 0) {
    const first = errs[0]
    const idxMatch = /^patch\[(\d+)\]/.exec(first)
    const where = idxMatch ? `@patch[${idxMatch[1]}]` : '@patches'
    const trimmed = first.replace(/^patch\[\d+\]:\s*/, '')
    recordPipelineFailure(callId, 'validate', `${where}: ${trimmed}`)
    return { applied: 0, summary: '', errorKind: 'validation_failed' }
  }
  try {
    // P79 / OC-14 (A3) — page-aware apply: prefix patch paths to active page
    // scope (single-page mode = byte-equivalent reference-equal pass-through).
    const scopedPatches = scope
      ? (prefixPatchPaths(parsed.envelope.patches, scope.scopeRoot) as JSONPatch[])
      : parsed.envelope.patches
    useConfigStore.getState().applyPatches(scopedPatches)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    recordPipelineFailure(callId, 'apply', `@apply: ${msg}`)
    return { applied: 0, summary: '', errorKind: 'validation_failed' }
  }
  return {
    applied: parsed.envelope.patches.length,
    summary: parsed.envelope.summary ?? 'Done.',
    errorKind: null,
  }
}

/**
 * Canned fallback: multi-part command → single command → friendly hint. We
 * surface only the response string here; the caller drives the executor when
 * it can (ChatInput uses its multi-step typewriter). For listen-mode and tests
 * the summary is rendered as-is.
 */
function runCanned(text: string): { matched: boolean; summary: string } {
  const multi = parseMultiPartCommand(text)
  if (multi) return { matched: true, summary: multi.response }
  const single = parseChatCommand(text)
  if (single.action) return { matched: true, summary: single.response }
  return { matched: false, summary: FALLBACK_HINT }
}

/**
 * P100 W2 / A2 — Pipeline log envelope (fire-and-forget; never throws upward).
 * emit() → writeLogEvent for: input_event, listen_capture, intent_classification,
 * decomposition, template_match, patch_validation, personality_display,
 * response_summary. editHist() → writeEditHistory per successful applyPatches.
 * writeLogEvent: input_event ; writeLogEvent: intent_classification ;
 * writeLogEvent: decomposition ; writeLogEvent: template_match ;
 * writeLogEvent: patch_validation ; writeLogEvent: response_summary.
 */
interface LogCtx { requestId: string; sessionId: string; projectId: string | null; pageId: string | null; pageIndex: number | null; source: 'chat' | 'listen' | 'test' }
function emit(ctx: LogCtx, eventType: LogEventType, eventData: Record<string, unknown>): void {
  if (!ctx.sessionId) return
  try { writeLogEvent(getDB(), { id: newRequestId(), sessionId: ctx.sessionId, requestId: ctx.requestId, ...(ctx.projectId !== null ? { projectId: ctx.projectId } : {}), eventType, eventData, inputType: ctx.source === 'listen' ? 'listen' : 'chat', ...(ctx.pageId !== null ? { pageId: ctx.pageId } : {}), ...(ctx.pageIndex !== null ? { pageIndex: ctx.pageIndex } : {}) }) }
  catch (e) { if (import.meta.env.DEV) console.warn('[chatPipeline] writeLogEvent emit failed', eventType, e) }
}
function editHist(ctx: LogCtx, before: unknown, after: unknown, patches: unknown[], userText: string): void {
  if (!ctx.sessionId || !ctx.projectId) return
  try { writeEditHistory(getDB(), { id: newRequestId(), projectId: ctx.projectId, sessionId: ctx.sessionId, requestId: ctx.requestId, patchApplied: patches, beforeSnapshot: before, afterSnapshot: after, userPrompt: userText, ...(ctx.pageId !== null ? { pageId: ctx.pageId } : {}) }) }
  catch (e) { if (import.meta.env.DEV) console.warn('[chatPipeline] writeEditHistory failed', e) }
}

/**
 * Single shared entry point. Both ChatInput and ListenTab call this. The
 * in-flight mutex lives inside auditedComplete (centralised P18 fix), so two
 * concurrent submits — even from different surfaces — return cleanly with
 * `ok: false, fellBackToCanned: true` on the second.
 */
export async function submit(opts: ChatPipelineOptions): Promise<ChatPipelineResult> {
  const startedAt = Date.now()
  // Sprint K P54 (A1) — defensive stage marks; omissions yield no breakdown key.
  const stageMarks: { classifyStart?: number; selectStart?: number; patchStart?: number; applyStart?: number } = {}
  const text = opts.text.trim()
  if (!text) {
    return {
      ok: false, appliedPatchCount: 0, fellBackToCanned: false, summary: '',
      durationMs: Date.now() - startedAt, errorKind: null, latencyMs: null, latencyBreakdown: null,
    }
  }

  // P79 / OC-14 (A3) — page-aware pipeline (ADR-104). Read activePageId once
  // at submit entry; resolve scope ({ page, sections, scopeRoot }). When
  // scopeRoot === '' (single-page mode / no multi-page config), every
  // downstream call is byte-equivalent to pre-P79 behavior:
  //   - prefixPatchPaths(patches, '') returns the input array reference-equal;
  //   - the scopedConfig conditional collapses to config;
  //   - scope.sections === config.sections.
  const config = useConfigStore.getState().config
  const activePageId = useUIStore.getState().activePageId
  let scope = getActivePage(config, activePageId)

  // P100 W2 / A2 — log envelope context (resolved once; threaded into every emit).
  const projectId = useProjectStore.getState().activeProject
  const sessionId = projectId ? (activeSession(projectId)?.id ?? '') : ''
  const pIdx = scope.page && config.pages ? config.pages.findIndex((p) => p.id === scope.page!.id) : -1
  const logCtx: LogCtx = { requestId: newRequestId(), sessionId, projectId, pageId: scope.page?.id ?? null, pageIndex: pIdx >= 0 ? pIdx : null, source: opts.source }
  emit(logCtx, 'input_event', { text: redactKeyShapes(text), source: opts.source })
  if (opts.source === 'listen') emit(logCtx, 'listen_capture', { raw: redactKeyShapes(text), cleaned: redactKeyShapes(cleanTranscript(text)) })
  // P105 / A3 — listen-source pipeline reads disfluency-cleaned text (B7+D1 closure);
  // raw `text` preserved for logging emits and user-facing edit_history writes.
  const effectiveText = opts.source === 'listen' ? cleanTranscript(text) : text

  // P26 Sprint C P1 — AISP rule-based classifier (first in chain).
  // P27 Sprint C P2 — LLM-driven AISP classifier when rule-based < threshold.
  // Full fallback chain:
  //   AISP_rules (P26) → AISP_LLM (P27) → translate (P25) → router (P23+P24) → LLM patch
  // P34 Sprint E P1 (Sprint D UI closure A1) — capture AISP trace for the
  // AISPTranslationPanel; carries through every return below.
  // P37 Sprint F P2 (A2) — content/design route classification gate (ADR-066).
  let aispTrace: { intent: ClassifiedIntent | null; source: 'rules' | 'llm' | 'fallthrough' } | null = null
  let aispRoute: 'content' | 'design' | 'ambiguous' | null = null
  try {
    const { tryMatchTemplate } = await import('@/contexts/intelligence/templates')
    const { translateIntent } = await import('@/contexts/intelligence/templates/intent')
    const { classifyIntent, llmClassifyIntent, AISP_CONFIDENCE_THRESHOLD, classifyRoute } = await import('@/contexts/intelligence/aisp')
    // P72 / OC-TI (A4) — Template Intelligence matcher (post-INTENT/route, pre-SELECTION).
    // Confidence ≥ 0.8 → apply 3-layer template patches + short-circuit;
    // < 0.8 → fall through to SELECTION_ATOM (alternatives surface via ASSUMPTIONS_ATOM).
    const { matchTemplates, TEMPLATE_CONFIDENCE_THRESHOLD } = await import('@/contexts/intelligence/templates/templateMatcher')
    const { applyTemplateMatch } = await import('@/contexts/intelligence/templates/templateApplier')

    // P45 Sprint H Wave 2 (A5) — read codebase-context manifest's projectType
    // and pass to classifyIntent (Λ.project_context channel). Defensive:
    //   - dynamic import so a missing repo file (A4 not yet shipped) is not a
    //     hard build failure;
    //   - any throw OR missing manifest collapses to projectType=null which
    //     yields byte-identical P44 behavior in classifyIntent.
    let projectType: import('@/contexts/intelligence/aisp').ProjectType | null = null
    try {
      const ctxMod = await import('@/contexts/persistence/repositories/codebaseContext')
      const reader =
        (ctxMod as { readCodebaseContextManifest?: () => { projectType?: string } | null }).readCodebaseContextManifest
      if (typeof reader === 'function') {
        const manifest = reader()
        const pt = manifest?.projectType
        if (
          pt === 'saas-app' ||
          pt === 'landing-page' ||
          pt === 'static-site' ||
          pt === 'portfolio' ||
          pt === 'unknown'
        ) {
          projectType = pt
        }
      }
    } catch {
      // No codebase context repo wired yet (A4) or read threw — stay null.
      projectType = null
    }

    let canonicalForTemplate: string
    stageMarks.classifyStart = Date.now()
    let aisp = classifyIntent(effectiveText, projectType)
    let aispSource: 'rules' | 'llm' | 'fallthrough' = 'rules'
    // P27: when rule-based AISP is below threshold, ask the LLM to classify
    // via the SAME Crystal Atom. Thesis demonstration ADR-056.
    if (aisp.confidence < AISP_CONFIDENCE_THRESHOLD || !aisp.target) {
      const llmAisp = await llmClassifyIntent(effectiveText)
      if (llmAisp && llmAisp.confidence >= AISP_CONFIDENCE_THRESHOLD && llmAisp.target) {
        aisp = llmAisp
        aispSource = 'llm'
      } else {
        aispSource = 'fallthrough'
      }
    }
    aispTrace = { intent: aisp, source: aispSource }
    // P100 W2 / D1 — wire A7 atom helpers as ALIVE flags (consulted + logged,
    // non-blocking). Future P101 may act on these (e.g., clarification prompt
    // when isUnmeasurable=true). Today they end the dead-code state per C1 §4.1.
    const isUnmeasurable = isUnmeasurableGoal(effectiveText)
    const isContradiction = hasContradiction(effectiveText)
    emit(logCtx, 'intent_classification', { intent: aisp, source: aispSource, isUnmeasurable, isContradiction })
    // P82 / OC-CLEANUP (A3) — page-aware INTENT override. When the classified
    // intent carries an explicit pageId (cross-page reference like "on page 2"
    // or "the contact page"), override `scope` so all downstream apply paths
    // (DECOMP, template-matcher, runLLMPipeline) target that page instead of
    // activePageId. Backward-compat: when pageId is undefined (today's most
    // common path), scope is unchanged → P79 byte-equivalent behavior.
    if (aisp.target?.pageId) {
      const overridden = getActivePage(config, aisp.target.pageId)
      if (overridden.scopeRoot !== '') {
        scope = overridden
        const oIdx = config.pages ? config.pages.findIndex((p) => p.id === overridden.page!.id) : -1
        logCtx.pageId = overridden.page?.id ?? null; logCtx.pageIndex = oIdx >= 0 ? oIdx : null
      }
    }
    // P37 A2 — classify route (content vs design vs ambiguous). Pure-rule, $0.
    // P37 R3 L2 fix-pass — classifyRoute always runs (text-driven cue tables
    // are robust even when AISP didn't lock). Previously it ran ONLY at high
    // AISP confidence, so a low-confidence "rewrite the headline" slipped
    // past the content gate and hit the LLM patch path. classifyRoute is
    // pure-rule (~$0); calling it unconditionally is the correct floor.
    aispRoute = classifyRoute(aisp.target ? aisp : null, effectiveText).route
    // P74 / OC-DECOMP (A3) — DECOMP_ATOM short-circuit. Multi-clause input
    // ("make it brighter and add pricing") splits into ordered Todo[]; when
    // ≥2 todos with confidence ≥0.7 produce patches, apply + return early.
    // Single-clause / low-confidence falls through to matchTemplates path.
    // ADR-099 (cross-refs ADR-053/057/060/064/098).
    try {
      const { decompose } = await import('@/contexts/intelligence/aisp/decompAtom')
      const { executeTodos } = await import('@/contexts/intelligence/aisp/todoExecutor')
      // P82 / OC-CLEANUP (A3) — pass `pages` so each clause can resolve a
      // page-targeting reference into `Todo.targetPage`. `undefined` when no
      // multi-page config → byte-equivalent to P74.
      const decomp = decompose(effectiveText, aisp, config.pages)
      if (decomp.todos.length >= 1) emit(logCtx, 'decomposition', { todos: decomp.todos, confidence: decomp.confidence, source: decomp.source })
      if (decomp.todos.length > 1 && decomp.confidence >= 0.7) {
        // P79 / OC-14 (A3) — feed scoped config so executeTodos sees only the
        // active page's sections (multi-page) or root sections (single-page).
        const decompConfig = scope.scopeRoot
          ? { ...useConfigStore.getState().config, sections: scope.sections }
          : useConfigStore.getState().config
        const exec = executeTodos(decomp, decompConfig)
        if (exec.allPatches.length > 0) {
          stageMarks.applyStart = Date.now()
          // P82 / OC-CLEANUP (A3) — per-todo page scoping. When any trace
          // carries a Todo.targetPage, prefix that trace's patches with the
          // todo's own scopeRoot; remaining traces use the submit-time `scope`.
          // Backward-compat: when no todo has targetPage, this collapses to
          // the P79 single-prefix path (byte-equivalent allPatches handling).
          const anyTodoPage = exec.traces.some((t) => !!t.todo.targetPage)
          let composed: JSONPatch[]
          if (anyTodoPage) {
            composed = []
            for (const trace of exec.traces) {
              if (trace.patches.length === 0) continue
              const todoScope = trace.todo.targetPage
                ? getActivePage(config, trace.todo.targetPage)
                : scope
              composed.push(
                ...(prefixPatchPaths(trace.patches, todoScope.scopeRoot) as JSONPatch[]),
              )
            }
          } else {
            composed = prefixPatchPaths(exec.allPatches, scope.scopeRoot) as JSONPatch[]
          }
          const beforeDecomp = useConfigStore.getState().config
          useConfigStore.getState().applyPatches(composed)
          const afterDecomp = useConfigStore.getState().config
          emit(logCtx, 'patch_validation', { stage: 'decomp', applied: composed.length, ok: true })
          editHist(logCtx, beforeDecomp, afterDecomp, composed as unknown[], text)
          const doneAt = Date.now()
          // P85 / OC-19 (A2) — Recommendation 2: surface user-visible todo list.
          const decompTodos: ChatPipelineResult['decompTodos'] = exec.traces.map((t) => ({
            verb: t.todo.verb,
            target: t.todo.target,
            status: t.status,
          }))
          emit(logCtx, 'response_summary', { stage: 'decomp', appliedPatchCount: exec.allPatches.length, latencyMs: doneAt - startedAt, ok: true })
          return {
            ok: true, appliedPatchCount: exec.allPatches.length, fellBackToCanned: false,
            summary: `Decomposed ${decomp.todos.length} todos — ${exec.allPatches.length} patches applied`,
            durationMs: doneAt - startedAt, errorKind: null,
            aisp: aispTrace, aispRoute,
            latencyMs: doneAt - startedAt, latencyBreakdown: buildBreakdown(stageMarks, doneAt),
            decompTodos,
          }
        }
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[chatPipeline] decomp atom threw', e)
    }
    // P72 / OC-TI (A4) — try the 3-layer template matcher first. High-confidence
    // matches short-circuit SELECTION_ATOM; low-confidence falls through.
    try {
      // P79 / OC-14 (A3) — feed scoped config so the matcher + applier see
      // only the active page's sections (multi-page) or root sections
      // (single-page; scopedConfig === config when scope.scopeRoot === '').
      const scopedConfig = scope.scopeRoot
        ? { ...useConfigStore.getState().config, sections: scope.sections }
        : useConfigStore.getState().config
      const tplMatch = matchTemplates(effectiveText, scopedConfig)
      emit(logCtx, 'template_match', { theme: tplMatch.theme?.id ?? null, sectionArrangement: tplMatch.sectionArrangement?.id ?? null, contentStyle: tplMatch.contentStyle?.id ?? null, confidence: tplMatch.confidence, alternatives: tplMatch.alternatives ?? null, rationale: tplMatch.rationale })
      if (tplMatch.confidence >= TEMPLATE_CONFIDENCE_THRESHOLD) {
        const tiPatches = applyTemplateMatch(tplMatch, scopedConfig)
        if (tiPatches.length > 0) {
          stageMarks.applyStart = Date.now()
          // P79 / OC-14 (A3) — prefix patch paths to active page scope.
          const beforeTpl = useConfigStore.getState().config
          const tplScopedPatches = prefixPatchPaths(tiPatches, scope.scopeRoot) as JSONPatch[]
          useConfigStore.getState().applyPatches(tplScopedPatches)
          const afterTpl = useConfigStore.getState().config
          emit(logCtx, 'patch_validation', { stage: 'template', applied: tplScopedPatches.length, ok: true })
          editHist(logCtx, beforeTpl, afterTpl, tplScopedPatches as unknown[], text)
          const doneAt = Date.now()
          // P85 / OC-19 (A2) — Recommendation 1: surface matcher confidence chip.
          // Name derived from highest-priority layer that matched (theme >
          // sectionArrangement > contentStyle); falls back to 'template' on the
          // unreachable case where confidence ≥ threshold but no layer object
          // is set (defensive — TemplateMatch contract guarantees ≥1 layer).
          const matcherName =
            tplMatch.theme?.id ?? tplMatch.sectionArrangement?.id ?? tplMatch.contentStyle?.id ?? 'template'
          emit(logCtx, 'response_summary', { stage: 'template', appliedPatchCount: tiPatches.length, latencyMs: doneAt - startedAt, ok: true })
          return {
            ok: true, appliedPatchCount: tiPatches.length, fellBackToCanned: false,
            summary: `Template intelligence — ${tplMatch.rationale}`,
            durationMs: doneAt - startedAt, errorKind: null,
            aisp: aispTrace, aispRoute,
            latencyMs: doneAt - startedAt, latencyBreakdown: buildBreakdown(stageMarks, doneAt),
            matcherConfidence: { name: matcherName, confidence: tplMatch.confidence },
          }
        }
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[chatPipeline] template intelligence threw', e)
    }
    if (aisp.confidence >= AISP_CONFIDENCE_THRESHOLD && aisp.target) {
      // AISP wins — construct canonical text from classified intent
      const verbWord = aisp.verb === 'remove' ? 'hide' : aisp.verb
      const scopeToken = `/${aisp.target.type}${aisp.target.index !== null ? `-${aisp.target.index}` : ''}`
      const paramsTail = aisp.params?.value ? ` to ${JSON.stringify(aisp.params.value)}` : ''
      canonicalForTemplate = `${verbWord} ${scopeToken}${paramsTail}`.trim()
    } else {
      // AISP not confident — fall through to P25 rule-based translator
      canonicalForTemplate = translateIntent(effectiveText).canonicalText
    }
    stageMarks.selectStart = Date.now()
    const tpl = tryMatchTemplate(canonicalForTemplate)
    if (tpl && tpl.envelope.patches.length > 0) {
      try {
        stageMarks.applyStart = Date.now()
        // P79 / OC-14 (A3) — prefix patch paths to active page scope.
        const beforeLegacy = useConfigStore.getState().config
        const legacyScoped = prefixPatchPaths(tpl.envelope.patches, scope.scopeRoot) as JSONPatch[]
        useConfigStore.getState().applyPatches(legacyScoped)
        const afterLegacy = useConfigStore.getState().config
        emit(logCtx, 'patch_validation', { stage: 'legacy-template', applied: legacyScoped.length, ok: true, templateId: tpl.template.id })
        editHist(logCtx, beforeLegacy, afterLegacy, legacyScoped as unknown[], text)
        const tplSummary = `${tpl.envelope.summary} _(template: ${tpl.template.id})_`
        const improvements = await deriveImprovements(
          effectiveText,
          tpl.envelope.patches.length,
          tplSummary,
          aispTrace,
          scope,
        )
        const personalityMessage = await derivePersonalityMessage(
          { summary: tplSummary, patches: tpl.envelope.patches },
          aispTrace,
        )
        emit(logCtx, 'personality_display', { personalityId: useIntelligenceStore.getState().personalityId ?? null, message: personalityMessage ? redactKeyShapes(personalityMessage) : null })
        const doneAt = Date.now()
        emit(logCtx, 'response_summary', { stage: 'legacy-template', appliedPatchCount: tpl.envelope.patches.length, latencyMs: doneAt - startedAt, ok: true })
        return {
          ok: true,
          appliedPatchCount: tpl.envelope.patches.length,
          fellBackToCanned: false,
          summary: tplSummary,
          durationMs: doneAt - startedAt,
          errorKind: null,
          aisp: aispTrace,
          aispRoute,
          templateId: tpl.template.id,
          improvements,
          personalityMessage,
          personalityId: useIntelligenceStore.getState().personalityId ?? null,
          latencyMs: doneAt - startedAt,
          latencyBreakdown: buildBreakdown(stageMarks, doneAt),
        }
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[chatPipeline] template applyPatches threw', e)
        // fall through to LLM on apply failure
      }
    } else if (tpl && tpl.envelope.patches.length === 0) {
      // Template matched but resolved to a friendly empty-patch (e.g. section absent).
      // Surface the message immediately rather than proxying through the LLM.
      return {
        ok: false,
        appliedPatchCount: 0,
        fellBackToCanned: true,
        summary: `${tpl.envelope.summary} _(template: ${tpl.template.id})_`,
        durationMs: Date.now() - startedAt,
        errorKind: null,
        aisp: aispTrace,
        templateId: tpl.template.id,
      }
    }
  } catch (e) {
    // Template module load failure is non-fatal — fall through to LLM as before
    if (import.meta.env.DEV) console.warn('[chatPipeline] template router unavailable', e)
  }

  // P37 A2 — content-route gate. The LLM patch pipeline below generates a
  // JSON-patch envelope (design intent: hide/show/add/change-style). It is the
  // wrong tool for copy/word changes — those belong to the CONTENT_ATOM
  // pipeline (`generateContent` / contentGenerator), which is wired in P38.
  // For now: when AISP routed to 'content' AND no template matched (so we'd
  // otherwise fall to the LLM patch path), short-circuit to the canned hint
  // so the user gets a sensible reply instead of a wrong-shape JSON patch.
  // TODO: content route → P38 LLM content call (CONTENT_ATOM verbatim → LLM).
  if (aispRoute === 'content') {
    const canned = runCanned(effectiveText)
    // P37 R1 F2 fix-pass — replace the dev-y "wired up in the next phase"
    // dead-end with a Grandma-friendly nudge that gives a concrete next step
    // and does NOT loop the user (mentions a specific phrasing form they
    // can retry with).
    return {
      ok: canned.matched,
      appliedPatchCount: 0,
      fellBackToCanned: true,
      summary: canned.matched
        ? canned.summary
        : "I can do design changes right now — for copy edits, try a specific phrasing like \"change the headline to 'X'\" or pick a template via the browse button.",
      durationMs: Date.now() - startedAt,
      errorKind: null,
      aisp: aispTrace,
      aispRoute,
    }
  }

  let pipelineErrorKind: ChatErrorKind | null = null
  try {
    stageMarks.patchStart = Date.now()
    // P79 / OC-14 (A3) — thread scope into runLLMPipeline so its applyPatches
    // call also lands on the active page (or root, single-page mode).
    const beforeLLM = useConfigStore.getState().config
    const llm = await runLLMPipeline(effectiveText, opts.source, opts.history, scope)
    if (llm.applied > 0) {
      const afterLLM = useConfigStore.getState().config
      emit(logCtx, 'patch_validation', { stage: 'llm', applied: llm.applied, ok: true })
      editHist(logCtx, beforeLLM, afterLLM, [], text)
      const improvements = await deriveImprovements(effectiveText, llm.applied, llm.summary, aispTrace, scope)
      const personalityMessage = await derivePersonalityMessage(
        { summary: llm.summary, patches: new Array(llm.applied) },
        aispTrace,
      )
      emit(logCtx, 'personality_display', { personalityId: useIntelligenceStore.getState().personalityId ?? null, message: personalityMessage ? redactKeyShapes(personalityMessage) : null })
      const doneAt = Date.now()
      emit(logCtx, 'response_summary', { stage: 'llm', appliedPatchCount: llm.applied, latencyMs: doneAt - startedAt, ok: true })
      return {
        ok: true,
        appliedPatchCount: llm.applied,
        fellBackToCanned: false,
        summary: llm.summary,
        durationMs: doneAt - startedAt,
        errorKind: null,
        aisp: aispTrace,
        aispRoute,
        improvements,
        personalityMessage,
        personalityId: useIntelligenceStore.getState().personalityId ?? null,
        latencyMs: doneAt - startedAt,
        latencyBreakdown: buildBreakdown(stageMarks, doneAt),
      }
    }
    pipelineErrorKind = llm.errorKind ?? null
    // FIX 4: when adapter is null we still drop into the canned fallback so the
    // user gets a usable reply, but we surface the precondition reason in the
    // summary (kept short, KISS) and skip the LLM-error catch path entirely.
    if (llm.preconditionFailed === 'no_adapter') {
      const canned = runCanned(effectiveText)
      return {
        ok: canned.matched,
        appliedPatchCount: 0,
        fellBackToCanned: true,
        summary: canned.matched ? canned.summary : 'No LLM provider configured.',
        durationMs: Date.now() - startedAt,
        errorKind: 'precondition_failed',
        aisp: aispTrace,
        aispRoute,
      }
    }
  } catch (e) {
    // F17: replace the silent swallow. Record a pipeline failure (callId is
    // null because the LLM-pipeline body owns its own audit row, but a throw
    // here means we never got one) and DEV-warn so engineers can debug.
    recordPipelineFailure(null, 'apply', `@root: ${e instanceof Error ? e.message : String(e)}`)
    if (import.meta.env.DEV) console.warn('[chatPipeline] runLLMPipeline threw', e)
    pipelineErrorKind = 'unknown'
  }
  const canned = runCanned(effectiveText)
  emit(logCtx, 'response_summary', { stage: 'canned-fallback', appliedPatchCount: 0, latencyMs: Date.now() - startedAt, ok: canned.matched, errorKind: pipelineErrorKind })
  return {
    ok: canned.matched,
    appliedPatchCount: 0,
    fellBackToCanned: true,
    summary: canned.summary,
    durationMs: Date.now() - startedAt,
    errorKind: pipelineErrorKind,
    aisp: aispTrace,
    aispRoute,
  }
}

/**
 * P19 Fix-Pass 2 (F2): re-export so ChatInput uses a single source. The local
 * mapper lives in src/lib/mapChatError.ts; we keep this thin re-export for
 * ergonomics (consumers `import { mapChatError, FALLBACK_HINT }` from one path).
 */
export { mapChatError } from '@/lib/mapChatError'
export { FALLBACK_HINT }
