import { useState } from 'react'
import { Play } from 'lucide-react'

export function ListenTab() {
  const [pulseSpeed, setPulseSpeed] = useState(3) // seconds per pulse cycle

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] relative overflow-hidden">
      {/* Orb area — centered, takes most of the panel */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Layer 3: Ambient glow (outermost) */}
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 240,
            background: 'radial-gradient(circle, rgba(165, 28, 48, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
        {/* Layer 2: Mid glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 140,
            height: 140,
            background: 'radial-gradient(circle, rgba(165, 28, 48, 0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
            animationDelay: `${pulseSpeed * 0.1}s`,
          }}
        />
        {/* Layer 1: Core */}
        <div
          className="relative rounded-full"
          style={{
            width: 60,
            height: 60,
            background: 'radial-gradient(circle, #C1283E 0%, #A51C30 50%, #8C1515 100%)',
            boxShadow: '0 0 30px rgba(165, 28, 48, 0.5), 0 0 60px rgba(165, 28, 48, 0.3)',
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Controls area — bottom */}
      <div className="px-4 pb-4 space-y-4">
        {/* Speed slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 w-10 shrink-0">Fast</span>
          <input
            type="range"
            min={1}
            max={15}
            step={0.5}
            value={pulseSpeed}
            onChange={(e) => setPulseSpeed(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#A51C30]"
            aria-label="Pulse speed"
          />
          <span className="text-xs text-white/40 w-10 text-right shrink-0">Slow</span>
        </div>
        <div className="text-center text-xs text-white/30">{pulseSpeed}s pulse</div>

        {/* START LISTENING button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/15 transition-colors border border-white/10"
        >
          <Play size={16} fill="currentColor" />
          Start Listening
        </button>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
