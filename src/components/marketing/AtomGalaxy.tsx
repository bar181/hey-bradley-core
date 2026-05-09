import { useEffect, useRef } from "react"
import * as d3 from "d3"

// P125.5 / W5 — D3 atom galaxy visualization for the AISP section.
// Central nucleus (Crystal core) + 5 orbiting atom nodes (Ω Σ Γ Λ Ε) +
// dotted orbit ring + crimson connection arcs from center to each atom +
// hover-scale on each node.
//
// Inspired by the d3-galaxy chart in plans/hitl/phase-123/Home.html.
// Pure d3 + SVG — no canvas. Respects prefers-reduced-motion via CSS.

type Atom = { glyph: string; name: string; cat: string }

const ATOMS: Atom[] = [
  { glyph: "Ω", name: "Transmuters", cat: "Foundation" },
  { glyph: "Σ", name: "Types", cat: "Domain" },
  { glyph: "Γ", name: "Topologics", cat: "Structure" },
  { glyph: "Λ", name: "Lambda", cat: "Functions" },
  { glyph: "Ε", name: "Evidence", cat: "Validation" },
]

export function AtomGalaxy() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    if (svg.empty()) return

    svg.selectAll("*").remove()

    const W = 560
    const H = 420
    const cx = W / 2
    const cy = H / 2
    const R = 150

    svg.attr("viewBox", `0 0 ${W} ${H}`).attr("width", "100%").attr("height", "100%")

    // Outer dotted orbit
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", R)
      .attr("fill", "none")
      .attr("stroke", "rgba(165, 28, 48, 0.30)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 8")

    // Inner faint orbit
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", R - 60)
      .attr("fill", "none")
      .attr("stroke", "rgba(101, 120, 180, 0.15)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2 6")

    // Connection arcs from center to each atom
    const angles = ATOMS.map((_, i) => (i / ATOMS.length) * Math.PI * 2 - Math.PI / 2)
    angles.forEach((a) => {
      const x = cx + Math.cos(a) * R
      const y = cy + Math.sin(a) * R
      svg
        .append("line")
        .attr("x1", cx)
        .attr("y1", cy)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "rgba(165, 28, 48, 0.18)")
        .attr("stroke-width", 1)
    })

    // Central nucleus (defs for radial gradient)
    const defs = svg.append("defs")
    const grad = defs
      .append("radialGradient")
      .attr("id", "core-glow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#ff5566").attr("stop-opacity", 1)
    grad.append("stop").attr("offset", "50%").attr("stop-color", "#A51C30").attr("stop-opacity", 1)
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#2a0810").attr("stop-opacity", 0.6)

    // Glow halo behind nucleus
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 50)
      .attr("fill", "rgba(165, 28, 48, 0.18)")
      .attr("filter", "blur(14px)")

    // Nucleus
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", 28)
      .attr("fill", "url(#core-glow)")
      .style("filter", "drop-shadow(0 0 18px rgba(165, 28, 48, 0.6))")

    svg
      .append("text")
      .attr("x", cx)
      .attr("y", cy + 6)
      .attr("text-anchor", "middle")
      .attr("font-family", "'Cormorant Garamond', Georgia, serif")
      .attr("font-weight", 300)
      .attr("font-size", 22)
      .attr("fill", "#f0ede5")
      .text("𝔸")

    // Atom nodes
    const g = svg.append("g").attr("class", "galaxy-nodes")

    angles.forEach((a, i) => {
      const x = cx + Math.cos(a) * R
      const y = cy + Math.sin(a) * R
      const atom = ATOMS[i]

      const node = g
        .append("g")
        .attr("transform", `translate(${x}, ${y})`)
        .style("cursor", "pointer")

      // Halo
      node
        .append("circle")
        .attr("r", 30)
        .attr("fill", "rgba(165, 28, 48, 0.10)")
        .attr("stroke", "rgba(165, 28, 48, 0.35)")
        .attr("stroke-width", 1)
        .attr("class", "galaxy-halo")
        .style("transition", "all 0.25s ease")

      // Node
      node
        .append("circle")
        .attr("r", 22)
        .attr("fill", "#0f0f1a")
        .attr("stroke", "#A51C30")
        .attr("stroke-width", 1.5)

      // Glyph
      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 8)
        .attr("font-family", "'Cormorant Garamond', Georgia, serif")
        .attr("font-weight", 400)
        .attr("font-size", 24)
        .attr("fill", "#A51C30")
        .text(atom.glyph)

      // Label below node
      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 50)
        .attr("font-family", "'DM Mono', monospace")
        .attr("font-size", 10)
        .attr("fill", "rgba(240, 237, 229, 0.6)")
        .attr("letter-spacing", "0.18em")
        .text(atom.cat.toUpperCase())

      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 64)
        .attr("font-family", "'Cormorant Garamond', Georgia, serif")
        .attr("font-style", "italic")
        .attr("font-size", 14)
        .attr("fill", "#f0ede5")
        .text(atom.name)

      // Hover effect
      node
        .on("mouseenter", function () {
          d3.select(this).select(".galaxy-halo").attr("r", 38).attr("fill", "rgba(165, 28, 48, 0.22)")
        })
        .on("mouseleave", function () {
          d3.select(this).select(".galaxy-halo").attr("r", 30).attr("fill", "rgba(165, 28, 48, 0.10)")
        })
    })

    // Slow rotation of the whole galaxy node group
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduced) {
      let angle = 0
      const tick = () => {
        angle = (angle + 0.05) % 360
        g.attr("transform", `rotate(${angle}, ${cx}, ${cy})`)
        // Counter-rotate text inside nodes so glyphs stay upright
        g.selectAll("text").attr("transform", `rotate(${-angle})`)
      }
      const interval = window.setInterval(tick, 60)
      return () => window.clearInterval(interval)
    }
  }, [])

  return (
    <div
      className="relative mx-auto"
      style={{ maxWidth: 600 }}
      aria-hidden="true"
    >
      <svg ref={svgRef} role="img" aria-label="AISP atom galaxy" />
    </div>
  )
}
