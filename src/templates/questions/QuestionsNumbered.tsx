import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'

export function QuestionsNumbered({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">
              {getStr(section, 'subheading')}
            </p>
          )}
        </div>
      )}
      <div className="mx-auto max-w-3xl space-y-8">
        {items.map((item, i) => {
          const question = (item.props?.question as string) || 'Question'
          const answer = (item.props?.answer as string) || ''

          return (
            <div key={item.id} className="flex gap-5 items-start opacity-0 animate-card-reveal" style={{ animationDelay: `${i * 100}ms` }}>
              <span
                className="text-3xl md:text-4xl font-extrabold leading-none shrink-0 tabular-nums"
                style={{ color: 'var(--theme-accent, #6366f1)', opacity: 0.35 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1">
                <h3 className="font-semibold text-base mb-1.5">{question}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
