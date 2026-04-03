import type { Section } from '@/lib/schemas'

export function TextWithSidebar({ section }: { section: Section }) {
  const comp = section.components.find((c) => c.id === 'content')
  const heading = (comp?.props?.heading as string) || 'In Depth'
  const body = (comp?.props?.body as string) || 'This is the main content area. Use it for detailed articles, case studies, or long-form storytelling. The sidebar provides supplementary context without distracting from the main narrative.'
  const sidebar = (comp?.props?.sidebar as string) || 'Quick Facts\n\nFounded: 2024\nTeam: 12 people\nMission: Build better tools'

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10">
          <div className="text-base leading-relaxed opacity-80 whitespace-pre-line">{body}</div>
          <aside className="text-sm opacity-60 whitespace-pre-line border-l border-current/10 pl-6">
            {sidebar}
          </aside>
        </div>
      </div>
    </section>
  )
}
