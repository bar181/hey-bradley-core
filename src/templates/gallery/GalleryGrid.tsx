import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  GalleryGrid — Equal-size image grid (3 cols default)                   */
/* --------------------------------------------------------------------- */

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&q=80',
]

export function GalleryGrid({ section }: { section: Section }) {
  const cols = section.layout.columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  // Use components if available, otherwise show defaults
  const images = items.length > 0
    ? items.map((item, i) => ({
        id: item.id,
        url: (item.props?.imageUrl as string) || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
        caption: (item.props?.caption as string) || '',
      }))
    : DEFAULT_IMAGES.map((url, i) => ({ id: `default-${i}`, url, caption: '' }))

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
      <div className={`mx-auto max-w-6xl grid grid-cols-1 ${gridClass} gap-4`}>
        {images.map((img, idx) => (
          <div key={img.id} className="group relative overflow-hidden rounded-2xl aspect-square shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-card-reveal" style={{ animationDelay: `${idx * 100}ms` }}>
            <img
              src={img.url}
              alt={img.caption || 'Gallery image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm text-white">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
