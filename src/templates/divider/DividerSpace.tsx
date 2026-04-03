import type { Section } from '@/lib/schemas'

const SIZE_MAP: Record<string, string> = {
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-16',
  xl: 'py-24',
}

export function DividerSpace({ section }: { section: Section }) {
  const size = (section.layout as Record<string, unknown>).size as string || 'md'
  const paddingClass = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <div
      className={paddingClass}
      style={{ background: section.style.background }}
    />
  )
}
