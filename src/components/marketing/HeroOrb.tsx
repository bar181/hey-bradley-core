/**
 * HeroOrb — standalone crimson pulsating glow for the Welcome hero.
 * Extracted from ListenOrb.tsx. Uses global orb-pulse / orb-breathe keyframes
 * defined in index.css. Pure CSS — no canvas, no WebGL, no image files.
 */
interface HeroOrbProps {
  /** Diameter in px (default 500) */
  size?: number
  /** Base opacity 0–100 (default 40) */
  opacity?: number
}

export function HeroOrb({ size = 500, opacity = 40 }: HeroOrbProps) {
  const o = opacity / 100
  const cr = '165, 28, 48' // Harvard crimson RGB

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      {/* Layer 1 — outer halo */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: `radial-gradient(circle, rgba(${cr}, ${o * 0.15}) 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'orb-pulse 6s ease-in-out infinite',
        }}
      />
      {/* Layer 2 — mid glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, rgba(${cr}, ${o * 0.6}) 0%, rgba(${cr}, ${o * 0.1}) 60%, transparent 80%)`,
          filter: 'blur(40px)',
          animation: 'orb-pulse 4s ease-in-out infinite',
        }}
      />
      {/* Layer 3 — inner glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          background: `radial-gradient(circle, rgba(${cr}, ${o * 0.8}) 0%, rgba(${cr}, ${o * 0.2}) 70%, transparent 100%)`,
          filter: 'blur(20px)',
          animation: 'orb-breathe 5s ease-in-out infinite',
        }}
      />
      {/* Layer 4 — solid core */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          background: `radial-gradient(circle, rgba(193, 40, 62, ${o}) 0%, rgba(${cr}, ${o * 0.7}) 100%)`,
          boxShadow: `0 0 ${size * 0.15}px rgba(${cr}, ${o * 0.4}), 0 0 ${size * 0.3}px rgba(${cr}, ${o * 0.2})`,
          animation: 'orb-pulse 4s ease-in-out infinite',
        }}
      />
    </div>
  )
}
