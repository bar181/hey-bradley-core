/**
 * Canned chat command parser for simulated Bradley AI.
 * Matches user text to predefined actions that modify the site config.
 */

export interface ChatResult {
  response: string
  action: string | null
}

const SECTION_ALIASES: Record<string, string> = {
  hero: 'hero',
  features: 'features',
  feature: 'features',
  pricing: 'pricing',
  price: 'pricing',
  cta: 'cta',
  'call to action': 'cta',
  testimonials: 'testimonials',
  testimonial: 'testimonials',
  faq: 'faq',
  faqs: 'faq',
  'value props': 'value_props',
  'value prop': 'value_props',
  values: 'value_props',
  footer: 'footer',
  navbar: 'navbar',
  nav: 'navbar',
}

const THEME_ALIASES: Record<string, string> = {
  saas: 'saas',
  agency: 'agency',
  portfolio: 'portfolio',
  blog: 'blog',
  startup: 'startup',
  personal: 'personal',
  professional: 'professional',
  wellness: 'wellness',
  creative: 'creative',
  minimalist: 'minimalist',
}

function matchSection(text: string): string | null {
  const lower = text.toLowerCase().trim()
  for (const [alias, type] of Object.entries(SECTION_ALIASES)) {
    if (lower === alias || lower.endsWith(alias)) return type
  }
  return null
}

function matchTheme(text: string): string | null {
  const lower = text.toLowerCase().trim()
  return THEME_ALIASES[lower] ?? null
}

export function parseChatCommand(input: string): ChatResult {
  const trimmed = input.trim()
  const lower = trimmed.toLowerCase()

  // Dark mode
  if (lower === 'dark' || lower === 'dark mode' || lower === 'make it dark' || lower === 'go dark') {
    return { response: 'Switching to dark mode...', action: 'toggleMode:dark' }
  }

  // Light mode
  if (lower === 'light' || lower === 'light mode' || lower === 'make it light' || lower === 'go light') {
    return { response: 'Switching to light mode...', action: 'toggleMode:light' }
  }

  // Add section
  const addMatch = lower.match(/^add\s+(.+)/)
  if (addMatch) {
    const section = matchSection(addMatch[1])
    if (section) {
      return { response: `Adding ${section} section...`, action: `addSection:${section}` }
    }
  }

  // Remove section
  const removeMatch = lower.match(/^(?:remove|hide|disable)\s+(.+)/)
  if (removeMatch) {
    const section = matchSection(removeMatch[1])
    if (section) {
      return { response: `Removing ${section} section...`, action: `removeSection:${section}` }
    }
  }

  // Headline change
  const headlineMatch = trimmed.match(/^(?:headline|change headline to|set headline)\s+(.+)/i)
  if (headlineMatch) {
    const text = headlineMatch[1]
    return { response: `Updated headline to "${text}"`, action: `headline:${text}` }
  }

  // Theme change
  const themeMatch = lower.match(/^(?:theme|use|switch to|apply)\s+(.+?)(?:\s+theme)?$/)
  if (themeMatch) {
    const theme = matchTheme(themeMatch[1])
    if (theme) {
      return { response: `Applying ${theme} theme...`, action: `applyVibe:${theme}` }
    }
  }

  // Fallback
  return {
    response: `I understood: "${trimmed}". Try: "dark mode", "add testimonials", or "headline Your New Title"`,
    action: null,
  }
}
