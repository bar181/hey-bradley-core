import type { Section } from '@/lib/schemas'

const DEFAULT_MEMBERS = [
  { id: 't1', name: 'Sarah Chen', role: 'CEO & Co-founder', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&q=80', description: 'Former VP of Engineering at Scale AI. Stanford CS graduate.' },
  { id: 't2', name: 'Marcus Rivera', role: 'CTO', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&q=80', description: 'Ex-Google Staff Engineer. Built distributed systems at scale.' },
  { id: 't3', name: 'Aisha Patel', role: 'Head of Design', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&q=80', description: 'Previously led design at Figma. Passionate about user experience.' },
]

export function TeamCards({ section }: { section: Section }) {
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
        description: (item.props?.description as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].description,
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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-8`}>
        {members.map((member, idx) => (
          <div key={member.id} className="flex flex-col items-center text-center rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal"
            style={{
              animationDelay: `${idx * 100}ms`,
              background: `color-mix(in srgb, ${section.style.color} 3%, transparent)`,
              border: `1px solid color-mix(in srgb, ${section.style.color} 10%, transparent)`,
            }}>
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-2 ring-current/10">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm opacity-60 mt-1">{member.role}</p>
            {member.description && (
              <p className="text-sm opacity-50 mt-2 max-w-xs">{member.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
