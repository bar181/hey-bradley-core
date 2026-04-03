import type { Section } from '@/lib/schemas'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&q=80'

export function ImageFullWidth({ section }: { section: Section }) {
  const imageUrl = (section.components.find((c) => c.id === 'image')?.props?.imageUrl as string) || DEFAULT_IMAGE
  const caption = (section.components.find((c) => c.id === 'image')?.props?.description as string) || ''

  return (
    <section
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="w-full">
        <img
          src={imageUrl}
          alt={caption || 'Full width image'}
          className="w-full h-[400px] object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {caption && (
          <p className="text-sm opacity-60 text-center py-3 px-6">{caption}</p>
        )}
      </div>
    </section>
  )
}
