import { useState } from 'react'
import type { Section } from '@/lib/schemas'
import { getImageEffectClass } from '@/lib/sectionContent'
import { LightboxModal } from '@/components/ui/LightboxModal'
import { ImageFallback } from '@/components/ui/ImageFallback'
import { useImageError } from '@/hooks/useImageError'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&q=80'

export function ImageWithText({ section }: { section: Section }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const { errored, onError: onImgError } = useImageError()
  const effectClass = getImageEffectClass(section)
  const isClickEnlarge = section.style?.imageEffect === 'click-enlarge'
  const comp = section.components.find((c) => c.id === 'image')
  const imageUrl = (comp?.props?.imageUrl as string) || DEFAULT_IMAGE
  const heading = (comp?.props?.heading as string) || 'Your Story'
  const description = (comp?.props?.description as string) || 'Tell your audience what makes you unique. Share your vision and connect on a deeper level.'

  return (
    <section
      className="py-16 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={`group overflow-hidden rounded-lg ${effectClass}`}>
          {errored ? (
            <div className="w-full h-[350px]"><ImageFallback label={heading} /></div>
          ) : (
            <img
              src={imageUrl}
              alt={heading}
              loading="lazy"
              className={`w-full h-[350px] object-cover transition-transform duration-200 ease-out hover:scale-105${isClickEnlarge ? ' cursor-pointer' : ''}`}
              onClick={() => setLightboxSrc(imageUrl)}
              onError={onImgError}
            />
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{heading}</h2>
          <p className="text-lg opacity-70 leading-relaxed">{description}</p>
        </div>
      </div>
      {lightboxSrc && (
        <LightboxModal src={lightboxSrc} alt={heading} isOpen onClose={() => setLightboxSrc(null)} />
      )}
    </section>
  )
}
