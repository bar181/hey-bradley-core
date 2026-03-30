import { resolveHeroContent } from '@/lib/schemas'
import type { Section } from '@/lib/schemas'
import { Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export function HeroOverlay({ section }: { section: Section }) {
  const hero = resolveHeroContent(section)
  const bgImageComp = section.components.find(c => c.id === 'backgroundImage')
  const imageComp = bgImageComp?.enabled ? bgImageComp : section.components.find(c => c.id === 'heroImage')
  const videoComp = section.components.find(c => c.id === 'heroVideo')
  const imageUrl = (imageComp?.props?.url as string) || ''
  const videoUrl = (videoComp?.props?.url as string) || ''

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden" style={{ fontFamily: 'var(--theme-font)' }}>
      {/* Background image or video */}
      {videoUrl && videoComp?.enabled ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
        />
      ) : imageUrl && imageComp?.enabled ? (
        <img
          src={imageUrl}
          alt={(imageComp?.props?.alt as string) || ''}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8" style={{ gap: section.layout.gap, maxWidth: section.layout.maxWidth || '900px' }}>
        {hero.badge?.show && (
          <Badge
            variant="outline"
            className="border-white/20 bg-white/10 text-white/80 px-4 py-1.5 text-sm backdrop-blur-xl"
          >
            <Sparkles size={14} />
            {hero.badge.text}
          </Badge>
        )}

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white" style={{ fontWeight: hero.heading.weight }}>
          {hero.heading.text}
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
          {hero.subheading}
        </p>

        {(hero.cta.show !== false || hero.secondaryCta) && (
          <div className="flex items-center gap-3 mt-2">
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
                className="inline-flex items-center justify-center border border-white/20 text-white/80 hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-sm transition-all"
              >
                {hero.secondaryCta.text}
              </a>
            )}
          </div>
        )}

        {hero.trustBadges?.show && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/40 mt-8">
            {hero.trustBadges.text}
          </p>
        )}
      </div>
    </section>
  )
}
