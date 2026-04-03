import type { Section } from '@/lib/schemas'

export function TextTwoColumn({ section }: { section: Section }) {
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) || 'Our Approach'
  const body = (comp?.props?.body as string) || 'We believe in building products that make a difference. Our approach combines deep research with hands-on experimentation to deliver results that matter.\n\nEvery project starts with understanding the problem space. We work closely with stakeholders to define clear goals and measurable outcomes that drive the work forward.'

  const paragraphs = body.split('\n').filter((p) => p.trim())
  const mid = Math.ceil(paragraphs.length / 2)
  const col1 = paragraphs.slice(0, mid).join('\n\n')
  const col2 = paragraphs.slice(mid).join('\n\n')

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-base leading-relaxed opacity-80 whitespace-pre-line">{col1}</div>
          <div className="text-base leading-relaxed opacity-80 whitespace-pre-line">{col2 || col1}</div>
        </div>
      </div>
    </section>
  )
}
