import type { Section } from '@/lib/schemas'

const DEFAULT_LOGOS = [
  { id: 'l1', name: 'Acme Corp', imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=120&h=60&auto=format&q=80' },
  { id: 'l2', name: 'Globex Inc', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=120&h=60&auto=format&q=80' },
  { id: 'l3', name: 'Initech', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=120&h=60&auto=format&q=80' },
  { id: 'l4', name: 'Umbrella Co', imageUrl: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=120&h=60&auto=format&q=80' },
  { id: 'l5', name: 'Stark Industries', imageUrl: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=120&h=60&auto=format&q=80' },
  { id: 'l6', name: 'Wayne Enterprises', imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=120&h=60&auto=format&q=80' },
]

export function LogosSimple({ section }: { section: Section }) {
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

  return (
    <section
      className="py-10 md:py-16 px-6"
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
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="group flex items-center justify-center w-24 h-12 md:w-32 md:h-16 transition-all"
            >
              <img
                src={logo.imageUrl}
                alt={logo.name}
                className="max-w-full max-h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
