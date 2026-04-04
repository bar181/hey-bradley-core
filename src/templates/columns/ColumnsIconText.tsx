import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
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

export function ColumnsIconText({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">
              {getStr(section, 'subheading')}
            </p>
          )}
        </div>
      )}
      <div className={`mx-auto max-w-6xl grid grid-cols-1 gap-12 ${GRID_CLASSES[cols] ?? 'md:grid-cols-3'}`}>
        {items.map((item, idx) => {
          const iconSlug = (item.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div key={item.id} className="flex flex-col items-center text-center rounded-2xl p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal"
              style={{
                animationDelay: `${idx * 100}ms`,
                background: `color-mix(in srgb, ${section.style.color} 3%, transparent)`,
                border: `1px solid color-mix(in srgb, ${section.style.color} 10%, transparent)`,
              }}>
              {Icon && (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'color-mix(in srgb, var(--theme-accent, #6366f1) 12%, transparent)' }}
                >
                  <Icon size={28} style={{ color: 'var(--theme-accent, #6366f1)' }} aria-hidden />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-3 tracking-tight">
                {(item.props?.title as string) || 'Pixel Perfect'}
              </h3>
              <p className="text-sm opacity-55 leading-relaxed max-w-xs">
                {(item.props?.description as string) || 'Every detail polished and professional'}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
