/**
 * P34 Sprint E P1 (Sprint D UI closure A2) — Template Browse Picker.
 *
 * Visual grid of available templates (registry-baked + user-authored). User
 * clicks a template to fill the chat input with its first example phrase;
 * sender re-uses the existing chatPipeline path so no new patch-application
 * code paths.
 *
 * Triggered by typing `/browse` in ChatInput. Lands the R1 F3 + F4 closure
 * from the Sprint D brutal-honest review (browse-picker UI + examples
 * discovery surface).
 *
 * KISS: text-mode picker (cards in a 1-2 column grid). No drag/drop, no
 * preview hover, no animations. Click → fill input → user reads + sends.
 */
import { listAllForBrowse, type BrowseTemplate } from '@/contexts/intelligence/templates/library'

export interface TemplateBrowsePickerProps {
  /** Called when user clicks a template card; receives the first example phrase. */
  onPick: (examplePhrase: string) => void
  /** Called when user dismisses the picker. */
  onClose: () => void
}

export function TemplateBrowsePicker({ onPick, onClose }: TemplateBrowsePickerProps) {
  // Registry-only at runtime (loadUserRows callback omitted; user_templates UI lands later).
  const templates = listAllForBrowse()
  const byCategory = templates.reduce<Record<string, BrowseTemplate[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})
  const categoryOrder: Array<BrowseTemplate['category']> = ['theme', 'section', 'content']

  return (
    <div
      data-testid="template-browse-picker"
      className="border-t border-hb-border/50 bg-hb-surface/30 p-3 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-hb-text-secondary uppercase tracking-wider">
          Browse templates ({templates.length})
        </div>
        <button
          type="button"
          data-testid="template-browse-close"
          onClick={onClose}
          className="text-xs text-hb-text-muted hover:text-hb-text-primary underline decoration-dotted"
        >
          close
        </button>
      </div>
      {categoryOrder.map((cat) => {
        const items = byCategory[cat] ?? []
        if (!items.length) return null
        return (
          <div key={cat} className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider text-hb-text-muted">
              {cat} ({items.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {items.map((t) => {
                const example = t.examples[0] ?? ''
                return (
                  <button
                    type="button"
                    key={t.id}
                    data-testid={`template-card-${t.id}`}
                    onClick={() => onPick(example)}
                    disabled={!example}
                    // R1 L6 fix-pass — visible focus ring for keyboard users.
                    className="text-left p-2 rounded border border-hb-border/40 bg-white/40 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8772e]"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-hb-text-primary">{t.name}</span>
                      <span className="text-[10px] uppercase px-1 py-0.5 rounded bg-[#e8772e]/10 text-[#8a4a1c]">
                        {t.kind}
                      </span>
                      {/* R1 F2 fix-pass — "yours" tag deferred until P34+ wires
                          user_templates loadUserRows; removed dead branch. */}
                    </div>
                    {example && (
                      <div className="text-[11px] text-hb-text-muted italic">
                        try: "{example}"
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="text-[10px] text-hb-text-muted">
        Click any template to fill the input with an example. Edit and send.
      </div>
    </div>
  )
}
