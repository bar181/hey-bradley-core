import type { Section } from '@/lib/schemas'
import { useConfigStore } from '@/store/configStore'
import { resolveColors } from '@/lib/resolveColors'

export function CTASimple({ section }: { section: Section }) {
  const theme = useConfigStore((s) => s.config.theme)
  const colors = resolveColors(theme)

  const heading = section.components.find((c) => c.id === 'heading')
  const subtitle = section.components.find((c) => c.id === 'subtitle')
  const button = section.components.find((c) => c.id === 'button')

  return (
    <section
      className="py-20 px-6 text-center"
      style={{ background: section.style.background, color: section.style.color }}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
        {heading?.enabled && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {(heading.props?.text as string) || 'Ready to get started?'}
          </h2>
        )}
        {subtitle?.enabled && (
          <p className="text-lg opacity-70">
            {(subtitle.props?.text as string) || ''}
          </p>
        )}
        {button?.enabled && (
          <a
            href={(button.props?.url as string) || '#'}
            className="mt-4 px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{
              backgroundColor: colors.accentPrimary,
              color: colors.bgPrimary,
            }}
          >
            {(button.props?.text as string) || 'Get Started'}
          </a>
        )}
      </div>
    </section>
  )
}
