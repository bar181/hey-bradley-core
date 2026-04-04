/**
 * Section-level Crystal Atom rules registry (ADR-032).
 *
 * Maps each section type to:
 *  - gamma:    Formal Γ constraints (parameterized by actual section data)
 *  - evidence: Ε verification expressions (parameterized by actual section data)
 *  - variants: Valid variant names for the type
 *
 * Rule generators receive the section instance so they can produce
 * concrete, data-specific rules — NOT generic universals.
 */

import type { Component } from '@/lib/schemas/section'
import type { Layout } from '@/lib/schemas/layout'
import type { Style } from '@/lib/schemas/style'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectionData {
  type: string
  id: string
  variant?: string
  layout: Layout
  style: Style
  content: Record<string, unknown>
  components: Component[]
}

export interface SectionRuleSet {
  /** Concrete Γ rules referencing actual data values */
  gamma: string[]
  /** Ε verification checks referencing actual data values */
  evidence: string[]
  /** Valid variants for this section type */
  variants: string[]
}

type RuleGenerator = (s: SectionData) => SectionRuleSet

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(v: unknown): string {
  if (v === undefined || v === null) return '⊥'
  if (typeof v === 'string') return `"${v}"`
  return String(v)
}

function compCount(s: SectionData): number {
  return s.components.filter(c => c.enabled).length
}

// ---------------------------------------------------------------------------
// Per-section-type rule generators
// ---------------------------------------------------------------------------

const heroRules: RuleGenerator = (s) => {
  const v = s.variant || 'centered'
  const comps = s.components.filter(c => c.enabled)
  const headline = comps.find(c => c.id === 'headline' || c.type === 'heading')
  const cta = comps.find(c => c.id === 'primaryCta' || c.type === 'button')

  const gamma: string[] = [
    `R1: hero.variant = "${v}"`,
  ]
  if (headline?.props?.text) {
    gamma.push(`R2: hero.components.headline.text = ${esc(headline.props.text)}`)
  }
  if (cta?.enabled) {
    gamma.push(`R3: hero.components.primaryCta.enabled = ⊤ ⟹ hero.components.primaryCta.props.url ≠ ⊥`)
  }
  if (s.style?.background) {
    gamma.push(`R${gamma.length + 1}: □ hero.style.background = ${esc(s.style.background)}`)
  }

  const evidence: string[] = [
    `V1: VERIFY hero.variant = "${v}"`,
  ]
  if (headline?.props?.text) {
    evidence.push(`V2: VERIFY hero.components.headline.text ≠ ⊥`)
  }
  if (s.style?.background) {
    evidence.push(`V${evidence.length + 1}: VERIFY hero.style.background = ${esc(s.style.background)}`)
  }

  return {
    gamma,
    evidence,
    variants: ['centered', 'split', 'overlay', 'minimal', 'video', 'gradient'],
  }
}

const menuRules: RuleGenerator = (s) => {
  const v = s.variant || 'simple'
  const comps = s.components.filter(c => c.enabled)
  const brand = comps.find(c => c.type === 'heading' || c.id === 'brand')

  const gamma: string[] = [
    `R1: menu.variant = "${v}"`,
  ]
  if (brand?.props?.text) {
    gamma.push(`R2: menu.components.brand.text = ${esc(brand.props.text)}`)
  }
  gamma.push(`R${gamma.length + 1}: □ menu.position = "sticky" ∨ menu.position = "fixed"`)

  const evidence: string[] = [
    `V1: VERIFY menu.variant = "${v}"`,
    `V2: VERIFY |menu.components| ≥ 1`,
  ]

  return {
    gamma,
    evidence,
    variants: ['simple', 'centered'],
  }
}

const columnsRules: RuleGenerator = (s) => {
  const v = s.variant || 'cards'
  const cols = s.layout?.columns || 3
  const comps = s.components.filter(c => c.enabled)

  const gamma: string[] = [
    `R1: columns.variant = "${v}"`,
    `R2: columns.layout.columns = ${cols}`,
    `R3: |columns.components| = ${comps.length}`,
  ]
  // Check all cards have text
  const allHaveText = comps.every(c => c.props?.title || c.props?.text)
  if (allHaveText && comps.length > 0) {
    gamma.push(`R4: ∀ card ∈ columns.components : ∃ card.props.title ≠ ⊥`)
  }

  const evidence: string[] = [
    `V1: VERIFY columns.variant = "${v}"`,
    `V2: VERIFY columns.layout.columns = ${cols}`,
    `V3: VERIFY |columns.components| = ${comps.length}`,
  ]

  return {
    gamma,
    evidence,
    variants: ['cards', 'image-cards', 'glass', 'gradient', 'horizontal', 'icon-text', 'minimal', 'numbered'],
  }
}

