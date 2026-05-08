/**
 * P63 / OC-2 — 3-card mode selector (planted-architecture component).
 *
 * Renders the Whiteboard / Planning / Agentics choice on first run.
 * Whiteboard is live today; Planning ships at AW-5; Agentics at AW-10.
 * The two "Coming soon" cards are intentionally disabled — no email
 * capture, no live route, no toast. Tier-2 commercial owns the waitlist.
 *
 * This component ships standalone in P63 / OC-2. Integration into
 * `Onboarding.tsx` waits for owner UX review (per preflight Hard Rule #4).
 *
 * See: ADR-088 (Mode Architecture), ADR-089 (Agentics Data Model),
 *      plans/implementation/phase-63/preflight/00-summary.md
 */

export type ModeId = 'whiteboard' | 'planning' | 'agentics'

export interface ModeSelectorCardProps {
  /** Fired when the user selects an enabled mode (today: Whiteboard only). */
  onSelectMode: (mode: ModeId) => void
  /** Fired when the user clicks "Continue where you left off". */
  onContinue?: () => void
  /** When true, render the "Continue where you left off →" link. */
  hasProject?: boolean
}

interface ModeCardSpec {
  id: ModeId
  icon: string
  title: string
  tagline: string
  audience: string
  available: boolean
  testid: string
}

const MODES: readonly ModeCardSpec[] = [
  {
    id: 'whiteboard',
    icon: '🎨',
    title: 'Whiteboard',
    tagline: 'Visualize your idea',
    audience: 'Founders, Designers',
    available: true,
    testid: 'mode-card-whiteboard',
  },
  {
    id: 'planning',
    icon: '📋',
    title: 'Planning',
    tagline: 'Design the process',
    audience: 'PMs + Teams, Product Leads',
    // P90 / AW-MODE-ARCH (A3) — enabled; routes to /planning stub (full body P91-P95).
    available: true,
    testid: 'mode-card-planning',
  },
  {
    id: 'agentics',
    icon: '🤖',
    title: 'Agentics',
    tagline: 'Coordinate your swarm',
    audience: 'Engineers, Architects',
    // P90 / AW-MODE-ARCH (A3) — enabled; routes to /agentics stub (full body P92-P100).
    available: true,
    testid: 'mode-card-agentics',
  },
] as const

export function ModeSelectorCard(props: ModeSelectorCardProps) {
  const { onSelectMode, onContinue, hasProject = false } = props

  return (
    <div
      className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 py-10"
      data-testid="mode-selector-root"
    >
      <div className="w-full max-w-4xl">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight text-center"
          data-testid="mode-selector-heading"
        >
          What are you building today?
        </h1>
        <p className="text-sm text-[#6b7280] mt-2 text-center max-w-md mx-auto">
          Pick a mode. You can switch anytime.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MODES.map((m) => {
            const isLive = m.available
            const baseCls =
              'group flex flex-col items-start text-left rounded-2xl border px-5 py-6 transition-all'
            const liveCls =
              'border-[#e5e1dc] bg-white hover:shadow-lg hover:border-[#A51C30]/30 hover:-translate-y-0.5 cursor-pointer'
            const soonCls =
              'border-dashed border-[#e5e1dc] bg-[#faf8f5]/50 opacity-60 cursor-not-allowed'

            return (
              <button
                key={m.id}
                type="button"
                data-testid={m.testid}
                aria-disabled={!isLive}
                disabled={!isLive}
                onClick={isLive ? () => onSelectMode(m.id) : undefined}
                className={`${baseCls} ${isLive ? liveCls : soonCls}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-3xl" aria-hidden="true">
                    {m.icon}
                  </span>
                  {!isLive && (
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#9ca3af] uppercase tracking-wider"
                      data-testid={`${m.testid}-coming-soon`}
                    >
                      Coming soon
                    </span>
                  )}
                </div>
                <h2
                  className={`mt-4 text-lg font-semibold ${
                    isLive
                      ? 'text-[#1a1a1a] group-hover:text-[#A51C30] transition-colors'
                      : 'text-[#6b7280]'
                  }`}
                >
                  {m.title}
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isLive ? 'text-[#4b5563]' : 'text-[#9ca3af]'
                  }`}
                >
                  {m.tagline}
                </p>
                <p className="mt-3 text-[11px] text-[#9ca3af] uppercase tracking-wider">
                  {m.audience}
                </p>
              </button>
            )
          })}
        </div>

        {hasProject && onContinue && (
          <div className="mt-8 text-center">
            <button
              type="button"
              data-testid="mode-selector-continue"
              onClick={onContinue}
              className="text-sm font-medium text-[#6b7280] hover:text-[#A51C30] transition-colors"
            >
              Continue where you left off &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModeSelectorCard
