import type { Section } from '@/lib/schemas'

export function ActionNewsletter({ section }: { section: Section }) {
  const heading = section.components.find((c) => c.id === 'heading')
  const subtitle = section.components.find((c) => c.id === 'subtitle')
  const button = section.components.find((c) => c.id === 'button')

  return (
    <section
      className="py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {heading?.enabled && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {(heading.props?.text as string) || 'Stay in the loop'}
          </h2>
        )}
        {subtitle?.enabled && (
          <p className="text-base opacity-60 mb-8 max-w-lg mx-auto leading-relaxed">
            {(subtitle.props?.text as string) || 'Get the latest updates delivered to your inbox.'}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
            style={{
              background: 'var(--theme-surface, rgba(255,255,255,0.05))',
              borderColor: 'var(--theme-border, rgba(255,255,255,0.1))',
              color: 'inherit',
            }}
          />
          {button?.enabled && (
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 shrink-0"
              style={{ background: 'var(--theme-accent, #6366f1)', color: '#fff' }}
            >
              {(button.props?.text as string) || 'Subscribe'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
