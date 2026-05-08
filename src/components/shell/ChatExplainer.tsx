import { useEffect, useState } from 'react'
import { Pencil, Braces, Sparkles, X } from 'lucide-react'

const STORAGE_KEY = 'hb-chat-explainer-dismissed'

const STEPS = [
  { Icon: Pencil, label: 'Type a sentence.' },
  { Icon: Braces, label: 'I rebuild your page.' },
  { Icon: Sparkles, label: 'Your page changes.' },
] as const

/**
 * Tiny 3-step "How it works" explainer shown above the chat input.
 * Visible only on first session per device (DRAFT mode), dismissable.
 */
export function ChatExplainer() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1')
  }, [])

  if (dismissed) return null

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 border-t border-hb-border/50 bg-hb-surface/50 text-xs text-hb-text-muted"
      data-testid="chat-explainer"
    >
      <div className="flex-1 flex items-center justify-around gap-2">
        {STEPS.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon size={12} className="text-hb-accent shrink-0" aria-hidden />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="text-hb-text-muted hover:text-hb-text-primary transition-colors shrink-0"
        aria-label="Dismiss explainer"
      >
        <X size={12} />
      </button>
    </div>
  )
}
