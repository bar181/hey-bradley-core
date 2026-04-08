/**
 * Canned chat command parser for simulated Bradley AI.
 * Matches user text to predefined actions that modify the site config.
 * Supports single commands, natural-language aliases, and multi-part requests.
 */

export interface ChatResult {
  response: string
  action: string | null
}

export interface MultiChatResult {
  response: string
  actions: Array<{ action: string; label: string }>
}

const SECTION_ALIASES: Record<string, string> = {
  hero: 'hero',
  columns: 'columns',
  features: 'columns',
  feature: 'columns',
  pricing: 'pricing',
  price: 'pricing',
  action: 'action',
  cta: 'action',
  'call to action': 'action',
  quotes: 'quotes',
  testimonials: 'quotes',
  testimonial: 'quotes',
  questions: 'questions',
  faq: 'questions',
  faqs: 'questions',
  numbers: 'numbers',
  stats: 'numbers',
  statistics: 'numbers',
  'value props': 'numbers',
  'value prop': 'numbers',
  values: 'numbers',
  gallery: 'gallery',
  photos: 'gallery',
  images: 'gallery',
  team: 'team',
  'team section': 'team',
  footer: 'footer',
  menu: 'menu',
  navbar: 'menu',
  nav: 'menu',
}

const THEME_ALIASES: Record<string, string> = {
  saas: 'saas',
  agency: 'agency',
  portfolio: 'portfolio',
  startup: 'startup',
  personal: 'personal',
  professional: 'professional',
  wellness: 'wellness',
  minimalist: 'minimalist',
  creative: 'creative',
  blog: 'blog',
}

/** Natural-language theme triggers — phrases that map to a theme */
const THEME_PHRASES: Array<{ patterns: string[]; theme: string }> = [
  { patterns: ['blue theme', 'change colors to blue', 'blue color'], theme: 'saas' },
  { patterns: ['green theme', 'change colors to green', 'green color', 'green'], theme: 'wellness' },
  { patterns: ['make it professional', 'professional look', 'corporate'], theme: 'professional' },
  { patterns: ['make it bold', 'bold', 'creative', 'make it creative', 'expressive'], theme: 'creative' },
  { patterns: ['make it minimal', 'minimal', 'clean', 'make it clean', 'simple'], theme: 'minimalist' },
]

/** Section keywords used for multi-part parsing */
const SECTION_KEYWORDS: Array<{ keywords: string[]; type: string; label: string }> = [
  { keywords: ['pricing', 'price', 'prices', 'plans'], type: 'pricing', label: 'pricing' },
  { keywords: ['testimonials', 'testimonial', 'quotes', 'reviews'], type: 'quotes', label: 'testimonials' },
  { keywords: ['faq', 'faqs', 'questions', 'q&a'], type: 'questions', label: 'FAQ' },
  { keywords: ['stats', 'statistics', 'numbers', 'metrics'], type: 'numbers', label: 'stats' },
  { keywords: ['gallery', 'photos', 'images', 'portfolio gallery'], type: 'gallery', label: 'gallery' },
  { keywords: ['team', 'team section', 'our team', 'about team'], type: 'team', label: 'team' },
  { keywords: ['features', 'feature', 'columns'], type: 'columns', label: 'features' },
]

/** Theme keywords used for multi-part parsing */
const THEME_KEYWORDS: Array<{ keywords: string[]; theme: string; label: string }> = [
  { keywords: ['saas', 'software', 'tech'], theme: 'saas', label: 'SaaS theme' },
  { keywords: ['agency'], theme: 'agency', label: 'agency theme' },
  { keywords: ['portfolio'], theme: 'portfolio', label: 'portfolio theme' },
  { keywords: ['startup'], theme: 'startup', label: 'startup theme' },
  { keywords: ['wellness', 'health', 'spa', 'yoga'], theme: 'wellness', label: 'wellness theme' },
  { keywords: ['professional', 'corporate', 'business'], theme: 'professional', label: 'professional theme' },
  { keywords: ['minimalist', 'minimal', 'clean'], theme: 'minimalist', label: 'minimalist theme' },
  { keywords: ['creative', 'bold', 'expressive'], theme: 'creative', label: 'creative theme' },
  { keywords: ['personal', 'blog'], theme: 'personal', label: 'personal theme' },
]

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

/**
 * Parse a multi-part natural language request.
 * Returns null if input does not look like a multi-part request.
 */
