import { cn } from '@/lib/cn'

interface SegmentedControlProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex bg-hb-surface rounded-lg p-0.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors',
            option === value
              ? 'bg-hb-accent text-white font-medium'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
