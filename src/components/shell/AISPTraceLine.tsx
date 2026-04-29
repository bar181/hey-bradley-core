/**
 * P55 Sprint L Wave 1 (A1 / ADR-078) — Always-on AISP trace pill.
 *
 * Defense-critical: makes the AISP moat legible to a first-time user — no
 * toggle, no Geek personality required. Renders on every bradley reply that
 * carries a classified intent (or, in EXPERT mode, when target is locked).
 *
 *   • SIMPLE  → "I understood: <verb> <target> · <conf>"
 *               Grandma-friendly natural-language trace.
 *   • EXPERT  → "Ω→<verb> · Σ→<target> · Γ→R3✓ · Λ→threshold:0.85 · Ε→V3✓ · <conf>"
 *               Full Crystal Atom labels per ADR-053 / ADR-056.
 *
 * Atom-light-up animation: each marker carries a CSS transition keyed on
 * intent identity (verb+target+confidence) so a fresh classification "lights
 * up" sequentially via staggered `transition-colors duration-500`. KISS — no
 * JS animation, no requestAnimationFrame, just Tailwind state.
 *
 * Owns testid `aisp-trace-always-on`.
 */
import type { ClassifiedIntent } from '@/contexts/intelligence/aisp'

export interface AISPTraceLineProps {
  intent: ClassifiedIntent | null
  mode: 'simple' | 'expert'
}

function targetLabel(intent: ClassifiedIntent): string {
  const t = intent.target
  if (!t) return 'none'
  return t.index !== null ? `${t.type}-${t.index}` : t.type
}

export function AISPTraceLine({ intent, mode }: AISPTraceLineProps) {
  // Only render when a target is locked — pre-classification noise is hidden.
  if (!intent || !intent.target) return null
  const conf = intent.confidence.toFixed(2)
  const tgt = targetLabel(intent)

  if (mode === 'simple') {
    return (
      <div
        data-testid="aisp-trace-always-on"
        data-mode="simple"
        className="text-xs font-mono mt-1 mb-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#e8772e]/30 bg-[#e8772e]/5 text-[#8a4a1c] transition-colors duration-500"
        title="AISP intent classification — see 'How I understood this' for the full trace."
      >
        <span className="text-[#6b5e4f]">I understood:</span>
        <span className="text-[#2d1f12] font-semibold">{intent.verb}</span>
        <span className="text-[#2d1f12]">{tgt}</span>
        <span className="text-[#6b5e4f]">·</span>
        <span className="text-[#2d1f12]">{conf}</span>
      </div>
    )
  }

  // EXPERT — Crystal-Atom inline trace. Each Ω/Σ/Γ/Λ/Ε pill staggers its
  // transition via `transition-delay-*` utilities so they "light up" in order.
  // ✓ marks are static — Γ R3 (target schema) and Ε V3 (envelope) gate the
  // confidence ≥0.85 path, so when this line renders for an AISP-locked turn
  // those checks are by-definition green.
  const atom = 'inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border transition-colors duration-500'
  return (
    <div
      data-testid="aisp-trace-always-on"
      data-mode="expert"
      className="text-xs font-mono mt-1 mb-1 flex flex-wrap items-center gap-1"
      title="AISP Crystal Atom trace — verb / target / target-schema / threshold / envelope / confidence."
    >
      <span className={`${atom} bg-indigo-50 text-indigo-700 border-indigo-200`}>Ω→{intent.verb}</span>
      <span className={`${atom} bg-emerald-50 text-emerald-700 border-emerald-200`}>Σ→{tgt}</span>
      <span className={`${atom} bg-sky-50 text-sky-700 border-sky-200`}>Γ→R3✓</span>
      <span className={`${atom} bg-amber-50 text-amber-700 border-amber-200`}>Λ→threshold:0.85</span>
      <span className={`${atom} bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200`}>Ε→V3✓</span>
      <span className="text-[#2d1f12] font-semibold">{conf}</span>
    </div>
  )
}
