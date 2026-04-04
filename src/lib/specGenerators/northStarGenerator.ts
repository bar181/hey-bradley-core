import type { MasterConfig } from '@/lib/schemas'
import { SECTION_DESCRIPTIONS, SECTION_LABELS, PRESET_MOODS } from './helpers'

/**
 * North Star Generator — vision doc that reads like a real product brief.
 * A PM reads this and understands the entire project in 5 minutes.
 */
export function generateNorthStar(config: MasterConfig): string {
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

  let spec = `# North Star: ${title}\n\n`
  spec += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  spec += `**Spec Version:** ${site.version || '1.0.0-RC1'}\n\n`
  spec += `This North Star document defines the product vision, market fit, and success criteria for ${title}. `
  spec += `It serves as the strategic guide for all design and development decisions, ensuring alignment between stakeholders on the project's core purpose and target audience.\n\n`
  spec += `---\n\n`

  // Overview
  spec += `## 1. Overview\n\n`
  spec += `| Property | Value |\n|----------|-------|\n`
  spec += `| **Title** | ${title} |\n`
  if (site.author) spec += `| **Author** | ${site.author} |\n`
  if (site.email) spec += `| **Email** | ${site.email} |\n`
  if (site.domain) spec += `| **Domain** | ${site.domain} |\n`
  spec += `| **Theme** | ${theme.preset || 'custom'} (${theme.mode}) |\n`
  spec += `| **Border Radius** | ${theme.borderRadius || '12px'} |\n`
  spec += `| **Spacing** | padding ${theme.spacing?.sectionPadding || '64px'}, max-width ${theme.spacing?.containerMaxWidth || '1280px'}, gap ${theme.spacing?.componentGap || '24px'} |\n`
  spec += `\n`

  // Vision
  spec += `## 2. Vision\n\n`
  spec += `**${title}** is a ${theme.mode === 'dark' ? 'dark-themed' : 'light-themed'} marketing website `
  spec += `built on the "${theme.preset || 'custom'}" design system. `
  if (desc) spec += `${desc} `
  spec += `\n\nThe site uses ${enabled.length} content sections to guide visitors from awareness to action. `
  spec += `The visual mood is: *${mood}*.\n\n`

  // Disabled sections
  const disabled = sections.filter((s) => !s.enabled)
  if (disabled.length > 0) {
    spec += `**Disabled sections:** ${disabled.map(s => SECTION_LABELS[s.type] || s.type).join(', ')}\n\n`
  }

  // PMF
  spec += `## 3. Product-Market Fit\n\n`
  spec += `| Element | Value |\n|---------|-------|\n`
  if (heroHeadline) spec += `| **Value Proposition** | "${heroHeadline}" |\n`
  spec += `| **Target Audience** | Visitors seeking ${inferAudience(theme.preset, enabled)} |\n`
  if (ctaText) spec += `| **Primary Action** | "${ctaText}" |\n`
  spec += `| **Trust Signals** | ${inferTrustSignals(enabled)} |\n`
  spec += `| **Sections** | ${enabled.length} active (${enabled.map(s => SECTION_LABELS[s.type] || s.type).join(', ')}) |\n\n`

  // Site structure
  spec += `## 4. Site Structure\n\n`
  enabled.forEach((s, i) => {
    const label = SECTION_LABELS[s.type] || s.type
    const description = SECTION_DESCRIPTIONS[s.type] || ''
    const heading = (s.content as Record<string, unknown>)?.heading as string
    spec += `${i + 1}. **${label}**`
    if (s.variant) spec += ` (${s.variant})`
    if (heading) spec += ` — "${heading}"`
    spec += `\n   ${description}\n\n`
  })

  // Personas
  spec += `## 5. User Personas\n\n`
  spec += `### First-Time Visitor\n`
  spec += `- **Goal:** Understand what ${title} offers in under 10 seconds\n`
  spec += `- **Entry point:** Hero section with headline${heroHeadline ? ` "${heroHeadline}"` : ''}\n`
  spec += `- **Journey:** Hero → ${hasNumbers ? 'Stats (reviews key metrics) → ' : ''}${hasPricing ? 'Pricing (compares pricing tiers) → ' : ''}${hasTestimonials ? 'Testimonials (reads social proof) → ' : ''}CTA\n`
  spec += `- **Success metric:** Clicks primary CTA${ctaText ? ` ("${ctaText}")` : ''}\n\n`

  spec += `### Returning Visitor\n`
  spec += `- **Goal:** Find specific information or take action\n`
  spec += `- **Entry point:** Navigation bar or direct link\n`
  spec += `- **Journey:** Nav → ${hasPricing ? 'Pricing (compares plans)' : 'Specific section'} → Action\n`
  spec += `- **Success metric:** Completes conversion or finds needed info\n\n`

  // Success criteria
  spec += `## 6. Success Criteria\n\n`
  spec += `1. **First impression (< 3s):** Visitor understands the value proposition from the hero headline\n`
  spec += `2. **Visual quality:** Site looks like a funded startup product, not a template\n`
  spec += `3. **Mobile responsive:** All ${enabled.length} sections render correctly at 375px\n`
  spec += `4. **Accessibility:** WCAG 2.1 AA contrast ratios on all text\n`
  spec += `5. **Performance:** Initial paint < 2 seconds on 4G connection\n`

  return spec
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
