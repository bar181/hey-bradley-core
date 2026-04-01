import { useState } from 'react'
import { Play, Settings } from 'lucide-react'

export function ListenTab() {
  const [pulseSpeed, setPulseSpeed] = useState(3)
  const [blurAmount, setBlurAmount] = useState(40) // px blur for ambient layer
  const [glowOpacity, setGlowOpacity] = useState(15) // % opacity for ambient glow
  const [coreOpacity, setCoreOpacity] = useState(60) // % opacity for core — lower = more blur, less circle
  const [coreBlur, setCoreBlur] = useState(12) // px blur on the core itself
  const [maxSize, setMaxSize] = useState(240) // px diameter for ambient layer
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] relative overflow-hidden">
      {/* Orb area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Layer 3: Ambient glow (outermost) */}
        <div
          className="absolute rounded-full"
          style={{
            width: maxSize,
            height: maxSize,
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
        {/* Layer 2: Mid glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: maxSize * 0.58,
            height: maxSize * 0.58,
            background: `radial-gradient(circle, rgba(165, 28, 48, ${Math.min(glowOpacity * 2.5, 80) / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount * 0.5}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
            animationDelay: `${pulseSpeed * 0.1}s`,
          }}
        />
        {/* Layer 1: Core — blurred to look like a glow, not a hard circle */}
        <div
          className="relative rounded-full"
          style={{
            width: Math.max(maxSize * 0.25, 30),
            height: Math.max(maxSize * 0.25, 30),
            background: `radial-gradient(circle, rgba(193, 40, 62, ${coreOpacity / 100}) 0%, rgba(165, 28, 48, ${coreOpacity * 0.6 / 100}) 50%, transparent 100%)`,
            boxShadow: `0 0 ${blurAmount * 0.75}px rgba(165, 28, 48, ${coreOpacity * 0.5 / 100}), 0 0 ${blurAmount * 1.5}px rgba(165, 28, 48, ${coreOpacity * 0.3 / 100})`,
            filter: `blur(${coreBlur}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Controls area */}
      <div className="px-4 pb-4 space-y-3">
        {/* Speed slider — always visible */}
        <SliderRow label="Speed" value={pulseSpeed} min={1} max={15} step={0.5} suffix="s" leftHint="Fast" rightHint="Slow" onChange={setPulseSpeed} />

        {/* Settings toggle */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors mx-auto"
        >
          <Settings size={11} />
          {showSettings ? 'Hide' : 'Show'} settings
        </button>

        {/* Advanced settings */}
        {showSettings && (
          <div className="space-y-2 pt-1 border-t border-white/10">
            <SliderRow label="Blur" value={blurAmount} min={0} max={80} step={1} suffix="px" onChange={setBlurAmount} />
            <SliderRow label="Glow" value={glowOpacity} min={5} max={60} step={1} suffix="%" onChange={setGlowOpacity} />
            <SliderRow label="Core" value={coreOpacity} min={10} max={100} step={5} suffix="%" onChange={setCoreOpacity} />
            <SliderRow label="Soft" value={coreBlur} min={0} max={40} step={1} suffix="px" onChange={setCoreBlur} />
            <SliderRow label="Size" value={maxSize} min={100} max={400} step={10} suffix="px" onChange={setMaxSize} />
          </div>
        )}

        {/* START LISTENING button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/15 transition-colors border border-white/10"
        >
          <Play size={16} fill="currentColor" />
          Start Listening
        </button>
      </div>

      <style>{`
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, suffix, leftHint, rightHint, onChange }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix: string
  leftHint?: string
  rightHint?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 w-10 shrink-0">{leftHint || label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A51C30]"
        aria-label={label}
      />
      <span className="text-xs text-white/40 w-14 text-right shrink-0">{rightHint || `${value}${suffix}`}</span>
    </div>
  )
}
