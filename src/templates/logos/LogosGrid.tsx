import type { Section } from '@/lib/schemas'

const DEFAULT_LOGOS = [
  { id: 'l1', name: 'Acme Corp', imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=120&h=60&auto=format&q=80' },
  { id: 'l2', name: 'Globex Inc', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=120&h=60&auto=format&q=80' },
  { id: 'l3', name: 'Initech', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=120&h=60&auto=format&q=80' },
  { id: 'l4', name: 'Umbrella Co', imageUrl: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=120&h=60&auto=format&q=80' },
  { id: 'l5', name: 'Stark Industries', imageUrl: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=120&h=60&auto=format&q=80' },
  { id: 'l6', name: 'Wayne Enterprises', imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=120&h=60&auto=format&q=80' },
]

export function LogosGrid({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  const logos = items.length > 0
    ? items.map((item, i) => ({
        id: item.id,
        name: (item.props?.name as string) || DEFAULT_LOGOS[i % DEFAULT_LOGOS.length].name,
        imageUrl: (item.props?.imageUrl as string) || DEFAULT_LOGOS[i % DEFAULT_LOGOS.length].imageUrl,
      }))
    : DEFAULT_LOGOS

  const gridClass =
    cols === 2 ? 'grid-cols-2'
    : cols === 4 ? 'grid-cols-2 md:grid-cols-4'
    : 'grid-cols-2 md:grid-cols-3'

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className={`mx-auto max-w-4xl grid ${gridClass} gap-6`}>
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="group flex items-center justify-center p-6 rounded-lg border border-current/5 hover:border-current/15 transition-all"
          >
            <img
              src={logo.imageUrl}
              alt={logo.name}
              className="max-w-full max-h-12 object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
