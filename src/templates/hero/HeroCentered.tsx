import { Sparkles } from 'lucide-react'
import type { Section } from '@/lib/schemas'
import { resolveHeroContent } from '@/lib/schemas'

import { Badge } from '@/components/ui/badge'

interface HeroCenteredProps {
  section: Section
}

export function HeroCentered({ section }: HeroCenteredProps) {
  const hero = resolveHeroContent(section)
  const videoComp = section.components.find(c => c.id === 'heroVideo')
  const videoUrl = videoComp?.enabled ? (videoComp?.props?.url as string) || '' : ''
  const imageComp = section.components.find(c => c.id === 'heroImage')
  const imageUrl = imageComp?.enabled ? (imageComp?.props?.url as string) || '' : ''
  const imageAlt = (imageComp?.props?.alt as string) || ''

  return (
    <section
      style={{
        background: section.style.background,
        color: section.style.color,
        padding: section.layout.padding,
        fontFamily: 'var(--theme-font)',
      }}
      className="min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      {/* Optional video background */}
      {videoUrl && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src={videoUrl}
        />
      )}

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, var(--theme-accent) / 0.12 0%, var(--theme-accent-secondary) / 0.06 30%, transparent 60%)`,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center"
        style={{ gap: section.layout.gap }}
      >
        {/* Badge */}
        {hero.badge?.show && (
          <Badge
            variant="outline"
            className="border-theme-text/10 bg-theme-text/5 text-theme-muted px-4 py-1.5 text-sm backdrop-blur-xl"
          >
            <Sparkles size={14} />
            {hero.badge.text}
          </Badge>
        )}

        {/* Heading */}
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-inherit"
          style={{
            fontSize: hero.heading.size,
            fontWeight: hero.heading.weight,
          }}
        >
          {hero.heading.text}
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl max-w-xl leading-relaxed text-theme-muted">
          {hero.subheading}
        </p>

        {/* CTA buttons */}
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

        {/* Inline hero image (below content) */}
        {imageUrl && (
          <div className="mt-8 w-full max-w-4xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full rounded-xl object-cover shadow-2xl max-h-[500px]"
            />
          </div>
        )}

        {/* Trust badges */}
        {hero.trustBadges?.show && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mt-12 text-theme-muted/40">
            {hero.trustBadges.text}
          </p>
        )}
      </div>
    </section>
  )
}