const pricingRules: RuleGenerator = (s) => {
  const v = s.variant || 'tiers'
  const comps = s.components.filter(c => c.enabled)
  const highlighted = comps.find(c => c.props?.highlighted === true)

  const gamma: string[] = [
    `R1: pricing.variant = "${v}"`,
    `R2: |pricing.components| = ${comps.length}`,
    `R3: ∀ tier ∈ pricing.components : tier.props.price ≠ ⊥ ∧ tier.props.period ≠ ⊥`,
  ]
  if (highlighted) {
    gamma.push(`R4: ∃! tier ∈ pricing.components : tier.props.highlighted = ⊤`)
  }

  const evidence: string[] = [
    `V1: VERIFY pricing.variant = "${v}"`,
    `V2: VERIFY |pricing.tiers| = ${comps.length}`,
    `V3: VERIFY ∀ tier : tier.props.price ≠ ⊥`,
  ]

  return {
    gamma,
    evidence,
    variants: ['tiers', 'toggle', 'comparison'],
  }
}

const quotesRules: RuleGenerator = (s) => {
  const v = s.variant || 'cards'
  const comps = s.components.filter(c => c.enabled)

  const gamma: string[] = [
    `R1: quotes.variant = "${v}"`,
    `R2: |quotes.components| = ${comps.length}`,
    `R3: ∀ q ∈ quotes.components : q.props.text ≠ ⊥ ∨ q.props.quote ≠ ⊥`,
    `R4: ∀ q ∈ quotes.components : q.props.author ≠ ⊥`,
  ]

  const evidence: string[] = [
    `V1: VERIFY quotes.variant = "${v}"`,
    `V2: VERIFY |quotes.components| = ${comps.length}`,
    `V3: VERIFY ∀ q ∈ quotes.components : q.props.author ≠ ⊥`,
  ]

  return {
    gamma,
    evidence,
    variants: ['cards', 'minimal', 'single', 'stars'],
  }
}

const questionsRules: RuleGenerator = (s) => {
  const v = s.variant || 'accordion'
  const comps = s.components.filter(c => c.enabled)

  const gamma: string[] = [
    `R1: questions.variant = "${v}"`,
    `R2: |questions.components| = ${comps.length}`,
    `R3: ∀ faq ∈ questions.components : faq.props.question ≠ ⊥ ∧ faq.props.answer ≠ ⊥`,
  ]

  const evidence: string[] = [
    `V1: VERIFY questions.variant = "${v}"`,
    `V2: VERIFY |questions.components| = ${comps.length}`,
    `V3: VERIFY ∀ faq : faq.props.question ≠ ⊥ ∧ faq.props.answer ≠ ⊥`,
  ]

  return {
    gamma,
    evidence,
    variants: ['accordion', 'cards', 'numbered', 'two-col'],
  }
}

const numbersRules: RuleGenerator = (s) => {
  const v = s.variant || 'counters'
  const comps = s.components.filter(c => c.enabled)

  const gamma: string[] = [
    `R1: numbers.variant = "${v}"`,
    `R2: |numbers.components| = ${comps.length}`,
    `R3: ∀ stat ∈ numbers.components : stat.props.value ≠ ⊥ ∧ stat.props.label ≠ ⊥`,
  ]
  if (s.style?.background) {
    gamma.push(`R4: □ numbers.style.background = ${esc(s.style.background)}`)
  }

  const evidence: string[] = [
    `V1: VERIFY numbers.variant = "${v}"`,
    `V2: VERIFY |numbers.components| = ${comps.length}`,
    `V3: VERIFY ∀ stat : stat.props.value ≠ ⊥`,
  ]

  return {
    gamma,
    evidence,
    variants: ['counters', 'cards', 'gradient', 'icons'],
  }
}

const actionRules: RuleGenerator = (s) => {
  const v = s.variant || 'centered'
  const heading = (s.content as Record<string, unknown>)?.heading as string | undefined
  const comps = s.components.filter(c => c.enabled)
  const btn = comps.find(c => c.type === 'button')

  const gamma: string[] = [
    `R1: action.variant = "${v}"`,
  ]
  if (heading) {
    gamma.push(`R2: action.content.heading = ${esc(heading)}`)
  }
  if (btn?.props?.text) {
    gamma.push(`R${gamma.length + 1}: action.components.cta.text = ${esc(btn.props.text)}`)
  }

  const evidence: string[] = [
    `V1: VERIFY action.variant = "${v}"`,
    `V2: VERIFY |action.components| ≥ 1`,
  ]

  return {
    gamma,
    evidence,
    variants: ['centered', 'split', 'gradient', 'newsletter'],
  }
}

