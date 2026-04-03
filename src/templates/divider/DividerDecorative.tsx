import type { Section } from '@/lib/schemas'

export function DividerDecorative({ section }: { section: Section }) {
  const color = section.style.color || 'currentColor'

  return (
    <div
      className="py-8 px-6 flex items-center justify-center"
      style={{ background: section.style.background }}
    >
      <div className="flex items-center gap-3 opacity-30">
        <div className="w-12 h-px" style={{ background: color }} />
        <svg width="8" height="8" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill={color} />
        </svg>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill={color} />
        </svg>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill={color} />
        </svg>
        <div className="w-12 h-px" style={{ background: color }} />
      </div>
    </div>
  )
}
