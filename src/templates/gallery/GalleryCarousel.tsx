import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  GalleryCarousel — Horizontal scroll with overflow-x-auto, snap scroll */
/* --------------------------------------------------------------------- */

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&q=80',
]

export function GalleryCarousel({ section }: { section: Section }) {
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
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative flex-none w-72 md:w-96 snap-center overflow-hidden rounded-lg"
            >
              <img
                src={img.url}
                alt={img.caption || 'Gallery image'}
                className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm text-white">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
