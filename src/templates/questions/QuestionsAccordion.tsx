import type { Section } from '@/lib/schemas'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export function QuestionsAccordion({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {(section.content as any).heading}
          </h2>
          {(section.content as any)?.subheading && (
            <p className="text-lg mt-3 opacity-70">
              {(section.content as any).subheading}
            </p>
          )}
        </div>
      )}
      <div className="mx-auto max-w-3xl">
        <Accordion>
          {items.map((item) => {
            const question = (item.props?.question as string) || 'Question'
            const answer = (item.props?.answer as string) || ''

            return (
              <AccordionItem key={item.id}>
                <AccordionTrigger className="text-left font-semibold">
                  {question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm opacity-80 leading-relaxed">{answer}</p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
