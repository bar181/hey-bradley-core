import type { Section } from '@/lib/schemas'

export function ActionGradient({ section }: { section: Section }) {
  const heading = section.components.find((c) => c.id === 'heading')
  const subtitle = section.components.find((c) => c.id === 'subtitle')
  const button = section.components.find((c) => c.id === 'button')

  return (
    <section
      className="py-16 md:py-24 px-6 text-center"
      style={{
        background: `linear-gradient(135deg, var(--theme-accent, #6366f1), color-mix(in srgb, var(--theme-accent, #6366f1) 60%, #000))`,
        color: '#fff',
        fontFamily: 'var(--theme-font)',
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
        {heading?.enabled && (
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
            {(heading.props?.text as string) || 'Take the next step'}
          </h2>
        )}
        {subtitle?.enabled && (
          <p className="text-lg md:text-xl opacity-80 max-w-xl leading-relaxed">
            {(subtitle.props?.text as string) || 'Join thousands who already trust us.'}
          </p>
        )}
        {button?.enabled && (
          <a
            href={(button.props?.url as string) || '#'}
            className="inline-flex items-center justify-center mt-4 px-10 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all hover:opacity-90"
            style={{ background: section.style.background || '#fff', color: section.style.color || '#111' }}
          >
            {(button.props?.text as string) || 'Get Started Free'}
          </a>
        )}
      </div>
    </section>
  )
}
