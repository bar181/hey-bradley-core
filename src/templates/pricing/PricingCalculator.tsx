import { useState } from 'react'
import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'

/* --------------------------------------------------------------------- */
/*  PricingCalculator — slider-driven seat-based price calculator         */
/*  Reads pricePerSeat from section.components[0].pricePerSeat (def 12).  */
/* --------------------------------------------------------------------- */

function formatUSD(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function PricingCalculator({ section }: { section: Section }) {
  const first = section.components[0]
  const props = (first?.props as Record<string, unknown> | undefined) ?? {}
  const pricePerSeatRaw = props.pricePerSeat
  const pricePerSeat =
    typeof pricePerSeatRaw === 'number'
      ? pricePerSeatRaw
      : typeof pricePerSeatRaw === 'string'
        ? parseFloat(pricePerSeatRaw.replace(/[^0-9.]/g, '')) || 12
        : 12

  const ctaText = (props.ctaText as string) || 'Get started'
  const ctaUrl = (props.ctaUrl as string) || '#signup'

  const [seats, setSeats] = useState<number>(5)
  const total = seats * pricePerSeat

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
      {getStr(section, 'heading') && (
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-4"
            style={{
              background: section.style.color
                ? `color-mix(in srgb, ${section.style.color} 60%, transparent)`
                : '#6366f1',
            }}
          />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">{getStr(section, 'subheading')}</p>
          )}
        </div>
      )}

      <div className="mx-auto max-w-xl">
        <div
          className="rounded-2xl border p-6 md:p-8 backdrop-blur-sm"
          style={{
            borderColor: `color-mix(in srgb, ${section.style.color || '#fff'} 12%, transparent)`,
            background: `color-mix(in srgb, ${section.style.color || '#fff'} 3%, transparent)`,
          }}
        >
          {/* Slider label */}
          <label htmlFor="seats-slider" className="block text-sm font-medium mb-3">
            How many seats?
          </label>

          {/* Slider value */}
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-3xl font-bold tracking-tight">{seats}</span>
            <span className="text-sm opacity-60">{seats === 1 ? 'seat' : 'seats'}</span>
          </div>

          {/* Slider input */}
          <input
            id="seats-slider"
            type="range"
            min={1}
            max={50}
            step={1}
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value, 10))}
            aria-label="Number of seats"
            aria-valuemin={1}
            aria-valuemax={50}
            aria-valuenow={seats}
            className="w-full accent-[var(--theme-accent,var(--hb-accent))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] rounded"
          />

          <div className="flex justify-between text-xs opacity-50 mt-1">
            <span>1</span>
            <span>50</span>
          </div>

          {/* Total */}
          <div
            className="mt-6 pt-6 border-t flex items-baseline justify-between"
            style={{
              borderColor: `color-mix(in srgb, ${section.style.color || '#fff'} 10%, transparent)`,
            }}
          >
            <span className="text-sm opacity-70">Total per month</span>
            <span className="text-4xl font-bold tracking-tight">{formatUSD(total)}</span>
          </div>

          <p className="text-xs opacity-50 mt-1 text-right">
            {formatUSD(pricePerSeat)} / seat / month
          </p>

          {/* CTA */}
          <a
            href={ctaUrl}
            className="mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2"
            style={{
              background: 'var(--theme-accent, var(--hb-accent))',
              color: section.style.background || 'var(--hb-bg)',
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  )
}
