import type { Section } from '@/lib/schemas'
import { cn } from '@/lib/cn'

/* --------------------------------------------------------------------- */
/*  PricingComparison — feature comparison table with tier columns        */
/*  Desktop: semantic <table> with sticky header                          */
/*  Mobile (< 768px): card-per-tier layout                                */
/* --------------------------------------------------------------------- */

interface Tier {
  name: string
  price: string
  period: string
  cta: string
  ctaUrl: string
  highlighted: boolean
  features: string[]
}

function parseTiers(section: Section): Tier[] {
  return section.components
    .filter((c) => c.enabled && c.type === 'pricing-tier')
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      const featuresRaw = (c.props?.features as string) || ''
      return {
        name: (c.props?.name as string) || 'Plan',
        price: (c.props?.price as string) || '$0',
        period: (c.props?.period as string) || 'month',
        cta: (c.props?.ctaText as string) || 'Get Started',
        ctaUrl: (c.props?.ctaUrl as string) || '#signup',
        highlighted: Boolean(c.props?.highlighted),
        features: featuresRaw.split(',').map((f) => f.trim()).filter(Boolean),
      }
    })
}

/**
 * Build a unified feature list from all tiers.
 * Each feature row maps to a value per tier: true (has it), false (doesn't), or a text string.
 */
function buildFeatureMatrix(tiers: Tier[]): { name: string; values: (boolean | string)[] }[] {
  // Collect every unique feature name across all tiers, preserving order of first appearance
  const seen = new Set<string>()
  const allFeatures: string[] = []
  for (const tier of tiers) {
    for (const f of tier.features) {
      const key = f.toLowerCase().trim()
      if (!seen.has(key)) {
        seen.add(key)
        allFeatures.push(f)
      }
    }
  }

  return allFeatures.map((feature) => {
    const key = feature.toLowerCase().trim()
    const values = tiers.map((tier) => {
      const match = tier.features.find((f) => f.toLowerCase().trim() === key)
      return match ? true : false
    })
    return { name: feature, values }
  })
}

/* ── Desktop: semantic table ─────────────────────────────────────────── */

