import { useConfigStore } from '@/store/configStore'
import { resolveHeroContent } from '@/lib/schemas'
import type { Section } from '@/lib/schemas'

export function HeroMinimal({ section }: { section: Section }) {
  const theme = useConfigStore(s => s.config.theme)
  const hero = resolveHeroContent(section)

  return (
    <section
      className="min-h-[600px] flex items-center justify-center"
      style={{ background: section.style.background, color: section.style.color, padding: section.layout.padding, fontFamily: section.style.fontFamily }}
    >
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto" style={{ gap: section.layout.gap }}>
        <h1
          className="text-5xl md:text-7xl tracking-tight leading-[1.05]"
          style={{ fontWeight: hero.heading.weight, fontFamily: section.style.fontFamily }}
        >
          {hero.heading.text}
        </h1>

        <p className="text-lg md:text-xl max-w-lg leading-relaxed" style={{ color: `${section.style.color}88` }}>
          {hero.subheading}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <a href={hero.cta.url} className="px-8 py-3 rounded-lg font-semibold text-sm transition-all" style={{ backgroundColor: theme.colors.primary, color: '#fff' }}>
            {hero.cta.text}
          </a>
          {hero.secondaryCta && (
            <a href={hero.secondaryCta.url} className="px-8 py-3 rounded-lg font-semibold text-sm border transition-all" style={{ borderColor: `${section.style.color}20`, color: `${section.style.color}cc` }}>
              {hero.secondaryCta.text}
            </a>
          )}
        </div>

        {hero.trustBadges?.show && (
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] mt-12" style={{ color: `${section.style.color}30` }}>
            {hero.trustBadges.text}
          </p>
        )}
      </div>
    </section>
  )
}
