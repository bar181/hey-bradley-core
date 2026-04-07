import { useId } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const positionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
}

const arrowClasses: Record<string, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-zinc-900 border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-900 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-900 border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-zinc-900 border-y-transparent border-l-transparent',
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const id = useId()

  return (
    <span className="relative inline-flex group">
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute z-50 px-2 py-1 text-[11px] font-medium text-white bg-zinc-900 rounded shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
      >
        {content}
        <span className={`absolute border-4 ${arrowClasses[position]}`} />
      </span>
    </span>
  )
}
