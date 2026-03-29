import type { Section } from '@/lib/schemas'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

/* --------------------------------------------------------------------- */
/*  FAQAccordion — vertical accordion list of Q&A pairs                   */
/* --------------------------------------------------------------------- */

export function FAQAccordion({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color }}
    >
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
