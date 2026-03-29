import { resolveHeroContent } from '@/lib/schemas'
import type { Section } from '@/lib/schemas'
import { Button } from '@/components/ui/button'

export function HeroMinimal({ section }: { section: Section }) {
  const hero = resolveHeroContent(section)

  return (
    <section
      className="min-h-[600px] flex items-center justify-center bg-theme-bg text-theme-text"
      style={{ background: section.style.background, padding: section.layout.padding, fontFamily: 'var(--theme-font)' }}
    >
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto" style={{ gap: section.layout.gap }}>
        <h1
          className="text-5xl md:text-7xl tracking-tight leading-[1.05] text-theme-text"
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
              <Button
                className="bg-theme-accent text-theme-bg hover:opacity-90 px-8 py-3 text-sm font-semibold rounded-lg"
                render={<a href={hero.cta.url} />}
              >
                {hero.cta.text}
              </Button>
            )}
            {hero.secondaryCta && (
              <Button
                variant="outline"
                className="border-white/10 text-theme-text hover:bg-white/10 px-8 py-3 text-sm font-semibold rounded-lg"
                render={<a href={hero.secondaryCta.url} />}
              >
                {hero.secondaryCta.text}
              </Button>
            )}
          </div>
        )}

        {hero.trustBadges?.show && (
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] mt-12 text-theme-muted/40">
            {hero.trustBadges.text}
          </p>
        )}
      </div>
    </section>
  )
}
