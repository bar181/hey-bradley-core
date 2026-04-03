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
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-baseline justify-between py-3 border-b border-current/10"
          >
            <span className="text-base font-medium">{member.name}</span>
            <span className="text-sm opacity-50">{member.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
