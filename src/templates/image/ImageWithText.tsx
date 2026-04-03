import type { Section } from '@/lib/schemas'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&q=80'

export function ImageWithText({ section }: { section: Section }) {
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
        <div className="overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={heading}
            className="w-full h-[350px] object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{heading}</h2>
          <p className="text-lg opacity-70 leading-relaxed">{description}</p>
        </div>
      </div>
    </section>
  )
}
