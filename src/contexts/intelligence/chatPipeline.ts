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
}

const FALLBACK_HINT =
  "Hmm, I didn't catch that. Try one of: " +
  "Make the hero say 'Bake Joy Daily' · " +
  'Change to dark mode · ' +
  'Add a pricing section · ' +
  'Build me a bakery website · ' +
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
}> {
  const adapter = useIntelligenceStore.getState().adapter
  if (!adapter) {
    // FIX 4: emit an audit-equivalent observability signal so missing-adapter
    // is not a silent failure. recordPipelineFailure tolerates a null callId
    // and DEV-warns — keeping ADR-047 observability honoured even when no
    // llm_calls row exists (auditedComplete never ran).
    recordPipelineFailure(null, 'validate', '@root: no_adapter')
    return { applied: 0, summary: '', preconditionFailed: 'no_adapter' }
  }
  const configState = useConfigStore.getState()
  const systemPrompt = buildSystemPrompt({ configJson: configState.config, history })
  const res = await auditedComplete(adapter, { systemPrompt, userPrompt: text }, { source })
  if (!res.ok) return { applied: 0, summary: '' }
  const callId = res.auditCallId
  const parsed = parseResponse(res.json)
  if (!parsed.ok) {
    recordPipelineFailure(callId, 'parse', `@root: ${parsed.reason}`)
    return { applied: 0, summary: '' }
  }
  const errs = validatePatches(parsed.envelope.patches, configState.config)
  if (errs.length > 0) {
    const first = errs[0]
    const idxMatch = /^patch\[(\d+)\]/.exec(first)
    const where = idxMatch ? `@patch[${idxMatch[1]}]` : '@patches'
    const trimmed = first.replace(/^patch\[\d+\]:\s*/, '')
    recordPipelineFailure(callId, 'validate', `${where}: ${trimmed}`)
    return { applied: 0, summary: '' }
  }
  try {
    useConfigStore.getState().applyPatches(parsed.envelope.patches)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    recordPipelineFailure(callId, 'apply', `@apply: ${msg}`)
    return { applied: 0, summary: '' }
  }
  return {
    applied: parsed.envelope.patches.length,
    summary: parsed.envelope.summary ?? 'Done.',
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
    }
  }
  try {
    const llm = await runLLMPipeline(text, opts.source, opts.history)
    if (llm.applied > 0) {
      return {
        ok: true,
        appliedPatchCount: llm.applied,
        fellBackToCanned: false,
        summary: llm.summary,
        durationMs: Date.now() - startedAt,
      }
    }
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
      }
    }
  } catch {
    // Fall through to canned fallback. auditedComplete already logged the
    // adapter failure; surface a usable reply rather than a thrown error.
  }
  const canned = runCanned(text)
  return {
    ok: canned.matched,
    appliedPatchCount: 0,
    fellBackToCanned: true,
    summary: canned.summary,
    durationMs: Date.now() - startedAt,
  }
}
