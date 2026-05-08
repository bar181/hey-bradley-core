/**
 * ListenPreview — P123 / W4b session-simulation demo.
 * Replaces P122/W3 static 2-pane mockup with an animated session that types
 * 6 turns then reveals a North-Star + AISP spec card pair. Lineage: phase-3
 * splash-0..5.png. Palette updated to dark/crimson tokens.
 *
 * LEFT (~38%): pulsing orb (orb-pulse + orb-breathe from index.css) + 6-turn
 * bubble thread typing one char at a time. Final response carries the 55%
 * number + "no vibe coding!".
 * RIGHT (~62%): mini browser chrome + preview that materializes through
 * 4 states (empty → heading → CTA → done+spec cards+Download CTA).
 *
 * ~30s loop. prefers-reduced-motion → jump to State 4 immediately.
 * KISS: pure CSS + useState/useEffect. Tokens only. ARIA role region+article.
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic } from 'lucide-react'

const LP_KEYFRAMES = `
@keyframes hb-lp-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hb-lp-caret {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
.hb-lp-bubble {
  animation: hb-lp-fade-in 0.4s ease-out both;
}
.hb-lp-caret {
  display: inline-block;
  width: 1px;
  height: 1em;
  background: currentColor;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: hb-lp-caret 0.8s step-end infinite;
}
@media (prefers-reduced-motion: reduce) {
  .hb-lp-bubble { animation: none; }
  .hb-lp-caret { animation: none; opacity: 0; }
}
`

type Speaker = 'user' | 'bradley'

interface Turn {
  speaker: Speaker
  text: string
  /** Visual preview state to advance to once this turn completes. */
  previewStateAfter: 1 | 2 | 3 | 4
}

// P123 fix-pass U1 — final Bradley response split into 3 separate bubbles so
// the owner-locked phrases ("55%", "AI Symbolic Protocol", "No vibe coding!")
// land one beat at a time instead of in a single 38-word jargon dump. Words
// preserved verbatim; only bubble structure changed.
const TURNS: Turn[] = [
  { speaker: 'user', text: 'Make me a website for my coffee shop in Asheville.', previewStateAfter: 1 },
  { speaker: 'bradley', text: 'Got it. Warm, plain-spoken, real photos. Drafting the hero now.', previewStateAfter: 2 },
  { speaker: 'user', text: 'Add a hero with a crimson accent and a menu link.', previewStateAfter: 3 },
  { speaker: 'bradley', text: 'Done. Crimson CTA, menu in the nav, copy in your voice.', previewStateAfter: 3 },
  { speaker: 'user', text: 'now what', previewStateAfter: 4 },
  { speaker: 'bradley', text: 'Good call. You’re done.', previewStateAfter: 4 },
  { speaker: 'bradley', text: 'The plan-to-spec process usually takes about 55% of dev time. You just skipped it.', previewStateAfter: 4 },
  { speaker: 'bradley', text: 'Hey Bradley produces enterprise-grade specs with AI Symbolic Protocol for your project. No vibe coding!', previewStateAfter: 4 },
]

