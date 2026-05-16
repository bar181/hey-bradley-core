import { useReveal } from "@/hooks/useReveal"
import { StatsSparkline } from "./StatsSparkline"

// P125 / W5 — Stats section modeled on capstone v8 slide 8.
// Three numbers in Cormorant Garamond. Featured center stat pulses crimson.
// Numbers are public capstone defense figures; sub-line gives the source.

type Tone = "blue" | "crimson" | "white"

type Stat = {
  number: string
  label: string
  sub: string
  tone: Tone
  featured?: boolean
}

const STATS: Stat[] = [
  {
    number: "+42%",
    label: "Over baseline",
    sub: "Same model. Better spec.",
    tone: "blue",
  },
  {
    number: "92%",
    label: "Overall success",
    sub: "Competitive with frontier",
    tone: "crimson",
    featured: true,
  },
  {
    number: "<2%",
    label: "Spec ambiguity",
    sub: "AISP δ = 0.016",
    tone: "white",
  },
]

const TONE_COLOR: Record<Tone, string> = {
  blue: "var(--hb-blue)",
  crimson: "var(--hb-accent)",
  white: "var(--hb-text-primary)",
}

export function StatsSection() {
  const r = useReveal<HTMLElement>()

  return (
    <section
      ref={r.ref}
      className={`relative py-24 transition-all duration-700 ${
        r.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ backgroundColor: "var(--hb-deep)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="marketing-eyebrow text-center mb-3">
          SWE-bench Verified · January 2026
        </div>
        <h2 className="marketing-h2 text-center mb-14 max-w-2xl mx-auto">
          The numbers <em>that mattered</em> at the defense.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {STATS.map((s) => {
            const color = TONE_COLOR[s.tone]
            return (
              <div
                key={s.label}
                className={[
                  "rounded-2xl px-8 py-12 text-center",
                  "border",
                  s.featured ? "marketing-stat-featured" : "",
                ].join(" ")}
                style={{
                  backgroundColor: s.featured
                    ? "var(--hb-surface-2)"
                    : "var(--hb-surface)",
                  borderColor: s.featured
                    ? "var(--hb-border-warm)"
                    : "var(--hb-border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontSize: "clamp(56px, 8vw, 96px)",
                    lineHeight: 1,
                    color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.number}
                </div>
                <div
                  className="marketing-eyebrow mt-5"
                  style={{
                    color:
                      s.tone === "white"
                        ? "var(--hb-text-secondary)"
                        : color,
                  }}
                >
                  {s.label}
                </div>
                <div className="marketing-mono mt-3 text-[var(--hb-text-muted)]">
                  {s.sub}
                </div>
              </div>
            )
          })}
        </div>

        {/* P125.5 / W6 — D3 sparklines under the stat numbers. */}
        <StatsSparkline />

        <p className="marketing-mono text-center mt-10 text-[var(--hb-text-faint)]">
          Capstone defense · Harvard ALM · May 2026
        </p>
      </div>
    </section>
  )
}
