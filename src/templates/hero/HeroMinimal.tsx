import { resolveHeroContent } from '@/lib/schemas'
import type { Section } from '@/lib/schemas'


export function HeroMinimal({ section }: { section: Section }) {
  const hero = resolveHeroContent(section)

  return (
    <section
      className="min-h-[80vh] flex items-center justify-center"
      style={{ background: section.style.background, color: section.style.color, padding: section.layout.padding, fontFamily: 'var(--theme-font)' }}
    >
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto" style={{ gap: section.layout.gap }}>
        <h1
          className="text-5xl md:text-7xl tracking-tight leading-[1.05] text-inherit"
          style={{ fontWeight: hero.heading.weight, fontFamily: 'var(--theme-font)' }}
        >
          {hero.heading.text}
        </h1>

        <p className="text-lg md:text-xl max-w-lg leading-relaxed text-theme-muted">
          {hero.subheading}
        </p>

        {(hero.cta.show !== false || hero.secondaryCta) && (
          <div className="flex items-center gap-3 mt-4">
            {hero.cta.show !== false && (
              <a
                href={hero.cta.url}
                className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:opacity-90 px-8 py-3 rounded-lg font-semibold text-sm shadow-lg transition-all"
              >
                {hero.cta.text}
              </a>
            )}
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCta.url}
                className="inline-flex items-center justify-center border border-theme-text/10 text-inherit hover:bg-theme-text/10 px-8 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                {hero.secondaryCta.text}
              </a>
            )}
          </div>
        )}

        {hero.trustBadges?.show && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] mt-12 text-theme-muted/40">
            {hero.trustBadges.text}
          </p>
        )}
      </div>
    </section>
  )
}
