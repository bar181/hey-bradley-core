import type { Section } from '@/lib/schemas'
import { getImageEffectClass } from '@/lib/sectionContent'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&q=80'

export function ImageParallax({ section }: { section: Section }) {
  const effectClass = getImageEffectClass(section)
  const comp = section.components.find((c) => c.id === 'image')
  const imageUrl = (comp?.props?.imageUrl as string) || DEFAULT_IMAGE
  const heading = (comp?.props?.heading as string) || ''
  const description = (comp?.props?.description as string) || ''

  return (
    <section
      className={`relative h-[400px] flex items-center justify-center ${effectClass}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        fontFamily: 'var(--theme-font)',
      }}
    >
      {(heading || description) && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      {(heading || description) && (
        <div className="relative z-10 text-center text-white max-w-2xl px-6 space-y-4">
          {heading && <h2 className="text-4xl font-bold">{heading}</h2>}
          {description && <p className="text-lg opacity-90">{description}</p>}
        </div>
      )}
    </section>
  )
}
