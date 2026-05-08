import type { Section } from '@/lib/schemas'

// P115 / A2 — newsroom SOTA: 17px body / 1.7 line-height / mb-6 spacing.
export function TextTwoColumn({ section }: { section: Section }) {
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) || 'Our Approach'
  const body =
    (comp?.props?.body as string) ||
    'We believe in building products that make a difference. Our approach combines deep research with hands-on experimentation to deliver results that matter.\n\nEvery project starts with understanding the problem space. We work closely with stakeholders to define clear goals and measurable outcomes that drive the work forward.'

  const paragraphs = body.split(/\n\n+|\n(?=\S)/).map((p) => p.trim()).filter(Boolean)
  const mid = Math.ceil(paragraphs.length / 2)
  const col1 = paragraphs.slice(0, mid)
  const col2 = paragraphs.slice(mid)

  const renderCol = (paras: string[], offset = 0) => (
    <div>
      {paras.map((p, i) => (
        <p
          key={i}
          className={
            i === 0 && offset === 0
              ? 'text-[17px] md:text-lg leading-[1.7] opacity-90 mb-6'
              : 'text-[17px] leading-[1.7] opacity-80 mb-6 last:mb-0'
          }
        >
          {p}
        </p>
      ))}
    </div>
  )

  return (
    <section
      className="py-16 md:py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">{heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {renderCol(col1)}
          {renderCol(col2.length > 0 ? col2 : col1, 1)}
        </div>
      </div>
    </section>
  )
}
