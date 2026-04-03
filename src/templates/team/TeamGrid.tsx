import type { Section } from '@/lib/schemas'

const DEFAULT_MEMBERS = [
  { id: 't1', name: 'Sarah Chen', role: 'CEO & Co-founder', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&q=80' },
  { id: 't2', name: 'Marcus Rivera', role: 'CTO', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&q=80' },
  { id: 't3', name: 'Aisha Patel', role: 'Head of Design', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&q=80' },
]

export function TeamGrid({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  const members = items.length > 0
    ? items.map((item, i) => ({
        id: item.id,
        name: (item.props?.name as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].name,
        role: (item.props?.role as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].role,
        imageUrl: (item.props?.imageUrl as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].imageUrl,
      }))
    : DEFAULT_MEMBERS

  const gridClass =
    cols === 2 ? 'md:grid-cols-2'
    : cols === 4 ? 'md:grid-cols-4'
    : 'md:grid-cols-3'

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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-4`}>
        {members.map((member) => (
          <div key={member.id} className="group relative overflow-hidden rounded-lg aspect-[3/4]">
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-white/70">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
