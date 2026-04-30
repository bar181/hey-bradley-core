/**
 * P67 / Polish Wave 2 / A1 — ChatInputBar
 *
 * The bottom input row: text field + send button + busy/disabled chrome.
 * Extracted from ChatInput.tsx (was lines 980-1010). The orchestrator owns
 * the input value and busy state; this component is a controlled view.
 *
 * Note (P19 history): no mic button here — voice/PTT lives on ListenTab.
 * Note (P18 Step 3 / A7): when isBusy, the whole bar dims to opacity-60 so
 * it's visually obvious the input is locked.
 */
import { forwardRef } from 'react'
import { SendHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface ChatInputBarProps {
  value: string
  onChange: (next: string) => void
  onSend: () => void
  onFocus: () => void
  onBlur: () => void
  isBusy: boolean
}

export const ChatInputBar = forwardRef<HTMLInputElement, ChatInputBarProps>(
  function ChatInputBar({ value, onChange, onSend, onFocus, onBlur, isBusy }, ref) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSend()
      }
    }

    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 border-t border-hb-border bg-hb-surface transition-opacity',
          isBusy && 'opacity-60'
        )}
      >
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={isBusy ? 'thinking...' : 'Tell Bradley what to build...'}
          aria-label="Tell Bradley what to build"
          aria-busy={isBusy}
          data-testid="chat-input"
          disabled={isBusy}
          className="flex-1 h-auto bg-transparent border-none outline-none ring-0 text-sm text-hb-text-primary placeholder:text-hb-text-muted disabled:opacity-50 focus-visible:border-none focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Send message"
          onClick={onSend}
          disabled={isBusy || !value.trim()}
          className="flex items-center justify-center w-8 h-8 rounded-full text-hb-accent hover:bg-hb-accent/10 transition-colors disabled:opacity-30"
        >
          <SendHorizontal size={16} />
        </Button>
      </div>
    )
  }
)
