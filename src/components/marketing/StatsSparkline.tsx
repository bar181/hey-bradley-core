import { useEffect, useRef } from "react"
import * as d3 from "d3"

// P125.5 / W6 — D3 sparkline visualization for the StatsSection.
// Three side-by-side micro-charts under the stat numbers. Each shows
// a different growth curve (baseline / hey-bradley / ambiguity-decay).
// Pure d3 + SVG. Animated on mount via stroke-dashoffset.

type Series = {
  label: string
  color: string
  values: number[]
}

const SERIES: Series[] = [
  {
    label: "BASELINE → +42%",
    color: "#6578B4",
    // 16-pt growth curve: starts low, climbs steadily
    values: [0.18, 0.22, 0.25, 0.28, 0.32, 0.36, 0.41, 0.45, 0.5, 0.54, 0.58, 0.62, 0.66, 0.7, 0.75, 0.8],
  },
  {
    label: "OVERALL · 92%",
    color: "#A51C30",
    // Steeper, with a small recovery dip mid-way
    values: [0.20, 0.30, 0.42, 0.50, 0.55, 0.58, 0.60, 0.62, 0.59, 0.65, 0.74, 0.82, 0.86, 0.89, 0.91, 0.92],
  },
  {
    label: "AMBIGUITY δ",
    color: "#f0ede5",
    // Rapid decay (lower is better for ambiguity)
    values: [0.85, 0.78, 0.66, 0.54, 0.42, 0.32, 0.24, 0.18, 0.13, 0.10, 0.08, 0.06, 0.045, 0.030, 0.022, 0.016],
  },
]

export function StatsSparkline() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = d3.select(wrapRef.current)
    if (wrap.empty()) return
    wrap.selectAll("*").remove()

    SERIES.forEach((s) => {
      const W = 280
      const H = 80
      const padX = 8
      const padY = 12

      const cell = wrap
        .append("div")
        .style("flex", "1")
        .style("min-width", "0")

      cell
        .append("div")
        .attr("class", "marketing-mono")
        .style("font-size", "10px")
        .style("letter-spacing", "0.18em")
        .style("color", "var(--hb-text-faint)")
        .style("margin-bottom", "8px")
        .text(s.label)

      const svg = cell
        .append("svg")
        .attr("viewBox", `0 0 ${W} ${H}`)
        .attr("width", "100%")
        .attr("height", H)
        .attr("preserveAspectRatio", "none")

      const x = d3.scaleLinear().domain([0, s.values.length - 1]).range([padX, W - padX])
      const y = d3.scaleLinear().domain([0, 1]).range([H - padY, padY])

      const area = d3
        .area<number>()
        .x((_, i) => x(i))
        .y0(H - padY)
        .y1((d) => y(d))
        .curve(d3.curveCatmullRom.alpha(0.5))

      const line = d3
        .line<number>()
        .x((_, i) => x(i))
        .y((d) => y(d))
        .curve(d3.curveCatmullRom.alpha(0.5))

      // Gradient fill
      const gradId = `spark-grad-${s.label.replace(/[^a-z0-9]/gi, "")}`
      const defs = svg.append("defs")
      const grad = defs
        .append("linearGradient")
        .attr("id", gradId)
        .attr("x1", "0")
        .attr("x2", "0")
        .attr("y1", "0")
        .attr("y2", "1")
      grad.append("stop").attr("offset", "0%").attr("stop-color", s.color).attr("stop-opacity", 0.35)
      grad.append("stop").attr("offset", "100%").attr("stop-color", s.color).attr("stop-opacity", 0.0)

      svg
        .append("path")
        .attr("d", area(s.values) as string)
        .attr("fill", `url(#${gradId})`)

      const path = svg
        .append("path")
        .attr("d", line(s.values) as string)
        .attr("fill", "none")
        .attr("stroke", s.color)
        .attr("stroke-width", 1.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")

      // Stroke draw-on animation
      const total = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr("stroke-dasharray", total)
        .attr("stroke-dashoffset", total)
        .transition()
        .duration(1800)
        .ease(d3.easeQuadOut)
        .attr("stroke-dashoffset", 0)

      // End-point dot
      const lastIdx = s.values.length - 1
      svg
        .append("circle")
        .attr("cx", x(lastIdx))
        .attr("cy", y(s.values[lastIdx]))
        .attr("r", 0)
        .attr("fill", s.color)
        .style("filter", `drop-shadow(0 0 6px ${s.color})`)
        .transition()
        .delay(1800)
        .duration(400)
        .attr("r", 3.5)
    })
  }, [])

  return (
    <div
      ref={wrapRef}
      className="flex gap-6 mt-12 flex-wrap"
      style={{ maxWidth: 960, margin: "48px auto 0" }}
      aria-hidden="true"
    />
  )
}