export function parseMultiPartCommand(input: string): MultiChatResult | null {
  const lower = input.toLowerCase().trim()

  // Only trigger multi-part parsing for longer, sentence-like inputs
  const hasConjunction = /\b(with|and|,|\+)\b/.test(lower)
  const wordCount = lower.split(/\s+/).length
  if (!hasConjunction || wordCount < 5) return null

  const actions: Array<{ action: string; label: string }> = []
  const labels: string[] = []

  // Detect theme from the input
  let themeDetected = false
  for (const tk of THEME_KEYWORDS) {
    for (const kw of tk.keywords) {
      if (lower.includes(kw) && !themeDetected) {
        actions.push({ action: `applyVibe:${tk.theme}`, label: tk.label })
        labels.push(`Applying ${tk.label}`)
        themeDetected = true
        break
      }
    }
    if (themeDetected) break
  }

  // Detect sections from the input
  for (const sk of SECTION_KEYWORDS) {
    for (const kw of sk.keywords) {
      if (lower.includes(kw)) {
        actions.push({ action: `addSection:${sk.type}`, label: sk.label })
        labels.push(`Adding ${sk.label}`)
        break
      }
    }
  }

  // Detect dark/light mode
  if (/\bdark\b/.test(lower)) {
    actions.push({ action: 'toggleMode:dark', label: 'dark mode' })
    labels.push('Switching to dark mode')
  } else if (/\blight\b/.test(lower)) {
    actions.push({ action: 'toggleMode:light', label: 'light mode' })
    labels.push('Switching to light mode')
  }

  // Only return multi-part result if we matched 2+ actions
  if (actions.length < 2) return null

  const typePart = themeDetected
    ? `Setting up your ${actions[0].label.replace(' theme', '')} landing page`
    : 'Building your page'
  const steps = labels.map((l) => `${l}...`).join(' ')
  const response = `${typePart}... ${steps} Done!`

  return { response, actions }
}

/**
 * Compound commands that make multiple config changes at once.
 * Checked before single-command parsing so they take priority.
 */
const COMPOUND_COMMANDS: Array<{
  patterns: string[]
  response: string
  actions: string[]
}> = [
  {
    patterns: ['make this brighter', 'make it brighter', 'brighten it', 'brighter'],
    response: 'Brightening up! Switched to light mode with a clean, fresh look.',
    actions: ['toggleMode:light'],
  },
  {
    patterns: ['add pricing section', 'add a pricing section', 'add pricing page'],
    response: 'Added pricing section and updated your hero CTA to reference plans.',
    actions: ['addSection:pricing', 'heroCta:View Plans'],
  },
  {
    patterns: ['build me a bakery website', 'bakery website', 'make a bakery site'],
    response: 'Building a cozy bakery site with warm tones, gallery, and testimonials!',
    actions: ['applyVibe:wellness', 'toggleMode:light', 'addSection:gallery', 'addSection:quotes'],
  },
  {
    patterns: ['create a saas landing page', 'saas landing page', 'make a saas page'],
    response: 'Setting up a SaaS landing page with dark mode, pricing, and stats!',
    actions: ['applyVibe:saas', 'toggleMode:dark', 'addSection:pricing', 'addSection:numbers'],
  },
  {
    patterns: ['make a photography portfolio', 'photography portfolio', 'photo portfolio'],
    response: 'Creating a dramatic portfolio with gallery and dark theme!',
    actions: ['applyVibe:portfolio', 'toggleMode:dark', 'addSection:gallery', 'addSection:team'],
  },
  {
    patterns: ['build a harvard capstone research site', 'capstone research site', 'harvard capstone', 'build a research site', 'research site'],
    response: 'Building a Harvard capstone research site — dark crimson theme with blog, gallery, stats, and storytelling sections!',
    actions: ['loadExample:Hey Bradley — Capstone'],
  },
]

