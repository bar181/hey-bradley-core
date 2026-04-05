import { useState } from 'react'
import type { Section } from '@/lib/schemas'
import { getStr, getImageEffectClass } from '@/lib/sectionContent'
import { LightboxModal } from '@/components/ui/LightboxModal'

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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const effectClass = getImageEffectClass(section)
  const isClickEnlarge = section.style?.imageEffect === 'click-enlarge'
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
      {getStr(section, 'heading') && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: section.style.color ? `color-mix(in srgb, ${section.style.color} 60%, transparent)` : '#6366f1' }} />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {getStr(section, 'heading')}
          </h2>
          {getStr(section, 'subheading') && (
            <p className="text-lg mt-3 opacity-70">
              {getStr(section, 'subheading')}
            </p>
          )}
        </div>
      )}
      <div className="mx-auto max-w-6xl space-y-6">
        {images.map((img, idx) => (
          <div key={img.id} className={`group relative overflow-hidden rounded-xl opacity-0 animate-card-reveal ${effectClass}`} style={{ animationDelay: `${idx * 100}ms` }}>
            <img
              src={img.url}
              alt={img.caption || 'Gallery image'}
              className={`w-full aspect-[21/9] object-cover transition-transform duration-500 group-hover:scale-[1.02]${isClickEnlarge ? ' cursor-pointer' : ''}`}
              onClick={isClickEnlarge ? () => setLightboxSrc(img.url) : undefined}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-base text-white font-medium">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {lightboxSrc && (
        <LightboxModal src={lightboxSrc} isOpen onClose={() => setLightboxSrc(null)} />
      )}
    </section>
  )
}