const footerRules: RuleGenerator = (s) => {
  const v = s.variant || 'multi-column'
  const comps = s.components.filter(c => c.enabled)
  const brand = comps.find(c => c.type === 'footer-brand')
  const copyright = comps.find(c => c.type === 'footer-copyright')

  const gamma: string[] = [
    `R1: footer.variant = "${v}"`,
    `R2: |footer.components| = ${comps.length}`,
  ]
  if (brand?.props?.text) {
    gamma.push(`R3: footer.components.brand.text = ${esc(brand.props.text)}`)
  }
  if (copyright?.props?.text) {
    gamma.push(`R${gamma.length + 1}: footer.components.copyright.text = ${esc(copyright.props.text)}`)
  }

  const evidence: string[] = [
    `V1: VERIFY footer.variant = "${v}"`,
    `V2: VERIFY ∃ footer.components.copyright`,
  ]

  return {
    gamma,
    evidence,
    variants: ['multi-column', 'simple', 'simple-bar', 'minimal'],
  }
}

const galleryRules: RuleGenerator = (s) => {
  const v = s.variant || 'grid'
  const n = compCount(s)

  return {
    gamma: [
      `R1: gallery.variant = "${v}"`,
      `R2: |gallery.components| = ${n}`,
      `R3: ∀ img ∈ gallery.components : img.props.src ≠ ⊥ ∨ img.props.url ≠ ⊥`,
    ],
    evidence: [
      `V1: VERIFY gallery.variant = "${v}"`,
      `V2: VERIFY |gallery.components| = ${n}`,
    ],
    variants: ['grid', 'masonry', 'carousel', 'full-width'],
  }
}

const logosRules: RuleGenerator = (s) => {
  const v = s.variant || 'simple'
  const n = compCount(s)

  return {
    gamma: [
      `R1: logos.variant = "${v}"`,
      `R2: |logos.components| = ${n}`,
    ],
    evidence: [
      `V1: VERIFY logos.variant = "${v}"`,
      `V2: VERIFY |logos.components| = ${n}`,
    ],
    variants: ['simple', 'grid', 'marquee'],
  }
}

const teamRules: RuleGenerator = (s) => {
  const v = s.variant || 'cards'
  const n = compCount(s)

  return {
    gamma: [
      `R1: team.variant = "${v}"`,
      `R2: |team.components| = ${n}`,
      `R3: ∀ member ∈ team.components : member.props.name ≠ ⊥ ∧ member.props.role ≠ ⊥`,
    ],
    evidence: [
      `V1: VERIFY team.variant = "${v}"`,
      `V2: VERIFY |team.components| = ${n}`,
      `V3: VERIFY ∀ member : member.props.name ≠ ⊥`,
    ],
    variants: ['cards', 'grid', 'minimal'],
  }
}

const imageRules: RuleGenerator = (s) => {
  const v = s.variant || 'full-width'
  const comps = s.components.filter(c => c.enabled)
  const img = comps.find(c => c.type === 'image')

  return {
    gamma: [
      `R1: image.variant = "${v}"`,
      ...(img?.props?.src ? [`R2: image.components.image.src = ${esc(img.props.src)}`] : []),
      ...(img?.props?.alt ? [`R${img?.props?.src ? 3 : 2}: image.components.image.alt = ${esc(img.props.alt)}`] : []),
    ],
    evidence: [
      `V1: VERIFY image.variant = "${v}"`,
      `V2: VERIFY image.components.image.src ≠ ⊥`,
    ],
    variants: ['full-width', 'with-text', 'overlay', 'parallax'],
  }
}

const dividerRules: RuleGenerator = (s) => {
  const v = s.variant || 'line'

  return {
    gamma: [
      `R1: divider.variant = "${v}"`,
    ],
    evidence: [
      `V1: VERIFY divider.variant = "${v}"`,
    ],
    variants: ['line', 'decorative', 'space'],
  }
}

const textRules: RuleGenerator = (s) => {
  const v = s.variant || 'single'
  const n = compCount(s)

  return {
    gamma: [
      `R1: text.variant = "${v}"`,
      `R2: |text.components| = ${n}`,
    ],
    evidence: [
      `V1: VERIFY text.variant = "${v}"`,
      `V2: VERIFY |text.components| = ${n}`,
    ],
    variants: ['single', 'two-column', 'with-sidebar'],
  }
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const ruleGenerators: Record<string, RuleGenerator> = {
  hero: heroRules,
  menu: menuRules,
  columns: columnsRules,
  pricing: pricingRules,
  quotes: quotesRules,
  questions: questionsRules,
  numbers: numbersRules,
  action: actionRules,
  footer: footerRules,
  gallery: galleryRules,
  logos: logosRules,
  team: teamRules,
  image: imageRules,
  divider: dividerRules,
  text: textRules,
}

/**
 * Generate section-specific Γ rules, Ε evidence, and variant list
 * for a given section instance. Returns concrete rules with actual
 * data values — NOT generic universals.
 */
export function getSectionRules(section: SectionData): SectionRuleSet {
  const gen = ruleGenerators[section.type]
  if (!gen) {
    // Fallback for unknown section types
    return {
      gamma: [`R1: ${section.type}.variant = "${section.variant || 'default'}"`],
      evidence: [`V1: VERIFY ${section.type}.variant = "${section.variant || 'default'}"`],
      variants: [section.variant || 'default'],
    }
  }
  return gen(section)
}
