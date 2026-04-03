import type { Section } from '@/lib/schemas'
import {
  Zap, Target, Shield, Star, Rocket, Code, Globe, Lock, Cpu,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  zap: Zap, target: Target, shield: Shield, star: Star, rocket: Rocket,
  code: Code, globe: Globe, lock: Lock, cpu: Cpu,
}

export function ColumnsHorizontal({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {items.map((item) => {
          const iconSlug = (item.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div
              key={item.id}
              className="flex items-start gap-6 rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: `color-mix(in srgb, ${section.style.color} 2%, transparent)`,
                border: `1px solid color-mix(in srgb, ${section.style.color} 15%, transparent)`,
              }}
            >
              {Icon && (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'color-mix(in srgb, var(--theme-accent, #6366f1) 12%, transparent)' }}
                >
                  <Icon size={24} style={{ color: 'var(--theme-accent, #6366f1)' }} aria-hidden />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold mb-1.5 tracking-tight">
                  {(item.props?.title as string) || 'Always Secure'}
                </h3>
                <p className="text-sm opacity-55 leading-relaxed">
                  {(item.props?.description as string) || 'Enterprise-grade security built in'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
