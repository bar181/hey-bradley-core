import type { Section } from '@/lib/schemas'
import {
  Zap, Target, Shield, Star, Rocket, Code, Globe, Lock, Cpu,
  type LucideIcon,
} from 'lucide-react'

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
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const iconSlug = (feature.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div
              key={feature.id}
              className="rounded-xl border border-white/10 p-6 hover:border-white/20 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {Icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'var(--theme-accent, #6366f1)', opacity: 0.15 }}
                >
                  <Icon size={20} style={{ color: 'var(--theme-accent, #6366f1)' }} aria-hidden />
                </div>
              )}
              <h3 className="text-base font-semibold mb-2">
                {(feature.props?.title as string) || 'Feature'}
              </h3>
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
