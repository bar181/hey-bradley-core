import type { Section } from '@/lib/schemas'
import { Card, CardContent } from '@/components/ui/card'
import {
  Zap,
  Target,
  Shield,
  Star,
  Rocket,
  Code,
  Globe,
  Lock,
  Cpu,
  type LucideIcon,
} from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

/* --------------------------------------------------------------------- */
/*  Icon map — maps JSON icon slugs to Lucide components                 */
/* --------------------------------------------------------------------- */

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  target: Target,
  shield: Shield,
  star: Star,
  rocket: Rocket,
  code: Code,
  globe: Globe,
  lock: Lock,
  cpu: Cpu,
}

/* --------------------------------------------------------------------- */
/*  FeaturesGrid                                                          */
/* --------------------------------------------------------------------- */

export function FeaturesGrid({ section }: { section: Section }) {
  const features = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section className="py-16 px-6" style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}>
      <div
        className={`mx-auto max-w-6xl grid grid-cols-1 ${(() => { const cols = section.layout.columns ?? 3; return cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3' })()}`}
        style={{ gap: tokens.spacing['stack-gap-lg'] }}
      >
        {features.map((feature) => {
          const iconSlug = (feature.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <Card
              key={feature.id}
              className="bg-theme-surface/80 text-inherit transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-default"
              style={{
                borderColor: `color-mix(in srgb, ${section.style.color} 8%, transparent)`,
                borderRadius: tokens.radius.md,
                padding: tokens.spacing['stack-gap'],
              }}
            >
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  {Icon && (
                    <Icon
                      className="text-theme-accent shrink-0"
                      size={24}
                      aria-hidden
                    />
                  )}
                  <h3 className="text-lg font-semibold">
                    {(feature.props?.title as string) || 'Feature'}
                  </h3>
                </div>
                <p className="text-sm text-theme-muted">
                  {(feature.props?.description as string) || 'Description'}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
