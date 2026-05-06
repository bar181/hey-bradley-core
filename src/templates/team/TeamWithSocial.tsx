import type { Section } from '@/lib/schemas'
import { getStr } from '@/lib/sectionContent'
import { ImageFallback } from '@/components/ui/ImageFallback'

/* Inline brand SVGs — lucide-react v1.7.0 omits brand icons; inline keeps deps unchanged. */
const PATHS = {
  linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.339 18.337V9.764H5.67v8.573h2.669zM7.005 8.6a1.547 1.547 0 1 0 0-3.094 1.547 1.547 0 0 0 0 3.094zM18.337 18.337v-4.7c0-2.31-1.235-3.385-2.882-3.385-1.328 0-1.923.731-2.255 1.244V9.764h-2.668c.035.755 0 8.573 0 8.573h2.668v-4.787c0-.24.017-.48.088-.652.193-.479.633-.975 1.371-.975.967 0 1.354.737 1.354 1.817v4.597h2.324z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
} as const

const LABELS = { linkedin: 'LinkedIn', twitter: 'Twitter', github: 'GitHub' } as const
type SocialKey = keyof typeof PATHS

interface SocialLinks { linkedin?: string; twitter?: string; github?: string }

const DEFAULT_MEMBERS: Array<{ id: string; name: string; role: string; imageUrl: string; social: SocialLinks }> = [
  { id: 't1', name: 'Sarah Chen', role: 'CEO & Co-founder', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&q=80', social: { linkedin: 'https://linkedin.com/in/sarahchen', twitter: 'https://twitter.com/sarahchen', github: 'https://github.com/sarahchen' } },
  { id: 't2', name: 'Marcus Rivera', role: 'CTO', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&q=80', social: { linkedin: 'https://linkedin.com/in/marcusrivera', github: 'https://github.com/marcusrivera' } },
  { id: 't3', name: 'Aisha Patel', role: 'Head of Design', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&q=80', social: { linkedin: 'https://linkedin.com/in/aishapatel', twitter: 'https://twitter.com/aishapatel' } },
]

export function TeamWithSocial({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 3
  const items = section.components.filter((c) => c.enabled).sort((a, b) => a.order - b.order)

  const members = items.length > 0
    ? items.map((item, i) => {
        const fb = DEFAULT_MEMBERS[i % DEFAULT_MEMBERS.length]
        const rawSocial = (item.props as Record<string, unknown> | undefined)?.social as SocialLinks | undefined
        return {
          id: item.id,
          name: (item.props?.name as string) || fb.name,
          role: (item.props?.role as string) || fb.role,
          imageUrl: (item.props?.imageUrl as string) || fb.imageUrl,
          social: rawSocial && typeof rawSocial === 'object' ? rawSocial : undefined,
        }
      })
    : DEFAULT_MEMBERS

  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}>
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{getStr(section, 'heading')}</h2>
          {getStr(section, 'subheading') && <p className="text-lg mt-3 opacity-70">{getStr(section, 'subheading')}</p>}
        </div>
      )}

      <div className={`mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 ${gridClass} gap-6`}>
        {members.map((member, idx) => {
          const socialKeys = (Object.keys(PATHS) as SocialKey[]).filter((k) => member.social?.[k])
          return (
            <div
              key={member.id}
              className="flex flex-col items-center text-center rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal"
              style={{ animationDelay: `${idx * 100}ms`, background: `color-mix(in srgb, ${section.style.color} 3%, transparent)`, border: `1px solid color-mix(in srgb, ${section.style.color} 10%, transparent)` }}
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 ring-2 ring-current/10">
                <img src={member.imageUrl} alt={member.name} width={112} height={112} loading="lazy" className="w-full h-full object-cover"
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
              {socialKeys.length > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  {socialKeys.map((key) => (
                    <a key={key} href={member.social![key]!} aria-label={`${LABELS[key]} profile of ${member.name}`} target="_blank" rel="noopener noreferrer"
                      className="opacity-60 hover:opacity-100 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] rounded">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false"><path d={PATHS[key]} /></svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
