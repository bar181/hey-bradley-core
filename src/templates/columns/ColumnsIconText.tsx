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

export function ColumnsIconText({ section }: { section: Section }) {
  const cols = (section.layout as any).columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className={`mx-auto max-w-6xl grid grid-cols-1 gap-12 ${GRID_CLASSES[cols] ?? 'md:grid-cols-3'}`}>
        {items.map((item) => {
          const iconSlug = (item.props?.icon as string) ?? ''
          const Icon = iconMap[iconSlug]

          return (
            <div key={item.id} className="flex flex-col items-center text-center">
              {Icon && (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'color-mix(in srgb, var(--theme-accent, #6366f1) 12%, transparent)' }}
                >
                  <Icon size={28} style={{ color: 'var(--theme-accent, #6366f1)' }} aria-hidden />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-3 tracking-tight">
                {(item.props?.title as string) || 'Feature'}
              </h3>
              <p className="text-sm opacity-55 leading-relaxed max-w-xs">
                {(item.props?.description as string) || 'Description'}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
