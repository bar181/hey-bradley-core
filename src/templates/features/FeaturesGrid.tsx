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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 gap-8 ${(() => { const cols = (section.layout as any).columns ?? 3; return cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3' })()}`}>
        {features.map((feature) => {
          const iconSlug = (feature.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <Card
              key={feature.id}
              className="bg-theme-surface/80 text-inherit"
              style={{ borderColor: `color-mix(in srgb, ${section.style.color} 8%, transparent)` }}
            >
              <CardContent>
                {Icon && (
                  <Icon
                    className="mb-3 text-theme-accent"
                    size={24}
                    aria-hidden
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">
                  {(feature.props?.title as string) || 'Feature'}
                </h3>
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
