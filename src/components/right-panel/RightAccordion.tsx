import { type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useUIStore } from '@/store/uiStore'

interface RightAccordionProps {
  id: string
  label: string
  children: ReactNode
  defaultOpen?: boolean
}

export function RightAccordion({ id, label, children, defaultOpen = false }: RightAccordionProps) {
  const accordionState = useUIStore((s) => s.rightAccordions[id])
  const toggleRightAccordion = useUIStore((s) => s.toggleRightAccordion)

  const isOpen = accordionState === undefined ? defaultOpen : accordionState

  return (
    <div className="border-b border-hb-border mb-1">
      <button
        type="button"
        onClick={() => toggleRightAccordion(id)}
        className={cn(
          'flex justify-between items-center w-full py-2.5 cursor-pointer',
          'transition-colors hover:bg-hb-surface-hover rounded-md px-1'
        )}
      >
        <span className="font-mono text-xs uppercase tracking-[0.05em] text-hb-text-muted font-medium">
          {label}
        </span>
        {isOpen ? (
          <ChevronDown size={14} className="text-hb-text-muted" />
        ) : (
          <ChevronRight size={14} className="text-hb-text-muted" />
        )}
      </button>
      {isOpen && <div className="py-2">{children}</div>}
    </div>
  )
}
