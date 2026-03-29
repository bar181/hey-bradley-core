import { useConfigStore } from '@/store/configStore'
import { HeroCentered } from '@/templates/hero/HeroCentered'
import { HeroSplit } from '@/templates/hero/HeroSplit'
import { HeroOverlay } from '@/templates/hero/HeroOverlay'
import { HeroMinimal } from '@/templates/hero/HeroMinimal'

export function RealityTab() {
  const sections = useConfigStore((s) => s.config.sections)

  return (
    <div className="min-h-full">
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          if (section.type === 'hero') {
            switch (section.variant) {
              case 'split-right':
              case 'split-left':
                return <HeroSplit key={section.id} section={section} />
              case 'overlay':
                return <HeroOverlay key={section.id} section={section} />
              case 'minimal':
                return <HeroMinimal key={section.id} section={section} />
              default:
                return <HeroCentered key={section.id} section={section} />
            }
          }
          // Placeholder for other section types
          return (
            <div
              key={section.id}
              className="py-16 px-8 text-center"
              style={{
                background: section.style.background,
                color: section.style.color,
              }}
            >
              <p className="font-mono text-sm uppercase tracking-wider opacity-50">
                {section.type} — {section.id}
              </p>
            </div>
          )
        })}
    </div>
  )
}
