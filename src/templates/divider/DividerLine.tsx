import type { Section } from '@/lib/schemas'

export function DividerLine({ section }: { section: Section }) {
  const lineColor = section.style.color || 'currentColor'

  return (
    <div
      className="py-4 px-6"
      style={{ background: section.style.background }}
    >
      <hr
        className="mx-auto max-w-6xl border-0"
        style={{ borderTop: `1px solid ${lineColor}`, opacity: 0.2 }}
      />
    </div>
  )
}
