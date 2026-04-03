import type { Section } from '@/lib/schemas'

export function QuestionsNumbered({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-3xl space-y-8">
        {items.map((item, i) => {
          const question = (item.props?.question as string) || 'Question'
          const answer = (item.props?.answer as string) || ''

          return (
            <div key={item.id} className="flex gap-5 items-start">
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
