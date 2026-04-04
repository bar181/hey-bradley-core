import type { MasterConfig } from '@/lib/schemas'
import { getComponentText } from './helpers'

/**
 * AISP Spec Generator — fixes ALL B- bugs from spec-review-findings.md:
 * - NO 30-char truncation — full text preserved
 * - NO slice(0,4) — ALL components shown
 * - content.heading and content.subheading included
 * - Proper spacing values in Λ bindings
 * - Every Crystal Atom has all 5 components (Ω, Σ, Γ, Λ, Ε)
 */
export function generateAISPSpec(config: MasterConfig): string {
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const p = theme.palette
  const title = site.title || 'Untitled'

  let spec = `% AISP 5.1 | Crystal Atom Platinum | <2% ambiguity target\n`
  spec += `% Site: ${title}\n`
  spec += `% Generated: ${new Date().toISOString().split('T')[0]}\n\n`

  // Master Crystal Atom
  spec += `⟦\n`

  // Ω — Objective
  spec += `  Ω := {\n`
  spec += `    Render marketing website "${title}": ${enabled.length} sections,\n`
  spec += `    theme: "${theme.preset || 'custom'}",\n`
  spec += `    mode: ${theme.mode},\n`
  spec += `    font: "${theme.typography?.fontFamily || 'Inter'}"\n`
  spec += `  }\n\n`

  // Σ — Type System
  spec += `  Σ := {\n`
  spec += `    MasterConfig : 𝕋 := { site: Site, theme: Theme, sections: Section 𝕃 },\n`
  spec += `    Site : 𝕋 := { title: 𝕊, description: 𝕊, author: 𝕊, domain: 𝕊 },\n`
  spec += `    Theme : 𝕋 := { preset: 𝕊, mode: 𝕊, palette: Palette, typography: Typography, spacing: Spacing },\n`
  spec += `    Palette : 𝕋 := { bg₁: 𝕊, bg₂: 𝕊, txt₁: 𝕊, txt₂: 𝕊, acc₁: 𝕊, acc₂: 𝕊 },\n`
  spec += `    Typography : 𝕋 := { fontFamily: 𝕊, headingFamily: 𝕊, headingWeight: ℕ, baseSize: 𝕊, lineHeight: ℝ },\n`
  spec += `    Spacing : 𝕋 := { sectionPadding: 𝕊, containerMaxWidth: 𝕊, componentGap: 𝕊 },\n`
  spec += `    Section : 𝕋 := { type: SectionType, id: 𝕊, variant: 𝕊, heading: 𝕊?, subheading: 𝕊?,\n`
  spec += `                      layout: Layout, style: Style, components: Component 𝕃 },\n`
  spec += `    Layout : 𝕋 := { display: 𝕊, direction: 𝕊?, columns: ℕ?, gap: 𝕊, padding: 𝕊 },\n`
  spec += `    Style : 𝕋 := { background: 𝕊, color: 𝕊, fontFamily: 𝕊?, borderRadius: 𝕊? },\n`
  spec += `    Component : 𝕋 := { id: 𝕊, type: 𝕊, enabled: 𝔹, props: Map⟨𝕊, Any⟩ },\n`
  spec += `    SectionType : 𝕋 := {${[...new Set(enabled.map(s => s.type))].join(', ')}}\n`
  spec += `  }\n\n`

  // Γ — Rules
  spec += `  Γ := {\n`
  spec += `    R1: ∀ s ∈ sections : s.enabled = ⊤ ⟹ render(s),\n`
  spec += `    R2: ∀ s ∈ sections : s.type ∈ SectionType,\n`
  spec += `    R3: ∀ c ∈ s.components : c.enabled = ⊤ ⟹ display(c),\n`
  spec += `    R4: ∀ s ∈ sections : s.style.background ≠ ⊥ ⟹ apply_bg(s),\n`
  spec += `    R5: □ mobile_responsive(375px, 768px, 1440px),\n`
  spec += `    R6: □ palette_applied(theme.palette) ∧ □ font_loaded(theme.typography.fontFamily),\n`
  spec += `    R7: □ sections_ordered(sections.order)\n`
  spec += `  }\n\n`

  // Λ — Bindings (with FULL spacing and typography)
  spec += `  Λ := {\n`
  spec += `    site := {\n`
  spec += `      title: "${site.title || ''}",\n`
  if (site.description) spec += `      description: "${site.description}",\n`
  if (site.author) spec += `      author: "${site.author}",\n`
  if (site.domain) spec += `      domain: "${site.domain}"\n`
  spec += `    },\n`
  spec += `    theme := "${theme.preset || 'custom'}",\n`
  spec += `    mode := ${theme.mode},\n`
  spec += `    typography := {\n`
  spec += `      fontFamily: "${theme.typography?.fontFamily || 'Inter'}",\n`
  spec += `      headingFamily: "${theme.typography?.headingFamily || theme.typography?.fontFamily || 'Inter'}",\n`
  spec += `      headingWeight: ${theme.typography?.headingWeight || 700},\n`
  spec += `      baseSize: "${theme.typography?.baseSize || '16px'}",\n`
  spec += `      lineHeight: ${theme.typography?.lineHeight || 1.7}\n`
  spec += `    },\n`
  spec += `    spacing := {\n`
  spec += `      sectionPadding: "${theme.spacing?.sectionPadding || '64px'}",\n`
  spec += `      containerMaxWidth: "${theme.spacing?.containerMaxWidth || '1280px'}",\n`
  spec += `      componentGap: "${theme.spacing?.componentGap || '24px'}"\n`
  spec += `    },\n`
  spec += `    borderRadius := "${theme.borderRadius || '12px'}",\n`
  if (p) {
    spec += `    palette := ⟨\n`
    spec += `      bg₁: "${p.bgPrimary}",\n`
    spec += `      bg₂: "${p.bgSecondary}",\n`
    spec += `      txt₁: "${p.textPrimary}",\n`
    spec += `      txt₂: "${p.textSecondary}",\n`
    spec += `      acc₁: "${p.accentPrimary}",\n`
    spec += `      acc₂: "${p.accentSecondary}"\n`
    spec += `    ⟩,\n`
  }
  spec += `    sections := [\n`

  // Section atoms — ALL components, FULL text, with heading/subheading
  enabled.forEach((s, i) => {
    const heading = (s.content as Record<string, unknown>)?.heading as string | undefined
    const subheading = (s.content as Record<string, unknown>)?.subheading as string | undefined
    const comps = (s.components ?? []).filter(c => c.enabled)
    const bg = s.style?.background || ''

    spec += `      ⟨\n`
    spec += `        type: ${s.type},\n`
    spec += `        variant: ${s.variant || 'default'},\n`
    if (heading) spec += `        heading: "${heading}",\n`
    if (subheading) spec += `        subheading: "${subheading}",\n`
    if (bg) spec += `        background: "${bg}",\n`
    if (s.layout?.columns) spec += `        columns: ${s.layout.columns},\n`
    if ((s.layout as any)?.padding) spec += `        padding: "${(s.layout as any).padding}",\n`
    if (s.layout?.gap) spec += `        gap: "${s.layout.gap}",\n`

    // ALL components with FULL text — NO truncation, NO slice
    spec += `        components: [\n`
    comps.forEach((c, j) => {
      const text = getComponentText(c)
      const props: string[] = []
      if (text) props.push(`text: "${text}"`)
      // Include image URLs and alt text
      if (c.props?.image) props.push(`image: "${c.props.image}"`)
      if (c.props?.imageAlt) props.push(`imageAlt: "${c.props.imageAlt}"`)
      if (c.props?.backgroundImage) props.push(`backgroundImage: "${c.props.backgroundImage}"`)
      if (c.props?.url && c.type === 'image') props.push(`url: "${c.props.url}"`)
      if (c.props?.url && c.type === 'button') props.push(`url: "${c.props.url}"`)
      if (c.props?.src) props.push(`src: "${c.props.src}"`)
      if (c.props?.alt) props.push(`alt: "${c.props.alt}"`)
      if (c.props?.video) props.push(`video: "${c.props.video}"`)
      if (c.props?.videoUrl) props.push(`videoUrl: "${c.props.videoUrl}"`)
      if (c.props?.rating !== undefined) props.push(`rating: ${c.props.rating}`)
      if (c.props?.links) props.push(`links: "${c.props.links}"`)

      spec += `          ⟨${c.id}: ${c.type}, ${props.join(', ')}⟩${j < comps.length - 1 ? ',' : ''}\n`
    })
    spec += `        ]\n`
    spec += `      ⟩${i < enabled.length - 1 ? ',' : ''}\n`
  })

  spec += `    ]\n`
  spec += `  }\n\n`

  // Ε — Evidence / Verification
  spec += `  Ε := {\n`
  spec += `    V1: VERIFY ∀ s ∈ sections : render(s) ≠ ⊥,\n`
  spec += `    V2: VERIFY palette_contrast(txt₁, bg₁) ≥ 4.5:1,\n`
  spec += `    V3: VERIFY responsive(375px) ∧ responsive(768px) ∧ responsive(1440px),\n`
  spec += `    V4: VERIFY |sections| = ${enabled.length},\n`
  spec += `    V5: VERIFY ∀ c ∈ components : c.text ≠ ⊥ ⟹ rendered(c.text),\n`
  spec += `    V6: VERIFY font_loaded("${theme.typography?.fontFamily || 'Inter'}"),\n`
  spec += `    V7: VERIFY section_order_preserved(sections)\n`
  spec += `  }\n`

  spec += `⟧\n\n`
  spec += `% Generated by Hey Bradley | spec: aisp-5.1 | tier: platinum\n`
  spec += `% Ambiguity target: < 2% | All 5 Crystal Atom components present\n`

  return spec
}
