/**
 * P37 Wave 1 (R2 S3) — ListenOrb.
 *
 * Decorative 4-layer orb + caption area, extracted from ListenTab so the
 * orchestrator stays under the CLAUDE.md 150-LOC target. Pure presentational —
 * all state lives in the parent (orb tuning sliders + sim-input plumbing).
 *
 * The orb itself is 4 stacked radial-gradient divs sized off `maxSize` and
 * driven by `orb-pulse` / `orb-breathe` keyframes (defined in ListenTab).
 */
export interface ListenOrbProps {
  pulseSpeed: number
  blurAmount: number
  glowOpacity: number
  coreOpacity: number
  coreBlur: number
  maxSize: number
  burstActive: boolean
  simPhase: 'idle' | 'user' | 'ai'
  simText: string
}

export function ListenOrb({
  pulseSpeed,
  blurAmount,
  glowOpacity,
  coreOpacity,
  coreBlur,
  maxSize,
  burstActive,
  simPhase,
  simText,
}: ListenOrbProps) {
  const size = burstActive ? maxSize * 1.2 : maxSize
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6 relative min-h-0">
        <div
          className="absolute rounded-full"
          style={{
            width: `min(${size * 1.2}px, 95%)`,
            height: `min(${size * 1.2}px, 95%)`,
            background: `radial-gradient(circle, rgba(165, 28, 48, ${(glowOpacity * 0.15) / 100}) 0%, transparent 60%)`,
            filter: `blur(${blurAmount * 1.5}px)`,
            animation: `orb-pulse ${pulseSpeed * 1.5}s ease-in-out infinite`,
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: `min(${size}px, 90%)`,
            height: `min(${size}px, 90%)`,
            maxWidth: '90%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${glowOpacity / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: `min(${size * 0.58}px, 55%)`,
            height: `min(${size * 0.58}px, 55%)`,
            maxWidth: '55%',
            background: `radial-gradient(circle, rgba(165, 28, 48, ${Math.min(glowOpacity * 2.5, 80) / 100}) 0%, transparent 70%)`,
            filter: `blur(${blurAmount * 0.5}px)`,
            animation: `orb-breathe ${pulseSpeed * 1.2}s ease-in-out infinite`,
            animationDelay: `${pulseSpeed * 0.1}s`,
          }}
        />
        <div
          className="relative rounded-full transition-all duration-2000 ease-in-out"
          style={{
            width: Math.max(size * 0.35, 50),
            height: Math.max(size * 0.35, 50),
            background: `radial-gradient(circle, rgba(193, 40, 62, ${coreOpacity / 100}) 0%, rgba(165, 28, 48, ${(coreOpacity * 0.6) / 100}) 50%, transparent 100%)`,
            boxShadow: `0 0 ${blurAmount * 0.75}px rgba(165, 28, 48, ${(coreOpacity * 0.5) / 100}), 0 0 ${blurAmount * 1.5}px rgba(165, 28, 48, ${(coreOpacity * 0.3) / 100})`,
            filter: `blur(${coreBlur}px)`,
            animation: `orb-pulse ${pulseSpeed}s ease-in-out infinite`,
          }}
        />
      </div>
      <div className="min-h-[80px] px-4 flex items-center justify-center">
        {simPhase !== 'idle' ? (
          <div
            className={`w-full rounded-xl px-4 py-3 backdrop-blur-md ${simPhase === 'user' ? 'bg-white/10 border border-white/20' : 'bg-[#A51C30]/15 border border-[#A51C30]/30'}`}
          >
            <div
              className={`text-xs uppercase tracking-wider mb-1 ${simPhase === 'user' ? 'text-white/40' : 'text-[#C1283E]/60'}`}
            >
              {simPhase === 'user' ? 'You' : 'Hey Bradley'}
            </div>
            <p
              className={`text-lg lg:text-xl font-medium leading-relaxed ${simPhase === 'user' ? 'text-white' : 'text-[#C1283E]'}`}
            >
              {simText}
              <span className="inline-block w-0.5 h-5 ml-0.5 align-middle bg-current animate-pulse" />
            </p>
          </div>
        ) : (
          <p className="text-sm text-white/25 italic">Ready to listen...</p>
        )}
      </div>
    </>
  )
}
