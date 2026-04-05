import { useState } from 'react'
import type { Section } from '@/lib/schemas'
import { getImageEffectClass } from '@/lib/sectionContent'
import { LightboxModal } from '@/components/ui/LightboxModal'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&q=80'

export function ImageOverlay({ section }: { section: Section }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const effectClass = getImageEffectClass(section)
  const isClickEnlarge = section.style?.imageEffect === 'click-enlarge'
  const comp = section.components.find((c) => c.id === 'image')
  const imageUrl = (comp?.props?.imageUrl as string) || DEFAULT_IMAGE
  const heading = (comp?.props?.heading as string) || 'Make an Impact'
  const description = (comp?.props?.description as string) || 'A powerful image with overlay text that captures attention.'

  return (
    <section
      className="relative"
      style={{ fontFamily: 'var(--theme-font)' }}
    >
      <div className={`overflow-hidden ${effectClass}`}>
        <img
          src={imageUrl}
          alt={heading}
          className={`w-full h-[450px] object-cover${isClickEnlarge ? ' cursor-pointer' : ''}`}
          onClick={isClickEnlarge ? () => setLightboxSrc(imageUrl) : undefined}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white max-w-2xl px-6 space-y-4">
          <h2 className="text-4xl font-bold">{heading}</h2>
          <p className="text-lg opacity-90 leading-relaxed">{description}</p>
        </div>
      </div>
      {lightboxSrc && (
        <LightboxModal src={lightboxSrc} alt={heading} isOpen onClose={() => setLightboxSrc(null)} />
      )}
    </section>
  )
}
