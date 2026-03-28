import { Sparkles } from 'lucide-react'
import type { Section } from '@/lib/schemas'
import { resolveHeroContent } from '@/lib/schemas'

interface HeroCenteredProps {
  section: Section
}

export function HeroCentered({ section }: HeroCenteredProps) {
  const hero = resolveHeroContent(section)

  return (
    <section
      style={{
        background: section.style.background,
        color: section.style.color,
        padding: section.layout.padding,
      }}
      className="min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 30%, transparent 60%)',
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
        <div className="flex items-center gap-3 mt-4">
          <a
            href={hero.cta.url}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            {hero.cta.text}
          </a>
          {hero.secondaryCta && (
            <a
              href={hero.secondaryCta.url}
              className="bg-white/5 hover:bg-white/10 text-white/80 px-8 py-3 rounded-lg font-semibold text-sm border border-white/10 transition-all"
            >
              {hero.secondaryCta.text}
            </a>
          )}
        </div>

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
