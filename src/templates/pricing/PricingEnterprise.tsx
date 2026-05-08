import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import { Check } from 'lucide-react'

/* --------------------------------------------------------------------- */
/*  PricingEnterprise — single-card enterprise CTA layout                 */
/*  Reads headline / subhead / bullets / cta from section.components[0].  */
/* --------------------------------------------------------------------- */

const DEFAULT_BULLETS = [
  'Custom SLA with 99.99% uptime guarantee',
  'Dedicated support engineer + onboarding',
  'SSO, SAML, audit logs, and procurement-ready',
]

export function PricingEnterprise({ section }: { section: Section }) {
  const first = section.components[0]
  const props = (first?.props as Record<string, unknown> | undefined) ?? {}

  const headline = (props.headline as string) || 'Enterprise — Built for teams that mean it.'
  const subhead =
    (props.subhead as string) ||
    'Hardened, audited, and tuned for organizations that need more than a credit-card swipe.'

  const bulletsRaw = props.bullets
  const bullets: string[] = Array.isArray(bulletsRaw)
    ? (bulletsRaw as string[]).slice(0, 5)
    : typeof bulletsRaw === 'string'
      ? bulletsRaw.split(',').map((b) => b.trim()).filter(Boolean).slice(0, 5)
      : DEFAULT_BULLETS

  const ctaText = (props.ctaText as string) || 'Talk to sales'
  const ctaUrl = (props.ctaUrl as string) || '#contact-sales'

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
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{getStr(section, 'heading')}</h2>
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <div
          className="relative overflow-hidden rounded-3xl border p-8 md:p-12 text-center"
          style={{
            borderColor: `color-mix(in srgb, ${section.style.color || '#fff'} 14%, transparent)`,
            background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-accent, var(--hb-accent)) 8%, transparent) 0%, color-mix(in srgb, ${section.style.color || '#fff'} 3%, transparent) 100%)`,
          }}
        >
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{headline}</h3>
          <p className="mt-3 text-base md:text-lg opacity-70 max-w-xl mx-auto">{subhead}</p>

          <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                <Check size={18} aria-hidden className="mt-0.5 shrink-0" style={{ color: 'var(--theme-accent, var(--hb-accent))' }} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={ctaUrl}
            className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2"
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
