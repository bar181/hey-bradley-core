import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Section } from '@/lib/schemas'
import { resolveHeroContent } from '@/lib/schemas'

export function HeroSplit({ section }: { section: Section }) {
  const hero = resolveHeroContent(section)
  const imageComp = section.components.find((c) => c.id === 'heroImage')
  const imageUrl = (imageComp?.props?.url as string) || ''
  const imageAlt = (imageComp?.props?.alt as string) || ''

  const imageOnLeft = section.variant === 'split-left'

  return (
    <section
      style={{
        background: section.style.background,
        color: section.style.color,
        padding: section.layout.padding,
        fontFamily: section.style.fontFamily,
      }}
      className="min-h-[500px] flex items-center"
    >
      <div
        className="w-full flex items-center gap-12"
        style={{ maxWidth: section.layout.maxWidth || '1200px', margin: '0 auto' }}
      >
        {/* Text column */}
        <div className={cn('flex-1 flex flex-col gap-6', imageOnLeft && 'order-2')}>
          {hero.badge?.show && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-current/10 bg-current/5 px-4 py-1.5 text-sm backdrop-blur-xl w-fit"
              style={{ color: `${section.style.color}cc` }}
            >
              <Sparkles size={14} />
              {hero.badge.text}
            </span>
          )}

          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]"
            style={{ fontWeight: hero.heading.weight }}
          >
            {hero.heading.text}
          </h1>

          <p
            className="text-lg leading-relaxed max-w-lg"
            style={{ color: `${section.style.color}99` }}
          >
            {hero.subheading}
          </p>

          <div className="flex items-center gap-3">
            <a
              href={hero.cta.url}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{
                backgroundColor:
                  section.style.background === '#faf8f5' ? '#e8772e' : '#3b82f6',
              }}
            >
              {hero.cta.text}
            </a>
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCta.url}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm border transition-all"
                style={{
                  borderColor: `${section.style.color}20`,
                  color: `${section.style.color}cc`,
                }}
              >
                {hero.secondaryCta.text}
              </a>
            )}
          </div>

          {hero.trustBadges?.show && (
            <p
              className="text-xs font-medium uppercase tracking-wider mt-4"
              style={{ color: `${section.style.color}40` }}
            >
              {hero.trustBadges.text}
            </p>
          )}
        </div>

        {/* Image column */}
        {imageUrl && (
          <div className={cn('flex-1', imageOnLeft && 'order-1')}>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full rounded-xl object-cover shadow-2xl"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
