/**
 * P67 / Polish Wave 2 / A1 — ChatInputQuickActions
 *
 * Quick-reference affordances that sit between the chat thread and the input
 * bar: empty-state "try" hint, persistent /browse link, "bradley is thinking"
 * indicator, "Try an Example" button, and the modal example dialog (with the
 * SIMULATED_REQUIREMENTS multi-step presets section).
 *
 * Extracted from ChatInput.tsx (was lines ~849-974). The orchestrator owns
 * all state; this component is a thin presentational wrapper that fires
 * callbacks back up.
 */
import { Lightbulb, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SIMULATED_REQUIREMENTS, type SimulatedRequirement } from '@/lib/cannedChat'

const CHAT_EXAMPLE_CATEGORIES = [
  {
    title: 'Site Templates',
    items: [
      'Build me a bakery website',
      'Create a SaaS landing page',
      'Build a Harvard capstone research site',
    ],
  },
  {
    title: 'Common Updates',
    items: ['Add a pricing section', 'Add testimonials', 'Change to dark mode'],
  },
  {
    title: 'Style Changes',
    items: ['Make it professional', 'Target developers', 'Make it casual'],
  },
] as const

export interface ChatInputQuickActionsProps {
  /** Show the empty-state "try: …" hint band. */
  showEmptyHint: boolean
  /** Show the persistent "/browse — pick a template" link. */
  showBrowseLink: boolean
  /** Show the "bradley is thinking…" indicator. */
  showThinking: boolean
  /** Disable the Try-Example button (busy or demo). */
  disableExamples: boolean
  /** Examples dialog visibility (orchestrator-owned). */
  examplesOpen: boolean
  onOpenExamples: () => void
  onCloseExamples: () => void
  onOpenBrowse: () => void
  /** Pick an example string — orchestrator handles auto-send. */
  onPickExample: (example: string) => void
  /** Pick a multi-step preset — orchestrator handles dispatch. */
  onPickSimulatedRequirement: (req: SimulatedRequirement) => void
}

export function ChatInputQuickActions({
  showEmptyHint,
  showBrowseLink,
  showThinking,
  disableExamples,
  examplesOpen,
  onOpenExamples,
  onCloseExamples,
  onOpenBrowse,
  onPickExample,
  onPickSimulatedRequirement,
}: ChatInputQuickActionsProps) {
  return (
    <>
      {/* Hint — when empty and focused */}
      {showEmptyHint && (
        <div className="px-4 py-1.5 text-xs text-hb-text-muted border-t border-hb-border/50">
          try: <span className="text-hb-text-secondary">"dark mode"</span> ·{' '}
          <span className="text-hb-text-secondary">"add pricing"</span> ·{' '}
          <span className="text-hb-text-secondary">
            "build a SaaS page with pricing and testimonials"
          </span>{' '}
          · type <span className="text-hb-text-secondary">/browse</span> to pick a template
        </div>
      )}

      {/* R1 F1 fix-pass — persistent /browse affordance after first message. */}
      {showBrowseLink && (
        <button
          type="button"
          data-testid="browse-templates-link"
          onClick={onOpenBrowse}
          className="px-4 py-1 text-[11px] text-hb-text-muted hover:text-hb-text-primary border-t border-hb-border/50 text-left underline decoration-dotted self-start"
        >
          /browse — pick a template
        </button>
      )}

      {/* P18 Step 3 (A7): in-flight thinking indicator. */}
      {showThinking && (
        <div
          className="px-4 py-1 text-xs text-hb-text-muted border-t border-hb-border/50 flex items-center gap-1.5"
          data-testid="chat-thinking"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-hb-accent animate-pulse" />
          bradley is thinking...
        </div>
      )}

      {/* Try an Example button */}
      <div className="px-3 py-1.5 border-t border-hb-border/50">
        <Button
          variant="ghost"
          onClick={onOpenExamples}
          disabled={disableExamples}
          className="w-full flex items-center justify-center gap-2 h-auto py-2 text-xs text-hb-text-muted hover:text-hb-accent hover:bg-hb-accent/5 transition-colors disabled:opacity-40"
          data-testid="try-example-btn"
        >
          <Lightbulb size={14} />
          Try an Example
        </Button>
      </div>

      {/* Examples dialog */}
      {examplesOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onCloseExamples}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCloseExamples()
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat examples"
        >
          <div
            className="bg-hb-bg border border-hb-border rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-hb-border">
              <h2 className="text-sm font-semibold text-hb-text-primary">Try an Example</h2>
              <button
                type="button"
                onClick={onCloseExamples}
                className="text-hb-text-muted hover:text-hb-text-primary transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {CHAT_EXAMPLE_CATEGORIES.map((cat) => (
                <div key={cat.title}>
                  <p className="text-xs text-hb-text-muted uppercase tracking-wider font-medium mb-2">
                    {cat.title}
                  </p>
                  <div className="space-y-1.5">
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => onPickExample(item)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-hb-text-primary bg-hb-surface hover:bg-hb-surface-hover hover:text-hb-accent border border-hb-border/50 hover:border-hb-accent/30 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Simulated requirements in dialog */}
              <div>
                <p className="text-xs text-hb-text-muted uppercase tracking-wider font-medium mb-2">
                  Multi-step Presets
                </p>
                <div className="space-y-1.5">
                  {SIMULATED_REQUIREMENTS.map((req) => (
                    <button
                      key={req.name}
                      type="button"
                      onClick={() => onPickSimulatedRequirement(req)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-hb-accent/20 bg-hb-surface hover:bg-hb-accent/5 hover:border-hb-accent/40 transition-all"
                      data-testid={`sim-req-${req.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="text-sm font-medium text-hb-accent">{req.name}</span>
                      <span className="block text-hb-text-muted text-[10px] leading-tight mt-0.5">
                        {req.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
