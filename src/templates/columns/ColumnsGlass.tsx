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
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
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
      <div className="relative">
        {/* Ambient background blobs for glass blur effect */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className={`relative mx-auto max-w-6xl grid grid-cols-1 gap-6 ${GRID_CLASSES[cols] ?? 'md:grid-cols-3'}`}>
        {items.map((item, idx) => {
          const iconSlug = (item.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div
              key={item.id}
              className="rounded-2xl backdrop-blur-xl p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal"
              style={{
                animationDelay: `${idx * 100}ms`,
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
                {(item.props?.title as string) || 'Always Reliable'}
              </h3>
              <p className="text-sm opacity-60 leading-relaxed">
                {(item.props?.description as string) || 'Built with quality from the start'}
              </p>
            </div>
          )
        })}
        </div>
      </div>
    </section>
  )
}
