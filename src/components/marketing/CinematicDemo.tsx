import { useEffect, useState } from "react"
import { useReveal } from "@/hooks/useReveal"

// P125 / W4 — Cinematic demo modeled on Phase 3 mockup (Image 3) from
// human-review-1.md. Replaces ListenPreview's iMessage-style demo.
//
// Layout: device frame with traffic-light header. LEFT (35%) = transcript
// (You: crimson · Bradley: blue mono labels) + voice waveform + listening
// orb. RIGHT (65%) = animated build — Asheville Roasters site sections
// slide up one by one. AISP spec card appears bottom-right at step 3.
// Pure CSS/React animation; no real builder call. Loops once → CTA.

type Step = {
  delay: number
  kind: "section1" | "section2" | "aispCard"
}

const STEPS: Step[] = [
  { delay: 800, kind: "section1" },
  { delay: 1700, kind: "section2" },
  { delay: 2600, kind: "aispCard" },
]

export function CinematicDemo() {
  const r = useReveal<HTMLDivElement>()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!r.isVisible) return
    const timers = STEPS.map((s, i) =>
      window.setTimeout(() => setStep(i + 1), s.delay)
    )
    const finish = window.setTimeout(() => setDone(true), 3600)
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      window.clearTimeout(finish)
    }
  }, [r.isVisible])

  function replay() {
    setStep(0)
    setDone(false)
    STEPS.forEach((s, i) => {
      window.setTimeout(() => setStep(i + 1), s.delay)
    })
    window.setTimeout(() => setDone(true), 3600)
  }

  return (
    <div
      ref={r.ref}
      className="relative max-w-5xl mx-auto"
      style={{ perspective: "1400px" }}
    >
      {/* Device frame */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--hb-deep)",
          border: "1px solid var(--hb-border)",
          boxShadow:
            "0 30px 80px -20px rgba(165, 28, 48, 0.25), 0 0 0 1px rgba(165, 28, 48, 0.12)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            backgroundColor: "var(--hb-surface)",
            borderBottom: "1px solid var(--hb-border)",
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--hb-traffic-red)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--hb-traffic-yellow)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--hb-traffic-green)" }} />
          <div
            className="ml-3 marketing-mono text-[11px]"
            style={{ color: "var(--hb-text-muted)" }}
          >
            hey-bradley.app/preview
          </div>
        </div>

        {/* Main split */}
        <div className="grid grid-cols-1 md:grid-cols-[35%_65%] min-h-[440px]">
          {/* LEFT — transcript */}
          <div
            className="p-5 flex flex-col gap-4"
            style={{
              backgroundColor: "var(--hb-deep)",
              borderRight: "1px solid var(--hb-border)",
            }}
          >
            {/* Listening orb + waveform */}
            <div className="flex items-center gap-3">
              <span
                className="relative w-8 h-8 rounded-full"
                style={{
                  backgroundColor: "var(--hb-accent-dim)",
                  boxShadow: "0 0 24px -4px rgba(165, 28, 48, 0.6)",
                }}
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, var(--hb-accent) 0%, transparent 70%)",
                    opacity: 0.7,
                  }}
                />
              </span>
              <div
                className="marketing-eyebrow"
                style={{ color: "var(--hb-accent)" }}
              >
                Listening…
              </div>
            </div>
            <div className="flex items-end gap-1 h-8 px-1">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <span
                  key={i}
                  className="demo-wave-bar inline-block w-1 rounded-full"
                  style={{
                    height: "100%",
                    backgroundColor: "var(--hb-accent)",
                    opacity: 0.85,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>

            <div
              className="marketing-mono text-[10px] mt-2"
              style={{
                color: "var(--hb-text-faint)",
                letterSpacing: "0.18em",
              }}
            >
              TRANSCRIPT
            </div>

            <div className="flex-1 flex flex-col justify-end gap-3">
              {/* You */}
              <div className="demo-section-rise" style={{ animationDelay: "150ms" }}>
                <div
                  className="marketing-mono text-[10px] mb-1"
                  style={{ color: "var(--hb-accent)" }}
                >
                  You
                </div>
                <p
                  className="text-[14px] leading-snug"
                  style={{
                    color: "var(--hb-text-primary)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Make me a site for my coffee shop. Warm, plain-spoken, real
                  photos.
                </p>
              </div>

              {/* Bradley */}
              <div
                className="demo-section-rise"
                style={{ animationDelay: "1100ms" }}
              >
                <div
                  className="marketing-mono text-[10px] mb-1"
                  style={{ color: "var(--hb-blue)" }}
                >
                  Bradley
                </div>
                <p
                  className="text-[14px] leading-snug"
                  style={{
                    color: "var(--hb-text-secondary)",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  Got it. Asheville Roasters — slow-roasted, served warm.
                  <span className="demo-cursor" />
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — animated site build */}
          <div
            className="relative p-6 flex flex-col gap-4"
            style={{ backgroundColor: "var(--hb-bg)" }}
          >
            {/* Section 1 — hero card with gradient image area */}
            {step >= 1 && (
              <div
                className="demo-section-rise rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "var(--hb-surface)",
                  border: "1px solid var(--hb-border-warm)",
                }}
              >
                {/* P125.6 — Real coffee photography (Unsplash CDN). Replaces
                    the SVG steam plumes per owner directive. Ken Burns hover
                    + dark gradient overlay keeps the chip readable. */}
                <div
                  className="relative overflow-hidden effect-ken-burns"
                  style={{ height: 140 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=78&auto=format&fit=crop"
                    alt="Pour-over coffee being prepared"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Dark gradient overlay so text/chip stay readable */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(7,7,14,0.20) 0%, rgba(7,7,14,0.65) 100%)",
                    }}
                  />
                  {/* Crimson eyebrow chip top-right */}
                  <div
                    className="absolute top-3 right-3 marketing-mono"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.18em",
                      color: "var(--hb-accent)",
                      backgroundColor: "rgba(0,0,0,0.55)",
                      padding: "3px 8px",
                      borderRadius: "999px",
                      border: "1px solid var(--hb-border-warm)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    ASHEVILLE · NC
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 300,
                      fontSize: "30px",
                      lineHeight: 1.05,
                      color: "var(--hb-text-primary)",
                      margin: 0,
                    }}
                  >
                    Asheville <em style={{ color: "var(--hb-accent)" }}>Roasters</em>
                  </h3>
                  <p
                    className="mt-2 text-[12px]"
                    style={{
                      color: "var(--hb-text-secondary)",
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                    }}
                  >
                    Slow-roasted, served warm, poured by people who know your name.
                  </p>
                  <button
                    className="mt-3 marketing-mono text-[10px] px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: "var(--hb-accent)",
                      color: "white",
                    }}
                  >
                    See the menu →
                  </button>
                </div>
              </div>
            )}

            {/* Section 2 — real menu grid (replaces text-only labels) */}
            {step >= 2 && (
              <div
                className="demo-section-rise rounded-xl p-4"
                style={{
                  backgroundColor: "var(--hb-surface)",
                  border: "1px solid var(--hb-border)",
                }}
              >
                <div
                  className="marketing-eyebrow mb-3"
                  style={{ fontSize: "9px", letterSpacing: "0.22em" }}
                >
                  Today's pour
                </div>
                <ul className="space-y-1.5">
                  {[
                    { name: "Single-origin pour-over", price: "$5.50" },
                    { name: "Cortado", price: "$4.25" },
                    { name: "Cold brew on tap", price: "$4.75" },
                  ].map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline gap-3"
                    >
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "15px",
                          color: "var(--hb-text-primary)",
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="flex-1 border-b border-dotted"
                        style={{ borderColor: "var(--hb-border)" }}
                      />
                      <span
                        className="marketing-mono"
                        style={{
                          fontSize: "11px",
                          color: "var(--hb-accent)",
                        }}
                      >
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AISP spec card — bottom-right corner */}
            {step >= 3 && (
              <div
                className="demo-section-rise absolute bottom-5 right-5 rounded-lg p-3 max-w-[200px]"
                style={{
                  backgroundColor: "var(--hb-void)",
                  border: "1px solid var(--hb-border-warm)",
                  boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)",
                }}
              >
                <div
                  className="marketing-eyebrow mb-1"
                  style={{ fontSize: "9px" }}
                >
                  AISP spec
                </div>
                <pre
                  className="marketing-mono text-[10px] leading-tight m-0 whitespace-pre-wrap"
                  style={{
                    color: "var(--hb-text-secondary)",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
{`Σ{site = ⟨
  sections,
  theme,
  copy⟩;
  φ ≜ 0.93}`}
                </pre>
              </div>
            )}

            {step === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="marketing-mono text-[11px]"
                  style={{ color: "var(--hb-text-muted)" }}
                >
                  Building…
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 marketing-mono text-[11px]"
          style={{
            backgroundColor: "var(--hb-surface)",
            borderTop: "1px solid var(--hb-border)",
            color: "var(--hb-text-muted)",
          }}
        >
          <span>
            <span style={{ color: "var(--hb-accent)" }}>⚡ 0.8s</span> first
            build
          </span>
          {done ? (
            <button
              onClick={replay}
              className="px-3 py-1 rounded-full hover:text-[var(--hb-accent)] transition-colors"
              style={{
                color: "var(--hb-text-secondary)",
                border: "1px solid var(--hb-border)",
              }}
            >
              ↻ Replay
            </button>
          ) : (
            <span style={{ color: "var(--hb-text-faint)" }}>
              Listening · synthesizing · building
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
