import type { Section } from '@/lib/schemas'

/* --------------------------------------------------------------------- */
/*  GalleryFullWidth — One large image per row, full width                */
/* --------------------------------------------------------------------- */

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&auto=format&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&q=80',
]

export function GalleryFullWidth({ section }: { section: Section }) {
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
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {images.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-xl">
            <img
              src={img.url}
              alt={img.caption || 'Gallery image'}
              className="w-full aspect-[21/9] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-base text-white font-medium">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
