import type { Section } from '@/lib/schemas'

const GRID_CLASSES: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

export function ColumnsNumbered({ section }: { section: Section }) {
  const cols = (section.layout as any).columns ?? 3
  const items = section.components
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <section
      className="py-20 px-6"
      style={{ background: section.style.background, color: section.style.color, fontFamily: 'var(--theme-font)' }}
    >
      <div className={`mx-auto max-w-6xl grid grid-cols-1 gap-10 ${GRID_CLASSES[cols] ?? 'md:grid-cols-3'}`}>
        {items.map((item, idx) => (
          <div key={item.id} className="space-y-4">
            <span
              className="text-5xl font-bold block tracking-tighter"
              style={{ color: 'var(--theme-accent, #6366f1)', opacity: 0.8 }}
            >
              {String(idx + 1).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-semibold tracking-tight">
              {(item.props?.title as string) || 'Feature'}
            </h3>
            <p className="text-sm opacity-55 leading-relaxed">
              {(item.props?.description as string) || 'Description'}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
