import { Mic, SendHorizontal } from 'lucide-react'

export function ChatInput() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-hb-surface border-t border-hb-border">
      <button
        type="button"
        aria-label="Toggle microphone"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-hb-text-muted hover:text-hb-accent transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
      >
        <Mic size={16} />
      </button>

      <input
        type="text"
        placeholder="Tell Bradley what to build..."
        aria-label="Tell Bradley what to build"
        data-testid="chat-input"
        className="flex-1 bg-transparent border-none outline-none font-ui text-sm text-hb-text-primary placeholder:text-hb-text-muted"
      />

      <button
        type="button"
        aria-label="Send message"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-hb-text-muted hover:text-hb-accent transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
      >
        <SendHorizontal size={16} />
      </button>
    </div>
  )
}
