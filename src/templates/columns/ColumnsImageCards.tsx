import type { Section } from '@/lib/schemas'

const GRID_CLASSES: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
]

const DEFAULT_TITLES = ['Lightning Fast', 'Pixel Perfect', 'Always Secure']
const DEFAULT_DESCRIPTIONS = [
  'Go from idea to deployed in 60 seconds',
  'Every detail polished and professional',
  'Enterprise-grade security built in',
]

export function ColumnsImageCards({ section }: { section: Section }) {
  const cols = (section.layout as any).columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className={`mx-auto max-w-6xl grid grid-cols-1 gap-7 ${GRID_CLASSES[cols] ?? 'md:grid-cols-3'}`}>
        {items.map((item, idx) => {
          const imageUrl = (item.props?.imageUrl as string) || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length]

          return (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl group"
              style={{
                background: 'var(--theme-bg-secondary, rgba(255,255,255,0.03))',
                border: '1px solid var(--theme-border, rgba(128,128,128,0.15))',
              }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={imageUrl}
                  alt={(item.props?.title as string) || 'Lightning Fast'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold mb-2 tracking-tight">
                  {(item.props?.title as string) || DEFAULT_TITLES[idx % DEFAULT_TITLES.length]}
                </h3>
                <p className="text-sm opacity-60 leading-relaxed">
                  {(item.props?.description as string) || DEFAULT_DESCRIPTIONS[idx % DEFAULT_DESCRIPTIONS.length]}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
