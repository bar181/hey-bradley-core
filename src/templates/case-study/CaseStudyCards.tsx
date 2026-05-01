import type { Section } from '@/lib/schemas'
import { getStr, getImageEffectClass } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  CaseStudyCards — 3-column responsive grid of case-study cards.        */
/*                                                                        */
/*  P75 / OC-7 / Agent A1 — case-study section type.                      */
/*                                                                        */
/*  Each card surfaces:                                                   */
/*   - media block (image OR token-derived gradient placeholder)          */
/*   - headline (one-line outcome statement)                              */
/*   - body excerpt (2-line clamp)                                        */
/*   - outcome metric chip (e.g. "+30%")                                  */
/*   - client name                                                        */
/*                                                                        */
/*  Reads section.style for background+color; preserves the JSON config   */
/*  contract used by every other template (no hardcoded spacing —         */
/*  Tailwind utility classes only; padding/radius/shadow are token-       */
/*  derived per ADR-091).                                                 */
/* --------------------------------------------------------------------- */

interface CaseStudyCard {
  id: string
  headline: string
  body: string
  outcomeMetric: string
  clientName: string
  mediaUrl: string
}

function parseCards(section: Section): CaseStudyCard[] {
  const items = section.components
    .filter((c) => c.type === 'case-study-card' && c.enabled)
    .sort((a, b) => a.order - b.order)

  return items.map((item) => ({
    id: item.id,
    headline: (item.props?.headline as string) || 'Outcome headline',
    body: (item.props?.body as string) || '',
    outcomeMetric: (item.props?.outcomeMetric as string) || '',
    clientName: (item.props?.clientName as string) || '',
    mediaUrl: (item.props?.mediaUrl as string) || '',
  }))
}

export function CaseStudyCards({ section }: { section: Section }) {
  const effectClass = getImageEffectClass(section)
  const cards = parseCards(section)
  const accent = section.style.color
    ? `color-mix(in srgb, ${section.style.color} 60%, transparent)`
    : 'var(--hb-accent)'
  const chipBg = section.style.color
    ? `color-mix(in srgb, ${section.style.color} 14%, transparent)`
    : 'color-mix(in srgb, var(--hb-accent) 14%, transparent)'

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{
        background: section.style.background,
        color: section.style.color,
        fontFamily: 'var(--theme-font)',
      }}
    >
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-4"
            style={{ background: accent }}
          />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">
              {getStr(section, 'subheading')}
            </p>
          )}
        </div>
      )}

      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <article
            key={card.id}
            tabIndex={0}
            className={`group rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:-translate-y-1 opacity-0 animate-card-reveal ${effectClass}`}
            style={{
              animationDelay: `${idx * 100}ms`,
              background: section.style.background,
            }}
          >
            <div className="aspect-video overflow-hidden">
              {card.mediaUrl ? (
                <img
                  src={card.mediaUrl}
                  alt={card.headline}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div
                  aria-hidden
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${accent} 0%, ${chipBg} 100%)`,
                  }}
                />
              )}
            </div>
            <div className="p-5 space-y-3">
              {card.outcomeMetric && (
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: chipBg, color: section.style.color }}
                >
                  {card.outcomeMetric}
                </span>
              )}
              <h3 className="text-lg font-bold leading-snug line-clamp-2">
                {card.headline}
              </h3>
              {card.body && (
                <p className="text-sm opacity-70 line-clamp-3">{card.body}</p>
              )}
              {card.clientName && (
                <div className="text-xs opacity-60 pt-1">
                  <span className="uppercase tracking-wider">Client · </span>
                  <span className="font-medium">{card.clientName}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
