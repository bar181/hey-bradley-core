import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

// P125.5 / W2 — Animated hero. Inspired by Home.html (plans/hitl/phase-123/).
// Stack:
//   - Multi-layer radial crimson glow (background, breathing)
//   - Concentric repeating rings (animated rotate, dashed)
//   - 12 floating particles (drift trajectories via CSS vars)
//   - Animated letter-by-letter reveal of "Describe it. See it."
//   - Voice strip with mic button + 8-bar waveform + cycling sample prompts
//   - brad_pixar.png avatar in crimson-bordered circle ("by Bradley Ross")
//   - Mouse-follow parallax on the orb (8px max drift)
// All animation pure CSS keyframes (no framer-motion / gsap per ADR-144 D5).

const SAMPLE_PROMPTS = [
  "Make me a coffee shop site, warm and not pretentious",
  "Add a pricing section with three tiers",
  "Make the hero crimson with a darker subhead",
  "Add a contact form below the menu",
  "Switch to a portfolio layout with three gallery cards",
]

// 12 particles with deterministic drift trajectories
const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2
  const r = 220 + (i % 3) * 80
  return {
    id: i,
    left: 50 + Math.cos(angle) * 18,
    top: 50 + Math.sin(angle) * 18,
    dx: Math.cos(angle + Math.PI / 4) * (r / 5),
    dy: Math.sin(angle + Math.PI / 4) * (r / 5),
    delay: (i * 0.4) % 6,
    duration: 5 + (i % 4),
  }
})

const HEADLINE = ["Describe", " ", "it.", " ", "See", " ", "it."]

