import type { Section } from '@/lib/schemas'

// P115 / A2 — Linear blog SOTA: 17px body / 1.7 line-height / 68ch column,
// sidebar as italic pull-quote-style callout.
export function TextWithSidebar({ section }: { section: Section }) {
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) || 'In Depth'
  const body =
    (comp?.props?.body as string) ||
    'This is the main content area. Use it for detailed articles, case studies, or long-form storytelling. The sidebar provides supplementary context without distracting from the main narrative.'
  const sidebar =
    (comp?.props?.sidebar as string) ||
    'Quick Facts\n\nFounded: 2024\nTeam: 12 people\nMission: Build better tools'

  const paragraphs = body.split(/\n\n+|\n(?=\S)/).map((p) => p.trim()).filter(Boolean)

  return (
    <section
      className="py-16 md:py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">{heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,68ch)_280px] gap-10 md:gap-14">
          <div>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-[17px] md:text-lg leading-[1.7] opacity-90 mb-6'
                    : 'text-[17px] leading-[1.7] opacity-80 mb-6 last:mb-0'
                }
              >
                {p}
              </p>
            ))}
          </div>
          <aside className="text-[15px] leading-[1.7] opacity-75 whitespace-pre-line border-l-2 border-current/15 pl-6 py-1 italic">
            {sidebar}
          </aside>
        </div>
      </div>
    </section>
  )
}
