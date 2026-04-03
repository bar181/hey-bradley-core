import type { Section } from '@/lib/schemas'

export function QuestionsTwoCol({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {(section.content as any)?.heading || 'Common Questions'}
          </h2>
          {(section.content as any)?.subheading && (
            <p className="text-lg mt-3 opacity-70">
              {(section.content as any).subheading}
            </p>
          )}
        </div>
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
