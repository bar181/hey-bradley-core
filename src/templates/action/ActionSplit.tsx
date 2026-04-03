import type { Section } from '@/lib/schemas'

export function ActionSplit({ section }: { section: Section }) {
  const heading = section.components.find((c) => c.id === 'heading')
  const subtitle = section.components.find((c) => c.id === 'subtitle')
  const button = section.components.find((c) => c.id === 'button')

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Text side */}
        <div className="flex-1">
          {heading?.enabled && (
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {(heading.props?.text as string) || 'Ready to get started?'}
            </h2>
          )}
          {subtitle?.enabled && (
            <p className="mt-4 text-lg opacity-60 leading-relaxed max-w-lg">
              {(subtitle.props?.text as string) || 'Start building your next project today.'}
            </p>
          )}
          {button?.enabled && (
            <a
              href={(button.props?.url as string) || '#'}
              className="inline-flex items-center mt-6 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'var(--theme-accent, #6366f1)', color: '#fff' }}
            >
              {(button.props?.text as string) || 'Get Started'}
            </a>
          )}
        </div>

        {/* Visual side */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-full max-w-sm aspect-square rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent, #6366f1) 13%, transparent), color-mix(in srgb, var(--theme-accent, #6366f1) 5%, transparent))',
              border: `1px solid color-mix(in srgb, ${section.style.color} 8%, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  )
}
