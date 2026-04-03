import type { Section } from '@/lib/schemas'
import {
  Zap, Target, Shield, Star, Rocket, Code, Globe, Lock, Cpu,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  zap: Zap, target: Target, shield: Shield, star: Star, rocket: Rocket,
  code: Code, globe: Globe, lock: Lock, cpu: Cpu,
}

const GRID_CLASSES: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

export function ColumnsGlass({ section }: { section: Section }) {
  const cols = (section.layout as any).columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className={`mx-auto max-w-6xl grid grid-cols-1 gap-6 ${GRID_CLASSES[cols] ?? 'md:grid-cols-3'}`}>
        {items.map((item) => {
          const iconSlug = (item.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div
              key={item.id}
              className="rounded-xl backdrop-blur-xl p-7 transition-all duration-200 hover:shadow-lg"
              style={{
                background: `color-mix(in srgb, ${section.style.color} 5%, transparent)`,
                border: `1px solid color-mix(in srgb, ${section.style.color} 15%, transparent)`,
              }}
            >
              {Icon && (
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5 backdrop-blur-sm"
                  style={{ background: `color-mix(in srgb, ${section.style.color} 8%, transparent)` }}
                >
                  <Icon size={20} style={{ color: 'var(--theme-accent, #6366f1)' }} aria-hidden />
                </div>
              )}
              <h3 className="text-base font-semibold mb-2 tracking-tight">
                {(item.props?.title as string) || 'Always Secure'}
              </h3>
              <p className="text-sm opacity-60 leading-relaxed">
                {(item.props?.description as string) || 'Enterprise-grade security built in'}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