export function parseChatCommand(input: string): ChatResult {
  const trimmed = input.trim()
  const lower = trimmed.toLowerCase()

  // Compound commands — multi-property changes
  for (const cmd of COMPOUND_COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (lower === pattern) {
        return {
          response: cmd.response,
          action: `compound:${cmd.actions.join('|')}`,
        }
      }
    }
  }

  // Dark mode — expanded triggers
  if (
    lower === 'dark' ||
    lower === 'dark mode' ||
    lower === 'make it dark' ||
    lower === 'go dark' ||
    lower === 'show me a dark theme'
  ) {
    return { response: 'going dark', action: 'toggleMode:dark' }
  }

  // Light mode — expanded triggers
  if (
    lower === 'light' ||
    lower === 'light mode' ||
    lower === 'make it light' ||
    lower === 'go light' ||
    lower === 'show me a light theme'
  ) {
    return { response: 'switching to light', action: 'toggleMode:light' }
  }

  // Tone commands
  if (lower === 'make it professional' || lower === 'professional tone') {
    return {
      response: 'Got it! Set tone to formal. Your specs will now use professional language.',
      action: 'setContext:tone:formal',
    }
  }
  if (
    lower === 'set tone to playful' ||
    lower === 'make it fun' ||
    lower === 'playful' ||
    lower === 'playful tone'
  ) {
    return {
      response: 'Got it! Set tone to playful. Your specs will now use fun, upbeat language.',
      action: 'setContext:tone:playful',
    }
  }
  if (lower === 'casual tone' || lower === 'make it casual') {
    return {
      response: 'Got it! Set tone to casual. Your specs will now use relaxed, friendly language.',
      action: 'setContext:tone:casual',
    }
  }

  // Audience commands
  if (lower === 'target developers' || lower === 'for developers') {
    return {
      response: 'Got it! Targeting developer audience. Your specs will reflect technical users.',
      action: 'setContext:audience:developer',
    }
  }
  if (
    lower === 'this is for enterprise' ||
    lower === 'enterprise' ||
    lower === 'enterprise audience'
  ) {
    return {
      response: 'Got it! Targeting enterprise audience. Your specs will reflect business decision-makers.',
      action: 'setContext:audience:enterprise',
    }
  }

  // Natural-language theme phrases (e.g. "change colors to blue")
  for (const tp of THEME_PHRASES) {
    for (const pattern of tp.patterns) {
      if (lower === pattern || lower === `${pattern} theme`) {
        return {
          response: `applying ${tp.theme} theme`,
          action: `applyVibe:${tp.theme}`,
        }
      }
    }
  }

  // Bare section name (e.g. "pricing", "testimonials", "faq", "gallery")
  const bareSection = matchSection(lower)
  if (bareSection) {
    return { response: `added ${bareSection}`, action: `addSection:${bareSection}` }
  }

  // Add section (e.g. "add pricing", "add a gallery")
  const addMatch = lower.match(/^add\s+(?:a\s+)?(.+)/)
  if (addMatch) {
    const section = matchSection(addMatch[1])
    if (section) {
      return { response: `added ${section}`, action: `addSection:${section}` }
    }
  }

  // Section-specific phrases (e.g. "team section", "pricing section")
  const sectionPhraseMatch = lower.match(/^(.+?)\s+section$/)
  if (sectionPhraseMatch) {
    const section = matchSection(sectionPhraseMatch[1])
    if (section) {
      return { response: `added ${section}`, action: `addSection:${section}` }
    }
  }

  // Remove section
  const removeMatch = lower.match(/^(?:remove|hide|disable)\s+(.+)/)
  if (removeMatch) {
    const section = matchSection(removeMatch[1])
    if (section) {
      return { response: `removed ${section}`, action: `removeSection:${section}` }
    }
  }

  // Headline change
  const headlineMatch = trimmed.match(/^(?:headline|change headline to|set headline)\s+(.+)/i)
  if (headlineMatch) {
    const text = headlineMatch[1]
    return { response: 'updated headline', action: `headline:${text}` }
  }

  // Theme change (e.g. "theme saas", "switch to portfolio")
  const themeMatch = lower.match(/^(?:theme|use|switch to|apply)\s+(.+?)(?:\s+theme)?$/)
  if (themeMatch) {
    const theme = matchTheme(themeMatch[1])
    if (theme) {
      return { response: `applying ${theme} theme`, action: `applyVibe:${theme}` }
    }
  }

  // Bare theme name (e.g. just "saas" or "portfolio")
  const bareTheme = matchTheme(lower)
  if (bareTheme) {
    return { response: `applying ${bareTheme} theme`, action: `applyVibe:${bareTheme}` }
  }

  // Fallback
  return {
    response: 'hmm, try "dark mode", "add pricing", or "headline Hello"',
    action: null,
  }
}

/** Predefined simulated-requirement presets */
export interface SimulatedRequirement {
  name: string
  description: string
  actions: Array<{ action: string; label: string }>
}

export const SIMULATED_REQUIREMENTS: SimulatedRequirement[] = [
  {
    name: 'SaaS Startup',
    description: 'SaaS theme + dark + pricing + testimonials + stats',
    actions: [
      { action: 'applyVibe:saas', label: 'SaaS theme' },
      { action: 'toggleMode:dark', label: 'dark mode' },
      { action: 'addSection:pricing', label: 'pricing' },
      { action: 'addSection:quotes', label: 'testimonials' },
      { action: 'addSection:numbers', label: 'stats' },
    ],
  },
  {
    name: 'Local Business',
    description: 'Wellness theme + light + gallery + testimonials + FAQ',
    actions: [
      { action: 'applyVibe:wellness', label: 'wellness theme' },
      { action: 'toggleMode:light', label: 'light mode' },
      { action: 'addSection:gallery', label: 'gallery' },
      { action: 'addSection:quotes', label: 'testimonials' },
      { action: 'addSection:questions', label: 'FAQ' },
    ],
  },
  {
    name: 'Portfolio',
    description: 'Portfolio theme + dark + gallery + team',
    actions: [
      { action: 'applyVibe:portfolio', label: 'portfolio theme' },
      { action: 'toggleMode:dark', label: 'dark mode' },
      { action: 'addSection:gallery', label: 'gallery' },
      { action: 'addSection:team', label: 'team' },
    ],
  },
]
