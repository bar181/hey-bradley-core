import type { Section } from '@/lib/schemas'

const DEFAULT_LOGOS = [
  { id: 'l1', name: 'Acme Corp', imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=120&h=60&auto=format&q=80' },
  { id: 'l2', name: 'Globex Inc', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=120&h=60&auto=format&q=80' },
  { id: 'l3', name: 'Initech', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=120&h=60&auto=format&q=80' },
  { id: 'l4', name: 'Umbrella Co', imageUrl: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=120&h=60&auto=format&q=80' },
  { id: 'l5', name: 'Stark Industries', imageUrl: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=120&h=60&auto=format&q=80' },
  { id: 'l6', name: 'Wayne Enterprises', imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=120&h=60&auto=format&q=80' },
]

export function LogosMarquee({ section }: { section: Section }) {
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

  // Double the logos for seamless loop
  const doubled = [...logos, ...logos]

  return (
    <section
      className="py-12 px-0 overflow-hidden"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <style>{`
        @keyframes hb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="mx-auto max-w-6xl overflow-hidden">
        <div
          className="flex items-center gap-12 whitespace-nowrap"
          style={{ animation: 'hb-marquee 30s linear infinite', width: 'max-content' }}
        >
          {doubled.map((logo, idx) => (
            <div
              key={`${logo.id}-${idx}`}
              className="flex items-center justify-center w-28 h-14 md:w-36 md:h-16 shrink-0"
            >
              <img
                src={logo.imageUrl}
                alt={logo.name}
                className="max-w-full max-h-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
