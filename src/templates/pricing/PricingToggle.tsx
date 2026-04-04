import { useState } from 'react'
import type { Section } from '@/lib/schemas'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/* --------------------------------------------------------------------- */
/*  PricingToggle — monthly/annual toggle pricing layout                  */
/*  Reads tier data from section.components (pricing-tier type) or       */
/*  falls back to section.content.tiers for the toggle data shape.       */
/* --------------------------------------------------------------------- */

interface ToggleTier {
  name: string
  monthlyPrice: number | string
  annualPrice: number | string
  period?: string
  features: string[]
  cta: string
  ctaUrl: string
  highlighted?: boolean
}

/** Parse a dollar string like "$99" into a number, or return NaN. */
function parsePrice(val: string | number): number {
  if (typeof val === 'number') return val
  const cleaned = val.replace(/[^0-9.]/g, '')
  return parseFloat(cleaned)
}

/** Compute savings percentage between monthly and annual (per-month). */
function savingsPercent(monthly: number, annual: number): number {
  if (monthly <= 0 || annual <= 0) return 0
  const annualPerMonth = annual / 12
  return Math.round(((monthly - annualPerMonth) / monthly) * 100)
}

/** Format a price value for display. */
function formatPrice(val: string | number): string {
  if (typeof val === 'string') {
    // If it already has a $ or is "Custom", return as-is
    if (val.startsWith('$') || isNaN(parsePrice(val))) return val
    return `$${val}`
  }
  return `$${val}`
}

/**
 * Extract tier data from section. Supports two data shapes:
 * 1. components[] with type "pricing-tier" (existing pattern)
 * 2. content.tiers[] with monthlyPrice/annualPrice (toggle-specific)
 */
function extractTiers(section: Section): ToggleTier[] {
  const content = section.content as Record<string, unknown>

  // Shape 2: content.tiers (toggle-native data)
  if (Array.isArray(content?.tiers)) {
    return (content.tiers as Record<string, unknown>[]).map((t) => ({
      name: (t.name as string) || 'Plan',
      monthlyPrice: (t.monthlyPrice as number | string) ?? 0,
      annualPrice: (t.annualPrice as number | string) ?? 0,
      period: (t.period as string) || undefined,
      features: Array.isArray(t.features)
        ? (t.features as string[])
        : typeof t.features === 'string'
          ? (t.features as string).split(',').map((f) => f.trim()).filter(Boolean)
          : [],
      cta: (t.cta as string) || 'Get Started',
      ctaUrl: (t.ctaUrl as string) || '#signup',
      highlighted: Boolean(t.highlighted),
    }))
  }

  // Shape 1: components[] (backward compatible with existing pricing-tier)
  const tiers = section.components
    .filter((c) => c.enabled && c.type === 'pricing-tier')
    .sort((a, b) => a.order - b.order)

  return tiers.map((tier) => {
    const price = (tier.props?.price as string) || '$0'
    const monthlyNum = parsePrice(price)
    return {
      name: (tier.props?.name as string) || 'Plan',
      monthlyPrice: price,
      annualPrice: isNaN(monthlyNum) ? price : `$${Math.round(monthlyNum * 10)}`,
      period: (tier.props?.period as string) || 'month',
      features: ((tier.props?.features as string) || '').split(',').map((f) => f.trim()).filter(Boolean),
      cta: (tier.props?.ctaText as string) || 'Get Started',
      ctaUrl: (tier.props?.ctaUrl as string) || '#signup',
      highlighted: Boolean(tier.props?.highlighted),
    }
  })
}

