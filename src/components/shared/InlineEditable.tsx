import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { updateComponentProps } from '@/lib/componentHelpers'
import type { Section } from '@/lib/schemas'

// P116 / B3 — F1 inline edit on hero headline + subhead. Double-click → contentEditable;
// Enter/blur commits via onCommit; Escape reverts. Scope: hero only this sprint.
// Shared commit helpers for HeroSplit + HeroCentered (components[id='headline'|'subtitle']).
export function useHeroInlineCommit(section: Section) {
  const setSectionConfig = useConfigStore((s) => s.setSectionConfig)
  const write = (id: string, text: string) =>
    setSectionConfig(section.id, { components: updateComponentProps(section, id, { text }) })
  return { commitHeadline: (t: string) => write('headline', t), commitSubhead: (t: string) => write('subtitle', t) }
}

interface InlineEditableProps {
  as?: ElementType
  value: string
  onCommit: (text: string) => void
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  testid?: string
  children?: ReactNode
}

export function InlineEditable({
  as: Tag = 'span', value, onCommit, className, style, ariaLabel, testid, children,
}: InlineEditableProps) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const originalRef = useRef<string>(value)

  useEffect(() => {
    if (!editing || !ref.current) return
    ref.current.focus()
    const sel = window.getSelection()
    if (!sel || !ref.current.firstChild) return
    const range = document.createRange()
    range.selectNodeContents(ref.current); range.collapse(false); sel.removeAllRanges(); sel.addRange(range)
  }, [editing])

  const commit = () => {
    if (!ref.current) { setEditing(false); return }
    const next = ref.current.innerText.trim()
    setEditing(false)
    if (next !== originalRef.current && next.length > 0) onCommit(next)
    else ref.current.innerText = originalRef.current
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() }
    else if (e.key === 'Escape') {
      e.preventDefault()
      if (ref.current) ref.current.innerText = originalRef.current
      setEditing(false)
    }
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      onDoubleClick={() => { originalRef.current = value; setEditing(true) }}
      onBlur={editing ? commit : undefined}
      onKeyDown={editing ? onKeyDown : undefined}
      contentEditable={editing}
      suppressContentEditableWarning
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="true"
      data-testid={testid}
      data-inline-editing={editing ? 'true' : 'false'}
      title={editing ? 'Press Enter to save, Esc to cancel' : 'Double-click to edit'}
      className={cn('cursor-text outline-none', editing && 'ring-2 ring-[var(--hb-accent)] rounded px-0.5 -mx-0.5 bg-[var(--hb-accent)]/5', className)}
      style={style}
    >{children ?? value}</Tag>
  )
}
