/**
 * P28 C04 — SliderRow extracted from ListenTab.
 * Keeps the design parity with the original inline component.
 */

export interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix: string
  leftHint?: string
  rightHint?: string
  onChange: (v: number) => void
  disabled?: boolean
}

export function SliderRow({ label, value, min, max, step, suffix, leftHint, rightHint, onChange, disabled }: SliderRowProps) {
  return (
    <div className={`flex items-center gap-2 ${disabled ? 'opacity-40' : ''}`}>
      <span className="text-xs text-white/40 w-10 shrink-0">{leftHint || label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A51C30]"
        aria-label={label}
      />
      <span className="text-xs text-white/40 w-14 text-right shrink-0">{rightHint || `${value}${suffix}`}</span>
    </div>
  )
}
