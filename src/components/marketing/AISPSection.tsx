import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useReveal } from "@/hooks/useReveal"
import { AtomGalaxy } from "./AtomGalaxy"

// P125 / W6 — AISP marketing section modeled on capstone v8 slides 6 & 7.
// Five Crystal Atom cards in Cormorant Garamond on a near-black surface.
// Δ-bar shows industry vs AISP ambiguity (40-65% → 0.016).
// Owner-locked content. NOT a real AISP renderer — this is the marketing teaser;
// the real atom view lives in /agentics SpecWorkbench.

type Atom = {
  glyph: string
  name: string
  cat: string
  def: string
}

const ATOMS: Atom[] = [
  {
    glyph: "Ω",
    name: "Transmuters",
    cat: "Foundation",
    def: "Transform, derive, prove.",
  },
  {
    glyph: "Σ",
    name: "Types",
    cat: "Domain",
    def: "Universe of shapes.",
  },
  {
    glyph: "Γ",
    name: "Topologics",
    cat: "Structure",
    def: "Sets, graphs, blocks.",
  },
  {
    glyph: "Λ",
    name: "Lambda",
    cat: "Functions",
    def: "Pure transformations.",
  },
  {
    glyph: "Ε",
    name: "Evidence",
    cat: "Validation",
    def: "Proof every doc carries.",
  },
]

export function AISPSection() {
  const r = useReveal<HTMLElement>()

  return (
    <section
      ref={r.ref}
      className={`relative py-28 transition-all duration-700 ${
        r.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ backgroundColor: "var(--hb-void)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="marketing-eyebrow mb-5">
            AISP · The recipe, not the wish
          </div>
          <h2 className="marketing-h2 max-w-3xl mx-auto">
            Five parts. <em>Zero ambiguity.</em>
          </h2>
          <p className="marketing-body max-w-2xl mx-auto mt-5">
            Every Hey Bradley spec is built from five symbolic blocks. They
            compose into a proof-carrying document any agent can read the same
            way you can.
          </p>
        </div>

        {/* P125.5 / W5 — D3 atom galaxy (animated rotation, hover). */}
        <div className="mb-16">
          <AtomGalaxy />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ATOMS.map((a) => (
            <div
              key={a.glyph}
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: "var(--hb-surface)",
                border: "1px solid var(--hb-border-warm)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: "44px",
                  lineHeight: 1,
                  color: "var(--hb-accent)",
                }}
              >
                {a.glyph}
              </div>
              <div className="marketing-eyebrow mt-4 text-[10px]">
                {a.cat}
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "17px",
                  color: "var(--hb-text-primary)",
                  lineHeight: 1.35,
                }}
              >
                {a.name}
              </div>
              <p className="marketing-mono mt-3 text-[11px] text-[var(--hb-text-muted)] leading-relaxed">
                {a.def}
              </p>
            </div>
          ))}
        </div>

        {/* Δ-bar — ambiguity comparison */}
        <div
          className="mt-14 rounded-2xl p-8"
          style={{
            backgroundColor: "var(--hb-surface)",
            border: "1px solid var(--hb-border)",
          }}
        >
          <div className="marketing-eyebrow mb-4">
            Ambiguity (δ) — lower is better
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between marketing-mono text-[12px] text-[var(--hb-text-muted)] mb-2">
                <span>Industry standard prose spec</span>
                <span>40 – 65 %</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--hb-deep)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "55%",
                    background:
                      "linear-gradient(90deg, var(--hb-blue) 0%, var(--hb-blue-dim) 100%)",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between marketing-mono text-[12px] text-[var(--hb-text-muted)] mb-2">
                <span>AISP — Hey Bradley spec output</span>
                <span style={{ color: "var(--hb-accent)" }}>δ = 0.016</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--hb-deep)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "1.6%",
                    background: "var(--hb-accent)",
                    boxShadow: "0 0 18px -2px rgba(165, 28, 48, 0.6)",
                    minWidth: "8px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/aisp"
            className="inline-flex items-center gap-2 marketing-mono"
            style={{ color: "var(--hb-accent)" }}
          >
            Read the full AISP spec
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
