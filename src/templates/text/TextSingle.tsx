import type { Section } from '@/lib/schemas'

export function TextSingle({ section }: { section: Section }) {
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) || 'About Us'
  const body = (comp?.props?.body as string) || 'Share your story here. This is a single-column text block perfect for long-form content, blog posts, or about pages. Write something meaningful that connects with your audience.'

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        <div className="text-lg leading-relaxed opacity-80 whitespace-pre-line">{body}</div>
      </div>
    </section>
  )
}
