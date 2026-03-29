import { useRef } from 'react'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { useThemeVars } from '@/lib/useThemeVars'
import { HeroCentered } from '@/templates/hero/HeroCentered'
import { HeroSplit } from '@/templates/hero/HeroSplit'
import { HeroOverlay } from '@/templates/hero/HeroOverlay'
import { HeroMinimal } from '@/templates/hero/HeroMinimal'
import { CTASimple } from '@/templates/cta/CTASimple'
import { FeaturesGrid } from '@/templates/features/FeaturesGrid'

const PREVIEW_WIDTH_MAP = {
  full: '100%',
  desktop: '1280px',
  tablet: '768px',
  mobile: '375px',
} as const

export function RealityTab() {
  const sections = useConfigStore((s) => s.config.sections)
  const previewWidth = useUIStore((s) => s.previewWidth)
  const containerRef = useRef<HTMLDivElement>(null)
  useThemeVars(containerRef)

  if (import.meta.env.DEV) console.log('[preview]', previewWidth)

  return (
    <div ref={containerRef} className="min-h-full">
      <div
        className="mx-auto transition-all duration-300"
        style={{ maxWidth: PREVIEW_WIDTH_MAP[previewWidth] }}
      >
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
          if (section.type === 'features') {
            return <FeaturesGrid key={section.id} section={section} />
          }
          if (section.type === 'cta') {
            return <CTASimple key={section.id} section={section} />
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
    </div>
  )
}
