import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import {
  Zap, Target, Shield, Star, Rocket, Code, Globe, Lock, Cpu,
  type LucideIcon,
} from 'lucide-react'

/* --------------------------------------------------------------------- */
/*  NumbersIcons — Icon above each number + label                         */
/* --------------------------------------------------------------------- */

const iconMap: Record<string, LucideIcon> = {
  zap: Zap, target: Target, shield: Shield, star: Star,
  rocket: Rocket, code: Code, globe: Globe, lock: Lock, cpu: Cpu,
}

export function NumbersIcons({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 4
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  const gridClass =
    cols === 2 ? 'md:grid-cols-2'
    : cols === 3 ? 'md:grid-cols-3'
    : 'md:grid-cols-4'

  return (
    <section
      className="py-12 md:py-16 px-6"
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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-10 text-center`}>
        {items.map((item, idx) => {
          const value = (item.props?.value as string) || '0'
          const label = (item.props?.label as string) || 'Label'
          const description = (item.props?.description as string) || ''
          const iconKey = (item.props?.icon as string) || 'zap'
          const Icon = iconMap[iconKey] ?? Zap

          return (
            <div key={item.id} className="flex flex-col items-center gap-2 opacity-0 animate-card-reveal" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="w-12 h-12 rounded-full bg-theme-accent/10 flex items-center justify-center">
                <Icon size={22} className="text-theme-accent" />
              </div>
              <div className="text-4xl font-bold tracking-tight text-theme-accent">
                {value}
              </div>
              <div className="text-sm font-semibold uppercase tracking-wide">
                {label}
              </div>
              {description && (
                <div className="text-xs text-theme-muted max-w-[200px]">{description}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
