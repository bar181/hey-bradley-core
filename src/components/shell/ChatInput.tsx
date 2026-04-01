import { useState, useRef, useEffect } from 'react'
import { SendHorizontal } from 'lucide-react'
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
const TYPEWRITER_SPEED = 30 // ms per character

export function ChatInput() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [typingFull, setTypingFull] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingText])

  // Typewriter effect
  useEffect(() => {
    if (!typingFull) return
    if (typingText.length >= typingFull.length) {
      // Done typing — add to messages
      const id = nextId.current++
      setMessages((prev) => [...prev.slice(-MAX_MESSAGES + 1), { id, role: 'bradley', text: typingFull + ' \u2713' }])
      setTypingText('')
      setTypingFull('')
      setIsProcessing(false)
      inputRef.current?.focus()
      return
    }
    const timer = setTimeout(() => {
      setTypingText(typingFull.slice(0, typingText.length + 1))
    }, TYPEWRITER_SPEED)
    return () => clearTimeout(timer)
  }, [typingText, typingFull])

  const addUserMessage = (text: string) => {
    const id = nextId.current++
    setMessages((prev) => [...prev.slice(-MAX_MESSAGES + 1), { id, role: 'user', text }])
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

    addUserMessage(text)
    setInput('')
    setIsProcessing(true)

    setTimeout(() => {
      const result = parseChatCommand(text)
      if (result.action) executeAction(result.action)
      // Start typewriter
      setTypingText('')
      setTypingFull(result.response)
    }, 400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages — closed captioning style */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1"
        data-testid="chat-messages"
      >
        {messages.length === 0 && !typingFull && (
          <div className="text-sm text-hb-text-muted py-2">
            hi! tell me what to build.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'py-1',
              msg.role === 'user' ? 'text-sm text-hb-text-muted' : 'text-sm text-hb-text-primary'
            )}
            data-testid={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bradley'}
          >
            {msg.role === 'user' && <span className="font-semibold text-hb-text-secondary">you: </span>}
            {msg.text}
          </div>
        ))}
        {/* Typewriter in progress */}
        {typingFull && (
          <div className="py-1 text-sm text-hb-text-primary" data-testid="chat-msg-bradley">
            {typingText}
            <span className="inline-block w-0.5 h-3.5 bg-hb-accent ml-0.5 animate-pulse" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Hint — when empty and focused */}
      {isFocused && !input && messages.length === 0 && (
        <div className="px-4 py-1.5 text-xs text-hb-text-muted border-t border-hb-border/50">
          try: <span className="text-hb-text-secondary">"dark mode"</span> · <span className="text-hb-text-secondary">"add pricing"</span> · <span className="text-hb-text-secondary">"headline Hello"</span>
        </div>
      )}

      {/* Input bar — no mic button */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-hb-border bg-hb-surface">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Tell Bradley what to build..."
          aria-label="Tell Bradley what to build"
          data-testid="chat-input"
          disabled={isProcessing}
          className="flex-1 bg-transparent border-none outline-none text-sm text-hb-text-primary placeholder:text-hb-text-muted disabled:opacity-50"
        />
        <button
          type="button"
          aria-label="Send message"
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
          className="flex items-center justify-center w-8 h-8 rounded-full text-hb-accent hover:bg-hb-accent/10 transition-colors disabled:opacity-30"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}
