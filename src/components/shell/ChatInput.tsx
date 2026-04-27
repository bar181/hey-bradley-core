import { useState, useRef, useEffect, useCallback } from 'react'
import { SendHorizontal, Lightbulb, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { parseChatCommand, parseMultiPartCommand, SIMULATED_REQUIREMENTS } from '@/lib/cannedChat'
import type { SimulatedRequirement, MultiChatResult } from '@/lib/cannedChat'
import { useConfigStore } from '@/store/configStore'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useUIStore } from '@/store/uiStore'
import { EXAMPLE_SITES } from '@/data/examples'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatExplainer } from '@/components/shell/ChatExplainer'
import type { SectionType, MasterConfig } from '@/lib/schemas'
import { buildSystemPrompt } from '@/contexts/intelligence/prompts/system'
import { parseResponse } from '@/contexts/intelligence/llm/responseParser'
import { validatePatches } from '@/contexts/intelligence/llm/patchValidator'
import { applyPatches } from '@/contexts/intelligence/applyPatches'
import { auditedComplete } from '@/contexts/intelligence/llm/auditedComplete'
import { recordPipelineFailure } from '@/contexts/intelligence/llm/recordPipelineFailure'

/* ── Chat examples for the dialog ── */
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
    items: [
      'Add a pricing section',
      'Add testimonials',
      'Change to dark mode',
    ],
  },
  {
    title: 'Style Changes',
    items: [
      'Make it professional',
      'Target developers',
      'Make it casual',
    ],
  },
] as const

export interface ChatMessage {
  id: number
  role: 'user' | 'bradley'
  text: string
}

const MAX_MESSAGES = 20
const TYPEWRITER_SPEED = 30 // ms per character
const MULTI_STEP_DELAY = 500 // ms between multi-part actions

