import type { Section } from '@/lib/schemas'


export function CTASimple({ section }: { section: Section }) {
  const heading = section.components.find((c) => c.id === 'heading')
  const subtitle = section.components.find((c) => c.id === 'subtitle')
  const button = section.components.find((c) => c.id === 'button')

  return (
    <section className="bg-theme-bg text-theme-text py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
        {heading?.enabled && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {(heading.props?.text as string) || 'Ready to get started?'}
          </h2>
        )}
        {subtitle?.enabled && (
          <p className="text-lg text-theme-muted">
            {(subtitle.props?.text as string) || ''}
          </p>
        )}
        {button?.enabled && (
          <a
            href={(button.props?.url as string) || '#'}
            className="inline-flex items-center justify-center mt-4 px-8 py-3 bg-theme-accent text-theme-bg hover:opacity-90 rounded-lg font-semibold text-sm shadow-lg transition-all"
          >
            {(button.props?.text as string) || 'Get Started'}
          </a>
        )}
      </div>
    </section>
  )
}
