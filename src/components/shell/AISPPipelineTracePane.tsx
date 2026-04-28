/**
 * P35 Sprint E P2 (Wave 1 A2) — EXPERT-mode AISP Pipeline Trace pane.
 *
 * Renders the full AISP-pipeline trace for the most recent bradley reply:
 *   1. INTENT_ATOM     — verb + target + confidence + source (rules|llm|fallthrough)
 *   2. ASSUMPTIONS_ATOM — when fired (low confidence), shows ranked options + source
 *   3. SELECTION_ATOM  — template id selected
 *   4. CONTENT_ATOM    — when fired (kind:'generator'), shows generated text + tone
 *   5. PATCH_ATOM      — JSON-Patch envelope summary
 *
 * EXPERT-only (hidden when uiStore.rightPanelTab === 'SIMPLE'); collapsible;
 * non-blocking. Reuses the same data already attached to ChatMessage from
 * the chatPipeline result extension (P34 Wave 1 A1) — no new state, no new
 * pipeline plumbing.
 *
 * ADR-064.
 */
import { useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp'
import type { Assumption } from '@/contexts/intelligence/aisp'

export interface AISPPipelineTracePaneProps {
  userText: string
  intent: ClassifiedIntent | null
  intentSource: 'rules' | 'llm' | 'fallthrough'
  templateId: string | null
  assumptions?: readonly Assumption[]
  assumptionsSource?: 'llm' | 'rules' | 'empty'
  generated?: { text: string; tone: string; length: string; confidence: number } | null
  patches?: number | null
  summary?: string | null
}

export function AISPPipelineTracePane(props: AISPPipelineTracePaneProps) {
  const isDraft = useUIStore((s) => s.rightPanelTab) === 'SIMPLE'
  const [open, setOpen] = useState(false)
  // EXPERT-only: hidden in SIMPLE mode.
  if (isDraft) return null

  const intentLabel = props.intent
    ? `${props.intent.verb}` +
      (props.intent.target
        ? ` /${props.intent.target.type}` +
          (props.intent.target.index !== null ? `-${props.intent.target.index}` : '')
        : '')
    : '—'
  const sourceColor =
    props.intentSource === 'llm'
      ? 'bg-indigo-50 text-indigo-700'
      : props.intentSource === 'rules'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-amber-50 text-amber-700'

  return (
    <div data-testid="aisp-pipeline-trace" className="text-[11px] font-mono mt-1">
      <button
        type="button"
        data-testid="aisp-pipeline-toggle"
        onClick={() => setOpen((v) => !v)}
        className="text-[#6b5e4f] hover:text-[#2d1f12] underline decoration-dotted"
      >
        {open ? '▾' : '▸'} AISP pipeline (EXPERT)
      </button>
      {open && (
        <div
          data-testid="aisp-pipeline-detail"
          className="mt-1 p-2 rounded border border-indigo-200/50 bg-indigo-50/30 space-y-1.5"
        >
          {/* 1. INTENT_ATOM */}
          <div data-testid="trace-intent-atom" className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-wider text-indigo-700">
              1 · intent_atom
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#6b5e4f]">verb+target:</span>
              <span className="text-[#2d1f12]">{intentLabel}</span>
              <span className="text-[#6b5e4f]">conf:</span>
              <span className="text-[#2d1f12]">
                {props.intent ? props.intent.confidence.toFixed(2) : '—'}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${sourceColor}`}>
                {props.intentSource}
              </span>
            </div>
          </div>

          {/* 2. ASSUMPTIONS_ATOM (only when fired) */}
          {props.assumptions && props.assumptions.length > 0 && (
            <div data-testid="trace-assumptions-atom" className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-indigo-700">
                2 · assumptions_atom · source: {props.assumptionsSource ?? 'rules'}
              </div>
              <ul className="text-[#2d1f12] pl-3 list-disc">
                {props.assumptions.slice(0, 3).map((a) => (
                  <li key={a.id}>
                    <span className="text-[#6b5e4f]">{Math.round(a.confidence * 100)}% match · </span>
                    {a.label}
                    {a.rationale && (
                      <div className="text-[10px] text-[#6b5e4f] italic">
                        — {a.rationale}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. SELECTION_ATOM */}
          {props.templateId && (
            <div data-testid="trace-selection-atom" className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-indigo-700">
                3 · selection_atom
              </div>
              <div>
                <span className="text-[#6b5e4f]">template:</span>{' '}
                <span className="text-[#2d1f12]">{props.templateId}</span>
              </div>
            </div>
          )}

          {/* 4. CONTENT_ATOM (only on generator path) */}
          {props.generated && (
            <div data-testid="trace-content-atom" className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-indigo-700">
                4 · content_atom
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#6b5e4f]">text:</span>
                <span className="text-[#2d1f12]">"{props.generated.text}"</span>
                <span className="text-[#6b5e4f]">tone:</span>
                <span className="text-[#2d1f12]">{props.generated.tone}</span>
                <span className="text-[#6b5e4f]">length:</span>
                <span className="text-[#2d1f12]">{props.generated.length}</span>
                <span className="text-[#6b5e4f]">conf:</span>
                <span className="text-[#2d1f12]">{props.generated.confidence.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* 5. PATCH_ATOM */}
          <div data-testid="trace-patch-atom" className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-wider text-indigo-700">
              5 · patch_atom
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#6b5e4f]">patches applied:</span>
              <span className="text-[#2d1f12]">{props.patches ?? 0}</span>
            </div>
            {props.summary && (
              <div className="text-[#2d1f12]">
                <span className="text-[#6b5e4f]">summary:</span> {props.summary}
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#6b5e4f] italic pt-1">
            input: <span className="font-mono text-[#2d1f12]">"{props.userText}"</span>
          </div>
        </div>
      )}
    </div>
  )
}
