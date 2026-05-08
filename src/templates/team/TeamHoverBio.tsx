import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import { ImageFallback } from '@/components/ui/ImageFallback'

const DEFAULT_MEMBERS = [
  { id: 't1', name: 'Sarah Chen', role: 'CEO & Co-founder', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&q=80', bio: 'Former VP of Engineering at Scale AI. Stanford CS graduate with 12 years building distributed teams.' },
  { id: 't2', name: 'Marcus Rivera', role: 'CTO', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&q=80', bio: 'Ex-Google Staff Engineer. Co-author of two papers on consensus algorithms in low-bandwidth environments.' },
  { id: 't3', name: 'Aisha Patel', role: 'Head of Design', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&q=80', bio: 'Previously led design at Figma. Believes the best interfaces are the ones you do not notice.' },
]

export function TeamHoverBio({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 3
  const items = section.components.filter((c) => c.enabled).sort((a, b) => a.order - b.order)

  const members = items.length > 0
    ? items.map((item, i) => ({
        id: item.id,
        name: (item.props?.name as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].name,
        role: (item.props?.role as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].role,
        imageUrl: (item.props?.imageUrl as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].imageUrl,
        bio: (item.props?.bio as string) || (item.props?.description as string) || DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length].bio,
      }))
    : DEFAULT_MEMBERS

  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{getStr(section, 'heading')}</h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">{getStr(section, 'subheading')}</p>
          )}
        </div>
      )}

      <div className={`mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6`}>
        {members.map((member, idx) => (
          <div
            key={member.id}
            tabIndex={0}
            className="group relative flex flex-col items-center text-center rounded-2xl p-6 outline-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] opacity-0 animate-card-reveal"
            style={{
              animationDelay: `${idx * 100}ms`,
              background: `color-mix(in srgb, ${section.style.color} 3%, transparent)`,
              border: `1px solid color-mix(in srgb, ${section.style.color} 10%, transparent)`,
            }}
          >
            <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 ring-2 ring-current/10">
              <img
                src={member.imageUrl}
                alt={member.name}
                width={112}
                height={112}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  const sib = el.nextElementSibling as HTMLElement | null
                  if (sib?.dataset.fallback === 'on') sib.style.display = 'flex'
                }}
              />
              <div data-fallback="on" className="absolute inset-0" style={{ display: 'none' }}>
                <ImageFallback label={member.name || 'Member'} />
              </div>
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm opacity-60 mt-1">{member.role}</p>

            {/* Bio reveals on hover (desktop) and focus (a11y) */}
            <p
              className="text-sm leading-relaxed opacity-0 max-h-0 group-hover:opacity-80 group-hover:max-h-40 group-focus-visible:opacity-80 group-focus-visible:max-h-40 transition-all duration-300 mt-0 group-hover:mt-3 group-focus-visible:mt-3 overflow-hidden"
            >
              {member.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