export function HeroAnimated() {
  const orbRef = useRef<HTMLDivElement>(null)
  const [promptIdx, setPromptIdx] = useState(0)

  // Cycle the sample prompt every ~3.5s
  useEffect(() => {
    const t = window.setInterval(() => {
      setPromptIdx((i) => (i + 1) % SAMPLE_PROMPTS.length)
    }, 3500)
    return () => window.clearInterval(t)
  }, [])

  // Mouse-follow parallax on the orb
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const orb = orbRef.current
      if (!orb) return
      const w = window.innerWidth
      const h = window.innerHeight
      const dx = ((e.clientX - w / 2) / w) * 14
      const dy = ((e.clientY - h / 2) / h) * 10
      orb.style.setProperty("--mx", `${dx}px`)
      orb.style.setProperty("--my", `${dy}px`)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <section
      className="marketing-hero-bg marketing-grain relative overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* Layered glow + rings + particles — pointer-events:none so CTAs work */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Multi-layer breathing orb behind everything */}
        <div
          ref={orbRef}
          className="hero-orb-anim absolute"
          style={{
            left: "50%",
            top: "55%",
            transform: "translate(-50%, -50%)",
            width: "min(880px, 90vw)",
            height: "min(880px, 90vw)",
            background: `radial-gradient(circle at 50% 50%,
              rgba(255, 80, 100, 0.45) 0%,
              rgba(165, 28, 48, 0.30) 18%,
              rgba(120, 20, 35, 0.18) 38%,
              transparent 65%)`,
            filter: "blur(60px)",
          }}
        />
        {/* Concentric rotating rings (3 layers) */}
        <div
          className="hero-ring absolute"
          style={{
            left: "50%",
            top: "55%",
            marginLeft: "-280px",
            marginTop: "-280px",
            width: "560px",
            height: "560px",
          }}
        />
        <div
          className="hero-ring hero-ring-rev absolute"
          style={{
            left: "50%",
            top: "55%",
            marginLeft: "-380px",
            marginTop: "-380px",
            width: "760px",
            height: "760px",
            borderColor: "rgba(101, 120, 180, 0.10)",
          }}
        />
        <div
          className="hero-ring absolute"
          style={{
            left: "50%",
            top: "55%",
            marginLeft: "-200px",
            marginTop: "-200px",
            width: "400px",
            height: "400px",
            borderColor: "rgba(165, 28, 48, 0.30)",
          }}
        />
        {/* 12 floating particles */}
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="hero-particle"
            style={
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Top status pill — capstone signal */}
      <div className="relative z-10 pt-24 pb-2 flex justify-center">
        <span
          className="marketing-mono inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(165, 28, 48, 0.10)",
            border: "1px solid rgba(165, 28, 48, 0.28)",
            color: "var(--hb-text-primary)",
            fontSize: "11px",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: "#6BCB77",
              boxShadow: "0 0 8px rgba(107, 203, 119, 0.7)",
            }}
          />
          Live · Harvard ALM Capstone · v1.0.0-RC1
        </span>
      </div>

      {/* Eyebrow + animated headline + subtitle + CTAs + avatar */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-10 pb-14">
        <div className="marketing-eyebrow mb-7">
          Harvard Extension School · ALM · May 2026
        </div>
        <h1
          className="marketing-h1 mb-7"
          aria-label="Describe it. See it."
        >
          {HEADLINE.map((seg, i) => {
            const isItalic = i >= 4
            const delay = `${0.15 + i * 0.09}s`
            if (seg === " ") {
              return (
                <span key={i} className="hero-letter" style={{ animationDelay: delay }}>
                  &nbsp;
                </span>
              )
            }
            return (
              <span
                key={i}
                className="hero-letter"
                style={{
                  animationDelay: delay,
                  fontStyle: isItalic ? "italic" : "normal",
                  fontWeight: isItalic ? 400 : 300,
                  color: isItalic ? "var(--hb-accent)" : "inherit",
                }}
              >
                {seg}
              </span>
            )
          })}
        </h1>
        <p className="marketing-body max-w-xl mx-auto mb-10">
          Your voice is the whiteboard. Hey Bradley turns any idea into a
          visual site and a formal spec — while you&rsquo;re still talking.
        </p>

        {/* Voice strip — mic button + cycling prompt + waveform */}
        <div
          className="mx-auto mb-10 inline-flex items-center gap-4 px-5 py-3 rounded-full"
          style={{
            backgroundColor: "rgba(15, 15, 26, 0.7)",
            border: "1px solid var(--hb-border)",
            backdropFilter: "blur(8px)",
            maxWidth: "92vw",
          }}
        >
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hero-avatar-ring"
            style={{ backgroundColor: "var(--hb-accent)" }}
            aria-hidden="true"
          >
            <Mic className="w-4 h-4 text-white" />
          </span>
          <span
            className="text-[14px] italic max-w-[34vw] truncate"
            style={{
              color: "var(--hb-text-primary)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "16px",
            }}
            key={promptIdx}
          >
            “{SAMPLE_PROMPTS[promptIdx]}”
          </span>
          <span className="flex items-end gap-[3px] h-5">
            {[0.3, 0.7, 1.0, 0.6, 0.9, 0.4, 0.75, 0.5].map((h, i) => (
              <span
                key={i}
                className="hero-wave-bar inline-block w-[2px] rounded-full"
                style={{
                  height: `${Math.round(h * 100)}%`,
                  backgroundColor: "var(--hb-accent)",
                  animationDelay: `${i * 90}ms`,
                }}
              />
            ))}
          </span>
          <span
            className="marketing-mono hidden sm:inline"
            style={{
              fontSize: "10px",
              color: "var(--hb-text-faint)",
            }}
          >
            LISTENING
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Button
            size="lg"
            render={<Link to="/new-project" />}
            className="min-h-[44px] gap-2 rounded-full px-8 py-4 text-base font-semibold shadow-lg bg-[var(--hb-accent)] text-white hover:bg-[var(--hb-accent-hover)] hover:scale-[1.02] transition-all"
          >
            Start describing
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link to="/walkthrough" />}
            className="min-h-[44px] gap-2 rounded-full px-8 py-4 text-base font-semibold border-white/15 bg-transparent text-[var(--hb-text-primary)] hover:border-[var(--hb-accent)] hover:bg-transparent"
          >
            Watch the walkthrough
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Author avatar row */}
        <div className="inline-flex items-center gap-3">
          <span
            className="block w-10 h-10 rounded-full overflow-hidden hero-avatar-ring"
            aria-hidden="true"
          >
            <img
              src="/images/brad_pixar.png"
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
          </span>
          <span
            className="text-left"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span
              className="block text-[13px]"
              style={{ color: "var(--hb-text-primary)" }}
            >
              Bradley Ross
            </span>
            <span
              className="block marketing-mono"
              style={{
                fontSize: "10px",
                color: "var(--hb-text-faint)",
                letterSpacing: "0.18em",
              }}
            >
              CREATOR · HARVARD ALM 2026
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
