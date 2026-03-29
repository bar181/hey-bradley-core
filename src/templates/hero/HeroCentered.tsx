import { Sparkles } from 'lucide-react'
import type { Section } from '@/lib/schemas'
import { resolveHeroContent } from '@/lib/schemas'
import { useConfigStore } from '@/store/configStore'
import { resolveColors } from '@/lib/resolveColors'

interface HeroCenteredProps {
  section: Section
}

export function HeroCentered({ section }: HeroCenteredProps) {
  const hero = resolveHeroContent(section)
  const theme = useConfigStore((s) => s.config.theme)
  const colors = resolveColors(theme)
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
        fontFamily: section.style.fontFamily,
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
          background: `radial-gradient(ellipse at top, ${colors.accentPrimary}1f 0%, ${colors.accentSecondary}0f 30%, transparent 60%)`,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center"
        style={{ gap: section.layout.gap }}
      >
        {/* Badge */}
        {hero.badge?.show && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-xl"
            style={{ color: `${section.style.color}cc` }}
          >
            <Sparkles size={14} />
            {hero.badge.text}
          </span>
        )}

        {/* Heading */}
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400"
          style={{
            fontSize: hero.heading.size,
            fontWeight: hero.heading.weight,
          }}
        >
          {hero.heading.text}
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl max-w-xl leading-relaxed"
          style={{ color: `${section.style.color}99` }}
        >
          {hero.subheading}
        </p>

        {/* CTA buttons */}
        {(hero.cta.show !== false || hero.secondaryCta) && (
          <div className="flex items-center gap-3 mt-4">
            {hero.cta.show !== false && (
              <a
                href={hero.cta.url}
                style={{ backgroundColor: colors.accentPrimary }}
                className="hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-lg transition-all"
              >
                {hero.cta.text}
              </a>
            )}
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCta.url}
                className="bg-white/5 hover:bg-white/10 text-white/80 px-8 py-3 rounded-lg font-semibold text-sm border border-white/10 transition-all"
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
              className="w-full rounded-xl object-cover shadow-2xl"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* Trust badges */}
        {hero.trustBadges?.show && (
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] mt-12"
            style={{ color: `${section.style.color}40` }}
          >
            {hero.trustBadges.text}
          </p>
        )}
      </div>
    </section>
  )
}
