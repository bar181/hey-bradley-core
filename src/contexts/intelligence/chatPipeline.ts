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
import { buildSystemPrompt } from '@/contexts/intelligence/prompts/system'
import { parseResponse } from '@/contexts/intelligence/llm/responseParser'
import { validatePatches } from '@/contexts/intelligence/llm/patchValidator'
import { auditedComplete } from '@/contexts/intelligence/llm/auditedComplete'
import { recordPipelineFailure } from '@/contexts/intelligence/llm/recordPipelineFailure'
import { parseChatCommand, parseMultiPartCommand } from '@/lib/cannedChat'
import type { ChatErrorKind } from '@/lib/mapChatError'
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp'

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
    useConfigStore.getState().applyPatches(parsed.envelope.patches)
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
 * Single shared entry point. Both ChatInput and ListenTab call this. The
 * in-flight mutex lives inside auditedComplete (centralised P18 fix), so two
 * concurrent submits — even from different surfaces — return cleanly with
 * `ok: false, fellBackToCanned: true` on the second.
 */
export async function submit(opts: ChatPipelineOptions): Promise<ChatPipelineResult> {
  const startedAt = Date.now()
  const text = opts.text.trim()
  if (!text) {
    return {
      ok: false,
      appliedPatchCount: 0,
      fellBackToCanned: false,
      summary: '',
      durationMs: Date.now() - startedAt,
      errorKind: null,
    }
  }

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

    let canonicalForTemplate: string
    let aisp = classifyIntent(text)
    let aispSource: 'rules' | 'llm' | 'fallthrough' = 'rules'
    // P27: when rule-based AISP is below threshold, ask the LLM to classify
    // via the SAME Crystal Atom. Thesis demonstration ADR-056.
    if (aisp.confidence < AISP_CONFIDENCE_THRESHOLD || !aisp.target) {
      const llmAisp = await llmClassifyIntent(text)
      if (llmAisp && llmAisp.confidence >= AISP_CONFIDENCE_THRESHOLD && llmAisp.target) {
        aisp = llmAisp
        aispSource = 'llm'
      } else {
        aispSource = 'fallthrough'
      }
    }
    aispTrace = { intent: aisp, source: aispSource }
    // P37 A2 — classify route (content vs design vs ambiguous). Pure-rule, $0.
    // Call only when AISP is confident enough to have a target; otherwise the
    // route will be re-decided downstream by the legacy translator + router.
    if (aisp.confidence >= AISP_CONFIDENCE_THRESHOLD && aisp.target) {
      aispRoute = classifyRoute(aisp, text).route
    }
    if (aisp.confidence >= AISP_CONFIDENCE_THRESHOLD && aisp.target) {
      // AISP wins — construct canonical text from classified intent
      const verbWord = aisp.verb === 'remove' ? 'hide' : aisp.verb
      const scopeToken = `/${aisp.target.type}${aisp.target.index !== null ? `-${aisp.target.index}` : ''}`
      const paramsTail = aisp.params?.value ? ` to ${JSON.stringify(aisp.params.value)}` : ''
      canonicalForTemplate = `${verbWord} ${scopeToken}${paramsTail}`.trim()
    } else {
      // AISP not confident — fall through to P25 rule-based translator
      canonicalForTemplate = translateIntent(text).canonicalText
    }
    const tpl = tryMatchTemplate(canonicalForTemplate)
    if (tpl && tpl.envelope.patches.length > 0) {
      try {
        useConfigStore.getState().applyPatches(tpl.envelope.patches)
        return {
          ok: true,
          appliedPatchCount: tpl.envelope.patches.length,
          fellBackToCanned: false,
          summary: `${tpl.envelope.summary} _(template: ${tpl.template.id})_`,
          durationMs: Date.now() - startedAt,
          errorKind: null,
          aisp: aispTrace,
          templateId: tpl.template.id,
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
    const canned = runCanned(text)
    return {
      ok: canned.matched,
      appliedPatchCount: 0,
      fellBackToCanned: true,
      summary: canned.matched
        ? canned.summary
        : "Content rewrites are wired up in the next phase. Try a design change for now (e.g. 'change to dark mode' or 'add a pricing section').",
      durationMs: Date.now() - startedAt,
      errorKind: null,
      aisp: aispTrace,
    }
  }

  let pipelineErrorKind: ChatErrorKind | null = null
  try {
    const llm = await runLLMPipeline(text, opts.source, opts.history)
    if (llm.applied > 0) {
      return {
        ok: true,
        appliedPatchCount: llm.applied,
        fellBackToCanned: false,
        summary: llm.summary,
        durationMs: Date.now() - startedAt,
        errorKind: null,
        aisp: aispTrace,
      }
    }
    pipelineErrorKind = llm.errorKind ?? null
    // FIX 4: when adapter is null we still drop into the canned fallback so the
    // user gets a usable reply, but we surface the precondition reason in the
    // summary (kept short, KISS) and skip the LLM-error catch path entirely.
    if (llm.preconditionFailed === 'no_adapter') {
      const canned = runCanned(text)
      return {
        ok: canned.matched,
        appliedPatchCount: 0,
        fellBackToCanned: true,
        summary: canned.matched ? canned.summary : 'No LLM provider configured.',
        durationMs: Date.now() - startedAt,
        errorKind: 'precondition_failed',
        aisp: aispTrace,
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
  const canned = runCanned(text)
  return {
    ok: canned.matched,
    appliedPatchCount: 0,
    fellBackToCanned: true,
    summary: canned.summary,
    durationMs: Date.now() - startedAt,
    errorKind: pipelineErrorKind,
    aisp: aispTrace,
  }
}

/**
 * P19 Fix-Pass 2 (F2): re-export so ChatInput uses a single source. The local
 * mapper lives in src/lib/mapChatError.ts; we keep this thin re-export for
 * ergonomics (consumers `import { mapChatError, FALLBACK_HINT }` from one path).
 */
export { mapChatError } from '@/lib/mapChatError'
export { FALLBACK_HINT }