export function ChatInput() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [typingFull, setTypingFull] = useState('')
  const demoActive = false
  const [showExamplesDialog, setShowExamplesDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(0)
  const multiStepTimerRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const isDraft = useUIStore((s) => s.rightPanelTab) === 'SIMPLE'
  // P18 Step 3 (A7): subscribe so the input/button reflect the global mutex
  // even if a sibling component (Listen panel, settings drawer test) is also
  // driving an LLM call.
  const inFlight = useIntelligenceStore((s) => s.inFlight)
  const isBusy = isProcessing || inFlight

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

  // Cleanup demo and multi-step timers on unmount
  useEffect(() => {
    return () => {
      multiStepTimerRef.current.forEach(clearTimeout)
    }
  }, [])

  const addUserMessage = (text: string) => {
    const id = nextId.current++
    setMessages((prev) => [...prev.slice(-MAX_MESSAGES + 1), { id, role: 'user', text }])
  }

  const executeAction = useCallback((action: string) => {
    const store = useConfigStore.getState()
    const [cmd, ...rest] = action.split(':')
    const arg = rest.join(':')

    switch (cmd) {
      case 'compound': {
        // Execute multiple sub-actions separated by |
        const subActions = arg.split('|')
        for (const sub of subActions) {
          executeAction(sub)
        }
        break
      }
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
      case 'heroCta': {
        const heroSection = store.config.sections.find((s) => s.type === 'hero')
        if (heroSection) {
          const ctaComp = heroSection.components.find((c) => c.id === 'cta')
          if (ctaComp) {
            store.setSectionConfig(heroSection.id, {
              components: heroSection.components.map((c) =>
                c.id === 'cta' ? { ...c, props: { ...c.props, text: arg } } : c
              ),
            })
          }
        }
        break
      }
      case 'applyVibe':
        store.applyVibe(arg)
        break
      case 'setContext': {
        const [field, ...valParts] = arg.split(':')
        const value = valParts.join(':')
        if (field && value) {
          store.applyPatch({ site: { [field]: value } }, 'llm-chat')
        }
        break
      }
      case 'loadExample': {
        const example = EXAMPLE_SITES.find((e) => e.name === arg)
        if (example) store.loadConfig(example.config)
        break
      }
    }
  }, [])

  /**
   * Execute a multi-part request with staggered delays for visual effect.
   * Each action fires ~500ms apart, with a typewriter response at the end.
   */
  const executeMultiPart = useCallback(
    (result: MultiChatResult) => {
      // Clear any previous timers
      multiStepTimerRef.current.forEach(clearTimeout)
      multiStepTimerRef.current = []

      const { actions, response } = result

      actions.forEach(({ action }, i) => {
        const timer = setTimeout(() => {
          executeAction(action)
        }, i * MULTI_STEP_DELAY)
        multiStepTimerRef.current.push(timer)
      })

      // After all actions complete, start the typewriter response
      const finalTimer = setTimeout(() => {
        setTypingText('')
        setTypingFull(response)
      }, actions.length * MULTI_STEP_DELAY)
      multiStepTimerRef.current.push(finalTimer)
    },
    [executeAction]
  )

  const runCannedFallback = useCallback((text: string) => {
    const multiResult = parseMultiPartCommand(text)
    if (multiResult) {
      executeMultiPart(multiResult)
      return
    }
    const result = parseChatCommand(text)
    if (result.action) {
      executeAction(result.action)
      setTypingText('')
      setTypingFull(result.response)
      return
    }
    // P18 Step 3 (A7): hardened fallback — when neither the LLM pipeline nor
    // the canned parser produces an action, hand the user 3-5 concrete
    // examples instead of a generic "try X" hint. KISS: literal string list
    // surfaced through the existing typewriter; no new UI primitive.
    setTypingText('')
    setTypingFull(
      "Hmm, I didn't catch that. Try one of: " +
      "Make the hero say 'Bake Joy Daily' · " +
      'Change to dark mode · ' +
      'Add a pricing section · ' +
      'Build me a bakery website · ' +
      'Make it professional'
    )
  }, [executeMultiPart, executeAction])

  /**
   * Primary path (Phase 18 Step 2): build system prompt, call adapter
   * (FixtureAdapter in DEV), parse + validate + apply. Any failure mode
   * routes silently to the canned fallback so demos never break.
   */
  const runLLMPipeline = useCallback(async (text: string): Promise<boolean> => {
    const adapter = useIntelligenceStore.getState().adapter
    if (!adapter) return false
    const configState = useConfigStore.getState()
    const systemPrompt = buildSystemPrompt({
      configJson: configState.config,
      history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
    })
    // P18 Step 2 (A4): every chat call MUST go through auditedComplete so the
    // cost-cap pre-check fires and an llm_calls audit row is written. Calling
    // adapter.complete directly bypasses both — do not regress this.
    const res = await auditedComplete(adapter, { systemPrompt, userPrompt: text }, { source: 'chat' })
    if (!res.ok) return false
    const parsed = parseResponse(res.json)
    if (!parsed.ok) {
      // P18 Step 3 (A7): adapter said ok but the envelope didn't parse. The
      // ok-row from auditedComplete stays; this row attributes the *decision*.
      recordPipelineFailure('parse', parsed.reason)
      return false
    }
    const errs = validatePatches(parsed.envelope.patches, configState.config)
    if (errs.length > 0) {
      recordPipelineFailure('validate', errs.join('; '))
      return false
    }
    let next: MasterConfig
    try {
      next = applyPatches(configState.config, parsed.envelope.patches) as MasterConfig
    } catch (e) {
      recordPipelineFailure('apply', e instanceof Error ? e.message : String(e))
      return false
    }
    useConfigStore.setState({ config: next, isDirty: true })
    setTypingText('')
    setTypingFull(parsed.envelope.summary ?? 'Done.')
    return true
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isProcessing) return
    // P18 Step 3 (A7): cross-component mutex — block re-entry while ANY chat
    // pipeline is still in flight. Surface a Bradley-styled hint instead of
    // silently dropping the input so the user knows why nothing happened.
    if (useIntelligenceStore.getState().inFlight) {
      addUserMessage(text)
      setInput('')
      setTypingText('')
      setTypingFull('Already working on your last request — please wait a sec.')
      return
    }

    addUserMessage(text)
    setInput('')
    setIsProcessing(true)
    useIntelligenceStore.getState().setInFlight(true)

    setTimeout(() => {
      // Primary: full LLM pipeline against the active adapter (FixtureAdapter
      // in DEV). On any failure (parse / validate / apply / no-fixture-match)
      // fall back silently to the canned chat command parser. The setInFlight
      // release is in `finally`-equivalent .then/.catch tails so the mutex is
      // always cleared, even if the pipeline throws.
      void runLLMPipeline(text)
        .then((ok) => {
          if (!ok) runCannedFallback(text)
        })
        .catch(() => runCannedFallback(text))
        .finally(() => {
          useIntelligenceStore.getState().setInFlight(false)
        })
    }, 400)
  }

  const handleSimulatedRequirement = (req: SimulatedRequirement) => {
    if (isProcessing || demoActive) return
    if (useIntelligenceStore.getState().inFlight) return

    addUserMessage(req.name)
    setIsProcessing(true)

    const labels = req.actions.map((a) => a.label)
    const steps = labels.map((l) => `Adding ${l}...`).join(' ')
    const response = `Setting up ${req.name}... ${steps} Done!`

    setTimeout(() => {
      executeMultiPart({ response, actions: req.actions })
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
        {messages.length === 0 && !typingFull && !demoActive && (
          <div className="px-4 py-6">
            <div className="text-sm text-hb-text-muted py-2">
              hi! tell me what to build.
            </div>
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
          try: <span className="text-hb-text-secondary">"dark mode"</span> · <span className="text-hb-text-secondary">"add pricing"</span> · <span className="text-hb-text-secondary">"build a SaaS page with pricing and testimonials"</span>
        </div>
      )}

      {/* P18 Step 3 (A7): in-flight thinking indicator. Subtle text + pulse so
          the user has live feedback while the LLM pipeline runs. */}
      {isBusy && (
        <div className="px-4 py-1 text-xs text-hb-text-muted border-t border-hb-border/50 flex items-center gap-1.5" data-testid="chat-thinking">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-hb-accent animate-pulse" />
          bradley is thinking...
        </div>
      )}

      {/* Try an Example button */}
      <div className="px-3 py-1.5 border-t border-hb-border/50">
        <Button
          variant="ghost"
          onClick={() => setShowExamplesDialog(true)}
          disabled={isBusy || demoActive}
          className="w-full flex items-center justify-center gap-2 h-auto py-2 text-xs text-hb-text-muted hover:text-hb-accent hover:bg-hb-accent/5 transition-colors disabled:opacity-40"
          data-testid="try-example-btn"
        >
          <Lightbulb size={14} />
          Try an Example
        </Button>
      </div>

      {/* Examples dialog */}
      {showExamplesDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowExamplesDialog(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowExamplesDialog(false) }}
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
                onClick={() => setShowExamplesDialog(false)}
                className="text-hb-text-muted hover:text-hb-text-primary transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {CHAT_EXAMPLE_CATEGORIES.map((cat) => (
                <div key={cat.title}>
                  <p className="text-xs text-hb-text-muted uppercase tracking-wider font-medium mb-2">{cat.title}</p>
                  <div className="space-y-1.5">
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setShowExamplesDialog(false)
                          setInput(item)
                          // Auto-send after a brief tick so input is set.
                          // P18 Step 3 (A7): respect the global inFlight mutex
                          // and release it via .finally so the input unlocks.
                          setTimeout(() => {
                            if (useIntelligenceStore.getState().inFlight) return
                            addUserMessage(item)
                            setIsProcessing(true)
                            useIntelligenceStore.getState().setInFlight(true)
                            setTimeout(() => {
                              void runLLMPipeline(item)
                                .then((ok) => { if (!ok) runCannedFallback(item) })
                                .catch(() => runCannedFallback(item))
                                .finally(() => {
                                  useIntelligenceStore.getState().setInFlight(false)
                                })
                            }, 400)
                          }, 50)
                        }}
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
                <p className="text-xs text-hb-text-muted uppercase tracking-wider font-medium mb-2">Multi-step Presets</p>
                <div className="space-y-1.5">
                  {SIMULATED_REQUIREMENTS.map((req) => (
                    <button
                      key={req.name}
                      type="button"
                      onClick={() => {
                        setShowExamplesDialog(false)
                        handleSimulatedRequirement(req)
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg border border-hb-accent/20 bg-hb-surface hover:bg-hb-accent/5 hover:border-hb-accent/40 transition-all"
                      data-testid={`sim-req-${req.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="text-sm font-medium text-hb-accent">{req.name}</span>
                      <span className="block text-hb-text-muted text-[10px] leading-tight mt-0.5">{req.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAFT-only "How it works" explainer */}
      {isDraft && <ChatExplainer />}

      {/* Input bar — no mic button. P18 Step 3 (A7): when isBusy, dim the
          whole bar so it's visually obvious the input is locked. */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 border-t border-hb-border bg-hb-surface transition-opacity',
        isBusy && 'opacity-60'
      )}>
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
          onClick={handleSend}
          disabled={isBusy || !input.trim()}
          className="flex items-center justify-center w-8 h-8 rounded-full text-hb-accent hover:bg-hb-accent/10 transition-colors disabled:opacity-30"
        >
          <SendHorizontal size={16} />
        </Button>
      </div>
    </div>
  )
}
