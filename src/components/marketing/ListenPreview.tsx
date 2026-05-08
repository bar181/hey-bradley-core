/**
 * ListenPreview — stylised mockup of the Hey Bradley listen-mode UI.
 *
 * Replaces the skeleton/typing-demo card on Welcome.tsx with a side-by-side
 * preview that reads as "site mid-build" rather than "broken loading state".
 *
 * Layout: 30% left (orb + waveform + HOLD TO TALK button) / 70% right
 * (mini browser chrome + stylised hero block).
 *
 * Animation strategy:
 *  - Reuses global @keyframes orb-pulse / orb-breathe from index.css
 *    (defined for HeroOrb.tsx + ListenOrb.tsx).
 *  - Adds three local keyframes: hb-lp-wave (waveform bars) + hb-lp-cursor
 *    (subtle cursor blink in the browser URL bar) + hb-lp-fade (one-shot
 *    fade-in via useReveal).
 *  - prefers-reduced-motion is honored at TWO levels:
 *      1) The global rule in index.css already collapses animation-duration
 *         to 0.01ms for everything inside this component.
 *      2) useReveal returns isVisible=true immediately when reduced-motion
 *         is set, so the fade-in resolves instantly.
 *
 * No new dependencies. Pure CSS animation. Tokens only (no hex literals
 * in JSX besides the Harvard crimson #A51C30 which already exists as
 * var(--hb-accent) — we use the token everywhere).
 */
import { useReveal } from '@/hooks/useReveal'

const LISTEN_PREVIEW_KEYFRAMES = `
@keyframes hb-lp-wave {
  0%, 100% { transform: scaleY(0.4); }
  50%      { transform: scaleY(1); }
}
@keyframes hb-lp-cursor {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
@keyframes hb-lp-fade {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 0.85; transform: translateY(0); }
}
.hb-lp-bar {
  display: inline-block;
  width: 3px;
  margin: 0 1.5px;
  background: var(--hb-accent);
  border-radius: 2px;
  transform-origin: 50% 50%;
  animation: hb-lp-wave 1.2s ease-in-out infinite;
}
.hb-lp-cursor {
  display: inline-block;
  width: 1px;
  height: 0.85em;
  background: var(--hb-text-muted);
  margin-left: 2px;
  vertical-align: middle;
  animation: hb-lp-cursor 1s step-end infinite;
}
.hb-lp-fade-in {
  opacity: 0;
  animation: hb-lp-fade 0.7s ease-out forwards;
}
@media (prefers-reduced-motion: reduce) {
  .hb-lp-bar { animation: none; transform: scaleY(0.7); }
  .hb-lp-cursor { animation: none; opacity: 1; }
  .hb-lp-fade-in { animation: none; opacity: 0.85; }
}
`

const WAVE_DELAYS = ['0ms', '120ms', '60ms', '180ms', '90ms']

export function ListenPreview() {
  const { ref, isVisible } = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`max-w-2xl mx-auto rounded-xl border border-[var(--hb-border)] bg-[var(--hb-bg)] shadow-lg overflow-hidden ${
        isVisible ? 'hb-lp-fade-in' : ''
      }`}
      style={{ opacity: isVisible ? 0.85 : 0 }}
      aria-hidden="true"
    >
      <style>{LISTEN_PREVIEW_KEYFRAMES}</style>

      <div className="flex flex-col sm:flex-row">
        {/* LEFT — listen-mode panel (~30%) */}
        <div className="sm:w-[32%] border-b sm:border-b-0 sm:border-r border-[var(--hb-border)] bg-[var(--hb-surface)] p-5 flex flex-col items-center text-center">
          {/* Crimson orb */}
          <div className="relative w-16 h-16 flex items-center justify-center mb-3">
            <div
              className="absolute rounded-full"
              style={{
                width: '64px',
                height: '64px',
                background:
                  'radial-gradient(circle, rgba(165, 28, 48, 0.35) 0%, transparent 70%)',
                filter: 'blur(8px)',
                animation: 'orb-pulse 4s ease-in-out infinite',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '36px',
                height: '36px',
                background:
                  'radial-gradient(circle, rgba(193, 40, 62, 0.85) 0%, rgba(165, 28, 48, 0.5) 60%, transparent 100%)',
                boxShadow: '0 0 12px rgba(165, 28, 48, 0.5)',
                animation: 'orb-breathe 5s ease-in-out infinite',
              }}
            />
          </div>

          <p className="text-xs italic text-[var(--hb-text-muted)] mb-3">
            Ready to listen...
          </p>

          {/* Waveform bars */}
          <div className="flex items-end justify-center h-6 mb-4" aria-hidden="true">
            {WAVE_DELAYS.map((delay, i) => (
              <span
                key={i}
                className="hb-lp-bar"
                style={{ height: '20px', animationDelay: delay }}
              />
            ))}
          </div>

          {/* HOLD TO TALK — styled, NOT functional */}
          <div
            className="w-full max-w-[140px] px-3 py-2 rounded-lg bg-[var(--hb-accent)] text-white text-[10px] font-bold tracking-wider uppercase mb-3 shadow-md select-none"
            role="presentation"
          >
            Hold to Talk
          </div>

          <p className="text-[10px] leading-snug text-[var(--hb-text-muted)] px-1">
            Your voice goes to your browser&rsquo;s STT&hellip;
          </p>
        </div>

        {/* RIGHT — mini browser preview (~70%) */}
        <div className="sm:w-[68%] bg-[var(--hb-bg)] p-3">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-2 pb-2 border-b border-[var(--hb-border)]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hb-text-muted)] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hb-text-muted)] opacity-50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--hb-text-muted)] opacity-50" />
            </div>
            <div className="flex-1 mx-2 px-2 py-0.5 rounded bg-[var(--hb-surface)] border border-[var(--hb-border)] text-[10px] font-mono text-[var(--hb-text-muted)] truncate">
              hey-bradley.app/preview
              <span className="hb-lp-cursor" />
            </div>
          </div>

          {/* Stylised hero — site mid-build */}
          <div className="px-4 py-6 sm:py-8 text-center">
            <h3
              className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-white mb-2 leading-tight"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              Describe it. See it.
            </h3>
            <p className="text-[10px] sm:text-xs text-[var(--hb-text-secondary)] leading-relaxed mb-3 max-w-xs mx-auto">
              The website builder that finally works the way you talk.
            </p>
            <div
              className="inline-block px-3 py-1.5 rounded-md bg-[var(--hb-accent)] text-white text-[10px] font-semibold shadow-sm"
              role="presentation"
            >
              Start describing &rarr;
            </div>

            {/* Hint of more content below — section placeholder bars */}
            <div className="mt-5 grid grid-cols-3 gap-2 max-w-[260px] mx-auto opacity-60">
              <div className="h-8 rounded bg-[var(--hb-surface)] border border-[var(--hb-border)]" />
              <div className="h-8 rounded bg-[var(--hb-surface)] border border-[var(--hb-border)]" />
              <div className="h-8 rounded bg-[var(--hb-surface)] border border-[var(--hb-border)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListenPreview
