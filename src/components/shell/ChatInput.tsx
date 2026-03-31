import { useState, useRef, useEffect } from 'react'
import { Mic, SendHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'
import { parseChatCommand } from '@/lib/cannedChat'
import { useConfigStore } from '@/store/configStore'
import type { SectionType } from '@/lib/schemas'

export interface ChatMessage {
  id: number
  role: 'user' | 'bradley'
  text: string
}

const MAX_MESSAGES = 20

export function ChatInput() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role: 'user' | 'bradley', text: string) => {
    const id = nextId.current++
    setMessages((prev) => [...prev.slice(-MAX_MESSAGES + 1), { id, role, text }])
  }

  const executeAction = (action: string) => {
    const store = useConfigStore.getState()
    const [cmd, ...rest] = action.split(':')
    const arg = rest.join(':')

    switch (cmd) {
      case 'toggleMode': {
        const currentMode = store.config.theme.mode
        if (arg !== currentMode) store.toggleMode()
        break
      }
      case 'addSection': {
        // Find the section and enable it, or add it if not present
        const section = store.config.sections.find((s) => s.type === arg)
        if (section && !section.enabled) {
          store.toggleSectionEnabled(section.id)
        } else if (!section) {
          store.addSection(arg as SectionType)
        }
        break
      }
      case 'removeSection': {
        const section = store.config.sections.find((s) => s.type === arg && s.enabled)
        if (section) store.toggleSectionEnabled(section.id)
        break
      }
      case 'headline': {
        const heroSection = store.config.sections.find((s) => s.type === 'hero')
        if (heroSection) {
          const headlineComp = heroSection.components.find((c) => c.id === 'headline')
          if (headlineComp) {
            store.setSectionConfig(heroSection.id, {
              components: heroSection.components.map((c) =>
                c.id === 'headline' ? { ...c, props: { ...c.props, text: arg } } : c
              ),
            })
          }
        }
        break
      }
      case 'applyVibe':
        store.applyVibe(arg)
        break
    }
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || isProcessing) return

    addMessage('user', text)
    setInput('')
    setIsProcessing(true)

    setTimeout(() => {
      const result = parseChatCommand(text)
      if (result.action) executeAction(result.action)
      addMessage('bradley', result.response)
      setIsProcessing(false)
      inputRef.current?.focus()
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col">
      {/* Chat messages */}
      {messages.length > 0 && (
        <div
          className="max-h-48 overflow-y-auto px-3 py-2 space-y-2 border-t border-hb-border"
          data-testid="chat-messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'text-xs px-3 py-2 rounded-lg max-w-[90%]',
                msg.role === 'user'
                  ? 'ml-auto bg-hb-accent/15 text-hb-text-primary'
                  : 'mr-auto bg-hb-surface text-hb-text-muted border border-hb-border/50'
              )}
              data-testid={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bradley'}
            >
              {msg.text}
            </div>
          ))}
          {isProcessing && (
            <div className="mr-auto text-xs px-3 py-2 rounded-lg bg-hb-surface text-hb-text-muted border border-hb-border/50 animate-pulse">
              Processing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-hb-surface border-t border-hb-border">
        <button
          type="button"
          aria-label="Toggle microphone"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-hb-text-muted hover:text-hb-accent transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
        >
          <Mic size={16} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell Bradley what to build..."
          aria-label="Tell Bradley what to build"
          data-testid="chat-input"
          disabled={isProcessing}
          className="flex-1 bg-transparent border-none outline-none font-ui text-sm text-hb-text-primary placeholder:text-hb-text-muted disabled:opacity-50"
        />

        <button
          type="button"
          aria-label="Send message"
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-hb-text-muted hover:text-hb-accent transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent disabled:opacity-30"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}
