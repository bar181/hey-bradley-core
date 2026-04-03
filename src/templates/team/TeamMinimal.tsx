import type { Section } from '@/lib/schemas'

const DEFAULT_MEMBERS = [
  { id: 't1', name: 'Sarah Chen', role: 'CEO & Co-founder' },
  { id: 't2', name: 'Marcus Rivera', role: 'CTO' },
  { id: 't3', name: 'Aisha Patel', role: 'Head of Design' },
]

export function TeamMinimal({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  const members = items.length > 0
    ? items.map((item, i) => ({
        id: item.id,
        name: (item.props?.name as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].name,
        role: (item.props?.role as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].role,
      }))
    : DEFAULT_MEMBERS

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {/* Section heading */}
      {(section.content as any)?.heading && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
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
      <div className="mx-auto max-w-2xl space-y-4">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="flex items-baseline justify-between py-3 border-b border-current/10 opacity-0 animate-card-reveal"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <span className="text-base font-medium">{member.name}</span>
            <span className="text-sm opacity-50">{member.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