const TYPE_MS_PER_CHAR = 22
const POST_TURN_PAUSE_MS = 450
const FINAL_HOLD_MS = 5500

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ListenPreview() {
  const reduced = prefersReducedMotion()

  // When reduced-motion: jump straight to final state with all turns visible.
  const [turnIdx, setTurnIdx] = useState<number>(reduced ? TURNS.length - 1 : 0)
  const [charIdx, setCharIdx] = useState<number>(0)
  const [previewState, setPreviewState] = useState<1 | 2 | 3 | 4>(reduced ? 4 : 1)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'finalHold'>(
    reduced ? 'finalHold' : 'typing',
  )

  const currentTurn = TURNS[turnIdx]
  const isFinalTurn = turnIdx === TURNS.length - 1

  // Typewriter — advances charIdx one tick at a time.
  useEffect(() => {
    if (reduced) return
    if (phase !== 'typing') return
    if (charIdx >= currentTurn.text.length) {
      // Apply this turn's preview-state, then move to inter-turn pause.
      setPreviewState(currentTurn.previewStateAfter)
      setPhase('pause')
      return
    }
    const id = window.setTimeout(() => setCharIdx((c) => c + 1), TYPE_MS_PER_CHAR)
    return () => window.clearTimeout(id)
  }, [reduced, phase, charIdx, currentTurn])

  // Inter-turn pause — then advance to next turn or hold final.
  useEffect(() => {
    if (reduced) return
    if (phase !== 'pause') return
    const id = window.setTimeout(() => {
      if (isFinalTurn) {
        setPhase('finalHold')
      } else {
        setTurnIdx((i) => i + 1)
        setCharIdx(0)
        setPhase('typing')
      }
    }, POST_TURN_PAUSE_MS)
    return () => window.clearTimeout(id)
  }, [reduced, phase, isFinalTurn])

  // Final-hold — then loop back to start.
  useEffect(() => {
    if (reduced) return
    if (phase !== 'finalHold') return
    const id = window.setTimeout(() => {
      setTurnIdx(0)
      setCharIdx(0)
      setPreviewState(1)
      setPhase('typing')
    }, FINAL_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [reduced, phase])

  // Render the bubble thread up to the current point.
  const visibleTurns: Array<{ turn: Turn; visibleText: string; isTyping: boolean }> = reduced
    ? TURNS.map((t) => ({ turn: t, visibleText: t.text, isTyping: false }))
    : TURNS.slice(0, turnIdx + 1).map((t, i) => {
        if (i < turnIdx) return { turn: t, visibleText: t.text, isTyping: false }
        return {
          turn: t,
          visibleText: t.text.slice(0, charIdx),
          isTyping: phase === 'typing',
        }
      })

  const showSpecCards = previewState === 4

  return (
    <div
      role="region"
      aria-label="Hey Bradley demo"
      className="max-w-6xl mx-auto rounded-2xl border border-[var(--hb-border)] bg-[var(--hb-surface)] shadow-2xl overflow-hidden opacity-95"
    >
      <style>{LP_KEYFRAMES}</style>

      <div className="flex flex-col md:flex-row">
        {/* LEFT — agent / session pane (~38%) */}
        <div className="md:w-[38%] border-b md:border-b-0 md:border-r border-[var(--hb-border)] bg-[var(--hb-bg)] p-5 flex flex-col">
          {/* P123 fix-pass U3 — duplicate-orb fix: HeroOrb (600px) is already
              the dominant pulsing element in the same scroll-fold above this
              component (Welcome.tsx:78). A second smaller pulsing orb here was
              splitting visual attention. Replaced with a static crimson mic
              circle — keeps the brand color, kills the duplicate motion. */}
          <div className="flex flex-col items-center mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--hb-accent)] shadow-md"
              aria-hidden="true"
            >
              <Mic className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs italic text-[var(--hb-text-muted)] mt-2">
              {reduced ? 'Session complete' : 'Listening...'}
            </p>
          </div>

          {/* Bubble thread */}
          <div className="flex-1 flex flex-col gap-2 overflow-hidden" aria-live="polite">
            {visibleTurns.map((v, i) => {
              const isUser = v.turn.speaker === 'user'
              return (
                <div
                  key={i}
                  className={`hb-lp-bubble flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={[
                      'max-w-[88%] rounded-xl px-3 py-2 text-xs leading-snug shadow-sm',
                      isUser
                        ? 'bg-[var(--hb-accent)] text-white'
                        : 'bg-[var(--hb-surface)] text-[var(--hb-text-primary)] border border-[var(--hb-border)]',
                    ].join(' ')}
                  >
                    {v.visibleText}
                    {v.isTyping && <span className="hb-lp-caret" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT — preview pane (~62%) */}
        <div className="md:w-[62%] bg-[var(--hb-surface)] p-4 flex flex-col">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-2 pb-3 border-b border-[var(--hb-border)]">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hb-text-muted)] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hb-text-muted)] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hb-text-muted)] opacity-50" />
            </div>
            <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-[var(--hb-bg)] border border-[var(--hb-border)] text-[10px] font-mono text-[var(--hb-text-muted)] truncate">
              hey-bradley.app/preview
            </div>
          </div>

          {/* Site preview — progressively materializes */}
          <div className="flex-1 px-4 py-6 flex flex-col items-center justify-center text-center min-h-[180px]">
            {previewState >= 2 && (
              <h3
                className="hb-lp-bubble text-xl md:text-2xl font-extrabold tracking-tight text-[var(--hb-text-primary)] mb-2 leading-tight"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              >
                Asheville Roasters
              </h3>
            )}
            {previewState >= 2 && (
              <p className="hb-lp-bubble text-xs md:text-sm text-[var(--hb-text-secondary)] leading-relaxed mb-4 max-w-sm">
                Slow-roasted, served warm, poured by people who know your name.
              </p>
            )}
            {previewState >= 3 && (
              <div
                className="hb-lp-bubble inline-block px-4 py-1.5 rounded-md bg-[var(--hb-accent)] text-white text-xs font-semibold shadow-sm"
                role="presentation"
              >
                See the menu &rarr;
              </div>
            )}
            {previewState < 2 && (
              <div
                className="w-full max-w-[260px] h-16 rounded bg-[var(--hb-bg)] border border-dashed border-[var(--hb-border)] flex items-center justify-center text-[10px] text-[var(--hb-text-muted)]"
                aria-hidden="true"
              >
                empty hero
              </div>
            )}
          </div>

          {/* Spec cards — appear at State 4 */}
          {showSpecCards && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2 pb-3">
              <article
                role="article"
                className="hb-lp-bubble rounded-lg bg-[var(--hb-bg)] border border-[var(--hb-border)] p-3"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--hb-accent)] mb-1">
                  North Star
                </div>
                <p className="text-xs text-[var(--hb-text-secondary)] leading-snug">
                  A coffee shop site that feels like the room &mdash; warm cream, real photos,
                  no SaaS clich&eacute;s.
                </p>
              </article>
              <article
                role="article"
                className="hb-lp-bubble rounded-lg bg-[var(--hb-bg)] border border-[var(--hb-border)] p-3"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--hb-accent)] mb-1">
                  AISP specs
                </div>
                <p className="text-xs font-mono text-[var(--hb-text-secondary)] leading-snug truncate">
                  Σ&#123;site = (sections, theme); theme.warm ⇒ palette.cream; ¬palette.pretentious&#125;&hellip;
                </p>
              </article>
            </div>
          )}

          {/* P123 fix-pass U2 — was a permanently-disabled crimson Button that
              looked clickable; now a small caption-link to /builder so the
              CTA converts instead of dead-ending. Plain English, no jargon. */}
          {showSpecCards && (
            <div className="hb-lp-bubble flex justify-center pb-2 pt-1">
              <Link
                to="/builder"
                className="text-sm text-[var(--hb-text-muted)] hover:text-[var(--hb-accent)] hover:underline"
              >
                Download specs · demo only — try it in the builder &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListenPreview
