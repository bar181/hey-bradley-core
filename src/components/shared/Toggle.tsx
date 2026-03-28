import { cn } from '@/lib/cn'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  size?: 'sm' | 'md'
}

export function Toggle({ enabled, onChange, size = 'md' }: ToggleProps) {
  const dims = size === 'sm' ? 'w-8 h-4' : 'w-9 h-5'
  const dotDims = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-4'

  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        dims,
        'relative rounded-full transition-colors duration-200 flex-shrink-0',
        enabled ? 'bg-hb-accent' : 'bg-hb-surface-hover'
      )}
    >
      <span
        className={cn(
          dotDims,
          'absolute top-0.5 left-0.5 rounded-full bg-white transition-transform duration-200',
          enabled && translate
        )}
      />
    </button>
  )
}
