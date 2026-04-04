import type { MasterConfig } from '@/lib/schemas'
import { describeComponentProps } from './helpers'
import { getSectionRules, type SectionData } from './sectionRules'

/**
 * AISP 5.1 Crystal Atom Generator — Section-Level Atoms (ADR-032).
 *
 * Produces a master Crystal Atom ⟦Ω, Σ, {⟦Γ_t, Λ_t, Ε_t⟧}, Ε⟧ where
 * each enabled section gets its own sub-atom with:
 *   - Concrete Γ rules (specific values, not generic universals)
 *   - Complete Λ bindings (ALL component props inline)
 *   - Per-section Ε evidence (verifiable checks)
 *
 * Changes from Phase 9 monolithic generator:
 *   A. Formal Ω (no prose) — render() with constraints
 *   B. Section-level Γ rules — data-specific per section
 *   C. Complete Λ bindings — every prop for every component
 *   D. Section-level Ε evidence — per-section verification
 *   E. Backward compatible — still passes aisp_validate (5/5 components)
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

  // ─── Ω — Formal Objective (no prose) ───
  spec += `  Ω := {\n`
  spec += `    render(Site, ${esc(title)}) |\n`
  spec += `      |sections| = ${enabled.length} ∧\n`
  spec += `      theme.preset = ${esc(theme.preset || 'custom')} ∧\n`
  spec += `      theme.mode = ${esc(theme.mode)} ∧\n`
  spec += `      theme.typography.fontFamily = ${esc(theme.typography?.fontFamily || 'Inter')}\n`
  spec += `  }\n\n`

  // ─── Σ — Type System ───
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
  spec += `    SectionType : 𝕋 := {${[...new Set(enabled.map(s => s.type))].join(', ')}},\n`
  // Brownfield types (ADR-033) — notation only, activates with repo connect
  spec += `    BrownfieldOp : 𝕋 := { reuse: Path → Component, extends: Base → Override, imports: Module → Schema },\n`
  spec += `    CodebaseRef : 𝕋 := { repo: 𝕊, branch: 𝕊, path: 𝕊, hash: Hash? }\n`
  spec += `  }\n\n`

  // ─── Global Λ — Site + Theme bindings ───
  spec += `  Λ := {\n`
  spec += `    site := {\n`
  spec += `      title: ${esc(site.title || '')},\n`
  if (site.description) spec += `      description: ${esc(site.description)},\n`
  if (site.author) spec += `      author: ${esc(site.author)},\n`
  if (site.domain) spec += `      domain: ${esc(site.domain)}\n`
  spec += `    },\n`
  spec += `    theme := ${esc(theme.preset || 'custom')},\n`
  spec += `    mode := ${esc(theme.mode)},\n`
  spec += `    typography := {\n`
  spec += `      fontFamily: ${esc(theme.typography?.fontFamily || 'Inter')},\n`
  spec += `      headingFamily: ${esc(theme.typography?.headingFamily || theme.typography?.fontFamily || 'Inter')},\n`
  spec += `      headingWeight: ${theme.typography?.headingWeight || 700},\n`
  spec += `      baseSize: ${esc(theme.typography?.baseSize || '16px')},\n`
  spec += `      lineHeight: ${theme.typography?.lineHeight || 1.7}\n`
  spec += `    },\n`
  spec += `    spacing := {\n`
  spec += `      sectionPadding: ${esc(theme.spacing?.sectionPadding || '64px')},\n`
  spec += `      containerMaxWidth: ${esc(theme.spacing?.containerMaxWidth || '1280px')},\n`
  spec += `      componentGap: ${esc(theme.spacing?.componentGap || '24px')}\n`
  spec += `    },\n`
  spec += `    borderRadius := ${esc(theme.borderRadius || '12px')},\n`
  if (p) {
    spec += `    palette := ⟨\n`
    spec += `      bg₁: "${p.bgPrimary}",\n`
    spec += `      bg₂: "${p.bgSecondary}",\n`
    spec += `      txt₁: "${p.textPrimary}",\n`
    spec += `      txt₂: "${p.textSecondary}",\n`
    spec += `      acc₁: "${p.accentPrimary}",\n`
    spec += `      acc₂: "${p.accentSecondary}"\n`
    spec += `    ⟩\n`
  }
  spec += `  }\n\n`

  // ─── Global Γ — Brownfield Integration Rules (ADR-033) ───
  spec += `  Γ := {\n`
  spec += `    % ─── Brownfield Integration (activates when repo connected) ───\n`
  spec += `    R_reuse: □ IF repo_connected THEN reuse(components, "src/components/"),\n`
  spec += `    R_design_sys: □ IF design_tokens THEN imports(tokens, "src/styles/"),\n`
  spec += `    R_extends: □ IF base_layout THEN extends(BaseLayout, sections),\n`
  spec += `    % Note: brownfield analysis requires GitHub Connect (Pro tier)\n`
  spec += `  }\n\n`

  // ─── Per-Section Crystal Atoms ───
  enabled.forEach((s) => {
    const sectionData: SectionData = {
      type: s.type,
      id: s.id,
      variant: s.variant,
      layout: s.layout,
      style: s.style,
      content: s.content as Record<string, unknown>,
      components: s.components ?? [],
    }
    const rules = getSectionRules(sectionData)
    const comps = (s.components ?? []).filter(c => c.enabled)
    const heading = (s.content as Record<string, unknown>)?.heading as string | undefined
    const subheading = (s.content as Record<string, unknown>)?.subheading as string | undefined

    spec += `  ⟦${s.type}:${s.id}⟧ := {\n`

    // Γ — Section-specific rules
    spec += `    Γ_${s.type} := {\n`
    rules.gamma.forEach((r) => {
      spec += `      ${r},\n`
    })
    spec += `    }\n\n`

    // Λ — Complete component bindings (ALL props)
    spec += `    Λ_${s.type} := {\n`
    spec += `      variant: ${esc(s.variant || 'default')},\n`
    if (heading) spec += `      heading: ${esc(heading)},\n`
    if (subheading) spec += `      subheading: ${esc(subheading)},\n`
    if (s.style?.background) spec += `      background: ${esc(s.style.background)},\n`
    if (s.style?.color) spec += `      color: ${esc(s.style.color)},\n`
    if (s.layout?.columns) spec += `      columns: ${s.layout.columns},\n`
    if (s.layout?.gap) spec += `      gap: ${esc(s.layout.gap)},\n`
    if (s.layout?.padding) spec += `      padding: ${esc(s.layout.padding)},\n`
    if (s.layout?.display) spec += `      display: ${esc(s.layout.display)},\n`
    if (s.layout?.direction) spec += `      direction: ${esc(s.layout.direction)},\n`

    // Component bindings — EVERY prop for EVERY component
    if (comps.length > 0) {
      spec += `      components := [\n`
      comps.forEach((c, j) => {
        const allProps = describeComponentProps(c)
        const propStr = allProps.length > 0 ? `, ${allProps.join(', ')}` : ''
        spec += `        ⟨${c.id}: ${c.type}${propStr}⟩${j < comps.length - 1 ? ',' : ''}\n`
      })
      spec += `      ]\n`
    }
    spec += `    }\n\n`

    // Ε — Section-level evidence
    spec += `    Ε_${s.type} := {\n`
    rules.evidence.forEach((e) => {
      spec += `      ${e},\n`
    })
    spec += `    }\n`

    spec += `  }\n\n`
  })

  // ─── Global Ε — Site-level verification ───
  spec += `  Ε := {\n`
  spec += `    V1: VERIFY ∀ s ∈ sections : render(s) ≠ ⊥,\n`
  spec += `    V2: VERIFY palette_contrast(txt₁, bg₁) ≥ 4.5:1,\n`
  spec += `    V3: VERIFY responsive(375px) ∧ responsive(768px) ∧ responsive(1440px),\n`
  spec += `    V4: VERIFY |sections| = ${enabled.length},\n`
  spec += `    V5: VERIFY ∀ c ∈ components : c.text ≠ ⊥ ⟹ rendered(c.text),\n`
  spec += `    V6: VERIFY font_loaded(${esc(theme.typography?.fontFamily || 'Inter')}),\n`
  spec += `    V7: VERIFY section_order_preserved(sections),\n`
  // Brownfield evidence (ADR-033) — conditional on repo connection
  spec += `    V_BF: □ IF repo_connected THEN VERIFY ∀ ref ∈ reuse_refs : exists(ref.path)\n`
  spec += `  }\n`

  spec += `⟧\n\n`
  spec += `% Generated by Hey Bradley | spec: aisp-5.1 | tier: platinum\n`
  spec += `% Ambiguity target: < 2% | All 5 Crystal Atom components present\n`
  spec += `% Section-level Crystal Atoms: ${enabled.length} sub-atoms with Γ/Λ/Ε per section\n`

  return spec
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(v: unknown): string {
  if (v === undefined || v === null) return '⊥'
  if (typeof v === 'string') return `"${v}"`
  return String(v)
}
