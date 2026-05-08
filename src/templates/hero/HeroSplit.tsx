import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Section } from '@/lib/schemas'
import { resolveHeroContent } from '@/lib/schemas'
import { getImageEffectClass } from '@/lib/sectionContent'
import { tokens } from '@/styles/design-tokens'

import { Badge } from '@/components/ui/badge'
import { LightboxModal } from '@/components/ui/LightboxModal'
import { ImageFallback } from '@/components/ui/ImageFallback'
import { useImageError } from '@/hooks/useImageError'
import { InlineEditable, useHeroInlineCommit } from '@/components/shared/InlineEditable'

export function HeroSplit({ section }: { section: Section }) {
  // P116 / B3 — F1 inline edit on hero headline + subhead.
  const { commitHeadline, commitSubhead } = useHeroInlineCommit(section)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { errored, onError: onImgError } = useImageError()
  const effectClass = getImageEffectClass(section)
  const hero = resolveHeroContent(section)
  const imageComp = section.components.find((c) => c.id === 'heroImage')
  const imageUrl = imageComp?.enabled ? (imageComp?.props?.url as string) || '' : ''
  const imageAlt = (imageComp?.props?.alt as string) || ''

  const imageOnLeft = section.variant === 'split-left'

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: section.style.background,
        color: section.style.color,
        padding: section.layout.padding,
        fontFamily: 'var(--theme-font)',
      }}
      className={`min-h-[80vh] flex items-center transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div
        className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12"
        style={{ maxWidth: section.layout.maxWidth || '1200px', margin: '0 auto' }}
      >
        {/* Text column */}
        <div
          className={cn('w-full md:w-1/2 flex flex-col', imageOnLeft && 'order-2')}
          style={{ gap: tokens.spacing['stack-gap'] }}
        >
          {hero.badge?.show && (
            <Badge
              variant="outline"
              className="border-theme-text/10 bg-theme-text/5 text-theme-muted px-4 py-1.5 text-sm backdrop-blur-xl w-fit"
            >
              <Sparkles size={14} />
              {hero.badge.text}
            </Badge>
          )}

          <InlineEditable
            as="h1"
            value={hero.heading.text}
            onCommit={commitHeadline}
            ariaLabel="Edit hero headline"
            testid="hero-inline-headline"
            className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] text-inherit"
            style={{ fontWeight: hero.heading.weight }}
          />

          <InlineEditable
            as="p"
            value={hero.subheading}
            onCommit={commitSubhead}
            ariaLabel="Edit hero subhead"
            testid="hero-inline-subhead"
            className="text-lg leading-relaxed max-w-lg text-theme-muted"
          />

          {(hero.cta.show !== false || hero.secondaryCta) && (
            <div className="flex items-center gap-3">
              {hero.cta.show !== false && (
                <a
                  href={hero.cta.url}
                  className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:opacity-90 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {hero.cta.text}
                </a>
              )}
              {hero.secondaryCta && (
                <a
                  href={hero.secondaryCta.url}
                  className="inline-flex items-center justify-center border border-theme-text/10 text-inherit hover:bg-theme-text/10 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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
          <div className={cn('group w-full md:w-1/2 overflow-hidden rounded-xl', imageOnLeft && 'order-1', effectClass)}>
            {errored ? (
              <div className="w-full h-[400px]"><ImageFallback label={imageAlt || 'Hero image'} /></div>
            ) : (
              <img
                src={imageUrl}
                alt={imageAlt}
                loading="lazy"
                className="w-full object-cover shadow-2xl max-h-[500px] transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
                onClick={() => setLightboxSrc(imageUrl)}
                onError={onImgError}
              />
            )}
          </div>
        )}
      </div>
      {lightboxSrc && (
        <LightboxModal src={lightboxSrc} alt={imageAlt} isOpen onClose={() => setLightboxSrc(null)} />
      )}
    </section>
  )
}
