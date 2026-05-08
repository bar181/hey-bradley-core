import type { Section } from '@/lib/schemas'
import {
  Zap, Target, Shield, Star, Rocket, Code, Globe, Lock, Cpu,
  type LucideIcon,
} from 'lucide-react'
import { tokens } from '@/styles/design-tokens'

const iconMap: Record<string, LucideIcon> = {
  zap: Zap, target: Target, shield: Shield, star: Star, rocket: Rocket,
  code: Code, globe: Globe, lock: Lock, cpu: Cpu,
}

export function FeaturesCards({ section }: { section: Section }) {
  const features = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div
        className={`mx-auto max-w-6xl grid grid-cols-1 ${(() => { const cols = section.layout.columns ?? 3; return cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3' })()}`}
        style={{ gap: tokens.spacing['stack-gap'] }}
      >
        {features.map((feature) => {
          const iconSlug = (feature.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div
              key={feature.id}
              className="border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-default"
              style={{
                background: `color-mix(in srgb, ${section.style.color} 3%, transparent)`,
                borderColor: `color-mix(in srgb, ${section.style.color} 10%, transparent)`,
                padding: tokens.spacing['stack-gap'],
                borderRadius: tokens.radius.md,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                {Icon && (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'color-mix(in srgb, var(--theme-accent, #6366f1) 15%, transparent)' }}
                  >
                    <Icon size={20} style={{ color: 'var(--theme-accent, #6366f1)' }} aria-hidden />
                  </div>
                )}
                <h3 className="text-base font-semibold">
                  {(feature.props?.title as string) || 'Feature'}
                </h3>
              </div>
              <p className="text-sm opacity-60 leading-relaxed">
                {(feature.props?.description as string) || 'Description'}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
