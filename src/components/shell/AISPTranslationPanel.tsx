/**
 * P27 Sprint C P2 — Human-Visible AISP Translation Panel.
 *
 * Collapsible "How I understood this" panel surfacing the AISP intent
 * classification step. Shows verb / target / confidence / rationale —
 * the math-first symbolic layer made human-readable.
 *
 * Capstone-thesis demonstration: Sprint C P1 (P26) made AISP a code artifact;
 * Sprint C P2 (P27) makes it user-visible.
 *
 * ADR-056 (LLM-Native AISP Understanding).
 *
 * P44 Sprint H Wave 1 (A2) — Brand-voice indicator. Surfaces a small
 * "voice: brand-aware" chip when a brand context is active (CONTENT_ATOM Λ
 * brand_voice channel; ADR-067). Source-of-truth for the flag is, in order:
 *   1) the explicit `brandActive` prop (caller-driven, set by ChatInput once
 *      A1 wires the uiStore signal),
 *   2) the kv-layer fallback (`kv` row 'brand_context' present + non-empty),
 *      so the chip works the moment A1 ships even before ChatInput wires the
 *      prop. Soft-fail: any kv-layer error (DB not yet initialised, table
 *      missing on a fresh boot) silently degrades to "no chip".
 */
import { useState } from 'react'
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp'
import { kvGet } from '@/contexts/persistence/repositories/kv'

export interface AISPTranslationPanelProps {
  /** The classified intent for the most recent chat input. null = not classified yet. */
  intent: ClassifiedIntent | null
  /** Source label: 'rules' = P26 rule-based; 'llm' = P27 LLM-driven; 'fallthrough' = below threshold */
  source: 'rules' | 'llm' | 'fallthrough'
  /** Original user text. */
  userText: string
  /**
   * P34 Sprint E P1 (A1) — id of the template the router picked. When the
   * generator path runs it's `'generate-headline'`. Surfaced as a chip so the
   * user sees which template handled the request without opening the panel.
   */
  templateId?: string | null
  /**
   * P44 Sprint H Wave 1 (A2) — explicit brand-voice flag from the caller.
   * When `undefined`, the panel falls back to a defensive kv-layer check on
   * the canonical 'brand_context' key A1 writes. When `false`, the chip is
   * suppressed even if kv has a value (caller override).
   */
  brandActive?: boolean
}

/**
 * P44 (A2) — Defensive kv-layer probe. A1's brandContext repo is the
 * authoritative reader; this fallback only inspects the raw key so we don't
 * pre-import an A1-owned module. Any throw (DB not yet ready, kv table
 * missing on first boot) collapses to `false` so the chat surface never
 * cracks on a brand-side error.
 */
function probeBrandContextActive(): boolean {
  try {
    const v = kvGet('brand_context')
    return typeof v === 'string' && v.trim().length > 0
  } catch {
    return false
  }
}

export function AISPTranslationPanel({
  intent,
  source,
  userText,
  templateId,
  brandActive,
}: AISPTranslationPanelProps) {
  const [open, setOpen] = useState(false)
  // P34 — surface even when intent is null but a template fired (canned fallback path).
  if (!intent && !templateId) return null
  // P44 (A2) — explicit prop wins; otherwise fall back to kv probe so the chip
  // lights up the instant A1's upload writes the row, no ChatInput rewire required.
  const brandOn = brandActive ?? probeBrandContextActive()
  const targetLabel = intent?.target
    ? `${intent.target.type}${intent.target.index !== null ? `-${intent.target.index}` : ''}`
    : 'none'
  const sourceLabel = source === 'llm' ? 'LLM' : source === 'rules' ? 'Rules' : 'Fallthrough'
  const sourceColor =
    source === 'llm' ? 'text-indigo-700 bg-indigo-50' :
    source === 'rules' ? 'text-emerald-700 bg-emerald-50' :
    'text-amber-700 bg-amber-50'

  return (
    <div data-testid="aisp-translation-panel" className="text-xs font-mono mt-1">
      <button
        type="button"
        data-testid="aisp-translation-toggle"
        onClick={() => setOpen((v) => !v)}
        className="text-[#6b5e4f] hover:text-[#2d1f12] underline decoration-dotted"
      >
        {open ? '▾' : '▸'} How I understood this
      </button>
      {/* P34 — template chip outside the collapsible: a glance is enough. */}
      {templateId && (
        <span
          data-testid="aisp-template-chip"
          className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-[#e8772e]/10 text-[#8a4a1c] border border-[#e8772e]/30"
        >
          template: {templateId}
        </span>
      )}
      {/* P44 (A2 / ADR-067) — brand-voice indicator. Sits next to the template
          chip so a glance tells the user the LLM is biased toward their brand. */}
      {brandOn && (
        <span
          data-testid="aisp-brand-voice-chip"
          title="Brand voice profile is active — content generation is biased toward your uploaded voice."
          className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-[#1f3a5f]/10 text-[#1f3a5f] border border-[#1f3a5f]/30"
        >
          voice: brand-aware
        </span>
      )}
      {open && (
        <div data-testid="aisp-translation-detail" className="mt-1 p-2 rounded border border-[#e8772e]/20 bg-[#f1ece4]/50 space-y-1">
          <div><span className="text-[#6b5e4f]">input:</span> <span className="text-[#2d1f12]">{userText}</span></div>
          {intent ? (
            <>
              <div><span className="text-[#6b5e4f]">verb:</span> <span className="text-[#2d1f12]">{intent.verb}</span></div>
              <div><span className="text-[#6b5e4f]">target:</span> <span className="text-[#2d1f12]">{targetLabel}</span></div>
              {intent.params?.value !== undefined && (
                <div><span className="text-[#6b5e4f]">params.value:</span> <span className="text-[#2d1f12]">{String(intent.params.value)}</span></div>
              )}
              <div><span className="text-[#6b5e4f]">confidence:</span> <span className="text-[#2d1f12]">{intent.confidence.toFixed(2)}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b5e4f]">source:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${sourceColor}`}>{sourceLabel}</span>
              </div>
              {intent.rationale && (
                <div><span className="text-[#6b5e4f]">rationale:</span> <span className="text-[#2d1f12]">{intent.rationale}</span></div>
              )}
            </>
          ) : (
            <div className="text-[#6b5e4f] italic">intent classifier didn't lock — request handled by direct template match.</div>
          )}
          {templateId && (
            <div><span className="text-[#6b5e4f]">template:</span> <span className="text-[#2d1f12]">{templateId}</span></div>
          )}
        </div>
      )}
    </div>
  )
}