function ComparisonTable({
  tiers,
  features,
  section,
}: {
  tiers: Tier[]
  features: { name: string; values: (boolean | string)[] }[]
  section: Section
}) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse" role="table">
        {/* Sticky header row */}
        <thead>
          <tr>
            {/* Empty corner cell */}
            <th
              className="sticky top-0 z-10 text-left p-4 font-medium text-sm"
              style={{ background: section.style.background }}
              scope="col"
            >
              <span className="sr-only">Feature</span>
            </th>
            {tiers.map((tier, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  'sticky top-0 z-10 p-4 text-center min-w-[160px]',
                  tier.highlighted && 'rounded-t-xl',
                )}
                style={{
                  background: tier.highlighted
                    ? 'var(--theme-accent, #6366f1)'
                    : section.style.background,
                  color: tier.highlighted
                    ? section.style.background || '#fff'
                    : section.style.color,
                }}
              >
                {/* Recommended badge */}
                {tier.highlighted && (
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full"
                    style={{
                      background: section.style.background || '#fff',
                      color: 'var(--theme-accent, #6366f1)',
                    }}
                  >
                    Recommended
                  </span>
                )}
                <div className="font-semibold text-base">{tier.name}</div>
                <div className="mt-1">
                  <span className="text-2xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-xs opacity-70 ml-1">/{tier.period}</span>
                  )}
                </div>
                <a
                  href={tier.ctaUrl}
                  className={cn(
                    'mt-3 inline-block rounded-lg px-5 py-2 text-xs font-semibold transition-opacity hover:opacity-80',
                    tier.highlighted
                      ? 'border'
                      : 'bg-theme-accent',
                  )}
                  style={
                    tier.highlighted
                      ? {
                          borderColor: `color-mix(in srgb, ${section.style.background || '#fff'} 40%, transparent)`,
                          color: section.style.background || '#fff',
                        }
                      : {
                          background: 'var(--theme-accent, #6366f1)',
                          color: section.style.background || '#fff',
                        }
                  }
                >
                  {tier.cta}
                </a>
              </th>
            ))}
          </tr>
        </thead>

        {/* Feature rows */}
        <tbody>
          {features.map((feature, rowIdx) => (
            <tr
              key={rowIdx}
              className="transition-colors"
              style={{
                background:
                  rowIdx % 2 === 0
                    ? 'transparent'
                    : `color-mix(in srgb, ${section.style.color || '#fff'} 4%, transparent)`,
              }}
            >
              <td className="p-4 text-sm font-medium">{feature.name}</td>
              {feature.values.map((val, colIdx) => {
                const tier = tiers[colIdx]
                return (
                  <td
                    key={colIdx}
                    className={cn(
                      'p-4 text-center text-sm',
                      tier.highlighted && 'bg-theme-accent/5',
                    )}
                    style={
                      tier.highlighted
                        ? { background: `color-mix(in srgb, var(--theme-accent, #6366f1) 6%, transparent)` }
                        : undefined
                    }
                  >
                    {renderCellValue(val, section)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Mobile: card-per-tier layout ────────────────────────────────────── */

function ComparisonCards({
  tiers,
  features,
  section,
}: {
  tiers: Tier[]
  features: { name: string; values: (boolean | string)[] }[]
  section: Section
}) {
  return (
    <div className="md:hidden space-y-6">
      {tiers.map((tier, tierIdx) => (
        <div
          key={tierIdx}
          className={cn(
            'rounded-2xl border p-5',
            tier.highlighted
              ? 'border-theme-accent ring-2 ring-theme-accent/20'
              : '',
          )}
          style={
            !tier.highlighted
              ? { borderColor: `color-mix(in srgb, ${section.style.color || '#fff'} 12%, transparent)` }
              : undefined
          }
        >
          {/* Tier header */}
          <div className="text-center mb-4">
            {tier.highlighted && (
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider mb-2 px-2 py-0.5 rounded-full bg-theme-accent"
                style={{ color: section.style.background || '#fff' }}
              >
                Recommended
              </span>
            )}
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <div className="mt-1">
              <span className="text-3xl font-bold">{tier.price}</span>
              {tier.period && (
                <span className="text-sm opacity-60 ml-1">/{tier.period}</span>
              )}
            </div>
          </div>

          {/* Feature list */}
          <ul className="space-y-2 mb-5">
            {features.map((feature, fIdx) => (
              <li
                key={fIdx}
                className={cn(
                  'flex items-center justify-between text-sm py-1.5 px-2 rounded',
                  fIdx % 2 === 0
                    ? 'bg-transparent'
                    : '',
                )}
                style={
                  fIdx % 2 !== 0
                    ? { background: `color-mix(in srgb, ${section.style.color || '#fff'} 4%, transparent)` }
                    : undefined
                }
              >
                <span className="font-medium">{feature.name}</span>
                <span>{renderCellValue(feature.values[tierIdx], section)}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={tier.ctaUrl}
            className={cn(
              'block w-full text-center rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-80',
              tier.highlighted
                ? 'bg-theme-accent'
                : 'border',
            )}
            style={
              tier.highlighted
                ? { color: section.style.background || '#fff' }
                : { borderColor: `color-mix(in srgb, ${section.style.color || '#fff'} 20%, transparent)` }
            }
          >
            {tier.cta}
          </a>
        </div>
      ))}
    </div>
  )
}

/* ── Shared cell renderer ────────────────────────────────────────────── */

function renderCellValue(val: boolean | string, section: Section) {
  if (val === true) {
    return (
      <span
        className="inline-flex items-center justify-center text-base font-bold"
        style={{ color: 'var(--theme-accent, #22c55e)' }}
        aria-label="Included"
      >
        &#10003;
      </span>
    )
  }
  if (val === false) {
    return (
      <span
        className="inline-flex items-center justify-center text-base"
        style={{ color: `color-mix(in srgb, ${section.style.color || '#fff'} 30%, transparent)` }}
        aria-label="Not included"
      >
        &#10007;
      </span>
    )
  }
  return <span>{val}</span>
}

/* ── Main component ──────────────────────────────────────────────────── */

export function PricingComparison({ section }: { section: Section }) {
  const tiers = parseTiers(section)
  const features = buildFeatureMatrix(tiers)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{
        background: section.style.background,
        color: section.style.color,
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-4"
            style={{
              background: section.style.color
                ? `color-mix(in srgb, ${section.style.color} 60%, transparent)`
                : '#6366f1',
            }}
          />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {(section.content as any).heading}
          </h2>
          {(section.content as any)?.subheading && (
            <p className="text-lg mt-3 opacity-70">
              {(section.content as any).subheading}
            </p>
          )}
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        <ComparisonTable tiers={tiers} features={features} section={section} />
        <ComparisonCards tiers={tiers} features={features} section={section} />
      </div>
    </section>
  )
}
