import type { Section } from '@/lib/schemas'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/* --------------------------------------------------------------------- */
/*  PricingTiers — renders 2-3 pricing tier cards from section.components */
/* --------------------------------------------------------------------- */

export function PricingTiers({ section }: { section: Section }) {
  const tiers = section.components
    .filter((c) => c.enabled && c.type === 'pricing-tier')
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--theme-accent, currentColor)', opacity: 0.6 }} />
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
        <div
          className={cn(
            'grid gap-6',
            tiers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-3',
          )}
        >
          {tiers.map((tier, idx) => {
            const name = (tier.props?.name as string) || 'Plan'
            const price = (tier.props?.price as string) || '$0'
            const period = (tier.props?.period as string) || 'month'
            const featuresRaw = (tier.props?.features as string) || ''
            const features = featuresRaw.split(',').map((f) => f.trim()).filter(Boolean)
            const ctaText = (tier.props?.ctaText as string) || 'Get Started'
            const ctaUrl = (tier.props?.ctaUrl as string) || '#signup'
            const highlighted = Boolean(tier.props?.highlighted)

            return (
              <div
                key={tier.id}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-6',
                  'bg-theme-surface/60 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal',
                  highlighted
                    ? 'border-theme-accent ring-2 ring-theme-accent/20'
                    : '',
                )}
                style={highlighted ? { animationDelay: `${idx * 100}ms` } : { animationDelay: `${idx * 100}ms`, borderColor: `color-mix(in srgb, ${section.style.color} 10%, transparent)` }}
              >
                {/* Recommended badge */}
                {highlighted && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-theme-accent px-3 py-0.5 text-xs font-semibold"
                    style={{ color: section.style.background || '#fff' }}
                  >
                    Recommended
                  </span>
                )}

                {/* Tier name */}
                <h3 className="text-lg font-semibold">{name}</h3>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{price}</span>
                  <span className="text-sm text-theme-muted">/{period}</span>
                </div>

                {/* Features list */}
                <ul className="mt-6 flex-1 space-y-2.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className={cn(
                          'mt-0.5 shrink-0',
                          highlighted ? 'text-theme-accent' : 'text-theme-muted',
                        )}
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <a
                  href={ctaUrl}
                  className={cn(
                    'mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors',
                    highlighted
                      ? 'bg-theme-accent hover:opacity-90'
                      : 'border hover:opacity-80',
                  )}
                  style={highlighted
                    ? { color: section.style.background || '#fff' }
                    : { borderColor: `color-mix(in srgb, ${section.style.color} 20%, transparent)` }
                  }
                >
                  {ctaText}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
