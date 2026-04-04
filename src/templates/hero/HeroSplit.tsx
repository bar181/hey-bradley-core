import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Section } from '@/lib/schemas'
import { resolveHeroContent } from '@/lib/schemas'

import { Badge } from '@/components/ui/badge'

export function HeroSplit({ section }: { section: Section }) {
  const hero = resolveHeroContent(section)
  const imageComp = section.components.find((c) => c.id === 'heroImage')
  const imageUrl = imageComp?.enabled ? (imageComp?.props?.url as string) || '' : ''
  const imageAlt = (imageComp?.props?.alt as string) || ''

  const imageOnLeft = section.variant === 'split-left'

  return (
    <section
      style={{
        background: section.style.background,
        color: section.style.color,
        padding: section.layout.padding,
        fontFamily: 'var(--theme-font)',
      }}
      className="min-h-[80vh] flex items-center"
    >
      <div
        className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12"
        style={{ maxWidth: section.layout.maxWidth || '1200px', margin: '0 auto' }}
      >
        {/* Text column */}
        <div className={cn('w-full md:w-1/2 flex flex-col gap-6', imageOnLeft && 'order-2')}>
          {hero.badge?.show && (
            <Badge
              variant="outline"
              className="border-theme-text/10 bg-theme-text/5 text-theme-muted px-4 py-1.5 text-sm backdrop-blur-xl w-fit"
            >
              <Sparkles size={14} />
              {hero.badge.text}
            </Badge>
          )}

          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] text-inherit"
            style={{ fontWeight: hero.heading.weight }}
          >
            {hero.heading.text}
          </h1>

          <p className="text-lg leading-relaxed max-w-lg text-theme-muted">
            {hero.subheading}
          </p>

          {(hero.cta.show !== false || hero.secondaryCta) && (
            <div className="flex items-center gap-3">
              {hero.cta.show !== false && (
                <a
                  href={hero.cta.url}
                  className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:opacity-90 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all"
                >
                  {hero.cta.text}
                </a>
              )}
              {hero.secondaryCta && (
                <a
                  href={hero.secondaryCta.url}
                  className="inline-flex items-center justify-center border border-theme-text/10 text-inherit hover:bg-theme-text/10 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
                >
                  {hero.secondaryCta.text}
                </a>
              )}
            </div>
          )}

          {hero.trustBadges?.show && (
            <p className="text-xs font-medium uppercase tracking-wider mt-4 text-theme-muted/40">
              {hero.trustBadges.text}
            </p>
          )}
        </div>

        {/* Image column */}
        {imageUrl && (
          <div className={cn('w-full md:w-1/2', imageOnLeft && 'order-1')}>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full rounded-xl object-cover shadow-2xl max-h-[500px]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
