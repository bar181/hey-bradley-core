import type { Section } from '@/lib/schemas'

export function QuestionsCards({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => {
          const question = (item.props?.question as string) || 'Question'
          const answer = (item.props?.answer as string) || ''

          return (
            <div
              key={item.id}
              className="rounded-xl p-6 transition-shadow hover:shadow-lg"
              style={{
                background: 'var(--theme-surface, rgba(255,255,255,0.03))',
                border: '1px solid var(--theme-border, rgba(255,255,255,0.08))',
              }}
            >
              <h3 className="font-semibold text-base mb-2">{question}</h3>
              <p className="text-sm opacity-60 leading-relaxed">{answer}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
