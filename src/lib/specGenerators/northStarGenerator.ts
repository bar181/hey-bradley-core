import type { MasterConfig } from '@/lib/schemas'
import { getSpecTemplate } from '@/data/spec-templates'
import { SECTION_DESCRIPTIONS, SECTION_LABELS, PRESET_MOODS } from './helpers'

/**
 * North Star Generator — vision doc that reads like a real product brief.
 * A PM reads this and understands the entire project in 5 minutes.
 *
 * Section order and labels are driven by the north-star template JSON.
 * Rendering logic per section lives in the sectionRenderers map.
 */
export function generateNorthStar(config: MasterConfig): string {
  const template = getSpecTemplate('north-star')
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const title = site.title || 'Untitled Website'
  const desc = site.description || ''
  const mood = PRESET_MOODS[theme.preset] || 'Custom visual theme'
  const heroSection = enabled.find((s) => s.type === 'hero')
  const heroHeadline = heroSection ? getHeroHeadline(heroSection) : ''
  const ctaSection = enabled.find((s) => s.type === 'action')
  const ctaText = ctaSection ? getCtaText(ctaSection) : ''
  const hasTestimonials = enabled.some((s) => s.type === 'quotes')
  const hasPricing = enabled.some((s) => s.type === 'pricing')
  const hasNumbers = enabled.some((s) => s.type === 'numbers')
  const disabled = sections.filter((s) => !s.enabled)

  // Shared context passed to each section renderer
  const ctx = {
    site, theme, sections, enabled, disabled, title, desc, mood,
    heroHeadline, ctaText, hasTestimonials, hasPricing, hasNumbers,
  }

  // --- Header (not part of template sections) ---
  let spec = `# North Star: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Spec Version:** ${site.version || '1.0.0-RC1'}\n\n`
  spec += `This North Star document defines the product vision, market fit, and success criteria for ${title}. `
  spec += `It serves as the strategic guide for all design and development decisions, ensuring alignment between stakeholders on the project's core purpose and target audience.\n\n`
  spec += `---\n\n`

  // --- Template-driven sections ---
  const templateSections = template.sections ?? []
  templateSections.forEach((section, idx) => {
    const renderer = sectionRenderers[section.id]
    if (renderer) {
      spec += renderer(idx + 1, section.label, ctx)
    }
  })

  return spec
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RenderContext {
  site: MasterConfig['site']
  theme: MasterConfig['theme']
  sections: MasterConfig['sections']
  enabled: MasterConfig['sections']
  disabled: MasterConfig['sections']
  title: string
  desc: string
  mood: string
  heroHeadline: string
  ctaText: string
  hasTestimonials: boolean
  hasPricing: boolean
  hasNumbers: boolean
}

type SectionRenderer = (num: number, label: string, ctx: RenderContext) => string

// ---------------------------------------------------------------------------
// Section renderers — keyed by template section id
// ---------------------------------------------------------------------------

const sectionRenderers: Record<string, SectionRenderer> = {
  overview(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `| Property | Value |\n|----------|-------|\n`
    s += `| **Title** | ${ctx.title} |\n`
    if (ctx.site.author) s += `| **Author** | ${ctx.site.author} |\n`
    if (ctx.site.email) s += `| **Email** | ${ctx.site.email} |\n`
    if (ctx.site.domain) s += `| **Domain** | ${ctx.site.domain} |\n`
    s += `| **Theme** | ${ctx.theme.preset || 'custom'} (${ctx.theme.mode}) |\n`
    s += `| **Border Radius** | ${ctx.theme.borderRadius || '12px'} |\n`
    s += `| **Spacing** | padding ${ctx.theme.spacing?.sectionPadding || '64px'}, max-width ${ctx.theme.spacing?.containerMaxWidth || '1280px'}, gap ${ctx.theme.spacing?.componentGap || '24px'} |\n`
    s += `\n`
    return s
  },

  vision(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `**${ctx.title}** is a ${ctx.theme.mode === 'dark' ? 'dark-themed' : 'light-themed'} marketing website `
    s += `built on the "${ctx.theme.preset || 'custom'}" design system. `
    if (ctx.desc) s += `${ctx.desc} `
    s += `\n\nThe site uses ${ctx.enabled.length} content sections to guide visitors from awareness to action. `
    s += `The visual mood is: *${ctx.mood}*.\n\n`
    if (ctx.disabled.length > 0) {
      s += `**Disabled sections:** ${ctx.disabled.map(sec => SECTION_LABELS[sec.type] || sec.type).join(', ')}\n\n`
    }
    return s
  },

  product_market_fit(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `| Element | Value |\n|---------|-------|\n`
    if (ctx.heroHeadline) s += `| **Value Proposition** | "${ctx.heroHeadline}" |\n`
    s += `| **Target Audience** | Visitors seeking ${inferAudience(ctx.theme.preset, ctx.enabled)} |\n`
    if (ctx.ctaText) s += `| **Primary Action** | "${ctx.ctaText}" |\n`
    s += `| **Trust Signals** | ${inferTrustSignals(ctx.enabled)} |\n`
    s += `| **Sections** | ${ctx.enabled.length} active (${ctx.enabled.map(sec => SECTION_LABELS[sec.type] || sec.type).join(', ')}) |\n\n`
    return s
  },

  site_structure(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    ctx.enabled.forEach((sec, i) => {
      const sLabel = SECTION_LABELS[sec.type] || sec.type
      const description = SECTION_DESCRIPTIONS[sec.type] || ''
      const heading = (sec.content as Record<string, unknown>)?.heading as string
      s += `${i + 1}. **${sLabel}**`
      if (sec.variant) s += ` (${sec.variant})`
      if (heading) s += ` — "${heading}"`
      s += `\n   ${description}\n\n`
    })
    return s
  },

  user_personas(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `### First-Time Visitor\n`
    s += `- **Goal:** Understand what ${ctx.title} offers in under 10 seconds\n`
    s += `- **Entry point:** Hero section with headline${ctx.heroHeadline ? ` "${ctx.heroHeadline}"` : ''}\n`
    s += `- **Journey:** Hero → ${ctx.hasNumbers ? 'Stats (reviews key metrics) → ' : ''}${ctx.hasPricing ? 'Pricing (compares pricing tiers) → ' : ''}${ctx.hasTestimonials ? 'Testimonials (reads social proof) → ' : ''}CTA\n`
    s += `- **Success metric:** Clicks primary CTA${ctx.ctaText ? ` ("${ctx.ctaText}")` : ''}\n\n`
    s += `### Returning Visitor\n`
    s += `- **Goal:** Find specific information or take action\n`
    s += `- **Entry point:** Navigation bar or direct link\n`
    s += `- **Journey:** Nav → ${ctx.hasPricing ? 'Pricing (compares plans)' : 'Specific section'} → Action\n`
    s += `- **Success metric:** Completes conversion or finds needed info\n\n`
    return s
  },

  success_criteria(num, label, ctx) {
    let s = `## ${num}. ${label}\n\n`
    s += `1. **First impression (< 3s):** Visitor understands the value proposition from the hero headline\n`
    s += `2. **Visual quality:** Site looks like a funded startup product, not a template\n`
    s += `3. **Mobile responsive:** All ${ctx.enabled.length} sections render correctly at 375px\n`
    s += `4. **Accessibility:** WCAG 2.1 AA contrast ratios on all text\n`
    s += `5. **Performance:** Initial paint < 2 seconds on 4G connection\n`
    return s
  },
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getHeroHeadline(section: { components?: Array<{ id: string; props?: Record<string, unknown> }> }): string {
  const headline = section.components?.find((c) => c.id === 'headline')
  return (headline?.props?.text as string) || ''
}

function getCtaText(section: { components?: Array<{ id: string; type: string; props?: Record<string, unknown> }> }): string {
  const btn = section.components?.find((c) => c.type === 'button' || c.id === 'button')
  return (btn?.props?.text as string) || ''
}

function inferAudience(preset: string, sections: Array<{ type: string }>): string {
  const map: Record<string, string> = {
    saas: 'a SaaS product or technical service',
    agency: 'creative or professional agency services',
    portfolio: 'a creative professional\'s portfolio',
    blog: 'written content and thought leadership',
    startup: 'an innovative product or technology',
    personal: 'a personal brand or individual service',
    professional: 'professional or consulting services',
    wellness: 'a wellness, food, or lifestyle brand',
    creative: 'a creative or artistic offering',
    minimalist: 'a clean, focused product or service',
  }
  return map[preset] || `the products and services offered (${sections.length} sections)`
}

function inferTrustSignals(sections: Array<{ type: string }>): string {
  const signals: string[] = []
  if (sections.some(s => s.type === 'quotes')) signals.push('Customer testimonials')
  if (sections.some(s => s.type === 'logos')) signals.push('Partner/client logos')
  if (sections.some(s => s.type === 'numbers')) signals.push('Key metrics/statistics')
  if (sections.some(s => s.type === 'team')) signals.push('Team member profiles')
  return signals.length > 0 ? signals.join(', ') : 'None configured'
}
