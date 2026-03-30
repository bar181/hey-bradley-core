import type { Section } from '@/lib/schemas'

export function FAQTwoCol({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => {
            const question = (item.props?.question as string) || 'Question'
            const answer = (item.props?.answer as string) || 'Answer'

            return (
              <div key={item.id}>
                <h3 className="font-semibold mb-2">{question}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{answer}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
