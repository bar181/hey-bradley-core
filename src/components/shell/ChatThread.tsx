/**
 * P67c / A3 — ChatThread component (extracted from ChatInput.tsx orchestrator).
 *
 * Renders the chat-message thread: user/bradley bubbles, "via voice" pill,
 * latency badge, personality bubble styling (5 branches), Geek-mode raw
 * INTENT_ATOM footer, Teacher-mode "Try:" suggestion chips, AISP surface
 * trace, improvement suggestions.
 *
 * Per ADR-093 component-decomposition standard: extracted from a 850-LOC
 * orchestrator to bring it closer to the ≤500 cap. Pipeline hook
 * extraction → P67d.
 */
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'
import { AISPSurface } from '@/components/shell/AISPSurface'
import { PatchLatencyBadge } from '@/components/shell/PatchLatencyBadge'
import type { ChatMessage } from '@/components/shell/ChatInput'

export interface ChatThreadProps {
  messages: ChatMessage[]
}

export function ChatThread({ messages }: ChatThreadProps) {
  return (
    <>
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
          {/* P19 Fix-Pass 2 (F12): "via voice" pill so users can see which
              turns came from PTT. Subtle muted pill, not a banner. */}
          {msg.source === 'listen' && (
            <span
              data-testid="chat-bubble-via-voice"
              className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-hb-surface text-hb-text-muted border border-hb-border/30"
            >
              via voice
            </span>
          )}
          {/* P54 Sprint K Wave 1 (A2) — Patch latency badge.
              Renders AFTER typewriter primary text, BEFORE personality block. */}
          {msg.role === 'bradley' && (
            <PatchLatencyBadge latencyMs={msg.latencyMs} breakdown={msg.latencyBreakdown} />
          )}
          {/* Sprint J P50 (A2) — personality-rendered secondary voice layer
              (composition; no Σ widening). Renders UNDER the typewriter
              primary text. Sprint J P51 (A5) — per-personality bubble styling
              via Tailwind variants only; 5 distinct branches. */}
          {msg.role === 'bradley' && msg.personalityMessage && (() => {
            const pid = msg.personalityId
            let bubbleStyleClass = ''
            let prefix = ''
            switch (pid) {
              case 'fun':
                bubbleStyleClass = 'border-l-2 border-l-[#e8772e] pl-2'
                prefix = '✨ '
                break
              case 'geek':
                bubbleStyleClass = 'font-mono text-[#1f3a5f]'
                break
              case 'teacher':
                bubbleStyleClass = 'bg-[#fef9c3]/30 rounded px-2 py-1'
                break
              case 'coach':
                bubbleStyleClass = 'text-[#ed8936] font-semibold'
                break
              case 'professional':
              default:
                bubbleStyleClass = ''
            }
            return (
              <div
                data-testid="personality-message"
                data-personality-id={pid ?? undefined}
                data-bubble-style={pid ?? undefined}
                className={cn('mt-1 text-xs text-hb-text-muted italic', bubbleStyleClass)}
              >
                {prefix}{msg.personalityMessage}
              </div>
            )
          })()}
          {/* P66 / Wave 1 / A6 (P2 #13) — Geek mode raw AISP footer in reply
              bubble. Renders only when active personality is geek; uses
              intent data already attached to ChatMessage at the bubble level
              via pendingAispRef. No new props plumbed through pipeline. */}
          {msg.role === 'bradley' && msg.personalityId === 'geek' && msg.aisp?.intent && (
            <div
              data-testid="chat-geek-aisp-footer"
              className="mt-1 font-mono text-[10px] text-hb-text-muted"
            >
              INTENT_ATOM · {msg.aisp.intent.verb}:{msg.aisp.intent.target?.type ?? 'none'} · conf {msg.aisp.intent.confidence.toFixed(2)} · source:{msg.aisp.source}
            </div>
          )}
          {/* P66 / Wave 1 / A6 (P2 #14) — Teacher mode suggestion chips after
              each bradley reply. Click pre-fills input via existing
              setPendingChatPrefill (does NOT auto-send). */}
          {msg.role === 'bradley' && msg.personalityId === 'teacher' && (
            <div data-testid="chat-teacher-chips" className="mt-1.5 flex flex-wrap gap-1">
              {['Try: change the theme', 'Try: add a testimonial', 'Try: regenerate the hero'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => useUIStore.getState().setPendingChatPrefill(s.replace(/^Try:\s*/, ''))}
                  className="px-2 py-0.5 rounded-full text-[10px] border border-hb-accent/30 bg-hb-accent/5 text-hb-accent hover:bg-hb-accent/15 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {/* P34 / P35 — exactly ONE AISP surface per bradley reply.
              R1 F2 fix-pass — in EXPERT mode the trace pane subsumes the
              translation panel (it shows intent + template + 4 more atoms).
              In SIMPLE mode the trace pane returns null and the
              translation panel takes over. AISPSurface picks one or the
              other; never both. */}
          {msg.role === 'bradley' && msg.userText && msg.aisp && (
            <AISPSurface
              intent={msg.aisp.intent}
              intentSource={msg.aisp.source}
              userText={msg.userText}
              templateId={msg.templateId ?? null}
              assumptions={msg.assumptions}
              assumptionsSource={msg.assumptionsSource}
              patches={msg.patches ?? null}
              summary={msg.pipelineSummary ?? null}
              aispRoute={msg.aispRoute ?? null}
            />
          )}
          {/* P48 Sprint I Wave 2 (A5) — next-step improvement suggestions
              surfaced under a successful patch reply. Subtle muted block;
              max 3 items. */}
          {msg.role === 'bradley' && msg.improvements && msg.improvements.length > 0 && (
            <div
              data-testid="aisp-improvement-suggestions"
              className="mt-1.5 px-2 py-1.5 text-[11px] text-hb-text-muted border-l-2 border-hb-accent/30"
            >
              <div className="font-medium mb-0.5">💡 Next steps:</div>
              <ul className="space-y-0.5">
                {msg.improvements.slice(0, 3).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
