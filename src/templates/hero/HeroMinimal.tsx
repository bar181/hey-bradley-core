import { useEffect, useRef, useState } from 'react'
import { resolveHeroContent } from '@/lib/schemas'
import type { Section } from '@/lib/schemas'
import { tokens } from '@/styles/design-tokens'


export function HeroMinimal({ section }: { section: Section }) {
  const hero = resolveHeroContent(section)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const sectionRef = useRef<HTMLElement>(null)

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
      className={`min-h-[80vh] flex items-center justify-center transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ background: section.style.background, color: section.style.color, padding: section.layout.padding, fontFamily: 'var(--theme-font)' }}
    >
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto" style={{ gap: section.layout.gap ?? tokens.spacing['stack-gap-lg'] }}>
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
                className="inline-flex items-center justify-center bg-theme-accent text-theme-bg hover:opacity-90 px-8 py-3 rounded-lg font-semibold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {hero.cta.text}
              </a>
            )}
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCta.url}
                className="inline-flex items-center justify-center border border-theme-text/10 text-inherit hover:bg-theme-text/10 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
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