export function PricingToggle({ section }: { section: Section }) {
  const [isAnnual, setIsAnnual] = useState(false)
  const content = section.content as Record<string, unknown>
  const tiers = extractTiers(section)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{
        background: section.style.background,
        color: section.style.color,
        fontFamily: 'var(--theme-font)',
      }}
    >
      {/* ─── Heading ─── */}
      {typeof content?.heading === 'string' && (
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-4"
            style={{
              background: section.style.color
                ? `color-mix(in srgb, ${section.style.color} 60%, transparent)`
                : '#6366f1',
            }}
          />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {content.heading}
          </h2>
          {typeof content?.subheading === 'string' && (
            <p className="text-lg mt-3 opacity-70">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* ─── Toggle ─── */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span
          className={cn(
            'text-sm font-medium transition-opacity duration-200',
            !isAnnual ? 'opacity-100' : 'opacity-50',
          )}
        >
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: isAnnual
              ? 'var(--theme-accent, #6366f1)'
              : `color-mix(in srgb, ${section.style.color || '#fff'} 20%, transparent)`,
          }}
          role="switch"
          aria-checked={isAnnual}
          aria-label="Toggle annual billing"
        >
          <span
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform duration-200 translate-y-1',
              isAnnual ? 'translate-x-[28px]' : 'translate-x-1',
            )}
            style={{
              backgroundColor: isAnnual
                ? (section.style.background || '#fff')
                : (section.style.color || '#fff'),
            }}
          />
        </button>
        <span
          className={cn(
            'text-sm font-medium transition-opacity duration-200',
            isAnnual ? 'opacity-100' : 'opacity-50',
          )}
        >
          Annual
        </span>
      </div>

      {/* ─── Tier Cards ─── */}
      <div className="mx-auto max-w-5xl">
        <div
          className={cn(
            'grid gap-6',
            tiers.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
              : 'grid-cols-1 md:grid-cols-3',
          )}
        >
          {tiers.map((tier, idx) => {
            const currentPrice = isAnnual ? tier.annualPrice : tier.monthlyPrice
            const monthlyNum = parsePrice(String(tier.monthlyPrice))
            const annualNum = parsePrice(String(tier.annualPrice))
            const savings = savingsPercent(monthlyNum, annualNum)
            const periodLabel = tier.period
              ? tier.period
              : isAnnual ? 'year' : 'month'

            return (
              <div
                key={idx}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-6',
                  'bg-theme-surface/60 backdrop-blur-sm transition-all duration-300',
                  'shadow-sm hover:shadow-lg hover:-translate-y-[2px]',
                  'opacity-0 animate-card-reveal',
                  tier.highlighted
                    ? 'border-theme-accent ring-2 ring-theme-accent/20 md:-translate-y-2 md:hover:-translate-y-3'
                    : '',
                )}
                style={
                  tier.highlighted
                    ? { animationDelay: `${idx * 100}ms` }
                    : {
                        animationDelay: `${idx * 100}ms`,
                        borderColor: `color-mix(in srgb, ${section.style.color} 10%, transparent)`,
                      }
                }
              >
                {/* Recommended badge */}
                {tier.highlighted && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-theme-accent px-3 py-0.5 text-xs font-semibold"
                    style={{ color: section.style.background || '#fff' }}
                  >
                    Recommended
                  </span>
                )}

                {/* Tier name */}
                <h3 className="text-lg font-semibold">{tier.name}</h3>

                {/* Price with transition */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-bold tracking-tight transition-all duration-300"
                    key={`${idx}-${isAnnual ? 'annual' : 'monthly'}`}
                    style={{
                      animation: 'pricing-fade-in 300ms ease-out',
                    }}
                  >
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-sm text-theme-muted">/{periodLabel}</span>
                </div>

                {/* Save badge */}
                {isAnnual && savings > 0 && (
                  <span
                    className="mt-2 inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--theme-accent, #6366f1) 15%, transparent)',
                      color: 'var(--theme-accent, #6366f1)',
                    }}
                  >
                    Save {savings}%
                  </span>
                )}

                {/* Features list */}
                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className={cn(
                          'mt-0.5 shrink-0',
                          tier.highlighted ? 'text-theme-accent' : 'text-theme-muted',
                        )}
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <a
                  href={tier.ctaUrl}
                  className={cn(
                    'mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors',
                    tier.highlighted
                      ? 'bg-theme-accent hover:opacity-90'
                      : 'border hover:opacity-80',
                  )}
                  style={
                    tier.highlighted
                      ? { color: section.style.background || '#fff' }
                      : {
                          borderColor: `color-mix(in srgb, ${section.style.color} 20%, transparent)`,
                        }
                  }
                >
                  {tier.cta}
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Keyframe for price transition */}
      <style>{`
        @keyframes pricing-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
