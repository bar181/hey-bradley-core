import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  GalleryMasonry — Pinterest-style mixed sizes (alternating tall/short) */
/* --------------------------------------------------------------------- */

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&q=80',
]

export function GalleryMasonry({ section }: { section: Section }) {
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  const images = items.length > 0
    ? items.map((item, i) => ({
        id: item.id,
        url: (item.props?.imageUrl as string) || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
        caption: (item.props?.caption as string) || '',
      }))
    : DEFAULT_IMAGES.map((url, i) => ({ id: `default-${i}`, url, caption: '' }))

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
      <div className="mx-auto max-w-6xl columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="group relative overflow-hidden rounded-lg break-inside-avoid"
          >
            <img
              src={img.url}
              alt={img.caption || 'Gallery image'}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
              }`}
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
